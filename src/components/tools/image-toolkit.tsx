'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleImageToolkitAction } from '@/app/actions';
import type { ImageToolkitOutput } from '@/ai/flows/image-toolkit';
import { UploadCloud } from 'lucide-react';

const formSchema = z.object({
  imageOrText: z.string().min(1, 'Please upload an image or enter descriptive text.'),
  watermarkText: z.string().optional(),
  manipulationInstructions: z
    .string()
    .min(1, 'Please provide manipulation instructions.'),
});

type FormData = z.infer<typeof formSchema>;

export default function ImageToolkit() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ImageToolkitOutput | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageOrText: '',
      watermarkText: '',
      manipulationInstructions: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload an image smaller than 4MB."});
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        form.setValue('imageOrText', dataUri);
        setPreview(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue('imageOrText', e.target.value);
    setPreview(null);
  };

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleImageToolkitAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: response.error,
      });
    }
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Image Toolkit</h1>
        <p className="text-muted-foreground">
          Create custom visuals with AI. Upload an image or describe one, then apply manipulations.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Create an Image</CardTitle>
          <CardDescription>
            Start with an existing image or a text prompt.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                 <FormItem>
                  <FormLabel>Base Image or Text Prompt</FormLabel>
                   <FormControl>
                    <Input 
                      placeholder="Or describe the image to generate..." 
                      onChange={handleTextChange}
                      className="mb-2"
                    />
                  </FormControl>
                  <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center h-64">
                    {preview ? (
                      <Image src={preview} alt="Image preview" layout="fill" objectFit="contain" className="rounded-md" />
                    ) : (
                      <>
                        <UploadCloud className="w-12 h-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          <label htmlFor="file-upload" className="font-semibold text-accent cursor-pointer hover:underline">
                             Upload an image
                          </label>
                        </p>
                        <Input id="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                         <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 4MB</p>
                      </>
                    )}
                  </div>
                   <FormMessage>{form.formState.errors.imageOrText?.message}</FormMessage>
                </FormItem>

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="manipulationInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manipulation Instructions</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., make the background black and white, increase saturation"
                            {...field}
                            rows={5}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="watermarkText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Watermark Text (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., © My Company" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Image'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || result) && (
        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <h3 className="font-semibold mb-2 font-headline">Final Image</h3>
                {isLoading && !result && <Skeleton className="w-full h-64 rounded-lg" />}
                {result && <Image src={result.finalImage} alt="Generated image" width={512} height={512} className="rounded-lg border" />}
             </div>
             <div>
                <h3 className="font-semibold mb-2 font-headline">Modification Report</h3>
                {isLoading && !result && <div className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" /></div>}
                {result && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.report}</p>}
             </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
