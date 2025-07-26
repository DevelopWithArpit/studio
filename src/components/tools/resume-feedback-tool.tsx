'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { createRoot } from 'react-dom/client';
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
import { FileText, UploadCloud, Download, FileCode } from 'lucide-react';
import { ResumeTemplate } from '@/components/resume-template';

const defaultResumeText = `Arpit Pise
(727) 660-2831 | arpitpise1@gmail.com | linkedin.com/in/arpit-pise-20029a287 | Nagpur, India

SUMMARY
Enthusiastic B.Tech student in Robotics and Artificial Intelligence seeking an Al Engineer or Robotics Software Engineer role. Expertise in Python, Java, and C++. Proven ability to develop and implement Al solutions, demonstrated by leading the development of an Al Mentor platform and achieving a 30% increase in user engagement. Passionate about leveraging technical skills to develop advanced Al and robotic systems and contribute to innovative solutions.

EXPERIENCE
Cybersecurity Consulting Team Member | Tata Consultancy Services | June 2023
• Completed a job simulation involving identity and access management (IAM) for Tata Consultancy Services, collaborating with a Cybersecurity Consulting team.
• Acquired expertise in IAM principles, cybersecurity best practices, and strategic alignment with business objectives.
• Delivered comprehensive documentation and presentations, showcasing the ability to communicate complex technical concepts effectively.
Software Engineer | Electronic Arts | June 2023
• Proposed a new feature for the EA Sports College Football and wrote a Feature Proposal describing it to other stakeholders.
• Built a class diagram and created a header file in C++ with class

SKILLS
Programming Languages: Python, Java, C++, C, HTML, JavaScript
AI/ML: TensorFlow, Keras, PyTorch, Scikit-learn, OpenAI API, Machine Learning, Deep Learning, Computer Vision
Natural Language Processing
Generative Al (GANs): Transformers, VAEs
Other: Git, Linux, Docker, ROS (Robot Operating System)
AWS, Azure, PHP, MySQL, IAM, Cybersecurity, C++ Class Definitions, Robotics, Control Systems, Surgical Robotics`;

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
      resume: defaultResumeText,
      targetJobRole: '',
      additionalInfo: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please upload a document smaller than 4MB.',
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
  
  const getResumeHtml = (resumeText: string): Promise<string> => {
    return new Promise((resolve) => {
        const container = document.createElement('div');
        // Don't hide the container, just give it a specific size for rendering
        container.style.width = '8.5in';
        container.style.height = '11in';

        document.body.appendChild(container);
        
        const root = createRoot(container);
        root.render(<ResumeTemplate resumeText={resumeText} />);

        setTimeout(() => {
            const html = container.innerHTML;
            root.unmount();
            document.body.removeChild(container);
            resolve(`<!DOCTYPE html>
<html>
<head>
  <title>Resume</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');
    body { font-family: 'Inter', sans-serif; }
    .skill-badge { display: inline-block; background-color: #f3f4f6; color: #374151; font-size: 10px; font-weight: 500; padding: 2px 8px; margin: 2px; border-radius: 4px; }
  </style>
</head>
<body>
  ${html}
</body>
</html>`);
        }, 500);
    });
  };

  const handleDownloadPdf = async () => {
    if (!result?.rewrittenResume) return;

    setIsGeneratingPdf(true);
    const element = document.createElement('div');
    element.style.width = '816px'; // 8.5 inches at 96 DPI
    element.style.height = '1056px'; // 11 inches at 96 DPI
    document.body.appendChild(element);

    const root = createRoot(element);
    root.render(<ResumeTemplate resumeText={result.rewrittenResume} />);

    setTimeout(async () => {
         try {
            const canvas = await html2canvas(element, { scale: 3, useCORS: true, windowWidth: element.scrollWidth, windowHeight: element.scrollHeight });
            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF({ orientation: 'p', unit: 'px', format: 'a4' });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('resume.pdf');
          } catch (error) {
            toast({ variant: 'destructive', title: 'Error Generating PDF', description: error instanceof Error ? error.message : 'An unknown error occurred.' });
          } finally {
            root.unmount();
            document.body.removeChild(element);
            setIsGeneratingPdf(false);
          }
    }, 1000) // Increased timeout for rendering
  };

  const handleDownloadHtml = async () => {
    if (!result?.rewrittenResume) return;
    setIsGeneratingHtml(true);
    const htmlContent = await getResumeHtml(result.rewrittenResume);
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
                            placeholder="Summary..."
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
                            <FileText className="w-12 h-12 text-accent" />
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
                                className="font-semibold text-accent cursor-pointer hover:underline"
                              >
                                Click to upload
                              </label>{' '}
                              or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PDF, DOCX, TXT up to 4MB
                            </p>
                          </>
                        )}
                        <Input
                          id="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
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
                {isLoading ? 'Analyzing...' : 'Get Feedback'}
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
                  <div className="space-y-4 pt-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : (
                  result && (
                    <div className="space-y-4">
                       <div className="border rounded-lg bg-white max-h-[700px] overflow-y-auto">
                          <ResumeTemplate resumeText={result.rewrittenResume} />
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
                            ? 'Generating Doc...'
                            : 'Download as Editable Doc'}
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
