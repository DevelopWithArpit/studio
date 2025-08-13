
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleExplainTopicAction } from '@/app/actions';
import type { ExplainTopicOutput } from '@/ai/flows/ai-explanation-tool';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  topic: z
    .string()
    .min(10, 'Please enter a topic with at least 10 characters.'),
});

type FormData = z.infer<typeof formSchema>;

export default function AiExplanationTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ExplainTopicOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleExplainTopicAction(data);
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
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold font-headline">AI Explanation</h1>
        <p className="text-muted-foreground">Get clear and concise explanations for complex topics.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Explain a Topic</CardTitle>
          <CardDescription>
            Enter a topic below and let our AI provide a detailed explanation.
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
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Explain the theory of relativity"
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Generating...' : 'Explain'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Explanation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Explanation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none whitespace-pre-wrap">
              {result.explanation}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
