
'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleGetResumeFeedbackAction, handleCustomizeResumeAction } from '@/app/actions';
import { GetResumeFeedbackOutput } from '@/ai/flows/resume-feedback-tool';
import { CustomizeResumeOutput } from '@/ai/flows/resume-customizer-tool';
import { FileText, UploadCloud, Download, Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  resumeDataUri: z.string().min(1, 'Please upload a resume file.'),
  template: z.enum(['Modern', 'Classic', 'Creative']),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Please enter a valid hex color.'),
});

type FormData = z.infer<typeof formSchema>;
type ResumeData = GetResumeFeedbackOutput['rewrittenResume'];

export default function ResumeCustomizerTool() {
  const [isParsing, setIsParsing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeDataUri: '',
      template: 'Modern',
      primaryColor: '#2563EB',
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setGeneratedHtml(null);
        setResumeData(null);
        setFileName(null);
        form.setValue('resumeDataUri', '');
      
        if (file.size > 200 * 1024 * 1024) { // 200MB limit
            toast({ variant: 'destructive', title: 'File too large', description: 'Please upload a file smaller than 200MB.' });
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async (loadEvent) => {
            const dataUri = loadEvent.target?.result as string;
            form.setValue('resumeDataUri', dataUri);
            setFileName(file.name);
            await parseResume(dataUri);
        };
    }
  };

  const parseResume = async (resumeDataUri: string) => {
    setIsParsing(true);
    setGeneratedHtml(null);
    setResumeData(null);
    const response = await handleGetResumeFeedbackAction({ resume: resumeDataUri });
    setIsParsing(false);
    if (response.success && response.data.rewrittenResume) {
      setResumeData(response.data.rewrittenResume);
      toast({ title: 'Resume Parsed', description: 'Your resume data has been extracted successfully.' });
      // Trigger generation with default values
      await onSubmit(form.getValues());
    } else {
      toast({ variant: 'destructive', title: 'Parsing Failed', description: response.error || 'Could not extract data from the resume.' });
    }
  };

  async function onSubmit(data: FormData) {
    if (!resumeData) {
      toast({ variant: 'destructive', title: 'No Resume Data', description: 'Please upload and parse a resume first.' });
      return;
    }

    setIsGenerating(true);
    setGeneratedHtml(null);
    const response = await handleCustomizeResumeAction({
      resumeData: resumeData,
      template: data.template,
      primaryColor: data.primaryColor,
    });
    setIsGenerating(false);

    if (response.success) {
      setGeneratedHtml(response.data.html);
    } else {
      toast({ variant: 'destructive', title: 'Customization Failed', description: response.error });
    }
  }

  const handleDownloadPdf = async () => {
    if (!generatedHtml) return;
    setIsDownloading(true);
    
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.innerHTML = generatedHtml;
    document.body.appendChild(container);

    // Give browser time to render the HTML
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        const resumeElement = container.firstElementChild as HTMLElement;
        const canvas = await html2canvas(resumeElement, {
            scale: 2, // Use a reasonable scale for good quality
            useCORS: true,
        });
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: 'a4',
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        // Use JPEG compression with a low quality setting for a much smaller file size
        const imgData = canvas.toDataURL('image/jpeg', 0.1); 
        
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${fileName?.split('.')[0] || 'resume'}-${form.getValues('template')}.pdf`);
    } catch (error) {
        console.error("PDF Generation Error:", error);
        toast({ variant: 'destructive', title: 'Failed to generate PDF', description: 'There was an error creating the PDF file.' });
    } finally {
        document.body.removeChild(container);
        setIsDownloading(false);
    }
};


  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Resume Customizer</h1>
        <p className="text-muted-foreground">
          Upload your resume, then customize the layout, colors, and template.
        </p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-8">
            <Card>
                <CardHeader>
                <CardTitle>1. Upload Resume</CardTitle>
                <CardDescription>Start by uploading your resume document.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center">
                        {isParsing ? (
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-12 h-12 text-accent animate-spin" />
                                <p className="text-sm font-medium">Parsing Resume...</p>
                            </div>
                        ) : fileName ? (
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
                            </p>
                            <p className="text-xs text-muted-foreground">PDF, DOCX, TXT up to 200MB</p>
                        </>
                        )}
                        <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.docx,.doc,.txt" disabled={isParsing} />
                    </div>
                </CardContent>
            </Card>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>2. Customize</CardTitle>
                            <CardDescription>Adjust the template and color to fit your style.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FormField
                                control={form.control}
                                name="template"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>Template</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1"
                                            >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl><RadioGroupItem value="Modern" /></FormControl>
                                                <FormLabel className="font-normal">Modern</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl><RadioGroupItem value="Classic" /></FormControl>
                                                <FormLabel className="font-normal">Classic</FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl><RadioGroupItem value="Creative" /></FormControl>
                                                <FormLabel className="font-normal">Creative</FormLabel>
                                            </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="primaryColor"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Accent Color</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center gap-2">
                                                <Input type="color" {...field} className="p-1 h-10 w-14" />
                                                <Input type="text" {...field} placeholder="#2563EB" className="flex-1" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={!resumeData || isGenerating || isParsing}>
                                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Generate
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>

        </div>
        <div className="lg:col-span-2">
            <Card className="sticky top-4">
                <CardHeader>
                    <CardTitle>3. Preview</CardTitle>
                </CardHeader>
                <CardContent className="min-h-[700px]">
                     {(isGenerating || isParsing) ? (
                        <div className="w-full h-[700px] flex items-center justify-center bg-muted rounded-lg">
                            <Loader2 className="w-16 h-16 text-accent animate-spin" />
                        </div>
                    ) : generatedHtml ? (
                        <iframe
                            srcDoc={generatedHtml}
                            className="w-full h-[700px] border rounded-lg bg-white"
                            title="Resume Preview"
                        />
                    ) : (
                        <div className="w-full h-[700px] flex flex-col items-center justify-center bg-muted rounded-lg text-center p-4">
                           <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                           <h3 className="font-semibold">Your resume preview will appear here</h3>
                           <p className="text-muted-foreground text-sm">Upload your resume to get started.</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button onClick={handleDownloadPdf} disabled={!generatedHtml || isDownloading || isGenerating || isParsing}>
                        <Download className="mr-2 h-4 w-4" />
                        {isDownloading ? 'Downloading...' : 'Download as PDF'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}

