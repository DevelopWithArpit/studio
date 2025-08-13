
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleGenerateCodeAction } from '@/app/actions';
import type { GenerateCodeOutput } from '@/ai/flows/code-generator-tool';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  instructions: z
    .string()
    .min(20, 'Please provide detailed instructions (at least 20 characters).'),
  constraints: z
    .object({
      language: z.string().optional(),
      frameworks: z.string().optional(),
      libraries: z.string().optional(),
    })
    .optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CodeGeneratorTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateCodeOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      instructions: '',
      constraints: {
        language: '',
        frameworks: '',
        libraries: '',
      },
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleGenerateCodeAction(data);
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
        <h1 className="text-3xl font-bold font-headline">Code Generator</h1>
        <p className="text-muted-foreground">Generate code snippets in any language from a text description.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Generate Code</CardTitle>
          <CardDescription>
            Provide instructions and constraints to generate the code you need.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructions & Specifications</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Create a React component that fetches and displays a list of users..."
                        {...field}
                        rows={6}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <h3 className="text-lg font-medium mb-2">
                  Constraints (Optional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="constraints.language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., TypeScript" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="constraints.frameworks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frameworks</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Next.js" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="constraints.libraries"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Libraries</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Tailwind CSS" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Generating...' : 'Generate Code'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Code</CardTitle>
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
            <CardTitle>Generated Code</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
              <code className="text-foreground whitespace-pre-wrap">{result.code}</code>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
