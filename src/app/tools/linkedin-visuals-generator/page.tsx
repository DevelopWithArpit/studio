
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { saveAs } from 'file-saver';
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
import { Input } from '@/components/ui/input';
import { handleGenerateLinkedInVisualsAction } from '@/app/actions';
import type { GenerateLinkedInVisualsInput, GenerateLinkedInVisualsOutput } from '@/ai/flows/linkedin-visuals-generator-tool';
import { Download, FileText, Loader2, UploadCloud } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  resumeDataUri: z.string().optional(),
  resumeText: z.string().optional(),
  userPhotoUri: z.string().optional(),
}).refine(data => !!data.resumeDataUri || !!data.resumeText, {
    message: 'Please either upload a resume or enter text manually.',
    path: ['resumeDataUri'],
});

type FormData = z.infer<typeof formSchema>;

export default function LinkedInVisualsGeneratorTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateLinkedInVisualsOutput | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeDataUri: '',
      resumeText: '',
      userPhotoUri: '',
    },
  });

  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload a resume smaller than 10MB."});
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        form.setValue('resumeDataUri', dataUri);
        form.setValue('resumeText', ''); // Clear text input if file is uploaded
        setResumeFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload an image smaller than 10MB."});
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        form.setValue('userPhotoUri', dataUri);
        setPhotoPreview(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleDownload = (url: string, filename: string) => {
    saveAs(url, filename);
    toast({
      title: 'Download Started',
      description: `${filename} is downloading.`,
    });
  };

  async function onSubmit(data: GenerateLinkedInVisualsInput) {
    setIsLoading(true);
    setResult(null);
    const response = await handleGenerateLinkedInVisualsAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error generating visuals',
        description: response.error,
      });
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold font-headline">LinkedIn Visuals Generator</h1>
        <p className="text-muted-foreground">
          Create a professional profile picture and cover banner for your LinkedIn profile.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Generate Visuals</CardTitle>
          <CardDescription>
            Provide your resume for context and optionally upload a photo to use as a base.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload">Upload Resume</TabsTrigger>
                        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload" className="mt-4">
                        <FormItem>
                            <FormLabel>Your Resume</FormLabel>
                            <FormControl>
                                <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center h-[265px]">
                                {resumeFileName ? (
                                    <div className='flex flex-col items-center gap-2'>
                                    <FileText className="w-12 h-12 text-primary" />
                                    <p className='text-sm font-medium'>{resumeFileName}</p>
                                    <Button variant="link" size="sm" asChild className='p-0 h-auto'>
                                        <label htmlFor="resume-upload" className="cursor-pointer">Change file</label>
                                    </Button>
                                    </div>
                                ) : (
                                    <>
                                    <UploadCloud className="w-12 h-12 text-muted-foreground" />
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        <label htmlFor="resume-upload" className="font-semibold text-primary cursor-pointer hover:underline">
                                        Click to upload
                                        </label>
                                    </p>
                                    <p className="text-xs text-muted-foreground">PDF, DOCX, TXT up to 10MB</p>
                                    </>
                                )}
                                <Input id="resume-upload" type="file" className="sr-only" onChange={handleResumeFileChange} accept=".pdf,.doc,.docx,.txt"/>
                                </div>
                            </FormControl>
                             <FormMessage>{form.formState.errors.resumeDataUri?.message}</FormMessage>
                        </FormItem>
                    </TabsContent>
                    <TabsContent value="manual" className="mt-4">
                        <FormField
                            control={form.control}
                            name="resumeText"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Paste Resume Content</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Paste your resume content here..."
                                            {...field}
                                            rows={12}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                form.setValue('resumeDataUri', '');
                                                setResumeFileName(null);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </TabsContent>
                </Tabs>
                
                <FormItem>
                  <FormLabel>Your Photo (Optional)</FormLabel>
                   <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center h-[265px]">
                    {photoPreview ? (
                      <Image src={photoPreview} alt="Image preview" layout="fill" objectFit="contain" className="rounded-md" />
                    ) : (
                      <>
                        <UploadCloud className="w-12 h-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          <label htmlFor="photo-upload" className="font-semibold text-primary cursor-pointer hover:underline">
                             Upload a headshot
                          </label>
                        </p>
                        <Input id="photo-upload" type="file" accept="image/*" className="sr-only" onChange={handlePhotoFileChange} />
                         <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</p>
                      </>
                    )}
                  </div>
                </FormItem>

              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Generating...' : 'Generate Visuals'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || result) && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Visuals</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-4">
                <h3 className="font-semibold text-center font-headline">Profile Picture</h3>
                <div className="flex justify-center">
                    {isLoading && !result ? <Skeleton className="w-48 h-48 rounded-full" /> : null}
                    {result?.profilePictureUrl && (
                        <div className="flex flex-col items-center gap-4">
                            <Image src={result.profilePictureUrl} alt="Generated profile picture" width={192} height={192} className="rounded-full border" />
                            <Button onClick={() => handleDownload(result.profilePictureUrl, 'profile-picture.png')}>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                            </Button>
                        </div>
                    )}
                </div>
             </div>
             <div className="space-y-4">
                <h3 className="font-semibold text-center font-headline">Cover Banner</h3>
                 {isLoading && !result ? <Skeleton className="w-full aspect-[4/1] rounded-lg" /> : null}
                 {result?.coverBannerUrl && (
                    <div className="flex flex-col items-center gap-4">
                        <Image src={result.coverBannerUrl} alt="Generated cover banner" width={1584} height={396} className="rounded-lg border aspect-[4/1] object-cover" />
                        <Button onClick={() => handleDownload(result.coverBannerUrl, 'cover-banner.png')}>
                           <Download className="mr-2 h-4 w-4" />
                            Download
                        </Button>
                    </div>
                 )}
             </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
