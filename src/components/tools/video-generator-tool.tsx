
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleGenerateVideoAction } from '@/app/actions';
import type { GenerateVideoOutput } from '@/ai/flows/video-generator-tool';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';

const formSchema = z.object({
  prompt: z.string().min(10, 'Please enter a prompt of at least 10 characters.'),
  durationSeconds: z.number().int().min(1).max(10).default(5),
});

type FormData = z.infer<typeof formSchema>;

export default function VideoGeneratorTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateVideoOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: 'A majestic dragon soaring over a mystical forest at dawn.',
      durationSeconds: 5,
    },
  });

  const duration = form.watch('durationSeconds');

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleGenerateVideoAction(data);
    setIsLoading(false);

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error generating video',
        description: response.error,
      });
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold font-headline">Video Generator</h1>
        <p className="text-muted-foreground">
          Create short video clips from a text description.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Generate a Video</CardTitle>
          <CardDescription>
            Describe the video you want to create and select a duration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., A cinematic shot of a an old car driving down a deserted road at sunset."
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="durationSeconds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration: {duration} seconds</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        value={[field.value]}
                        onValueChange={(values) => field.onChange(values[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Generating Video...' : 'Generate Video'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || result) && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Video</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6">
            {isLoading && !result ? (
              <div className="w-full aspect-video flex flex-col items-center justify-center bg-muted rounded-lg">
                 <Loader2 className="h-12 w-12 animate-spin text-primary" />
                 <p className="text-muted-foreground mt-4">Generating video, this may take a minute...</p>
              </div>
            ) : result ? (
              <video
                src={result.videoUrl}
                controls
                className="rounded-lg border w-full"
              />
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
