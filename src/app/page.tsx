
'use client';

import React, { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
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
  SidebarFooter,
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
  Briefcase,
  FileEdit,
  Sparkles,
} from 'lucide-react';
import { AppLogo } from '@/components/app-logo';
import { SheetTitle } from '@/components/ui/sheet';
import { RobotsBuildingLoader } from '@/components/ui/robots-building-loader';
import { Button } from '@/components/ui/button';

const AiExplanationTool = dynamic(() => import('@/components/tools/ai-explanation-tool'), { loading: () => <RobotsBuildingLoader /> });
const CodeAnalyzerTool = dynamic(() => import('@/components/tools/code-analyzer-tool'), { loading: () => <RobotsBuildingLoader /> });
const CodeGeneratorTool = dynamic(() => import('@/components/tools/code-generator-tool'), { loading: () => <RobotsBuildingLoader /> });
const SmartSearchTool = dynamic(() => import('@/components/tools/smart-search-tool'), { loading: () => <RobotsBuildingLoader /> });
const InterviewQuestionGeneratorTool = dynamic(() => import('@/components/tools/interview-question-generator-tool'), { loading: () => <RobotsBuildingLoader /> });
const ResumeFeedbackTool = dynamic(() => import('@/components/tools/resume-feedback-tool'), { loading: () => <RobotsBuildingLoader /> });
const DiagramGeneratorTool = dynamic(() => import('@/components/tools/diagram-generator-tool'), { loading: () => <RobotsBuildingLoader /> });
const TextToSpeechTool = dynamic(() => import('@/components/tools/text-to-speech-tool'), { loading: () => <RobotsBuildingLoader /> });
const CoverLetterAssistantTool = dynamic(() => import('@/components/tools/cover-letter-assistant-tool'), { loading: () => <RobotsBuildingLoader /> });
const CareerPathSuggesterTool = dynamic(() => import('@/components/tools/career-path-suggester-tool'), { loading: () => <RobotsBuildingLoader /> });
const DocumentSummarizerTool = dynamic(() => import('@/components/tools/document-summarizer-tool'), { loading: () => <RobotsBuildingLoader /> });
const PresentationGeneratorTool = dynamic(() => import('@/components/tools/presentation-generator-tool'), { loading: () => <RobotsBuildingLoader /> });
const LinkedInVisualsGeneratorTool = dynamic(() => import('@/components/tools/linkedin-visuals-generator-tool'), { loading: () => <RobotsBuildingLoader /> });
const WatermarkRemoverTool = dynamic(() => import('@/components/tools/watermark-remover-tool'), { loading: () => <RobotsBuildingLoader /> });
const ImageTextManipulationTool = dynamic(() => import('@/components/tools/image-text-manipulation-tool'), { loading: () => <RobotsBuildingLoader /> });
const PortfolioGeneratorTool = dynamic(() => import('@/components/tools/portfolio-generator-tool'), { loading: () => <RobotsBuildingLoader /> });
const ResumeCustomizerTool = dynamic(() => import('@/components/tools/resume-customizer-tool'), { loading: () => <RobotsBuildingLoader /> });
const TextHumanizerTool = dynamic(() => import('@/components/tools/text-humanizer-tool'), { loading: () => <RobotsBuildingLoader /> });


type ToolId =
  | 'smart-search'
  | 'ai-explanation'
  | 'code-generator'
  | 'code-analyzer'
  | 'interview-question-generator'
  | 'resume-feedback'
  | 'resume-customizer'
  | 'linkedin-visuals-generator'
  | 'portfolio-generator'
  | 'cover-letter-assistant'
  | 'career-path-suggester'
  | 'document-summarizer'
  | 'diagram-generator'
  | 'presentation-generator'
  | 'text-to-speech'
  | 'text-humanizer'
  | 'watermark-remover'
  | 'image-text-manipulation';

type ToolConfig = {
  id: ToolId;
  name: string;
  icon: LucideIcon;
  component: React.ComponentType;
  description: string;
};

