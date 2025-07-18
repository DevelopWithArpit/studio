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
import { handleGenerateDiagramAction } from '@/app/actions';
import type { GenerateDiagramOutput } from '@/ai/flows/diagram-generator-tool';

const formSchema = z.object({
  description: z.string().min(10, 'Please enter a description of at least 10 characters.'),
});

type FormData = z.infer<typeof formSchema>;

export default function DiagramGeneratorTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateDiagramOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleGenerateDiagramAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error generating diagram',
        description: response.error,
      });
    }
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Diagram Generator</h1>
        <p className="text-muted-foreground">
          Create diagrams from text descriptions.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Generate a Diagram</CardTitle>
          <CardDescription>
            Describe the diagram you want to create, including nodes, connections, and labels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diagram Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., A simple flowchart with a start node, a decision node 'Is it sunny?', and two end nodes 'Go to beach' and 'Stay home'."
                        {...field}
                        rows={6}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Diagram'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || result) && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Diagram</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6">
            {isLoading && !result ? (
              <Skeleton className="w-full h-96 rounded-lg" />
            ) : result ? (
              <Image
                src={result.diagramUrl}
                alt="Generated diagram"
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
