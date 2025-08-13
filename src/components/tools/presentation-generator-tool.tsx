
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
import type { GeneratePresentationOutput, GeneratePresentationInput } from '@/ai/flows/presentation-generator-tool';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Download, Loader2, Image as ImageIconLucide } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { cn } from '@/lib/utils';
import { Textarea } from '../ui/textarea';
import { RobotsBuildingLoader } from '../ui/robots-building-loader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const formSchema = z.object({
  topic: z.string().min(3, 'Please enter a topic with at least 3 characters.'),
  presenterName: z.string().optional(),
  rollNumber: z.string().optional(),
  department: z.string().optional(),
  numSlides: z.coerce.number().int().min(2, "Must be at least 2 slides.").max(20, "Cannot exceed 20 slides."),
  imageStyle: z.string().optional(),
  language: z.string().optional(),
  contentType: z.enum(['general', 'projectProposal', 'custom']).default('general'),
  customStructure: z.string().optional(),
}).refine(data => {
    if (data.contentType === 'custom') {
        return (data.customStructure || '').trim().length > 10;
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
      presenterName: '',
      rollNumber: '',
      department: '',
      numSlides: 5,
      imageStyle: 'photorealistic',
      language: 'English',
      contentType: 'general',
      customStructure: '',
    },
  });

  const contentType = form.watch('contentType');

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);

    const input: GeneratePresentationInput = {
        topic: data.topic,
        presenterName: data.presenterName,
        rollNumber: data.rollNumber,
        department: data.department,
        contentType: data.contentType,
        numSlides: data.numSlides,
        imageStyle: data.imageStyle,
        language: data.language,
    };
    if (data.contentType === 'custom' && data.customStructure) {
        input.customStructure = data.customStructure;
    }

    const response = await handleGeneratePresentationAction(input);
    
    setIsLoading(false);
    if (response.success && response.data) {
        setResult(response.data);
        toast({
            title: "Presentation Generated!",
            description: "Your presentation with text and images is ready.",
        });
    } else {
        toast({
            variant: 'destructive',
            title: 'Error Generating Presentation',
            description: response.error,
        });
    }
  }

 const handleDownload = () => {
    if (!result) return;

    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE';
    
    const { design, backgroundImageUrl } = result;
    const cleanColor = (color: string) => color.startsWith('#') ? color.substring(1) : color;
    
    const masterBackground = backgroundImageUrl && backgroundImageUrl.startsWith('data:image')
        ? { data: backgroundImageUrl, sizing: { type: 'cover', w: '100%', h: '100%' } }
        : { color: cleanColor(design.backgroundColor) };


    // Master Slide: Title
    pptx.defineSlideMaster({
      title: "TITLE_SLIDE",
      background: masterBackground,
      objects: [
        {
            placeholder: {
                options: { name: "title", type: "title", x: '5%', y: '40%', w: '90%', h: '15%', fontFace: 'Arial', fontSize: 44, bold: true, color: cleanColor(design.accentColor), align: 'center', valign: 'middle' },
                text: "Default Title",
            }
        },
        {
            placeholder: {
                options: { name: "subtitle", type: "body", x: '10%', y: '55%', w: '80%', h: '20%', fontFace: 'Arial', fontSize: 20, color: cleanColor(design.textColor), align: 'center', valign: 'top' },
                text: "Default Subtitle",
            }
        },
      ],
    });

    // Master Slide: Content
    pptx.defineSlideMaster({
      title: "CONTENT_SLIDE",
      background: masterBackground,
      objects: [
        { rect: { x: '4%', y: '10.5%', w: '92%', h: 0.1, fill: { color: cleanColor(design.accentColor) } } },
        {
            placeholder: {
                options: { name: "title", type: "title", x: '4%', y: '2%', w: '92%', h: '15%', fontFace: 'Arial', fontSize: 32, bold: true, color: cleanColor(design.textColor), align: 'left', valign: 'middle' },
                text: "Default Title",
            },
        },
        {
            placeholder: {
                options: { name: "body", type: "body", x: '4%', y: '20%', w: '55%', h: '70%', fontFace: 'Arial', fontSize: 18, color: cleanColor(design.textColor), paraSpaceAfter: 15, isTextBox: true, valign: 'top', },
                text: "Default Body Text",
            },
        },
        {
          placeholder: {
            options: { name: "image", type: "pic", x: '63%', y: '20%', w: '33%', h: '70%' },
          },
        },
      ],
    });
    
    // Master Slide: Title Only
    pptx.defineSlideMaster({
      title: "TITLE_ONLY_SLIDE",
      background: masterBackground,
      objects: [
        {
            placeholder: {
                options: { name: "title", type: "title", x: '5%', y: '40%', w: '90%', h: '20%', fontFace: 'Arial', fontSize: 44, bold: true, color: cleanColor(design.accentColor), align: 'center', valign: 'middle' },
                text: "Default Title",
            }
        },
      ],
    });


    // Generate slides
    result.slides.forEach((slide) => {
      let masterName = '';
      switch (slide.slideLayout) {
        case 'title':
          masterName = 'TITLE_SLIDE';
          break;
        case 'titleOnly':
          masterName = 'TITLE_ONLY_SLIDE';
          break;
        case 'contentWithImage':
        default:
          masterName = 'CONTENT_SLIDE';
          break;
      }
      
      const pptxSlide = pptx.addSlide({ masterName });
      pptxSlide.transition = { type: "fade", duration: 1 };

      if (masterName === 'TITLE_SLIDE') {
        pptxSlide.addText(result.title, { placeholder: "title" });
        
        const subtitleTextObjects = [];
        const firstSlide = result.slides[0];
        if (firstSlide?.title) {
            subtitleTextObjects.push({
                text: firstSlide.title,
                options: { fontSize: 22, bold: true, breakLine: true }
            });
        }
        const presenterDetails = [
            result.presenterName ? `Presented by: ${result.presenterName}` : null,
            result.rollNumber ? `Roll No: ${result.rollNumber}` : null,
            result.department ? `Department: ${result.department}` : null
        ].filter(Boolean);
    
        if(presenterDetails.length > 0) {
          subtitleTextObjects.push(...presenterDetails.map(text => ({ text, options: { breakLine: true } })));
        }
        
        if (subtitleTextObjects.length > 0) {
            pptxSlide.addText(subtitleTextObjects, { placeholder: 'subtitle' });
        }
      } else {
         pptxSlide.addText(slide.title, { placeholder: "title" });

        if (masterName === 'CONTENT_SLIDE') {
          const bodyTextObjects = slide.content.map(point => ({
            text: point,
            options: { bullet: {type: 'dot', indent: 24} }
          }));

          if (bodyTextObjects.length > 0) {
              pptxSlide.addText(bodyTextObjects, { placeholder: 'body' });
          }
          
          if (slide.imageUrl && slide.imageUrl.startsWith('data:image')) {
            pptxSlide.addImage({
              data: slide.imageUrl,
              placeholder: "image",
              sizing: { type: 'contain', w: '100%', h: '100%' },
            });
          }
        }
      }
    });

    pptx.writeFile({ fileName: `${result.title}.pptx` });
    toast({ title: 'Download Started', description: `Your presentation "${result.title}.pptx" is downloading.` });
  };


  return (
    <div className="space-y-6">
      <header className="space-y-1">
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
                            <FormLabel className="font-normal">Custom Structure & Content</FormLabel>
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
                        <FormLabel>Custom Structure & Content</FormLabel>
                        <FormDescription>Enter one slide title per line, with notes below each title.</FormDescription>
                        <FormControl>
                            <Textarea
                                placeholder="e.g.,&#10;1. About the Company&#10;Blinkit is an Indian quick-commerce platform...&#10;&#10;2. Founders&#10;Albinder Dhindsa..."
                                {...field}
                                rows={10}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="presenterName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Presenter Name (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Jane Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rollNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Roll No. (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., CS101" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Computer Science" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="numSlides"
                  render={({ field }) => (
                    <FormItem className={cn("transition-opacity", (contentType === 'projectProposal' || contentType === 'custom') && "opacity-50")}>
                      <FormLabel>Number of Slides</FormLabel>
                      <FormControl>
                        <Input type="number" min="2" max="20" {...field} disabled={contentType === 'projectProposal' || contentType === 'custom'}/>
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
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Hindi">Hindi</SelectItem>
                          <SelectItem value="Marathi">Marathi</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Presentation...</> : 'Generate Presentation'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Generating Presentation</CardTitle>
            <CardDescription>The AI is building your presentation. This may take a few moments...</CardDescription>
          </CardHeader>
          <CardContent>
            <RobotsBuildingLoader />
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>{result?.title}</CardTitle>
            <CardDescription>
                Your generated presentation is ready.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Carousel className="w-full">
                <CarouselContent>
                    {result?.slides.map((slide, index) => (
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
                                    {slide.imageUrl && slide.imageUrl.startsWith('data:image') ? (
                                        <Image
                                            src={slide.imageUrl}
                                            alt={slide.title}
                                            width={500}
                                            height={500}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-destructive">
                                            <ImageIconLucide className="w-16 h-16" />
                                            <p className="mt-2 text-sm font-semibold">Image failed to generate</p>
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
            <Button onClick={handleDownload} disabled={isLoading}>
                <Download className="mr-2 h-4 w-4"/>
                Download Presentation
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
