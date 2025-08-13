
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
import { handleGeneratePortfolioWebsiteAction } from '@/app/actions';
import type { GeneratePortfolioWebsiteOutput, GeneratePortfolioWebsiteInput } from '@/ai/flows/portfolio-generator-tool';
import { Copy, Download, FileArchive, FileText, Loader2, Plus, Trash2, UploadCloud } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const portfolioSchema = z.object({
    name: z.string().min(1, "Name is required."),
    headline: z.string().min(1, "Headline is required."),
    profession: z.string().min(1, "Profession is required."),
    contact: z.object({
        email: z.string().email("Invalid email address."),
        phone: z.string().optional(),
        linkedin: z.string().optional(),
        github: z.string().optional(),
        socials: z.array(z.object({
            network: z.string(),
            url: z.string().url().or(z.literal('')),
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
    achievements: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof portfolioSchema>;

export default function PortfolioGeneratorTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeneratePortfolioWebsiteOutput | null>(null);
  const { toast } = useToast();
  const [resumeDataUri, setResumeDataUri] = useState<string | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [certificateDataUri, setCertificateDataUri] = useState<string | null>(null);
  const [certificateFileName, setCertificateFileName] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
        name: '',
        headline: '',
        profession: '',
        contact: { email: '', socials: [{ network: 'LinkedIn', url: '' }, { network: 'GitHub', url: '' }] },
        about: '',
        experience: [{ title: '', company: '', dates: '', description: '' }],
        education: [{ degree: '', school: '', dates: '' }],
        projects: [{ title: '', description: '', link: '', imageUrl: '' }],
        skills: [],
        achievements: [],
    },
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control: form.control, name: "experience" });
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control: form.control, name: "education" });
  const { fields: projFields, append: appendProj, remove: removeProj } = useFieldArray({ control: form.control, name: "projects" });
  const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({ control: form.control, name: "contact.socials" });

  async function onManualSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleGeneratePortfolioWebsiteAction({ type: 'manual', data });
    setIsLoading(false);

    if (response.success && response.data) {
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

  const onResumeSubmit = async () => {
    if (!resumeDataUri) {
        toast({ variant: 'destructive', title: 'No Resume Provided', description: 'Please upload a resume.' });
        return;
    }
    setIsLoading(true);
    setResult(null);
    const response = await handleGeneratePortfolioWebsiteAction({ type: 'resume', resumeDataUri, certificateDataUri });
    setIsLoading(false);

    if (response.success && response.data) {
      setResult(response.data);
      toast({ title: 'Website Generated!', description: 'Your portfolio has been successfully generated from the provided resume.' });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Generating Website',
        description: response.error,
      });
    }
  };
  
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

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFileName: React.Dispatch<React.SetStateAction<string | null>>,
    setDataUri: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 200 * 1024 * 1024) { // 200MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload a document smaller than 200MB."});
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = async (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        setDataUri(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold font-headline">Portfolio Website Generator</h1>
        <p className="text-muted-foreground">
          Generate a website from your resume, or by filling out the form manually.
        </p>
      </header>
      
      <Card>
        <CardHeader>
            <CardTitle>Create Your Portfolio</CardTitle>
            <CardDescription>Choose your preferred method to get started.</CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="auto-generate">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="auto-generate">From Resume</TabsTrigger>
                    <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                </TabsList>
                <TabsContent value="auto-generate" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>1. Upload Resume</Label>
                            <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center h-48">
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
                                                Upload Resume
                                            </label>
                                        </p>
                                        <p className="text-xs text-muted-foreground">PDF, DOCX, TXT</p>
                                    </>
                                )}
                                <Input id="resume-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e, setResumeFileName, setResumeDataUri)} accept=".pdf,.docx,.txt" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>2. Upload Certificate (Optional)</Label>
                            <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center h-48">
                                {certificateFileName ? (
                                    <div className='flex flex-col items-center gap-2'>
                                        <FileText className="w-12 h-12 text-primary" />
                                        <p className='text-sm font-medium'>{certificateFileName}</p>
                                        <Button variant="link" size="sm" asChild className='p-0 h-auto'>
                                            <label htmlFor="cert-upload" className="cursor-pointer">Change file</label>
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <UploadCloud className="w-12 h-12 text-muted-foreground" />
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            <label htmlFor="cert-upload" className="font-semibold text-primary cursor-pointer hover:underline">
                                                Upload Certificate
                                            </label>
                                        </p>
                                        <p className="text-xs text-muted-foreground">Image or PDF</p>
                                    </>
                                )}
                                <Input id="cert-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e, setCertificateFileName, setCertificateDataUri)} accept="image/*,.pdf" />
                            </div>
                        </div>
                    </div>
                     <div className="mt-6">
                        <Button onClick={onResumeSubmit} disabled={isLoading || !resumeDataUri}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Generate Website
                        </Button>
                    </div>
                </TabsContent>
                <TabsContent value="manual" className="mt-6">
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onManualSubmit)} className="space-y-8">
                        {/* Personal Details */}
                        <Card>
                            <CardHeader><CardTitle>Personal Details</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField control={form.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Full Name</FormLabel> <FormControl><Input placeholder="John Doe" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                    <FormField control={form.control} name="headline" render={({ field }) => ( <FormItem> <FormLabel>Headline</FormLabel> <FormControl><Input placeholder="Software Engineer | AI Enthusiast" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                </div>
                                <FormField control={form.control} name="profession" render={({ field }) => ( <FormItem> <FormLabel>Profession</FormLabel> <FormControl><Input placeholder="e.g., Software Engineer" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                 <FormField control={form.control} name="contact.email" render={({ field }) => ( <FormItem> <FormLabel>Email</FormLabel> <FormControl><Input placeholder="your.email@example.com" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                <FormField control={form.control} name="about" render={({ field }) => ( <FormItem> <FormLabel>About Me</FormLabel> <FormControl><Textarea placeholder="A short bio about yourself..." {...field} rows={5} /></FormControl> <FormMessage /> </FormItem> )}/>
                            </CardContent>
                        </Card>

                        {/* Social Links */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Social Links</CardTitle>
                                <Button type="button" variant="outline" size="sm" onClick={() => appendSocial({ network: '', url: '' })}><Plus className="mr-2 h-4 w-4" /> Add Link</Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {socialFields.map((field, index) => (
                                    <div key={field.id} className="flex gap-4 items-end">
                                        <FormField control={form.control} name={`contact.socials.${index}.network`} render={({ field }) => ( <FormItem className="flex-1"> <FormLabel>Network</FormLabel> <FormControl><Input {...field} placeholder="e.g., LinkedIn" /></FormControl> <FormMessage /> </FormItem> )}/>
                                        <FormField control={form.control} name={`contact.socials.${index}.url`} render={({ field }) => ( <FormItem className="flex-1"> <FormLabel>URL</FormLabel> <FormControl><Input {...field} placeholder="https://linkedin.com/in/..." /></FormControl> <FormMessage /> </FormItem> )}/>
                                        <Button type="button" variant="ghost" size="icon" className="h-9 w-9" onClick={() => removeSocial(index)}><Trash2 className="h-4 w-4" /></Button>
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
                                            <FormField control={form.control} name={`projects.${index}.imageUrl`} render={({ field }) => ( <FormItem> <FormLabel>Image URL (Optional)</FormLabel> <FormControl><Input {...field} placeholder="https://placehold.co/600x400" /></FormControl> <FormMessage /> </FormItem> )}/>
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
                                                    onChange={(e) => {
                                                        const skillsArray = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                                        field.onChange(skillsArray);
                                                    }}
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
                        
                        {/* Achievements */}
                        <Card>
                            <CardHeader><CardTitle>Achievements</CardTitle></CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="achievements"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Enter your achievements, separated by commas</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="e.g., Won 1st place in hackathon, Published a paper"
                                                    onChange={(e) => {
                                                        const achievementsArray = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                                        field.onChange(achievementsArray);
                                                    }}
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

                        <Button type="submit" disabled={isLoading}>
                             {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Generate Website from Form
                        </Button>
                    </form>
                </Form>
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>

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
                result &&
                <Tabs defaultValue="preview">
                    <TabsList>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                        <TabsTrigger value="html">HTML</TabsTrigger>
                        <TabsTrigger value="css">CSS</TabsTrigger>
                        <TabsTrigger value="js">JavaScript</TabsTrigger>
                    </TabsList>
                    <TabsContent value="preview" className="mt-4">
                        <iframe 
                            srcDoc={`<html><head><style>${result.css}</style></head><body>${result.html}<script>${result.javascript}</script></body></html>`}
                            className="w-full h-[600px] border rounded-md"
                            title="Portfolio Preview"
                        />
                    </TabsContent>
                    <TabsContent value="html">
                        <CodeBlock 
                          code={result.html} 
                          onCopy={() => copyToClipboard(result.html, 'HTML')} 
                          onDownload={() => downloadFile(result.html, 'index.html', 'text/html')}
                        />
                    </TabsContent>
                     <TabsContent value="css">
                        <CodeBlock 
                          code={result.css} 
                          onCopy={() => copyToClipboard(result.css, 'CSS')}
                          onDownload={() => downloadFile(result.css, 'style.css', 'text/css')}
                        />
                    </TabsContent>
                     <TabsContent value="js">
                        <CodeBlock 
                          code={result.javascript} 
                          onCopy={() => copyToClipboard(result.javascript, 'JavaScript')}
                          onDownload={() => downloadFile(result.javascript, 'script.js', 'text/javascript')}
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
