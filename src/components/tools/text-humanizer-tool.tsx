
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { handleHumanizeTextAction } from '@/app/actions';
import type { HumanizeTextOutput } from '@/ai/flows/text-humanizer-tool';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  text: z.string().min(10, 'Please enter at least 10 characters.'),
  tone: z.enum(['Casual', 'Professional', 'Friendly', 'Witty', 'Formal']),
});

type FormData = z.infer<typeof formSchema>;

export default function TextHumanizerTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<HumanizeTextOutput | null>(null);
  const [originalText, setOriginalText] = useState<string>('');
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
      tone: 'Friendly',
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    setOriginalText(data.text);
    const response = await handleHumanizeTextAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error humanizing text',
        description: response.error,
      });
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold font-headline">Text Humanizer</h1>
        <p className="text-muted-foreground">
          Rewrite AI-generated text to sound more natural and engaging.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Humanize Your Text</CardTitle>
          <CardDescription>
            Paste your text, choose a tone, and let the AI work its magic.
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
                    <FormLabel>Original Text</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your AI-generated text or assignment here..."
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
                    <FormLabel>Desired Tone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a tone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Friendly">Friendly</SelectItem>
                        <SelectItem value="Professional">Professional</SelectItem>
                        <SelectItem value="Casual">Casual</SelectItem>
                        <SelectItem value="Witty">Witty</SelectItem>
                        <SelectItem value="Formal">Formal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Humanizing...' : 'Humanize Text'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && <ResultSkeleton />}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-2">
                <h3 className="font-semibold text-center">Original</h3>
                <div className="p-4 border rounded-md bg-muted min-h-[150px] text-sm text-muted-foreground whitespace-pre-wrap">
                  {originalText}
                </div>
              </div>
               <div className="space-y-2">
                <h3 className="font-semibold text-center">Humanized ✨</h3>
                <div className="p-4 border rounded-md bg-background min-h-[150px] text-sm whitespace-pre-wrap">
                  {result.humanizedText}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


function ResultSkeleton() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-center">Original</h3>
                        <Skeleton className="w-full h-36 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-center">Humanized ✨</h3>
                        <Skeleton className="w-full h-36 rounded-lg" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
