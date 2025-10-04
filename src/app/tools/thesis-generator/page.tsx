'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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
import { handleGenerateAcademicDocumentAction } from '@/app/actions';
import type { GenerateAcademicDocumentOutput, GenerateAcademicDocumentInput } from '@/ai/flows/thesis-generator-tool';
import { Download, FileText, Loader2, UploadCloud } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  topic: z.string().min(5, "Topic must be at least 5 characters."),
  collegeName: z.string().min(3, "College name is required."),
  departmentName: z.string().min(3, "Department name is required."),
  semester: z.string().min(1, "Semester is required."),
  year: z.string().min(4, "Year is required."),
  subject: z.string().min(3, "Subject is required."),
  studentName: z.string().min(3, "Student name is required."),
  rollNumber: z.string().min(1, "Roll number is required."),
  guideName: z.string().min(3, "Guide's name is required."),
  documentDataUri: z.string().min(1, 'Please upload your notes and outline document.'),
});

type FormData = z.infer<typeof formSchema>;

export default function ThesisGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateAcademicDocumentOutput | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      collegeName: '',
      departmentName: '',
      semester: '',
      year: '',
      subject: '',
      studentName: '',
      rollNumber: '',
      guideName: '',
      documentDataUri: '',
    },
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 200 * 1024 * 1024) { // 200MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload a document smaller than 200MB."});
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        form.setValue('documentDataUri', dataUri);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };


  async function onSubmit(data: GenerateAcademicDocumentInput) {
    setIsLoading(true);
    setResult(null);
    const response = await handleGenerateAcademicDocumentAction(data);
    setIsLoading(false);

    if (response.success && response.data) {
      setResult(response.data);
      toast({ title: 'Document Generated', description: 'Your academic document has been created successfully.' });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error generating document',
        description: response.error,
      });
    }
  }

  const handleDownloadPdf = () => {
    if (!result) return;
    
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const usableWidth = pageWidth - 2 * margin;
    let y = margin;
    const {
      topic, collegeName, departmentName, semester, year, subject, studentName, rollNumber, guideName
    } = form.getValues();

    // --- Title Page ---
    doc.setFontSize(24).setFont('helvetica', 'bold');
    doc.text(collegeName, pageWidth / 2, 40, { align: 'center' });
    doc.setFontSize(16);
    doc.text(`Department of ${departmentName}`, pageWidth / 2, 50, { align: 'center' });
    doc.text(`(${year})`, pageWidth / 2, 58, { align: 'center' });

    doc.setFontSize(22).setFont('helvetica', 'bold');
    const titleLines = doc.splitTextToSize(topic, usableWidth - 20);
    doc.text(titleLines, pageWidth / 2, 100, { align: 'center' });

    doc.setFontSize(14).setFont('helvetica', 'normal');
    doc.text(`A Project Report submitted for the subject`, pageWidth / 2, 125, { align: 'center' });
    doc.setFontSize(16).setFont('helvetica', 'bold');
    doc.text(subject, pageWidth / 2, 133, { align: 'center' });
    
    doc.setFontSize(14).setFont('helvetica', 'normal');
    doc.text('Submitted by:', margin, 180);
    doc.setFontSize(16).setFont('helvetica', 'bold');
    doc.text(studentName, margin, 188);
    doc.setFontSize(14).setFont('helvetica', 'normal');
    doc.text(`Roll No: ${rollNumber}`, margin, 196);

    doc.setFontSize(14).setFont('helvetica', 'normal');
    doc.text('Guided by:', pageWidth - margin, 180, { align: 'right' });
    doc.setFontSize(16).setFont('helvetica', 'bold');
    doc.text(guideName, pageWidth - margin, 188, { align: 'right' });


    // --- Content Pages ---
    doc.addPage();
    y = margin;

    const addContent = async (title: string, content: string, imageUrl?: string) => {
        if (y > margin) y += 10; // Add space before new section

        doc.setFontSize(16).setFont('helvetica', 'bold');
        let titleHeight = doc.getTextDimensions(title).h;
        if (y + titleHeight > pageHeight - margin) {
            doc.addPage(); y = margin;
        }
        doc.text(title, pageWidth / 2, y, { align: 'center' });
        y += titleHeight + 8;

        if (imageUrl) {
            try {
                const img = new Image();
                img.src = imageUrl;
                await new Promise(resolve => img.onload = resolve);
                const imgWidth = 100;
                const imgHeight = (img.height * imgWidth) / img.width;
                if (y + imgHeight > pageHeight - margin) {
                    doc.addPage(); y = margin;
                }
                doc.addImage(imageUrl, 'PNG', (pageWidth - imgWidth) / 2, y, imgWidth, imgHeight);
                y += imgHeight + 10;
            } catch (e) {
                console.error("Failed to load image for PDF", e);
            }
        }
        
        doc.setFontSize(12).setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(content.replace(/###|##|#/g, ''), usableWidth);
        const textHeight = doc.getTextDimensions(lines).h;
        if (y + textHeight > pageHeight - margin) {
            doc.addPage(); y = margin;
        }
        doc.text(lines, margin, y);
        y += textHeight + 5;
    };
    
    (async () => {
        await addContent('Introduction', result.introduction);
        for (const chapter of result.chapters) {
            await addContent(chapter.title, chapter.content, chapter.imageUrl);
        }
        await addContent('Conclusion', result.conclusion);

        doc.save(`${result.title.replace(/\s+/g, '_')}.pdf`);
        toast({ title: "PDF Downloaded", description: "Your project report has been downloaded." });
    })();
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Thesis Generator</h1>
        <p className="text-muted-foreground">
          Generate a structured academic document from your outline and research notes.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Generate Document</CardTitle>
          <CardDescription>
            Fill in your project details and upload a document with your outline and research notes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="collegeName" render={({ field }) => ( <FormItem> <FormLabel>College Name</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="departmentName" render={({ field }) => ( <FormItem> <FormLabel>Department Name</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="semester" render={({ field }) => ( <FormItem> <FormLabel>Semester</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="year" render={({ field }) => ( <FormItem> <FormLabel>Year</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="subject" render={({ field }) => ( <FormItem> <FormLabel>Subject</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                </div>
                 <FormField control={form.control} name="topic" render={({ field }) => ( <FormItem> <FormLabel>Project Topic</FormLabel> <FormControl><Textarea rows={2} {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="studentName" render={({ field }) => ( <FormItem> <FormLabel>Student Name</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="rollNumber" render={({ field }) => ( <FormItem> <FormLabel>Roll Number</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="guideName" render={({ field }) => ( <FormItem> <FormLabel>Guide's Name</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                </div>
               <FormField
                control={form.control}
                name="documentDataUri"
                render={() => (
                  <FormItem>
                    <FormLabel>Document Outline & Notes</FormLabel>
                     <FormControl>
                      <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center h-48">
                        {fileName ? (
                          <div className="flex flex-col items-center gap-2">
                            <FileText className="w-12 h-12 text-primary" />
                            <p className="text-sm font-medium">{fileName}</p>
                            <Button variant="link" size="sm" asChild className="p-0 h-auto">
                              <label htmlFor="file-upload" className="cursor-pointer">Change file</label>
                            </Button>
                          </div>
                        ) : (
                          <>
                            <UploadCloud className="w-12 h-12 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">
                              <label htmlFor="file-upload" className="font-semibold text-primary cursor-pointer hover:underline">Click to upload</label>{' '}or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">PDF, DOCX, TXT up to 200MB</p>
                          </>
                        )}
                        <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : 'Generate Document'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader><CardTitle>Generating Document Content...</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <div className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" /></div>
            <Skeleton className="h-6 w-1/2" />
            <div className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full" /></div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>{result.title}</CardTitle>
            <CardDescription>Your generated document is ready. Review the content below.</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-6">
            <div>
                <h2 className='text-xl font-bold'>Introduction</h2>
                <div dangerouslySetInnerHTML={{ __html: result.introduction.replace(/\n/g, '<br />') }} />
            </div>
            {result.chapters.map((chapter, index) => (
                <div key={index}>
                    <h2 className='text-xl font-bold'>{chapter.title}</h2>
                    {chapter.imageUrl && (
                        <div className="my-4">
                            <img src={chapter.imageUrl} alt={`Illustration for ${chapter.title}`} className="max-w-sm mx-auto rounded-md shadow-lg" />
                        </div>
                    )}
                    <div dangerouslySetInnerHTML={{ __html: chapter.content.replace(/\n/g, '<br />') }} />
                </div>
            ))}
             <div>
                <h2 className='text-xl font-bold'>Conclusion</h2>
                <div dangerouslySetInnerHTML={{ __html: result.conclusion.replace(/\n/g, '<br />') }} />
            </div>
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
