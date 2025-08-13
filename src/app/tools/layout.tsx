
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  Search,
  MessageCircleQuestion,
  CodeXml,
  ScanEye,
  ClipboardList,
  type LucideIcon,
  GitGraph,
  Mic,
  Mail,
  Compass,
  FileSearch,
  Presentation,
  UserSquare,
  Linkedin,
  Eraser,
  Type,
  Briefcase,
  FileEdit,
  Sparkles,
  GraduationCap,
  Github,
  LifeBuoy,
  Settings,
} from 'lucide-react';
import { AppLogo } from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type ToolConfig = {
  id: string;
  name: string;
  icon: LucideIcon;
  href: string;
  category: string;
};

const tools: ToolConfig[] = [
  { id: 'smart-search', name: 'Smart Search', icon: Search, href: '/tools/smart-search', category: 'Analysis' },
  { id: 'document-summarizer', name: 'Document Summarizer', icon: FileSearch, href: '/tools/document-summarizer', category: 'Analysis' },
  { id: 'ai-explanation', name: 'AI Explanation', icon: MessageCircleQuestion, href: '/tools/ai-explanation', category: 'Learning' },
  { id: 'code-generator', name: 'Code Generator', icon: CodeXml, href: '/tools/code-generator', category: 'Development' },
  { id: 'code-analyzer', name: 'Code Analyzer', icon: ScanEye, href: '/tools/code-analyzer', category: 'Development' },
  { id: 'diagram-generator', name: 'Diagram Generator', icon: GitGraph, href: '/tools/diagram-generator', category: 'Development' },
  { id: 'interview-question-generator', name: 'Interview Questions', icon: ClipboardList, href: '/tools/interview-question-generator', category: 'Career' },
  { id: 'resume-feedback', name: 'Resume Feedback', icon: UserSquare, href: '/tools/resume-feedback', category: 'Career' },
  { id: 'resume-customizer', name: 'Resume Customizer', icon: FileEdit, href: '/tools/resume-customizer', category: 'Career' },
  { id: 'portfolio-generator', name: 'Portfolio Generator', icon: Briefcase, href: '/tools/portfolio-generator', category: 'Career' },
  { id: 'cover-letter-assistant', name: 'Cover Letter Assistant', icon: Mail, href: '/tools/cover-letter-assistant', category: 'Career' },
  { id: 'career-path-suggester', name: 'Career Path Suggester', icon: Compass, href: '/tools/career-path-suggester', category: 'Career' },
  { id: 'linkedin-visuals-generator', name: 'LinkedIn Visuals', icon: Linkedin, href: '/tools/linkedin-visuals-generator', category: 'Career' },
  { id: 'presentation-generator', name: 'Presentation Generator', icon: Presentation, href: '/tools/presentation-generator', category: 'Productivity' },
  { id: 'text-to-speech', name: 'Text to Speech', icon: Mic, href: '/tools/text-to-speech', category: 'Productivity' },
  { id: 'text-humanizer', name: 'Text Humanizer', icon: Sparkles, href: '/tools/text-humanizer', category: 'Writing' },
  { id: 'watermark-remover', name: 'Watermark Remover', icon: Eraser, href: '/tools/watermark-remover', category: 'Media' },
  { id: 'image-text-manipulation', name: 'Image Text Manipulation', icon: Type, href: '/tools/image-text-manipulation', category: 'Media' },
];

const categories = [...new Set(tools.map(tool => tool.category))];

const ToolSidebar = () => {
  const pathname = usePathname();
  
  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="h-16 flex items-center justify-center">
        <Link href="/" className="flex items-center gap-2.5">
            <AppLogo className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold font-headline group-data-[collapsible=icon]:hidden">
            AI Mentor
            </span>
        </Link>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        {categories.map((category) => (
          <SidebarMenu key={category}>
            <SidebarMenuItem>
              <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground group-data-[collapsible=icon]:hidden">
                {category}
              </div>
            </SidebarMenuItem>
            {tools
              .filter((tool) => tool.category === category)
              .map((tool) => (
                <SidebarMenuItem key={tool.id}>
                  <Link href={tool.href} className="block">
                    <SidebarMenuButton
                      isActive={pathname === tool.href}
                      tooltip={{
                        children: tool.name,
                        side: 'right',
                        align: 'center'
                      }}
                      className="justify-start"
                    >
                      <tool.icon className="w-5 h-5 shrink-0" />
                      <span className="truncate">{tool.name}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
          </SidebarMenu>
        ))}
      </SidebarContent>
       <SidebarFooter>
        <Separator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={{children: 'Support', side: 'right', align: 'center'}}>
              <LifeBuoy />
              <span className="truncate">Support</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={{children: 'Settings', side: 'right', align: 'center'}}>
              <Settings />
              <span className="truncate">Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <ToolSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 lg:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="ml-auto flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Button>
            </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-5xl">
                {children}
            </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
