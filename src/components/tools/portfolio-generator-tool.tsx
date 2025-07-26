'use client';

import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleGeneratePortfolioWebsiteAction } from '@/app/actions';
import type { GeneratePortfolioWebsiteOutput } from '@/ai/flows/portfolio-generator-tool';
import { Copy, Download, FileArchive, FileText, UploadCloud } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const formSchema = z.object({
  resumeDataUri: z.string().min(1, 'Please upload a resume file.'),
});

type FormData = z.infer<typeof formSchema>;

export default function PortfolioGeneratorTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeneratePortfolioWebsiteOutput | null>(null);
  const { toast } = useToast();
  const [resumeFile, setResumeFile] = useState<{name: string, dataUri: string} | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeDataUri: '',
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleGeneratePortfolioWebsiteAction(data.resumeDataUri);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Generating Website',
        description: response.error,
      });
    }
  }
  
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${type} Copied!`,
      description: `The ${type.toLowerCase()} code has been copied to your clipboard.`,
    });
  };
  
  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    saveAs(blob, filename);
  };

  const handleDownloadZip = () => {
    if (!result) return;
    const zip = new JSZip();
    zip.file("index.html", result.html);
    zip.file("style.css", result.css);
    zip.file("script.js", result.javascript);
    zip.generateAsync({type:"blob"})
    .then(function(content) {
        saveAs(content, "portfolio-website.zip");
    });
     toast({
      title: 'Download Started!',
      description: `Your portfolio website is being downloaded as a zip file.`,
    });
  };

  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload a document smaller than 100MB."});
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        setResumeFile({ name: file.name, dataUri });
        form.setValue('resumeDataUri', dataUri);
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Portfolio Website Generator</h1>
        <p className="text-muted-foreground">
          Upload your resume and get a professional, single-page portfolio with animations and visuals.
        </p>
      </header>

      <Card>
        <CardHeader>
            <CardTitle>Generate from Resume</CardTitle>
            <CardDescription>Upload your resume and the AI will generate a complete portfolio website for you.</CardDescription>
        </CardHeader>
        <CardContent>
           <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormItem>
                  <FormLabel>Your Resume</FormLabel>
                   <FormControl>
                      <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center">
                          {resumeFile ? (
                              <div className='flex flex-col items-center gap-2'>
                                  <FileText className="w-12 h-12 text-accent" />
                                  <p className='text-sm font-medium'>{resumeFile.name}</p>
                                  <Button variant="link" size="sm" asChild className='p-0 h-auto'>
                                      <label htmlFor="resume-upload" className="cursor-pointer">Change file</label>
                                  </Button>
                              </div>
                          ) : (
                              <>
                                  <UploadCloud className="w-12 h-12 text-muted-foreground" />
                                  <p className="mt-2 text-sm text-muted-foreground">
                                      <label htmlFor="resume-upload" className="font-semibold text-accent cursor-pointer hover:underline">
                                          Click to upload
                                      </label>
                                      {' '}or drag and drop
                                  </p>
                                  <p className="text-xs text-muted-foreground">PDF, DOCX, TXT up to 100MB</p>
                              </>
                          )}
                          <Input id="resume-upload" type="file" className="sr-only" onChange={handleResumeFileChange} accept=".pdf,.docx,.txt" />
                      </div>
                   </FormControl>
                   <FormMessage>{form.formState.errors.resumeDataUri?.message}</FormMessage>
                </FormItem>
              <Button type="submit" disabled={isLoading || !form.formState.isValid}>
                {isLoading ? 'Generating Website...' : 'Generate Website'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>


      {(isLoading || result) && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Website Code</CardTitle>
            <CardDescription>Your portfolio code is ready. You can preview it or download the files.</CardDescription>
          </CardHeader>
          <CardContent>
             {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-10 w-1/3" />
                    <Skeleton className="h-64 w-full" />
                </div>
             ) : (
                <Tabs defaultValue="preview">
                    <TabsList>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                        <TabsTrigger value="html">HTML</TabsTrigger>
                        <TabsTrigger value="css">CSS</TabsTrigger>
                        <TabsTrigger value="js">JavaScript</TabsTrigger>
                    </TabsList>
                    <TabsContent value="preview" className="mt-4">
                        <iframe 
                            srcDoc={`<html><head><style>${result?.css}</style></head><body>${result?.html}<script>${result?.javascript}</script></body></html>`}
                            className="w-full h-[600px] border rounded-md"
                            title="Portfolio Preview"
                        />
                    </TabsContent>
                    <TabsContent value="html">
                        <CodeBlock 
                          code={result?.html ?? ''} 
                          onCopy={() => copyToClipboard(result?.html ?? '', 'HTML')} 
                          onDownload={() => downloadFile(result?.html ?? '', 'index.html', 'text/html')}
                        />
                    </TabsContent>
                     <TabsContent value="css">
                        <CodeBlock 
                          code={result?.css ?? ''} 
                          onCopy={() => copyToClipboard(result?.css ?? '', 'CSS')}
                          onDownload={() => downloadFile(result?.css ?? '', 'style.css', 'text/css')}
                        />
                    </TabsContent>
                     <TabsContent value="js">
                        <CodeBlock 
                          code={result?.javascript ?? ''} 
                          onCopy={() => copyToClipboard(result?.javascript ?? '', 'JavaScript')}
                          onDownload={() => downloadFile(result?.javascript ?? '', 'script.js', 'text/javascript')}
                        />
                    </TabsContent>
                </Tabs>
             )}
          </CardContent>
          {result && (
            <CardFooter>
                 <Button onClick={handleDownloadZip}>
                    <FileArchive className="mr-2 h-4 w-4" />
                    Download Site (.zip)
                </Button>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  );
}

const CodeBlock = ({ code, onCopy, onDownload }: { code: string; onCopy: () => void; onDownload: () => void; }) => {
  return (
    <div className="relative">
      <div className="absolute top-2 right-2 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onCopy}
        >
          <Copy className="h-4 w-4" />
        </Button>
         <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onDownload}
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
      <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm h-96">
        <code className="text-foreground">{code}</code>
      </pre>
    </div>
  );
};