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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleGeneratePortfolioAction } from '@/app/actions';
import type { GeneratePortfolioOutput } from '@/ai/flows/portfolio-generator-tool';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formSchema = z.object({
  resumeText: z.string().min(100, 'Please enter resume text of at least 100 characters.'),
});

type FormData = z.infer<typeof formSchema>;

const placeholderResume = `ARPIT PISE
AI Engineer / Robotics Software Engineer
7276602831 | arpitpise1@gmail.com | linkedin.com/in/arpit-pise-20029a287 | Nagpur, India

SUMMARY:
As a B.Tech student specializing in Robotics and Artificial Intelligence, I am dedicated to crafting cutting-edge AI solutions. My expertise in Python, Java, and C++ complements my projects, notably leading the successful development of the AI Mentor platform. I am eager to apply my skills in an AI Engineer or Robotics Software Engineer role to contribute to advanced technological innovations.

KEY ACHIEVEMENTS:
- AI Mentor by AP Platform Development: Led the development of the AI Mentor by AP platform, achieving a 30% increase in user engagement within the first month through personalized learning experiences.

EXPERIENCE:
- Technical Member, Priyadarshini College of Engineering (01/2023 - Present, Nagpur, India)
  - Collaborated in the organization of 5+ technical events and workshops, resulting in a 50% increase in student participation.
  - Implemented an online registration system using PHP and MySQL, decreasing average registration wait times by 85%.
  - Developed and maintained the college committee website using HTML, CSS, and JavaScript, leading to a 30% increase in event promotion click-through rates.

PROJECTS:
- AI Mentor by AP (Personal Project, 05/2025 - Present)
  - Spearheaded the development of an AI-powered platform offering personalized learning and career guidance.
  - Engineered and implemented AI-driven tools for resume and cover letter creation, career path recommendations, and code/DSA assistance.
  - Integrated AI-powered image generation (Stable Diffusion, DALL-E), text-based image editing, and diagram generation.
  - Designed the platform with a user-centric approach, seamlessly integrating diverse AI functionalities.

EDUCATION:
- Bachelor of Technology in Robotics and Artificial Intelligence (B.Tech), Priyadarshini College Of Engineering (08/2024 - 05/2028, Nagpur, India)
- HSC, ST. PAUL PUBLIC SCHOOL & JUNIOR COLLEGE (01/2021 - 05/2023)
- SSC, PURUSHOTTAM DAS BAGLA CONVENT (01/2019 - 05/2021)

SKILLS:
AWS, Azure, C/C++, CSS, Data Structures, Deep Learning, Django, Docker, Flask, GAMS, Git, HTML, Java, JavaScript, Keras, Linux, NLP, Numpy, Pandas, PHP, Python, PyTorch, Robotics, Scikit-Learn, TensorFlow, Gmail`;


export default function PortfolioGeneratorTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeneratePortfolioOutput | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeText: placeholderResume,
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleGeneratePortfolioAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error generating portfolio',
        description: response.error,
      });
    }
  }

  useEffect(() => {
    if (result && iframeRef.current) {
        iframeRef.current.srcdoc = `
            <html>
                <head><style>${result.css}</style></head>
                <body>${result.html}</body>
            </html>
        `;
    }
  }, [result]);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Portfolio Generator</h1>
        <p className="text-muted-foreground">
          Create a single-page portfolio website from your resume content.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Generate Your Portfolio</CardTitle>
          <CardDescription>
            Paste your structured resume text below to generate the HTML and CSS for a portfolio site.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="resumeText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Structured Resume Text</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your structured resume here..."
                        {...field}
                        rows={15}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Portfolio'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || result) && (
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
                {isLoading ? (
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
                 {isLoading ? (
                  <Skeleton className="w-full h-[600px] rounded-lg" />
                ) : (
                    <pre className="w-full h-[600px] overflow-auto bg-muted p-4 rounded-md text-sm">
                        <code className="text-foreground">{result?.html}</code>
                    </pre>
                )}
              </TabsContent>
               <TabsContent value="css" className="mt-4">
                 {isLoading ? (
                  <Skeleton className="w-full h-[600px] rounded-lg" />
                ) : (
                    <pre className="w-full h-[600px] overflow-auto bg-muted p-4 rounded-md text-sm">
                        <code className="text-foreground">{result?.css}</code>
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
