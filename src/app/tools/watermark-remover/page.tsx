
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
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { handleRemoveWatermarkAction } from '@/app/actions';
import type { RemoveWatermarkOutput } from '@/ai/flows/watermark-remover-tool';
import { Loader2, UploadCloud } from 'lucide-react';

const formSchema = z.object({
  imageDataUri: z.string().min(1, 'Please upload an image.'),
});

type FormData = z.infer<typeof formSchema>;

export default function WatermarkRemoverTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [result, setResult] = useState<RemoveWatermarkOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageDataUri: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload an image smaller than 10MB."});
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        form.setValue('imageDataUri', dataUri);
        setOriginalImage(dataUri);
        setResult(null); // Clear previous result
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleRemoveWatermarkAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error removing watermark',
        description: response.error,
      });
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold font-headline">Watermark Remover</h1>
        <p className="text-muted-foreground">
          Upload an image to attempt to remove the watermark using AI.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
          <CardDescription>
            Choose an image file with a watermark to process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormItem>
                <FormLabel>Image File</FormLabel>
                <FormControl>
                    <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center h-64">
                    {originalImage ? (
                      <Image src={originalImage} alt="Image preview" layout="fill" objectFit="contain" className="rounded-md" />
                    ) : (
                      <>
                        <UploadCloud className="w-12 h-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          <label htmlFor="file-upload" className="font-semibold text-primary cursor-pointer hover:underline">
                             Upload an image
                          </label>
                        </p>
                        <Input id="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                         <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</p>
                      </>
                    )}
                  </div>
                </FormControl>
                <FormMessage>{form.formState.errors.imageDataUri?.message}</FormMessage>
              </FormItem>
              <Button type="submit" disabled={isLoading || !originalImage}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Processing...' : 'Remove Watermark'}
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
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className="space-y-2">
                <h3 className="text-center font-semibold">Original</h3>
                {originalImage && (
                    <div className="aspect-square w-full relative">
                        <Image src={originalImage} alt="Original image" layout="fill" objectFit="contain" className="rounded-lg border" />
                    </div>
                )}
              </div>
              <div className="space-y-2">
                <h3 className="text-center font-semibold">Processed</h3>
                {isLoading ? (
                  <Skeleton className="aspect-square w-full rounded-lg" />
                ) : (
                  result && (
                     <div className="aspect-square w-full relative">
                        <Image src={result.processedImageUrl} alt="Processed image" layout="fill" objectFit="contain" className="rounded-lg border" />
                    </div>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
