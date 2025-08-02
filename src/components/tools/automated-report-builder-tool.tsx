
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
import { handleBuildAutomatedReportAction } from '@/app/actions';
import type { BuildAutomatedReportOutput } from '@/ai/flows/automated-report-builder-tool';
import { Download, FileText, Loader2, UploadCloud } from 'lucide-react';
import { Label } from '../ui/label';

const formSchema = z.object({
  companyName: z.string().min(1, "Please enter the company name."),
  certificateDataUri: z.string().min(1, 'Please upload the certificate file.'),
  feedbackFormDataUri: z.string().min(1, 'Please upload the feedback form.'),
  reportFormatDataUri: z.string().min(1, 'Please upload the report format file.'),
});

type FormData = z.infer<typeof formSchema>;

const FileUploadField = ({ name, label, fileName, onFileChange, accept }: { name: keyof FormData, label: string, fileName: string | null, onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void, accept?: string }) => (
    <FormItem>
        <Label>{label}</Label>
        <FormControl>
        <div className="relative mt-2 border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center h-48">
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
                <p className="text-xs text-muted-foreground">PDF, DOCX, TXT, JPG up to 4MB</p>
            </>
            )}
            <Input id={name} type="file" className="sr-only" onChange={onFileChange} accept={accept || ".pdf,.doc,.docx,.txt"} />
        </div>
        </FormControl>
        <FormMessage />
    </FormItem>
);

export default function AutomatedReportBuilderTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BuildAutomatedReportOutput | null>(null);
  const { toast } = useToast();
  
  const [fileNames, setFileNames] = useState<{
      certificateDataUri: string | null,
      feedbackFormDataUri: string | null,
      reportFormatDataUri: string | null,
  }>({
      certificateDataUri: null,
      feedbackFormDataUri: null,
      reportFormatDataUri: null,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        companyName: '',
        certificateDataUri: '',
        feedbackFormDataUri: '',
        reportFormatDataUri: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof FormData) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit for Genkit
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
    const response = await handleBuildAutomatedReportAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
      toast({ title: 'Report Generated', description: 'Your automated report has been created successfully.' });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error generating report',
        description: response.error,
      });
    }
  }

  const handleDownloadPdf = () => {
    if (!result) return;
    
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const margin = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    const usableWidth = pageWidth - 2 * margin;
    let y = margin;

    const addText = (text: string, options: any) => {
        const lines = doc.splitTextToSize(text, usableWidth);
        const textHeight = doc.getTextDimensions(lines).h;
        if (y + textHeight > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            y = margin;
        }
        doc.text(lines, margin, y, options);
        y += textHeight + (options.mb || 5);
    }

    doc.setFont('times', 'normal');

    // Title
    doc.setFontSize(22).setFont(undefined, 'bold');
    addText(result.title, { align: 'center', mb: 20 });
    
    // Executive Summary
    doc.setFontSize(16).setFont(undefined, 'bold');
    addText('Executive Summary', { mb: 10 });
    doc.setFontSize(12).setFont(undefined, 'normal');
    addText(result.executiveSummary, { mb: 15 });

    // Sections
    result.sections.forEach(section => {
        const content = section.content.replace(/(\r\n|\n|\r)/gm, " ").replace(/(\*+)/g, '');
        doc.setFontSize(16).setFont(undefined, 'bold');
        addText(section.title, { mb: 10 });
        doc.setFontSize(12).setFont(undefined, 'normal');
        addText(content, { mb: 15 });
    });

    doc.save(`${result.title.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Automated Report Builder</h1>
        <p className="text-muted-foreground">
          Upload your documents, provide a company name, and let AI build your SIP report automatically.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Build Your Report</CardTitle>
          <CardDescription>
            The AI will analyze your documents and perform web research to generate a complete report.
          </CardDescription>
        </CardHeader>
        <CardContent>
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField control={form.control} name="companyName" render={({ field }) => ( 
                    <FormItem> 
                        <FormLabel>Company Name</FormLabel> 
                        <FormControl><Input placeholder="e.g., Google, Microsoft..." {...field} /></FormControl> 
                        <FormMessage /> 
                    </FormItem> 
                  )}/>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FileUploadField name="certificateDataUri" label="Internship Certificate" fileName={fileNames.certificateDataUri} onFileChange={(e) => handleFileChange(e, 'certificateDataUri')} accept=".pdf,.doc,.docx,.txt,.jpeg,.jpg" />
                      <FileUploadField name="feedbackFormDataUri" label="Intern Feedback Form" fileName={fileNames.feedbackFormDataUri} onFileChange={(e) => handleFileChange(e, 'feedbackFormDataUri')} accept=".pdf,.doc,.docx,.txt,.jpeg,.jpg" />
                      <FileUploadField name="reportFormatDataUri" label="Report Format" fileName={fileNames.reportFormatDataUri} onFileChange={(e) => handleFileChange(e, 'reportFormatDataUri')} />
                  </div>
                  
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Building Report...</> : 'Build Report'}
                  </Button>
                </form>
              </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Building Report...</CardTitle>
            <CardDescription>The AI is analyzing your documents and researching online. This may take a few moments.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
            <Skeleton className="h-6 w-1/2" />
             <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>{result.title}</CardTitle>
            <CardDescription>Your generated report is ready. Review the content below.</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-6">
            <div>
                <h2 className='text-xl font-bold'>Executive Summary</h2>
                <p className="whitespace-pre-wrap">{result.executiveSummary}</p>
            </div>
            {result.sections.map((section, index) => (
                <div key={index}>
                    <h2 className='text-xl font-bold'>{section.title}</h2>
                    <p className="whitespace-pre-wrap">{section.content}</p>
                </div>
            ))}
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
