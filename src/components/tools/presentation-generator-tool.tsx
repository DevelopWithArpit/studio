'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import PptxGenJS from 'pptxgenjs';
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
import { handleGeneratePresentationAction } from '@/app/actions';
import type { GeneratePresentationOutput } from '@/ai/flows/presentation-generator-tool';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Download, ImageIcon } from 'lucide-react';

const formSchema = z.object({
  topic: z.string().min(3, 'Please enter a topic with at least 3 characters.'),
  numSlides: z.number().int().min(2, "Must be at least 2 slides.").max(10, "Cannot exceed 10 slides."),
  imageStyle: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function PresentationGeneratorTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeneratePresentationOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      numSlides: 5,
      imageStyle: 'photorealistic',
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleGeneratePresentationAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error generating presentation',
        description: response.error,
      });
    }
  }

  const handleDownload = () => {
    if (!result) return;

    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE';

    result.slides.forEach((slide, index) => {
      const pptxSlide = pptx.addSlide();

      // Title
      pptxSlide.addText(slide.title, { 
        x: 0.5, 
        y: 0.25, 
        w: '90%', 
        h: 1, 
        fontSize: 36, 
        bold: true, 
        color: '363636' 
      });

      if (index > 0 && index < result.slides.length -1) {
         // Image
        if (slide.imageUrl) {
            pptxSlide.addImage({
                data: slide.imageUrl,
                x: 5.0,
                y: 1.5,
                w: 4.5,
                h: 3.5,
            });
        }
    
        // Content
        pptxSlide.addText(slide.content.join('\n\n'), {
            x: 0.5,
            y: 1.5,
            w: 4.0,
            h: 3.5,
            fontSize: 18,
            bullet: true,
            color: '363636',
        });
      }
    });

    pptx.writeFile({ fileName: `${result.title}.pptx` });
  };


  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Presentation Generator</h1>
        <p className="text-muted-foreground">
          Create a full presentation with text and images from a single topic.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Generate a Presentation</CardTitle>
          <CardDescription>
            Provide a topic and our AI will generate an entire slide deck for you.
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
                    <FormLabel>Presentation Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., The Future of Renewable Energy" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="numSlides"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Slides</FormLabel>
                      <FormControl>
                        <Input type="number" min="2" max="10" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="imageStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image Style (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., minimalist, cartoon, abstract" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Presentation'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && <PresentationSkeleton />}

      {result && (
         <Card>
          <CardHeader>
            <CardTitle>{result.title}</CardTitle>
            <CardDescription>Your generated presentation is ready.</CardDescription>
          </CardHeader>
          <CardContent>
             <Carousel className="w-full">
                <CarouselContent>
                    {result.slides.map((slide, index) => (
                    <CarouselItem key={index}>
                        <div className="p-1">
                        <Card className="overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-2 h-[500px]">
                                <div className="p-6 flex flex-col">
                                    <Badge variant="outline" className="w-fit mb-4">Slide {index + 1}</Badge>
                                    <h3 className="text-2xl font-bold font-headline mb-4">{slide.title}</h3>
                                    <ul className="space-y-3 list-disc pl-5 text-muted-foreground flex-1">
                                        {slide.content.map((point, i) => <li key={i}>{point}</li>)}
                                    </ul>
                                </div>
                                <div className="bg-muted flex items-center justify-center overflow-hidden">
                                     {slide.imageUrl ? (
                                        <Image
                                            src={slide.imageUrl}
                                            alt={slide.title}
                                            width={500}
                                            height={500}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <ImageIcon className="w-16 h-16" />
                                            <p className="mt-2 text-sm">Image failed to generate</p>
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
          <CardFooter>
            <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4"/>
                Download Presentation
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}


function PresentationSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-3/5 rounded-md" />
                <Skeleton className="h-4 w-4/5 rounded-md" />
            </CardHeader>
            <CardContent>
                <div className="relative px-12">
                     <Card className="overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 h-[500px]">
                            <div className="p-6 flex flex-col">
                                <Skeleton className="h-6 w-16 mb-4 rounded-full" />
                                <Skeleton className="h-8 w-4/5 mb-6 rounded-md" />
                                <div className="space-y-4 flex-1">
                                    <Skeleton className="h-5 w-full rounded-md" />
                                    <Skeleton className="h-5 w-5/6 rounded-md" />
                                    <Skeleton className="h-5 w-full rounded-md" />
                                </div>
                            </div>
                            <div className="bg-muted flex items-center justify-center">
                                <Skeleton className="w-full h-full" />
                            </div>
                        </div>
                    </Card>
                </div>
            </CardContent>
        </Card>
    )
}
