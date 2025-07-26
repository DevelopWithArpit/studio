'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
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
import { handleGeneratePortfolioWebsiteAction, handleGetResumeFeedbackAction } from '@/app/actions';
import type { GeneratePortfolioWebsiteOutput, GeneratePortfolioWebsiteInput } from '@/ai/flows/portfolio-generator-tool';
import { Copy, Download, FileArchive, FileText, Loader2, Plus, Trash2, UploadCloud } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

const portfolioSchema = z.object({
    name: z.string().min(1, "Name is required."),
    headline: z.string().min(1, "Headline is required."),
    contact: z.object({
        email: z.string().email("Invalid email address."),
        socials: z.array(z.object({
            network: z.string().min(1, "Network name is required."),
            url: z.string().url("Invalid URL."),
        })).optional(),
    }),
    about: z.string().min(20, "About section should be at least 20 characters."),
    experience: z.array(z.object({
        title: z.string().min(1, "Title is required."),
        company: z.string().min(1, "Company is required."),
        dates: z.string().min(1, "Dates are required."),
        description: z.string().min(1, "Description is required."),
    })),
    education: z.array(z.object({
        degree: z.string().min(1, "Degree is required."),
        school: z.string().min(1, "School is required."),
        dates: z.string().min(1, "Dates are required."),
    })),
    projects: z.array(z.object({
        title: z.string().min(1, "Title is required."),
        description: z.string().min(1, "Description is required."),
        link: z.string().url("Invalid URL.").optional().or(z.literal('')),
        imageUrl: z.string().url("Invalid URL.").optional().or(z.literal('')),
    })),
    skills: z.array(z.string().min(1)).min(1, "At least one skill is required."),
});

type FormData = z.infer<typeof portfolioSchema>;

