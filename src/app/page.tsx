'use client';

import React, { useState } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Search,
  MessageCircleQuestion,
  CodeXml,
  ScanEye,
  ImageIcon,
  ClipboardList,
  FileText,
  type LucideIcon,
  PanelLeft,
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
} from 'lucide-react';
import { AppLogo } from '@/components/app-logo';
import AiExplanationTool from '@/components/tools/ai-explanation-tool';
import CodeAnalyzerTool from '@/components/tools/code-analyzer-tool';
import CodeGeneratorTool from '@/components/tools/code-generator-tool';
import SmartSearchTool from '@/components/tools/smart-search-tool';
import InterviewQuestionGeneratorTool from '@/components/tools/interview-question-generator-tool';
import ResumeFeedbackTool from '@/components/tools/resume-feedback-tool';
import DiagramGeneratorTool from '@/components/tools/diagram-generator-tool';
import TextToSpeechTool from '@/components/tools/text-to-speech-tool';
import CoverLetterAssistantTool from '@/components/tools/cover-letter-assistant-tool';
import CareerPathSuggesterTool from '@/components/tools/career-path-suggester-tool';
import DocumentSummarizerTool from '@/components/tools/document-summarizer-tool';
import ImageGeneratorTool from '@/components/tools/image-generator-tool';
import PresentationGeneratorTool from '@/components/tools/presentation-generator-tool';
import LinkedInVisualsGeneratorTool from '@/components/tools/linkedin-visuals-generator-tool';
import WatermarkRemoverTool from '@/components/tools/watermark-remover-tool';
import ImageTextManipulationTool from '@/components/tools/image-text-manipulation-tool';

type ToolId =
  | 'smart-search'
  | 'ai-explanation'
  | 'code-generator'
  | 'code-analyzer'
  | 'interview-question-generator'
  | 'resume-feedback'
  | 'cover-letter-assistant'
  | 'career-path-suggester'
  | 'document-summarizer'
  | 'image-generator'
  | 'diagram-generator'
  | 'presentation-generator'
  | 'linkedin-visuals-generator'
  | 'text-to-speech'
  | 'watermark-remover'
  | 'image-text-manipulation';

type ToolConfig = {
  id: ToolId;
  name: string;
  icon: LucideIcon;
  component: React.ComponentType;
};

const tools: ToolConfig[] = [
  {
    id: 'smart-search',
    name: 'Smart Search',
    icon: Search,
    component: SmartSearchTool,
  },
  {
    id: 'ai-explanation',
    name: 'AI Explanation',
    icon: MessageCircleQuestion,
    component: AiExplanationTool,
  },
  {
    id: 'code-generator',
    name: 'Code Generator',
    icon: CodeXml,
    component: CodeGeneratorTool,
  },
  {
    id: 'code-analyzer',
    name: 'Code Analyzer',
    icon: ScanEye,
    component: CodeAnalyzerTool,
  },
  {
    id: 'interview-question-generator',
    name: 'Interview Questions',
    icon: ClipboardList,
    component: InterviewQuestionGeneratorTool,
  },
  {
    id: 'resume-feedback',
    name: 'Resume & Portfolio',
    icon: FileText,
    component: ResumeFeedbackTool,
  },
  {
    id: 'cover-letter-assistant',
    name: 'Cover Letter Assistant',
    icon: Mail,
    component: CoverLetterAssistantTool,
  },
  {
    id: 'career-path-suggester',
    name: 'Career Path Suggester',
    icon: Compass,
    component: CareerPathSuggesterTool,
  },
  {
    id: 'document-summarizer',
    name: 'Document Summarizer',
    icon: FileSearch,
    component: DocumentSummarizerTool,
  },
  {
    id: 'image-generator',
    name: 'Image Generator',
    icon: ImageIcon,
    component: ImageGeneratorTool,
  },
  {
    id: 'diagram-generator',
    name: 'Diagram Generator',
    icon: GitGraph,
    component: DiagramGeneratorTool,
  },
  {
    id: 'presentation-generator',
    name: 'Presentation Generator',
    icon: Presentation,
    component: PresentationGeneratorTool,
  },
  {
    id: 'linkedin-visuals-generator',
    name: 'LinkedIn Visuals',
    icon: Linkedin,
    component: LinkedInVisualsGeneratorTool,
  },
  {
    id: 'text-to-speech',
    name: 'Text to Speech',
    icon: Mic,
    component: TextToSpeechTool,
  },
  {
    id: 'watermark-remover',
    name: 'Watermark Remover',
    icon: Eraser,
    component: WatermarkRemoverTool,
  },
  {
    id: 'image-text-manipulation',
    name: 'Image Text Manipulation',
    icon: Type,
    component: ImageTextManipulationTool,
  },
];

export default function Home() {
  const [activeTool, setActiveTool] = useState<ToolId>('smart-search');

  const ActiveToolComponent = tools.find((tool) => tool.id === activeTool)?.component;

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3">
            <AppLogo className="w-8 h-8 text-accent" />
            <h1 className="font-headline text-xl font-bold text-primary group-data-[collapsible=icon]:hidden">
              AI Mentor
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {tools.map((tool) => (
              <SidebarMenuItem key={tool.id}>
                <SidebarMenuButton
                  onClick={() => setActiveTool(tool.id)}
                  isActive={activeTool === tool.id}
                  tooltip={{ children: tool.name }}
                >
                  <tool.icon />
                  <span>{tool.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b md:hidden">
            <div className="flex items-center gap-3">
                <AppLogo className="w-8 h-8 text-accent" />
                <h1 className="font-headline text-xl font-bold text-primary">
                AI Mentor
                </h1>
            </div>
            <SidebarTrigger />
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          {ActiveToolComponent ? <ActiveToolComponent /> : (
            <div>
              <h1 className="text-2xl font-bold">Select a tool</h1>
              <p>Please select a tool from the sidebar to get started.</p>
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
