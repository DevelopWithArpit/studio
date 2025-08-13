
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleGenerateCoverLetterAction } from '@/app/actions';
import type { GenerateCoverLetterOutput } from '@/ai/flows/cover-letter-assistant-tool';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  jobDescription: z.string().min(50, 'Please enter a job description of at least 50 characters.'),
  userInfo: z.string().min(50, 'Please provide your information of at least 50 characters.'),
  tone: z.enum(['Professional', 'Enthusiastic', 'Formal', 'Creative']),
});

type FormData = z.infer<typeof formSchema>;

export default function CoverLetterAssistantTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateCoverLetterOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobDescription: '',
      userInfo: '',
      tone: 'Professional',
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleGenerateCoverLetterAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error generating cover letter',
        description: response.error,
      });
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold font-headline">Cover Letter Assistant</h1>
        <p className="text-muted-foreground">Generate a tailored cover letter for any job application.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Generate a Cover Letter</CardTitle>
          <CardDescription>
            Provide the job description and your information, then choose a tone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="jobDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste the job description here..."
                        {...field}
                        rows={8}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Information</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your resume or provide key skills and experiences..."
                        {...field}
                        rows={8}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a tone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Professional">Professional</SelectItem>
                        <SelectItem value="Enthusiastic">Enthusiastic</SelectItem>
                        <SelectItem value="Formal">Formal</SelectItem>
                        <SelectItem value="Creative">Creative</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Generating...' : 'Generate Letter'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Cover Letter</CardTitle>
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
            <CardTitle>Generated Cover Letter</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-invert max-w-none whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: result.coverLetter.replace(/\n/g, '<br />') }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
