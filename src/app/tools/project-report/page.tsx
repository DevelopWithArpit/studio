
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import jsPDF from 'jspdf';
import Image from 'next/image';
import { Packer, Document, Paragraph, TextRun, HeadingLevel, AlignmentType, PageOrientation } from 'docx';
import { saveAs } from 'file-saver';
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
import { handleGenerateProjectReportAction } from '@/app/actions';
import { type GenerateProjectReportOutput, type GenerateProjectReportInput } from '@/ai/flows/project-report-generator-tool';
import { Download, FileCode, Loader2, Image as ImageIconLucide } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  topic: z.string().min(1, "Project topic is required."),
  collegeName: z.string().min(1, "College name is required."),
  departmentName: z.string().min(1, "Department name is required."),
  semester: z.string().min(1, "Semester is required."),
  year: z.string().min(1, "Year is required."),
  subject: z.string().min(1, "Subject is required."),
  studentName: z.string().min(1, "Student name is required."),
  rollNumber: z.string().min(1, "Roll number is required."),
  guideName: z.string().min(1, "Guide's name is required."),
  numPages: z.coerce.number().int().min(2, "Must be at least 2 pages.").max(15, "Cannot exceed 15 pages."),
});

type FormData = z.infer<typeof formSchema>;

export default function ProjectReportGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateProjectReportOutput | null>(null);
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
      numPages: 8,
    },
  });
  
  async function onSubmit(data: GenerateProjectReportInput) {
    setIsLoading(true);
    setResult(null);
    const response = await handleGenerateProjectReportAction(data);
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
    
    const doc = new jsPDF({ orientation: 'landscape' });
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const usableWidth = pageWidth - 2 * margin;
    let y = margin;
    const {
      topic, collegeName, departmentName, semester, year, subject, studentName, rollNumber, guideName
    } = form.getValues();

    // --- Title Page ---
    doc.setFontSize(36).setFont('helvetica', 'bold');
    doc.text(collegeName, pageWidth / 2, 60, { align: 'center' });
    doc.setFontSize(22);
    doc.text(`Department of ${departmentName}`, pageWidth / 2, 75, { align: 'center' });
    doc.text(`(${year})`, pageWidth / 2, 85, { align: 'center' });

    doc.setFontSize(28).setFont('helvetica', 'bold');
    const titleLines = doc.splitTextToSize(topic, usableWidth - 40);
    doc.text(titleLines, pageWidth / 2, 120, { align: 'center' });

    doc.setFontSize(16).setFont('helvetica', 'normal');
    doc.text(`A Project Report submitted for the subject`, pageWidth / 2, 145, { align: 'center' });
    doc.setFontSize(18).setFont('helvetica', 'bold');
    doc.text(subject, pageWidth / 2, 155, { align: 'center' });
    
    doc.setFontSize(14).setFont('helvetica', 'normal');
    doc.text('Submitted by:', margin, 190);
    doc.setFontSize(16).setFont('helvetica', 'bold');
    doc.text(studentName, margin, 198);
    doc.setFontSize(14).setFont('helvetica', 'normal');
    doc.text(`Roll No: ${rollNumber}`, margin, 206);

    doc.setFontSize(14).setFont('helvetica', 'normal');
    doc.text('Guided by:', pageWidth - margin, 190, { align: 'right' });
    doc.setFontSize(16).setFont('helvetica', 'bold');
    doc.text(guideName, pageWidth - margin, 198, { align: 'right' });


    // --- Content Pages ---
    doc.addPage();
    y = margin;

    const addContent = async (title: string, content: string, imageUrl?: string) => {
        if (y > margin) y += 10; // Add space before new section

        doc.setFontSize(18).setFont('helvetica', 'bold');
        let titleHeight = doc.getTextDimensions(title).h;
        if (y + titleHeight > pageHeight - margin) {
            doc.addPage(); y = margin;
        }
        doc.text(title, pageWidth / 2, y, { align: 'center' });
        y += titleHeight + 8;

        const contentLines = doc.splitTextToSize(content.replace(/###|##|#/g, ''), usableWidth * 0.5 - margin);
        const contentHeight = doc.getTextDimensions(contentLines).h;

        let imageSpaceNeeded = 100;
        if (imageUrl) {
            if (y + Math.max(contentHeight, imageSpaceNeeded) > pageHeight - margin) {
                doc.addPage(); y = margin;
            }
            
            try {
                const img = new Image();
                img.src = imageUrl;
                await new Promise(resolve => {
                    img.onload = resolve;
                    img.onerror = () => resolve(null);
                });
                if (img.complete && img.naturalHeight !== 0) {
                    const aspectRatio = img.width / img.height;
                    const imgWidth = usableWidth * 0.45;
                    const imgHeight = imgWidth / aspectRatio;
                    doc.addImage(imageUrl, 'PNG', pageWidth / 2 + margin / 2, y, imgWidth, imgHeight);
                }
            } catch (e) {
                console.error("Failed to load image for PDF", e);
            }
        }
        
        doc.setFontSize(12).setFont('helvetica', 'normal');
        doc.text(contentLines, margin, y);
        y += Math.max(contentHeight, imageUrl ? imageSpaceNeeded : 0) + 10;
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

  const handleDownloadDocx = () => {
    if (!result) return;
    const {
      topic, collegeName, departmentName, year, subject, studentName, rollNumber, guideName
    } = form.getValues();

    const createTitle = (text: string) => new Paragraph({ text, heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER, spacing: { after: 200 } });
    const createHeading = (text: string) => new Paragraph({ text, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, spacing: { before: 400, after: 200 } });
    const createBodyText = (text: string) => new Paragraph({ text, spacing: { after: 150 } });

    const titlePage = [
        new Paragraph({ text: collegeName, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
        new Paragraph({ text: `Department of ${departmentName}`, alignment: AlignmentType.CENTER }),
        new Paragraph({ text: `(${year})`, alignment: AlignmentType.CENTER, spacing: { after: 800 } }),
        createTitle(topic),
        new Paragraph({ text: `A Project Report submitted for the subject`, alignment: AlignmentType.CENTER }),
        new Paragraph({ text: subject, bold: true, alignment: AlignmentType.CENTER, spacing: { after: 2000 } }),
        new Paragraph({
            children: [
                new TextRun({ text: "Submitted by:\n", break: 1 }),
                new TextRun({ text: studentName, bold: true }),
                new TextRun(`\nRoll No: ${rollNumber}`),
            ],
            alignment: AlignmentType.LEFT,
        }),
        new Paragraph({
             children: [
                new TextRun({ text: "Guided by:\n", break: 1 }),
                new TextRun({ text: guideName, bold: true }),
            ],
            alignment: AlignmentType.RIGHT,
        }),
    ];

    const contentPages = [
        createHeading('Introduction'),
        ...result.introduction.split('\n').filter(p => p.trim() !== '').map(p => createBodyText(p)),
        ...result.chapters.flatMap(chapter => [
            createHeading(chapter.title),
            ...chapter.content.split('\n').filter(p => p.trim() !== '').map(p => createBodyText(p))
        ]),
        createHeading('Conclusion'),
        ...result.conclusion.split('\n').filter(p => p.trim() !== '').map(p => createBodyText(p)),
    ];

    const doc = new Document({
        creator: "AI Mentor",
        title: `Project Report: ${topic}`,
        sections: [
            { properties: { page: { margin: { top: 720, right: 720, bottom: 720, left: 720 }, orientation: PageOrientation.LANDSCAPE } }, children: titlePage },
            { properties: { page: { margin: { top: 720, right: 720, bottom: 720, left: 720 }, orientation: PageOrientation.LANDSCAPE } }, children: contentPages },
        ],
    });

    Packer.toBlob(doc).then(blob => {
        saveAs(blob, `${topic.replace(/\s+/g, '_')}.docx`);
        toast({ title: "DOCX Downloaded", description: "Your project report has been saved as an editable DOCX file." });
    });
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Project Report Generator</h1>
        <p className="text-muted-foreground">
          Generate a structured academic document from your project topic. The AI will research the topic for you.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Generate Project Report</CardTitle>
          <CardDescription>
            Fill in your project details and the AI will handle the research and writing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                 <FormField control={form.control} name="topic" render={({ field }) => ( <FormItem> <FormLabel>Project Topic</FormLabel> <FormControl><Textarea rows={2} placeholder="e.g., The Impact of AI on Modern Software Development" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="collegeName" render={({ field }) => ( <FormItem> <FormLabel>College Name</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="departmentName" render={({ field }) => ( <FormItem> <FormLabel>Department Name</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="semester" render={({ field }) => ( <FormItem> <FormLabel>Semester</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="year" render={({ field }) => ( <FormItem> <FormLabel>Year</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="subject" render={({ field }) => ( <FormItem> <FormLabel>Subject</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField
                      control={form.control}
                      name="numPages"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Pages</FormLabel>
                          <FormControl>
                            <Input type="number" min="2" max="15" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="studentName" render={({ field }) => ( <FormItem> <FormLabel>Student Name</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="rollNumber" render={({ field }) => ( <FormItem> <FormLabel>Roll Number</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="guideName" render={({ field }) => ( <FormItem> <FormLabel>Guide's Name</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                </div>
              
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
          <CardContent>
            <Carousel className="w-full">
              <CarouselContent>
                {[
                  { title: 'Introduction', content: result.introduction, imageUrl: null },
                  ...result.chapters,
                  { title: 'Conclusion', content: result.conclusion, imageUrl: null },
                ].map((item, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card className="overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 h-[500px]">
                          <div className="p-6 flex flex-col overflow-y-auto">
                            <Badge variant="outline" className="w-fit mb-4">
                              Page {index + 1}
                            </Badge>
                            <h3 className="text-2xl font-bold font-headline mb-4">{item.title}</h3>
                            <div className="prose prose-sm prose-invert max-w-none flex-1">
                              <p className="whitespace-pre-wrap">{item.content}</p>
                            </div>
                          </div>
                          <div className="bg-muted flex items-center justify-center overflow-hidden relative">
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl}
                                alt={`Illustration for ${item.title}`}
                                width={500}
                                height={500}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center text-muted-foreground">
                                <ImageIconLucide className="w-16 h-16" />
                                <p className="mt-2 text-sm font-semibold">No Image</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="ml-12" />
              <CarouselNext className="mr-12" />
            </Carousel>
          </CardContent>
          <CardFooter className="gap-2">
            <Button onClick={handleDownloadPdf}>
              <Download className="mr-2 h-4 w-4" />
              Download as PDF
            </Button>
            <Button onClick={handleDownloadDocx} variant="secondary">
              <FileCode className="mr-2 h-4 w-4" />
              Download as DOCX
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
