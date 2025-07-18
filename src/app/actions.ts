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
  imageToolkit,
  type ImageToolkitInput,
} from '@/ai/flows/image-toolkit';
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

export async function handleImageToolkitAction(input: ImageToolkitInput) {
  return handleAction(input, imageToolkit);
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
