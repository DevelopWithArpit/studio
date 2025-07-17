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
import { handleSmartSearchAction } from '@/app/actions';
import type { SmartSearchOutput } from '@/ai/flows/smart-search-tool';
import { FileText, UploadCloud } from 'lucide-react';

const formSchema = z.object({
  documentDataUri: z
    .string()
    .min(1, 'Please upload a document.'),
  query: z.string().min(1, 'Please enter a query.'),
});

type FormData = z.infer<typeof formSchema>;

export default function SmartSearchTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SmartSearchOutput | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentDataUri: '',
      query: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload a document smaller than 4MB."});
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        form.setValue('documentDataUri', dataUri);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleSmartSearchAction(data);
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
        <h1 className="text-3xl font-bold font-headline">Smart Search Tool</h1>
        <p className="text-muted-foreground">
          Analyze a document for important information using AI.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Analyze Document</CardTitle>
          <CardDescription>
            Upload a document and ask a question about its contents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormItem>
                <FormLabel>Document</FormLabel>
                <FormControl>
                  <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center">
                    {fileName ? (
                      <div className='flex flex-col items-center gap-2'>
                        <FileText className="w-12 h-12 text-accent" />
                        <p className='text-sm font-medium'>{fileName}</p>
                         <Button variant="link" size="sm" asChild className='p-0 h-auto'>
                           <label htmlFor="file-upload" className="cursor-pointer">Change file</label>
                         </Button>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="w-12 h-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          <label htmlFor="file-upload" className="font-semibold text-accent cursor-pointer hover:underline">
                            Click to upload
                          </label>
                           {' '}or drag and drop
                        </p>
                         <p className="text-xs text-muted-foreground">PDF, DOCX, TXT up to 4MB</p>
                      </>
                    )}
                    <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                  </div>
                </FormControl>
                <FormMessage>{form.formState.errors.documentDataUri?.message}</FormMessage>
              </FormItem>

              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Query</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., What are the key takeaways from this document?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading || !form.formState.isValid}>
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
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
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{result.summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
