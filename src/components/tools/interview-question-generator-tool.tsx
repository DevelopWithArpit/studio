
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { handleGenerateInterviewQuestionsAction } from '@/app/actions';
import type { GenerateInterviewQuestionsInput, GenerateInterviewQuestionsOutput } from '@/ai/flows/interview-question-generator-tool';

const formSchema = z.object({
  topic: z.string().min(1, 'Please enter a job role or topic.'),
  count: z.number().int().positive().min(1).max(20),
  category: z.enum(['Technical', 'Behavioral', 'Situational', 'Brain-Teaser']),
});

type FormData = z.infer<typeof formSchema>;

export default function InterviewQuestionGeneratorTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateInterviewQuestionsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      count: 5,
      category: 'Technical',
    },
  });

  async function onSubmit(data: GenerateInterviewQuestionsInput) {
    setIsLoading(true);
    setResult(null);
    const response = await handleGenerateInterviewQuestionsAction(data);
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
        <h1 className="text-3xl font-bold font-headline">Interview Question Generator</h1>
        <p className="text-muted-foreground">
          Generate tailored interview questions for any role or topic.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Generate Questions</CardTitle>
          <CardDescription>
            Specify the role, number of questions, and category to get started.
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
                    <FormLabel>Job Role / Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Senior Product Manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Questions</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="20" {...field} onChange={e => {
                            const value = e.target.value;
                            field.onChange(value === '' ? '' : parseInt(value, 10));
                        }}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Technical">Technical</SelectItem>
                          <SelectItem value="Behavioral">Behavioral</SelectItem>
                          <SelectItem value="Situational">Situational</SelectItem>
                          <SelectItem value="Brain-Teaser">Brain-Teaser</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Questions'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      )}

      {result && result.questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {result.questions.map((q, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>{index + 1}. {q.question}</AccordionTrigger>
                  <AccordionContent>
                    <div className="prose prose-invert max-w-none">
                      <p className="font-semibold">Expected Answer:</p>
                      <p>{q.expectedAnswer}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
