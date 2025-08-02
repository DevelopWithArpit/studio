'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
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
import { FileText, Loader2, UploadCloud } from 'lucide-react';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  existingReportDataUri: z.string().min(1, 'Please upload the existing report.'),
  newDocumentDataUri: z.string().min(1, 'Please upload the new document to analyze.'),
  companyName: z.string().min(1, "Please enter the company name."),
  instructions: z.string().min(10, "Please provide at least 10 characters of instructions."),
});

type FormData = z.infer<typeof formSchema>;

const FileUploadField = ({ name, label, fileName, onFileChange }: { name: keyof FormData, label: string, fileName: string | null, onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
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
                <p className="text-xs text-muted-foreground">PDF, DOCX, TXT</p>
            </>
            )}
            <Input id={name} type="file" className="sr-only" onChange={onFileChange} accept=".pdf,.doc,.docx,.txt" />
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
      existingReportDataUri: string | null,
      newDocumentDataUri: string | null,
  }>({
      existingReportDataUri: null,
      newDocumentDataUri: null,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      existingReportDataUri: '',
      newDocumentDataUri: '',
      companyName: '',
      instructions: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof typeof fileNames) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { 
        toast({ variant: "destructive", title: "File too large", description: "Please upload a document smaller than 4MB."});
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        form.setValue(fieldName, dataUri, { shouldValidate: true });
        setFileNames(prev => ({...prev, [fieldName]: file.name}));
      };
      reader.readAsDataURL(file);
    }
  };

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

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">SIP Report Editor</h1>
        <p className="text-muted-foreground">
          Upload an existing report and a new document, then provide instructions to edit it.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Edit Your Report</CardTitle>
          <CardDescription>
            The AI will analyze both documents and apply your requested changes.
          </CardDescription>
        </CardHeader>
        <CardContent>
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FileUploadField name="existingReportDataUri" label="Existing SIP Report" fileName={fileNames.existingReportDataUri} onFileChange={(e) => handleFileChange(e, 'existingReportDataUri')} />
                        <FileUploadField name="newDocumentDataUri" label="New Document to Analyze" fileName={fileNames.newDocumentDataUri} onFileChange={(e) => handleFileChange(e, 'newDocumentDataUri')} />
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
        </Card>
      )}
    </div>
  );
}
