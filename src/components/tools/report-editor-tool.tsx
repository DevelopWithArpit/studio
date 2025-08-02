
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import jsPDF from 'jspdf';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleEditSipReportAction } from '@/app/actions';
import type { EditSipReportOutput } from '@/ai/flows/report-editor-tool';
import { Download, FileText, Loader2, UploadCloud, X } from 'lucide-react';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';

const formSchema = z.object({
  existingReportDataUri: z.string().min(1, 'Please upload the existing report.'),
  newDocumentsDataUris: z.array(z.string()).min(1, 'Please upload at least one new document to analyze.'),
  companyName: z.string().min(1, "Please enter the company name."),
  instructions: z.string().min(10, "Please provide at least 10 characters of instructions."),
});

type FormData = z.infer<typeof formSchema>;

const FileUploadField = ({ name, label, fileName, onFileChange, accept }: { name: keyof FormData, label: string, fileName: string | null, onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void, accept?: string }) => (
    <FormItem className="space-y-2">
        <Label>{label}</Label>
        <FormControl>
        <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center h-48">
            {fileName ? (
            <div className='flex flex-col items-center gap-2'>
                <FileText className="w-12 h-12 text-accent" />
                <p className='text-sm font-medium'>{fileName}</p>
                <Button variant="link" size="sm" asChild className='p-0 h-auto'>
                <label htmlFor={name} className="cursor-pointer">Change file</label>
                </Button>
            </div>
            ) : (
            <>
                <UploadCloud className="w-12 h-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                <label htmlFor={name} className="font-semibold text-accent cursor-pointer hover:underline">
                    Click to upload
                </label>
                </p>
                <p className="text-xs text-muted-foreground">{accept || "PDF, DOCX, TXT"}</p>
            </>
            )}
            <Input id={name} type="file" className="sr-only" onChange={onFileChange} accept={accept || ".pdf,.doc,.docx,.txt"} />
        </div>
        </FormControl>
        <FormMessage />
    </FormItem>
);

