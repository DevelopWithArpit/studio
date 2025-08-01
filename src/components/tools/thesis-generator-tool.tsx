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
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleGenerateThesisAction } from '@/app/actions';
import type { GenerateThesisOutput } from '@/ai/flows/thesis-generator-tool';
import { Download, Loader2 } from 'lucide-react';

const formSchema = z.object({
  topic: z.string().min(10, 'Please enter a topic of at least 10 characters.'),
  researchNotes: z.string().optional(),
  numChapters: z.number().int().min(1, "Must be at least 1 chapter.").max(10, "Cannot exceed 10 chapters."),
});

type FormData = z.infer<typeof formSchema>;

export default function ThesisGeneratorTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateThesisOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      researchNotes: '',
      numChapters: 3,
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleGenerateThesisAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
      toast({ title: 'Thesis Generated', description: 'Your thesis content has been created successfully.' });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error generating thesis',
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

    const addText = (text: string, options: any) => {
        const lines = doc.splitTextToSize(text, usableWidth);
        doc.text(lines, margin, y, options);
        y += (doc.getTextDimensions(lines).h) + 5;
    }

    const checkNewPage = () => {
        if (y > pageHeight - margin) {
            doc.addPage();
            y = margin;
        }
    }

    // Title
    doc.setFontSize(22).setFont('helvetica', 'bold');
    addText(result.title, { align: 'center' });
    y += 10;
    
    // Introduction
    checkNewPage();
    doc.setFontSize(16).setFont('helvetica', 'bold');
    addText('Introduction', {});
    doc.setFontSize(12).setFont('helvetica', 'normal');
    addText(result.introduction.replace(/###|##|#/g, ''), {}); // Simple markdown removal
    y += 5;

    // Chapters
    result.chapters.forEach(chapter => {
        checkNewPage();
        doc.setFontSize(16).setFont('helvetica', 'bold');
        addText(chapter.title, {});
        doc.setFontSize(12).setFont('helvetica', 'normal');
        addText(chapter.content.replace(/###|##|#/g, ''), {});
        y += 5;
    });

    // Conclusion
    checkNewPage();
    doc.setFontSize(16).setFont('helvetica', 'bold');
    addText('Conclusion', {});
    doc.setFontSize(12).setFont('helvetica', 'normal');
    addText(result.conclusion.replace(/###|##|#/g, ''), {});

    doc.save(`${result.title.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Thesis Generator</h1>
        <p className="text-muted-foreground">
          Generate a structured thesis with an introduction, chapters, and a conclusion.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Generate Thesis</CardTitle>
          <CardDescription>
            Provide your topic, research notes, and desired number of chapters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thesis Topic / Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., The Impact of Artificial Intelligence on Modern Software Development"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="numChapters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Body Chapters</FormLabel>
                    <FormControl>
                       <Input type="number" min="1" max="10" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="researchNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Research Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide any key points, sources, or specific information you want included in the thesis..."
                        {...field}
                        rows={10}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : 'Generate Thesis'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Generating Thesis Content...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
            <Skeleton className="h-6 w-1/2" />
             <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>{result.title}</CardTitle>
            <CardDescription>Your generated thesis is ready. Review the content below.</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-6">
            <div>
                <h2 className='text-xl font-bold'>Introduction</h2>
                <p className="whitespace-pre-wrap">{result.introduction}</p>
            </div>
            {result.chapters.map((chapter, index) => (
                <div key={index}>
                    <h2 className='text-xl font-bold'>{chapter.title}</h2>
                    <p className="whitespace-pre-wrap">{chapter.content}</p>
                </div>
            ))}
             <div>
                <h2 className='text-xl font-bold'>Conclusion</h2>
                <p className="whitespace-pre-wrap">{result.conclusion}</p>
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
