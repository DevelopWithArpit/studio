'use client';

import React from 'react';
import Link from 'next/link';
import {
  Search,
  MessageCircleQuestion,
  CodeXml,
  ScanEye,
  ImageIcon,
  ClipboardList,
  FileText,
  type LucideIcon,
  GitGraph,
  Mic,
  Mail,
  Compass,
  FileSearch,
  Paintbrush,
  Presentation,
  UserSquare,
  Linkedin,
  Eraser,
  Type,
  Briefcase,
  FileEdit,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import { AppLogo } from '@/components/app-logo';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';


type ToolConfig = {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  href: string;
  category: string;
};

const tools: ToolConfig[] = [
  {
    id: 'smart-search',
    name: 'Smart Search',
    icon: Search,
    description: 'Analyze documents for important information.',
    href: '/tools/smart-search',
    category: 'Analysis',
  },
  {
    id: 'ai-explanation',
    name: 'AI Explanation',
    icon: MessageCircleQuestion,
    description: 'Get clear explanations for complex topics.',
    href: '/tools/ai-explanation',
    category: 'Learning',
  },
  {
    id: 'code-generator',
    name: 'Code Generator',
    icon: CodeXml,
    description: 'Generate code snippets from instructions.',
    href: '/tools/code-generator',
    category: 'Development',
  },
  {
    id: 'code-analyzer',
    name: 'Code Analyzer',
    icon: ScanEye,
    description: 'Analyze code for errors and vulnerabilities.',
    href: '/tools/code-analyzer',
    category: 'Development',
  },
  {
    id: 'interview-question-generator',
    name: 'Interview Questions',
    icon: ClipboardList,
    description: 'Generate tailored interview questions.',
    href: '/tools/interview-question-generator',
    category: 'Career',
  },
  {
    id: 'resume-feedback',
    name: 'Resume Feedback',
    icon: UserSquare,
    description: 'Get AI feedback and a rewritten resume.',
    href: '/tools/resume-feedback',
    category: 'Career',
  },
  {
    id: 'linkedin-visuals-generator',
    name: 'LinkedIn Visuals',
    icon: Linkedin,
    description: 'Create profile pictures and banners.',
    href: '/tools/linkedin-visuals-generator',
    category: 'Career',
  },
  {
    id: 'portfolio-generator',
    name: 'Portfolio Generator',
    icon: Briefcase,
    description: 'Generate a portfolio website from your resume.',
    href: '/tools/portfolio-generator',
    category: 'Career',
  },
  {
    id: 'resume-customizer',
    name: 'Resume Customizer',
    icon: FileEdit,
    description: 'Customize your resume layout and style.',
    href: '/tools/resume-customizer',
    category: 'Career',
  },
  {
    id: 'cover-letter-assistant',
    name: 'Cover Letter Assistant',
    icon: Mail,
    description: 'Generate a professional cover letter.',
    href: '/tools/cover-letter-assistant',
    category: 'Career',
  },
  {
    id: 'career-path-suggester',
    name: 'Career Path Suggester',
    icon: Compass,
    description: 'Discover career paths based on your profile.',
    href: '/tools/career-path-suggester',
    category: 'Career',
  },
  {
    id: 'document-summarizer',
    name: 'Document Summarizer',
    icon: FileSearch,
    description: 'Get a quick summary of any document.',
    href: '/tools/document-summarizer',
    category: 'Analysis',
  },
  {
    id: 'diagram-generator',
    name: 'Diagram Generator',
    icon: GitGraph,
    description: 'Create diagrams from text descriptions.',
    href: '/tools/diagram-generator',
    category: 'Development',
  },
  {
    id: 'presentation-generator',
    name: 'Presentation Generator',
    icon: Presentation,
    description: 'Create a slide deck from a topic.',
    href: '/tools/presentation-generator',
    category: 'Productivity',
  },
  {
    id: 'text-to-speech',
    name: 'Text to Speech',
    icon: Mic,
    description: 'Convert text into natural-sounding speech.',
    href: '/tools/text-to-speech',
    category: 'Productivity',
  },
  {
    id: 'text-humanizer',
    name: 'Text Humanizer',
    icon: Sparkles,
    description: 'Make AI text sound more human.',
    href: '/tools/text-humanizer',
    category: 'Writing',
  },
  {
    id: 'watermark-remover',
    name: 'Watermark Remover',
    icon: Eraser,
    description: 'Attempt to remove watermarks from images.',
    href: '/tools/watermark-remover',
    category: 'Media',
  },
  {
    id: 'image-text-manipulation',
    name: 'Image Text Manipulation',
    icon: Type,
    description: 'Edit text directly within an image.',
    href: '/tools/image-text-manipulation',
    category: 'Media',
  },
   {
    id: 'thesis-generator-tool',
    name: 'Academic Writer',
    icon: GraduationCap,
    description: 'Generate structured academic documents.',
    href: '/tools/thesis-generator-tool',
    category: 'Writing',
  },
];

const categories = [...new Set(tools.map(tool => tool.category))];

export default function Home() {

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
            <div className="mr-4 flex">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <AppLogo className="w-6 h-6" />
                    <span className="font-bold sm:inline-block">AI Mentor</span>
                </Link>
            </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container relative">
            <section className="py-12 md:py-20 lg:py-24">
                <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
                    <h1 className="font-headline text-3xl font-bold leading-tight tracking-tighter sm:text-5xl lg:text-6xl">
                        A Suite of Powerful AI Tools
                    </h1>
                    <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                        Your personal AI-powered assistant for everything from career development and coding to writing and media editing.
                    </p>
                </div>
            </section>
            
            <section>
                {categories.map(category => (
                    <div key={category} className="mb-12">
                        <h2 className="text-2xl font-headline font-bold tracking-tight mb-6">{category}</h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {tools.filter(tool => tool.category === category).map(tool => (
                                <Card key={tool.id} className="flex flex-col overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-primary/20 hover:shadow-lg">
                                    <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
                                        <div className="p-2 rounded-md bg-secondary text-secondary-foreground border">
                                            <tool.icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-lg">{tool.name}</CardTitle>
                                            <CardDescription className="mt-1 leading-relaxed">
                                                {tool.description}
                                            </CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardFooter className="pt-4 mt-auto">
                                        <Button asChild className="w-full">
                                            <Link href={tool.href}>Launch Tool</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </section>
        </div>
      </main>
    </div>
  );
}