const tools: ToolConfig[] = [
  {
    id: 'smart-search',
    name: 'Smart Search',
    icon: Search,
    component: SmartSearchTool,
    description: 'Analyze documents for important information.',
  },
  {
    id: 'ai-explanation',
    name: 'AI Explanation',
    icon: MessageCircleQuestion,
    component: AiExplanationTool,
    description: 'Get clear explanations for complex topics.',
  },
  {
    id: 'code-generator',
    name: 'Code Generator',
    icon: CodeXml,
    component: CodeGeneratorTool,
    description: 'Generate code snippets from instructions.',
  },
  {
    id: 'code-analyzer',
    name: 'Code Analyzer',
    icon: ScanEye,
    component: CodeAnalyzerTool,
    description: 'Analyze code for errors and vulnerabilities.',
  },
  {
    id: 'interview-question-generator',
    name: 'Interview Questions',
    icon: ClipboardList,
    component: InterviewQuestionGeneratorTool,
    description: 'Generate tailored interview questions.',
  },
  {
    id: 'resume-feedback',
    name: 'Resume Feedback',
    icon: UserSquare,
    component: ResumeFeedbackTool,
    description: 'Get AI feedback on your resume.',
  },
  {
    id: 'linkedin-visuals-generator',
    name: 'LinkedIn Visuals',
    icon: Linkedin,
    component: LinkedInVisualsGeneratorTool,
    description: 'Create profile pictures and banners.',
  },
  {
    id: 'portfolio-generator',
    name: 'Portfolio Generator',
    icon: Briefcase,
    component: PortfolioGeneratorTool,
    description: 'Generate a portfolio website.',
  },
  {
    id: 'resume-customizer',
    name: 'Resume Customizer',
    icon: FileEdit,
    component: ResumeCustomizerTool,
    description: 'Customize your resume layout and style.',
  },
  {
    id: 'cover-letter-assistant',
    name: 'Cover Letter Assistant',
    icon: Mail,
    component: CoverLetterAssistantTool,
    description: 'Generate a professional cover letter.',
  },
  {
    id: 'career-path-suggester',
    name: 'Career Path Suggester',
    icon: Compass,
    component: CareerPathSuggesterTool,
    description: 'Discover career paths based on your profile.',
  },
  {
    id: 'document-summarizer',
    name: 'Document Summarizer',
    icon: FileSearch,
    component: DocumentSummarizerTool,
    description: 'Get a quick summary of any document.',
  },
  {
    id: 'diagram-generator',
    name: 'Diagram Generator',
    icon: GitGraph,
    component: DiagramGeneratorTool,
    description: 'Create diagrams from text descriptions.',
  },
  {
    id: 'presentation-generator',
    name: 'Presentation Generator',
    icon: Presentation,
    component: PresentationGeneratorTool,
    description: 'Create a slide deck from a topic.',
  },
  {
    id: 'text-to-speech',
    name: 'Text to Speech',
    icon: Mic,
    component: TextToSpeechTool,
    description: 'Convert text into natural-sounding speech.',
  },
  {
    id: 'text-humanizer',
    name: 'Text Humanizer',
    icon: Sparkles,
    component: TextHumanizerTool,
    description: 'Make AI text sound more human.',
  },
  {
    id: 'watermark-remover',
    name: 'Watermark Remover',
    icon: Eraser,
    component: WatermarkRemoverTool,
    description: 'Attempt to remove watermarks from images.',
  },
  {
    id: 'image-text-manipulation',
    name: 'Image Text Manipulation',
    icon: Type,
    component: ImageTextManipulationTool,
    description: 'Edit text directly within an image.',
  },
];

export default function Home() {
  const [activeToolId, setActiveToolId] = useState<ToolId>('smart-search');

  const activeTool = tools.find((tool) => tool.id === activeToolId);
  const ActiveToolComponent = activeTool?.component;

  return (
    <SidebarProvider>
      <div className="bg-grid">
        <Sidebar>
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-3">
              <AppLogo className="w-8 h-8 text-primary" />
              <h1 className="font-headline text-xl font-bold text-foreground group-data-[collapsible=icon]:hidden">
                AI Mentor
              </h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {tools.map((tool) => (
                <SidebarMenuItem key={tool.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveToolId(tool.id)}
                    isActive={activeToolId === tool.id}
                    tooltip={{ children: tool.name }}
                  >
                    <tool.icon />
                    <span>{tool.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
              <div className="border-t border-border p-4 group-data-[collapsible=icon]:hidden">
                  <h3 className="font-semibold text-foreground">AI Mentor Pro</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">Unlock more features and advanced tools.</p>
                  <Button className="w-full" variant="secondary">Upgrade</Button>
              </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex items-center justify-between p-4 border-b md:hidden">
              <div className="flex items-center gap-3">
                  <AppLogo className="w-8 h-8 text-primary" />
                  <h1 className="font-headline text-xl font-bold text-foreground">
                  AI Mentor
                  </h1>
              </div>
              <SidebarTrigger />
          </header>
          <main className="p-4 sm:p-6 lg:p-8">
            <Suspense fallback={<RobotsBuildingLoader />}>
              {activeTool && ActiveToolComponent ? (
                 <>
                    <header className="space-y-1 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-md bg-secondary text-secondary-foreground border border-border">
                                <activeTool.icon className="w-6 h-6" />
                            </div>
                            <h1 className="text-3xl font-bold font-headline">{activeTool.name}</h1>
                        </div>
                        <p className="text-muted-foreground text-lg ml-14">{activeTool.description}</p>
                    </header>
                    <ActiveToolComponent />
                </>
              ) : (
                <div className="text-center py-20">
                  <h1 className="text-2xl font-bold">Select a tool</h1>
                  <p>Please select a tool from the sidebar to get started.</p>
                </div>
              )}
            </Suspense>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
