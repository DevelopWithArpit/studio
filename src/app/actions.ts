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
    type GeneratePortfolioWebsiteInput,
} from '@/ai/flows/portfolio-generator-tool';

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

export async function handleGeneratePortfolioWebsiteAction(resumeDataUri: string) {
    try {
        const feedbackResponse = await getResumeFeedback({ resume: resumeDataUri });
        
        if (!feedbackResponse.rewrittenResume) {
            throw new Error('Failed to parse the resume into a structured format.');
        }

        const { rewrittenResume } = feedbackResponse;

        const portfolioInput: GeneratePortfolioWebsiteInput = {
            fullName: rewrittenResume.name,
            headline: rewrittenResume.experience.length > 0 ? `${rewrittenResume.experience[0].title} at ${rewrittenResume.experience[0].company}` : 'Professional Profile',
            about: rewrittenResume.summary,
            contactEmail: rewrittenResume.contact.email,
            socialLinks: {
                linkedin: rewrittenResume.contact.linkedin,
                github: rewrittenResume.contact.github,
            },
            experience: rewrittenResume.experience.map(exp => ({
                title: exp.title,
                company: exp.company,
                dates: exp.dates,
                description: exp.bullets.join('. ')
            })),
            education: rewrittenResume.education.map(edu => ({
                degree: edu.degree,
                school: edu.school,
                dates: edu.dates,
            })),
            skills: [...rewrittenResume.skills.technical, ...(rewrittenResume.skills.other || [])],
            projects: rewrittenResume.projects.length > 0 ? rewrittenResume.projects.map(p => ({
                title: p.title,
                description: p.bullets.join('. '),
                imageUrl: 'https://placehold.co/600x400.png',
                projectUrl: rewrittenResume.contact.github ? `${rewrittenResume.contact.github}/${p.title.toLowerCase().replace(/ /g, '-')}` : 'https://github.com'
            })) : [
              {
                title: 'AI Mentor Platform',
                description: 'A suite of AI-powered tools to help with career development, from resume feedback to interview preparation.',
                imageUrl: 'https://placehold.co/600x400.png',
                projectUrl: rewrittenResume.contact.github || 'https://github.com',
              }
            ],
        };
        
        const result = await generatePortfolioWebsite(portfolioInput);
        return { success: true, data: result };

    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
        return { success: false, error: errorMessage };
    }
}