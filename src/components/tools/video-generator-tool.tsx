
'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { handleGenerateVideoAction, handleCheckVideoStatusAction } from '@/app/actions';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  prompt: z.string().min(10, 'Please enter a prompt of at least 10 characters.'),
  durationSeconds: z.number().int().min(1).max(10).default(5),
});

type FormData = z.infer<typeof formSchema>;

export default function VideoGeneratorTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: 'A majestic dragon soaring over a mystical forest at dawn.',
      durationSeconds: 5,
    },
  });

  const duration = form.watch('durationSeconds');

  const stopPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
    setPolling(false);
    setProgress(100);
  };

  const pollStatus = async (operationName: string) => {
    const response = await handleCheckVideoStatusAction({ operationName });

    if (response.success && response.data) {
        if (response.data.done) {
            stopPolling();
            setIsLoading(false);
            if (response.data.videoUrl) {
                setVideoUrl(response.data.videoUrl);
                toast({ title: 'Video Generated!', description: 'Your video is ready.' });
            } else {
                toast({ variant: 'destructive', title: 'Error Generating Video', description: response.data.error || 'The operation finished but no video was found.' });
            }
        } else {
           // Fake progress bar
           setProgress(p => Math.min(p + 5, 95));
        }
    } else {
        stopPolling();
        setIsLoading(false);
        toast({ variant: 'destructive', title: 'Error Polling Status', description: response.error });
    }
  };


  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setVideoUrl(null);
    setProgress(0);
    setPolling(false);
    if(pollingInterval.current) clearInterval(pollingInterval.current);


    const response = await handleGenerateVideoAction(data);

    if (response.success && response.data?.operationName) {
      const { operationName } = response.data;
      setPolling(true);
      setProgress(5);
      toast({ title: 'Video Generation Started', description: 'This may take a minute or two. Please wait.' });
      
      pollingInterval.current = setInterval(() => {
        pollStatus(operationName);
      }, 5000);

    } else {
      setIsLoading(false);
      toast({
        variant: 'destructive',
        title: 'Error starting video generation',
        description: response.error,
      });
    }
  }

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, []);

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
                {isLoading ? 'Processing...' : 'Generate Video'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || videoUrl) && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Video</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6">
            {isLoading ? (
              <div className="w-full aspect-video flex flex-col items-center justify-center bg-muted rounded-lg space-y-4">
                 <Loader2 className="h-12 w-12 animate-spin text-primary" />
                 <p className="text-muted-foreground">Generating video, this may take a minute...</p>
                 {polling &&  <Progress value={progress} className="w-3/4" />}
              </div>
            ) : videoUrl ? (
              <video
                src={videoUrl}
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

