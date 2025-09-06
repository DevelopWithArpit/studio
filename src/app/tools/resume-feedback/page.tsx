'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { saveAs } from 'file-saver';
import { Packer } from 'docx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
import { FileText, UploadCloud, Download, FileCode, Loader2, FileType } from 'lucide-react';
import { ResumeTemplate } from '@/components/resume-template';
import { createResumeDocx } from '@/lib/docx-generator';

const formSchema = z.object({
  resume: z.string().min(1, 'Please upload or paste your resume.'),
  targetJobRole: z.string().optional(),
  additionalInfo: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;


export default function ResumeFeedbackTool() {
  const [isLoading, setIsLoading] = useState(false);
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

  const handleDownloadDocx = () => {
    if (!result?.rewrittenResume) return;

    try {
      const doc = createResumeDocx(result.rewrittenResume);
      Packer.toBlob(doc).then(blob => {
        saveAs(blob, 'resume.docx');
        toast({ title: "DOCX Downloaded", description: "Your resume has been saved as a DOCX file." });
      });
    } catch (error) {
       toast({ variant: 'destructive', title: 'Error Generating DOCX', description: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
  };
  
  const handleDownloadPdf = () => {
    if (!result?.rewrittenResume) return;
    const { name, title, contact, summary, experience, education, projects, skills, keyAchievements, training } = result.rewrittenResume;
    
    const doc = new jsPDF('p', 'pt');
    const pageW = doc.internal.pageSize.getWidth();
    const sidebarW = pageW * 0.33;
    const mainW = pageW - sidebarW;
    const margin = 20;
    
    let y = 0; // we will manage y manually

    // --- Sidebar (Left Column) ---
    doc.setFillColor(14, 61, 78); // #0e3d4e
    doc.rect(0, 0, sidebarW, doc.internal.pageSize.getHeight(), 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    y = margin + 30;
    doc.setFontSize(24);
    const nameLines = doc.splitTextToSize(name, sidebarW - (margin * 2));
    doc.text(nameLines, margin, y);
    y += doc.getTextDimensions(nameLines).h + 30;

    const addSidebarSection = (title: string, contentFn: () => void) => {
        if (y > doc.internal.pageSize.getHeight() - 60) {
          doc.addPage();
          doc.rect(0, 0, sidebarW, doc.internal.pageSize.getHeight(), 'F');
          y = margin;
        }
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(title.toUpperCase(), margin, y);
        doc.setLineWidth(0.5);
        doc.line(margin, y + 2, sidebarW - margin, y + 2);
        y += 18;
        contentFn();
    }
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    
    if (projects?.length > 0) {
      addSidebarSection("Projects", () => {
        projects.forEach(proj => {
          doc.setFont('helvetica', 'bold');
          const titleLines = doc.splitTextToSize(proj.title, sidebarW - (margin * 2));
          doc.text(titleLines, margin, y);
          y += doc.getTextDimensions(titleLines).h;
          
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(209, 213, 219); // gray-300
          const descLines = doc.splitTextToSize(proj.description, sidebarW - (margin * 2));
          doc.text(descLines, margin, y);
          y += doc.getTextDimensions(descLines).h;
          
          if(proj.link) {
            doc.setTextColor(147, 197, 253); // blue-300
            const linkLines = doc.splitTextToSize(proj.link, sidebarW - (margin * 2));
            doc.textWithLink(proj.link, margin, y, { url: proj.link });
            y += doc.getTextDimensions(linkLines).h;
          }
          y+= 10;
          doc.setTextColor(255, 255, 255);
        })
      })
    }

    if (keyAchievements?.length > 0) {
        addSidebarSection("Key Achievements", () => {
            keyAchievements.forEach(ach => {
                doc.setFont('helvetica', 'bold');
                const titleLines = doc.splitTextToSize(ach.title, sidebarW - (margin * 2) - 15);
                doc.text('•', margin, y + 4);
                doc.text(titleLines, margin + 10, y);
                y += doc.getTextDimensions(titleLines).h;
                
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(209, 213, 219);
                const descLines = doc.splitTextToSize(ach.description, sidebarW - (margin * 2) - 15);
                doc.text(descLines, margin + 10, y);
                y += doc.getTextDimensions(descLines).h + 10;
                doc.setTextColor(255, 255, 255);
            });
        });
    }

    if (skills?.length > 0) {
        addSidebarSection("Skills", () => {
             doc.setTextColor(209, 213, 219);
             const skillsLines = doc.splitTextToSize(skills.join(', '), sidebarW - (margin * 2));
             doc.text(skillsLines, margin, y);
             y += doc.getTextDimensions(skillsLines).h + 10;
             doc.setTextColor(255, 255, 255);
        });
    }

    if (training?.length > 0) {
        addSidebarSection("Training / Courses", () => {
            training.forEach(t => {
                doc.setFont('helvetica', 'bold');
                const titleLines = doc.splitTextToSize(t.title, sidebarW - (margin * 2));
                doc.text(titleLines, margin, y);
                y += doc.getTextDimensions(titleLines).h;

                doc.setFont('helvetica', 'normal');
                doc.setTextColor(209, 213, 219);
                const descLines = doc.splitTextToSize(t.description, sidebarW - (margin * 2));
                doc.text(descLines, margin, y);
                y += doc.getTextDimensions(descLines).h + 10;
                doc.setTextColor(255, 255, 255);
            });
        });
    }

    // --- Main Content (Right Column) ---
    y = 0; // reset y for the main column
    doc.setTextColor(0, 0, 0);
    const mainX = sidebarW + margin;
    const mainContentWidth = mainW - (margin * 2);
    
    y = margin + 30;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99); // gray-500
    doc.text(title, mainX, y);
    y += 18;

    let contactY = y;
    let contactX = mainX;
    doc.setFontSize(9);
    const contactInfo = [
      contact.phone,
      contact.email,
      contact.linkedin ? 'LinkedIn' : null,
      contact.github ? 'GitHub' : null,
      contact.location
    ].filter(Boolean);

    contactInfo.forEach((info, i) => {
        const text = info! + (i < contactInfo.length - 1 ? '  |' : '');
        const textWidth = doc.getTextWidth(text);
        if (contactX + textWidth > pageW - margin) {
            contactX = mainX;
            contactY += 12;
        }
        if (info === 'LinkedIn' && contact.linkedin) doc.textWithLink(text, contactX, contactY, {url: contact.linkedin});
        else if (info === 'GitHub' && contact.github) doc.textWithLink(text, contactX, contactY, {url: contact.github});
        else doc.text(text, contactX, contactY);
        contactX += textWidth + 4;
    });

    y = contactY + 20;

    const addMainSection = (title: string, contentFn: () => void) => {
        if (y > doc.internal.pageSize.getHeight() - 60) {
            doc.addPage();
            y = margin;
        }
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(75, 85, 99);
        doc.text(title.toUpperCase(), mainX, y);
        doc.setLineWidth(1);
        doc.setDrawColor(229, 231, 235); // gray-200
        doc.line(mainX, y + 3, pageW - margin, y + 3);
        y += 20;
        contentFn();
    }

    if (summary) {
        addMainSection("Summary", () => {
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(55, 65, 81); // gray-700
            const summaryLines = doc.splitTextToSize(summary, mainContentWidth);
            doc.text(summaryLines, mainX, y);
            y += doc.getTextDimensions(summaryLines).h + 15;
        });
    }
    
    if (experience?.length > 0) {
        addMainSection("Experience", () => {
           experience.forEach(exp => {
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(0,0,0);
                doc.text(exp.title, mainX, y);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(75, 85, 99);
                doc.text(exp.dates, pageW - margin, y, { align: 'right' });
                y += 12;

                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(59, 130, 246); // blue-500
                doc.text(`${exp.company}${exp.location ? `, ${exp.location}`: ''}`, mainX, y);
                y += 15;
                
                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(55, 65, 81);
                exp.bullets.forEach(bullet => {
                     const bulletLines = doc.splitTextToSize(`• ${bullet}`, mainContentWidth);
                     doc.text(bulletLines, mainX, y);
                     y += doc.getTextDimensions(bulletLines).h + 2;
                });
                y += 10;
           });
        });
    }

    if (education?.length > 0) {
        addMainSection("Education", () => {
           education.forEach(edu => {
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(0,0,0);
                doc.text(edu.degree, mainX, y);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(75, 85, 99);
                doc.text(edu.dates, pageW - margin, y, { align: 'right' });
                y += 12;
                
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(59, 130, 246);
                doc.text(`${edu.school}${edu.location ? `, ${edu.location}`: ''}`, mainX, y);
                y += 15;
           });
        });
    }

    doc.save('resume.pdf');
    toast({ title: "PDF Downloaded", description: "Your resume has been saved as a PDF file." });
  }
  
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
                           <div id="resume-preview-content">
                                <ResumeTemplate resumeData={result.rewrittenResume} />
                           </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                         <Button onClick={handleDownloadDocx} variant="secondary">
                          <FileCode className="mr-2 h-4 w-4" />
                          Download as DOCX
                       </Button>
                        <Button onClick={handleDownloadPdf} variant="secondary">
                            <FileType className="mr-2 h-4 w-4" />
                            Download as PDF
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
