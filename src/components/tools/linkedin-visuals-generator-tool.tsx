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
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { handleGenerateLinkedInVisualsAction } from '@/app/actions';
import type { GenerateLinkedInVisualsOutput } from '@/ai/flows/linkedin-visuals-generator-tool';
import { FileText, UploadCloud } from 'lucide-react';

const formSchema = z.object({
  resumeDataUri: z.string().min(1, 'Please upload your resume.'),
  userPhotoUri: z.string().optional(),
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
      userPhotoUri: '',
    },
  });

  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 200 * 1024 * 1024) { // 200MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload a resume smaller than 200MB."});
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        form.setValue('resumeDataUri', dataUri);
        setResumeFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 200 * 1024 * 1024) { // 200MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload an image smaller than 200MB."});
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

  async function onSubmit(data: FormData) {
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
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">LinkedIn Visuals Generator</h1>
        <p className="text-muted-foreground">
          Create a professional profile picture and cover banner for your LinkedIn profile.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Generate Visuals</CardTitle>
          <CardDescription>
            Upload your resume for context and optionally upload a photo to use as a base.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <FormItem>
                  <FormLabel>Your Resume</FormLabel>
                   <FormControl>
                     <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center h-[265px]">
                      {resumeFileName ? (
                        <div className='flex flex-col items-center gap-2'>
                          <FileText className="w-12 h-12 text-accent" />
                          <p className='text-sm font-medium'>{resumeFileName}</p>
                           <Button variant="link" size="sm" asChild className='p-0 h-auto'>
                             <label htmlFor="resume-upload" className="cursor-pointer">Change file</label>
                           </Button>
                        </div>
                      ) : (
                        <>
                          <UploadCloud className="w-12 h-12 text-muted-foreground" />
                          <p className="mt-2 text-sm text-muted-foreground">
                            <label htmlFor="resume-upload" className="font-semibold text-accent cursor-pointer hover:underline">
                              Click to upload
                            </label>
                          </p>
                           <p className="text-xs text-muted-foreground">PDF, DOCX, TXT up to 200MB</p>
                        </>
                      )}
                      <Input id="resume-upload" type="file" className="sr-only" onChange={handleResumeFileChange} accept=".pdf,.doc,.docx,.txt"/>
                    </div>
                   </FormControl>
                  <FormMessage>{form.formState.errors.resumeDataUri?.message}</FormMessage>
                </FormItem>
                <FormItem>
                  <FormLabel>Your Photo (Optional)</FormLabel>
                   <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center h-[265px]">
                    {photoPreview ? (
                      <Image src={photoPreview} alt="Image preview" layout="fill" objectFit="contain" className="rounded-md" />
                    ) : (
                      <>
                        <UploadCloud className="w-12 h-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          <label htmlFor="photo-upload" className="font-semibold text-accent cursor-pointer hover:underline">
                             Upload a headshot
                          </label>
                        </p>
                        <Input id="photo-upload" type="file" accept="image/*" className="sr-only" onChange={handlePhotoFileChange} />
                         <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 200MB</p>
                      </>
                    )}
                  </div>
                </FormItem>
              </div>
              <Button type="submit" disabled={isLoading}>
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
                    {result?.profilePictureUrl && <Image src={result.profilePictureUrl} alt="Generated profile picture" width={192} height={192} className="rounded-full border" />}
                </div>
             </div>
             <div className="space-y-4">
                <h3 className="font-semibold text-center font-headline">Cover Banner</h3>
                 {isLoading && !result ? <Skeleton className="w-full h-48 rounded-lg" /> : null}
                 {result?.coverBannerUrl && <Image src={result.coverBannerUrl} alt="Generated cover banner" width={1584} height={396} className="rounded-lg border aspect-[4/1] object-cover" />}
             </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
