'use client';

import React, { useState, useRef, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleTextToSpeechAction } from '@/app/actions';
import type { TextToSpeechOutput } from '@/ai/flows/text-to-speech-tool';

const formSchema = z.object({
  text: z.string().min(1, 'Please enter some text to convert to speech.'),
});

type FormData = z.infer<typeof formSchema>;

export default function TextToSpeechTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TextToSpeechOutput | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleTextToSpeechAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error generating speech',
        description: response.error,
      });
    }
  }

  useEffect(() => {
    if (result && audioRef.current) {
        audioRef.current.src = result.audioUrl;
        audioRef.current.load();
    }
  }, [result]);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Text-to-Speech Tool</h1>
        <p className="text-muted-foreground">
          Convert written text into natural-sounding speech.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Generate Speech</CardTitle>
          <CardDescription>
            Enter the text you want to hear and our AI will generate the audio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Hello, world! This is a test of the text-to-speech system."
                        {...field}
                        rows={8}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Speech'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || result) && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Audio</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && !result ? (
              <Skeleton className="w-full h-14 rounded-lg" />
            ) : result ? (
              <audio ref={audioRef} controls className="w-full">
                Your browser does not support the audio element.
              </audio>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
