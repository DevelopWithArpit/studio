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
  Bot,
} from 'lucide-react';
import { AppLogo } from '@/components/app-logo';
import { SheetTitle } from '@/components/ui/sheet';
import { RobotsBuildingLoader } from '@/components/ui/robots-building-loader';

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
const ImageGeneratorTool = dynamic(() => import('@/components/tools/image-generator-tool'), { loading: () => <RobotsBuildingLoader /> });
const PresentationGeneratorTool = dynamic(() => import('@/components/tools/presentation-generator-tool'), { loading: () => <RobotsBuildingLoader /> });
const LinkedInVisualsGeneratorTool = dynamic(() => import('@/components/tools/linkedin-visuals-generator-tool'), { loading: () => <RobotsBuildingLoader /> });
const WatermarkRemoverTool = dynamic(() => import('@/components/tools/watermark-remover-tool'), { loading: () => <RobotsBuildingLoader /> });
const ImageTextManipulationTool = dynamic(() => import('@/components/tools/image-text-manipulation-tool'), { loading: () => <RobotsBuildingLoader /> });
const PortfolioGeneratorTool = dynamic(() => import('@/components/tools/portfolio-generator-tool'), { loading: () => <RobotsBuildingLoader /> });
const ResumeCustomizerTool = dynamic(() => import('@/components/tools/resume-customizer-tool'), { loading: () => <RobotsBuildingLoader /> });
const TextHumanizerTool = dynamic(() => import('@/components/tools/text-humanizer-tool'), { loading: () => <RobotsBuildingLoader /> });
const AcademicWriterTool = dynamic(() => import('@/components/tools/academic-writer-tool'), { loading: () => <RobotsBuildingLoader /> });
const SipReportGeneratorTool = dynamic(() => import('@/components/tools/sip-report-generator-tool'), { loading: () => <RobotsBuildingLoader /> });
const AutomatedReportBuilderTool = dynamic(() => import('@/components/tools/automated-report-builder-tool'), { loading: () => <RobotsBuildingLoader /> });
const ReportEditorTool = dynamic(() => import('@/components/tools/report-editor-tool'), { loading: () => <RobotsBuildingLoader /> });


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
  | 'image-generator'
  | 'diagram-generator'
  | 'presentation-generator'
  | 'text-to-speech'
  | 'text-humanizer'
  | 'watermark-remover'
  | 'image-text-manipulation'
  | 'academic-writer'
  | 'sip-report-generator'
  | 'automated-report-builder'
  | 'report-editor';

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
    name: 'Resume Feedback',
    icon: UserSquare,
    component: ResumeFeedbackTool,
  },
  {
    id: 'linkedin-visuals-generator',
    name: 'LinkedIn Visuals',
    icon: Linkedin,
    component: LinkedInVisualsGeneratorTool,
  },
  {
    id: 'portfolio-generator',
    name: 'Portfolio Generator',
    icon: Briefcase,
    component: PortfolioGeneratorTool,
  },
  {
    id: 'sip-report-generator',
    name: 'SIP Report Generator',
    icon: Briefcase,
    component: SipReportGeneratorTool,
  },
  {
    id: 'automated-report-builder',
    name: 'Automated Report Builder',
    icon: Bot,
    component: AutomatedReportBuilderTool,
  },
  {
    id: 'report-editor',
    name: 'SIP Report Editor',
    icon: FileEdit,
    component: ReportEditorTool,
  },
  {
    id: 'resume-customizer',
    name: 'Resume Customizer',
    icon: FileEdit,
    component: ResumeCustomizerTool,
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
    id: 'academic-writer',
    name: 'Academic Writer',
    icon: FileText,
    component: AcademicWriterTool,
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
    id: 'text-to-speech',
    name: 'Text to Speech',
    icon: Mic,
    component: TextToSpeechTool,
  },
  {
    id: 'text-humanizer',
    name: 'Text Humanizer',
    icon: Sparkles,
    component: TextHumanizerTool,
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
  const [activeTool, setActiveTool] = useState<ToolId>('resume-customizer');

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
          <Suspense fallback={<RobotsBuildingLoader />}>
            {ActiveToolComponent ? <ActiveToolComponent /> : (
              <div>
                <h1 className="text-2xl font-bold">Select a tool</h1>
                <p>Please select a tool from the sidebar to get started.</p>
              </div>
            )}
          </Suspense>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
