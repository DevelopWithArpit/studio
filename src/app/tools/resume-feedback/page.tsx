
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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

interface jsPDFWithAutoTable extends jsPDF {
    autoTable: (options: any) => jsPDF;
}

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

  const handleDownloadPdf = async () => {
    if (!result?.rewrittenResume) return;
    setIsGeneratingPdf(true);

    try {
        const resumeData = result.rewrittenResume;
        const doc = new jsPDF('p', 'pt', 'a4') as jsPDFWithAutoTable;
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 40;

        // --- STYLES ---
        const styles = {
            name: { font: 'helvetica', fontStyle: 'bold', fontSize: 32, textColor: '#2d3748' },
            contact: { font: 'helvetica', fontSize: 9, textColor: '#718096' },
            sectionTitle: { font: 'helvetica', fontStyle: 'bold', fontSize: 10, textColor: '#4a5568' },
            jobTitle: { font: 'helvetica', fontStyle: 'bold', fontSize: 12, textColor: '#2d3748' },
            company: { font: 'helvetica', fontStyle: 'normal', fontSize: 12, textColor: '#4a5568'},
            dates: { font: 'helvetica', fontSize: 10, textColor: '#718096' },
            body: { font: 'helvetica', fontSize: 10, textColor: '#4a5568' },
            bullet: { font: 'helvetica', fontSize: 10, textColor: '#4a5568'},
            skillBadge: { font: 'helvetica', fontSize: 8, textColor: '#4a5568', fillColor: '#edf2f7'},
        };
        const linkColor = '#2b6cb0';
        let finalY = 0; // Keep track of the last Y position

        // --- HEADER ---
        doc.setFont(styles.name.font, styles.name.fontStyle as any).setFontSize(styles.name.fontSize).setTextColor(styles.name.textColor);
        doc.text(resumeData.name, pageWidth / 2, margin, { align: 'center' });
        finalY = margin + styles.name.fontSize / 2;

        const contactInfo = [
            resumeData.contact.location,
            resumeData.contact.phone,
            { text: resumeData.contact.email, color: linkColor, url: `mailto:${resumeData.contact.email}` },
            resumeData.contact.linkedin ? { text: 'LinkedIn', color: linkColor, url: resumeData.contact.linkedin } : null,
            resumeData.contact.github ? { text: 'GitHub', color: linkColor, url: resumeData.contact.github } : null,
        ].filter(Boolean);

        let currentX = pageWidth / 2;
        const contactWidths = contactInfo.map(info => {
            const text = typeof info === 'string' ? info : info!.text;
            return doc.getStringUnitWidth(text) * styles.contact.fontSize + (typeof info === 'string' ? 12 : 12); // text + bullet + space
        });
        const totalContactWidth = contactWidths.reduce((a, b) => a + b, 0);
        currentX = (pageWidth - totalContactWidth) / 2;

        doc.setFontSize(styles.contact.fontSize).setTextColor(styles.contact.textColor);
        contactInfo.forEach((info, index) => {
            const text = typeof info === 'string' ? info : info!.text;
            const color = typeof info === 'object' ? info.color : styles.contact.textColor;
            const url = typeof info === 'object' ? info.url : null;
            
            if (index > 0) {
                doc.text('•', currentX, finalY + 5);
                currentX += 6;
            }
            doc.setTextColor(color).text(text, currentX, finalY + 5, url ? { url } as any : {});
            currentX += doc.getStringUnitWidth(text) * styles.contact.fontSize + 6;
        });
        finalY += 20;

        doc.setDrawColor('#e2e8f0').line(margin, finalY, pageWidth - margin, finalY);
        finalY += 20;

        // --- TWO COLUMN LAYOUT ---
        const leftColWidth = (pageWidth - margin * 3) * 0.65;
        const rightColWidth = (pageWidth - margin * 3) * 0.35;
        const rightColX = margin + leftColWidth + margin;

        const leftColBody: any[] = [];
        const rightColBody: any[] = [];

        // Summary
        leftColBody.push({ content: 'SUMMARY', styles: { fontStyle: 'bold', fontSize: styles.sectionTitle.fontSize, textColor: styles.sectionTitle.textColor } });
        leftColBody.push({ content: resumeData.summary, styles: { cellPadding: { top: 2, bottom: 15 }, fontSize: styles.body.fontSize, textColor: styles.body.textColor } });
        doc.setDrawColor('#e2e8f0').line(margin, finalY + 12, margin + leftColWidth, finalY + 12);
        
        // Experience
        leftColBody.push({ content: 'EXPERIENCE', styles: { fontStyle: 'bold', fontSize: styles.sectionTitle.fontSize, textColor: styles.sectionTitle.textColor } });
        resumeData.experience.forEach(exp => {
            leftColBody.push({ content: [
                { content: `${exp.title}, ${exp.company}`, styles: { fontStyle: 'bold', fontSize: styles.jobTitle.fontSize, textColor: styles.jobTitle.textColor, cellPadding: {top: 4, bottom: -2}} },
                { content: exp.dates, styles: { fontStyle: 'normal', fontSize: styles.dates.fontSize, textColor: styles.dates.textColor, halign: 'right' }}
            ], styles: { cellPadding: { top: 5, bottom: -2 }}});
            const bullets = exp.bullets.map(b => `•  ${b}`).join('\n');
            leftColBody.push({ content: bullets, styles: { cellPadding: { top: 2, bottom: 8, left: 10 }, fontSize: styles.bullet.fontSize, textColor: styles.bullet.textColor }});
        });

        // Education
        leftColBody.push({ content: 'EDUCATION', styles: { fontStyle: 'bold', fontSize: styles.sectionTitle.fontSize, textColor: styles.sectionTitle.textColor } });
        resumeData.education.forEach(edu => {
             leftColBody.push({ content: [
                { content: edu.school, styles: { fontStyle: 'bold', fontSize: styles.jobTitle.fontSize, textColor: styles.jobTitle.textColor, cellPadding: {top: 4, bottom: -2}} },
                { content: edu.dates, styles: { fontStyle: 'normal', fontSize: styles.dates.fontSize, textColor: styles.dates.textColor, halign: 'right' }}
            ], styles: { cellPadding: { top: 5, bottom: -2 }}});
            leftColBody.push({ content: edu.degree, styles: { cellPadding: { top: 2, bottom: 8}, fontSize: styles.bullet.fontSize, textColor: styles.bullet.textColor }});
        });

        // Skills
        rightColBody.push({ content: 'SKILLS', styles: { fontStyle: 'bold', fontSize: styles.sectionTitle.fontSize, textColor: styles.sectionTitle.textColor } });
        doc.setDrawColor('#e2e8f0').line(rightColX, finalY + 12, rightColX + rightColWidth, finalY + 12);

        // Projects
        rightColBody.push({ content: 'PROJECTS', styles: { fontStyle: 'bold', fontSize: styles.sectionTitle.fontSize, textColor: styles.sectionTitle.textColor, cellPadding: {top: 15}} });
        resumeData.projects.forEach(proj => {
            rightColBody.push({ content: proj.title, styles: { fontStyle: 'bold', fontSize: styles.jobTitle.fontSize, textColor: styles.jobTitle.textColor, cellPadding: {top: 4, bottom: -2}} });
            rightColBody.push({ content: `•  ${proj.description}`, styles: { cellPadding: { top: 2, bottom: 8, left: 10 }, fontSize: styles.bullet.fontSize, textColor: styles.bullet.textColor }});
        });

        // Achievements
        rightColBody.push({ content: 'KEY ACHIEVEMENTS', styles: { fontStyle: 'bold', fontSize: styles.sectionTitle.fontSize, textColor: styles.sectionTitle.textColor, cellPadding: {top: 15}} });
        resumeData.keyAchievements.forEach(ach => {
            rightColBody.push({ content: ach.title, styles: { fontStyle: 'bold', fontSize: styles.jobTitle.fontSize, textColor: styles.jobTitle.textColor, cellPadding: {top: 4, bottom: -2}} });
            rightColBody.push({ content: `•  ${ach.description}`, styles: { cellPadding: { top: 2, bottom: 8, left: 10 }, fontSize: styles.bullet.fontSize, textColor: styles.bullet.textColor }});
        });


        doc.autoTable({
            body: [leftColBody],
            startY: finalY,
            theme: 'plain',
            tableWidth: leftColWidth,
            margin: { left: margin },
            styles: {
                font: 'helvetica',
                fontSize: 10,
                cellPadding: 0,
            },
            columnStyles: {
                0: { cellWidth: leftColWidth },
            }
        });
        
        let leftY = (doc as any).lastAutoTable.finalY;

        doc.autoTable({
            body: [rightColBody],
            startY: finalY,
            theme: 'plain',
            tableWidth: rightColWidth,
            margin: { left: rightColX },
            styles: {
                font: 'helvetica',
                fontSize: 10,
                cellPadding: 0,
            },
            columnStyles: {
                0: { cellWidth: rightColWidth },
            },
            didDrawCell: (data) => {
                 if (data.section === 'body' && data.row.index === 0) { // skills section
                    doc.setFontSize(styles.skillBadge.fontSize);
                    const skills = resumeData.skills;
                    let x = data.cell.x + data.cell.padding('left');
                    let y = data.cell.y + data.cell.padding('top') + 15;
                    const gutter = 5;

                    skills.forEach(skill => {
                        const textWidth = doc.getStringUnitWidth(skill) * styles.skillBadge.fontSize + 10;
                        if (x + textWidth > rightColX + rightColWidth - data.cell.padding('right')) {
                            x = data.cell.x + data.cell.padding('left');
                            y += styles.skillBadge.fontSize + gutter;
                        }
                        doc.setFillColor(styles.skillBadge.fillColor).roundedRect(x, y-8, textWidth, 12, 6, 6, 'F');
                        doc.setTextColor(styles.skillBadge.textColor).text(skill, x + 5, y, { baseline: 'middle' });
                        x += textWidth + gutter;
                    });
                 }
            }
        });

        let rightY = (doc as any).lastAutoTable.finalY;

        if (Math.max(leftY, rightY) > doc.internal.pageSize.height - margin) {
             toast({
                title: 'Note: Resume may have multiple pages.',
                description: 'The generated content was too long for a single page.'
            });
        }


        doc.save('resume.pdf');
    } catch (error) {
        console.error("PDF Generation Error:", error);
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
                       <div className="border rounded-lg bg-gray-50 p-4 max-h-[700px] overflow-y-auto">
                           <div id="resume-preview-content">
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

    

    