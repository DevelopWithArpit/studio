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
import { Loader2, UploadCloud, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { SummarizeDocumentOutput } from '@/ai/flows/document-summarizer-tool';

const formSchema = z.object({
  documentDataUris: z.array(z.string()).min(1, 'Please upload at least one document.'),
  length: z.enum(['Short', 'Medium', 'Long']),
  style: z.enum(['Bulleted List', 'Paragraph']),
});

type FormData = z.infer<typeof formSchema>;
type FileInfo = { name: string; dataUri: string };

export default function DocumentSummarizerTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SummarizeDocumentOutput | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileInfo[]>([]);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentDataUris: [],
      length: 'Medium',
      style: 'Paragraph',
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const filePromises = Array.from(files).map(file => {
      return new Promise<FileInfo | null>((resolve, reject) => {
        if (file.size > 200 * 1024 * 1024) { // 200MB limit
          toast({ variant: "destructive", title: "File too large", description: `"${file.name}" is larger than 200MB.`});
          resolve(null);
          return;
        }
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          const dataUri = loadEvent.target?.result as string;
          resolve({ name: file.name, dataUri });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    try {
        const newFiles = (await Promise.all(filePromises)).filter((file): file is FileInfo => file !== null);
        const updatedFiles = [...selectedFiles, ...newFiles];
        setSelectedFiles(updatedFiles);
        form.setValue('documentDataUris', updatedFiles.map(f => f.dataUri));
        form.clearErrors('documentDataUris');
    } catch (error) {
        toast({ variant: "destructive", title: "Error reading files", description: "There was a problem processing your files."});
    }

    if (e.target) {
      e.target.value = '';
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    form.setValue('documentDataUris', updatedFiles.map(f => f.dataUri));
  };


  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleSummarizeDocumentAction(data);
    setIsLoading(false);

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error summarizing document',
        description: response.error || 'An unknown error occurred.',
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
          <CardTitle>Summarize Documents</CardTitle>
          <CardDescription>
            Upload one or more documents and choose your desired summary length and style.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormItem>
                <FormLabel>Documents</FormLabel>
                <FormControl>
                  <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center min-h-[150px]">
                    <UploadCloud className="w-12 h-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      <label htmlFor="file-upload" className="font-semibold text-primary cursor-pointer hover:underline">
                        Click to upload
                      </label>
                       {' '}or drag and drop
                    </p>
                     <p className="text-xs text-muted-foreground">PDF, DOCX, TXT up to 200MB each</p>
                    <Input id="file-upload" type="file" multiple className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt"/>
                  </div>
                </FormControl>
                {selectedFiles.length > 0 && (
                    <div className="space-y-2 mt-4">
                        <p className="text-sm font-medium">Selected files:</p>
                        <div className="flex flex-wrap gap-2">
                        {selectedFiles.map((file, index) => (
                            <Badge key={index} variant="secondary" className="pl-3 pr-1 py-1 text-sm">
                                {file.name}
                                <button type="button" onClick={() => removeFile(index)} className="ml-2 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </button>
                            </Badge>
                        ))}
                        </div>
                    </div>
                )}
                <FormMessage>{form.formState.errors.documentDataUris?.message}</FormMessage>
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
