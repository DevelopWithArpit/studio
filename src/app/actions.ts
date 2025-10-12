
'use server';

import {
  explainTopic,
  type ExplainTopicInput,
} from '@/ai/flows/ai-explanation-tool';
import {
  smartSearch,
} from '@/ai/flows/smart-search-tool';
import {
  generateCode,
  type GenerateCodeInput,
} from '@/ai/flows/code-generator-tool';
import {
  analyzeCode,
  type AnalyzeCodeInput,
} from '@/ai/flows/code-analyzer-tool';
import {
  generateInterviewQuestions,
  type GenerateInterviewQuestionsInput,
} from '@/ai/flows/interview-question-generator-tool';
import {
  getResumeFeedback,
} from '@/ai/flows/resume-feedback-tool';
import {
  generateDiagram,
  type GenerateDiagramInput,
} from '@/ai/flows/diagram-generator-tool';
import {
    textToSpeech,
} from '@/ai/flows/text-to-speech-tool';
import {
    generateCoverLetter,
} from '@/ai/flows/cover-letter-assistant-tool';

import {
    suggestCareerPaths,
    type SuggestCareerPathsInput,
} from '@/ai/flows/career-path-suggester-tool';
import {
    summarizeDocument,
} from '@/ai/flows/document-summarizer-tool';
import {
    generatePresentation,
    generateSingleImage,
    type GeneratePresentationInput as FlowInput,
    type GenerateSingleImageInput,
} from '@/ai/flows/presentation-generator-tool';
import {
    generateLinkedInVisuals,
} from '@/ai/flows/linkedin-visuals-generator-tool';
import {
    removeWatermark,
} from '@/ai/flows/watermark-remover-tool';
import {
    manipulateImageText,
} from '@/ai/flows/image-text-manipulation-tool';
import {
    generatePortfolioWebsite,
    extractPortfolioDataFromText,
} from '@/ai/flows/portfolio-generator-tool';
import {
    humanizeText,
} from '@/ai/flows/text-humanizer-tool';
import {
  generateAcademicDocument,
} from '@/ai/flows/thesis-generator-tool';
import {
  generateProjectReport,
} from '@/ai/flows/project-report-generator-tool';
import { generateVideo, checkVideoStatus } from '@/ai/flows/video-generator-tool';
import type { GenerateVideoInput } from '@/ai/flows/video-generator-tool';
import type { GenerateProjectReportInput } from '@/app/tools/project-report/page';
import type { GenerateAcademicDocumentInput } from '@/app/tools/thesis-generator/page';
import type { HumanizeTextInput } from '@/app/tools/text-humanizer/page';
import type { GeneratePortfolioWebsiteInput } from '@/ai/flows/portfolio-generator-tool';
import type { ManipulateImageTextInput } from '@/app/tools/image-text-manipulation/page';
import type { RemoveWatermarkInput } from '@/app/tools/watermark-remover/page';
import type { GenerateLinkedInVisualsInput } from '@/app/tools/linkedin-visuals-generator/page';
import type { SummarizeDocumentInput } from '@/app/tools/document-summarizer/page';
import type { GenerateCoverLetterInput } from '@/app/tools/cover-letter-assistant/page';
import type { TextToSpeechInput } from '@/app/tools/text-to-speech/page';
import type { GetResumeFeedbackInput } from '@/app/tools/resume-feedback/page';
import type { SmartSearchInput } from '@/app/tools/smart-search/page';

export type GeneratePresentationInput = FlowInput;

async function handleAction<T_Input, T_Output>(
  input: T_Input,
  flow: (input: T_Input) => Promise<T_Output>
): Promise<{ success: boolean; data?: T_Output, error?: string }> {
  try {
    const result = await flow(input);
    return { success: true, data: result };
  } catch (e: any) {
    console.error(e);
    const errorMessage = e.message || String(e);
    if (errorMessage.includes('429')) {
      return { success: false, error: 'Too Many Requests: The API is rate-limited. Please wait a moment before trying again.' };
    }
    return { success: false, error: errorMessage };
  }
}

export async function handleExplainTopicAction(input: ExplainTopicInput) {
  return handleAction(input, explainTopic);
}

export async function handleSmartSearchAction(input: SmartSearchInput) {
  return handleAction(input, smartSearch);
}

export async function handleGenerateCodeAction(input: GenerateCodeInput) {
  return handleAction(input, generateCode);
}

export async function handleAnalyzeCodeAction(input: AnalyzeCodeInput) {
  return handleAction(input, analyzeCode);
}

export async function handleGenerateInterviewQuestionsAction(input: GenerateInterviewQuestionsInput) {
  return handleAction(input, generateInterviewQuestions);
}

export async function handleGetResumeFeedbackAction(input: GetResumeFeedbackInput) {
  return handleAction(input, getResumeFeedback);
}

export async function handleGenerateDiagramAction(input: GenerateDiagramInput) {
    return handleAction(input, generateDiagram);
}

export async function handleTextToSpeechAction(input: TextToSpeechInput) {
    return handleAction(input, textToSpeech);
}

export async function handleGenerateCoverLetterAction(input: GenerateCoverLetterInput) {
    return handleAction(input, generateCoverLetter);
}

export async function handleSuggestCareerPathsAction(input: SuggestCareerPathsInput) {
    return handleAction(input, suggestCareerPaths);
}

export async function handleSummarizeDocumentAction(input: SummarizeDocumentInput) {
    return handleAction(input, summarizeDocument);
}

export async function handleGeneratePresentationAction(input: GeneratePresentationInput) {
    return handleAction(input, generatePresentation);
}

export async function handleGenerateSingleImageAction(input: GenerateSingleImageInput) {
    return handleAction(input, generateSingleImage);
}

export async function handleGenerateLinkedInVisualsAction(input: GenerateLinkedInVisualsInput) {
    return handleAction(input, generateLinkedInVisuals);
}

export async function handleRemoveWatermarkAction(input: RemoveWatermarkInput) {
    return handleAction(input, removeWatermark);
}

export async function handleManipulateImageTextAction(input: ManipulateImageTextInput) {
    return handleAction(input, manipulateImageText);
}

export async function handleHumanizeTextAction(input: HumanizeTextInput) {
    return handleAction(input, humanizeText);
}

export async function handleGenerateAcademicDocumentAction(input: GenerateAcademicDocumentInput) {
    return handleAction(input, generateAcademicDocument);
}

export async function handleGenerateProjectReportAction(input: GenerateProjectReportInput) {
    return handleAction(input, generateProjectReport);
}

export async function handleGenerateVideoAction(input: GenerateVideoInput) {
  return handleAction(input, generateVideo);
}

export async function handleCheckVideoStatusAction(input: {operationName: string}) {
  return handleAction(input, checkVideoStatus);
}


type GeneratePortfolioWebsiteActionInput = 
    | { type: 'resume'; resumeDataUri: string; certificateDataUri?: string | null; }
    | { type: 'manual'; data: GeneratePortfolioWebsiteInput; };

export async function handleGeneratePortfolioWebsiteAction(input: GeneratePortfolioWebsiteActionInput) {
    try {
        let portfolioData: GeneratePortfolioWebsiteInput;

        if (input.type === 'resume') {
            const extractedData = await extractPortfolioDataFromText(input.resumeDataUri);
            portfolioData = {
                ...extractedData,
                profession: extractedData.profession || 'Not Specified',
                certificateDataUri: input.certificateDataUri || undefined,
            };
        } else {
            portfolioData = input.data;
        }

        const result = await generatePortfolioWebsite(portfolioData);
        return { success: true, data: result };
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
        return { success: false, error: errorMessage };
    }
}
