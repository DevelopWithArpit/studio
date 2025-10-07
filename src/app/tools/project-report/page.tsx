
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Packer, Document, Paragraph, TextRun, HeadingLevel, AlignmentType, PageOrientation, Table, TableRow, TableCell, WidthType, BorderStyle, PageNumber, ISectionOptions, SectionType, ImageRun } from 'docx';
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
import type { GenerateProjectReportOutput } from '@/ai/flows/project-report-generator-tool';
import { Download, FileCode, Loader2, Image as ImageIconLucide } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import jsPDF from 'jspdf';


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
  section: z.string().optional(),
});

export type GenerateProjectReportInput = z.infer<typeof formSchema>;

export default function ProjectReportGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateProjectReportOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<GenerateProjectReportInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: 'WATER MAN OF INDIA LIFE AND ACHEIVEMENT',
      collegeName: "PRIYADARSHANI COLLEGE OF ENGINEERING, NAGPUR",
      departmentName: 'COMPUTER TECHNOLOGY',
      semester: '3rd',
      year: '2nd',
      subject: 'Environment and Sustainability',
      studentName: 'AMAN ABDUL SHEIKH',
      rollNumber: '163',
      guideName: 'PROF. JAYASHREE KANFADE MAM',
      numPages: 8,
      section: 'A',
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
    
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const {
      collegeName, departmentName, subject, studentName, rollNumber, guideName, topic, section, year, semester
    } = form.getValues();

    // --- Title Page ---
    doc.setFontSize(14).setFont('helvetica', 'normal');
    doc.text("LOKMANYA TILAK JANKALYAN SHIKSHAN SANSTHA'S", pageWidth / 2, 30, { align: 'center' });
    
    doc.setFontSize(22).setFont('helvetica', 'bold');
    doc.text(collegeName.toUpperCase(), pageWidth / 2, 45, { align: 'center' });
    
    doc.setFontSize(10).setFont('helvetica', 'normal');
    doc.text('(AN AUTONOMOUS INSTITUTE AFFILIATED TO RASHTRASANT TUKDOJI MAHARAJ NAGPUR UNIVERSITY)', pageWidth / 2, 53, { align: 'center' });
    
    doc.setFontSize(20).setFont('helvetica', 'bold');
    doc.text(`DEPARTMENT OF ${departmentName.toUpperCase()}`, pageWidth / 2, 68, { align: 'center' });

    doc.setFontSize(16).setFont('helvetica', 'normal');
    doc.text('TOPIC OF THE PROJECT:', pageWidth / 2, 90, { align: 'center' });
    doc.setFontSize(20).setFont('helvetica', 'bold');
    doc.text(topic.toUpperCase(), pageWidth / 2, 100, { align: 'center' });

    doc.setFontSize(16).setFont('helvetica', 'normal');
    doc.text('PRESENTED BY:', pageWidth / 2, 125, { align: 'center' });
    doc.setFontSize(18).setFont('helvetica', 'bold');
    doc.text(studentName.toUpperCase(), pageWidth / 2, 135, { align: 'center' });

    let yPos = 160;
    const leftMargin = 20;
    const rightMargin = pageWidth - 20;
    
    doc.setFontSize(14).setFont('helvetica', 'normal');
    doc.text(`Semester: ${semester}`, leftMargin, yPos);
    doc.text(`Year: ${year}`, leftMargin, yPos + 7);
    doc.text(`Subject: ${subject}`, leftMargin, yPos + 14);
    if(section) doc.text(`Section: ${section}`, leftMargin, yPos + 21);
    doc.text(`Roll No:-${rollNumber}`, leftMargin, yPos + 28);
    
    doc.text('GUIDED BY:', rightMargin, yPos + 14, { align: 'right' });
    doc.setFontSize(14).setFont('helvetica', 'bold');
    doc.text(guideName.toUpperCase(), rightMargin, yPos + 21, { align: 'right' });
    
    doc.addPage();
    doc.save(`${topic.replace(/\s+/g, '_')}.pdf`);
    toast({ title: "PDF Downloaded", description: "Your project report has been downloaded." });
  };

  const handleDownloadDocx = async () => {
    if (!result) return;
    const {
      topic, collegeName, departmentName, semester, year, subject, studentName, rollNumber, guideName, section
    } = form.getValues();

    const createBodyText = (text: string) => {
        if (!text || text.trim() === '') return [];
        return text.split('\n').filter(p => p.trim() !== '').map(p => new Paragraph({ text: p.trim(), spacing: { after: 150 } }));
    };
    
    const allSections = [result.introduction, ...result.chapters, result.conclusion];
    const imagePromises = allSections.map(async (chapter) => {
        if (chapter && chapter.imageUrl) {
            try {
                const response = await fetch(chapter.imageUrl);
                 if (!response.ok) return null;
                return response.arrayBuffer();
            } catch (error) {
                console.error("Failed to fetch image for DOCX:", error);
                return null;
            }
        }
        return null;
    });
    
    const imageBuffers = await Promise.all(imagePromises);

    const titlePage = [
        new Paragraph({ text: "LOKMANYA TILAK JANKALYAN SHIKSHAN SANSTHA'S", alignment: AlignmentType.CENTER, spacing: { after: 200 } }),
        new Paragraph({ text: collegeName.toUpperCase(), bold: true, alignment: AlignmentType.CENTER, style: 'Title' }),
        new Paragraph({ text: "(AN AUTONOMOUS INSTITUTE AFFILIATED TO RASHTRASANT TUKDOJI MAHARAJ NAGPUR UNIVERSITY)", alignment: AlignmentType.CENTER, style: 'IntenseQuote' }),
        new Paragraph({ text: `DEPARTMENT OF ${departmentName.toUpperCase()}`, bold: true, alignment: AlignmentType.CENTER, style: 'Title', spacing: { before: 200, after: 600 } }),
        new Paragraph({ text: "TOPIC OF THE PROJECT:", alignment: AlignmentType.CENTER, style: 'Heading2', spacing: { after: 100 } }),
        new Paragraph({ text: topic.toUpperCase(), bold: true, alignment: AlignmentType.CENTER, style: 'Title', spacing: { after: 600 } }),
        new Paragraph({ text: "PRESENTED BY:", alignment: AlignmentType.CENTER, style: 'Heading2', spacing: { after: 100 } }),
        new Paragraph({ text: studentName.toUpperCase(), bold: true, alignment: AlignmentType.CENTER, style: 'Title', spacing: { after: 800 } }),
        new Table({
            columnWidths: [4500, 4500],
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, inside: { style: BorderStyle.NONE } },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                new Paragraph(`Semester: ${semester}`),
                                new Paragraph(`Year: ${year}`),
                                new Paragraph(`Subject: ${subject}`),
                                ...(section ? [new Paragraph(`Section: ${section}`)] : []),
                                new Paragraph(`Roll No:-${rollNumber}`),
                            ],
                            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({ text: "GUIDED BY:", alignment: AlignmentType.RIGHT }),
                                new Paragraph({ text: guideName.toUpperCase(), bold: true, alignment: AlignmentType.RIGHT }),
                            ],
                             borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                        }),
                    ],
                }),
            ],
        }),
    ];

    const contentPages = allSections.flatMap((chapter, index) => {
        if (!chapter) return [];
        const imageBuffer = imageBuffers[index];
        const chapterContent = [
            new Paragraph({ text: chapter.title, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, spacing: { before: 400, after: 200 } }),
            ...createBodyText(chapter.content),
        ];

        if (imageBuffer) {
            chapterContent.push(new Paragraph({
                children: [
                    new ImageRun({
                        data: imageBuffer,
                        transformation: { width: 450, height: 253 }, // 16:9 aspect ratio
                    })
                ],
                alignment: AlignmentType.CENTER,
                spacing: { before: 200, after: 200 }
            }));
        }
        return chapterContent;
    });


    const doc = new Document({
        creator: "AI Mentor",
        title: `Project Report: ${topic}`,
        sections: [
            { properties: { type: SectionType.NEXT_PAGE, pageSize: { width: 16838, height: 11906, orientation: PageOrientation.LANDSCAPE }, margin: { top: 720, right: 720, bottom: 720, left: 720 } }, children: titlePage },
            { properties: { type: SectionType.NEXT_PAGE, pageSize: { width: 11906, height: 16838, orientation: PageOrientation.PORTRAIT }, margin: { top: 720, right: 720, bottom: 720, left: 720 } }, children: contentPages },
        ],
    });

    Packer.toBlob(doc).then(blob => {
        saveAs(blob, `${topic.replace(/\s+/g, '_')}.docx`);
        toast({ title: "DOCX Downloaded", description: "Your project report has been saved as an editable DOCX file." });
    });
  };

  const cleanContent = (text: string | undefined) => {
    if (!text) return '';
    return text.replace(/```(json)?/g, '').replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/##+\s?/g, '');
  };
  
  const allSections = result ? [result.introduction, ...result.chapters, result.conclusion] : [];

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
                <FormField control={form.control} name="section" render={({ field }) => ( <FormItem> <FormLabel>Section (Optional)</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
              
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
                {allSections.map((item, index) => (
                  item && (
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
                                <p className="whitespace-pre-wrap">{cleanContent(item.content)}</p>
                              </div>
                            </div>
                            <div className="bg-muted flex items-center justify-center overflow-hidden relative">
                              {item.imageUrl ? (
                                <Image
                                  src={item.imageUrl}
                                  alt={`Illustration for ${item.title}`}
                                  layout="fill"
                                  objectFit="cover"
                                  className="w-full h-full"
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
                  )
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
