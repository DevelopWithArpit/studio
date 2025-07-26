'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import ReactDOM from 'react-dom';
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

const defaultResumeText = `ARPIT PISE
AI Engineer / Robotics Software Engineer
(727) 660-2831 | arpitpise1@gmail.com | linkedin.com/in/arpit-pise-20029a287 | Nagpur, India

SUMMARY
Enthusiastic B.Tech student in Robotics and Artificial Intelligence with expertise in Python, Java, and C++. Led the development of the AI Mentor platform, achieving a 30% increase in user engagement. Seeking an AI Engineer or Robotics Software Engineer role to leverage technical skills in developing advanced AI and robotic systems, contributing to innovative solutions.

EXPERIENCE
Cybersecurity Consulting Team Member | Tata Consultancy Services | June 2025
Completed a job simulation involving identity and access management (IAM) for Tata Consultancy Services, collaborating with a Cybersecurity Consulting team.
Acquired expertise in IAM principles, cybersecurity best practices, and strategic alignment with business objectives.
Delivered comprehensive documentation and presentations, showcasing the ability to communicate complex technical concepts effectively.

Software Engineer | Electronic Arts | June 2025
Proposed a new feature for the EA Sports College Football and wrote a Feature Proposal describing it to other stakeholders.
Built a class diagram and created a header file in C++ with class definitions for each object.
Patched a bugfix and optimized the EA Sports College Football codebase by implementing an improved data structure.

Robotics & Controls Engineering Intern | Johnson & Johnson | June 2025
Completed a job simulation as a robotics & controls engineering intern at Johnson & Johnson, focusing on optimizing a surgical robotic arm's performance.
Used Python-based tools to diagnose control system inefficiencies, identify root causes of delays, and implement targeted optimizations.
Proposed actionable design modifications using annotated technical visuals, validating their impact on responsiveness and durability through iterative testing.
Developed a professional design proposal outlining findings, solutions, and recommendations for improving precision and reliability in robotic systems.

Technical Member | College Committee (Priyadarshini College of Engineering) | Oct 2024 - May 2025 | Nagpur, India
Collaborated in the organization of 5+ technical events and workshops, resulting in increased student participation and boosting engagement with technical subjects.
Implemented an online registration system using PHP and MySQL, decreasing average registration wait times by 85% (from 20 minutes to 3 minutes) and enhancing user satisfaction.
Developed and maintained the college committee website using HTML, CSS, and JavaScript, leading to a 30% increase in event promotion click-through rates and improved event visibility.

EDUCATION
Bachelor of Technology in Robotics and Artificial Intelligence (B.Tech) | Priyadarshini College Of Engineering | Sept 2024 - May 2028 | Nagpur, India

KEY ACHIEVEMENTS
Led the development of the AI Mentor platform, achieving a 30% increase in user engagement.
Implemented an online registration system using PHP and MySQL, decreasing average registration wait times by 85%.
Developed and maintained the college committee website using HTML, CSS, and JavaScript, leading to a 30% increase in event promotion click-through rates.

SKILLS
Python, Java, C++, C, HTML, JavaScript, TensorFlow, Keras, PyTorch, Scikit-learn, OpenAI API, Deep Learning, Computer Vision, Natural Language Processing (NLP), Generative AI (GANs), Transformers, VAEs, AWS, Azure, ROS (Robot Operating System), Control Systems, Surgical Robotics, Git, Linux, Docker, PHP, MySQL, IAM, Cybersecurity, C++ Class Definitions

PROJECTS
AI Mentor by AP | May 2025 - Personal Project
`;

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
  
  const getResumeHtml = (resumeText: string) => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    ReactDOM.render(<ResumeTemplate resumeText={resumeText} />, container);
    const html = container.innerHTML;
    document.body.removeChild(container);
    return html;
  };

  const handleDownloadPdf = async () => {
    if (!result?.rewrittenResume) return;

    setIsGeneratingPdf(true);
    const element = document.createElement('div');
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    element.style.width = '827px'; // A4 width in pixels at 96 DPI
    document.body.appendChild(element);

    ReactDOM.render(<ResumeTemplate resumeText={result.rewrittenResume} />, element, async () => {
      try {
        const canvas = await html2canvas(element, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width, canvas.height] });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('resume.pdf');
      } catch (error) {
        toast({ variant: 'destructive', title: 'Error Generating PDF', description: error instanceof Error ? error.message : 'An unknown error occurred.' });
      } finally {
        ReactDOM.unmountComponentAtNode(element);
        document.body.removeChild(element);
        setIsGeneratingPdf(false);
      }
    });
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
                       <div className="border rounded-lg p-4 bg-muted/50 max-h-[500px] overflow-y-auto">
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
