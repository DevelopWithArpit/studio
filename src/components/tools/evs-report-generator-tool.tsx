
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Image from 'next/image';
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
import { handleGenerateEvsReportAction } from '@/app/actions';
import type { GenerateEvsReportOutput } from '@/ai/flows/evs-report-generator-tool';
import { Download, FileText, Loader2, UploadCloud } from 'lucide-react';
import { RobotsBuildingLoader } from '../ui/robots-building-loader';

const formSchema = z.object({
  reportImageDataUri: z.string().min(1, 'Please upload the report image.'),
});

type FormData = z.infer<typeof formSchema>;

export default function EvsReportGeneratorTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateEvsReportOutput | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reportImageDataUri: '',
    },
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit for Genkit
        toast({ variant: "destructive", title: "File too large", description: "Please upload an image smaller than 4MB."});
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        form.setValue('reportImageDataUri', dataUri);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleGenerateEvsReportAction(data);
    setIsLoading(false);

    if (response.success && response.data) {
      setResult(response.data);
      toast({ title: 'Report Generated', description: 'Your EVS report has been created successfully.' });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Generating Report',
        description: response.error,
      });
    }
  }

  const handleDownloadPdf = () => {
    if (!result) return;
    
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = margin;

    // Title
    doc.setFontSize(16).setFont('helvetica', 'bold');
    doc.text(result.collegeName, pageWidth / 2, y, { align: 'center' });
    y += 7;
    doc.setFontSize(14);
    doc.text(result.department, pageWidth / 2, y, { align: 'center' });
    y += 7;
    doc.setFontSize(12).setFont('helvetica', 'normal');
    doc.text('EVS Activity Report', pageWidth / 2, y, { align: 'center' });
    y += 10;
    
    // Cover Image
    doc.addImage(result.reportImageUrl, 'PNG', margin, y, pageWidth - (margin * 2), 80);
    y += 90;

    // Metadata
    doc.setFontSize(11).setFont('helvetica', 'bold');
    doc.text('Session:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(result.session, margin + 25, y);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Faculty Name:', pageWidth / 2, y);
    doc.setFont('helvetica', 'normal');
    doc.text(result.facultyName, pageWidth / 2 + 35, y);
    y += 7;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Semester:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(result.semester, margin + 25, y);

    doc.setFont('helvetica', 'bold');
    doc.text('Date:', pageWidth / 2, y);
    doc.setFont('helvetica', 'normal');
    doc.text(result.date, pageWidth / 2 + 35, y);
    y += 15;

    // Plant Information
    doc.setFontSize(12).setFont('helvetica', 'bold');
    doc.text('Name of the Plant Submitted:', margin, y);
    y += 7;
    doc.setFontSize(11).setFont('helvetica', 'normal');
    doc.text(result.plantName, margin, y);
    y += 10;

    doc.setFontSize(12).setFont('helvetica', 'bold');
    doc.text('Information about the Plant:', margin, y);
    y += 7;
    doc.setFontSize(11).setFont('helvetica', 'normal');
    doc.text(doc.splitTextToSize(result.plantInfo, pageWidth - margin * 2), margin, y);
    y += (doc.getTextDimensions(doc.splitTextToSize(result.plantInfo, pageWidth - margin * 2)).h) + 5;


    // Benefits
    doc.setFontSize(12).setFont('helvetica', 'bold');
    doc.text('Benefits:', margin, y);
    y += 7;
    result.benefits.forEach(benefit => {
        doc.setFontSize(11).setFont('helvetica', 'normal');
        doc.text(`• ${benefit}`, margin + 5, y);
        y += 6;
    });
    y += 5;

    // Nutrient Composition
    doc.setFontSize(12).setFont('helvetica', 'bold');
    doc.text('Nutrient Composition:', margin, y);
    y+= 7;
    doc.setFontSize(11).setFont('helvetica', 'normal');
    doc.text(doc.splitTextToSize(result.nutrientComposition, pageWidth - margin * 2), margin, y);
    y += (doc.getTextDimensions(doc.splitTextToSize(result.nutrientComposition, pageWidth - margin * 2)).h) + 10;
    
    // Submitted by
    doc.setFontSize(12).setFont('helvetica', 'bold');
    doc.text('Submitted By:', margin, y);
    y += 10;

    (doc as any).autoTable({
        startY: y,
        head: [['Student Name', 'Roll Number']],
        body: result.students.map(s => [s.name, s.rollNumber]),
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] },
        margin: { left: margin, right: margin }
    });
    
    doc.save(`EVS_Report_${result.plantName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">EVS Report Generator</h1>
        <p className="text-muted-foreground">
          Upload an image of your EVS activity sheet to generate a professional report.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Generate EVS Report</CardTitle>
          <CardDescription>
            The AI will analyze your image and create a structured PDF report.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="reportImageDataUri"
                render={() => (
                  <FormItem>
                    <FormLabel>EVS Report Image</FormLabel>
                    <FormControl>
                      <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center h-64">
                        {form.getValues('reportImageDataUri') ? (
                          <Image src={form.getValues('reportImageDataUri')} alt="Report preview" layout="fill" objectFit="contain" className="rounded-md" />
                        ) : (
                          <>
                            <UploadCloud className="w-12 h-12 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">
                              <label htmlFor="file-upload" className="font-semibold text-accent cursor-pointer hover:underline">
                                Click to upload
                              </label>
                              {' '}or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">Image file up to 4MB</p>
                          </>
                        )}
                        <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading || !form.formState.isValid}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : 'Generate Report'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Generating Report...</CardTitle>
            <CardDescription>The AI is analyzing your document and generating the report.</CardDescription>
          </CardHeader>
          <CardContent>
            <RobotsBuildingLoader />
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Report Generated Successfully</CardTitle>
            <CardDescription>Review the extracted information and download your PDF report.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-bold text-lg mb-2">{result.collegeName}</h3>
                    <p className="text-sm text-muted-foreground">{result.department}</p>
                    <p className="text-sm text-muted-foreground">Session: {result.session} | Semester: {result.semester}</p>
                    <p className="text-sm text-muted-foreground">Faculty: {result.facultyName} | Date: {result.date}</p>
                </div>
                 <div className="flex justify-center items-center bg-muted rounded-lg overflow-hidden">
                    <Image src={result.reportImageUrl} alt={result.plantName} width={200} height={200} className="object-cover"/>
                </div>
            </div>
             <div className="space-y-4">
                <div>
                    <h4 className="font-semibold">Plant Name</h4>
                    <p className="text-muted-foreground">{result.plantName}</p>
                </div>
                 <div>
                    <h4 className="font-semibold">Information</h4>
                    <p className="text-muted-foreground text-sm">{result.plantInfo}</p>
                </div>
                 <div>
                    <h4 className="font-semibold">Benefits</h4>
                    <ul className="list-disc list-inside text-muted-foreground text-sm">
                        {result.benefits.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                </div>
                 <div>
                    <h4 className="font-semibold">Nutrient Composition</h4>
                    <p className="text-muted-foreground text-sm">{result.nutrientComposition}</p>
                </div>
                 <div>
                    <h4 className="font-semibold">Submitted By</h4>
                    <ul className="list-disc list-inside text-muted-foreground text-sm">
                        {result.students.map((s, i) => <li key={i}>{s.name} ({s.rollNumber})</li>)}
                    </ul>
                </div>
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
