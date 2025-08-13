
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { renderToStaticMarkup } from 'react-dom/server';
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { handleGetResumeFeedbackAction } from '@/app/actions';
import type { GetResumeFeedbackOutput } from '@/ai/flows/resume-feedback-tool';
import { FileText, UploadCloud, Download, FileCode, Loader2 } from 'lucide-react';
import { ResumeTemplate } from '@/components/resume-template';

const formSchema = z.object({
  resume: z.string().min(1, 'Please upload or paste your resume.'),
  targetJobRole: z.string().optional(),
  additionalInfo: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ResumeFeedbackTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingHtml, setIsGeneratingHtml] = useState(false);
  const [result, setResult] = useState<GetResumeFeedbackOutput | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resume: '',
      targetJobRole: '',
      additionalInfo: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please upload a document smaller than 10MB.',
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        form.setValue('resume', dataUri);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: FormData) {
    if (!data.resume) {
      form.setError('resume', {
        type: 'manual',
        message: 'Please upload or paste your resume.',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    const response = await handleGetResumeFeedbackAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Analyzing Resume',
        description: response.error,
      });
    }
  }
  
  const getResumeHtml = (resumeData: GetResumeFeedbackOutput['rewrittenResume']): string => {
    const staticMarkup = renderToStaticMarkup(<ResumeTemplate resumeData={resumeData} />);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Resume</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body style="width: 816px; margin: 0 auto; background: white;">
  ${staticMarkup}
</body>
</html>`;
  };

  const handleDownloadPdf = async () => {
    if (!result?.rewrittenResume) return;

    setIsGeneratingPdf(true);
    const resumeContainer = document.getElementById('resume-container-for-pdf');
    if (!resumeContainer) {
      setIsGeneratingPdf(false);
      return;
    };

    try {
        const canvas = await html2canvas(resumeContainer, { scale: 3, useCORS: true, });
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF({ orientation: 'p', unit: 'px', format: 'a4'});
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('resume.pdf');
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error Generating PDF', description: error instanceof Error ? error.message : 'An unknown error occurred.' });
      } finally {
        setIsGeneratingPdf(false);
      }
  };

  const handleDownloadHtml = async () => {
    if (!result?.rewrittenResume) return;
    setIsGeneratingHtml(true);
    const htmlContent = getResumeHtml(result.rewrittenResume);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    saveAs(blob, 'resume.html');
    setIsGeneratingHtml(false);
  };


  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Resume Feedback Tool</h1>
        <p className="text-muted-foreground">
          Get AI feedback on your resume, then download it in multiple formats.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Analyze Your Resume</CardTitle>
          <CardDescription>
            Upload or paste your resume, then provide some optional context about
            your job search.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="paste">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="paste">Paste Text</TabsTrigger>
                  <TabsTrigger value="upload">Upload File</TabsTrigger>
                </TabsList>
                <TabsContent value="paste" className="mt-4">
                  <FormField
                    control={form.control}
                    name="resume"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Paste your resume content here</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Paste your resume here..."
                            rows={15}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setFileName(null);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="upload" className="mt-4">
                  <FormItem>
                    <FormLabel>Upload Document</FormLabel>
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
                    <FormMessage>
                      {form.formState.errors.resume?.message}
                    </FormMessage>
                  </FormItem>
                </TabsContent>
              </Tabs>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="targetJobRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Job Role (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Software Engineer"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="additionalInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Info (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., transitioning from another industry"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : 'Get Feedback'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Hidden container for PDF generation */}
      {result?.rewrittenResume &&
        <div id="resume-container-for-pdf" style={{ position: 'absolute', left: '-9999px', top: 0, width: '816px', background: 'white' }}>
            <ResumeTemplate resumeData={result.rewrittenResume} />
        </div>
      }

      {(isLoading || result) && (
        <Card>
          <CardHeader>
            <CardTitle>Your Resume Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="feedback">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
                <TabsTrigger value="rewritten">Rewritten Resume</TabsTrigger>
              </TabsList>
              <TabsContent value="feedback" className="mt-4">
                {isLoading ? (
                  <div className="space-y-4 pt-4">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/4 mt-4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                ) : (
                  result && (
                    <div
                      className="prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: result.feedback.replace(/\\n/g, '<br />'),
                      }}
                    />
                  )
                )}
              </TabsContent>
              <TabsContent value="rewritten" className="mt-4">
                {isLoading ? (
                  <div className="border rounded-lg"><Skeleton className="h-[700px] w-full" /></div>
                ) : (
                  result?.rewrittenResume && (
                    <div className="space-y-4">
                       <div className="border rounded-lg bg-gray-100 p-4 max-h-[700px] overflow-y-auto">
                          <div className="scale-[0.9] origin-top-left">
                            <ResumeTemplate resumeData={result.rewrittenResume} />
                          </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                         <Button
                          onClick={handleDownloadPdf}
                          disabled={isGeneratingPdf || isGeneratingHtml}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          {isGeneratingPdf
                            ? 'Generating PDF...'
                            : 'Download as PDF'}
                        </Button>
                         <Button
                          onClick={handleDownloadHtml}
                          disabled={isGeneratingPdf || isGeneratingHtml}
                          variant="secondary"
                        >
                          <FileCode className="mr-2 h-4 w-4" />
                          {isGeneratingHtml
                            ? 'Generating HTML...'
                            : 'Download as HTML'}
                        </Button>
                      </div>
                    </div>
                  )
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

    