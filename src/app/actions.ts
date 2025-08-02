
'use server';

import {
  explainTopic,
  type ExplainTopicInput,
} from '@/ai/flows/ai-explanation-tool';
import {
  smartSearch,
  type SmartSearchInput,
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
  type GetResumeFeedbackInput,
} from '@/ai/flows/resume-feedback-tool';
import {
  generateDiagram,
  type GenerateDiagramInput,
} from '@/ai/flows/diagram-generator-tool';
import {
    textToSpeech,
    type TextToSpeechInput,
} from '@/ai/flows/text-to-speech-tool';
import {
    generateCoverLetter,
    type GenerateCoverLetterInput,
} from '@/ai/flows/cover-letter-assistant-tool';
import {
    suggestCareerPaths,
    type SuggestCareerPathsInput,
} from '@/ai/flows/career-path-suggester-tool';
import {
    summarizeDocument,
    type SummarizeDocumentInput,
} from '@/ai/flows/document-summarizer-tool';
import {
    generateImage,
    type GenerateImageInput,
} from '@/ai/flows/image-generator-tool';
import {
    generatePresentation,
    type GeneratePresentationInput,
} from '@/ai/flows/presentation-generator-tool';
import {
    generateLinkedInVisuals,
    type GenerateLinkedInVisualsInput,
} from '@/ai/flows/linkedin-visuals-generator-tool';
import {
    removeWatermark,
    type RemoveWatermarkInput,
} from '@/ai/flows/watermark-remover-tool';
import {
    manipulateImageText,
    type ManipulateImageTextInput,
} from '@/ai/flows/image-text-manipulation-tool';
import {
    generatePortfolioWebsite,
    extractPortfolioDataFromText,
    type GeneratePortfolioWebsiteInput,
} from '@/ai/flows/portfolio-generator-tool';
import {
    customizeResume,
    type CustomizeResumeInput,
} from '@/ai/flows/resume-customizer-tool';
import {
    humanizeText,
    type HumanizeTextInput,
} from '@/ai/flows/text-humanizer-tool';
import {
    generateAcademicDocument,
    type GenerateAcademicDocumentInput,
} from '@/ai/flows/academic-writer-tool';


async function handleAction<T_Input, T_Output>(
  input: T_Input,
  flow: (input: T_Input) => Promise<T_Output>
) {
  try {
    const result = await flow(input);
    return { success: true, data: result };
  } catch (e) {
    const errorMessage =
      e instanceof Error ? e.message : 'An unexpected error occurred.';
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

export async function handleGenerateImageAction(input: GenerateImageInput) {
    return handleAction(input, generateImage);
}

export async function handleGeneratePresentationAction(input: GeneratePresentationInput) {
    return handleAction(input, generatePresentation);
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

export async function handleCustomizeResumeAction(input: CustomizeResumeInput) {
    return handleAction(input, customizeResume);
}

export async function handleHumanizeTextAction(input: HumanizeTextInput) {
    return handleAction(input, humanizeText);
}

export async function handleGenerateAcademicDocumentAction(input: GenerateAcademicDocumentInput) {
    return handleAction(input, generateAcademicDocument);
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
