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

const placeholderResume = `John Doe
Senior Software Engineer

Summary:
A highly motivated Senior Software Engineer with 8+ years of experience in designing, developing, and deploying scalable web applications using React, Node.js, and cloud technologies.

Experience:
- Senior Software Engineer, Tech Corp (2018-Present)
  - Led the development of a major e-commerce platform, increasing sales by 20%.
  - Mentored junior engineers and improved code quality through reviews.
- Software Engineer, Web Solutions (2015-2018)
  - Developed and maintained client-side features for various web applications.

Education:
- B.S. in Computer Science, University of Technology (2011-2015)

Skills:
- JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, SQL`;


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
