
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import PptxGenJS from 'pptxgenjs';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { handleGeneratePresentationAction, handleGenerateSingleImageAction } from '@/app/actions';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Download, Loader2, Image as ImageIconLucide, RotateCw, Sparkles, Timer } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { cn } from '@/lib/utils';
import { Textarea } from '../ui/textarea';
import { RobotsBuildingLoader } from '../ui/robots-building-loader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '@/components/ui/label';
import type { GeneratePresentationOutput, GeneratePresentationInput as FlowInput } from '@/ai/flows/presentation-generator-tool';


const formSchema = z.object({
  topic: z.string().min(3, 'Please enter a topic with at least 3 characters.'),
  presenterName: z.string().optional(),
  rollNumber: z.string().optional(),
  department: z.string().optional(),
  numSlides: z.coerce.number().int().min(2, "Must be at least 2 slides.").max(20, "Cannot exceed 20 slides."),
  imageStyle: z.string().optional(),
  language: z.string().optional(),
  contentType: z.enum(['general', 'projectProposal', 'pitchDeck', 'custom']).default('general'),
  customStructure: z.string().optional(),
  style: z.enum(['Default', 'Tech Pitch', 'Creative']).default('Default'),
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
type Slide = GeneratePresentationOutput['slides'][0];

const COOLDOWN_SECONDS = 60;

export default function PresentationGeneratorTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeneratePresentationOutput | null>(null);
  const [generatingSlide, setGeneratingSlide] = useState<number | null>(null);
  const [cooldowns, setCooldowns] = useState<Record<number, number>>({});
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: 'AI Mentor: A Suite of AI-Powered Tools',
      presenterName: '',
      rollNumber: '',
      department: '',
      numSlides: 5,
      imageStyle: 'photorealistic',
      language: 'English',
      contentType: 'custom',
      customStructure: `1. Introduction to AI Mentor
- A suite of AI-powered tools to boost productivity and learning.

2. Analysis Tools
- Smart Search: Analyze documents with natural language queries.
- Document Summarizer: Get quick summaries of long documents.

3. Learning & Writing
- AI Explanation: Understand complex topics easily.
- Thesis Generator: Structure and write academic papers.
- Text Humanizer: Make AI text sound more natural.

4. Development Tools
- Code Generator: Create code from text descriptions.
- Code Analyzer: Find errors and vulnerabilities in code.
- Diagram Generator: Create flowcharts and diagrams from text.

5. Career Tools
- Interview Questions: Prepare for job interviews.
- Resume Feedback: Get AI-powered resume reviews.
- Portfolio Generator: Create a personal portfolio website.
- Cover Letter Assistant: Draft tailored cover letters.
- Career Path Suggester: Discover potential career paths.
- LinkedIn Visuals: Generate professional profile pictures and banners.

6. Productivity & Media
- Presentation Generator: Create presentations from a topic.
- Text to Speech: Convert text into audio.
- Watermark Remover: Remove watermarks from images.
- Image Text Manipulation: Edit text within an image.

7. Conclusion
- Recap of the project's capabilities and future scope.`,
      style: 'Tech Pitch',
    },
  });

  const contentType = form.watch('contentType');
  const style = form.watch('style');

  useEffect(() => {
    const interval = setInterval(() => {
      setCooldowns(prev => {
        const newCooldowns: Record<number, number> = {};
        let changed = false;
        for (const key in prev) {
          if (prev[key] > 0) {
            newCooldowns[key] = prev[key] - 1;
            changed = true;
          }
        }
        return changed ? newCooldowns : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (style === 'Tech Pitch') {
        if (form.getValues('contentType') !== 'pitchDeck') {
          form.setValue('contentType', 'pitchDeck');
        }
    } else if (style === 'Default' || style === 'Creative') {
       if (form.getValues('contentType') === 'pitchDeck') {
         form.setValue('contentType', 'general');
       }
    }
  }, [style, form]);

  React.useEffect(() => {
    if (contentType === 'projectProposal') {
      form.setValue('customStructure', `1. Introduction
What is the project about?
Why is it important/relevant to field/community?
2. Objectives
Main goals of the project
What you planned to achieve
3. Background / Literature
Short background of the topic
Any references or community issues identified
4. Methodology / Approach
Steps taken in field work
Tools, surveys, techniques used
5. Project Work / Implementation
Activities done
Photographs/figures/observations
6. Results / Findings
What you observed/collected
Data, charts, or key outcomes
7. Discussion / Analysis
What the results mean
Link to community needs/problems
8. Conclusion & Suggestions
Summary of work
Possible improvements, recommendations
9. Acknowledgement`);
    } else if (form.getValues('customStructure')?.startsWith('1. Introduction')) {
      form.setValue('customStructure', '');
    }
  }, [contentType, form]);


  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);

    const input: FlowInput = {
        topic: data.topic,
        presenterName: data.presenterName,
        rollNumber: data.rollNumber,
        department: data.department,
        contentType: data.contentType,
        numSlides: data.numSlides,
        imageStyle: data.imageStyle,
        language: data.language,
        style: data.style,
    };
    if (data.contentType === 'custom' || data.contentType === 'projectProposal') {
        input.customStructure = data.customStructure;
    }

    const response = await handleGeneratePresentationAction(input);
    
    setIsLoading(false);
    if (response.success && response.data) {
        setResult(response.data);
        toast({
            title: "Presentation Generated!",
            description: "Your presentation text and images are being generated in the background. This may take several minutes.",
        });
    } else {
        toast({
            variant: 'destructive',
            title: 'Error Generating Presentation',
            description: response.error,
        });
    }
  }

 const handleDownload = async () => {
    if (!result) return;

    toast({ title: 'Generating PPTX...', description: 'Please wait while your presentation is being created.' });

    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE';
    
    pptx.defineSlideMaster({
        title: "MASTER_SLIDE",
        background: { color: "0B192E" },
        objects: [
            { 'rect':    { x:0.0, y:6.8, w:'100%', h:0.75, fill:{ color: "64FFDA" } } },
            { 'text':    { text:'AI Mentor', options:{ x:0.5, y:6.9, w:5, h:0.5, fontFace:'Arial', fontSize:14, color:"0B192E", bold:true } } },
        ],
    });
    
    const titleSlide = pptx.addSlide({ masterName: "MASTER_SLIDE" });
    titleSlide.addText(result.title || "Presentation", { 
        x: 1, y: 2, w: 8, h: 1.5, 
        fontSize: 44, 
        bold: true, 
        color: "FFFFFF", 
        align: 'center',
        fontFace: 'Helvetica',
    });

    const presenterDetails = [
        form.getValues('presenterName') ? `Presented by: ${form.getValues('presenterName')}` : null,
        form.getValues('rollNumber') ? `Roll No: ${form.getValues('rollNumber')}` : null,
        form.getValues('department') ? `Department: ${form.getValues('department')}` : null
    ].filter(Boolean).join('\n');

    if (presenterDetails) {
        titleSlide.addText(presenterDetails, { 
            x: 1, y: 4, w: 8, h: 1, 
            fontSize: 20, 
            color: "E6F1FF", 
            align: 'center',
            fontFace: 'Arial',
        });
    }
    
    result.slides.forEach((slide) => {
        const contentSlide = pptx.addSlide({ masterName: "MASTER_SLIDE" });
        
        contentSlide.addText(slide.title, { 
            x: 0.5, y: 0.5, w: '90%', h: 1, 
            fontSize: 32, 
            bold: true, 
            color: "64FFDA",
            fontFace: 'Helvetica',
        });
        
        if (slide.content.length > 0) {
            contentSlide.addText(slide.content.map(p => ({ text: p, options: { breakLine: true, fontSize: 18, color: "E6F1FF", bullet: true, fontFace: 'Arial' } })), {
                x: 0.5, y: 1.8, w: '55%', h: 4,
            });
        }

        if (slide.imageUrl && slide.imageUrl.startsWith('data:image')) {
            contentSlide.addImage({
                data: slide.imageUrl,
                x: '60%', y: 1.5, w: '35%', h: 4.5,
                sizing: { type: 'contain', w: 3.5, h: 4.5 },
            });
        }
    });

    const blob = await pptx.write('blob');
    saveAs(blob, `${result.title}.pptx`);
    toast({ title: 'Download Started', description: `Your presentation "${result.title}.pptx" is downloading.` });
  };
  
   const handleGenerateImage = async (slideIndex: number) => {
    if (!result || cooldowns[slideIndex] > 0) return;
    const slideToGenerate = result.slides[slideIndex];
    if (!slideToGenerate) return;

    setGeneratingSlide(slideIndex);
    setCooldowns(prev => ({...prev, [slideIndex]: COOLDOWN_SECONDS}));

    const response = await handleGenerateSingleImageAction({
        imagePrompt: slideToGenerate.imagePrompt,
        imageStyle: form.getValues('imageStyle') || 'photorealistic',
    });

    setGeneratingSlide(null);

    if (response.success && response.data?.imageUrl) {
        setResult(currentResult => {
            if (!currentResult) return null;
            const newSlides = [...currentResult.slides];
            newSlides[slideIndex].imageUrl = response.data.imageUrl;
            return { ...currentResult, slides: newSlides };
        });
        toast({ title: 'Image Generated!', description: `Image for "${slideToGenerate.title}" has been created.` });
    } else {
        toast({ variant: 'destructive', title: 'Image Generation Failed', description: response.error || 'Could not generate the image.' });
        // Reset cooldown on failure so user can try again
        setCooldowns(prev => {
            const newCooldowns = {...prev};
            delete newCooldowns[slideIndex];
            return newCooldowns;
        });
    }
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
                  name="style"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Presentation Style</FormLabel>
                       <FormDescription>Choose a visual and narrative style for your presentation.</FormDescription>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                          <FormItem>
                            <FormControl>
                               <RadioGroupItem value="Default" id="style-default" className="sr-only peer" />
                            </FormControl>
                            <Label htmlFor="style-default" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                                <span className="font-bold">Default</span>
                                <span className="text-xs text-muted-foreground mt-1 text-center">A clean, professional look for any topic.</span>
                             </Label>
                          </FormItem>
                           <FormItem>
                            <FormControl>
                               <RadioGroupItem value="Tech Pitch" id="style-tech" className="sr-only peer" />
                            </FormControl>
                            <Label htmlFor="style-tech" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                                <span className="font-bold">Tech Pitch</span>
                                <span className="text-xs text-muted-foreground mt-1 text-center">Cinematic, dark theme. Great for pitch decks.</span>
                             </Label>
                          </FormItem>
                           <FormItem>
                            <FormControl>
                               <RadioGroupItem value="Creative" id="style-creative" className="sr-only peer" />
                            </FormControl>
                            <Label htmlFor="style-creative" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                                <span className="font-bold">Creative</span>
                                <span className="text-xs text-muted-foreground mt-1 text-center">Vibrant, light theme with a friendly feel.</span>
                             </Label>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

               <FormField
                  control={form.control}
                  name="contentType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Content Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
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
                            <FormControl><RadioGroupItem value="pitchDeck" disabled={style === 'Tech Pitch'} /></FormControl>
                            <FormLabel className={cn("font-normal", style === 'Tech Pitch' && "text-muted-foreground")}>
                                Pitch Deck {style === 'Tech Pitch' && <span className="text-xs">(Selected by Style)</span>}
                            </FormLabel>
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

              {(contentType === 'custom' || contentType === 'projectProposal') && (
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
                    <FormItem className={cn("transition-opacity", (contentType !== 'general') && "opacity-50")}>
                      <FormLabel>Number of Slides</FormLabel>
                      <FormControl>
                        <Input type="number" min="2" max="20" {...field} disabled={contentType !== 'general'}/>
                      </FormControl>
                       {contentType !== 'general' && <p className="text-xs text-muted-foreground">Determined by content type.</p>}
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
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : 'Generate Presentation'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Generating Presentation...</CardTitle>
            <CardDescription>The AI is building your presentation. This may take several minutes as images are generated one by one.</CardDescription>
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
                Your generated presentation is ready. Review the slides and download the final PPTX file.
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
                                <div className="bg-muted flex items-center justify-center overflow-hidden relative">
                                    {generatingSlide === index ? (
                                        <Loader2 className="w-16 h-16 animate-spin text-primary" />
                                    ) : slide.imageUrl ? (
                                      <>
                                        <Image
                                            src={slide.imageUrl}
                                            alt={slide.title}
                                            fill
                                            className="object-cover w-full h-full"
                                        />
                                        <Button variant="secondary" size="sm" className="absolute bottom-4 right-4" onClick={() => handleGenerateImage(index)} disabled={cooldowns[index] > 0 || generatingSlide !== null}>
                                          {cooldowns[index] > 0 ? <><Timer className="mr-2 h-4 w-4" /> {cooldowns[index]}s</> : <><RotateCw className="mr-2 h-4 w-4" /> Retry</>}
                                        </Button>
                                      </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <ImageIconLucide className="w-16 h-16" />
                                            <p className="mt-2 text-sm font-semibold">Image generation is in progress...</p>
                                            <Loader2 className="w-8 h-8 animate-spin text-primary mt-2" />
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
            <Button onClick={handleDownload} disabled={!result}>
                <Download className="mr-2 h-4 w-4"/>
                Download Presentation
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
