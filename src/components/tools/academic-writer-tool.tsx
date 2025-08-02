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
import { handleGenerateAcademicDocumentAction } from '@/app/actions';
import type { GenerateAcademicDocumentOutput } from '@/ai/flows/academic-writer-tool';
import { Download, Loader2 } from 'lucide-react';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  topic: z.string().min(5, 'Please enter a topic.'),
  structure: z.string().min(10, 'Please provide an outline or structure.'),
});

type FormData = z.infer<typeof formSchema>;

export default function AcademicWriterTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateAcademicDocumentOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      structure: '',
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleGenerateAcademicDocumentAction(data);
    setIsLoading(false);

    if (response.success) {
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
    
    const doc = new jsPDF({
        unit: 'pt',
        format: 'a4'
    });
    const margin = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    const usableWidth = pageWidth - 2 * margin;
    let y = margin;

    const addText = (text: string, options: any, isHtml = false) => {
        const lines = doc.splitTextToSize(text, usableWidth);
        const textHeight = doc.getTextDimensions(lines).h;
        if (y + textHeight > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            y = margin;
        }

        if (isHtml) {
            doc.html(text, {
                x: margin,
                y: y,
                width: usableWidth,
                windowWidth: usableWidth,
                callback: (doc) => {
                   // This callback structure is for complex async html rendering
                }
            });
             y += textHeight + 10;
        } else {
             doc.text(lines, margin, y, options);
             y += textHeight + 5;
        }
    }

    // Title
    doc.setFontSize(22).setFont('times', 'bold');
    addText(result.title, { align: 'center' });
    y += 20;
    
    const renderMarkdown = (markdownText: string) => {
        const sections = markdownText.split(/(#{1,3}\s.*)/g).filter(Boolean);
        sections.forEach(section => {
            if (section.startsWith('### ')) {
                doc.setFontSize(14).setFont('times', 'bold');
                addText(section.replace('### ', ''), {});
            } else if (section.startsWith('## ')) {
                doc.setFontSize(16).setFont('times', 'bold');
                addText(section.replace('## ', ''), {});
            } else if (section.startsWith('# ')) {
                 doc.setFontSize(18).setFont('times', 'bold');
                addText(section.replace('# ', ''), {});
            } else {
                doc.setFontSize(12).setFont('times', 'normal');
                addText(section.trim(), {});
            }
            y += 2;
        });
    }

    // Introduction
    doc.setFontSize(18).setFont('times', 'bold');
    addText('Introduction', {});
    renderMarkdown(result.introduction);
    y += 10;

    // Chapters
    result.chapters.forEach(chapter => {
        doc.setFontSize(18).setFont('times', 'bold');
        addText(chapter.title, {});
        renderMarkdown(chapter.content);
        y += 10;
    });

    // Conclusion
    doc.setFontSize(18).setFont('times', 'bold');
    addText('Conclusion', {});
    renderMarkdown(result.conclusion);

    doc.save(`${result.title.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Academic Writer</h1>
        <p className="text-muted-foreground">
          Generate a structured academic document from your topic and outline, with AI-powered web research.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Generate Document</CardTitle>
          <CardDescription>
            Provide the key components of your paper and the AI will research and write it for you.
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
                    <FormLabel>Topic / Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., The Impact of AI on Modern Software Development" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="structure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Structure / Outline</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g.,&#10;Chapter 1: Introduction&#10;Chapter 2: Literature Review&#10;Chapter 3: Methodology" {...field} rows={5}/>
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
          <CardHeader>
            <CardTitle>Generating Document Content...</CardTitle>
            <CardDescription>The AI is researching and writing your document. This may take a moment.</CardDescription>
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
            <CardDescription>Your generated document is ready. Review the content below.</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-6">
            <div>
                <h2 className='text-xl font-bold'>Introduction</h2>
                <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: result.introduction.replace(/(#{1,3}\s)/g, '<strong>').replace(/\n/g, '<br />') }} />
            </div>
            {result.chapters.map((chapter, index) => (
                <div key={index}>
                    <h2 className='text-xl font-bold'>{chapter.title}</h2>
                    <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: chapter.content.replace(/(#{1,3}\s)/g, '<strong>').replace(/\n/g, '<br />') }} />
                </div>
            ))}
             <div>
                <h2 className='text-xl font-bold'>Conclusion</h2>
                <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: result.conclusion.replace(/(#{1,3}\s)/g, '<strong>').replace(/\n/g, '<br />') }} />
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
