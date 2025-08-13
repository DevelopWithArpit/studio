
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
import { handleGenerateAcademicDocumentAction } from '@/app/actions';
import type { GenerateAcademicDocumentOutput } from '@/ai/flows/thesis-generator-tool';
import { Download, FileText, Loader2, UploadCloud } from 'lucide-react';

const formSchema = z.object({
  documentDataUri: z.string().min(1, 'Please upload a document.'),
});

type FormData = z.infer<typeof formSchema>;

export default function AcademicWriterTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateAcademicDocumentOutput | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentDataUri: '',
    },
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload a document smaller than 10MB."});
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        form.setValue('documentDataUri', dataUri);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };


  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleGenerateAcademicDocumentAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
      toast({ title: 'Document Generated', description: 'Your academic document has been created successfully.' });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error generating document',
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

    const addText = (text: string, options: any) => {
        const lines = doc.splitTextToSize(text, usableWidth);
        const textHeight = doc.getTextDimensions(lines).h;
        if (y + textHeight > pageHeight - margin) {
            doc.addPage();
            y = margin;
        }
        doc.text(lines, margin, y, options);
        y += textHeight + 5;
    }

    // Title
    doc.setFontSize(22).setFont('helvetica', 'bold');
    addText(result.title, { align: 'center' });
    y += 10;
    
    // Introduction
    doc.setFontSize(16).setFont('helvetica', 'bold');
    addText('Introduction', {});
    doc.setFontSize(12).setFont('helvetica', 'normal');
    addText(result.introduction.replace(/###|##|#/g, ''), {}); // Simple markdown removal
    y += 5;

    // Chapters
    result.chapters.forEach(chapter => {
        doc.setFontSize(16).setFont('helvetica', 'bold');
        addText(chapter.title, {});
        doc.setFontSize(12).setFont('helvetica', 'normal');
        addText(chapter.content.replace(/###|##|#/g, ''), {});
        y += 5;
    });

    // Conclusion
    doc.setFontSize(16).setFont('helvetica', 'bold');
    addText('Conclusion', {});
    doc.setFontSize(12).setFont('helvetica', 'normal');
    addText(result.conclusion.replace(/###|##|#/g, ''), {});

    doc.save(`${result.title.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Academic Writer</h1>
        <p className="text-muted-foreground">
          Generate a structured academic document (e.g., Thesis, SIP Report) from your outline and research notes.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Generate Document</CardTitle>
          <CardDescription>
            Upload a document containing your structure, topic, and research notes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
               <FormField
                control={form.control}
                name="documentDataUri"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Outline & Notes</FormLabel>
                     <FormControl>
                      <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center h-48">
                        {fileName ? (
                          <div className="flex flex-col items-center gap-2">
                            <FileText className="w-12 h-12 text-primary" />
                            <p className="text-sm font-medium">{fileName}</p>
                            <Button
                              variant="link"
                              size="sm"
                              asChild
                              className="p-0 h-auto"
                            >
                              <label
                                htmlFor="file-upload"
                                className="cursor-pointer"
                              >
                                Change file
                              </label>
                            </Button>
                          </div>
                        ) : (
                          <>
                            <UploadCloud className="w-12 h-12 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">
                              <label
                                htmlFor="file-upload"
                                className="font-semibold text-primary cursor-pointer hover:underline"
                              >
                                Click to upload
                              </label>{' '}
                              or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PDF, DOCX, TXT up to 10MB
                            </p>
                          </>
                        )}
                        <Input
                          id="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.txt"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : 'Generate Document'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Generating Document Content...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
            <Skeleton className="h-6 w-1/2" />
             <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>{result.title}</CardTitle>
            <CardDescription>Your generated document is ready. Review the content below.</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-6">
            <div>
                <h2 className='text-xl font-bold'>Introduction</h2>
                <div dangerouslySetInnerHTML={{ __html: result.introduction.replace(/\n/g, '<br />') }} />
            </div>
            {result.chapters.map((chapter, index) => (
                <div key={index}>
                    <h2 className='text-xl font-bold'>{chapter.title}</h2>
                    <div dangerouslySetInnerHTML={{ __html: chapter.content.replace(/\n/g, '<br />') }} />
                </div>
            ))}
             <div>
                <h2 className='text-xl font-bold'>Conclusion</h2>
                <div dangerouslySetInnerHTML={{ __html: result.conclusion.replace(/\n/g, '<br />') }} />
            </div>
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
