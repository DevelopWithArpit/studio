
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
  FormDescription,
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
import { Download, ImageIcon, Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { cn } from '@/lib/utils';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  topic: z.string().min(3, 'Please enter a topic with at least 3 characters.'),
  numSlides: z.number().int().min(2, "Must be at least 2 slides.").max(20, "Cannot exceed 20 slides."),
  imageStyle: z.string().optional(),
  contentType: z.enum(['general', 'projectProposal', 'custom']).default('general'),
  customStructure: z.string().optional(),
}).refine(data => {
    if (data.contentType === 'custom') {
        return !!data.customStructure && data.customStructure.length > 10;
    }
    return true;
}, {
    message: "Please provide a custom structure with at least 10 characters.",
    path: ['customStructure'],
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
      contentType: 'general',
      customStructure: '',
    },
  });

  const contentType = form.watch('contentType');

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

    // Master Slide: Title
    pptx.defineSlideMaster({
      title: "TITLE_SLIDE",
      background: { color: "1A1A1A" }, // Dark background
      objects: [
        { 
            placeholder: {
                options: { name: "title", type: "title", x: 0.5, y: 2.5, w: 9, h: 1.5, fontFace: 'Arial', fontSize: 44, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' },
                text: "Default Title",
            }
        },
        { 
            placeholder: {
                options: { name: "subtitle", type: "body", x: 1.0, y: 4.0, w: 8, h: 1, fontFace: 'Arial', fontSize: 20, color: 'A9A9A9', align: 'center', valign: 'middle' },
                text: "Default Subtitle",
            }
        },
      ],
    });

    // Master Slide: Content
    pptx.defineSlideMaster({
      title: "CONTENT_SLIDE",
      background: { color: "1A1A1A" }, // Dark background
      objects: [
        { 
            placeholder: {
                options: { name: "title", type: "title", x: 0.5, y: 0.2, w: 9, h: 0.8, fontFace: 'Arial', fontSize: 32, bold: true, color: 'FFFFFF', align: 'left', valign: 'middle' },
                text: "Default Title",
            },
        },
        { 
            placeholder: {
                options: { name: "body", type: "body", x: 0.5, y: 1.2, w: 5.5, h: 4.5, fontFace: 'Arial', fontSize: 18, color: 'D3D3D3' },
                text: "Default Body Text",
            },
        },
        {
          placeholder: {
            options: { name: "image", type: "pic", x: 6.5, y: 1.2, w: 3, h: 4.5 },
          },
        },
      ],
    });

    result.slides.forEach((slide, index) => {
        const isFirst = index === 0;
        const masterName = isFirst ? "TITLE_SLIDE" : "CONTENT_SLIDE";
        const pptxSlide = pptx.addSlide({ masterName });

        // Add a subtle fade transition to all slides
        pptxSlide.transition = { type: "fade", duration: 1 };

        if (isFirst) {
            pptxSlide.addText(slide.title, { 
                placeholder: "title", 
                anim: { effect: 'wipe', type: 'in', duration: 1, delay: 0.2, from: 'bottom' } 
            });
            const subtitle = slide.content.join(' - ') || result.topic;
            pptxSlide.addText(subtitle, { 
                placeholder: "subtitle",
                anim: { effect: 'fadeIn', duration: 1, delay: 0.5 } 
            });
        } else {
            pptxSlide.addText(slide.title, { 
                placeholder: "title",
                anim: { effect: 'fadeIn', duration: 0.5, delay: 0.2 } 
            });

            const bodyTextObjects = slide.content.map(point => ({
                text: point,
                options: { 
                    bullet: true, 
                    paraSpaceAfter: 10,
                    fontFace: 'Arial',
                    fontSize: 18,
                    color: 'D3D3D3',
                    anim: { effect: 'fadeIn', by: 'paragraph', duration: 0.5, delay: 0.5 }
                }
            }));

            pptxSlide.addText(bodyTextObjects, {
                placeholder: 'body',
            });

            if (slide.imageUrl) {
                pptxSlide.addImage({
                    data: slide.imageUrl,
                    placeholder: "image",
                    sizing: { type: 'cover', w: 3, h: 4.5 },
                    anim: { effect: 'zoom', type: 'in', duration: 1, delay: 0.3 }
                });
            }
        }
    });

    pptx.writeFile({ fileName: `${result.title}.pptx` });
    toast({ title: 'Download Started', description: `Your presentation "${result.title}.pptx" is downloading.` });
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
               <FormField
                  control={form.control}
                  name="contentType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Content Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="general" /></FormControl>
                            <FormLabel className="font-normal">General Topic</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="projectProposal" /></FormControl>
                            <FormLabel className="font-normal">Project Proposal</FormLabel>
                          </FormItem>
                           <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="custom" /></FormControl>
                            <FormLabel className="font-normal">Custom Structure</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Presentation Topic or Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., The Future of Renewable Energy" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {contentType === 'custom' && (
                <FormField
                    control={form.control}
                    name="customStructure"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Custom Structure</FormLabel>
                        <FormDescription>Enter one slide title per line.</FormDescription>
                        <FormControl>
                            <Textarea
                                placeholder="e.g.,&#10;Slide 1: Introduction to the problem&#10;Slide 2: Our proposed solution&#10;Slide 3: Market Analysis"
                                {...field}
                                rows={6}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="numSlides"
                  render={({ field }) => (
                    <FormItem className={cn("transition-opacity", (contentType === 'projectProposal' || contentType === 'custom') && "opacity-50")}>
                      <FormLabel>Number of Slides</FormLabel>
                      <FormControl>
                        <Input type="number" min="2" max="20" {...field} onChange={e => {
                            const value = e.target.value;
                            field.onChange(value === '' ? '' : parseInt(value, 10));
                        }} disabled={contentType === 'projectProposal' || contentType === 'custom'}/>
                      </FormControl>
                       {contentType === 'projectProposal' && <p className="text-xs text-muted-foreground">Fixed at 8 slides for project proposals.</p>}
                       {contentType === 'custom' && <p className="text-xs text-muted-foreground">Determined by your custom structure.</p>}
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
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : 'Generate Presentation'}
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
