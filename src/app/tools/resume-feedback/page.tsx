
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import dynamic from 'next/dynamic';
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
import { FileText, UploadCloud, Download, FileType, Loader2, FileCode } from 'lucide-react';
import { ResumeTemplate } from '@/components/resume-template';
import { renderToStaticMarkup } from 'react-dom/server';
import { ResumePdfDocument } from '@/components/resume-pdf-document';
import type { PDFDownloadLink } from '@react-pdf/renderer';

const formSchema = z.object({
  resume: z.string().min(1, 'Please upload or paste your resume.'),
  targetJobRole: z.string().optional(),
  additionalInfo: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;


const DynamicPdfDownloader = dynamic(
  () => import('@/components/pdf-downloader').then(mod => mod.PdfDownloader),
  {
    ssr: false,
    loading: () => <Button disabled><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating PDF...</Button>
  }
);


export default function ResumeFeedbackTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingDocx, setIsGeneratingDocx] = useState(false);
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
      if (file.size > 200 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please upload a document smaller than 200MB.',
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
  <title>Resume for ${resumeData.name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body>
  <div style="width: 816px; margin: auto;">
    ${staticMarkup}
  </div>
</body>
</html>`;
  };

  const handleDownloadHtml = async () => {
    if (!result?.rewrittenResume) return;
    setIsGeneratingHtml(true);
    const htmlContent = getResumeHtml(result.rewrittenResume);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    saveAs(blob, 'resume.html');
    setIsGeneratingHtml(false);
  };

  const handleDownloadDocx = async () => {
    if (!result?.rewrittenResume) return;
    setIsGeneratingDocx(true);
    const resume = result.rewrittenResume;
    
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: [
          new Paragraph({
            children: [new TextRun({ text: resume.name, bold: true, size: 48, font: "Inter" })],
            alignment: AlignmentType.LEFT,
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [new TextRun({ text: resume.title, size: 24, font: "Inter", color: "555555" })],
            spacing: { after: 200 }
          }),
           new Paragraph({
            children: [
                ...(resume.contact.phone ? [new TextRun({ text: `${resume.contact.phone} | `, size: 18, font: "Inter" })] : []),
                ...(resume.contact.email ? [new TextRun({ text: `${resume.contact.email} | `, size: 18, font: "Inter" })] : []),
                ...(resume.contact.linkedin ? [new TextRun({ text: `linkedin.com/in/...`, size: 18, font: "Inter", style: "Hyperlink" })] : []),
            ],
            spacing: { after: 300 }
        }),
          new Paragraph({ text: "Summary", heading: HeadingLevel.HEADING_1, spacing: { after: 150 } }),
          new Paragraph({ text: resume.summary, style: "normal" }),
          new Paragraph({ text: "Experience", heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 150 } }),
          ...resume.experience.flatMap(exp => [
            new Paragraph({
              children: [
                new TextRun({ text: exp.title, bold: true, size: 22 }),
                new TextRun({ text: `\t${exp.dates}`, size: 18, color: "888888" }),
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: exp.company, color: "4C8FFB", size: 20 }),
                new TextRun({ text: `\t${exp.location}`, size: 18, color: "888888" }),
              ],
               spacing: { after: 100 }
            }),
            ...exp.bullets.map(bullet => new Paragraph({ text: bullet, bullet: { level: 0 }, style: "normal" }))
          ]),
           new Paragraph({ text: "Education", heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 150 } }),
           ...resume.education.flatMap(edu => [
            new Paragraph({
              children: [
                new TextRun({ text: edu.degree, bold: true, size: 22 }),
                new TextRun({ text: `\t${edu.dates}`, size: 18, color: "888888" }),
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: edu.school, color: "4C8FFB", size: 20 }),
                 new TextRun({ text: `\t${edu.location}`, size: 18, color: "888888" }),
              ],
               spacing: { after: 100 }
            }),
          ]),
          new Paragraph({ text: "Projects", heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 150 } }),
           ...resume.projects.flatMap(proj => [
            new Paragraph({ text: proj.title, style: "projectTitle" }),
            new Paragraph({ text: proj.description, style: "normal" }),
            ...(proj.link ? [new Paragraph({ children: [new TextRun({text: proj.link, style: "Hyperlink"})], spacing: { after: 100 } })] : [new Paragraph({spacing: {after: 100}})]),
          ]),
          new Paragraph({ text: "Skills", heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 150 } }),
          new Paragraph({ text: resume.skills.join(', '), style: "normal" }),
        ],
      }],
      styles: {
        default: {
            heading1: {
                run: { size: 28, bold: true, color: "000000", font: "Inter" },
                paragraph: { spacing: { after: 200, before: 400 } },
            },
        },
        paragraphStyles: [{
            id: 'normal',
            name: 'Normal',
            basedOn: 'Normal',
            next: 'Normal',
            run: { size: 20, font: "Inter" },
            paragraph: { spacing: { after: 100, line: 360 } },
        },
        {
            id: 'projectTitle',
            name: 'Project Title',
            basedOn: 'Normal',
            next: 'Normal',
            run: { size: 22, bold: true },
        }
        ]
      }
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, 'resume.docx');
      toast({ title: "DOCX Downloaded", description: "Your resume has been saved as a .docx file." });
    }).catch(err => {
      toast({ variant: 'destructive', title: 'Error Generating DOCX', description: err.message });
    }).finally(() => {
      setIsGeneratingDocx(false);
    });
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
                              PDF, DOCX, TXT up to 200MB
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
                       <div className="border rounded-lg bg-gray-50 p-4 max-h-[700px] overflow-y-auto">
                           <ResumeTemplate resumeData={result.rewrittenResume} />
                      </div>
                      <div className="flex flex-wrap gap-2">
                         <DynamicPdfDownloader resumeData={result.rewrittenResume} />
                         <Button
                          onClick={handleDownloadHtml}
                          disabled={isGeneratingHtml || isGeneratingDocx}
                          variant="secondary"
                        >
                          {isGeneratingHtml ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileCode className="mr-2 h-4 w-4" />}
                          {isGeneratingHtml
                            ? 'Generating HTML...'
                            : 'Download as HTML'}
                        </Button>
                         <Button
                          onClick={handleDownloadDocx}
                          disabled={isGeneratingHtml || isGeneratingDocx}
                          variant="secondary"
                        >
                          {isGeneratingDocx ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileType className="mr-2 h-4 w-4" />}
                          {isGeneratingDocx
                            ? 'Generating DOCX...'
                            : 'Download as DOCX'}
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
