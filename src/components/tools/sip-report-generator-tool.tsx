'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import jsPDF from 'jspdf';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleGenerateSipReportAction } from '@/app/actions';
import type { GenerateSipReportOutput } from '@/ai/flows/sip-report-generator-tool';
import { Download, FileText, Loader2, UploadCloud } from 'lucide-react';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  studentName: z.string().min(1, "Please enter your name."),
  studentId: z.string().min(1, "Please enter your student ID."),
  companyName: z.string().min(1, "Please enter the company name."),
  internshipRole: z.string().min(1, "Please enter your role."),
  internshipPeriod: z.string().min(1, "Please enter the internship period."),
  companyOverview: z.string().min(20, "Please provide a brief company overview."),
  projectTitle: z.string().min(1, "Please enter your project title."),
  projectObjectives: z.string().min(20, "Please describe the project objectives."),
  tasksAndResponsibilities: z.string().min(20, "Please describe your tasks."),
  keyLearnings: z.string().min(20, "Please describe your key learnings."),
  challengesFaced: z.string().min(20, "Please describe the challenges you faced."),
  conclusion: z.string().min(20, "Please provide a conclusion."),
  feedbackFormDataUri: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function SipReportGeneratorTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateSipReportOutput | null>(null);
  const { toast } = useToast();
  const [feedbackFileName, setFeedbackFileName] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        studentName: '',
        studentId: '',
        companyName: '',
        internshipRole: '',
        internshipPeriod: '',
        companyOverview: '',
        projectTitle: '',
        projectObjectives: '',
        tasksAndResponsibilities: '',
        keyLearnings: '',
        challengesFaced: '',
        conclusion: '',
        feedbackFormDataUri: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit for Genkit
        toast({ variant: "destructive", title: "File too large", description: "Please upload a document smaller than 4MB."});
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        form.setValue('feedbackFormDataUri', dataUri);
        setFeedbackFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };


  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleGenerateSipReportAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
      toast({ title: 'Report Generated', description: 'Your SIP report has been created successfully.' });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error generating report',
        description: response.error,
      });
    }
  }

  const handleDownloadPdf = () => {
    if (!result) return;
    
    const doc = new jsPDF({
        unit: 'pt',
        format: 'a4'
    });
    const margin = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    const usableWidth = pageWidth - 2 * margin;
    let y = margin;

    const addText = (text: string, options: any) => {
        const lines = doc.splitTextToSize(text, usableWidth);
        const textHeight = doc.getTextDimensions(lines).h;
        if (y + textHeight > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            y = margin;
        }
        doc.text(lines, margin, y, options);
        y += textHeight + (options.mb || 5);
    }

    doc.setFont('times', 'normal');

    // Title
    doc.setFontSize(22).setFont(undefined, 'bold');
    addText(result.title, { align: 'center', mb: 20 });
    
    // Executive Summary
    doc.setFontSize(16).setFont(undefined, 'bold');
    addText('Executive Summary', { mb: 10 });
    doc.setFontSize(12).setFont(undefined, 'normal');
    addText(result.executiveSummary, { mb: 15 });

    // Sections
    result.sections.forEach(section => {
        doc.setFontSize(16).setFont(undefined, 'bold');
        addText(section.title, { mb: 10 });
        doc.setFontSize(12).setFont(undefined, 'normal');
        addText(section.content.replace(/(\r\n|\n|\r)/gm, " "), { mb: 15 });
    });

    doc.save(`${result.title.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">SIP Report Generator</h1>
        <p className="text-muted-foreground">
          Fill in the details of your internship to generate a professional report.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Internship Details</CardTitle>
          <CardDescription>
            Provide the information below to create your report.
          </CardDescription>
        </CardHeader>
        <CardContent>
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="studentName" render={({ field }) => ( <FormItem> <FormLabel>Student Name</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="studentId" render={({ field }) => ( <FormItem> <FormLabel>Student ID</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="companyName" render={({ field }) => ( <FormItem> <FormLabel>Company Name</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="internshipRole" render={({ field }) => ( <FormItem> <FormLabel>Your Role</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                  </div>
                   <FormField control={form.control} name="internshipPeriod" render={({ field }) => ( <FormItem> <FormLabel>Internship Period</FormLabel> <FormControl><Input placeholder="e.g., June 2023 - August 2023" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                   <FormField control={form.control} name="projectTitle" render={({ field }) => ( <FormItem> <FormLabel>Project Title</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                   <FormField control={form.control} name="companyOverview" render={({ field }) => ( <FormItem> <FormLabel>Company Overview</FormLabel> <FormControl><Textarea rows={3} {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                   <FormField control={form.control} name="projectObjectives" render={({ field }) => ( <FormItem> <FormLabel>Project Objectives</FormLabel> <FormControl><Textarea rows={4} {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                   <FormField control={form.control} name="tasksAndResponsibilities" render={({ field }) => ( <FormItem> <FormLabel>Tasks and Responsibilities</FormLabel> <FormControl><Textarea rows={4} {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                   <FormField control={form.control} name="keyLearnings" render={({ field }) => ( <FormItem> <FormLabel>Key Learnings</FormLabel> <FormControl><Textarea rows={4} {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                   <FormField control={form.control} name="challengesFaced" render={({ field }) => ( <FormItem> <FormLabel>Challenges Faced</FormLabel> <FormControl><Textarea rows={4} {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                   <FormField control={form.control} name="conclusion" render={({ field }) => ( <FormItem> <FormLabel>Conclusion</FormLabel> <FormControl><Textarea rows={4} {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                   
                   <FormField
                        control={form.control}
                        name="feedbackFormDataUri"
                        render={() => (
                        <FormItem>
                            <FormLabel>Intern Feedback Form (Optional)</FormLabel>
                            <FormControl>
                            <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center">
                                {feedbackFileName ? (
                                <div className='flex flex-col items-center gap-2'>
                                    <FileText className="w-12 h-12 text-accent" />
                                    <p className='text-sm font-medium'>{feedbackFileName}</p>
                                    <Button variant="link" size="sm" asChild className='p-0 h-auto'>
                                    <label htmlFor="feedback-upload" className="cursor-pointer">Change file</label>
                                    </Button>
                                </div>
                                ) : (
                                <>
                                    <UploadCloud className="w-12 h-12 text-muted-foreground" />
                                    <p className="mt-2 text-sm text-muted-foreground">
                                    <label htmlFor="feedback-upload" className="font-semibold text-accent cursor-pointer hover:underline">
                                        Click to upload
                                    </label>
                                    {' '}or drag and drop
                                    </p>
                                    <p className="text-xs text-muted-foreground">PDF, DOCX, TXT up to 4MB</p>
                                </>
                                )}
                                <Input id="feedback-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" />
                            </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />


                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : 'Generate Report'}
                  </Button>
                </form>
              </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Generating SIP Report...</CardTitle>
            <CardDescription>The AI is writing your report. This may take a moment.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
            <Skeleton className="h-6 w-1/2" />
             <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>{result.title}</CardTitle>
            <CardDescription>Your generated SIP report is ready. Review the content below.</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-6">
            <div>
                <h2 className='text-xl font-bold'>Executive Summary</h2>
                <p className="whitespace-pre-wrap">{result.executiveSummary}</p>
            </div>
            {result.sections.map((section, index) => (
                <div key={index}>
                    <h2 className='text-xl font-bold'>{section.title}</h2>
                    <p className="whitespace-pre-wrap">{section.content}</p>
                </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button onClick={handleDownloadPdf}>
              <Download className="mr-2 h-4 w-4" />
              Download as PDF
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