export default function PortfolioGeneratorTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [result, setResult] = useState<GeneratePortfolioWebsiteOutput | null>(null);
  const { toast } = useToast();
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
        name: '',
        headline: '',
        contact: { email: '', socials: [{ network: 'LinkedIn', url: '' }, { network: 'GitHub', url: '' }] },
        about: '',
        experience: [{ title: '', company: '', dates: '', description: '' }],
        education: [{ degree: '', school: '', dates: '' }],
        projects: [{ title: '', description: '', link: '', imageUrl: '' }],
        skills: [],
    },
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control: form.control, name: "experience" });
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control: form.control, name: "education" });
  const { fields: projFields, append: appendProj, remove: removeProj } = useFieldArray({ control: form.control, name: "projects" });


  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleGeneratePortfolioWebsiteAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
      toast({ title: 'Website Generated!', description: 'Your portfolio has been successfully generated.' });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Generating Website',
        description: response.error,
      });
    }
  }
  
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${type} Copied!`,
      description: `The ${type.toLowerCase()} code has been copied to your clipboard.`,
    });
  };
  
  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    saveAs(blob, filename);
  };

  const handleDownloadZip = () => {
    if (!result) return;
    const zip = new JSZip();
    zip.file("index.html", result.html);
    zip.file("style.css", result.css);
    zip.file("script.js", result.javascript);
    zip.generateAsync({type:"blob"})
    .then(function(content) {
        saveAs(content, "portfolio-website.zip");
    });
     toast({
      title: 'Download Started!',
      description: `Your portfolio website is being downloaded as a zip file.`,
    });
  };

  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 200 * 1024 * 1024) { // 200MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload a document smaller than 200MB."});
        return;
      }
      setResumeFileName(file.name);
      const reader = new FileReader();
      reader.onload = async (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        setIsParsing(true);
        const response = await handleGetResumeFeedbackAction({ resume: dataUri });
        setIsParsing(false);

        if (response.success && response.data.rewrittenResume) {
            const resumeData = response.data.rewrittenResume;
            form.reset({
                name: resumeData.name,
                headline: '', // Headline is not in resume data, leave it empty
                contact: {
                    email: resumeData.contact.email,
                    socials: [
                        { network: 'LinkedIn', url: resumeData.contact.linkedin },
                        { network: 'GitHub', url: resumeData.contact.github || '' }
                    ]
                },
                about: resumeData.summary,
                experience: resumeData.experience.map(exp => ({ ...exp, description: exp.bullets.join('\n') })),
                education: resumeData.education.map(edu => ({...edu})),
                projects: resumeData.projects.map(p => ({ title: p.title, description: p.bullets.join('\n'), link: '', imageUrl: '' })),
                skills: resumeData.skills.technical,
            });
            toast({ title: 'Resume Parsed!', description: 'The form has been auto-filled with your resume data.' });
        } else {
            toast({ variant: "destructive", title: "Parsing Failed", description: response.error || "Could not extract data from your resume." });
        }
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Portfolio Website Generator</h1>
        <p className="text-muted-foreground">
          Enter your details manually, or upload a resume to get started quickly.
        </p>
      </header>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Get Started</CardTitle>
                    <CardDescription>Upload a resume to auto-fill the form, or fill it out manually below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center">
                        {isParsing ? (
                            <div className='flex flex-col items-center gap-2'>
                                <Loader2 className="w-12 h-12 text-accent animate-spin" />
                                <p className='text-sm font-medium'>Parsing Resume...</p>
                            </div>
                        ) : resumeFileName ? (
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
                                        Upload Resume (Optional)
                                    </label>
                                </p>
                                <p className="text-xs text-muted-foreground">PDF, DOCX, TXT up to 200MB</p>
                            </>
                        )}
                        <Input id="resume-upload" type="file" className="sr-only" onChange={handleResumeFileChange} accept=".pdf,.docx,.txt" disabled={isParsing} />
                    </div>
                </CardContent>
            </Card>

            {/* Personal Details */}
            <Card>
                <CardHeader><CardTitle>Personal Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Full Name</FormLabel> <FormControl><Input placeholder="John Doe" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                        <FormField control={form.control} name="headline" render={({ field }) => ( <FormItem> <FormLabel>Headline</FormLabel> <FormControl><Input placeholder="Software Engineer | AI Enthusiast" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                    </div>
                    <FormField control={form.control} name="contact.email" render={({ field }) => ( <FormItem> <FormLabel>Email</FormLabel> <FormControl><Input placeholder="your.email@example.com" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                    <FormField control={form.control} name="about" render={({ field }) => ( <FormItem> <FormLabel>About Me</FormLabel> <FormControl><Textarea placeholder="A short bio about yourself..." {...field} rows={5} /></FormControl> <FormMessage /> </FormItem> )}/>
                </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
                <CardHeader><CardTitle>Social Links</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {form.getValues('contact.socials')?.map((social, index) => (
                        <div key={index} className="flex gap-4 items-end">
                            <FormField control={form.control} name={`contact.socials.${index}.network`} render={({ field }) => ( <FormItem className="flex-1"> <FormLabel>Network</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                            <FormField control={form.control} name={`contact.socials.${index}.url`} render={({ field }) => ( <FormItem className="flex-1"> <FormLabel>URL</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Experience */}
            <Card>
                 <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Work Experience</CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendExp({ title: '', company: '', dates: '', description: '' })}><Plus className="mr-2 h-4 w-4" /> Add Experience</Button>
                </CardHeader>
                <CardContent className="space-y-6">
                    {expFields.map((field, index) => (
                        <div key={field.id} className="space-y-4 border p-4 rounded-md relative">
                             <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeExp(index)}><Trash2 className="h-4 w-4" /></Button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name={`experience.${index}.title`} render={({ field }) => ( <FormItem> <FormLabel>Job Title</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                <FormField control={form.control} name={`experience.${index}.company`} render={({ field }) => ( <FormItem> <FormLabel>Company</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                            </div>
                            <FormField control={form.control} name={`experience.${index}.dates`} render={({ field }) => ( <FormItem> <FormLabel>Dates</FormLabel> <FormControl><Input {...field} placeholder="e.g., June 2023 - Present" /></FormControl> <FormMessage /> </FormItem> )}/>
                            <FormField control={form.control} name={`experience.${index}.description`} render={({ field }) => ( <FormItem> <FormLabel>Description</FormLabel> <FormControl><Textarea {...field} rows={4} /></FormControl> <FormMessage /> </FormItem> )}/>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Education */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Education</CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendEdu({ degree: '', school: '', dates: '' })}><Plus className="mr-2 h-4 w-4" /> Add Education</Button>
                </CardHeader>
                <CardContent className="space-y-6">
                     {eduFields.map((field, index) => (
                        <div key={field.id} className="space-y-4 border p-4 rounded-md relative">
                            <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeEdu(index)}><Trash2 className="h-4 w-4" /></Button>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name={`education.${index}.degree`} render={({ field }) => ( <FormItem> <FormLabel>Degree</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                <FormField control={form.control} name={`education.${index}.school`} render={({ field }) => ( <FormItem> <FormLabel>School/University</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                            </div>
                             <FormField control={form.control} name={`education.${index}.dates`} render={({ field }) => ( <FormItem> <FormLabel>Dates</FormLabel> <FormControl><Input {...field} placeholder="e.g., 2022 - 2026" /></FormControl> <FormMessage /> </FormItem> )}/>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Projects */}
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Projects</CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendProj({ title: '', description: '', link: '', imageUrl: '' })}><Plus className="mr-2 h-4 w-4" /> Add Project</Button>
                </CardHeader>
                <CardContent className="space-y-6">
                    {projFields.map((field, index) => (
                        <div key={field.id} className="space-y-4 border p-4 rounded-md relative">
                            <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeProj(index)}><Trash2 className="h-4 w-4" /></Button>
                            <FormField control={form.control} name={`projects.${index}.title`} render={({ field }) => ( <FormItem> <FormLabel>Project Title</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                            <FormField control={form.control} name={`projects.${index}.description`} render={({ field }) => ( <FormItem> <FormLabel>Description</FormLabel> <FormControl><Textarea {...field} rows={3} /></FormControl> <FormMessage /> </FormItem> )}/>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name={`projects.${index}.link`} render={({ field }) => ( <FormItem> <FormLabel>Project Link (Optional)</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                <FormField control={form.control} name={`projects.${index}.imageUrl`} render={({ field }) => ( <FormItem> <FormLabel>Image URL (Optional)</FormLabel> <FormControl><Input {...field} placeholder="e.g., https://placehold.co/600x400" /></FormControl> <FormMessage /> </FormItem> )}/>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Skills */}
            <Card>
                <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
                <CardContent>
                     <FormField
                        control={form.control}
                        name="skills"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Enter your skills, separated by commas</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="e.g., Python, JavaScript, React, AI, Machine Learning"
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                                        value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                                        rows={3}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            <Button type="submit" disabled={isLoading || isParsing}>
                {(isLoading || isParsing) ? 'Generating...' : 'Generate Website'}
            </Button>
        </form>
      </Form>


      {(isLoading || result) && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Website Code</CardTitle>
            <CardDescription>Your portfolio code is ready. You can preview it or download the files.</CardDescription>
          </CardHeader>
          <CardContent>
             {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-10 w-1/3" />
                    <Skeleton className="h-64 w-full" />
                </div>
             ) : (
                <Tabs defaultValue="preview">
                    <TabsList>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                        <TabsTrigger value="html">HTML</TabsTrigger>
                        <TabsTrigger value="css">CSS</TabsTrigger>
                        <TabsTrigger value="js">JavaScript</TabsTrigger>
                    </TabsList>
                    <TabsContent value="preview" className="mt-4">
                        <iframe 
                            srcDoc={`<html><head><style>${result?.css}</style></head><body>${result?.html}<script>${result?.javascript}</script></body></html>`}
                            className="w-full h-[600px] border rounded-md"
                            title="Portfolio Preview"
                        />
                    </TabsContent>
                    <TabsContent value="html">
                        <CodeBlock 
                          code={result?.html ?? ''} 
                          onCopy={() => copyToClipboard(result?.html ?? '', 'HTML')} 
                          onDownload={() => downloadFile(result?.html ?? '', 'index.html', 'text/html')}
                        />
                    </TabsContent>
                     <TabsContent value="css">
                        <CodeBlock 
                          code={result?.css ?? ''} 
                          onCopy={() => copyToClipboard(result?.css ?? '', 'CSS')}
                          onDownload={() => downloadFile(result?.css ?? '', 'style.css', 'text/css')}
                        />
                    </TabsContent>
                     <TabsContent value="js">
                        <CodeBlock 
                          code={result?.javascript ?? ''} 
                          onCopy={() => copyToClipboard(result?.javascript ?? '', 'JavaScript')}
                          onDownload={() => downloadFile(result?.javascript ?? '', 'script.js', 'text/javascript')}
                        />
                    </TabsContent>
                </Tabs>
             )}
          </CardContent>
          {result && (
            <CardFooter>
                 <Button onClick={handleDownloadZip}>
                    <FileArchive className="mr-2 h-4 w-4" />
                    Download Site (.zip)
                </Button>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  );
}

const CodeBlock = ({ code, onCopy, onDownload }: { code: string; onCopy: () => void; onDownload: () => void; }) => {
  return (
    <div className="relative">
      <div className="absolute top-2 right-2 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onCopy}
        >
          <Copy className="h-4 w-4" />
        </Button>
         <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onDownload}
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
      <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm h-96">
        <code className="text-foreground">{code}</code>
      </pre>
    </div>
  );
};
