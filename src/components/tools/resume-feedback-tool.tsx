'use client';

import React, { useState, useRef, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { handleGetResumeFeedbackAction, handleGeneratePortfolioAction } from '@/app/actions';
import type { GetResumeFeedbackOutput } from '@/ai/flows/resume-feedback-tool';
import type { GeneratePortfolioOutput } from '@/ai/flows/portfolio-generator-tool';
import { FileText, UploadCloud, Wand2 } from 'lucide-react';

const defaultResumeText = `ARPIT PISE
AI Engineer / Robotics Software Engineer
7276602831 | arpitpise1@gmail.com | linkedin.com/in/arpit-pise-20029a287 | Nagpur, India

SUMMARY
As a B.Tech student specializing in Robotics and Artificial Intelligence, I am dedicated to crafting cutting-edge AI solutions. My expertise in Python, Java, and C++ complements my projects, notably leading the successful development of the AI Mentor platform. I am eager to apply my skills in an AI Engineer or Robotics Software Engineer role to contribute to advanced technological innovations.

EXPERIENCE
Technical Member, Priyadarshini College of Engineering, Nagpur, India
01/2023 - Present
* Collaborated in the organization of 5+ technical events and workshops, resulting in a 50% increase in student participation.
* Implemented an online registration system using PHP and MySQL, decreasing average registration wait times by 85%.
* Developed and maintained the college committee website using HTML, CSS, and JavaScript, leading to a 30% increase in event promotion visibility.

EDUCATION
Bachelor of Technology in Robotics and Artificial Intelligence (B.Tech)
Priyadarshini College Of Engineering, Nagpur, India
08/2024 - 05/2028

HSC, ST. PAUL PUBLIC SCHOOL & JUNIOR COLLEGE
01/2021 - 05/2023

SSC, PURUSHOTTAM DAS BAGLA CONVENT
01/2019 - 05/2021

KEY ACHIEVEMENTS
* AI Mentor by AP Platform Development: Led the development of the AI Mentor platform, achieving a 30% increase in user engagement within the first month.

PROJECTS
AI Mentor by AP
* Spearheaded the development of an AI-powered platform offering personalized learning and career guidance.
* Engineered and implemented AI-driven tools for resume and cover letter creation, career path recommendations, and code/DSA assistance.
* Integrated AI-powered image generation (Stable Diffusion, DALL-E), text-based image editing, and presentation assistance features.

SKILLS
AWS, Azure, C/C++, CSS, Data Structures, Deep Learning, Django, Docker, Flask, Git, HTML, Java, JavaScript, Keras, Linux, NLP, Numpy, Pandas, PHP, Python, PyTorch, Robotics, Scikit-Learn, TensorFlow, Gmail`;

const formSchema = z.object({
  resume: z.string().min(1, "Please upload or paste your resume."),
  targetJobRole: z.string().optional(),
  additionalInfo: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ResumeFeedbackTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPortfolio, setIsGeneratingPortfolio] = useState(false);
  const [result, setResult] = useState<GetResumeFeedbackOutput | null>(null);
  const [portfolioResult, setPortfolioResult] = useState<GeneratePortfolioOutput | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
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
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload a document smaller than 4MB."});
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
        form.setError("resume", { type: "manual", message: "Please upload or paste your resume." });
        return;
    }
    setIsLoading(true);
    setResult(null);
    setPortfolioResult(null);
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

  async function onGeneratePortfolio() {
      if (!result?.rewrittenResume) return;

      setIsGeneratingPortfolio(true);
      setPortfolioResult(null);
      const response = await handleGeneratePortfolioAction({ resumeText: result.rewrittenResume });
      setIsGeneratingPortfolio(false);

      if (response.success) {
          setPortfolioResult(response.data);
      } else {
          toast({
              variant: 'destructive',
              title: 'Error Generating Portfolio',
              description: response.error,
          });
      }
  }
  
  useEffect(() => {
    if (portfolioResult && iframeRef.current) {
        iframeRef.current.srcdoc = `
            <html>
                <head><style>${portfolioResult.css}</style></head>
                <body>${portfolioResult.html}</body>
            </html>
        `;
    }
  }, [portfolioResult]);


  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Resume & Portfolio Tool</h1>
        <p className="text-muted-foreground">
          Get AI-powered feedback to improve your resume, then instantly generate a professional portfolio page.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Analyze Your Resume</CardTitle>
          <CardDescription>
            Upload or paste your resume, then provide some optional context about your job search.
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
                            <FormMessage/>
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
                            <div className='flex flex-col items-center gap-2'>
                                <FileText className="w-12 h-12 text-accent" />
                                <p className='text-sm font-medium'>{fileName}</p>
                                <Button variant="link" size="sm" asChild className='p-0 h-auto'>
                                <label htmlFor="file-upload" className="cursor-pointer">Change file</label>
                                </Button>
                            </div>
                            ) : (
                            <>
                                <UploadCloud className="w-12 h-12 text-muted-foreground" />
                                <p className="mt-2 text-sm text-muted-foreground">
                                <label htmlFor="file-upload" className="font-semibold text-accent cursor-pointer hover:underline">
                                    Click to upload
                                </label>
                                {' '}or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground">PDF, DOCX, TXT up to 4MB</p>
                            </>
                            )}
                            <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                        </div>
                        </FormControl>
                        <FormMessage>{form.formState.errors.resume?.message}</FormMessage>
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
                        <Input placeholder="e.g., Software Engineer" {...field} />
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
                        <Input placeholder="e.g., transitioning from another industry" {...field} />
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
                            result && <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: result.feedback.replace(/\n/g, '<br />') }} />
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
                                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm whitespace-pre-wrap font-sans">{result.rewrittenResume}</pre>
                                <Button onClick={onGeneratePortfolio} disabled={isGeneratingPortfolio}>
                                    <Wand2 className="mr-2 h-4 w-4" />
                                    {isGeneratingPortfolio ? 'Generating Portfolio...' : 'Generate Portfolio from this Resume'}
                                </Button>
                            </div>
                           )
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
      )}

      {(isGeneratingPortfolio || portfolioResult) && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="preview">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="css">CSS</TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="mt-4">
                {isGeneratingPortfolio ? (
                  <Skeleton className="w-full h-[600px] rounded-lg" />
                ) : (
                  <iframe
                    ref={iframeRef}
                    title="Portfolio Preview"
                    className="w-full h-[600px] rounded-lg border bg-white"
                  />
                )}
              </TabsContent>
              <TabsContent value="html" className="mt-4">
                 {isGeneratingPortfolio ? (
                  <Skeleton className="w-full h-[600px] rounded-lg" />
                ) : (
                    <pre className="w-full h-[600px] overflow-auto bg-muted p-4 rounded-md text-sm">
                        <code className="text-foreground">{portfolioResult?.html}</code>
                    </pre>
                )}
              </TabsContent>
               <TabsContent value="css" className="mt-4">
                 {isGeneratingPortfolio ? (
                  <Skeleton className="w-full h-[600px] rounded-lg" />
                ) : (
                    <pre className="w-full h-[600px] overflow-auto bg-muted p-4 rounded-md text-sm">
                        <code className="text-foreground">{portfolioResult?.css}</code>
                    </pre>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
