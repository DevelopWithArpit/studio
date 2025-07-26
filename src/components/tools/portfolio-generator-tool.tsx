'use client';

import React, { useState, useRef } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleGeneratePortfolioWebsiteAction } from '@/app/actions';
import type { GeneratePortfolioWebsiteOutput } from '@/ai/flows/portfolio-generator-tool';
import { PlusCircle, Trash2, Copy, Download, Save, Upload, FileArchive } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const projectSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  imageUrl: z.string().url('Must be a valid URL.'),
  projectUrl: z.string().url('Must be a valid URL.'),
});

const formSchema = z.object({
  fullName: z.string().min(1, 'Full name is required.'),
  headline: z.string().min(1, 'Headline is required.'),
  about: z.string().min(10, 'About section needs at least 10 characters.'),
  projects: z.array(projectSchema).min(1, 'At least one project is required.'),
  skills: z.string().min(1, 'Please list at least one skill.'),
  contactEmail: z.string().email('Must be a valid email.'),
});

type FormData = z.infer<typeof formSchema>;

export default function PortfolioGeneratorTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeneratePortfolioWebsiteOutput | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: 'Arpit Pise',
      headline: 'AI & Robotics Engineer',
      about: 'A passionate engineer with a focus on building intelligent systems. I thrive at the intersection of software, hardware, and artificial intelligence.',
      projects: [
        {
          title: 'AI Mentor Platform',
          description: 'A suite of AI-powered tools to help with career development, from resume feedback to interview preparation.',
          imageUrl: 'https://placehold.co/600x400.png',
          projectUrl: 'https://github.com/DevelopWithArpit',
        },
      ],
      skills: 'Python, TensorFlow, PyTorch, C++, ROS, Docker, JavaScript',
      contactEmail: 'arpitpise1@gmail.com',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'projects',
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleGeneratePortfolioWebsiteAction({
        ...data,
        skills: data.skills.split(',').map(s => s.trim()),
    });
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
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
  
  const handleSaveData = () => {
    const data = form.getValues();
    const json = JSON.stringify(data, null, 2);
    downloadFile(json, 'portfolio-data.json', 'application/json');
     toast({
      title: 'Data Saved!',
      description: `Your portfolio data has been saved to portfolio-data.json.`,
    });
  };

  const handleLoadData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = e.target?.result as string;
          const data = JSON.parse(json);
          // Combine skills array back to a string for the form
          if (Array.isArray(data.skills)) {
            data.skills = data.skills.join(', ');
          }
          const parsedData = formSchema.parse(data);
          form.reset(parsedData);
          toast({
            title: 'Data Loaded!',
            description: `Your portfolio data has been loaded from ${file.name}.`,
          });
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'Error Loading Data',
            description: 'The selected file is not valid portfolio data.',
          });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Portfolio Website Generator</h1>
        <p className="text-muted-foreground">
          Create a professional, single-page portfolio with animations and visuals.
        </p>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
             <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Personal Information</CardTitle>
              </div>
              <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={handleSaveData}>
                    <Save className="mr-2 h-4 w-4"/>
                    Save Data
                  </Button>
                   <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4"/>
                    Load Data
                  </Button>
                  <input type="file" ref={fileInputRef} onChange={handleLoadData} accept=".json" className="hidden" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="headline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Headline</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Software Engineer | Tech Enthusiast" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About Me</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us a little about yourself..." {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>Enter your skills, separated by commas.</CardDescription>
            </CardHeader>
            <CardContent>
                <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Skills</FormLabel>
                        <FormControl>
                        <Textarea placeholder="e.g., JavaScript, React, Node.js, ..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </CardContent>
          </Card>


          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Showcase your best work.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4 border p-4 rounded-lg relative">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                        onClick={() => remove(index)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    <FormField
                    control={form.control}
                    name={`projects.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`projects.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name={`projects.${index}.imageUrl`}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                            <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name={`projects.${index}.projectUrl`}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Project URL</FormLabel>
                            <FormControl>
                            <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                   </div>
                </div>
              ))}
               <Button
                type="button"
                variant="outline"
                onClick={() => append({ title: '', description: '', imageUrl: '', projectUrl: '' })}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Project
              </Button>
            </CardContent>
          </Card>
          
          <Button type="submit" disabled={isLoading} size="lg">
            {isLoading ? 'Generating Website...' : 'Generate Website'}
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
