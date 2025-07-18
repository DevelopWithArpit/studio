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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleGenerateImageAction } from '@/app/actions';
import type { GenerateImageOutput } from '@/ai/flows/image-generator-tool';

const formSchema = z.object({
  prompt: z.string().min(10, 'Please enter a prompt of at least 10 characters.'),
});

type FormData = z.infer<typeof formSchema>;

export default function ImageGeneratorTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateImageOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleGenerateImageAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error generating image',
        description: response.error,
      });
    }
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Image Generator</h1>
        <p className="text-muted-foreground">
          Create images from text descriptions.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Generate an Image</CardTitle>
          <CardDescription>
            Describe the image you want to create in the text area below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., A photorealistic image of a red panda programming on a laptop in a bamboo forest."
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            <CardTitle>Generated Image</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6">
            {isLoading && !result ? (
              <Skeleton className="w-full h-96 rounded-lg" />
            ) : result ? (
              <Image
                src={result.imageUrl}
                alt="Generated image"
                width={1024}
                height={1024}
                className="rounded-lg border object-contain"
              />
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