export default function ReportEditorTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EditSipReportOutput | null>(null);
  const { toast } = useToast();
  
  const [fileNames, setFileNames] = useState<{
      existingReport: string | null,
      newDocuments: { name: string; dataUri: string }[],
  }>({
      existingReport: null,
      newDocuments: [],
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      existingReportDataUri: '',
      newDocumentsDataUris: [],
      companyName: '',
      instructions: '',
    },
  });

  const handleExistingReportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { 
        toast({ variant: "destructive", title: "File too large", description: "Please upload a document smaller than 4MB."});
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        form.setValue('existingReportDataUri', dataUri, { shouldValidate: true });
        setFileNames(prev => ({...prev, existingReport: file.name}));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleNewDocumentsFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
        const newFiles = Array.from(files);
        let allFilesValid = true;
        const filePromises = newFiles.map(file => {
            if (file.size > 4 * 1024 * 1024) { 
                toast({ variant: "destructive", title: "File too large", description: `${file.name} is larger than 4MB.`});
                allFilesValid = false;
                return null;
            }
            return new Promise<{ name: string; dataUri: string }>((resolve) => {
                const reader = new FileReader();
                reader.onload = (loadEvent) => {
                    resolve({ name: file.name, dataUri: loadEvent.target?.result as string });
                };
                reader.readAsDataURL(file);
            });
        });

        if (!allFilesValid) return;

        Promise.all(filePromises.filter(p => p !== null) as Promise<{name: string, dataUri: string}>[]).then(loadedFiles => {
             const updatedFiles = [...fileNames.newDocuments, ...loadedFiles];
             setFileNames(prev => ({...prev, newDocuments: updatedFiles}));
             form.setValue('newDocumentsDataUris', updatedFiles.map(f => f.dataUri), { shouldValidate: true });
        })
    }
  };

  const removeNewDocument = (index: number) => {
    const updatedFiles = fileNames.newDocuments.filter((_, i) => i !== index);
    setFileNames(prev => ({ ...prev, newDocuments: updatedFiles }));
    form.setValue('newDocumentsDataUris', updatedFiles.map(f => f.dataUri), { shouldValidate: true });
  }

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleEditSipReportAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
      toast({ title: 'Report Edited', description: 'Your report has been successfully edited.' });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error editing report',
        description: response.error,
      });
    }
  }

  const handleDownloadPdf = () => {
    if (!result) return;
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const usableWidth = pageWidth - 2 * margin;
    let y = margin;

    const addTextWithWrap = (text: string, options: any) => {
      const lines = doc.splitTextToSize(text, usableWidth);
      const textHeight = doc.getTextDimensions(lines).h;
      
      if (y + textHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      
      doc.text(lines, margin, y, options);
      y += textHeight;
    };
    
    const lines = result.editedReportContent.split('\n');

    lines.forEach(line => {
      line = line.trim();
      if (line.startsWith('# ')) {
        doc.setFontSize(22).setFont(undefined, 'bold');
        addTextWithWrap(line.substring(2), {});
        y += 5; // Extra space after main heading
      } else if (line.startsWith('## ')) {
        doc.setFontSize(16).setFont(undefined, 'bold');
        addTextWithWrap(line.substring(3), {});
        y += 3; // Extra space after subheading
      } else if (line.startsWith('### ')) {
        doc.setFontSize(14).setFont(undefined, 'bold');
        addTextWithWrap(line.substring(4), {});
        y += 2;
      } else if (line.startsWith('* ') || line.startsWith('- ')) {
        doc.setFontSize(12).setFont(undefined, 'normal');
        addTextWithWrap(`• ${line.substring(2)}`, { indent: 5 });
        y += 2;
      } else if (line) { // It's a paragraph
        doc.setFontSize(12).setFont(undefined, 'normal');
        addTextWithWrap(line, {});
        y += 4; // Paragraph spacing
      } else { // Empty line
        y += 4;
      }
    });
    
    doc.save(`edited_report.pdf`);
    toast({ title: "Download Started", description: "Your edited report is downloading as a PDF." });
  };


  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">SIP Report Editor</h1>
        <p className="text-muted-foreground">
          Upload an existing report and new documents, then provide instructions to edit it.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Edit Your Report</CardTitle>
          <CardDescription>
            The AI will analyze all documents and apply your requested changes.
          </CardDescription>
        </CardHeader>
        <CardContent>
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FileUploadField name="existingReportDataUri" label="Existing SIP Report" fileName={fileNames.existingReport} onFileChange={handleExistingReportFileChange} accept=".pdf,.doc,.docx,.txt"/>
                        <FormItem className="space-y-2">
                            <Label>New Documents to Analyze</Label>
                            <FormControl>
                                <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center h-48">
                                    <UploadCloud className="w-12 h-12 text-muted-foreground" />
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        <label htmlFor="new-docs-upload" className="font-semibold text-accent cursor-pointer hover:underline">
                                            Click to upload files
                                        </label>
                                    </p>
                                    <p className="text-xs text-muted-foreground">PDF, DOCX, TXT, JPG, JPEG</p>
                                    <Input id="new-docs-upload" type="file" multiple className="sr-only" onChange={handleNewDocumentsFileChange} accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg" />
                                </div>
                            </FormControl>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {fileNames.newDocuments.map((file, index) => (
                                    <Badge key={index} variant="secondary" className="pl-3 pr-1 py-1">
                                        {file.name}
                                        <button onClick={() => removeNewDocument(index)} className="ml-1 rounded-full p-0.5 hover:bg-destructive/20 text-destructive"><X className="h-3 w-3" /></button>
                                    </Badge>
                                ))}
                            </div>
                            <FormMessage>{form.formState.errors.newDocumentsDataUris?.message}</FormMessage>
                        </FormItem>
                    </div>
                  
                    <FormField control={form.control} name="companyName" render={({ field }) => ( 
                        <FormItem> 
                            <FormLabel>Company Name</FormLabel> 
                            <FormControl><Input placeholder="e.g., Infinity Reach India Pvt Limited" {...field} /></FormControl> 
                            <FormMessage /> 
                        </FormItem> 
                    )}/>

                    <FormField control={form.control} name="instructions" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Editing Instructions</FormLabel>
                            <FormControl>
                                <Textarea
                                placeholder="e.g., 'Update the key learnings section with the points from the new document. Also, add a new paragraph in the conclusion about future scope.'"
                                {...field}
                                rows={5}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                  
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Editing Report...</> : 'Edit Report'}
                  </Button>
                </form>
              </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Editing Report...</CardTitle>
            <CardDescription>The AI is analyzing your documents and applying the edits. This may take a moment.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Edited Report</CardTitle>
            <CardDescription>Your edited report is ready. Review the content below.</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: result.editedReportContent.replace(/\n/g, '<br />') }} />
          </CardContent>
          <CardFooter>
            <Button onClick={handleDownloadPdf}>
              <Download className="mr-2 h-4 w-4" />
              Download as PDF
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
