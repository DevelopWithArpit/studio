
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { handleSummarizeDocumentAction } from '@/app/actions';
import type { SummarizeDocumentOutput } from '@/ai/flows/document-summarizer-tool';
import { FileText, Loader2, UploadCloud } from 'lucide-react';

const formSchema = z.object({
  documentDataUri: z.string().min(1, 'Please upload a document.'),
  length: z.enum(['Short', 'Medium', 'Long']),
  style: z.enum(['Bulleted List', 'Paragraph']),
});

type FormData = z.infer<typeof formSchema>;

export default function DocumentSummarizerTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SummarizeDocumentOutput | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentDataUri: '',
      length: 'Medium',
      style: 'Paragraph',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload a document smaller than 10MB."});
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
    const response = await handleSummarizeDocumentAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error summarizing document',
        description: response.error,
      });
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold font-headline">Document Summarizer</h1>
        <p className="text-muted-foreground">Get a quick summary of any uploaded document.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Summarize a Document</CardTitle>
          <CardDescription>
            Upload a document and choose your desired summary length and style.
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
                        <FileText className="w-12 h-12 text-primary" />
                        <p className='text-sm font-medium'>{fileName}</p>
                         <Button variant="link" size="sm" asChild className='p-0 h-auto'>
                           <label htmlFor="file-upload" className="cursor-pointer">Change file</label>
                         </Button>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="w-12 h-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          <label htmlFor="file-upload" className="font-semibold text-primary cursor-pointer hover:underline">
                            Click to upload
                          </label>
                           {' '}or drag and drop
                        </p>
                         <p className="text-xs text-muted-foreground">PDF, DOCX, TXT up to 10MB</p>
                      </>
                    )}
                    <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt"/>
                  </div>
                </FormControl>
                <FormMessage>{form.formState.errors.documentDataUri?.message}</FormMessage>
              </FormItem>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="length"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Summary Length</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select length" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Short">Short</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Long">Long</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="style"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Summary Style</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Paragraph">Paragraph</SelectItem>
                          <SelectItem value="Bulleted List">Bulleted List</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Summarizing...' : 'Summarize'}
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
            <div className="prose prose-invert max-w-none whitespace-pre-wrap">
              {result.summary}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
