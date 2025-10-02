
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const files: Record<string, string> = {
  ".env": `GEMINI_API_KEY="YOUR_API_KEY_HERE"
`,
  ".gitignore": `
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env.local
.env.development.local
.env.test.local
.env.production.local

# vercel
.vercel
`,
  "README.md": `# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.
`,
  "apphosting.yaml": `# Settings to manage and configure a Firebase App Hosting backend.
# https://firebase.google.com/docs/app-hosting/configure
runConfig:
  # Increase this value if you'd like to automatically spin up
  # more instances in response to increased traffic.
  maxInstances: 1
build:
  # This command is run on the server to build your app.
  - npm run build
entrypoint:
  # This command is run on the server to start your app.
  - npm run start
`,
  "components.json": `
{
  "\$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
`,
    "next-env.d.ts": `/// <reference types="next" />
/// <reference types="next/image" />
`,
  "next.config.ts": `
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  serverActions: {
    maxDuration: 120, // 2 minutes
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
`,
  "package.json": `
{
  "name": "nextn",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 9002",
    "genkit:dev": "genkit start -- tsx src/ai/dev.ts",
    "genkit:watch": "genkit start -- tsx --watch src/ai/dev.ts",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@genkit-ai/firebase": "^1.15.5",
    "@genkit-ai/googleai": "^1.15.5",
    "@genkit-ai/next": "^1.15.5",
    "@hookform/resolvers": "^4.1.3",
    "@radix-ui/react-accordion": "^1.2.3",
    "@radix-ui/react-alert-dialog": "^1.1.6",
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-checkbox": "^1.1.4",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-menubar": "^1.1.6",
    "@radix-ui/react-popover": "^1.1.6",
    "@radix-ui/react-progress": "^1.1.2",
    "@radix-ui/react-radio-group": "^1.2.3",
    "html2canvas": "^1.4.1",
    "@radix-ui/react-scroll-area": "^1.2.3",
    "@radix-ui/react-select": "^2.1.6",
    "@radix-ui/react-separator": "^1.1.2",
    "@radix-ui/react-slider": "^1.2.3",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.1.3",
    "@radix-ui/react-tabs": "^1.1.3",
    "@radix-ui/react-toast": "^1.2.6",
    "@radix-ui/react-tooltip": "^1.1.8",
    "@tailwindcss/typography": "^0.5.13",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "docx": "^8.5.0",
    "dotenv": "^16.5.0",
    "embla-carousel-react": "^8.6.0",
    "file-saver": "^2.0.5",
    "firebase": "^11.9.1",
    "genkit": "^1.15.5",
    "jszip": "^3.10.1",
    "jspdf": "^2.5.1",
    "lucide-react": "^0.475.0",
    "next": "15.3.3",
    "patch-package": "^8.0.0",
    "pptxgenjs": "^3.12.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.54.2",
    "recharts": "^2.15.1",
    "tailwind-merge": "^3.0.1",
    "tailwindcss-animate": "^1.0.7",
    "wav": "^1.0.2",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/file-saver": "^2.0.7",
    "@types/jszip": "^3.4.1",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@types/wav": "^1.0.3",
    "genkit-cli": "^1.15.5",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
`,
  "package-lock.json": `
{
  "name": "nextn",
  "version": "0.1.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "nextn",
      "version": "0.1.0",
      "private": true,
      "dependencies": {
        "@genkit-ai/firebase": "^1.15.5",
        "@genkit-ai/googleai": "^1.15.5",
        "@genkit-ai/next": "^1.15.5",
        "@hookform/resolvers": "^4.1.3",
        "@radix-ui/react-accordion": "^1.2.3",
        "@radix-ui/react-alert-dialog": "^1.1.6",
        "@radix-ui/react-avatar": "^1.1.3",
        "@radix-ui/react-checkbox": "^1.1.4",
        "@radix-ui/react-collapsible": "^1.1.11",
        "@radix-ui/react-dialog": "^1.1.6",
        "@radix-ui/react-dropdown-menu": "^2.1.6",
        "@radix-ui/react-label": "^2.1.2",
        "@radix-ui/react-menubar": "^1.1.6",
        "@radix-ui/react-popover": "^1.1.6",
        "@radix-ui/react-progress": "^1.1.2",
        "@radix-ui/react-radio-group": "^1.2.3",
        "@radix-ui/react-scroll-area": "^1.2.3",
        "@radix-ui/react-select": "^2.1.6",
        "@radix-ui/react-separator": "^1.1.2",
        "@radix-ui/react-slider": "^1.2.3",
        "@radix-ui/react-slot": "^1.2.3",
        "@radix-ui/react-switch": "^1.1.3",
        "@radix-ui/react-tabs": "^1.1.3",
        "@radix-ui/react-toast": "^1.2.6",
        "@radix-ui/react-tooltip": "^1.1.8",
        "@tailwindcss/typography": "^0.5.13",
        "class-variance-authority": "^0.7.1",
        "clsx": "^2.1.1",
        "date-fns": "^3.6.0",
        "docx": "^8.5.0",
        "dotenv": "^16.5.0",
        "embla-carousel-react": "^8.6.0",
        "file-saver": "^2.0.5",
        "firebase": "^11.9.1",
        "genkit": "^1.15.5",
        "html2canvas": "^1.4.1",
        "jspdf": "^2.5.1",
        "jszip": "^3.10.1",
        "lucide-react": "^0.475.0",
        "next": "15.3.3",
        "patch-package": "^8.0.0",
        "pptxgenjs": "^3.12.0",
        "react": "^18.3.1",
        "react-day-picker": "^8.10.1",
        "react-dom": "^18.3.1",
        "react-hook-form": "^7.54.2",
        "recharts": "^2.15.1",
        "tailwind-merge": "^3.0.1",
        "tailwindcss-animate": "^1.0.7",
        "wav": "^1.0.2",
        "zod": "^3.24.2"
      },
      "devDependencies": {
        "@types/file-saver": "^2.0.7",
        "@types/jszip": "^3.4.1",
        "@types/node": "^20",
        "@types/react": "^18",
        "@types/react-dom": "^18",
        "@types/wav": "^1.0.3",
        "genkit-cli": "^1.15.5",
        "postcss": "^8",
        "tailwindcss": "^3.4.1",
        "typescript": "^5"
      }
    }
  }
}
`,
    "postcss.config.mjs": `/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
`,
    "tailwind.config.ts": `
import type {Config} from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['Space Grotesk', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
       typography: (theme: (arg0: string) => any) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'hsl(var(--foreground))',
            '--tw-prose-headings': 'hsl(var(--primary))',
            '--tw-prose-lead': 'hsl(var(--muted-foreground))',
            '--tw-prose-links': 'hsl(var(--primary))',
            '--tw-prose-bold': 'hsl(var(--foreground))',
            '--tw-prose-counters': 'hsl(var(--muted-foreground))',
            '--tw-prose-bullets': 'hsl(var(--border))',
            '--tw-prose-hr': 'hsl(var(--border))',
            '--tw-prose-quotes': 'hsl(var(--foreground))',
            '--tw-prose-quote-borders': 'hsl(var(--border))',
            '--tw-prose-captions': 'hsl(var(--muted-foreground))',
            '--tw-prose-code': 'hsl(var(--foreground))',
            '--tw-prose-pre-code': 'hsl(var(--foreground))',
            '--tw-prose-pre-bg': 'hsl(var(--muted))',
            '--tw-prose-th-borders': 'hsl(var(--border))',
            '--tw-prose-td-borders': 'hsl(var(--border))',
            '--tw-prose-invert-body': 'hsl(var(--foreground))',
            '--tw-prose-invert-headings': 'hsl(var(--primary))',
            '--tw-prose-invert-lead': 'hsl(var(--muted-foreground))',
            '--tw-prose-invert-links': 'hsl(var(--primary))',
            '--tw-prose-invert-bold': 'hsl(var(--foreground))',
            '--tw-prose-invert-counters': 'hsl(var(--muted-foreground))',
            '--tw-prose-invert-bullets': 'hsl(var(--border))',
            '--tw-prose-invert-hr': 'hsl(var(--border))',
            '--tw-prose-invert-quotes': 'hsl(var(--foreground))',
            '--tw-prose-invert-quote-borders': 'hsl(var(--border))',
            '--tw-prose-invert-captions': 'hsl(var(--muted-foreground))',
            '--tw-prose-invert-code': 'hsl(var(--foreground))',
            '--tw-prose-invert-pre-code': 'hsl(var(--foreground))',
            '--tw-prose-invert-pre-bg': 'hsl(var(--muted))',
            '--tw-prose-invert-th-borders': 'hsl(var(--border))',
            '--tw-prose-invert-td-borders': 'hsl(var(--border))',
          },
        },
      }),
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};
export default config;
`,
  "tsconfig.json": `
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
`,
  "src/ai/dev.ts": `
'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/smart-search-tool.ts';
import '@/ai/flows/ai-explanation-tool.ts';
import '@/ai/flows/code-generator-tool.ts';
import '@/ai/flows/code-analyzer-tool.ts';
import '@/ai/flows/interview-question-generator-tool.ts';
import '@/ai/flows/resume-feedback-tool.ts';
import '@/ai/flows/diagram-generator-tool.ts';
import '@/ai/flows/text-to-speech-tool.ts';
import '@/ai/flows/cover-letter-assistant-tool.ts';
import '@/ai/flows/career-path-suggester-tool.ts';
import '@/ai/flows/document-summarizer-tool.ts';
import '@/ai/flows/presentation-generator-tool.ts';
import '@/ai/flows/linkedin-visuals-generator-tool.ts';
import '@/ai/flows/watermark-remover-tool.ts';
import '@/ai/flows/image-text-manipulation-tool.ts';
import '@/ai/flows/portfolio-generator-tool.ts';
import '@/ai/flows/text-humanizer-tool.ts';
import '@/ai/flows/thesis-generator-tool.ts';
`,
  "src/ai/flows/ai-explanation-tool.ts": `
'use server';

/**
 * @fileOverview Provides an AI explanation for complex topics or concepts.
 *
 * - explainTopic - A function that explains a complex topic or concept.
 * - ExplainTopicInput - The input type for the explainTopic function.
 * - ExplainTopicOutput - The return type for the explainTopic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainTopicInputSchema = z.object({
  topic: z.string().describe('The complex topic or concept to be explained.'),
});
export type ExplainTopicInput = z.infer<typeof ExplainTopicInputSchema>;

const ExplainTopicOutputSchema = z.object({
  explanation: z.string().describe('A clear and concise explanation of the topic.'),
});
export type ExplainTopicOutput = z.infer<typeof ExplainTopicOutputSchema>;

export async function explainTopic(input: ExplainTopicInput): Promise<ExplainTopicOutput> {
  return explainTopicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainTopicPrompt',
  input: {schema: ExplainTopicInputSchema},
  output: {schema: ExplainTopicOutputSchema},
  prompt: \`You are an expert in explaining complex topics in a clear and concise manner.

  Please provide a clear and concise explanation of the following topic:

  {{{topic}}}\`,
});

const explainTopicFlow = ai.defineFlow(
  {
    name: 'explainTopicFlow',
    inputSchema: ExplainTopicInputSchema,
    outputSchema: ExplainTopicOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
`,
  "src/ai/flows/career-path-suggester-tool.ts": `
'use server';

/**
 * @fileOverview Suggests career paths based on user interests and skills.
 * 
 * - suggestCareerPaths - A function that suggests career paths.
 * - SuggestCareerPathsInput - The input type for the function.
 * - SuggestCareerPathsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SuggestCareerPathsInputSchema = z.object({
  interests: z.string().describe('A description of the user\\'s interests and passions.'),
  skills: z.string().describe('A description of the user\\'s existing skills and experience.'),
});
export type SuggestCareerPathsInput = z.infer<typeof SuggestCareerPathsInputSchema>;

const CareerPathSchema = z.object({
  title: z.string().describe('The title of the suggested career path.'),
  description: z.string().describe('A detailed description of the career path, including day-to-day responsibilities and why it fits the user\\'s profile.'),
  requiredSkills: z.array(z.string()).describe('A list of key skills required for this career.'),
});

const SuggestCareerPathsOutputSchema = z.object({
  careerPaths: z.array(CareerPathSchema).describe('An array of suggested career paths.'),
});
export type SuggestCareerPathsOutput = z.infer<typeof SuggestCareerPathsOutputSchema>;

export async function suggestCareerPaths(input: SuggestCareerPathsInput): Promise<SuggestCareerPathsOutput> {
  return suggestCareerPathsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCareerPathsPrompt',
  input: { schema: SuggestCareerPathsInputSchema },
  output: { schema: SuggestCareerPathsOutputSchema },
  prompt: \`You are an expert career counselor. Based on the user's interests and skills, suggest three distinct and relevant career paths.

User Interests:
{{{interests}}}

User Skills:
{{{skills}}}

For each suggested career path, provide a title, a detailed description, and a list of essential skills.\`,
});

const suggestCareerPathsFlow = ai.defineFlow(
  {
    name: 'suggestCareerPathsFlow',
    inputSchema: SuggestCareerPathsInputSchema,
    outputSchema: SuggestCareerPathsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
`,
  "src/ai/flows/code-analyzer-tool.ts": `
'use server';

/**
 * @fileOverview Provides a code analysis tool that identifies potential errors, performance issues, and security vulnerabilities.
 *
 * - analyzeCode - Analyzes the given code and returns a report of identified issues.
 * - AnalyzeCodeInput - The input type for the analyzeCode function.
 * - AnalyzeCodeOutput - The return type for the analyzeCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCodeInputSchema = z.object({
  code: z.string().describe('The code to be analyzed.'),
  language: z.string().describe('The programming language of the code.'),
  constraints: z.string().optional().describe('Constraints to apply during evaluation, e.g., maximum memory usage, execution time limits.'),
});

export type AnalyzeCodeInput = z.infer<typeof AnalyzeCodeInputSchema>;

const AnalyzeCodeOutputSchema = z.object({
  report: z.string().describe('A report of identified errors, performance problems, and security issues.'),
});

export type AnalyzeCodeOutput = z.infer<typeof AnalyzeCodeOutputSchema>;

export async function analyzeCode(input: AnalyzeCodeInput): Promise<AnalyzeCodeOutput> {
  return analyzeCodeFlow(input);
}

const analyzeCodePrompt = ai.definePrompt({
  name: 'analyzeCodePrompt',
  input: {schema: AnalyzeCodeInputSchema},
  output: {schema: AnalyzeCodeOutputSchema},
  prompt: \`You are a code analyzer expert. Analyze the following code and provide a report of any errors, possible performance problems, and security issues.

Language: {{{language}}}
Code:
{{{code}}}

Constraints: {{constraints}}

Report:
\`,
});

const analyzeCodeFlow = ai.defineFlow(
  {
    name: 'analyzeCodeFlow',
    inputSchema: AnalyzeCodeInputSchema,
    outputSchema: AnalyzeCodeOutputSchema,
  },
  async input => {
    const {output} = await analyzeCodePrompt(input);
    return output!;
  }
);
`,
  "src/ai/flows/code-generator-tool.ts": `
'use server';

/**
 * @fileOverview Code Generator Tool.
 *
 * - generateCode - A function that generates code based on instructions and specifications.
 * - GenerateCodeInput - The input type for the generateCode function.
 * - GenerateCodeOutput - The return type for the generateCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CodeConstraintsSchema = z.object({
  language: z.string().describe('The programming language for the code.'),
  frameworks: z.string().describe('The frameworks for the code.'),
  libraries: z.string().describe('The libraries the code needs to use.'),
});

export type CodeConstraints = z.infer<typeof CodeConstraintsSchema>;

const GenerateCodeInputSchema = z.object({
  instructions: z.string().describe('Instructions and specifications for the code.'),
  constraints: CodeConstraintsSchema.optional().describe('Any constraints or special considerations that apply to the code.'),
});

export type GenerateCodeInput = z.infer<typeof GenerateCodeInputSchema>;

const GenerateCodeOutputSchema = z.object({
  code: z.string().describe('The generated code.'),
});

export type GenerateCodeOutput = z.infer<typeof GenerateCodeOutputSchema>;

export async function generateCode(input: GenerateCodeInput): Promise<GenerateCodeOutput> {
  return generateCodeFlow(input);
}

const codeGeneratorPrompt = ai.definePrompt({
  name: 'codeGeneratorPrompt',
  input: {schema: GenerateCodeInputSchema},
  output: {schema: GenerateCodeOutputSchema},
  prompt: \`You are an expert code generator. Generate code according to the instructions and specifications provided. Consider any constraints that apply to the code, and apply them in your answer.

Instructions: {{{instructions}}}

{{#if constraints}}
Constraints:
Language: {{{constraints.language}}}
Frameworks: {{{constraints.frameworks}}}
Libraries: {{{constraints.libraries}}}
{{/if}}

Generated Code:\`, 
});

const generateCodeFlow = ai.defineFlow(
  {
    name: 'generateCodeFlow',
    inputSchema: GenerateCodeInputSchema,
    outputSchema: GenerateCodeOutputSchema,
  },
  async input => {
    const {output} = await codeGeneratorPrompt(input);
    return output!;
  }
);
`,
  "src/ai/flows/cover-letter-assistant-tool.ts": `
'use server';

/**
 * @fileOverview Assists users in generating a cover letter.
 * 
 * - generateCoverLetter - A function that generates a cover letter.
 * - GenerateCoverLetterInput - The input type for the function.
 * - GenerateCoverLetterOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateCoverLetterInputSchema = z.object({
  jobDescription: z.string().describe('The full job description the user is applying for.'),
  userInfo: z.string().describe('Information about the user, such as their resume, key skills, and relevant experience.'),
  tone: z.enum(['Professional', 'Enthusiastic', 'Formal', 'Creative']).describe('The desired tone for the cover letter.'),
});
export type GenerateCoverLetterInput = z.infer<typeof GenerateCoverLetterInputSchema>;

const GenerateCoverLetterOutputSchema = z.object({
  coverLetter: z.string().describe('The generated cover letter text, formatted in Markdown.'),
});
export type GenerateCoverLetterOutput = z.infer<typeof GenerateCoverLetterOutputSchema>;

export async function generateCoverLetter(input: GenerateCoverLetterInput): Promise<GenerateCoverLetterOutput> {
  return generateCoverLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCoverLetterPrompt',
  input: { schema: GenerateCoverLetterInputSchema },
  output: { schema: GenerateCoverLetterOutputSchema },
  prompt: \`You are an expert career coach specializing in writing compelling cover letters. Your task is to generate a cover letter based on the provided job description and user information.

The tone of the cover letter should be: {{{tone}}}.

Tailor the letter to highlight how the user's skills and experience match the requirements in the job description. The letter should be professional, engaging, and concise.

Job Description:
---
{{{jobDescription}}}
---

User Information / Resume:
---
{{{userInfo}}}
---

Generate the cover letter now.\`,
});

const generateCoverLetterFlow = ai.defineFlow(
  {
    name: 'generateCoverLetterFlow',
    inputSchema: GenerateCoverLetterInputSchema,
    outputSchema: GenerateCoverLetterOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
`,
  "src/ai/flows/diagram-generator-tool.ts": `
'use server';

/**
 * @fileOverview Generates diagrams from a textual description.
 *
 * - generateDiagram - A function that generates a diagram image.
 * - GenerateDiagramInput - The input type for the function.
 * - GenerateDiagramOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateDiagramInputSchema = z.object({
  description: z.string().describe('A detailed textual description of the diagram to be generated. Include nodes, connections, and labels.'),
});
export type GenerateDiagramInput = z.infer<typeof GenerateDiagramInputSchema>;

const GenerateDiagramOutputSchema = z.object({
  diagramUrl: z.string().describe('The data URI of the generated diagram image.'),
});
export type GenerateDiagramOutput = z.infer<typeof GenerateDiagramOutputSchema>;

export async function generateDiagram(input: GenerateDiagramInput): Promise<GenerateDiagramOutput> {
  return generateDiagramFlow(input);
}

const generateDiagramFlow = ai.defineFlow(
  {
    name: 'generateDiagramFlow',
    inputSchema: GenerateDiagramInputSchema,
    outputSchema: GenerateDiagramOutputSchema,
  },
  async ({ description }) => {
    const prompt = \`Generate a clear, high-quality diagram based on the following description. The diagram should be visually clean and easy to understand, suitable for a technical presentation.

Description: "\${description}"

Ensure the output is a well-structured diagram. For example, for a flowchart, use standard shapes for start/end, process, and decision points. For a system architecture, use clear icons and labels for components.\`;

    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: prompt,
    });

    if (!media?.url) {
      throw new Error('Failed to generate diagram.');
    }

    return { diagramUrl: media.url };
  }
);
`,
  "src/ai/flows/document-summarizer-tool.ts": `
'use server';

/**
 * @fileOverview Summarizes an uploaded document.
 * 
 * - summarizeDocument - A function that generates a summary of a document.
 * - SummarizeDocumentInput - The input type for the function.
 * - SummarizeDocumentOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SummarizeDocumentInputSchema = z.object({
  documentDataUri: z.string().describe("A document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  length: z.enum(['Short', 'Medium', 'Long']).describe('The desired length of the summary.'),
  style: z.enum(['Bulleted List', 'Paragraph']).describe('The desired style of the summary.'),
});
export type SummarizeDocumentInput = z.infer<typeof SummarizeDocumentInputSchema>;

const SummarizeDocumentOutputSchema = z.object({
  summary: z.string().describe('The generated summary of the document.'),
});
export type SummarizeDocumentOutput = z.infer<typeof SummarizeDocumentOutputSchema>;

export async function summarizeDocument(input: SummarizeDocumentInput): Promise<SummarizeDocumentOutput> {
  return summarizeDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDocumentPrompt',
  input: { schema: SummarizeDocumentInputSchema },
  output: { schema: SummarizeDocumentOutputSchema },
  prompt: \`You are an expert document summarizer. Analyze the following document and generate a summary based on the specified length and style.

Document:
{{media url=documentDataUri}}

Summary Length: {{{length}}}
Summary Style: {{{style}}}

Generate a concise and accurate summary.\`,
});

const summarizeDocumentFlow = ai.defineFlow(
  {
    name: 'summarizeDocumentFlow',
    inputSchema: SummarizeDocumentInputSchema,
    outputSchema: SummarizeDocumentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
`,
  "src/ai/flows/image-text-manipulation-tool.ts": `
'use server';

/**
 * @fileOverview Edits text directly within an image based on instructions.
 *
 * - manipulateImageText - A function that performs text manipulation on an image.
 * - ManipulateImageTextInput - The input type for the function.
 * - ManipulateImageTextOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ManipulateImageTextInputSchema = z.object({
  imageDataUri: z.string().describe("An image containing text, as a data URI. Format: 'data:<mimetype>;base64,<encoded_data>'."),
  instructions: z.string().describe('Detailed instructions on how to manipulate the text in the image (e.g., "Change the headline to \\'New Title\\'").'),
});
export type ManipulateImageTextInput = z.infer<typeof ManipulateImageTextInputSchema>;

const ManipulateImageTextOutputSchema = z.object({
  processedImageUrl: z.string().describe('The data URI of the image after text manipulation.'),
});
export type ManipulateImageTextOutput = z.infer<typeof ManipulateImageTextOutputSchema>;

export async function manipulateImageText(input: ManipulateImageTextInput): Promise<ManipulateImageTextOutput> {
  return manipulateImageTextFlow(input);
}

const manipulateImageTextFlow = ai.defineFlow(
  {
    name: 'manipulateImageTextFlow',
    inputSchema: ManipulateImageTextInputSchema,
    outputSchema: ManipulateImageTextOutputSchema,
  },
  async ({ imageDataUri, instructions }) => {
    const prompt = [
        { media: { url: imageDataUri } },
        { text: \`You are an expert image editor. Your task is to manipulate the text within the provided image based on the following instructions, while seamlessly blending the changes with the original image style, font, and background. Instructions: "\${instructions}"\` },
    ];
    
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('Failed to process the image.');
    }

    return { processedImageUrl: media.url };
  }
);
`,
  "src/ai/flows/interview-question-generator-tool.ts": `
'use server';

/**
 * @fileOverview Generates interview questions for a specified job role or topic.
 * 
 * - generateInterviewQuestions - A function that generates interview questions.
 * - GenerateInterviewQuestionsInput - The input type for the function.
 * - GenerateInterviewQuestionsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateInterviewQuestionsInputSchema = z.object({
  topic: z.string().describe('The job role, technology, or topic for the interview questions (e.g., "Senior Frontend Developer", "React Hooks").'),
  count: z.number().int().positive().describe('The number of questions to generate.'),
  category: z.enum(['Technical', 'Behavioral', 'Situational', 'Brain-Teaser']).describe('The category of questions to generate.'),
});
export type GenerateInterviewQuestionsInput = z.infer<typeof GenerateInterviewQuestionsInputSchema>;

const QuestionSchema = z.object({
  question: z.string().describe('The interview question.'),
  expectedAnswer: z.string().describe('A brief description of what a good answer should include.'),
});

const GenerateInterviewQuestionsOutputSchema = z.object({
  questions: z.array(QuestionSchema).describe('An array of generated interview questions.'),
});
export type GenerateInterviewQuestionsOutput = z.infer<typeof GenerateInterviewQuestionsOutputSchema>;

export async function generateInterviewQuestions(input: GenerateInterviewQuestionsInput): Promise<GenerateInterviewQuestionsOutput> {
  return generateInterviewQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInterviewQuestionsPrompt',
  input: { schema: GenerateInterviewQuestionsInputSchema },
  output: { schema: GenerateInterviewQuestionsOutputSchema },
  prompt: \`You are an expert interviewer and hiring manager. Your task is to generate a list of insightful interview questions.

Generate {{{count}}} {{{category}}} interview questions for the topic: "{{{topic}}}".

For each question, provide the question itself and a brief summary of what you would expect in a strong answer.
\`,
});

const generateInterviewQuestionsFlow = ai.defineFlow(
  {
    name: 'generateInterviewQuestionsFlow',
    inputSchema: GenerateInterviewQuestionsInputSchema,
    outputSchema: GenerateInterviewQuestionsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
`,
  "src/ai/flows/linkedin-visuals-generator-tool.ts": `
'use server';

/**
 * @fileOverview Generates a professional profile picture and cover banner for LinkedIn.
 *
 * - generateLinkedInVisuals - A function that creates a LinkedIn visuals.
 * - GenerateLinkedInVisualsInput - The input type for the function.
 * - GenerateLinkedInVisualsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateLinkedInVisualsInputSchema = z.object({
  resumeDataUri: z.string().optional().describe("The user's resume as a data URI. Format: 'data:<mimetype>;base64,<encoded_data>'."),
  resumeText: z.string().optional().describe("The user's resume as plain text."),
  userPhotoUri: z.string().optional().describe("An optional photo of the user, as a data URI. If provided, it will be used as the base for the profile picture. Format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateLinkedInVisualsInput = z.infer<typeof GenerateLinkedInVisualsInputSchema>;

const GenerateLinkedInVisualsOutputSchema = z.object({
  profilePictureUrl: z.string().describe('The data URI of the generated professional profile picture.'),
  coverBannerUrl: z.string().describe('The data URI of the generated professional cover banner.'),
});
export type GenerateLinkedInVisualsOutput = z.infer<typeof GenerateLinkedInVisualsOutputSchema>;

export async function generateLinkedInVisuals(input: GenerateLinkedInVisualsInput): Promise<GenerateLinkedInVisualsOutput> {
  return generateLinkedInVisualsFlow(input);
}

const generateLinkedInVisualsFlow = ai.defineFlow(
  {
    name: 'generateLinkedInVisualsFlow',
    inputSchema: GenerateLinkedInVisualsInputSchema,
    outputSchema: GenerateLinkedInVisualsOutputSchema,
  },
  async ({ resumeDataUri, resumeText, userPhotoUri }) => {
    
    let resumeContextPart;
    if (resumeDataUri) {
        resumeContextPart = { media: { url: resumeDataUri } };
    } else if (resumeText) {
        resumeContextPart = { text: \`Here is the resume text:\\\\n\\\\n\${resumeText}\` };
    } else {
        throw new Error("Either resumeDataUri or resumeText must be provided.");
    }

    const profilePictureModel = userPhotoUri ? 'googleai/gemini-2.5-flash-image-preview' : 'googleai/imagen-4.0-fast-generate-001';

    const profilePicturePrompt = userPhotoUri
      ? [
          { media: { url: userPhotoUri } },
          { text: \`Based on the user's photo and their resume content, create a professional, high-quality headshot suitable for a LinkedIn profile picture. The background should be simple and professional, not distracting. The person should look friendly and approachable.\` },
          resumeContextPart,
        ]
      : [
          { text: \`Generate a professional, high-quality headshot suitable for a LinkedIn profile picture for a person in the software engineering industry. The person should look friendly and approachable. The background should be simple and professional. Use the resume content to guide the style.\` },
          resumeContextPart,
        ];

    const coverBannerPrompt = [
        { text: \`Analyze the user's resume content provided. Based on their industry, skills, and experience, generate a professional and abstract background image suitable for a LinkedIn cover banner (1584 x 396 pixels). The design should be modern, clean, and visually represent the user's professional field. For example, for a software engineer, it might incorporate subtle code-like patterns or abstract representations of data. For a graphic designer, it could be more artistic. The banner should not contain any text and should be visually appealing but not distracting.\` },
        resumeContextPart,
    ];

    const [profilePicResult, coverBannerResult] = await Promise.all([
      ai.generate({
        model: profilePictureModel,
        prompt: profilePicturePrompt,
        config: { responseModalities: ['TEXT', 'IMAGE'] },
      }),
      ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: coverBannerPrompt,
      }),
    ]);

    const profilePictureUrl = profilePicResult.media?.url;
    const coverBannerUrl = coverBannerResult.media?.url;

    if (!profilePictureUrl || !coverBannerUrl) {
      throw new Error('Failed to generate one or more LinkedIn visuals.');
    }

    return { profilePictureUrl, coverBannerUrl };
  }
);
`,
  "src/ai/flows/portfolio-generator-tool.ts": `
'use server';

/**
 * @fileOverview Generates a complete portfolio website from structured data.
 * 
 * - generatePortfolioWebsite - A function that generates HTML, CSS, and JS for a portfolio.
 * - extractPortfolioDataFromText - A function that extracts structured portfolio data from a text blob.
 * - GeneratePortfolioWebsiteInput - The input type for the function.
 * - GeneratePortfolioWebsiteOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const PortfolioDataSchema = z.object({
  name: z.string().describe("The user's full name."),
  headline: z.string().describe("The user's professional headline (e.g., 'Software Engineer | AI Enthusiast')."),
  profession: z.string().describe("The user's profession or industry (e.g., 'Software Engineer', 'Graphic Designer', 'Marine Biologist')."),
  contact: z.object({
      email: z.string().describe("The user's email address."),
      phone: z.string().optional(),
      linkedin: z.string().optional(),
      github: z.string().optional(),
      socials: z.array(z.object({
          network: z.string(),
          url: z.string(),
      })).optional().describe("An array of social media links.")
  }),
  about: z.string().describe("A detailed 'About Me' section."),
  experience: z.array(z.object({
      title: z.string(),
      company: z.string(),
      dates: z.string(),
      description: z.string(),
  })),
  education: z.array(z.object({
      degree: z.string(),
      school: z.string(),
      dates: z.string(),
  })),
  projects: z.array(z.object({
      title: z.string(),
      description: z.string(),
      link: z.string().optional(),
      imageUrl: z.string().optional(),
  })),
  skills: z.array(z.string()),
  achievements: z.array(z.string()).optional(),
  certificateDataUri: z.string().optional().describe("An optional internship certificate as a data URI. If provided, analyze it and add an entry to the achievements section."),
});
export type GeneratePortfolioWebsiteInput = z.infer<typeof PortfolioDataSchema>;


const GeneratePortfolioWebsiteOutputSchema = z.object({
  html: z.string().describe('The complete HTML code for the portfolio website.'),
  css: z.string().describe('The complete CSS code for styling the portfolio.'),
  javascript: z.string().describe('The JavaScript code for animations and interactivity.'),
});
export type GeneratePortfolioWebsiteOutput = z.infer<typeof GeneratePortfolioWebsiteOutputSchema>;

export async function generatePortfolioWebsite(input: GeneratePortfolioWebsiteInput): Promise<GeneratePortfolioWebsiteOutput> {
  return generatePortfolioWebsiteFlow(input);
}


const extractPortfolioDataPrompt = ai.definePrompt({
    name: 'extractPortfolioDataPrompt',
    input: { schema: z.object({ text: z.string() }) },
    output: { schema: PortfolioDataSchema },
    prompt: \`You are an expert at parsing unstructured text and extracting structured information. Analyze the following document, which could be a resume, a LinkedIn profile, or an article about building a portfolio. Your task is to extract all relevant information and structure it according to the provided JSON schema.

- Based on the content, determine the person's profession (e.g., 'Software Engineer', 'Graphic Designer') and populate the 'profession' field.
- If the document is a guide or article, create a realistic and compelling portfolio for a fictional person (e.g., Alex Doe, a Full-Stack Developer) based on the principles and examples in the text.
- Infer missing information where it makes sense. For instance, if a job title is "Software Engineer," you can create plausible project descriptions or skill sets.
- For projects, if no image URL is provided, use a placeholder from 'https://placehold.co/600x400'.
- Ensure all fields in the schema are populated with high-quality, realistic data.

Document to analyze:
---
{{{text}}}
---

Extract the data now.\`,
});

export async function extractPortfolioDataFromText(text: string): Promise<GeneratePortfolioWebsiteInput> {
    const { output } = await extractPortfolioDataPrompt({ text });
    if (!output) {
        throw new Error("Failed to extract portfolio data from the provided text.");
    }
    return output;
}


const prompt = ai.definePrompt({
    name: 'generatePortfolioWebsitePrompt',
    input: { schema: PortfolioDataSchema },
    output: { schema: GeneratePortfolioWebsiteOutputSchema },
    prompt: \`You are an expert web developer and designer, specializing in creating modern, animated portfolio websites. Your task is to generate the complete HTML, CSS, and JavaScript for a portfolio, visually tailored to the user's profession.

**User's Profession:** {{{profession}}}

{{#if certificateDataUri}}
**Certificate Analysis:** An internship certificate has been provided. Analyze its contents (text, logos, dates) to verify it and extract the key achievement. Create a concise, one-sentence achievement summary (e.g., "Completed a 3-month web development internship at ExampleCorp") and add it to the beginning of the achievements list.
Certificate: {{media url=certificateDataUri}}
{{/if}}

**Instructions:**
1.  **Theme Adaptation:**
    *   Based on the user's profession, adapt the visual theme in the CSS.
    *   **For technical roles (e.g., Software Engineer, Data Scientist):** Use a dark theme with a tech-inspired font like 'Space Grotesk'. Use an accent color like teal or electric blue. The overall feel should be modern and clean.
    *   **For creative roles (e.g., Graphic Designer, Artist):** Use a more creative layout, perhaps with a lighter theme or more vibrant colors. Choose fonts that reflect creativity (e.g., a stylish serif or sans-serif).
    *   **For other professions (e.g., Marketing, Finance):** Choose a professional, clean, and appropriate theme. A light theme with a standard sans-serif font like 'Inter' is a safe and professional choice.
2.  **Content Injection:** Populate the provided HTML template with the user's structured data.
3.  **Animations & Interactivity:** 
    * Ensure the CSS and JavaScript create a smooth, "assembled by AI" experience. Sections should fade in on scroll. The hero text must have a "typing" animation.
    * An interactive particle network background must be implemented using the HTML canvas.
4.  **Structure:** Do not change the fundamental structure of the HTML (sections, IDs). Only populate it with data and adapt the styles in the CSS.
5.  **Output:** Return the complete HTML, CSS, and JavaScript as a single JSON object.

**User's Portfolio Data:**
- Name: {{{name}}}
- Headline: {{{headline}}}
- Profession: {{{profession}}}
- About Me: {{{about}}}
- Contact Email: {{{contact.email}}}
{{#if contact.phone}}- Contact Phone: {{{contact.phone}}}{{/if}}
- Socials:
{{#each contact.socials}}
  - {{network}}: {{url}}
{{/each}}
- Experience:
{{#each experience}}
  - Title: {{title}}, Company: {{company}}, Dates: {{dates}}, Description: {{description}}
{{/each}}
- Education:
{{#each education}}
  - Degree: {{degree}}, School: {{school}}, Dates: {{dates}}
{{/each}}
- Projects:
{{#each projects}}
  - Title: {{title}}, Description: {{description}}, Link: {{link}}, Image: {{imageUrl}}
{{/each}}
- Skills:
{{#each skills}}
  - {{this}}
{{/each}}
{{#if achievements}}
- Achievements:
{{#each achievements}}
  - {{this}}
{{/each}}
{{/if}}


**Template:**

**HTML:**
\\\`\\\`\\\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio</title>
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body>
    <canvas id="interactive-bg"></canvas>

    <header class="header">
        <nav class="nav">
            <a href="#about">About</a>
            <a href="#experience">Experience</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
        </nav>
    </header>

    <main>
        <section id="hero" class="hero">
            <div class="hero-content">
                <h1 class="hero-name">{{{name}}}</h1>
                <p class="hero-headline">{{{headline}}}</p>
            </div>
        </section>

        <section id="about" class="scroll-target">
            <h2>About Me</h2>
            <p>{{{about}}}</p>
        </section>

        <section id="experience" class="scroll-target">
            <h2>Work Experience</h2>
            <div class="experience-list">
                {{#each experience}}
                <div class="experience-item">
                    <h3>{{title}}</h3>
                    <h4>{{company}} | {{dates}}</h4>
                    <p>{{description}}</p>
                </div>
                {{/each}}
            </div>
        </section>

        <section id="projects" class="scroll-target">
            <h2>Projects</h2>
            <div class="project-grid">
                {{#each projects}}
                <div class="project-card">
                    <img src="{{#if imageUrl}}{{imageUrl}}{{else}}https://placehold.co/600x400{{/if}}" alt="Project image for {{title}}">
                    <div class="project-card-content">
                        <h3>{{title}}</h3>
                        <p>{{description}}</p>
                        {{#if link}}<a href="{{link}}" target="_blank">View Project</a>{{/if}}
                    </div>
                </div>
                {{/each}}
            </div>
        </section>

        <section id="skills" class="scroll-target">
            <h2>Skills</h2>
            <div class="skills-list">
                {{#each skills}}<span class="skill-badge">{{this}}</span>{{/each}}
            </div>
        </section>

        {{#if achievements.length}}
        <section id="achievements" class="scroll-target">
            <h2>Achievements</h2>
            <ul class="achievements-list">
                {{#each achievements}}
                <li>{{this}}</li>
                {{/each}}
            </ul>
        </section>
        {{/if}}
    </main>

    <footer id="contact" class="footer">
        <h2>Contact Me</h2>
        <p>Email: <a href="mailto:{{{contact.email}}}">{{{contact.email}}}</a></p>
        {{#if contact.phone}}<p>Phone: {{contact.phone}}</p>{{/if}}
        <div class="social-links">
            {{#each contact.socials}}
            <a href="{{url}}" target="_blank">{{network}}</a>
            {{/each}}
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>
\\\`\\\`\\\`

**CSS:**
\\\`\\\`\\\`css
:root {
    /* DEFAULT THEME (Dark, Tech-focused) - ADAPT THIS BASED ON PROFESSION */
    --bg-color: #0A192F;
    --text-color: #ccd6f6;
    --accent-color: #64ffda;
    --card-bg-color: #112240;
    --font-family: 'Space Grotesk', sans-serif;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: var(--font-family);
    background-color: var(--bg-color);
    color: var(--text-color);
    line-height: 1.6;
    transition: background-color 0.5s ease, color 0.5s ease;
}

#interactive-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}

main, .header, .footer {
    position: relative;
    z-index: 1;
}

h1, h2, h3 {
    color: var(--accent-color);
    line-height: 1.2;
}

h2 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    text-align: center;
}

h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
}

a {
    color: var(--accent-color);
    text-decoration: none;
    transition: color 0.3s ease;
}

a:hover {
    color: white;
}

section {
    padding: 6rem 2rem;
    max-width: 1000px;
    margin: 0 auto;
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    background-color: rgba(10, 25, 47, 0.8); /* Semi-transparent background for content sections */
    backdrop-filter: blur(2px);
    border-radius: 12px;
    margin-bottom: 2rem;
}

section.visible {
    opacity: 1;
    transform: translateY(0);
}

.header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 1rem 2rem;
    z-index: 100;
    background-color: rgba(10, 25, 47, 0.85);
    backdrop-filter: blur(10px);
    transition: top 0.3s;
}

.nav {
    display: flex;
    justify-content: flex-end;
    gap: 1.5rem;
}

.hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background: none;
    backdrop-filter: none;
    border-radius: 0;
}

@keyframes typing {
    from { width: 0; }
    to { width: 100%; }
}

@keyframes blink-caret {
    from, to { border-color: transparent; }
    50% { border-color: var(--accent-color); }
}

.hero-name {
    font-size: 5rem;
    font-weight: 700;
    overflow: hidden;
    border-right: .15em solid var(--accent-color);
    white-space: nowrap;
    margin: 0 auto;
    letter-spacing: .1em;
    animation:
        typing 3.5s steps(30, end),
        blink-caret .75s step-end infinite;
}

.hero-headline {
    font-size: 1.5rem;
    margin-top: 1rem;
    opacity: 0;
    animation: fadeIn 2s ease-in-out 3.5s forwards;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}


.experience-list .experience-item {
    background-color: var(--card-bg-color);
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    border: 1px solid #1d2d50;
}

.project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
}

.project-card {
    background-color: var(--card-bg-color);
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s ease;
    border: 1px solid #1d2d50;
}

.project-card:hover {
    transform: translateY(-5px);
}

.project-card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.project-card-content {
    padding: 1.5rem;
}

.skills-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
}

.skill-badge {
    background-color: var(--card-bg-color);
    color: var(--accent-color);
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    border: 1px solid var(--accent-color);
}

.footer {
    text-align: center;
    padding: 3rem 1rem;
    background-color: rgba(10, 25, 47, 0.85);
    backdrop-filter: blur(10px);
}

.social-links {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    gap: 1.5rem;
}

.achievements-list {
    list-style: disc;
    padding-left: 20px;
    text-align: left;
    max-width: 600px;
    margin: 0 auto;
}
\\\`\\\`\\\`

**JavaScript:**
\\\`\\\`\\\`javascript
document.addEventListener('DOMContentLoaded', () => {
    // Scroll animations
    const scrollTargets = document.querySelectorAll('.scroll-target');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    scrollTargets.forEach(target => observer.observe(target));

    // Header visibility on scroll
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop) {
            header.style.top = '-80px';
        } else {
            header.style.top = '0';
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);

    // Interactive background
    const canvas = document.getElementById('interactive-bg');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray = [];
    const numberOfParticles = 100;
    const mouse = { x: null, y: null };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    })


    class Particle {
        constructor(x, y, size, color, weight) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.color = color;
            this.weight = weight; // Speed
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            // Movement
            this.x += (Math.random() - 0.5) * this.weight;
            this.y += (Math.random() - 0.5) * this.weight;

            // Bounce off edges
            if (this.x > canvas.width || this.x < 0) this.x = Math.random() * canvas.width;
            if (this.y > canvas.height || this.y < 0) this.y = Math.random() * canvas.height;
            
            // Mouse interaction
            if (mouse.x && mouse.y) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx*dx + dy*dy);
                if (distance < 100) {
                     this.x -= dx / 20;
                     this.y -= dy / 20;
                }
            }

            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            let x = Math.random() * canvas.width;
            let y = Math.random() * canvas.height;
            let size = Math.random() * 1.5 + 1;
            let color = 'rgba(167, 196, 224, 0.7)';
            let weight = Math.random() * 0.5 + 0.1;
            particlesArray.push(new Particle(x, y, size, color, weight));
        }
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                               ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = 'rgba(167, 196, 224,' + opacityValue + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });

    init();
    animate();
});
\\\`\\\`\\\`
\`,
});


const generatePortfolioWebsiteFlow = ai.defineFlow(
  {
    name: 'generatePortfolioWebsiteFlow',
    inputSchema: PortfolioDataSchema,
    outputSchema: GeneratePortfolioWebsiteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
`,
  "src/ai/flows/presentation-generator-tool.ts": `
'use server';

/**
 * @fileOverview Generates a presentation outline with titles, content, and images.
 *
 * - generatePresentation - A function that creates a complete presentation.
 * - GeneratePresentationInput - The input type for the function.
 * - GeneratePresentationOutput - The return type for a single slide's image.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/googleai';

const getCompanyLogoTool = ai.defineTool(
    {
        name: 'getCompanyLogoTool',
        description: 'Get the logo for a given company.',
        inputSchema: z.object({
            companyName: z.string().describe('The name of the company to get the logo for.'),
        }),
        outputSchema: z.string().describe('A URL pointing to the company logo.'),
    },
    async (input) => {
        // In a real application, you would implement a logo fetching service here.
        // For this example, we'll return a placeholder. The model is taught to handle this.
        return \`https://logo.clearbit.com/\${input.companyName.toLowerCase()}.com\`;
    }
);

const GeneratePresentationInputSchema = z.object({
  topic: z.string().describe('The topic or title of the presentation.'),
  presenterName: z.string().optional().describe("The name of the presenter."),
  rollNumber: z.string().optional().describe("The presenter's roll number."),
  department: z.string().optional().describe("The presenter's department."),
  numSlides: z.number().int().min(2).max(20).describe('The number of slides to generate (for general topics).'),
  contentType: z.enum(['general', 'projectProposal', 'pitchDeck', 'custom']).default('general').describe('The type of content to generate.'),
  customStructure: z.string().optional().describe("A user-defined structure for the presentation, as a string of slide titles, potentially with notes for each."),
  imageStyle: z.string().optional().describe("An optional style for the images (e.g., 'photorealistic', 'cartoon')."),
  language: z.string().optional().describe("The language for the presentation content (e.g., 'English', 'Hindi', 'Marathi')."),
  style: z.enum(['Default', 'Tech Pitch', 'Creative']).default('Default').describe('The visual design and narrative style of the presentation.'),
});
export type GeneratePresentationInput = z.infer<typeof GeneratePresentationInputSchema>;

const SlideSchema = z.object({
  title: z.string().describe('The title of the slide.'),
  content: z.array(z.string()).describe('An array of exactly 4 short bullet points for the slide content. Each bullet point must have around 8 words. This can be an empty array for title-only slides.'),
  imagePrompt: z.string().describe('A text prompt to generate a relevant image for this slide. Can be an empty string if no image is needed.'),
  logoUrl: z.string().optional().describe('The URL of a company logo to display on the slide, fetched using the getCompanyLogoTool.'),
  slideLayout: z.enum(['title', 'contentWithImage', 'titleOnly']).describe("The best layout for this slide. Use 'title' for the main title slide, 'contentWithImage' for slides with bullet points and a visual, and 'titleOnly' for section headers or simple, impactful statements."),
  imageUrl: z.string().optional().describe('The data URI of the generated image for the slide.'),
});

const DesignSchema = z.object({
  backgroundColor: z.string().describe('A hex color code for the slide background (e.g., "#0B192E").'),
  textColor: z.string().describe('A hex color code for the main text (e.g., "#E6F1FF").'),
  accentColor: z.string().describe('A hex color code for titles and accents (e.g., "#64FFDA").'),
  backgroundPrompt: z.string().describe("A prompt for an AI image generator to create a subtle, professional background image related to the presentation topic. It should be abstract and not distracting."),
});

const PresentationOutlineSchema = z.object({
  title: z.string().describe('The main title of the presentation.'),
  slides: z.array(SlideSchema).describe('An array of slide objects.'),
  design: DesignSchema.describe('A design theme for the presentation, inspired by the topic.'),
  backgroundImageUrl: z.string().optional().describe('The data URI of the generated background image for the presentation.'),
});
export type GeneratePresentationOutput = z.infer<typeof PresentationOutlineSchema>;

export async function generatePresentation(input: GeneratePresentationInput): Promise<GeneratePresentationOutput> {
  return generatePresentationFlow(input);
}

const outlinePrompt = ai.definePrompt({
    name: 'generatePresentationOutlinePrompt',
    input: { schema: GeneratePresentationInputSchema },
    output: { schema: PresentationOutlineSchema },
    tools: [getCompanyLogoTool],
    prompt: \`You are an expert presentation creator and visual designer, inspired by tools like PowerPoint Designer. Your task is to generate a stunning and detailed presentation outline based on the user's request, following modern presentation best practices.

**Core Principles (Non-negotiable):**
- **Visuals > Text**: Your primary goal is to create a powerful, memorable visual for each slide. The text is secondary and only supports the visual. For every slide, you must first conceive the visual and then write a short title and content to complement it.
- **One Idea per Slide**: Each slide must focus on a single, core idea. If a point is complex, it MUST be broken down into multiple slides.
- **Strict Content Rules**: Each content slide must have exactly 4 bullet points. Each bullet point MUST have around 8 words. For 'titleOnly' slides, the content array should be empty.
- **Layout Intelligence**: For each slide, you MUST choose the most appropriate layout: 'title' for the main title slide, 'contentWithImage' for standard content slides, and 'titleOnly' for section headers or impactful statements.

**Language Requirement:**
- You MUST generate all text content (titles and bullet points) in the requested language: **{{#if language}}{{language}}{{else}}English{{/if}}**.

**Design & Narrative Style: {{style}}**
- **Design Generation:** Based on the presentation topic and the chosen style, create a cohesive and professional design theme.
    - **Default:** A clean, professional, and versatile design suitable for most topics.
    - **Tech Pitch:** A dark, cinematic theme inspired by modern tech companies like Apple. Use bold typography and high-contrast colors (e.g., dark background, white text, electric blue/green accent).
    - **Creative:** A vibrant, colorful theme inspired by companies like Google. Use a light background, bright accent colors, and clean, friendly fonts.
- You MUST derive and provide hex color codes for 'backgroundColor', 'textColor', and 'accentColor' that are visually harmonious and reflect the chosen style.
- You MUST also provide a 'backgroundPrompt' that matches the style. This prompt should describe a stunning, high-quality, professional background image (e.g., abstract, subtle, cinematic) that is visually related to the topic but does not distract from the content. The image prompt itself must be in English.

**Content Generation:**
- **Tone and Style**: The content must be professional and authoritative, yet sound natural and human-written. It should be engaging, clear, and concise. Avoid jargon.
- **Tool Use**: If a slide discusses a specific company (e.g., 'About the Company', 'Founders', 'Competitors'), you MUST use the \\\`getCompanyLogoTool\\\` to find and include the company's logo URL in the 'logoUrl' field.
- For each slide, you MUST provide:
  1. A short, impactful title.
  2. A set of exactly 4 extremely CONCISE bullet points (or an empty array for title-only slides).
  3. A descriptive prompt for an AI image generator (or an empty string). This prompt must describe a stunning, high-quality, and cinematic visual that powerfully represents the slide's core idea. Crucially, the generated image should NOT contain any text or letters whatsoever to avoid spelling and design errors. All image prompts must be in English.
  4. The appropriate 'slideLayout'.
  5. A 'logoUrl' if a company is mentioned.

**Structure Generation Instructions:**
- **The very first slide must always be the main title slide with the layout 'title'.** It should introduce the main topic and include any presenter details provided.
- If the user provides a "Custom Structure," you MUST use it as the primary source. The 'numSlides' parameter should be IGNORED.
  - **Parsing Custom Structure**: A line starting with a number and/or bullet (e.g., "1. About the Company", "- Key Features") should be treated as a slide title. All text following that title, until the next title, should be used as the context/notes for that specific slide.
  - You MUST generate one slide for each title you identify in the custom structure.
- If the content type is "Project Proposal," generate the subsequent presentation slides using this structure: 1. Introduction, 2. Objectives, 3. Background / Literature, 4. Methodology / Approach, 5. Project Work / Implementation, 6. Results / Findings, 7. Discussion / Analysis, 8. Conclusion & Suggestions, 9. Acknowledgement. (Translated to the target language).
- If the content type is "Pitch Deck," generate a presentation with this narrative structure: 1. Title, 2. The Problem, 3. The Solution, 4. Market Size, 5. The Product, 6. Team, 7. Financials / Ask, 8. Thank You / Contact.
- If the content type is "General," generate a logical presentation of exactly {{{numSlides}}} slides, which must include a conclusion slide at the end. The introduction slide is extra.

**User Input Details:**
- Topic: {{{topic}}}
{{#if presenterName}}- Presenter: {{{presenterName}}}{{/if}}
{{#if rollNumber}}- Roll Number: {{{rollNumber}}}{{/if}}
{{#if department}}- Department: {{{department}}}{{/if}}
- Content Type: {{{contentType}}}
- Presentation Style: {{{style}}}
- Number of Slides (for General type): {{{numSlides}}}
{{#if customStructure}}
- Custom Structure:
{{{customStructure}}}
{{/if}}
- Image Style: {{{imageStyle}}}
\`,
});


const generatePresentationFlow = ai.defineFlow(
  {
    name: 'generatePresentationFlow',
    inputSchema: GeneratePresentationInputSchema,
    outputSchema: PresentationOutlineSchema,
  },
  async (input) => {
    const { output: outline } = await outlinePrompt(input);
    if (!outline) {
      throw new Error('Failed to generate presentation outline.');
    }

    const applyStyle = (prompt: string) => {
      if (input.imageStyle && input.imageStyle.toLowerCase() !== 'photorealistic') {
        return \`\${prompt}, in a \${input.imageStyle} style\`;
      }
      return prompt;
    };
    
    // Create a map of slide index to its image prompt.
    const slideImagePrompts = new Map<number, string>();
    outline.slides.forEach((slide, index) => {
        if (slide.imagePrompt) {
            slideImagePrompts.set(index, slide.imagePrompt);
        }
    });

    const imageGenerationPromises = [];

    // Background Image Promise (always at index 0)
    if (outline.design.backgroundPrompt) {
        imageGenerationPromises.push(
            ai.generate({
                model: 'googleai/imagen-4.0-fast-generate-001',
                prompt: applyStyle(outline.design.backgroundPrompt),
            })
        );
    } else {
        imageGenerationPromises.push(Promise.resolve({ media: { url: '' } }));
    }

    // Slide Image Promises
    for (const prompt of slideImagePrompts.values()) {
        imageGenerationPromises.push(
            ai.generate({
                model: 'googleai/imagen-4.0-fast-generate-001',
                prompt: applyStyle(prompt),
            })
        );
    }

    const results = await Promise.allSettled(imageGenerationPromises);

    // Process background image result (from index 0)
    const backgroundResult = results[0];
    if (backgroundResult.status === 'fulfilled' && backgroundResult.value.media?.url) {
        outline.backgroundImageUrl = backgroundResult.value.media.url;
    } else {
        console.error('Background image generation failed:', backgroundResult.status === 'rejected' ? backgroundResult.reason : 'No URL returned');
        outline.backgroundImageUrl = ''; 
    }
    
    // Process slide image results
    const slideImageResults = results.slice(1);
    const slidePromptKeys = Array.from(slideImagePrompts.keys());

    for (let i = 0; i < slideImageResults.length; i++) {
        const result = slideImageResults[i];
        const slideIndex = slidePromptKeys[i];
        
        if (result.status === 'fulfilled' && result.value.media?.url) {
            outline.slides[slideIndex].imageUrl = result.value.media.url;
        } else {
            console.error(\`Slide \${slideIndex + 1} image generation failed:\`, result.status === 'rejected' ? result.reason : 'No URL returned');
            outline.slides[slideIndex].imageUrl = '';
        }
    }

    return outline;
  }
);
`,
  "src/ai/flows/resume-feedback-tool.ts": `
'use server';

/**
 * @fileOverview Provides AI-powered feedback on a user's resume, focusing on ATS optimization.
 * 
 * - getResumeFeedback - Analyzes a resume and provides feedback and a rewritten version.
 * - GetResumeFeedbackInput - The input type for the function.
 * - GetResumeFeedbackOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GetResumeFeedbackInputSchema = z.object({
  resume: z.string().describe("The user's resume content, either as plain text or a data URI for a document (data:<mimetype>;base64,<encoded_data>)."),
  targetJobRole: z.string().optional().describe('The specific job role the user is targeting.'),
  additionalInfo: z.string().optional().describe('Any other information or context the user wants to provide.'),
});
export type GetResumeFeedbackInput = z.infer<typeof GetResumeFeedbackInputSchema>;

const RewrittenResumeSchema = z.object({
    name: z.string().describe("The user's full name."),
    title: z.string().describe("The user's professional title or headline (e.g., 'Software Engineer | Social Media Marketing Specialist')."),
    contact: z.object({
        phone: z.string().optional().describe("The user's phone number."),
        email: z.string().optional().describe("The user's email address."),
        linkedin: z.string().optional().describe("The user's LinkedIn profile URL."),
        github: z.string().optional().describe("The user's GitHub profile URL."),
        location: z.string().optional().describe("The user's city and state/country."),
    }).describe("The user's contact information."),
    summary: z.string().describe("A 2-4 sentence professional summary."),
    experience: z.array(z.object({
        title: z.string().describe("The job title."),
        company: z.string().describe("The company name."),
        location: z.string().optional().describe("The location of the company (e.g., 'New York, NY')."),
        dates: z.string().describe("The dates of employment (e.g., 'Feb 2022 - Present')."),
        bullets: z.array(z.string()).describe("A list of 3-5 bullet points describing achievements and responsibilities, starting with strong action verbs and quantifying results where possible.")
    })).describe("A list of professional experiences."),
    education: z.array(z.object({
        degree: z.string().describe("The degree obtained (e.g., 'Master of Business Administration')."),
        school: z.string().describe("The name of the university or school."),
        location: z.string().optional().describe("The location of the school (e.g., 'New York, NY')."),
        dates: z.string().describe("The dates of attendance."),
    })).describe("A list of educational qualifications."),
    projects: z.array(z.object({
        title: z.string().describe("The project title."),
        description: z.string().describe("A brief description of the project."),
        link: z.string().optional().describe("A URL link to the project (e.g., GitHub repo).")
    })).describe("A list of key projects, typically placed in the sidebar."),
    skills: z.array(z.string()).describe("A list of key skills relevant to the job, comma-separated."),
    keyAchievements: z.array(z.object({
        title: z.string().describe("The title of the achievement (e.g., 'Boosted Brand Engagement')."),
        description: z.string().describe("A short description of the achievement with metrics.")
    })).describe("A list of key achievements with descriptions, suitable for a sidebar."),
    training: z.array(z.object({
        title: z.string().describe("The title of the training or course (e.g., 'Social Media Marketing Certificate')."),
        description: z.string().describe("A brief description of the course or certification.")
    })).describe("A list of relevant training or courses taken."),
});


const GetResumeFeedbackOutputSchema = z.object({
  feedback: z.string().describe('Detailed, constructive feedback on the resume, formatted as Markdown. Include sections for strengths, weaknesses, and specific suggestions for improvement.'),
  rewrittenResume: RewrittenResumeSchema.describe('A professionally rewritten version of the resume, structured as a JSON object.'),
});
export type GetResumeFeedbackOutput = z.infer<typeof GetResumeFeedbackOutputSchema>;

export async function getResumeFeedback(input: GetResumeFeedbackInput): Promise<GetResumeFeedbackOutput> {
  return getResumeFeedbackFlow(input);
}

const getResumeFeedbackFlow = ai.defineFlow(
  {
    name: 'getResumeFeedbackFlow',
    inputSchema: GetResumeFeedbackInputSchema,
    outputSchema: GetResumeFeedbackOutputSchema,
  },
  async (input) => {
    
    let documentPromptPart;
    const promptInput: Record<string, any> = {
      targetJobRole: input.targetJobRole,
      additionalInfo: input.additionalInfo,
    };

    if (input.resume.startsWith('data:')) {
      documentPromptPart = 'Document: {{media url=resume}}';
      promptInput.resume = input.resume;
    } else {
      documentPromptPart = 'Document:\\n{{{resumeText}}}';
      promptInput.resumeText = input.resume;
    }
    
    const prompt = ai.definePrompt({
      name: 'getResumeFeedbackPrompt',
      output: { schema: GetResumeFeedbackOutputSchema },
      prompt: \`You are an expert career coach and professional resume writer with deep knowledge of Applicant Tracking Systems (ATS). Your task is to provide a comprehensive review of the user's resume and rewrite it into a structured JSON format that perfectly matches the provided schema and the visual template provided in the user's prompt.

{{#if targetJobRole}}The user is targeting the role of: {{{targetJobRole}}}. You must tailor your feedback and rewritten resume to align with keywords and qualifications for this role.{{/if}}
{{#if additionalInfo}}Additional context from the user: {{{additionalInfo}}}{{/if}}

\${documentPromptPart}

Please perform the following two tasks:

1.  **Provide Detailed Feedback:** In the 'feedback' field, analyze the resume for clarity, impact, formatting, and ATS compatibility. Give constructive feedback in Markdown format, with clear sections for "Strengths", "Areas for Improvement", and "Actionable Suggestions for ATS Optimization". Your suggestions should focus on keyword alignment, quantifying achievements, and using standard, machine-readable formatting.

2.  **Rewrite the Resume into JSON:** In the 'rewrittenResume' field, provide a professionally rewritten version of the resume by populating the structured JSON object. Adhere strictly to the following structure, mirroring the visual template:
    - **Header**: Extract the full name, professional title, and all contact details (phone, email, linkedin, location).
    - **Main Column (Right Side)**:
        - **Summary**: A concise professional summary of 2-4 sentences.
        - **Experience**: List all work experiences. For each, extract the title, company, location, dates, and 3-5 detailed, metric-driven bullet points.
        - **Education**: List all educational qualifications. For each, extract the degree, school, location, and dates.
    - **Sidebar (Left Column)**:
        - **Projects**: Extract key projects with a title, a short description, and a URL if available.
        - **Key Achievements**: Identify major career achievements. For each, create a short title (e.g., "Increased Conversions") and a description with a quantifiable metric.
        - **Skills**: Compile a list of all relevant skills.
        - **Training/Courses**: List any relevant certifications or courses with a title and a brief description.
    - **General Rules**: Start every bullet point under 'Experience' with a strong action verb. Quantify achievements with specific metrics wherever possible (e.g., "Increased user engagement by 30%" instead of "Improved user engagement"). Ensure all data is extracted accurately and professionally.
\`,
    });

    const { output } = await prompt(promptInput);
    if (!output) {
      throw new Error("The AI failed to generate the resume analysis.");
    }
    return output;
  }
);
`,
  "src/ai/flows/smart-search-tool.ts": `
'use server';

/**
 * @fileOverview Smart Search Tool flow. Analyzes a document to extract key information.
 *
 * - smartSearch - A function that handles the document analysis process.
 * - SmartSearchInput - The input type for the smartSearch function.
 * - SmartSearchOutput - The return type for the smartSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartSearchInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  query: z.string().describe('The user query for extracting specific information from the document.'),
});
export type SmartSearchInput = z.infer<typeof SmartSearchInputSchema>;

const SmartSearchOutputSchema = z.object({
  summary: z.string().describe('A summary of the key information extracted from the document based on the user query.'),
});
export type SmartSearchOutput = z.infer<typeof SmartSearchOutputSchema>;

// Define a tool for getting the weather
const getWeatherTool = ai.defineTool(
    {
      name: 'getWeatherTool',
      description: 'Get the weather forecast for a given location.',
      inputSchema: z.object({
        location: z.string().describe('The location to get the weather for.'),
      }),
      outputSchema: z.string(),
    },
    async (input) => {
      // In a real application, you would call a weather API here.
      // For this example, we'll return mock data.
      return \`The weather in \${input.location} is 72°F and sunny.\`;
    }
);


export async function smartSearch(input: SmartSearchInput): Promise<SmartSearchOutput> {
  return smartSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartSearchPrompt',
  input: {schema: SmartSearchInputSchema},
  output: {schema: SmartSearchOutputSchema},
  tools: [getWeatherTool],
  prompt: \`You are an expert document analyzer. Your task is to extract key information from the document provided, based on the user's query.

If the user asks about the weather, use the getWeatherTool to provide a weather forecast. Otherwise, analyze the provided document.

Document: {{media url=documentDataUri}}

User Query: {{{query}}}

Provide a concise summary of the key information that answers the user's query.\`,
});

const smartSearchFlow = ai.defineFlow(
  {
    name: 'smartSearchFlow',
    inputSchema: SmartSearchInputSchema,
    outputSchema: SmartSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
`,
  "src/ai/flows/text-humanizer-tool.ts": `
'use server';

/**
 * @fileOverview Humanizes text to make it sound more natural.
 * 
 * - humanizeText - A function that rewrites text.
 * - HumanizeTextInput - The input type for the function.
 * - HumanizeTextOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const HumanizeTextInputSchema = z.object({
  text: z.string().describe('The text to be humanized.'),
  tone: z.enum(['Casual', 'Professional', 'Friendly', 'Witty', 'Formal']).describe('The desired tone for the rewritten text.'),
});
export type HumanizeTextInput = z.infer<typeof HumanizeTextInputSchema>;

const HumanizeTextOutputSchema = z.object({
  humanizedText: z.string().describe('The rewritten, more human-sounding text.'),
});
export type HumanizeTextOutput = z.infer<typeof HumanizeTextOutputSchema>;

export async function humanizeText(input: HumanizeTextInput): Promise<HumanizeTextOutput> {
  return humanizeTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'humanizeTextPrompt',
  input: { schema: HumanizeTextInputSchema },
  output: { schema: HumanizeTextOutputSchema },
  prompt: \`You are an expert at rewriting text to make it sound more natural and human. Your task is to take the user's input text and rewrite it in a {{{tone}}} tone.

The goal is to eliminate robotic or overly formal language, improve the flow, and make the text more engaging and relatable, as if a real person wrote it. Do not just replace words; restructure sentences and adjust the style as needed to fit the requested tone.

Original Text:
---
{{{text}}}
---

Rewrite the text now.\`,
});

const humanizeTextFlow = ai.defineFlow(
  {
    name: 'humanizeTextFlow',
    inputSchema: HumanizeTextInputSchema,
    outputSchema: HumanizeTextOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
`,
  "src/ai/flows/text-to-speech-tool.ts": `
'use server';

/**
 * @fileOverview Converts text into speech using an AI model.
 * 
 * - textToSpeech - A function that converts text to an audio data URI.
 * - TextToSpeechInput - The input type for the function.
 * - TextToSpeechOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import wav from 'wav';
import { googleAI } from '@genkit-ai/googleai';


async function toWav(
    pcmData: Buffer,
    channels = 1,
    rate = 24000,
    sampleWidth = 2
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const writer = new wav.Writer({
        channels,
        sampleRate: rate,
        bitDepth: sampleWidth * 8,
      });
  
      let bufs = [] as any[];
      writer.on('error', reject);
      writer.on('data', function (d) {
        bufs.push(d);
      });
      writer.on('end', function () {
        resolve(Buffer.concat(bufs).toString('base64'));
      });
  
      writer.write(pcmData);
      writer.end();
    });
}


const TextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to be converted into speech.'),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  audioUrl: z.string().describe('The data URI of the generated audio file in WAV format.'),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;

export async function textToSpeech(input: TextToSpeechInput): Promise<TextToSpeechOutput> {
  return textToSpeechFlow(input);
}

const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TextToSpeechInputSchema,
    outputSchema: TextToSpeechOutputSchema,
  },
  async ({ text }) => {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: text,
    });

    if (!media?.url) {
      throw new Error('Failed to generate audio from text.');
    }

    const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
    );
      
    const wavData = await toWav(audioBuffer);

    return { audioUrl: 'data:audio/wav;base64,' + wavData };
  }
);
`,
  "src/ai/flows/thesis-generator-tool.ts": `
'use server';

/**
 * @fileOverview Generates a structured academic document based on a topic and research notes.
 * 
 * - generateAcademicDocument - A function that generates thesis content.
 * - GenerateAcademicDocumentInput - The input type for the function.
 * - GenerateAcademicDocumentOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateAcademicDocumentInputSchema = z.object({
  documentDataUri: z.string().describe("A document containing the topic, outline, and research notes for the academic paper, as a data URI. Format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateAcademicDocumentInput = z.infer<typeof GenerateAcademicDocumentInputSchema>;

const ChapterSchema = z.object({
  title: z.string().describe('The title of the chapter or section.'),
  content: z.string().describe('The full content of the chapter/section, written in well-structured Markdown format.'),
});

const GenerateAcademicDocumentOutputSchema = z.object({
  title: z.string().describe('The main title of the generated document.'),
  introduction: z.string().describe('The content of the introduction chapter in Markdown format.'),
  chapters: z.array(ChapterSchema).describe('An array of generated chapters or sections for the document body.'),
  conclusion: z.string().describe('The content of the conclusion chapter in Markdown format.'),
});
export type GenerateAcademicDocumentOutput = z.infer<typeof GenerateAcademicDocumentOutputSchema>;

export async function generateAcademicDocument(input: GenerateAcademicDocumentInput): Promise<GenerateAcademicDocumentOutput> {
  return generateAcademicDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAcademicDocumentPrompt',
  input: { schema: GenerateAcademicDocumentInputSchema },
  output: { schema: GenerateAcademicDocumentOutputSchema },
  prompt: \`You are an expert academic writer. Your task is to generate a well-structured academic document (like a thesis, research paper, or SIP report) based on the user's uploaded document, which contains the topic, an outline, and research notes.

**Uploaded Document:**
{{media url=documentDataUri}}

**Instructions:**
1.  **Analyze the Document:** Carefully analyze the provided document to identify the main topic, the structure (chapters, sections), headings, and any key research points or data. Determine if it's a thesis, SIP report, or another academic paper and adapt the tone and format accordingly.
2.  **Title:** Extract or create a compelling and academic title for the document based on its content.
3.  **Introduction:** Write a comprehensive introduction that sets the stage, states the problem or thesis statement, and outlines the structure of the document, following the provided outline.
4.  **Body Chapters/Sections:** Generate the body based on the structure and headings found in the uploaded document. Flesh out each section with detailed, well-organized content, incorporating the research notes and key points provided.
5.  **Conclusion:** Write a strong conclusion that summarizes the key findings, restates the thesis, and suggests areas for future research.
6.  **Formatting:** All content for the introduction, chapters, and conclusion must be written in Markdown format, using headings, lists, and bold text as appropriate for academic writing.

Generate the complete document structure now.\`,
});

const generateAcademicDocumentFlow = ai.defineFlow(
  {
    name: 'generateAcademicDocumentFlow',
    inputSchema: GenerateAcademicDocumentInputSchema,
    outputSchema: GenerateAcademicDocumentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
`,
  "src/ai/flows/watermark-remover-tool.ts": `
'use server';

/**
 * @fileOverview Attempts to remove a watermark from an image.
 *
 * - removeWatermark - A function that processes an image to remove a watermark.
 * - RemoveWatermarkInput - The input type for the function.
 * - RemoveWatermarkOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const RemoveWatermarkInputSchema = z.object({
  imageDataUri: z.string().describe("An image with a watermark, as a data URI. Format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type RemoveWatermarkInput = z.infer<typeof RemoveWatermarkInputSchema>;

const RemoveWatermarkOutputSchema = z.object({
  processedImageUrl: z.string().describe('The data URI of the image after attempting to remove the watermark.'),
});
export type RemoveWatermarkOutput = z.infer<typeof RemoveWatermarkOutputSchema>;

export async function removeWatermark(input: RemoveWatermarkInput): Promise<RemoveWatermarkOutput> {
  return removeWatermarkFlow(input);
}

const removeWatermarkFlow = ai.defineFlow(
  {
    name: 'removeWatermarkFlow',
    inputSchema: RemoveWatermarkInputSchema,
    outputSchema: RemoveWatermarkOutputSchema,
  },
  async ({ imageDataUri }) => {
    const prompt = [
        { media: { url: imageDataUri } },
        { text: 'Analyze the provided image and intelligently remove the watermark. Reconstruct the area behind the watermark as accurately as possible to make it look like the watermark was never there.' },
    ];
    
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media?.url) {
      throw new Error('Failed to process the image.');
    }

    return { processedImageUrl: media.url };
  }
);
`,
  "src/ai/genkit.ts": `
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});
`,
  "src/app/actions.ts": `
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
    humanizeText,
    type HumanizeTextInput,
} from '@/ai/flows/text-humanizer-tool';
import {
  generateAcademicDocument,
  type GenerateAcademicDocumentInput,
} from '@/ai/flows/thesis-generator-tool';


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
`,
  "src/app/globals.css": `
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 222 83% 4%;
    --foreground: 210 20% 98%;
    --card: 222 79% 6%;
    --card-foreground: 210 20% 98%;
    --popover: 222 83% 4%;
    --popover-foreground: 210 20% 98%;
    --primary: 210 90% 55%;
    --primary-foreground: 210 20% 98%;
    --secondary: 215 28% 17%;
    --secondary-foreground: 210 20% 98%;
    --muted: 215 28% 17%;
    --muted-foreground: 218 11% 65%;
    --accent: 215 28% 17%;
    --accent-foreground: 210 20% 98%;
    --destructive: 0 63% 31%;
    --destructive-foreground: 210 20% 98%;
    --border: 215 28% 17%;
    --input: 215 28% 17%;
    --ring: 210 90% 55%;
    --radius: 0.5rem;
    
    --chart-1: 210 80% 50%;
    --chart-2: 173 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
 
  .dark {
    --background: 222 83% 4%;
    --foreground: 210 20% 98%;
    --card: 222 79% 6%;
    --card-foreground: 210 20% 98%;
    --popover: 222 83% 4%;
    --popover-foreground: 210 20% 98%;
    --primary: 210 90% 55%;
    --primary-foreground: 210 20% 98%;
    --secondary: 215 28% 17%;
    --secondary-foreground: 210 20% 98%;
    --muted: 215 28% 17%;
    --muted-foreground: 218 11% 65%;
    --accent: 215 28% 17%;
    --accent-foreground: 210 20% 98%;
    --destructive: 0 63% 31%;
    --destructive-foreground: 210 20% 98%;
    --border: 215 28% 17%;
    --input: 215 28% 17%;
    --ring: 210 90% 55%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`,
  "src/app/layout.tsx": `
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'AI Mentor',
  description: 'A suite of AI-powered tools for various tasks.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
`,
  "src/app/page.tsx": `
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AppLogo } from '@/components/app-logo';


export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the first tool by default
    router.replace('/tools/smart-search');
  }, [router]);

  return (
     <div className="flex h-svh w-full flex-col items-center justify-center bg-background">
      <div className="flex items-center gap-4">
        <AppLogo className="h-12 w-12 text-primary" />
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
      <p className="mt-4 text-muted-foreground">Loading AI Mentor...</p>
    </div>
  );
}
`,
  "src/app/tools/ai-explanation/page.tsx": `
import AiExplanationTool from '@/components/tools/ai-explanation-tool';

export default function AiExplanationPage() {
  return <AiExplanationTool />;
}
`,
  "src/app/tools/career-path-suggester/page.tsx": `
import CareerPathSuggesterTool from '@/components/tools/career-path-suggester-tool';

export default function CareerPathSuggesterPage() {
  return <CareerPathSuggesterTool />;
}
`,
  "src/app/tools/code-analyzer/page.tsx": `
import CodeAnalyzerTool from '@/components/tools/code-analyzer-tool';

export default function CodeAnalyzerPage() {
  return <CodeAnalyzerTool />;
}
`,
  "src/app/tools/code-generator/page.tsx": `
import CodeGeneratorTool from '@/components/tools/code-generator-tool';

export default function CodeGeneratorPage() {
  return <CodeGeneratorTool />;
}
`,
  "src/app/tools/cover-letter-assistant/page.tsx": `
import CoverLetterAssistantTool from '@/components/tools/cover-letter-assistant-tool';

export default function CoverLetterAssistantPage() {
  return <CoverLetterAssistantTool />;
}
`,
  "src/app/tools/diagram-generator/page.tsx": `
import DiagramGeneratorTool from '@/components/tools/diagram-generator-tool';

export default function DiagramGeneratorPage() {
  return <DiagramGeneratorTool />;
}
`,
  "src/app/tools/document-summarizer/page.tsx": `
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { handleSummarizeDocumentAction } from '@/app/actions';
import type { SummarizeDocumentOutput } from '@/ai/flows/document-summarizer-tool';
import { FileText, Loader2, UploadCloud } from 'lucide-react';

const formSchema = z.object({
  documentDataUri: z.string().min(1, 'Please upload a document.'),
  length: z.enum(['Short', 'Medium', 'Long']),
  style: z.enum(['Bulleted List', 'Paragraph']),
});

type FormData = z.infer<typeof formSchema>;

export default function DocumentSummarizerTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SummarizeDocumentOutput | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentDataUri: '',
      length: 'Medium',
      style: 'Paragraph',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 200 * 1024 * 1024) { // 200MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload a document smaller than 200MB."});
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        form.setValue('documentDataUri', dataUri);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleSummarizeDocumentAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error summarizing document',
        description: response.error,
      });
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold font-headline">Document Summarizer</h1>
        <p className="text-muted-foreground">Get a quick summary of any uploaded document.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Summarize a Document</CardTitle>
          <CardDescription>
            Upload a document and choose your desired summary length and style.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormItem>
                <FormLabel>Document</FormLabel>
                <FormControl>
                  <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center">
                    {fileName ? (
                      <div className='flex flex-col items-center gap-2'>
                        <FileText className="w-12 h-12 text-primary" />
                        <p className='text-sm font-medium'>{fileName}</p>
                         <Button variant="link" size="sm" asChild className='p-0 h-auto'>
                           <label htmlFor="file-upload" className="cursor-pointer">Change file</label>
                         </Button>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="w-12 h-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          <label htmlFor="file-upload" className="font-semibold text-primary cursor-pointer hover:underline">
                            Click to upload
                          </label>
                           {' '}or drag and drop
                        </p>
                         <p className="text-xs text-muted-foreground">PDF, DOCX, TXT up to 200MB</p>
                      </>
                    )}
                    <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt"/>
                  </div>
                </FormControl>
                <FormMessage>{form.formState.errors.documentDataUri?.message}</FormMessage>
              </FormItem>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="length"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Summary Length</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select length" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Short">Short</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Long">Long</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="style"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Summary Style</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Paragraph">Paragraph</SelectItem>
                          <SelectItem value="Bulleted List">Bulleted List</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Summarizing...' : 'Summarize'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none whitespace-pre-wrap">
              {result.summary}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
`,
  "src/app/tools/image-text-manipulation/page.tsx": `
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { handleManipulateImageTextAction } from '@/app/actions';
import type { ManipulateImageTextOutput } from '@/ai/flows/image-text-manipulation-tool';
import { Loader2, UploadCloud } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  imageDataUri: z.string().min(1, 'Please upload an image.'),
  instructions: z.string().min(1, 'Please provide instructions.'),
});

type FormData = z.infer<typeof formSchema>;

export default function ImageTextManipulationTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [result, setResult] = useState<ManipulateImageTextOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageDataUri: '',
      instructions: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 200 * 1024 * 1024) { // 200MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload an image smaller than 200MB."});
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        form.setValue('imageDataUri', dataUri);
        setOriginalImage(dataUri);
        setResult(null); // Clear previous result
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleManipulateImageTextAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error manipulating image text',
        description: response.error,
      });
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold font-headline">Image Text Manipulation</h1>
        <p className="text-muted-foreground">Edit text directly within an image using AI.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Manipulate Image Text</CardTitle>
          <CardDescription>
            Upload an image containing text and tell the AI what changes to make.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <FormItem>
                        <FormLabel>Image File</FormLabel>
                        <FormControl>
                            <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center h-[265px]">
                            {originalImage ? (
                            <Image src={originalImage} alt="Image preview" layout="fill" objectFit="contain" className="rounded-md" />
                            ) : (
                            <>
                                <UploadCloud className="w-12 h-12 text-muted-foreground" />
                                <p className="mt-2 text-sm text-muted-foreground">
                                <label htmlFor="file-upload" className="font-semibold text-primary cursor-pointer hover:underline">
                                    Upload an image
                                </label>
                                </p>
                                <Input id="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 200MB</p>
                            </>
                            )}
                        </div>
                        </FormControl>
                        <FormMessage>{form.formState.errors.imageDataUri?.message}</FormMessage>
                    </FormItem>
                    <FormField
                        control={form.control}
                        name="instructions"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Instructions</FormLabel>
                            <FormControl>
                            <Textarea
                                placeholder="e.g., 'Change the title to \`Hello World\` and make the subtitle blue.'"
                                {...field}
                                rows={10}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
              <Button type="submit" disabled={isLoading || !originalImage}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Processing...' : 'Manipulate Text'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || result) && (
        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
           <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className="space-y-2">
                <h3 className="text-center font-semibold">Original</h3>
                {originalImage && (
                    <div className="aspect-square w-full relative">
                        <Image src={originalImage} alt="Original image" layout="fill" objectFit="contain" className="rounded-lg border" />
                    </div>
                )}
              </div>
              <div className="space-y-2">
                <h3 className="text-center font-semibold">Processed</h3>
                {isLoading ? (
                  <Skeleton className="aspect-square w-full rounded-lg" />
                ) : (
                  result && (
                     <div className="aspect-square w-full relative">
                        <Image src={result.processedImageUrl} alt="Processed image" layout="fill" objectFit="contain" className="rounded-lg border" />
                    </div>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
`,
  "src/app/tools/interview-question-generator/page.tsx": `
import InterviewQuestionGeneratorTool from '@/components/tools/interview-question-generator-tool';

export default function InterviewQuestionGeneratorPage() {
  return <InterviewQuestionGeneratorTool />;
}
`,
  "src/app/tools/layout.tsx": `
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
  Sparkles,
  GraduationCap,
  Github,
  LifeBuoy,
  Settings,
  Download,
} from 'lucide-react';
import { AppLogo } from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { downloadProject } from '@/lib/download-project';


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
  { id: 'thesis-generator', name: 'Thesis Generator', icon: GraduationCap, href: '/tools/thesis-generator', category: 'Writing' },
  { id: 'text-humanizer', name: 'Text Humanizer', icon: Sparkles, href: '/tools/text-humanizer', category: 'Writing' },
  { id: 'code-generator', name: 'Code Generator', icon: CodeXml, href: '/tools/code-generator', category: 'Development' },
  { id: 'code-analyzer', name: 'Code Analyzer', icon: ScanEye, href: '/tools/code-analyzer', category: 'Development' },
  { id: 'diagram-generator', name: 'Diagram Generator', icon: GitGraph, href: '/tools/diagram-generator', category: 'Development' },
  { id: 'interview-question-generator', name: 'Interview Questions', icon: ClipboardList, href: '/tools/interview-question-generator', category: 'Career' },
  { id: 'resume-feedback', name: 'Resume Feedback', icon: UserSquare, href: '/tools/resume-feedback', category: 'Career' },
  { id: 'portfolio-generator', name: 'Portfolio Generator', icon: Briefcase, href: '/tools/portfolio-generator', category: 'Career' },
  { id: 'cover-letter-assistant', name: 'Cover Letter Assistant', icon: Mail, href: '/tools/cover-letter-assistant', category: 'Career' },
  { id: 'career-path-suggester', name: 'Career Path Suggester', icon: Compass, href: '/tools/career-path-suggester', category: 'Career' },
  { id: 'linkedin-visuals-generator', name: 'LinkedIn Visuals', icon: Linkedin, href: '/tools/linkedin-visuals-generator', category: 'Career' },
  { id: 'presentation-generator', name: 'Presentation Generator', icon: Presentation, href: '/tools/presentation-generator', category: 'Productivity' },
  { id: 'text-to-speech', name: 'Text to Speech', icon: Mic, href: '/tools/text-to-speech', category: 'Productivity' },
  { id: 'watermark-remover', name: 'Watermark Remover', icon: Eraser, href: '/tools/watermark-remover', category: 'Media' },
  { id: 'image-text-manipulation', name: 'Image Text Manipulation', icon: Type, href: '/tools/image-text-manipulation', category: 'Media' },
];

const categories = [...new Set(tools.map(tool => tool.category))].sort((a, b) => {
    const order = ['Analysis', 'Learning', 'Writing', 'Development', 'Career', 'Productivity', 'Media'];
    return order.indexOf(a) - order.indexOf(b);
});

const ToolSidebar = () => {
  const pathname = usePathname();
  const { toast } = useToast();

  const onDownload = () => {
    toast({ title: "Zipping Project...", description: "Your project files are being zipped for download." });
    try {
      downloadProject();
      toast({ title: "Download Started!", description: "Your project is being downloaded." });
    } catch (error) {
      toast({ variant: 'destructive', title: "Download Failed", description: "Could not download project files." });
    }
  };
  
  return (
    <Sidebar collapsible="icon" className="border-r bg-card">
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
              <SidebarMenuButton 
                onClick={onDownload} 
                tooltip={{children: 'Download Project', side: 'right', align: 'center'}}
              >
                <Download />
                <span className="truncate">Download Project</span>
              </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/tools/support" className="block">
                <SidebarMenuButton isActive={pathname === '/tools/support'} tooltip={{children: 'Support', side: 'right', align: 'center'}}>
                  <LifeBuoy />
                  <span className="truncate">Support</span>
                </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/tools/settings" className="block">
                <SidebarMenuButton isActive={pathname === '/tools/settings'} tooltip={{children: 'Settings', side: 'right', align: 'center'}}>
                  <Settings />
                  <span className="truncate">Settings</span>
                </SidebarMenuButton>
            </Link>
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
              <Link href="https://github.com/DevelopWithArpit" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Button>
              </Link>
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
`,
  "src/app/tools/linkedin-visuals-generator/page.tsx": `
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { saveAs } from 'file-saver';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { handleGenerateLinkedInVisualsAction } from '@/app/actions';
import type { GenerateLinkedInVisualsInput, GenerateLinkedInVisualsOutput } from '@/ai/flows/linkedin-visuals-generator-tool';
import { Download, FileText, Loader2, UploadCloud } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  resumeDataUri: z.string().optional(),
  resumeText: z.string().optional(),
  userPhotoUri: z.string().optional(),
}).refine(data => !!data.resumeDataUri || !!data.resumeText, {
    message: 'Please either upload a resume or enter text manually.',
    path: ['resumeDataUri'],
});

type FormData = z.infer<typeof formSchema>;

export default function LinkedInVisualsGeneratorTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateLinkedInVisualsOutput | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeDataUri: '',
      resumeText: '',
      userPhotoUri: '',
    },
  });

  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 200 * 1024 * 1024) { // 200MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload a resume smaller than 200MB."});
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        form.setValue('resumeDataUri', dataUri);
        form.setValue('resumeText', ''); // Clear text input if file is uploaded
        setResumeFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 200 * 1024 * 1024) { // 200MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload an image smaller than 200MB."});
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        form.setValue('userPhotoUri', dataUri);
        setPhotoPreview(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleDownload = (url: string, filename: string) => {
    saveAs(url, filename);
    toast({
      title: 'Download Started',
      description: \`\${filename} is downloading.\`,
    });
  };

  async function onSubmit(data: GenerateLinkedInVisualsInput) {
    setIsLoading(true);
    setResult(null);
    const response = await handleGenerateLinkedInVisualsAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error generating visuals',
        description: response.error,
      });
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold font-headline">LinkedIn Visuals Generator</h1>
        <p className="text-muted-foreground">
          Create a professional profile picture and cover banner for your LinkedIn profile.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Generate Visuals</CardTitle>
          <CardDescription>
            Provide your resume for context and optionally upload a photo to use as a base.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload">Upload Resume</TabsTrigger>
                        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload" className="mt-4">
                        <FormItem>
                            <FormLabel>Your Resume</FormLabel>
                            <FormControl>
                                <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center h-[265px]">
                                {resumeFileName ? (
                                    <div className='flex flex-col items-center gap-2'>
                                    <FileText className="w-12 h-12 text-primary" />
                                    <p className='text-sm font-medium'>{resumeFileName}</p>
                                    <Button variant="link" size="sm" asChild className='p-0 h-auto'>
                                        <label htmlFor="resume-upload" className="cursor-pointer">Change file</label>
                                    </Button>
                                    </div>
                                ) : (
                                    <>
                                    <UploadCloud className="w-12 h-12 text-muted-foreground" />
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        <label htmlFor="resume-upload" className="font-semibold text-primary cursor-pointer hover:underline">
                                        Click to upload
                                        </label>
                                    </p>
                                    <p className="text-xs text-muted-foreground">PDF, DOCX, TXT up to 200MB</p>
                                    </>
                                )}
                                <Input id="resume-upload" type="file" className="sr-only" onChange={handleResumeFileChange} accept=".pdf,.doc,.docx,.txt"/>
                                </div>
                            </FormControl>
                             <FormMessage>{form.formState.errors.resumeDataUri?.message}</FormMessage>
                        </FormItem>
                    </TabsContent>
                    <TabsContent value="manual" className="mt-4">
                        <FormField
                            control={form.control}
                            name="resumeText"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Paste Resume Content</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Paste your resume content here..."
                                            {...field}
                                            rows={12}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                form.setValue('resumeDataUri', '');
                                                setResumeFileName(null);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </TabsContent>
                </Tabs>
                
                <FormItem>
                  <FormLabel>Your Photo (Optional)</FormLabel>
                   <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center h-[265px]">
                    {photoPreview ? (
                      <Image src={photoPreview} alt="Image preview" layout="fill" objectFit="contain" className="rounded-md" />
                    ) : (
                      <>
                        <UploadCloud className="w-12 h-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          <label htmlFor="photo-upload" className="font-semibold text-primary cursor-pointer hover:underline">
                             Upload a headshot
                          </label>
                        </p>
                        <Input id="photo-upload" type="file" accept="image/*" className="sr-only" onChange={handlePhotoFileChange} />
                         <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 200MB</p>
                      </>
                    )}
                  </div>
                </FormItem>

              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Generating...' : 'Generate Visuals'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || result) && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Visuals</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-4">
                <h3 className="font-semibold text-center font-headline">Profile Picture</h3>
                <div className="flex justify-center">
                    {isLoading && !result ? <Skeleton className="w-48 h-48 rounded-full" /> : null}
                    {result?.profilePictureUrl && (
                        <div className="flex flex-col items-center gap-4">
                            <Image src={result.profilePictureUrl} alt="Generated profile picture" width={192} height={192} className="rounded-full border" />
                            <Button onClick={() => handleDownload(result.profilePictureUrl, 'profile-picture.png')}>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                            </Button>
                        </div>
                    )}
                </div>
             </div>
             <div className="space-y-4">
                <h3 className="font-semibold text-center font-headline">Cover Banner</h3>
                 {isLoading && !result ? <Skeleton className="w-full aspect-[4/1] rounded-lg" /> : null}
                 {result?.coverBannerUrl && (
                    <div className="flex flex-col items-center gap-4">
                        <Image src={result.coverBannerUrl} alt="Generated cover banner" width={1584} height={396} className="rounded-lg border aspect-[4/1] object-cover" />
                        <Button onClick={() => handleDownload(result.coverBannerUrl, 'cover-banner.png')}>
                           <Download className="mr-2 h-4 w-4" />
                            Download
                        </Button>
                    </div>
                 )}
             </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
`,
  "src/app/tools/loading.tsx": `
import ToolSkeleton from '@/components/tools/tool-skeleton';

export default function Loading() {
  return <ToolSkeleton />;
}
`,
  "src/app/tools/portfolio-generator/page.tsx": `
'use client';

import React, { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleGeneratePortfolioWebsiteAction } from '@/app/actions';
import type { GeneratePortfolioWebsiteOutput, GeneratePortfolioWebsiteInput } from '@/ai/flows/portfolio-generator-tool';
import { Copy, Download, FileArchive, FileText, Loader2, Plus, Trash2, UploadCloud } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const portfolioSchema = z.object({
    name: z.string().min(1, "Name is required."),
    headline: z.string().min(1, "Headline is required."),
    profession: z.string().min(1, "Profession is required."),
    contact: z.object({
        email: z.string().email("Invalid email address."),
        phone: z.string().optional(),
        linkedin: z.string().optional(),
        github: z.string().optional(),
        socials: z.array(z.object({
            network: z.string(),
            url: z.string().url().or(z.literal('')),
        })).optional(),
    }),
    about: z.string().min(20, "About section should be at least 20 characters."),
    experience: z.array(z.object({
        title: z.string().min(1, "Title is required."),
        company: z.string().min(1, "Company is required."),
        dates: z.string().min(1, "Dates are required."),
        description: z.string().min(1, "Description is required."),
    })),
    education: z.array(z.object({
        degree: z.string().min(1, "Degree is required."),
        school: z.string().min(1, "School is required."),
        dates: z.string().min(1, "Dates are required."),
    })),
    projects: z.array(z.object({
        title: z.string().min(1, "Title is required."),
        description: z.string().min(1, "Description is required."),
        link: z.string().url("Invalid URL.").optional().or(z.literal('')),
        imageUrl: z.string().url("Invalid URL.").optional().or(z.literal('')),
    })),
    skills: z.array(z.string().min(1)).min(1, "At least one skill is required."),
    achievements: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof portfolioSchema>;

export default function PortfolioGeneratorTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeneratePortfolioWebsiteOutput | null>(null);
  const { toast } = useToast();
  const [resumeDataUri, setResumeDataUri] = useState<string | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [certificateDataUri, setCertificateDataUri] = useState<string | null>(null);
  const [certificateFileName, setCertificateFileName] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
        name: '',
        headline: '',
        profession: '',
        contact: { email: '', socials: [{ network: 'LinkedIn', url: '' }, { network: 'GitHub', url: '' }] },
        about: '',
        experience: [{ title: '', company: '', dates: '', description: '' }],
        education: [{ degree: '', school: '', dates: '' }],
        projects: [{ title: '', description: '', link: '', imageUrl: '' }],
        skills: [],
        achievements: [],
    },
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control: form.control, name: "experience" });
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control: form.control, name: "education" });
  const { fields: projFields, append: appendProj, remove: removeProj } = useFieldArray({ control: form.control, name: "projects" });
  const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({ control: form.control, name: "contact.socials" });

  async function onManualSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleGeneratePortfolioWebsiteAction({ type: 'manual', data });
    setIsLoading(false);

    if (response.success && response.data) {
      setResult(response.data);
      toast({ title: 'Website Generated!', description: 'Your portfolio has been successfully generated.' });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Generating Website',
        description: response.error,
      });
    }
  }

  const onResumeSubmit = async () => {
    if (!resumeDataUri) {
        toast({ variant: 'destructive', title: 'No Resume Provided', description: 'Please upload a resume.' });
        return;
    }
    setIsLoading(true);
    setResult(null);
    const response = await handleGeneratePortfolioWebsiteAction({ type: 'resume', resumeDataUri, certificateDataUri });
    setIsLoading(false);

    if (response.success && response.data) {
      setResult(response.data);
      toast({ title: 'Website Generated!', description: 'Your portfolio has been successfully generated from the provided resume.' });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Generating Website',
        description: response.error,
      });
    }
  };
  
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: \`\${type} Copied!\`,
      description: \`The \${type.toLowerCase()} code has been copied to your clipboard.\`,
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
      description: \`Your portfolio website is being downloaded as a zip file.\`,
    });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFileName: React.Dispatch<React.SetStateAction<string | null>>,
    setDataUri: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 200 * 1024 * 1024) { // 200MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload a document smaller than 200MB."});
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = async (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        setDataUri(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold font-headline">Portfolio Website Generator</h1>
        <p className="text-muted-foreground">
          Generate a website from your resume, or by filling out the form manually.
        </p>
      </header>
      
      <Card>
        <CardHeader>
            <CardTitle>Create Your Portfolio</CardTitle>
            <CardDescription>Choose your preferred method to get started.</CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="auto-generate">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="auto-generate">From Resume</TabsTrigger>
                    <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                </TabsList>
                <TabsContent value="auto-generate" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>1. Upload Resume</Label>
                            <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center h-48">
                                {resumeFileName ? (
                                    <div className='flex flex-col items-center gap-2'>
                                        <FileText className="w-12 h-12 text-primary" />
                                        <p className='text-sm font-medium'>{resumeFileName}</p>
                                        <Button variant="link" size="sm" asChild className='p-0 h-auto'>
                                            <label htmlFor="resume-upload" className="cursor-pointer">Change file</label>
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <UploadCloud className="w-12 h-12 text-muted-foreground" />
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            <label htmlFor="resume-upload" className="font-semibold text-primary cursor-pointer hover:underline">
                                                Upload Resume
                                            </label>
                                        </p>
                                        <p className="text-xs text-muted-foreground">PDF, DOCX, TXT</p>
                                    </>
                                )}
                                <Input id="resume-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e, setResumeFileName, setResumeDataUri)} accept=".pdf,.docx,.txt" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>2. Upload Certificate (Optional)</Label>
                            <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center h-48">
                                {certificateFileName ? (
                                    <div className='flex flex-col items-center gap-2'>
                                        <FileText className="w-12 h-12 text-primary" />
                                        <p className='text-sm font-medium'>{certificateFileName}</p>
                                        <Button variant="link" size="sm" asChild className='p-0 h-auto'>
                                            <label htmlFor="cert-upload" className="cursor-pointer">Change file</label>
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <UploadCloud className="w-12 h-12 text-muted-foreground" />
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            <label htmlFor="cert-upload" className="font-semibold text-primary cursor-pointer hover:underline">
                                                Upload Certificate
                                            </label>
                                        </p>
                                        <p className="text-xs text-muted-foreground">Image or PDF</p>
                                    </>
                                )}
                                <Input id="cert-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e, setCertificateFileName, setCertificateDataUri)} accept="image/*,.pdf" />
                            </div>
                        </div>
                    </div>
                     <div className="mt-6">
                        <Button onClick={onResumeSubmit} disabled={isLoading || !resumeDataUri}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Generate Website
                        </Button>
                    </div>
                </TabsContent>
                <TabsContent value="manual" className="mt-6">
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onManualSubmit)} className="space-y-8">
                        {/* Personal Details */}
                        <Card>
                            <CardHeader><CardTitle>Personal Details</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField control={form.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Full Name</FormLabel> <FormControl><Input placeholder="John Doe" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                    <FormField control={form.control} name="headline" render={({ field }) => ( <FormItem> <FormLabel>Headline</FormLabel> <FormControl><Input placeholder="Software Engineer | AI Enthusiast" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                </div>
                                <FormField control={form.control} name="profession" render={({ field }) => ( <FormItem> <FormLabel>Profession</FormLabel> <FormControl><Input placeholder="e.g., Software Engineer" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                 <FormField control={form.control} name="contact.email" render={({ field }) => ( <FormItem> <FormLabel>Email</FormLabel> <FormControl><Input placeholder="your.email@example.com" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                <FormField control={form.control} name="about" render={({ field }) => ( <FormItem> <FormLabel>About Me</FormLabel> <FormControl><Textarea placeholder="A short bio about yourself..." {...field} rows={5} /></FormControl> <FormMessage /> </FormItem> )}/>
                            </CardContent>
                        </Card>

                        {/* Social Links */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Social Links</CardTitle>
                                <Button type="button" variant="outline" size="sm" onClick={() => appendSocial({ network: '', url: '' })}><Plus className="mr-2 h-4 w-4" /> Add Link</Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {socialFields.map((field, index) => (
                                    <div key={field.id} className="flex gap-4 items-end">
                                        <FormField control={form.control} name={\`contact.socials.\${index}.network\`} render={({ field }) => ( <FormItem className="flex-1"> <FormLabel>Network</FormLabel> <FormControl><Input {...field} placeholder="e.g., LinkedIn" /></FormControl> <FormMessage /> </FormItem> )}/>
                                        <FormField control={form.control} name={\`contact.socials.\${index}.url\`} render={({ field }) => ( <FormItem className="flex-1"> <FormLabel>URL</FormLabel> <FormControl><Input {...field} placeholder="https://linkedin.com/in/..." /></FormControl> <FormMessage /> </FormItem> )}/>
                                        <Button type="button" variant="ghost" size="icon" className="h-9 w-9" onClick={() => removeSocial(index)}><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Experience */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Work Experience</CardTitle>
                                <Button type="button" variant="outline" size="sm" onClick={() => appendExp({ title: '', company: '', dates: '', description: '' })}><Plus className="mr-2 h-4 w-4" /> Add Experience</Button>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {expFields.map((field, index) => (
                                    <div key={field.id} className="space-y-4 border p-4 rounded-md relative">
                                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeExp(index)}><Trash2 className="h-4 w-4" /></Button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField control={form.control} name={\`experience.\${index}.title\`} render={({ field }) => ( <FormItem> <FormLabel>Job Title</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                            <FormField control={form.control} name={\`experience.\${index}.company\`} render={({ field }) => ( <FormItem> <FormLabel>Company</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                        </div>
                                        <FormField control={form.control} name={\`experience.\${index}.dates\`} render={({ field }) => ( <FormItem> <FormLabel>Dates</FormLabel> <FormControl><Input {...field} placeholder="e.g., June 2023 - Present" /></FormControl> <FormMessage /> </FormItem> )}/>
                                        <FormField control={form.control} name={\`experience.\${index}.description\`} render={({ field }) => ( <FormItem> <FormLabel>Description</FormLabel> <FormControl><Textarea {...field} rows={4} /></FormControl> <FormMessage /> </FormItem> )}/>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Education */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Education</CardTitle>
                                <Button type="button" variant="outline" size="sm" onClick={() => appendEdu({ degree: '', school: '', dates: '' })}><Plus className="mr-2 h-4 w-4" /> Add Education</Button>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {eduFields.map((field, index) => (
                                    <div key={field.id} className="space-y-4 border p-4 rounded-md relative">
                                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeEdu(index)}><Trash2 className="h-4 w-4" /></Button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField control={form.control} name={\`education.\${index}.degree\`} render={({ field }) => ( <FormItem> <FormLabel>Degree</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                            <FormField control={form.control} name={\`education.\${index}.school\`} render={({ field }) => ( <FormItem> <FormLabel>School/University</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                        </div>
                                        <FormField control={form.control} name={\`education.\${index}.dates\`} render={({ field }) => ( <FormItem> <FormLabel>Dates</FormLabel> <FormControl><Input {...field} placeholder="e.g., 2022 - 2026" /></FormControl> <FormMessage /> </FormItem> )}/>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Projects */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Projects</CardTitle>
                                <Button type="button" variant="outline" size="sm" onClick={() => appendProj({ title: '', description: '', link: '', imageUrl: '' })}><Plus className="mr-2 h-4 w-4" /> Add Project</Button>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {projFields.map((field, index) => (
                                    <div key={field.id} className="space-y-4 border p-4 rounded-md relative">
                                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeProj(index)}><Trash2 className="h-4 w-4" /></Button>
                                        <FormField control={form.control} name={\`projects.\${index}.title\`} render={({ field }) => ( <FormItem> <FormLabel>Project Title</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                        <FormField control={form.control} name={\`projects.\${index}.description\`} render={({ field }) => ( <FormItem> <FormLabel>Description</FormLabel> <FormControl><Textarea {...field} rows={3} /></FormControl> <FormMessage /> </FormItem> )}/>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField control={form.control} name={\`projects.\${index}.link\`} render={({ field }) => ( <FormItem> <FormLabel>Project Link (Optional)</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                            <FormField control={form.control} name={\`projects.\${index}.imageUrl\`} render={({ field }) => ( <FormItem> <FormLabel>Image URL (Optional)</FormLabel> <FormControl><Input {...field} placeholder="https://placehold.co/600x400" /></FormControl> <FormMessage /> </FormItem> )}/>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Skills */}
                        <Card>
                            <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="skills"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Enter your skills, separated by commas</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="e.g., Python, JavaScript, React, AI, Machine Learning"
                                                    onChange={(e) => {
                                                        const skillsArray = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                                        field.onChange(skillsArray);
                                                    }}
                                                    value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                                                    rows={3}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                        
                        {/* Achievements */}
                        <Card>
                            <CardHeader><CardTitle>Achievements</CardTitle></CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="achievements"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Enter your achievements, separated by commas</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="e.g., Won 1st place in hackathon, Published a paper"
                                                    onChange={(e) => {
                                                        const achievementsArray = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                                        field.onChange(achievementsArray);
                                                    }}
                                                    value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                                                    rows={3}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Button type="submit" disabled={isLoading}>
                             {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Generate Website from Form
                        </Button>
                    </form>
                </Form>
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>

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
                result &&
                <Tabs defaultValue="preview">
                    <TabsList>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                        <TabsTrigger value="html">HTML</TabsTrigger>
                        <TabsTrigger value="css">CSS</TabsTrigger>
                        <TabsTrigger value="js">JavaScript</TabsTrigger>
                    </TabsList>
                    <TabsContent value="preview" className="mt-4">
                        <iframe 
                            srcDoc={\`<html><head><style>\${result.css}</style></head><body>\${result.html}<script>\${result.javascript}</script></body></html>\`}
                            className="w-full h-[600px] border rounded-md"
                            title="Portfolio Preview"
                        />
                    </TabsContent>
                    <TabsContent value="html">
                        <CodeBlock 
                          code={result.html} 
                          onCopy={() => copyToClipboard(result.html, 'HTML')} 
                          onDownload={() => downloadFile(result.html, 'index.html', 'text/html')}
                        />
                    </TabsContent>
                     <TabsContent value="css">
                        <CodeBlock 
                          code={result.css} 
                          onCopy={() => copyToClipboard(result.css, 'CSS')}
                          onDownload={() => downloadFile(result.css, 'style.css', 'text/css')}
                        />
                    </TabsContent>
                     <TabsContent value="js">
                        <CodeBlock 
                          code={result.javascript} 
                          onCopy={() => copyToClipboard(result.javascript, 'JavaScript')}
                          onDownload={() => downloadFile(result.javascript, 'script.js', 'text/javascript')}
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
`,
  "src/app/tools/presentation-generator/page.tsx": `
import PresentationGeneratorTool from '@/components/tools/presentation-generator-tool';

export default function PresentationGeneratorPage() {
  return <PresentationGeneratorTool />;
}
`,
  "src/app/tools/resume-feedback/page.tsx": `
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { saveAs } from 'file-saver';
import { Packer } from 'docx';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { handleGetResumeFeedbackAction } from '@/app/actions';
import type { GetResumeFeedbackOutput } from '@/ai/flows/resume-feedback-tool';
import { FileText, UploadCloud, Download, FileCode, Loader2 } from 'lucide-react';
import { ResumeTemplate } from '@/components/resume-template';
import { createResumeDocx } from '@/lib/docx-generator';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


const formSchema = z.object({
  resume: z.string().min(1, 'Please upload or paste your resume.'),
  targetJobRole: z.string().optional(),
  additionalInfo: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;


export default function ResumeFeedbackTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GetResumeFeedbackOutput | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resume: '',
      targetJobRole: '',
      additionalInfo: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 200 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please upload a document smaller than 200MB.',
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        form.setValue('resume', dataUri);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: FormData) {
    if (!data.resume) {
      form.setError('resume', {
        type: 'manual',
        message: 'Please upload or paste your resume.',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    const response = await handleGetResumeFeedbackAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Analyzing Resume',
        description: response.error,
      });
    }
  }

  const handleDownloadDocx = () => {
    if (!result?.rewrittenResume) return;

    try {
      const doc = createResumeDocx(result.rewrittenResume);
      Packer.toBlob(doc).then(blob => {
        saveAs(blob, 'resume.docx');
        toast({ title: "DOCX Downloaded", description: "Your resume has been saved as a DOCX file." });
      });
    } catch (error) {
       toast({ variant: 'destructive', title: 'Error Generating DOCX', description: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
  };
  
  const handleDownloadPdf = async () => {
    const resumeElement = document.getElementById('resume-preview-content');
    if (!resumeElement) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not find resume content to download.' });
        return;
    }

    try {
        const canvas = await html2canvas(resumeElement, {
            scale: 3, // Higher scale for better quality
            useCORS: true,
            logging: false,
        });
        const imgData = canvas.toDataURL('image/png', 1.0);
        
        // A4 page dimensions in pixels at 96 DPI are roughly 794x1123
        const pdfWidth = 794;
        const pdfHeight = 1123;
        
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: [pdfWidth, pdfHeight],
        });

        const canvasAspectRatio = canvas.width / canvas.height;
        let finalWidth = pdfWidth;
        let finalHeight = finalWidth / canvasAspectRatio;

        if (finalHeight > pdfHeight) {
            finalHeight = pdfHeight;
            finalWidth = finalHeight * canvasAspectRatio;
        }
        
        const x = (pdfWidth - finalWidth) / 2;
        const y = 0;


        pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
        pdf.save('resume.pdf');
        toast({ title: "PDF Downloaded", description: "Your resume has been saved as a PDF file." });
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error Generating PDF', description: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
};

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Resume Feedback Tool</h1>
        <p className="text-muted-foreground">
          Get AI feedback on your resume, then download a professionally formatted, editable DOCX file.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Analyze Your Resume</CardTitle>
          <CardDescription>
            Upload or paste your resume, then provide some optional context about
            your job search.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="paste">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="paste">Paste Text</TabsTrigger>
                  <TabsTrigger value="upload">Upload File</TabsTrigger>
                </TabsList>
                <TabsContent value="paste" className="mt-4">
                  <FormField
                    control={form.control}
                    name="resume"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Paste your resume content here</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Paste your resume here..."
                            rows={15}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setFileName(null);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="upload" className="mt-4">
                  <FormItem>
                    <FormLabel>Upload Document</FormLabel>
                    <FormControl>
                      <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center h-48">
                        {fileName ? (
                          <div className="flex flex-col items-center gap-2">
                            <FileText className="w-12 h-12 text-primary" />
                            <p className="text-sm font-medium">{fileName}</p>
                            <Button
                              variant="link"
                              size="sm"
                              asChild
                              className="p-0 h-auto"
                            >
                              <label
                                htmlFor="file-upload"
                                className="cursor-pointer"
                              >
                                Change file
                              </label>
                            </Button>
                          </div>
                        ) : (
                          <>
                            <UploadCloud className="w-12 h-12 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">
                              <label
                                htmlFor="file-upload"
                                className="font-semibold text-primary cursor-pointer hover:underline"
                              >
                                Click to upload
                              </label>{' '}
                              or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PDF, TXT up to 200MB
                            </p>
                          </>
                        )}
                        <Input
                          id="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept=".pdf,.txt"
                        />
                      </div>
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.resume?.message}
                    </FormMessage>
                  </FormItem>
                </TabsContent>
              </Tabs>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="targetJobRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Job Role (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Software Engineer"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="additionalInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Info (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., transitioning from another industry"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : 'Get Feedback'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || result) && (
        <Card>
          <CardHeader>
            <CardTitle>Your Resume Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="feedback">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
                <TabsTrigger value="rewritten">Rewritten Resume</TabsTrigger>
              </TabsList>
              <TabsContent value="feedback" className="mt-4">
                {isLoading ? (
                  <div className="space-y-4 pt-4">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/4 mt-4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                ) : (
                  result && (
                    <div
                      className="prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: result.feedback.replace(/\\n/g, '<br />'),
                      }}
                    />
                  )
                )}
              </TabsContent>
              <TabsContent value="rewritten" className="mt-4">
                {isLoading && !result ? (
                  <div className="border rounded-lg"><Skeleton className="h-[1056px] w-full max-w-[816px] mx-auto" /></div>
                ) : (
                  result?.rewrittenResume && (
                    <div className="space-y-4">
                       <div className="bg-gray-200 p-4 md:p-8 flex justify-center overflow-auto">
                           <div id="resume-preview-content" className="w-full max-w-4xl">
                                <ResumeTemplate resumeData={result.rewrittenResume} />
                           </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                         <Button onClick={handleDownloadDocx} variant="secondary">
                          <FileCode className="mr-2 h-4 w-4" />
                          Download as DOCX
                       </Button>
                        <Button onClick={handleDownloadPdf} variant="secondary">
                            <Download className="mr-2 h-4 w-4" />
                            Download as PDF
                        </Button>
                      </div>
                    </div>
                  )
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
`,
  "src/app/tools/settings/page.tsx": `
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application settings.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Configure how you receive notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive emails about new features and updates.
              </p>
            </div>
            <Switch
              id="email-notifications"
              aria-label="Toggle email notifications"
            />
          </div>
           <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get push notifications on your devices.
              </p>
            </div>
            <Switch
              id="push-notifications"
              aria-label="Toggle push notifications"
              disabled
            />
          </div>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>
            Customize the appearance of the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                The application is currently in dark mode.
              </p>
            </div>
            <Switch
              id="dark-mode"
              aria-label="Toggle dark mode"
              checked={true}
              disabled
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
`,
  "src/app/tools/smart-search/page.tsx": `
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleSmartSearchAction } from '@/app/actions';
import type { SmartSearchOutput } from '@/ai/flows/smart-search-tool';
import { FileText, Loader2, UploadCloud } from 'lucide-react';

const formSchema = z.object({
  documentDataUri: z
    .string()
    .min(1, 'Please upload a document.'),
  query: z.string().min(1, 'Please enter a query.'),
});

type FormData = z.infer<typeof formSchema>;

export default function SmartSearchTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SmartSearchOutput | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentDataUri: '',
      query: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 200 * 1024 * 1024) { // 200MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload a document smaller than 200MB."});
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        form.setValue('documentDataUri', dataUri);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleSmartSearchAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: response.error,
      });
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold font-headline">Smart Search</h1>
        <p className="text-muted-foreground">
          Analyze a document for important information using AI.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Analyze Document</CardTitle>
          <CardDescription>
            Upload a document and ask a question about its contents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormItem>
                <FormLabel>Document</FormLabel>
                <FormControl>
                  <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center">
                    {fileName ? (
                      <div className='flex flex-col items-center gap-2'>
                        <FileText className="w-12 h-12 text-primary" />
                        <p className='text-sm font-medium'>{fileName}</p>
                         <Button variant="link" size="sm" asChild className='p-0 h-auto'>
                           <label htmlFor="file-upload" className="cursor-pointer">Change file</label>
                         </Button>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="w-12 h-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          <label htmlFor="file-upload" className="font-semibold text-primary cursor-pointer hover:underline">
                            Click to upload
                          </label>
                           {' '}or drag and drop
                        </p>
                         <p className="text-xs text-muted-foreground">PDF, DOCX, TXT up to 200MB</p>
                      </>
                    )}
                    <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" />
                  </div>
                </FormControl>
                <FormMessage>{form.formState.errors.documentDataUri?.message}</FormMessage>
              </FormItem>

              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Query</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., What are the key takeaways from this document?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading || !form.formState.isValid}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{result.summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
`,
  "src/app/tools/support/page.tsx": `
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, LifeBuoy } from 'lucide-react';

export default function SupportPage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
        title: "Message Sent!",
        description: "Our support team will get back to you shortly."
    });
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Support</h1>
        <p className="text-muted-foreground">
          Get help with any issues or questions you have.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Mail className="w-6 h-6" />
                    Contact Support
                </CardTitle>
                <CardDescription>
                    Fill out the form below and our team will get back to you as soon as possible.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="email">Your Email</Label>
                        <Input id="email" type="email" placeholder="you@example.com" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" placeholder="e.g., Issue with Resume Generator" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" placeholder="Please describe your issue in detail..." rows={6} required/>
                    </div>
                    <Button type="submit">Send Message</Button>
                </form>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <LifeBuoy className="w-6 h-6" />
                   Frequently Asked Questions
                </CardTitle>
                <CardDescription>
                    Find answers to common questions.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-1">
                    <h4 className="font-semibold">How long does generation take?</h4>
                    <p className="text-sm text-muted-foreground">
                        Most tools generate content within 15-30 seconds. Image-heavy tools like the Presentation Generator may take up to a minute.
                    </p>
                </div>
                 <div className="space-y-1">
                    <h4 className="font-semibold">What file types are supported for upload?</h4>
                    <p className="text-sm text-muted-foreground">
                        Most tools support PDF, DOCX, and TXT files. Image tools support PNG, JPG, and GIF.
                    </p>
                </div>
                 <div className="space-y-1">
                    <h4 className="font-semibold">Is my data secure?</h4>
                    <p className="text-sm text-muted-foreground">
                        Yes, we prioritize your data privacy. All uploaded documents are processed securely and are not stored after the generation is complete.
                    </p>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
`,
  "src/app/tools/text-humanizer/page.tsx": `
import TextHumanizerTool from '@/components/tools/text-humanizer-tool';

export default function TextHumanizerPage() {
  return <TextHumanizerTool />;
}
`,
  "src/app/tools/text-to-speech/page.tsx": `
import TextToSpeechTool from '@/components/tools/text-to-speech-tool';

export default function TextToSpeechPage() {
  return <TextToSpeechTool />;
}
`,
  "src/app/tools/thesis-generator/page.tsx": `
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import jsPDF from 'jspdf';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleGenerateAcademicDocumentAction } from '@/app/actions';
import type { GenerateAcademicDocumentOutput } from '@/ai/flows/thesis-generator-tool';
import { Download, FileText, Loader2, UploadCloud } from 'lucide-react';

const formSchema = z.object({
  documentDataUri: z.string().min(1, 'Please upload a document.'),
});

type FormData = z.infer<typeof formSchema>;

export default function ThesisGeneratorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateAcademicDocumentOutput | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentDataUri: '',
    },
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 200 * 1024 * 1024) { // 200MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload a document smaller than 200MB."});
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        form.setValue('documentDataUri', dataUri);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };


  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleGenerateAcademicDocumentAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
      toast({ title: 'Document Generated', description: 'Your academic document has been created successfully.' });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error generating document',
        description: response.error,
      });
    }
  }

  const handleDownloadPdf = () => {
    if (!result) return;
    
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const usableWidth = pageWidth - 2 * margin;
    let y = margin;

    const addText = (text: string, options: any) => {
        const lines = doc.splitTextToSize(text, usableWidth);
        const textHeight = doc.getTextDimensions(lines).h;
        if (y + textHeight > pageHeight - margin) {
            doc.addPage();
            y = margin;
        }
        doc.text(lines, margin, y, options);
        y += textHeight + 5;
    }

    // Title
    doc.setFontSize(22).setFont('helvetica', 'bold');
    addText(result.title, { align: 'center' });
    y += 10;
    
    // Introduction
    doc.setFontSize(16).setFont('helvetica', 'bold');
    addText('Introduction', {});
    doc.setFontSize(12).setFont('helvetica', 'normal');
    addText(result.introduction.replace(/###|##|#/g, ''), {}); // Simple markdown removal
    y += 5;

    // Chapters
    result.chapters.forEach(chapter => {
        doc.setFontSize(16).setFont('helvetica', 'bold');
        addText(chapter.title, {});
        doc.setFontSize(12).setFont('helvetica', 'normal');
        addText(chapter.content.replace(/###|##|#/g, ''), {});
        y += 5;
    });

    // Conclusion
    doc.setFontSize(16).setFont('helvetica', 'bold');
    addText('Conclusion', {});
    doc.setFontSize(12).setFont('helvetica', 'normal');
    addText(result.conclusion.replace(/###|##|#/g, ''), {});

    doc.save(\`\${result.title.replace(/\\s+/g, '_')}.pdf\`);
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Thesis Generator</h1>
        <p className="text-muted-foreground">
          Generate a structured academic document from your outline and research notes.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Generate Document</CardTitle>
          <CardDescription>
            Upload a document containing your structure, topic, and research notes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
               <FormField
                control={form.control}
                name="documentDataUri"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Outline & Notes</FormLabel>
                     <FormControl>
                      <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center h-48">
                        {fileName ? (
                          <div className="flex flex-col items-center gap-2">
                            <FileText className="w-12 h-12 text-primary" />
                            <p className="text-sm font-medium">{fileName}</p>
                            <Button
                              variant="link"
                              size="sm"
                              asChild
                              className="p-0 h-auto"
                            >
                              <label
                                htmlFor="file-upload"
                                className="cursor-pointer"
                              >
                                Change file
                              </label>
                            </Button>
                          </div>
                        ) : (
                          <>
                            <UploadCloud className="w-12 h-12 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">
                              <label
                                htmlFor="file-upload"
                                className="font-semibold text-primary cursor-pointer hover:underline"
                              >
                                Click to upload
                              </label>{' '}
                              or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PDF, DOCX, TXT up to 200MB
                            </p>
                          </>
                        )}
                        <Input
                          id="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.txt"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : 'Generate Document'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Generating Document Content...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
            <Skeleton className="h-6 w-1/2" />
             <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>{result.title}</CardTitle>
            <CardDescription>Your generated document is ready. Review the content below.</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-6">
            <div>
                <h2 className='text-xl font-bold'>Introduction</h2>
                <div dangerouslySetInnerHTML={{ __html: result.introduction.replace(/\\n/g, '<br />') }} />
            </div>
            {result.chapters.map((chapter, index) => (
                <div key={index}>
                    <h2 className='text-xl font-bold'>{chapter.title}</h2>
                    <div dangerouslySetInnerHTML={{ __html: chapter.content.replace(/\\n/g, '<br />') }} />
                </div>
            ))}
             <div>
                <h2 className='text-xl font-bold'>Conclusion</h2>
                <div dangerouslySetInnerHTML={{ __html: result.conclusion.replace(/\\n/g, '<br />') }} />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleDownloadPdf}>
              <Download className="mr-2 h-4 w-4" />
              Download as PDF
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
`,
  "src/app/tools/watermark-remover/page.tsx": `
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { handleRemoveWatermarkAction } from '@/app/actions';
import type { RemoveWatermarkOutput } from '@/ai/flows/watermark-remover-tool';
import { Loader2, UploadCloud } from 'lucide-react';

const formSchema = z.object({
  imageDataUri: z.string().min(1, 'Please upload an image.'),
});

type FormData = z.infer<typeof formSchema>;

export default function WatermarkRemoverTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [result, setResult] = useState<RemoveWatermarkOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageDataUri: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 200 * 1024 * 1024) { // 200MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload an image smaller than 200MB."});
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        form.setValue('imageDataUri', dataUri);
        setOriginalImage(dataUri);
        setResult(null); // Clear previous result
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleRemoveWatermarkAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error removing watermark',
        description: response.error,
      });
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold font-headline">Watermark Remover</h1>
        <p className="text-muted-foreground">
          Upload an image to attempt to remove the watermark using AI.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
          <CardDescription>
            Choose an image file with a watermark to process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormItem>
                <FormLabel>Image File</FormLabel>
                <FormControl>
                    <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center h-64">
                    {originalImage ? (
                      <Image src={originalImage} alt="Image preview" layout="fill" objectFit="contain" className="rounded-md" />
                    ) : (
                      <>
                        <UploadCloud className="w-12 h-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          <label htmlFor="file-upload" className="font-semibold text-primary cursor-pointer hover:underline">
                             Upload an image
                          </label>
                        </p>
                        <Input id="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                         <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 200MB</p>
                      </>
                    )}
                  </div>
                </FormControl>
                <FormMessage>{form.formState.errors.imageDataUri?.message}</FormMessage>
              </FormItem>
              <Button type="submit" disabled={isLoading || !originalImage}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Processing...' : 'Remove Watermark'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || result) && (
        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className="space-y-2">
                <h3 className="text-center font-semibold">Original</h3>
                {originalImage && (
                    <div className="aspect-square w-full relative">
                        <Image src={originalImage} alt="Original image" layout="fill" objectFit="contain" className="rounded-lg border" />
                    </div>
                )}
              </div>
              <div className="space-y-2">
                <h3 className="text-center font-semibold">Processed</h3>
                {isLoading ? (
                  <Skeleton className="aspect-square w-full rounded-lg" />
                ) : (
                  result && (
                     <div className="aspect-square w-full relative">
                        <Image src={result.processedImageUrl} alt="Processed image" layout="fill" objectFit="contain" className="rounded-lg border" />
                    </div>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
`,
  "src/components/app-logo.tsx": `
import type { SVGProps } from 'react';

export function AppLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
    </svg>
  );
}
`,
  "src/components/resume-template.tsx": `
'use client';
import React from 'react';
import { Phone, Mail, MapPin, Linkedin, Github, Briefcase, Star, Award, TrendingUp, Users, Target, Percent, Check, Zap, Building, GraduationCap, Mountain, Link } from 'lucide-react';
import { cn } from '@/lib/utils';


interface ResumeData {
  name: string;
  title: string;
  contact: {
    phone?: string;
    email?: string;
    linkedin?: string;
    github?: string;
    location?: string;
  };
  summary: string;
  experience: {
    title: string;
    company: string;
    location?: string;
    dates: string;
    bullets: string[];
  }[];
  education: {
    degree: string;
    school: string;
    location?: string;
    dates: string;
  }[];
  projects: {
    title: string;
    description: string;
    link?: string;
  }[];
  skills: string[];
  keyAchievements: {
    title: string;
    description: string;
  }[];
  training: {
    title:string;
    description: string;
  }[];
}

const SidebarSection: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <section className={cn('mb-4', className)}>
        <h2 className="text-[9px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-500 pb-1 mb-2">{title}</h2>
        {children}
    </section>
);

const MainSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-4">
        <h2 className="text-[9px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-300 pb-1 mb-2">{title}</h2>
        {children}
    </section>
);

const achievementIcons: { [key: string]: React.FC<any> } = {
    'engagement': Target,
    'cost': Percent,
    'conversions': Check,
    'leadership': Users,
    'default': Star,
};

const getAchievementIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('engagement')) return achievementIcons['engagement'];
    if (lowerTitle.includes('cost')) return achievementIcons['cost'];
    if (lowerTitle.includes('conversion')) return achievementIcons['conversions'];
    if (lowerTitle.includes('leadership')) return achievementIcons['leadership'];
    return achievementIcons['default'];
};


export const ResumeTemplate: React.FC<{ resumeData: ResumeData }> = ({ resumeData }) => {
    if (!resumeData) {
        return <div className="p-12 text-center text-black">Loading resume data...</div>;
    }

    const { name, title, contact, summary, experience, education, projects, skills, keyAchievements, training } = resumeData;

    return (
        <div className="bg-white flex font-sans text-black" style={{ width: '816px', minHeight: '1056px' }}>
            {/* Sidebar (Left Column) */}
            <aside className="w-[35%] bg-[#0d243c] text-white p-6 flex flex-col" style={{fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'}}>
                 <div className="text-left mb-6">
                    <h1 className="text-3xl font-bold tracking-tight text-white uppercase">{name}</h1>
                </div>

                {projects?.length > 0 && (
                    <SidebarSection title="Projects">
                        <div className="space-y-3">
                            {projects.map((proj, i) => (
                                <div key={i}>
                                    <h3 className="font-bold text-sm text-white">{proj.title}</h3>
                                    <p className="text-xs text-gray-300 mt-1 leading-snug">{proj.description}</p>
                                    {proj.link && <a href={proj.link} className="text-xs text-blue-300 break-all mt-1 block">{proj.link}</a>}
                                </div>
                            ))}
                        </div>
                    </SidebarSection>
                )}

                {keyAchievements?.length > 0 && (
                    <SidebarSection title="Key Achievements">
                         <div className="space-y-3">
                            {keyAchievements.map((ach, i) => {
                                const Icon = getAchievementIcon(ach.title);
                                return (
                                <div key={i} className="flex items-start gap-3">
                                    <Icon className="w-4 h-4 text-white mt-0.5 shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-sm text-white leading-tight">{ach.title}</h3>
                                        <p className="text-xs text-gray-300 mt-1 leading-snug">{ach.description}</p>
                                    </div>
                                </div>
                            )})}
                        </div>
                    </SidebarSection>
                )}

                {skills?.length > 0 && (
                     <SidebarSection title="Skills">
                        <p className="text-xs text-gray-300 leading-relaxed">
                          {skills.join(', ')}
                        </p>
                    </SidebarSection>
                )}

                {training?.length > 0 && (
                    <SidebarSection title="Training / Courses">
                        <div className="space-y-2">
                        {training.map((course, i) => (
                            <div key={i}>
                                <h3 className="font-semibold text-sm text-white">{course.title}</h3>
                                <p className="text-xs text-gray-300 mt-1">{course.description}</p>
                            </div>
                        ))}
                        </div>
                    </SidebarSection>
                )}
            </aside>

            {/* Main Content (Right Column) */}
            <main className="w-[65%] bg-white p-6 text-gray-800" style={{fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'}}>
                <header className="mb-4 text-left">
                    <h2 className="text-lg font-semibold text-gray-700 tracking-wider">{title}</h2>
                    <div className="text-xs text-gray-500 flex items-center flex-wrap gap-x-3 gap-y-1 mt-1">
                        {contact?.phone && <span className="flex items-center gap-1.5"><Phone className="w-3 h-3"/>{contact.phone}</span>}
                        {contact?.email && <span className="flex items-center gap-1.5"><Mail className="w-3 h-3"/>{contact.email}</span>}
                        {contact?.linkedin && <span className="flex items-center gap-1.5"><Linkedin className="w-3 h-3"/>{contact.linkedin}</span>}
                        {contact?.location && <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3"/>{contact.location}</span>}
                    </div>
                </header>

                {summary && (
                    <MainSection title="Summary">
                        <p className="text-xs text-gray-700 leading-relaxed">{summary}</p>
                    </MainSection>
                )}

                {experience?.length > 0 && (
                    <MainSection title="Experience">
                        <div className="space-y-4">
                            {experience.map((exp, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline mb-1">
                                       <h3 className="text-sm font-bold text-gray-800">{exp.title}</h3>
                                       <p className="text-xs text-gray-500 font-medium text-right">{exp.dates}</p>
                                    </div>
                                     <div className="flex justify-between items-baseline mb-1">
                                       <p className="text-sm font-semibold text-blue-600">{exp.company}</p>
                                       <p className="text-xs text-gray-500 font-medium text-right">{exp.location}</p>
                                    </div>
                                    <ul className="space-y-1 list-disc pl-3.5 text-xs text-gray-700 leading-relaxed">
                                        {exp.bullets.map((bullet, j) => <li key={j} className="pl-1">{bullet}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </MainSection>
                )}
                
                 {education?.length > 0 && (
                     <MainSection title="Education">
                         <div className="space-y-3">
                            {education.map((edu, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="text-sm font-bold text-gray-800">{edu.degree}</h3>
                                         <p className="text-xs text-gray-500 font-medium text-right">{edu.dates}</p>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <p className="text-sm font-semibold text-blue-600">{edu.school}</p>
                                        <p className="text-xs text-gray-500 font-medium text-right">{edu.location}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </MainSection>
                )}
            </main>
        </div>
    );
};
`,
  "src/components/tools/ai-explanation-tool.tsx": `
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleExplainTopicAction } from '@/app/actions';
import type { ExplainTopicOutput } from '@/ai/flows/ai-explanation-tool';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  topic: z
    .string()
    .min(10, 'Please enter a topic with at least 10 characters.'),
});

type FormData = z.infer<typeof formSchema>;

export default function AiExplanationTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ExplainTopicOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleExplainTopicAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: response.error,
      });
    }
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">AI Explanation</h1>
        <p className="text-muted-foreground">Get clear and concise explanations for complex topics.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Explain a Topic</CardTitle>
          <CardDescription>
            Enter a topic below and let our AI provide a detailed explanation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Explain the theory of relativity"
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Generating...' : 'Explain'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Explanation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Explanation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none whitespace-pre-wrap">
              {result.explanation}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
`,
  "src/components/tools/career-path-suggester-tool.tsx": `
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { handleSuggestCareerPathsAction } from '@/app/actions';
import type { SuggestCareerPathsOutput } from '@/ai/flows/career-path-suggester-tool';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  interests: z.string().min(10, 'Please describe your interests in at least 10 characters.'),
  skills: z.string().min(10, 'Please describe your skills in at least 10 characters.'),
});

type FormData = z.infer<typeof formSchema>;

export default function CareerPathSuggesterTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SuggestCareerPathsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: '',
      skills: '',
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleSuggestCareerPathsAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error suggesting careers',
        description: response.error,
      });
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold font-headline">Career Path Suggester</h1>
        <p className="text-muted-foreground">Get personalized career suggestions based on your interests and skills.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Find Your Career Path</CardTitle>
          <CardDescription>
            Tell us about what you enjoy and what you're good at, and we'll suggest some career paths for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Interests & Passions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., I love creative writing, playing strategy games, and learning about new technologies..."
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Skills & Experience</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., I have 3 years of experience in customer support, am proficient in Microsoft Excel, and a fast learner..."
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Suggesting...' : 'Suggest Careers'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Suggested Career Paths</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      )}

      {result && result.careerPaths.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Suggested Career Paths</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {result.careerPaths.map((path, index) => (
                <AccordionItem value={\`item-\${index}\`} key={index}>
                  <AccordionTrigger>{path.title}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">{path.description}</p>
                      <div>
                        <h4 className="font-semibold mb-2">Required Skills:</h4>
                        <div className="flex flex-wrap gap-2">
                          {path.requiredSkills.map((skill) => (
                            <Badge key={skill} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
`,
  "src/components/tools/code-analyzer-tool.tsx": `
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { handleAnalyzeCodeAction } from '@/app/actions';
import type { AnalyzeCodeOutput } from '@/ai/flows/code-analyzer-tool';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  code: z.string().min(20, 'Please enter at least 20 characters of code.'),
  language: z.string().min(1, 'Please specify the programming language.'),
  constraints: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CodeAnalyzerTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeCodeOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      language: '',
      constraints: '',
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleAnalyzeCodeAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: response.error,
      });
    }
  }

  return (
    <div className="space-y-6">
       <header className="space-y-1">
        <h1 className="text-3xl font-bold font-headline">Code Analyzer</h1>
        <p className="text-muted-foreground">Find errors, performance issues, and security vulnerabilities in your code.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Analyze Code</CardTitle>
          <CardDescription>
            Paste your code, specify the language, and get a detailed analysis report.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your code here..."
                        {...field}
                        rows={10}
                        className="font-mono"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Programming Language</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., JavaScript" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="constraints"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Constraints (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., max memory 256MB" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Analyzing...' : 'Analyze Code'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Report</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm text-muted-foreground">
              <code className="text-foreground whitespace-pre-wrap">{result.report}</code>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
`,
  "src/components/tools/code-generator-tool.tsx": `
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { handleGenerateCodeAction } from '@/app/actions';
import type { GenerateCodeOutput } from '@/ai/flows/code-generator-tool';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  instructions: z
    .string()
    .min(20, 'Please provide detailed instructions (at least 20 characters).'),
  constraints: z
    .object({
      language: z.string().optional(),
      frameworks: z.string().optional(),
      libraries: z.string().optional(),
    })
    .optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CodeGeneratorTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateCodeOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      instructions: '',
      constraints: {
        language: '',
        frameworks: '',
        libraries: '',
      },
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleGenerateCodeAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: response.error,
      });
    }
  }

  return (
    <div className="space-y-6">
       <header className="space-y-1">
        <h1 className="text-3xl font-bold font-headline">Code Generator</h1>
        <p className="text-muted-foreground">Generate code snippets in any language from a text description.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Generate Code</CardTitle>
          <CardDescription>
            Provide instructions and constraints to generate the code you need.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructions & Specifications</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Create a React component that fetches and displays a list of users..."
                        {...field}
                        rows={6}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <h3 className="text-lg font-medium mb-2">
                  Constraints (Optional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="constraints.language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., TypeScript" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="constraints.frameworks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frameworks</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Next.js" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="constraints.libraries"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Libraries</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Tailwind CSS" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Generating...' : 'Generate Code'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Code</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
              <code className="text-foreground whitespace-pre-wrap">{result.code}</code>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
`,
  "src/components/tools/cover-letter-assistant-tool.tsx": `
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleGenerateCoverLetterAction } from '@/app/actions';
import type { GenerateCoverLetterOutput } from '@/ai/flows/cover-letter-assistant-tool';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  jobDescription: z.string().min(50, 'Please enter a job description of at least 50 characters.'),
  userInfo: z.string().min(50, 'Please provide your information of at least 50 characters.'),
  tone: z.enum(['Professional', 'Enthusiastic', 'Formal', 'Creative']),
});

type FormData = z.infer<typeof formSchema>;

export default function CoverLetterAssistantTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateCoverLetterOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobDescription: '',
      userInfo: '',
      tone: 'Professional',
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleGenerateCoverLetterAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error generating cover letter',
        description: response.error,
      });
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold font-headline">Cover Letter Assistant</h1>
        <p className="text-muted-foreground">Generate a tailored cover letter for any job application.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Generate a Cover Letter</CardTitle>
          <CardDescription>
            Provide the job description and your information, then choose a tone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="jobDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste the job description here..."
                        {...field}
                        rows={8}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Information</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your resume or provide key skills and experiences..."
                        {...field}
                        rows={8}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a tone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Professional">Professional</SelectItem>
                        <SelectItem value="Enthusiastic">Enthusiastic</SelectItem>
                        <SelectItem value="Formal">Formal</SelectItem>
                        <SelectItem value="Creative">Creative</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Generating...' : 'Generate Letter'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Cover Letter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Cover Letter</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-invert max-w-none whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: result.coverLetter.replace(/\\n/g, '<br />') }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
`,
  "src/components/tools/diagram-generator-tool.tsx": `
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleGenerateDiagramAction } from '@/app/actions';
import type { GenerateDiagramOutput } from '@/ai/flows/diagram-generator-tool';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  description: z.string().min(10, 'Please enter a description of at least 10 characters.'),
});

type FormData = z.infer<typeof formSchema>;

export default function DiagramGeneratorTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateDiagramOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleGenerateDiagramAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error generating diagram',
        description: response.error,
      });
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold font-headline">Diagram Generator</h1>
        <p className="text-muted-foreground">Create diagrams and flowcharts from a text description.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Generate a Diagram</CardTitle>
          <CardDescription>
            Describe the diagram you want to create, including nodes, connections, and labels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diagram Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., A simple flowchart with a start node, a decision node 'Is it sunny?', and two end nodes 'Go to beach' and 'Stay home'."
                        {...field}
                        rows={6}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Generating...' : 'Generate Diagram'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || result) && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Diagram</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6">
            {isLoading && !result ? (
              <Skeleton className="w-full h-96 rounded-lg" />
            ) : result ? (
              <Image
                src={result.diagramUrl}
                alt="Generated diagram"
                width={1024}
                height={1024}
                className="rounded-lg border object-contain"
              />
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
`,
  "src/components/tools/image-text-manipulation-tool.tsx": `
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { handleManipulateImageTextAction } from '@/app/actions';
import type { ManipulateImageTextOutput } from '@/ai/flows/image-text-manipulation-tool';
import { Loader2, UploadCloud } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  imageDataUri: z.string().min(1, 'Please upload an image.'),
  instructions: z.string().min(1, 'Please provide instructions.'),
});

type FormData = z.infer<typeof formSchema>;

export default function ImageTextManipulationTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [result, setResult] = useState<ManipulateImageTextOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageDataUri: '',
      instructions: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 200 * 1024 * 1024) { // 200MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload an image smaller than 200MB."});
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        form.setValue('imageDataUri', dataUri);
        setOriginalImage(dataUri);
        setResult(null); // Clear previous result
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleManipulateImageTextAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error manipulating image text',
        description: response.error,
      });
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold font-headline">Image Text Manipulation</h1>
        <p className="text-muted-foreground">Edit text directly within an image using AI.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Manipulate Image Text</CardTitle>
          <CardDescription>
            Upload an image containing text and tell the AI what changes to make.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <FormItem>
                        <FormLabel>Image File</FormLabel>
                        <FormControl>
                            <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center h-[265px]">
                            {originalImage ? (
                            <Image src={originalImage} alt="Image preview" layout="fill" objectFit="contain" className="rounded-md" />
                            ) : (
                            <>
                                <UploadCloud className="w-12 h-12 text-muted-foreground" />
                                <p className="mt-2 text-sm text-muted-foreground">
                                <label htmlFor="file-upload" className="font-semibold text-primary cursor-pointer hover:underline">
                                    Upload an image
                                </label>
                                </p>
                                <Input id="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 200MB</p>
                            </>
                            )}
                        </div>
                        </FormControl>
                        <FormMessage>{form.formState.errors.imageDataUri?.message}</FormMessage>
                    </FormItem>
                    <FormField
                        control={form.control}
                        name="instructions"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Instructions</FormLabel>
                            <FormControl>
                            <Textarea
                                placeholder="e.g., 'Change the title to \`Hello World\` and make the subtitle blue.'"
                                {...field}
                                rows={10}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
              <Button type="submit" disabled={isLoading || !originalImage}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Processing...' : 'Manipulate Text'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || result) && (
        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
           <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className="space-y-2">
                <h3 className="text-center font-semibold">Original</h3>
                {originalImage && (
                    <div className="aspect-square w-full relative">
                        <Image src={originalImage} alt="Original image" layout="fill" objectFit="contain" className="rounded-lg border" />
                    </div>
                )}
              </div>
              <div className="space-y-2">
                <h3 className="text-center font-semibold">Processed</h3>
                {isLoading ? (
                  <Skeleton className="aspect-square w-full rounded-lg" />
                ) : (
                  result && (
                     <div className="aspect-square w-full relative">
                        <Image src={result.processedImageUrl} alt="Processed image" layout="fill" objectFit="contain" className="rounded-lg border" />
                    </div>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
`,
  "src/components/tools/interview-question-generator-tool.tsx": `
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { handleGenerateInterviewQuestionsAction } from '@/app/actions';
import type { GenerateInterviewQuestionsInput, GenerateInterviewQuestionsOutput } from '@/ai/flows/interview-question-generator-tool';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  topic: z.string().min(1, 'Please enter a job role or topic.'),
  count: z.coerce.number().int().positive().min(1, "Must be at least 1").max(20, "Cannot exceed 20"),
  category: z.enum(['Technical', 'Behavioral', 'Situational', 'Brain-Teaser']),
});

type FormData = z.infer<typeof formSchema>;

export default function InterviewQuestionGeneratorTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateInterviewQuestionsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      count: 5,
      category: 'Technical',
    },
  });

  async function onSubmit(data: GenerateInterviewQuestionsInput) {
    setIsLoading(true);
    setResult(null);
    const response = await handleGenerateInterviewQuestionsAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: response.error,
      });
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold font-headline">Interview Question Generator</h1>
        <p className="text-muted-foreground">
          Generate tailored interview questions for any role or topic.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Generate Questions</CardTitle>
          <CardDescription>
            Specify the role, number of questions, and category to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Role / Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Senior Product Manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Questions</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Technical">Technical</SelectItem>
                          <SelectItem value="Behavioral">Behavioral</SelectItem>
                          <SelectItem value="Situational">Situational</SelectItem>
                          <SelectItem value="Brain-Teaser">Brain-Teaser</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Generating...' : 'Generate Questions'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      )}

      {result && result.questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {result.questions.map((q, index) => (
                <AccordionItem value={\`item-\${index}\`} key={index}>
                  <AccordionTrigger>{index + 1}. {q.question}</AccordionTrigger>
                  <AccordionContent>
                    <div className="prose prose-invert max-w-none">
                      <p className="font-semibold">Expected Answer:</p>
                      <p>{q.expectedAnswer}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
`,
  "src/components/tools/linkedin-visuals-generator-tool.tsx": `
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { saveAs } from 'file-saver';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { handleGenerateLinkedInVisualsAction } from '@/app/actions';
import type { GenerateLinkedInVisualsInput, GenerateLinkedInVisualsOutput } from '@/ai/flows/linkedin-visuals-generator-tool';
import { Download, FileText, Loader2, UploadCloud } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  resumeDataUri: z.string().optional(),
  resumeText: z.string().optional(),
  userPhotoUri: z.string().optional(),
}).refine(data => !!data.resumeDataUri || !!data.resumeText, {
    message: 'Please either upload a resume or enter text manually.',
    path: ['resumeDataUri'],
});

type FormData = z.infer<typeof formSchema>;

export default function LinkedInVisualsGeneratorTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateLinkedInVisualsOutput | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeDataUri: '',
      resumeText: '',
      userPhotoUri: '',
    },
  });

  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 200 * 1024 * 1024) { // 200MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload a resume smaller than 200MB."});
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        form.setValue('resumeDataUri', dataUri);
        form.setValue('resumeText', ''); // Clear text input if file is uploaded
        setResumeFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 200 * 1024 * 1024) { // 200MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload an image smaller than 200MB."});
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        form.setValue('userPhotoUri', dataUri);
        setPhotoPreview(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleDownload = (url: string, filename: string) => {
    saveAs(url, filename);
    toast({
      title: 'Download Started',
      description: \`\${filename} is downloading.\`,
    });
  };

  async function onSubmit(data: GenerateLinkedInVisualsInput) {
    setIsLoading(true);
    setResult(null);
    const response = await handleGenerateLinkedInVisualsAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error generating visuals',
        description: response.error,
      });
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold font-headline">LinkedIn Visuals Generator</h1>
        <p className="text-muted-foreground">
          Create a professional profile picture and cover banner for your LinkedIn profile.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Generate Visuals</CardTitle>
          <CardDescription>
            Provide your resume for context and optionally upload a photo to use as a base.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload">Upload Resume</TabsTrigger>
                        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload" className="mt-4">
                        <FormItem>
                            <FormLabel>Your Resume</FormLabel>
                            <FormControl>
                                <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center h-[265px]">
                                {resumeFileName ? (
                                    <div className='flex flex-col items-center gap-2'>
                                    <FileText className="w-12 h-12 text-primary" />
                                    <p className='text-sm font-medium'>{resumeFileName}</p>
                                    <Button variant="link" size="sm" asChild className='p-0 h-auto'>
                                        <label htmlFor="resume-upload" className="cursor-pointer">Change file</label>
                                    </Button>
                                    </div>
                                ) : (
                                    <>
                                    <UploadCloud className="w-12 h-12 text-muted-foreground" />
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        <label htmlFor="resume-upload" className="font-semibold text-primary cursor-pointer hover:underline">
                                        Click to upload
                                        </label>
                                    </p>
                                    <p className="text-xs text-muted-foreground">PDF, DOCX, TXT up to 200MB</p>
                                    </>
                                )}
                                <Input id="resume-upload" type="file" className="sr-only" onChange={handleResumeFileChange} accept=".pdf,.doc,.docx,.txt"/>
                                </div>
                            </FormControl>
                             <FormMessage>{form.formState.errors.resumeDataUri?.message}</FormMessage>
                        </FormItem>
                    </TabsContent>
                    <TabsContent value="manual" className="mt-4">
                        <FormField
                            control={form.control}
                            name="resumeText"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Paste Resume Content</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Paste your resume content here..."
                                            {...field}
                                            rows={12}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                form.setValue('resumeDataUri', '');
                                                setResumeFileName(null);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </TabsContent>
                </Tabs>
                
                <FormItem>
                  <FormLabel>Your Photo (Optional)</FormLabel>
                   <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center h-[265px]">
                    {photoPreview ? (
                      <Image src={photoPreview} alt="Image preview" layout="fill" objectFit="contain" className="rounded-md" />
                    ) : (
                      <>
                        <UploadCloud className="w-12 h-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          <label htmlFor="photo-upload" className="font-semibold text-primary cursor-pointer hover:underline">
                             Upload a headshot
                          </label>
                        </p>
                        <Input id="photo-upload" type="file" accept="image/*" className="sr-only" onChange={handlePhotoFileChange} />
                         <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 200MB</p>
                      </>
                    )}
                  </div>
                </FormItem>

              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Generating...' : 'Generate Visuals'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || result) && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Visuals</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-4">
                <h3 className="font-semibold text-center font-headline">Profile Picture</h3>
                <div className="flex justify-center">
                    {isLoading && !result ? <Skeleton className="w-48 h-48 rounded-full" /> : null}
                    {result?.profilePictureUrl && (
                        <div className="flex flex-col items-center gap-4">
                            <Image src={result.profilePictureUrl} alt="Generated profile picture" width={192} height={192} className="rounded-full border" />
                            <Button onClick={() => handleDownload(result.profilePictureUrl, 'profile-picture.png')}>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                            </Button>
                        </div>
                    )}
                </div>
             </div>
             <div className="space-y-4">
                <h3 className="font-semibold text-center font-headline">Cover Banner</h3>
                 {isLoading && !result ? <Skeleton className="w-full aspect-[4/1] rounded-lg" /> : null}
                 {result?.coverBannerUrl && (
                    <div className="flex flex-col items-center gap-4">
                        <Image src={result.coverBannerUrl} alt="Generated cover banner" width={1584} height={396} className="rounded-lg border aspect-[4/1] object-cover" />
                        <Button onClick={() => handleDownload(result.coverBannerUrl, 'cover-banner.png')}>
                           <Download className="mr-2 h-4 w-4" />
                            Download
                        </Button>
                    </div>
                 )}
             </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
`,
  "src/components/tools/portfolio-generator-tool.tsx": `
'use client';

import React, { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleGeneratePortfolioWebsiteAction } from '@/app/actions';
import type { GeneratePortfolioWebsiteOutput, GeneratePortfolioWebsiteInput } from '@/ai/flows/portfolio-generator-tool';
import { Copy, Download, FileArchive, FileText, Loader2, Plus, Trash2, UploadCloud } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const portfolioSchema = z.object({
    name: z.string().min(1, "Name is required."),
    headline: z.string().min(1, "Headline is required."),
    profession: z.string().min(1, "Profession is required."),
    contact: z.object({
        email: z.string().email("Invalid email address."),
        phone: z.string().optional(),
        linkedin: z.string().optional(),
        github: z.string().optional(),
        socials: z.array(z.object({
            network: z.string(),
            url: z.string().url().or(z.literal('')),
        })).optional(),
    }),
    about: z.string().min(20, "About section should be at least 20 characters."),
    experience: z.array(z.object({
        title: z.string().min(1, "Title is required."),
        company: z.string().min(1, "Company is required."),
        dates: z.string().min(1, "Dates are required."),
        description: z.string().min(1, "Description is required."),
    })),
    education: z.array(z.object({
        degree: z.string().min(1, "Degree is required."),
        school: z.string().min(1, "School is required."),
        dates: z.string().min(1, "Dates are required."),
    })),
    projects: z.array(z.object({
        title: z.string().min(1, "Title is required."),
        description: z.string().min(1, "Description is required."),
        link: z.string().url("Invalid URL.").optional().or(z.literal('')),
        imageUrl: z.string().url("Invalid URL.").optional().or(z.literal('')),
    })),
    skills: z.array(z.string().min(1)).min(1, "At least one skill is required."),
    achievements: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof portfolioSchema>;

export default function PortfolioGeneratorTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeneratePortfolioWebsiteOutput | null>(null);
  const { toast } = useToast();
  const [resumeDataUri, setResumeDataUri] = useState<string | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [certificateDataUri, setCertificateDataUri] = useState<string | null>(null);
  const [certificateFileName, setCertificateFileName] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
        name: '',
        headline: '',
        profession: '',
        contact: { email: '', socials: [{ network: 'LinkedIn', url: '' }, { network: 'GitHub', url: '' }] },
        about: '',
        experience: [{ title: '', company: '', dates: '', description: '' }],
        education: [{ degree: '', school: '', dates: '' }],
        projects: [{ title: '', description: '', link: '', imageUrl: '' }],
        skills: [],
        achievements: [],
    },
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control: form.control, name: "experience" });
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control: form.control, name: "education" });
  const { fields: projFields, append: appendProj, remove: removeProj } = useFieldArray({ control: form.control, name: "projects" });
  const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({ control: form.control, name: "contact.socials" });

  async function onManualSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleGeneratePortfolioWebsiteAction({ type: 'manual', data });
    setIsLoading(false);

    if (response.success && response.data) {
      setResult(response.data);
      toast({ title: 'Website Generated!', description: 'Your portfolio has been successfully generated.' });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Generating Website',
        description: response.error,
      });
    }
  }

  const onResumeSubmit = async () => {
    if (!resumeDataUri) {
        toast({ variant: 'destructive', title: 'No Resume Provided', description: 'Please upload a resume.' });
        return;
    }
    setIsLoading(true);
    setResult(null);
    const response = await handleGeneratePortfolioWebsiteAction({ type: 'resume', resumeDataUri, certificateDataUri });
    setIsLoading(false);

    if (response.success && response.data) {
      setResult(response.data);
      toast({ title: 'Website Generated!', description: 'Your portfolio has been successfully generated from the provided resume.' });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Generating Website',
        description: response.error,
      });
    }
  };
  
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: \`\${type} Copied!\`,
      description: \`The \${type.toLowerCase()} code has been copied to your clipboard.\`,
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
      description: \`Your portfolio website is being downloaded as a zip file.\`,
    });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFileName: React.Dispatch<React.SetStateAction<string | null>>,
    setDataUri: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 200 * 1024 * 1024) { // 200MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload a document smaller than 200MB."});
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = async (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        setDataUri(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold font-headline">Portfolio Website Generator</h1>
        <p className="text-muted-foreground">
          Generate a website from your resume, or by filling out the form manually.
        </p>
      </header>
      
      <Card>
        <CardHeader>
            <CardTitle>Create Your Portfolio</CardTitle>
            <CardDescription>Choose your preferred method to get started.</CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="auto-generate">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="auto-generate">From Resume</TabsTrigger>
                    <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                </TabsList>
                <TabsContent value="auto-generate" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>1. Upload Resume</Label>
                            <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center h-48">
                                {resumeFileName ? (
                                    <div className='flex flex-col items-center gap-2'>
                                        <FileText className="w-12 h-12 text-primary" />
                                        <p className='text-sm font-medium'>{resumeFileName}</p>
                                        <Button variant="link" size="sm" asChild className='p-0 h-auto'>
                                            <label htmlFor="resume-upload" className="cursor-pointer">Change file</label>
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <UploadCloud className="w-12 h-12 text-muted-foreground" />
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            <label htmlFor="resume-upload" className="font-semibold text-primary cursor-pointer hover:underline">
                                                Upload Resume
                                            </label>
                                        </p>
                                        <p className="text-xs text-muted-foreground">PDF, DOCX, TXT</p>
                                    </>
                                )}
                                <Input id="resume-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e, setResumeFileName, setResumeDataUri)} accept=".pdf,.docx,.txt" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>2. Upload Certificate (Optional)</Label>
                            <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center h-48">
                                {certificateFileName ? (
                                    <div className='flex flex-col items-center gap-2'>
                                        <FileText className="w-12 h-12 text-primary" />
                                        <p className='text-sm font-medium'>{certificateFileName}</p>
                                        <Button variant="link" size="sm" asChild className='p-0 h-auto'>
                                            <label htmlFor="cert-upload" className="cursor-pointer">Change file</label>
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <UploadCloud className="w-12 h-12 text-muted-foreground" />
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            <label htmlFor="cert-upload" className="font-semibold text-primary cursor-pointer hover:underline">
                                                Upload Certificate
                                            </label>
                                        </p>
                                        <p className="text-xs text-muted-foreground">Image or PDF</p>
                                    </>
                                )}
                                <Input id="cert-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e, setCertificateFileName, setCertificateDataUri)} accept="image/*,.pdf" />
                            </div>
                        </div>
                    </div>
                     <div className="mt-6">
                        <Button onClick={onResumeSubmit} disabled={isLoading || !resumeDataUri}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Generate Website
                        </Button>
                    </div>
                </TabsContent>
                <TabsContent value="manual" className="mt-6">
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onManualSubmit)} className="space-y-8">
                        {/* Personal Details */}
                        <Card>
                            <CardHeader><CardTitle>Personal Details</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField control={form.control} name="name" render={({ field }) => ( <FormItem> <FormLabel>Full Name</FormLabel> <FormControl><Input placeholder="John Doe" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                    <FormField control={form.control} name="headline" render={({ field }) => ( <FormItem> <FormLabel>Headline</FormLabel> <FormControl><Input placeholder="Software Engineer | AI Enthusiast" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                </div>
                                <FormField control={form.control} name="profession" render={({ field }) => ( <FormItem> <FormLabel>Profession</FormLabel> <FormControl><Input placeholder="e.g., Software Engineer" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                 <FormField control={form.control} name="contact.email" render={({ field }) => ( <FormItem> <FormLabel>Email</FormLabel> <FormControl><Input placeholder="your.email@example.com" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                <FormField control={form.control} name="about" render={({ field }) => ( <FormItem> <FormLabel>About Me</FormLabel> <FormControl><Textarea placeholder="A short bio about yourself..." {...field} rows={5} /></FormControl> <FormMessage /> </FormItem> )}/>
                            </CardContent>
                        </Card>

                        {/* Social Links */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Social Links</CardTitle>
                                <Button type="button" variant="outline" size="sm" onClick={() => appendSocial({ network: '', url: '' })}><Plus className="mr-2 h-4 w-4" /> Add Link</Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {socialFields.map((field, index) => (
                                    <div key={field.id} className="flex gap-4 items-end">
                                        <FormField control={form.control} name={\`contact.socials.\${index}.network\`} render={({ field }) => ( <FormItem className="flex-1"> <FormLabel>Network</FormLabel> <FormControl><Input {...field} placeholder="e.g., LinkedIn" /></FormControl> <FormMessage /> </FormItem> )}/>
                                        <FormField control={form.control} name={\`contact.socials.\${index}.url\`} render={({ field }) => ( <FormItem className="flex-1"> <FormLabel>URL</FormLabel> <FormControl><Input {...field} placeholder="https://linkedin.com/in/..." /></FormControl> <FormMessage /> </FormItem> )}/>
                                        <Button type="button" variant="ghost" size="icon" className="h-9 w-9" onClick={() => removeSocial(index)}><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Experience */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Work Experience</CardTitle>
                                <Button type="button" variant="outline" size="sm" onClick={() => appendExp({ title: '', company: '', dates: '', description: '' })}><Plus className="mr-2 h-4 w-4" /> Add Experience</Button>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {expFields.map((field, index) => (
                                    <div key={field.id} className="space-y-4 border p-4 rounded-md relative">
                                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeExp(index)}><Trash2 className="h-4 w-4" /></Button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField control={form.control} name={\`experience.\${index}.title\`} render={({ field }) => ( <FormItem> <FormLabel>Job Title</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                            <FormField control={form.control} name={\`experience.\${index}.company\`} render={({ field }) => ( <FormItem> <FormLabel>Company</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                        </div>
                                        <FormField control={form.control} name={\`experience.\${index}.dates\`} render={({ field }) => ( <FormItem> <FormLabel>Dates</FormLabel> <FormControl><Input {...field} placeholder="e.g., June 2023 - Present" /></FormControl> <FormMessage /> </FormItem> )}/>
                                        <FormField control={form.control} name={\`experience.\${index}.description\`} render={({ field }) => ( <FormItem> <FormLabel>Description</FormLabel> <FormControl><Textarea {...field} rows={4} /></FormControl> <FormMessage /> </FormItem> )}/>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Education */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Education</CardTitle>
                                <Button type="button" variant="outline" size="sm" onClick={() => appendEdu({ degree: '', school: '', dates: '' })}><Plus className="mr-2 h-4 w-4" /> Add Education</Button>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {eduFields.map((field, index) => (
                                    <div key={field.id} className="space-y-4 border p-4 rounded-md relative">
                                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeEdu(index)}><Trash2 className="h-4 w-4" /></Button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField control={form.control} name={\`education.\${index}.degree\`} render={({ field }) => ( <FormItem> <FormLabel>Degree</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                            <FormField control={form.control} name={\`education.\${index}.school\`} render={({ field }) => ( <FormItem> <FormLabel>School/University</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                        </div>
                                        <FormField control={form.control} name={\`education.\${index}.dates\`} render={({ field }) => ( <FormItem> <FormLabel>Dates</FormLabel> <FormControl><Input {...field} placeholder="e.g., 2022 - 2026" /></FormControl> <FormMessage /> </FormItem> )}/>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Projects */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Projects</CardTitle>
                                <Button type="button" variant="outline" size="sm" onClick={() => appendProj({ title: '', description: '', link: '', imageUrl: '' })}><Plus className="mr-2 h-4 w-4" /> Add Project</Button>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {projFields.map((field, index) => (
                                    <div key={field.id} className="space-y-4 border p-4 rounded-md relative">
                                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeProj(index)}><Trash2 className="h-4 w-4" /></Button>
                                        <FormField control={form.control} name={\`projects.\${index}.title\`} render={({ field }) => ( <FormItem> <FormLabel>Project Title</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                        <FormField control={form.control} name={\`projects.\${index}.description\`} render={({ field }) => ( <FormItem> <FormLabel>Description</FormLabel> <FormControl><Textarea {...field} rows={3} /></FormControl> <FormMessage /> </FormItem> )}/>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField control={form.control} name={\`projects.\${index}.link\`} render={({ field }) => ( <FormItem> <FormLabel>Project Link (Optional)</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                            <FormField control={form.control} name={\`projects.\${index}.imageUrl\`} render={({ field }) => ( <FormItem> <FormLabel>Image URL (Optional)</FormLabel> <FormControl><Input {...field} placeholder="https://placehold.co/600x400" /></FormControl> <FormMessage /> </FormItem> )}/>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Skills */}
                        <Card>
                            <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="skills"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Enter your skills, separated by commas</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="e.g., Python, JavaScript, React, AI, Machine Learning"
                                                    onChange={(e) => {
                                                        const skillsArray = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                                        field.onChange(skillsArray);
                                                    }}
                                                    value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                                                    rows={3}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                        
                        {/* Achievements */}
                        <Card>
                            <CardHeader><CardTitle>Achievements</CardTitle></CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="achievements"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Enter your achievements, separated by commas</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="e.g., Won 1st place in hackathon, Published a paper"
                                                    onChange={(e) => {
                                                        const achievementsArray = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                                        field.onChange(achievementsArray);
                                                    }}
                                                    value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                                                    rows={3}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Button type="submit" disabled={isLoading}>
                             {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Generate Website from Form
                        </Button>
                    </form>
                </Form>
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>

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
                result &&
                <Tabs defaultValue="preview">
                    <TabsList>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                        <TabsTrigger value="html">HTML</TabsTrigger>
                        <TabsTrigger value="css">CSS</TabsTrigger>
                        <TabsTrigger value="js">JavaScript</TabsTrigger>
                    </TabsList>
                    <TabsContent value="preview" className="mt-4">
                        <iframe 
                            srcDoc={\`<html><head><style>\${result.css}</style></head><body>\${result.html}<script>\${result.javascript}</script></body></html>\`}
                            className="w-full h-[600px] border rounded-md"
                            title="Portfolio Preview"
                        />
                    </TabsContent>
                    <TabsContent value="html">
                        <CodeBlock 
                          code={result.html} 
                          onCopy={() => copyToClipboard(result.html, 'HTML')} 
                          onDownload={() => downloadFile(result.html, 'index.html', 'text/html')}
                        />
                    </TabsContent>
                     <TabsContent value="css">
                        <CodeBlock 
                          code={result.css} 
                          onCopy={() => copyToClipboard(result.css, 'CSS')}
                          onDownload={() => downloadFile(result.css, 'style.css', 'text/css')}
                        />
                    </TabsContent>
                     <TabsContent value="js">
                        <CodeBlock 
                          code={result.javascript} 
                          onCopy={() => copyToClipboard(result.javascript, 'JavaScript')}
                          onDownload={() => downloadFile(result.javascript, 'script.js', 'text/javascript')}
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
`,
  "src/components/tools/presentation-generator-tool.tsx": `
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import PptxGenJS from 'pptxgenjs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleGeneratePresentationAction } from '@/app/actions';
import type { GeneratePresentationOutput, GeneratePresentationInput } from '@/ai/flows/presentation-generator-tool';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Download, Loader2, Image as ImageIconLucide } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { cn } from '@/lib/utils';
import { Textarea } from '../ui/textarea';
import { RobotsBuildingLoader } from '../ui/robots-building-loader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const formSchema = z.object({
  topic: z.string().min(3, 'Please enter a topic with at least 3 characters.'),
  presenterName: z.string().optional(),
  rollNumber: z.string().optional(),
  department: z.string().optional(),
  numSlides: z.coerce.number().int().min(2, "Must be at least 2 slides.").max(20, "Cannot exceed 20 slides."),
  imageStyle: z.string().optional(),
  language: z.string().optional(),
  contentType: z.enum(['general', 'projectProposal', 'pitchDeck', 'custom']).default('general'),
  customStructure: z.string().optional(),
  style: z.enum(['Default', 'Tech Pitch', 'Creative']).default('Default'),
}).refine(data => {
    if (data.contentType === 'custom') {
        return (data.customStructure || '').trim().length > 10;
    }
    return true;
}, {
    message: "Please provide a custom structure with at least 10 characters.",
    path: ['customStructure'],
});

type FormData = z.infer<typeof formSchema>;

export default function PresentationGeneratorTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeneratePresentationOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: 'AI Mentor: A Suite of AI-Powered Tools',
      presenterName: '',
      rollNumber: '',
      department: '',
      numSlides: 5,
      imageStyle: 'photorealistic',
      language: 'English',
      contentType: 'custom',
      customStructure: \`1. Introduction to AI Mentor
- A suite of AI-powered tools to boost productivity and learning.

2. Analysis Tools
- Smart Search: Analyze documents with natural language queries.
- Document Summarizer: Get quick summaries of long documents.

3. Learning & Writing
- AI Explanation: Understand complex topics easily.
- Thesis Generator: Structure and write academic papers.
- Text Humanizer: Make AI text sound more natural.

4. Development Tools
- Code Generator: Create code from text descriptions.
- Code Analyzer: Find errors and vulnerabilities in code.
- Diagram Generator: Create flowcharts and diagrams from text.

5. Career Tools
- Interview Questions: Prepare for job interviews.
- Resume Feedback: Get AI-powered resume reviews.
- Portfolio Generator: Create a personal portfolio website.
- Cover Letter Assistant: Draft tailored cover letters.
- Career Path Suggester: Discover potential career paths.
- LinkedIn Visuals: Generate professional profile pictures and banners.

6. Productivity & Media
- Presentation Generator: Create presentations from a topic.
- Text to Speech: Convert text into audio.
- Watermark Remover: Remove watermarks from images.
- Image Text Manipulation: Edit text within an image.

7. Conclusion
- Recap of the project's capabilities and future scope.\`,
      style: 'Tech Pitch',
    },
  });

  const contentType = form.watch('contentType');
  const style = form.watch('style');

  React.useEffect(() => {
    if (style === 'Tech Pitch') {
        if (form.getValues('contentType') !== 'pitchDeck') {
          form.setValue('contentType', 'pitchDeck');
        }
    } else if (style === 'Default' || style === 'Creative') {
       if (form.getValues('contentType') === 'pitchDeck') {
         form.setValue('contentType', 'general');
       }
    }
  }, [style, form]);

  React.useEffect(() => {
    if (contentType === 'projectProposal') {
      form.setValue('customStructure', \`1. Introduction
What is the project about?
Why is it important/relevant to field/community?
2. Objectives
Main goals of the project
What you planned to achieve
3. Background / Literature
Short background of the topic
Any references or community issues identified
4. Methodology / Approach
Steps taken in field work
Tools, surveys, techniques used
5. Project Work / Implementation
Activities done
Photographs/figures/observations
6. Results / Findings
What you observed/collected
Data, charts, or key outcomes
7. Discussion / Analysis
What the results mean
Link to community needs/problems
8. Conclusion & Suggestions
Summary of work
Possible improvements, recommendations
9. Acknowledgement\`);
    } else if (form.getValues('customStructure')?.startsWith('1. Introduction')) {
      // Clear if it was the default project proposal text
      form.setValue('customStructure', '');
    }
  }, [contentType, form]);


  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);

    const input: GeneratePresentationInput = {
        topic: data.topic,
        presenterName: data.presenterName,
        rollNumber: data.rollNumber,
        department: data.department,
        contentType: data.contentType,
        numSlides: data.numSlides,
        imageStyle: data.imageStyle,
        language: data.language,
        style: data.style,
    };
    if (data.contentType === 'custom' && data.customStructure) {
        input.customStructure = data.customStructure;
    }

    const response = await handleGeneratePresentationAction(input);
    
    setIsLoading(false);
    if (response.success && response.data) {
        setResult(response.data);
        toast({
            title: "Presentation Generated!",
            description: "Your presentation with text and images is ready.",
        });
    } else {
        toast({
            variant: 'destructive',
            title: 'Error Generating Presentation',
            description: response.error,
        });
    }
  }

 const handleDownload = () => {
    if (!result) return;

    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE';
    
    const { design, backgroundImageUrl } = result;
    const cleanColor = (color: string) => color.startsWith('#') ? color.substring(1) : color;
    
    const masterBackground: PptxGenJS.BackgroundProps = { color: cleanColor(design.backgroundColor) };
    if (backgroundImageUrl && backgroundImageUrl.startsWith('data:image')) {
        masterBackground.path = backgroundImageUrl;
    }

    pptx.defineSlideMaster({
        title: "MASTER_SLIDE",
        background: masterBackground,
        objects: [
            { 'rect':    { x:0.0, y:6.8, w:'100%', h:0.75, fill:{ color: cleanColor(design.accentColor) } } },
            { 'text':    { text:'AI Mentor', options:{ x:0.5, y:6.9, w:5, h:0.5, fontFace:'Arial', fontSize:14, color:cleanColor(design.backgroundColor), bold:true } } },
        ],
    });
    
    // Title Slide
    const titleSlide = pptx.addSlide({ masterName: "MASTER_SLIDE" });
    titleSlide.addText(result.title, { 
        x: 1, y: 2, w: 8, h: 1.5, 
        fontSize: 44, 
        bold: true, 
        color: cleanColor(design.textColor), 
        align: 'center',
        fontFace: 'Helvetica',
        anim: { type: 'fly', options: { direction: 'b', duration: 1, effect: 'def' } }
    });

    const presenterDetails = [
        result.presenterName ? \`Presented by: \${result.presenterName}\` : null,
        result.rollNumber ? \`Roll No: \${result.rollNumber}\` : null,
        result.department ? \`Department: \${result.department}\` : null
    ].filter(Boolean).join('\\n');

    if (presenterDetails) {
        titleSlide.addText(presenterDetails, { 
            x: 1, y: 4, w: 8, h: 1, 
            fontSize: 20, 
            color: cleanColor(design.textColor), 
            align: 'center',
            fontFace: 'Arial',
            anim: { type: 'fly', options: { direction: 'b', duration: 1, delay: 0.5, effect: 'def' } }
        });
    }
    
    const transitions: PptxGenJS.Transition[] = [
        { type: "fade", duration: 1 },
        { type: "push", duration: 1, options: { direction: 'l' } },
        { type: "wipe", duration: 1, options: { direction: 'l' } },
        { type: "cover", duration: 1, options: { direction: 'l' } },
    ];


    // Content Slides
    result.slides.forEach((slide, slideIndex) => {
        if (slide.slideLayout === 'title') return; // Skip the duplicate title slide data

        const contentSlide = pptx.addSlide({ masterName: "MASTER_SLIDE" });
        contentSlide.transition = transitions[slideIndex % transitions.length];
        
        contentSlide.addText(slide.title, { 
            x: 0.5, y: 0.5, w: '90%', h: 1, 
            fontSize: 32, 
            bold: true, 
            color: cleanColor(design.accentColor),
            fontFace: 'Helvetica',
            anim: { type: 'fly', options: { direction: 'l', duration: 0.5, effect: 'def' } }
        });
        
        if (slide.slideLayout === 'contentWithImage') {
            if (slide.content.length > 0) {
                slide.content.forEach((point, index) => {
                    contentSlide.addText(point, {
                        x: 0.5, y: 1.8 + (index * 0.7), w: '55%', h: 0.7,
                        fontSize: 18,
                        color: cleanColor(design.textColor),
                        bullet: true,
                        fontFace: 'Arial',
                        anim: {
                            type: 'fly',
                            options: { direction: 'u', duration: 0.5, delay: 0.75 + (index * 0.25) }
                        }
                    });
                });
            }

            if (slide.imageUrl && slide.imageUrl.startsWith('data:image')) {
                contentSlide.addImage({
                    data: slide.imageUrl,
                    x: '60%', y: 1.5, w: '35%', h: 4.5,
                    sizing: { type: 'contain', w: 3.5, h: 4.5 },
                    anim: { type: 'zoom', options: { scale: 'in', duration: 1, delay: 0.5 } }
                });
            }
             if (slide.logoUrl) {
                contentSlide.addImage({
                    path: slide.logoUrl,
                    x: '90%', y: '90%', w: '8%', h: '8%',
                     sizing: { type: 'contain', w: 0.8, h: 0.8 },
                     anim: { type: 'fade', duration: 1, delay: 1 }
                });
            }
        }
    });

    pptx.writeFile({ fileName: \`\${result.title}.pptx\` });
    toast({ title: 'Download Started', description: \`Your presentation "\${result.title}.pptx" is downloading.\` });
  };


  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold font-headline">Presentation Generator</h1>
        <p className="text-muted-foreground">
          Create a full presentation with text and images from a single topic.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Generate a Presentation</CardTitle>
          <CardDescription>
            Provide a topic and our AI will generate an entire slide deck for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="style"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Presentation Style</FormLabel>
                       <FormDescription>Choose a visual and narrative style for your presentation.</FormDescription>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                          <FormItem>
                            <FormControl>
                               <RadioGroupItem value="Default" id="style-default" className="sr-only peer" />
                            </FormControl>
                            <Label htmlFor="style-default" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                                <span className="font-bold">Default</span>
                                <span className="text-xs text-muted-foreground mt-1 text-center">A clean, professional look for any topic.</span>
                             </Label>
                          </FormItem>
                           <FormItem>
                            <FormControl>
                               <RadioGroupItem value="Tech Pitch" id="style-tech" className="sr-only peer" />
                            </FormControl>
                            <Label htmlFor="style-tech" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                                <span className="font-bold">Tech Pitch</span>
                                <span className="text-xs text-muted-foreground mt-1 text-center">Cinematic, dark theme. Great for pitch decks.</span>
                             </Label>
                          </FormItem>
                           <FormItem>
                            <FormControl>
                               <RadioGroupItem value="Creative" id="style-creative" className="sr-only peer" />
                            </FormControl>
                            <Label htmlFor="style-creative" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                                <span className="font-bold">Creative</span>
                                <span className="text-xs text-muted-foreground mt-1 text-center">Vibrant, light theme with a friendly feel.</span>
                             </Label>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

               <FormField
                  control={form.control}
                  name="contentType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Content Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="general" /></FormControl>
                            <FormLabel className="font-normal">General Topic</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="projectProposal" /></FormControl>
                            <FormLabel className="font-normal">Project Proposal</FormLabel>
                          </FormItem>
                           <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="pitchDeck" disabled={style === 'Tech Pitch'} /></FormControl>
                            <FormLabel className={cn("font-normal", style === 'Tech Pitch' && "text-muted-foreground")}>
                                Pitch Deck {style === 'Tech Pitch' && <span className="text-xs">(Selected by Style)</span>}
                            </FormLabel>
                          </FormItem>
                           <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl><RadioGroupItem value="custom" /></FormControl>
                            <FormLabel className="font-normal">Custom Structure & Content</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Presentation Topic or Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., The Future of Renewable Energy" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {contentType === 'custom' && (
                <FormField
                    control={form.control}
                    name="customStructure"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Custom Structure & Content</FormLabel>
                        <FormDescription>Enter one slide title per line, with notes below each title.</FormDescription>
                        <FormControl>
                            <Textarea
                                placeholder="e.g.,&#10;1. About the Company&#10;Blinkit is an Indian quick-commerce platform...&#10;&#10;2. Founders&#10;Albinder Dhindsa..."
                                {...field}
                                rows={10}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="presenterName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Presenter Name (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Jane Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rollNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Roll No. (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., CS101" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Computer Science" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="numSlides"
                  render={({ field }) => (
                    <FormItem className={cn("transition-opacity", (contentType !== 'general') && "opacity-50")}>
                      <FormLabel>Number of Slides</FormLabel>
                      <FormControl>
                        <Input type="number" min="2" max="20" {...field} disabled={contentType !== 'general'}/>
                      </FormControl>
                       {contentType !== 'general' && <p className="text-xs text-muted-foreground">Determined by content type.</p>}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="imageStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image Style (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., minimalist, cartoon, abstract" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Hindi">Hindi</SelectItem>
                          <SelectItem value="Marathi">Marathi</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Presentation...</> : 'Generate Presentation'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Generating Presentation</CardTitle>
            <CardDescription>The AI is building your presentation. This may take a few moments...</CardDescription>
          </CardHeader>
          <CardContent>
            <RobotsBuildingLoader />
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>{result?.title}</CardTitle>
            <CardDescription>
                Your generated presentation is ready.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Carousel className="w-full">
                <CarouselContent>
                    {result?.slides.map((slide, index) => (
                    <CarouselItem key={index}>
                        <div className="p-1">
                        <Card className="overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-2 h-[500px]">
                                <div className="p-6 flex flex-col">
                                    <Badge variant="outline" className="w-fit mb-4">Slide {index + 1}</Badge>
                                    <h3 className="text-2xl font-bold font-headline mb-4">{slide.title}</h3>
                                    <ul className="space-y-3 list-disc pl-5 text-muted-foreground flex-1">
                                        {slide.content.map((point, i) => <li key={i}>{point}</li>)}
                                    </ul>
                                </div>
                                <div className="bg-muted flex items-center justify-center overflow-hidden relative">
                                    {slide.imageUrl && slide.imageUrl.startsWith('data:image') ? (
                                        <Image
                                            src={slide.imageUrl}
                                            alt={slide.title}
                                            width={500}
                                            height={500}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-destructive">
                                            <ImageIconLucide className="w-16 h-16" />
                                            <p className="mt-2 text-sm font-semibold">Image failed to generate</p>
                                        </div>
                                    )}
                                    {slide.logoUrl && (
                                        <div className="absolute bottom-4 right-4 bg-white/80 p-2 rounded-md">
                                            <Image
                                                src={slide.logoUrl}
                                                alt="Company Logo"
                                                width={60}
                                                height={60}
                                                className="object-contain"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="ml-12" />
                <CarouselNext className="mr-12" />
            </Carousel>
          </CardContent>
          <CardFooter>
            <Button onClick={handleDownload} disabled={isLoading}>
                <Download className="mr-2 h-4 w-4"/>
                Download Presentation
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
`,
  "src/components/tools/resume-feedback-tool.tsx": `
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { saveAs } from 'file-saver';
import { Packer } from 'docx';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { handleGetResumeFeedbackAction } from '@/app/actions';
import type { GetResumeFeedbackOutput } from '@/ai/flows/resume-feedback-tool';
import { FileText, UploadCloud, Download, FileCode, Loader2 } from 'lucide-react';
import { ResumeTemplate } from '@/components/resume-template';
import { createResumeDocx } from '@/lib/docx-generator';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


const formSchema = z.object({
  resume: z.string().min(1, 'Please upload or paste your resume.'),
  targetJobRole: z.string().optional(),
  additionalInfo: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;


export default function ResumeFeedbackTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GetResumeFeedbackOutput | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resume: '',
      targetJobRole: '',
      additionalInfo: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 200 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please upload a document smaller than 200MB.',
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        form.setValue('resume', dataUri);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: FormData) {
    if (!data.resume) {
      form.setError('resume', {
        type: 'manual',
        message: 'Please upload or paste your resume.',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    const response = await handleGetResumeFeedbackAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Analyzing Resume',
        description: response.error,
      });
    }
  }

  const handleDownloadDocx = () => {
    if (!result?.rewrittenResume) return;

    try {
      const doc = createResumeDocx(result.rewrittenResume);
      Packer.toBlob(doc).then(blob => {
        saveAs(blob, 'resume.docx');
        toast({ title: "DOCX Downloaded", description: "Your resume has been saved as a DOCX file." });
      });
    } catch (error) {
       toast({ variant: 'destructive', title: 'Error Generating DOCX', description: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
  };
  
  const handleDownloadPdf = async () => {
    const resumeElement = document.getElementById('resume-preview-content');
    if (!resumeElement) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not find resume content to download.' });
        return;
    }

    try {
        const canvas = await html2canvas(resumeElement, {
            scale: 3, // Higher scale for better quality
            useCORS: true,
            logging: false,
        });
        const imgData = canvas.toDataURL('image/png', 1.0);
        
        // A4 page dimensions in pixels at 96 DPI are roughly 794x1123
        const pdfWidth = 794;
        const pdfHeight = 1123;
        
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: [pdfWidth, pdfHeight],
        });

        const canvasAspectRatio = canvas.width / canvas.height;
        let finalWidth = pdfWidth;
        let finalHeight = finalWidth / canvasAspectRatio;

        if (finalHeight > pdfHeight) {
            finalHeight = pdfHeight;
            finalWidth = finalHeight * canvasAspectRatio;
        }
        
        const x = (pdfWidth - finalWidth) / 2;
        const y = 0;


        pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
        pdf.save('resume.pdf');
        toast({ title: "PDF Downloaded", description: "Your resume has been saved as a PDF file." });
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error Generating PDF', description: error instanceof Error ? error.message : 'An unknown error occurred.' });
    }
};

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Resume Feedback Tool</h1>
        <p className="text-muted-foreground">
          Get AI feedback on your resume, then download a professionally formatted, editable DOCX file.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Analyze Your Resume</CardTitle>
          <CardDescription>
            Upload or paste your resume, then provide some optional context about
            your job search.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="paste">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="paste">Paste Text</TabsTrigger>
                  <TabsTrigger value="upload">Upload File</TabsTrigger>
                </TabsList>
                <TabsContent value="paste" className="mt-4">
                  <FormField
                    control={form.control}
                    name="resume"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Paste your resume content here</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Paste your resume here..."
                            rows={15}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setFileName(null);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="upload" className="mt-4">
                  <FormItem>
                    <FormLabel>Upload Document</FormLabel>
                    <FormControl>
                      <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center h-48">
                        {fileName ? (
                          <div className="flex flex-col items-center gap-2">
                            <FileText className="w-12 h-12 text-primary" />
                            <p className="text-sm font-medium">{fileName}</p>
                            <Button
                              variant="link"
                              size="sm"
                              asChild
                              className="p-0 h-auto"
                            >
                              <label
                                htmlFor="file-upload"
                                className="cursor-pointer"
                              >
                                Change file
                              </label>
                            </Button>
                          </div>
                        ) : (
                          <>
                            <UploadCloud className="w-12 h-12 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">
                              <label
                                htmlFor="file-upload"
                                className="font-semibold text-primary cursor-pointer hover:underline"
                              >
                                Click to upload
                              </label>{' '}
                              or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PDF, TXT up to 200MB
                            </p>
                          </>
                        )}
                        <Input
                          id="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept=".pdf,.txt"
                        />
                      </div>
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.resume?.message}
                    </FormMessage>
                  </FormItem>
                </TabsContent>
              </Tabs>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="targetJobRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Job Role (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Software Engineer"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="additionalInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Info (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., transitioning from another industry"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : 'Get Feedback'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || result) && (
        <Card>
          <CardHeader>
            <CardTitle>Your Resume Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="feedback">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
                <TabsTrigger value="rewritten">Rewritten Resume</TabsTrigger>
              </TabsList>
              <TabsContent value="feedback" className="mt-4">
                {isLoading ? (
                  <div className="space-y-4 pt-4">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/4 mt-4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                ) : (
                  result && (
                    <div
                      className="prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: result.feedback.replace(/\\\\n/g, '<br />'),
                      }}
                    />
                  )
                )}
              </TabsContent>
              <TabsContent value="rewritten" className="mt-4">
                {isLoading && !result ? (
                  <div className="border rounded-lg"><Skeleton className="h-[1056px] w-full max-w-[816px] mx-auto" /></div>
                ) : (
                  result?.rewrittenResume && (
                    <div className="space-y-4">
                       <div className="bg-gray-200 p-4 md:p-8 flex justify-center overflow-auto">
                           <div id="resume-preview-content" className="w-full max-w-4xl">
                                <ResumeTemplate resumeData={result.rewrittenResume} />
                           </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                         <Button onClick={handleDownloadDocx} variant="secondary">
                          <FileCode className="mr-2 h-4 w-4" />
                          Download as DOCX
                       </Button>
                        <Button onClick={handleDownloadPdf} variant="secondary">
                            <Download className="mr-2 h-4 w-4" />
                            Download as PDF
                        </Button>
                      </div>
                    </div>
                  )
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
`,
  "src/components/tools/smart-search-tool.tsx": `
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleSmartSearchAction } from '@/app/actions';
import type { SmartSearchOutput } from '@/ai/flows/smart-search-tool';
import { FileText, Loader2, UploadCloud } from 'lucide-react';

const formSchema = z.object({
  documentDataUri: z
    .string()
    .min(1, 'Please upload a document.'),
  query: z.string().min(1, 'Please enter a query.'),
});

type FormData = z.infer<typeof formSchema>;

export default function SmartSearchTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SmartSearchOutput | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentDataUri: '',
      query: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 200 * 1024 * 1024) { // 200MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload a document smaller than 200MB."});
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        form.setValue('documentDataUri', dataUri);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleSmartSearchAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: response.error,
      });
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold font-headline">Smart Search</h1>
        <p className="text-muted-foreground">
          Analyze a document for important information using AI.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Analyze Document</CardTitle>
          <CardDescription>
            Upload a document and ask a question about its contents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormItem>
                <FormLabel>Document</FormLabel>
                <FormControl>
                  <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center">
                    {fileName ? (
                      <div className='flex flex-col items-center gap-2'>
                        <FileText className="w-12 h-12 text-primary" />
                        <p className='text-sm font-medium'>{fileName}</p>
                         <Button variant="link" size="sm" asChild className='p-0 h-auto'>
                           <label htmlFor="file-upload" className="cursor-pointer">Change file</label>
                         </Button>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="w-12 h-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          <label htmlFor="file-upload" className="font-semibold text-primary cursor-pointer hover:underline">
                            Click to upload
                          </label>
                           {' '}or drag and drop
                        </p>
                         <p className="text-xs text-muted-foreground">PDF, DOCX, TXT up to 200MB</p>
                      </>
                    )}
                    <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" />
                  </div>
                </FormControl>
                <FormMessage>{form.formState.errors.documentDataUri?.message}</FormMessage>
              </FormItem>

              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Query</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., What are the key takeaways from this document?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading || !form.formState.isValid}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{result.summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
`,
  "src/components/tools/text-humanizer-tool.tsx": `
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { handleHumanizeTextAction } from '@/app/actions';
import type { HumanizeTextOutput } from '@/ai/flows/text-humanizer-tool';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  text: z.string().min(10, 'Please enter at least 10 characters.'),
  tone: z.enum(['Casual', 'Professional', 'Friendly', 'Witty', 'Formal']),
});

type FormData = z.infer<typeof formSchema>;

export default function TextHumanizerTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<HumanizeTextOutput | null>(null);
  const [originalText, setOriginalText] = useState<string>('');
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
      tone: 'Friendly',
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    setOriginalText(data.text);
    const response = await handleHumanizeTextAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error humanizing text',
        description: response.error,
      });
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold font-headline">Text Humanizer</h1>
        <p className="text-muted-foreground">
          Rewrite AI-generated text to sound more natural and engaging.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Humanize Your Text</CardTitle>
          <CardDescription>
            Paste your text, choose a tone, and let the AI work its magic.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Text</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your AI-generated text or assignment here..."
                        {...field}
                        rows={8}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desired Tone</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a tone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Friendly">Friendly</SelectItem>
                        <SelectItem value="Professional">Professional</SelectItem>
                        <SelectItem value="Casual">Casual</SelectItem>
                        <SelectItem value="Witty">Witty</SelectItem>
                        <SelectItem value="Formal">Formal</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Humanizing...' : 'Humanize Text'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && <ResultSkeleton />}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-2">
                <h3 className="font-semibold text-center">Original</h3>
                <div className="p-4 border rounded-md bg-muted min-h-[150px] text-sm text-muted-foreground whitespace-pre-wrap">
                  {originalText}
                </div>
              </div>
               <div className="space-y-2">
                <h3 className="font-semibold text-center">Humanized ✨</h3>
                <div className="p-4 border rounded-md bg-background min-h-[150px] text-sm whitespace-pre-wrap">
                  {result.humanizedText}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


function ResultSkeleton() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-center">Original</h3>
                        <Skeleton className="w-full h-36 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-center">Humanized ✨</h3>
                        <Skeleton className="w-full h-36 rounded-lg" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
`,
  "src/components/tools/text-to-speech-tool.tsx": `
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleTextToSpeechAction } from '@/app/actions';
import type { TextToSpeechOutput } from '@/ai/flows/text-to-speech-tool';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  text: z.string().min(1, 'Please enter some text to convert to speech.'),
});

type FormData = z.infer<typeof formSchema>;

export default function TextToSpeechTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TextToSpeechOutput | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleTextToSpeechAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error generating speech',
        description: response.error,
      });
    }
  }

  useEffect(() => {
    if (result && audioRef.current) {
        audioRef.current.src = result.audioUrl;
        audioRef.current.load();
    }
  }, [result]);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold font-headline">Text-to-Speech Tool</h1>
        <p className="text-muted-foreground">
          Convert written text into natural-sounding speech.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Generate Speech</CardTitle>
          <CardDescription>
            Enter the text you want to hear and our AI will generate the audio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Hello, world! This is a test of the text-to-speech system."
                        {...field}
                        rows={8}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Generating...' : 'Generate Speech'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || result) && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Audio</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && !result ? (
              <Skeleton className="w-full h-14 rounded-lg" />
            ) : result ? (
              <audio ref={audioRef} controls className="w-full">
                Your browser does not support the audio element.
              </audio>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
`,
  "src/components/tools/thesis-generator-tool.tsx": `
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import jsPDF from 'jspdf';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { handleGenerateAcademicDocumentAction } from '@/app/actions';
import type { GenerateAcademicDocumentOutput } from '@/ai/flows/thesis-generator-tool';
import { Download, FileText, Loader2, UploadCloud } from 'lucide-react';

const formSchema = z.object({
  documentDataUri: z.string().min(1, 'Please upload a document.'),
});

type FormData = z.infer<typeof formSchema>;

export default function AcademicWriterTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateAcademicDocumentOutput | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentDataUri: '',
    },
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 200 * 1024 * 1024) { // 200MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload a document smaller than 200MB."});
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        form.setValue('documentDataUri', dataUri);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };


  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleGenerateAcademicDocumentAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
      toast({ title: 'Document Generated', description: 'Your academic document has been created successfully.' });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error generating document',
        description: response.error,
      });
    }
  }

  const handleDownloadPdf = () => {
    if (!result) return;
    
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const usableWidth = pageWidth - 2 * margin;
    let y = margin;

    const addText = (text: string, options: any) => {
        const lines = doc.splitTextToSize(text, usableWidth);
        const textHeight = doc.getTextDimensions(lines).h;
        if (y + textHeight > pageHeight - margin) {
            doc.addPage();
            y = margin;
        }
        doc.text(lines, margin, y, options);
        y += textHeight + 5;
    }

    // Title
    doc.setFontSize(22).setFont('helvetica', 'bold');
    addText(result.title, { align: 'center' });
    y += 10;
    
    // Introduction
    doc.setFontSize(16).setFont('helvetica', 'bold');
    addText('Introduction', {});
    doc.setFontSize(12).setFont('helvetica', 'normal');
    addText(result.introduction.replace(/###|##|#/g, ''), {}); // Simple markdown removal
    y += 5;

    // Chapters
    result.chapters.forEach(chapter => {
        doc.setFontSize(16).setFont('helvetica', 'bold');
        addText(chapter.title, {});
        doc.setFontSize(12).setFont('helvetica', 'normal');
        addText(chapter.content.replace(/###|##|#/g, ''), {});
        y += 5;
    });

    // Conclusion
    doc.setFontSize(16).setFont('helvetica', 'bold');
    addText('Conclusion', {});
    doc.setFontSize(12).setFont('helvetica', 'normal');
    addText(result.conclusion.replace(/###|##|#/g, ''), {});

    doc.save(\`\${result.title.replace(/\\s+/g, '_')}.pdf\`);
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Academic Writer</h1>
        <p className="text-muted-foreground">
          Generate a structured academic document (e.g., Thesis, SIP Report) from your outline and research notes.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Generate Document</CardTitle>
          <CardDescription>
            Upload a document containing your structure, topic, and research notes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
               <FormField
                control={form.control}
                name="documentDataUri"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Outline & Notes</FormLabel>
                     <FormControl>
                      <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center h-48">
                        {fileName ? (
                          <div className="flex flex-col items-center gap-2">
                            <FileText className="w-12 h-12 text-primary" />
                            <p className="text-sm font-medium">{fileName}</p>
                            <Button
                              variant="link"
                              size="sm"
                              asChild
                              className="p-0 h-auto"
                            >
                              <label
                                htmlFor="file-upload"
                                className="cursor-pointer"
                              >
                                Change file
                              </label>
                            </Button>
                          </div>
                        ) : (
                          <>
                            <UploadCloud className="w-12 h-12 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">
                              <label
                                htmlFor="file-upload"
                                className="font-semibold text-primary cursor-pointer hover:underline"
                              >
                                Click to upload
                              </label>{' '}
                              or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PDF, DOCX, TXT up to 200MB
                            </p>
                          </>
                        )}
                        <Input
                          id="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.txt"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : 'Generate Document'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Generating Document Content...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
            <Skeleton className="h-6 w-1/2" />
             <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>{result.title}</CardTitle>
            <CardDescription>Your generated document is ready. Review the content below.</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-6">
            <div>
                <h2 className='text-xl font-bold'>Introduction</h2>
                <div dangerouslySetInnerHTML={{ __html: result.introduction.replace(/\\n/g, '<br />') }} />
            </div>
            {result.chapters.map((chapter, index) => (
                <div key={index}>
                    <h2 className='text-xl font-bold'>{chapter.title}</h2>
                    <div dangerouslySetInnerHTML={{ __html: chapter.content.replace(/\\n/g, '<br />') }} />
                </div>
            ))}
             <div>
                <h2 className='text-xl font-bold'>Conclusion</h2>
                <div dangerouslySetInnerHTML={{ __html: result.conclusion.replace(/\\n/g, '<br />') }} />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleDownloadPdf}>
              <Download className="mr-2 h-4 w-4" />
              Download as PDF
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
`,
  "src/components/tools/tool-skeleton.tsx": `
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ToolSkeleton() {
  return (
    <div className="space-y-6">
       <header className="space-y-1">
        <Skeleton className="h-9 w-1/3" />
        <Skeleton className="h-5 w-2/3" />
      </header>
      <Card>
        <CardHeader>
            <Skeleton className="h-7 w-1/4" />
            <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/6" />
                <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-10 w-28" />
        </CardContent>
      </Card>
    </div>
  );
}
`,
  "src/components/tools/watermark-remover-tool.tsx": `
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { handleRemoveWatermarkAction } from '@/app/actions';
import type { RemoveWatermarkOutput } from '@/ai/flows/watermark-remover-tool';
import { Loader2, UploadCloud } from 'lucide-react';

const formSchema = z.object({
  imageDataUri: z.string().min(1, 'Please upload an image.'),
});

type FormData = z.infer<typeof formSchema>;

export default function WatermarkRemoverTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [result, setResult] = useState<RemoveWatermarkOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageDataUri: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 200 * 1024 * 1024) { // 200MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload an image smaller than 200MB."});
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUri = loadEvent.target?.result as string;
        form.setValue('imageDataUri', dataUri);
        setOriginalImage(dataUri);
        setResult(null); // Clear previous result
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleRemoveWatermarkAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error removing watermark',
        description: response.error,
      });
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold font-headline">Watermark Remover</h1>
        <p className="text-muted-foreground">
          Upload an image to attempt to remove the watermark using AI.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
          <CardDescription>
            Choose an image file with a watermark to process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormItem>
                <FormLabel>Image File</FormLabel>
                <FormControl>
                    <div className="relative border-2 border-dashed border-muted rounded-lg p-6 flex flex-col items-center justify-center text-center h-64">
                    {originalImage ? (
                      <Image src={originalImage} alt="Image preview" layout="fill" objectFit="contain" className="rounded-md" />
                    ) : (
                      <>
                        <UploadCloud className="w-12 h-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          <label htmlFor="file-upload" className="font-semibold text-primary cursor-pointer hover:underline">
                             Upload an image
                          </label>
                        </p>
                        <Input id="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                         <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 200MB</p>
                      </>
                    )}
                  </div>
                </FormControl>
                <FormMessage>{form.formState.errors.imageDataUri?.message}</FormMessage>
              </FormItem>
              <Button type="submit" disabled={isLoading || !originalImage}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Processing...' : 'Remove Watermark'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || result) && (
        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className="space-y-2">
                <h3 className="text-center font-semibold">Original</h3>
                {originalImage && (
                    <div className="aspect-square w-full relative">
                        <Image src={originalImage} alt="Original image" layout="fill" objectFit="contain" className="rounded-lg border" />
                    </div>
                )}
              </div>
              <div className="space-y-2">
                <h3 className="text-center font-semibold">Processed</h3>
                {isLoading ? (
                  <Skeleton className="aspect-square w-full rounded-lg" />
                ) : (
                  result && (
                     <div className="aspect-square w-full relative">
                        <Image src={result.processedImageUrl} alt="Processed image" layout="fill" objectFit="contain" className="rounded-lg border" />
                    </div>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
`,
  "src/components/ui/accordion.tsx": `
"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
`,
  "src/components/ui/alert.tsx": `
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
`,
  "src/components/ui/alert-dialog.tsx": `
"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
`,
  "src/components/ui/avatar.tsx": `
"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
`,
  "src/components/ui/badge.tsx": `
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
`,
  "src/components/ui/button.tsx": `
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
`,
  "src/components/ui/calendar.tsx": `
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
`,
  "src/components/ui/card.tsx": `
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight font-headline",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(" flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
`,
  "src/components/ui/carousel.tsx": `
"use client"

import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return
      }

      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    React.useEffect(() => {
      if (!api || !setApi) {
        return
      }

      setApi(api)
    }, [api, setApi])

    React.useEffect(() => {
      if (!api) {
        return
      }

      onSelect(api)
      api.on("reInit", onSelect)
      api.on("select", onSelect)

      return () => {
        api?.off("select", onSelect)
      }
    }, [api, onSelect])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute  h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
`,
  "src/components/ui/chart.tsx": `
"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = \`chart-\${id || uniqueId.replace(/:/g, "")}\`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => \`
\${prefix} [data-chart=\${id}] {
\${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? \`  --color-\${key}: \${color};\` : null
  })
  .join("\\n")}
}
\`
          )
          .join("\\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean
      hideIndicator?: boolean
      indicator?: "line" | "dot" | "dashed"
      nameKey?: string
      labelKey?: string
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload
      const key = \`\${labelKey || item.dataKey || item.name || "value"}\`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label

      if (labelFormatter) {
        return (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        )
      }

      if (!value) {
        return null
      }

      return <div className={cn("font-medium", labelClassName)}>{value}</div>
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ])

    if (!active || !payload?.length) {
      return null
    }

    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = \`\${nameKey || item.name || item.dataKey || "value"}\`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color || item.payload.fill || item.color

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            }
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltip"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean
      nameKey?: string
    }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref
  ) => {
    const { config } = useChart()

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
      >
        {payload.map((item) => {
          const key = \`\${nameKey || item.dataKey || "value"}\`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div
              key={item.value}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegend"

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
`,
  "src/components/ui/checkbox.tsx": `
"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
`,
  "src/components/ui/collapsible.tsx": `
"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
`,
  "src/components/ui/dialog.tsx": `
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
`,
  "src/components/ui/dropdown-menu.tsx": `
"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
`,
  "src/components/ui/form.tsx": `
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: \`\${id}-form-item\`,
    formDescriptionId: \`\${id}-form-item-description\`,
    formMessageId: \`\${id}-form-item-message\`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? \`\${formDescriptionId}\`
          : \`\${formDescriptionId} \${formMessageId}\`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
`,
  "src/components/ui/input.tsx": `
import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
`,
  "src/components/ui/label.tsx": `
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
`,
  "src/components/ui/menubar.tsx": `
"use client"

import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu {...props} />
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group {...props} />
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal {...props} />
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return <MenubarPrimitive.RadioGroup {...props} />
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />
}

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      "flex h-10 items-center space-x-1 rounded-md border bg-background p-1",
      className
    )}
    {...props}
  />
))
Menubar.displayName = MenubarPrimitive.Root.displayName

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      className
    )}
    {...props}
  />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </MenubarPrimitive.SubTrigger>
))
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(
  (
    { className, align = "start", alignOffset = -4, sideOffset = 8, ...props },
    ref
  ) => (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
)
MenubarContent.displayName = MenubarPrimitive.Content.displayName

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarItem.displayName = MenubarPrimitive.Item.displayName

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
))
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

const MenubarShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
MenubarShortcut.displayname = "MenubarShortcut"

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}
`,
  "src/components/ui/popover.tsx": `
"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
`,
  "src/components/ui/progress.tsx": `
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: \`translateX(-\${100 - (value || 0)}%)\` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
`,
  "src/components/ui/radio-group.tsx": `
"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
`,
  "src/components/ui/robots-building-loader.tsx": `
export const RobotsBuildingLoader = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-background p-8">
        <style>
          {\`
            @keyframes robot-move-1 {
              0% { motion-offset: 0%; }
              100% { motion-offset: 100%; }
            }
            @keyframes robot-move-2 {
              0% { motion-offset: 0%; }
              100% { motion-offset: 100%; }
            }
            @keyframes draw-line {
              from { stroke-dashoffset: 1000; }
              to { stroke-dashoffset: 0; }
            }
            @keyframes fade-in {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .robot-1 { animation: robot-move-1 5s linear infinite; }
            .robot-2 { animation: robot-move-2 6s linear infinite 0.5s; }
            .building-line {
              stroke-dasharray: 1000;
              stroke-dashoffset: 1000;
              animation: draw-line 5s ease-out forwards;
            }
            .fade-in-text {
              animation: fade-in 2s ease-in-out forwards;
            }
          \`}
        </style>
        <svg viewBox="0 0 400 300" className="w-full max-w-md h-auto">
          {/* Robots */}
          <g className="robot-1">
            <path d="M0 0-2-6-4-6-4-8-6-8-6-10-8-10-8-12-6-12-6-14-4-14-4-12-2-12-2-10 0-10 0-8 2-8 2-6 4-6 4-8 6-8 6-10 8-10 8-12 6-12 6-14 4-14 4-12 2-12 2-10 0-10z" fill="hsl(var(--accent))" transform="translate(10, 10) scale(1.5)">
                <animateMotion dur="5s" repeatCount="indefinite" path="M50,250 C100,100 250,100 300,250" />
            </path>
          </g>
          <g className="robot-2">
            <path d="M-6-16l6 4 6-4" fill="none" stroke="hsl(var(--accent))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <animateMotion dur="6s" repeatCount="indefinite" path="M350,50 C300,200 150,200 100,50" />
            </path>
            <circle r="4" fill="hsl(var(--accent))">
                 <animateMotion dur="6s" repeatCount="indefinite" path="M350,50 C300,200 150,200 100,50" />
            </circle>
          </g>
  
          {/* Structure being built */}
          <rect className="building-line" x="50" y="50" width="300" height="200" rx="10" stroke="hsl(var(--accent))" strokeWidth="2" fill="none" />
          <line className="building-line" x1="50" y1="90" x2="350" y2="90" stroke="hsl(var(--border))" strokeWidth="1.5" style={{ animationDelay: '1s' }} />
          <line className="building-line" x1="70" y1="110" x2="200" y2="110" stroke="hsl(var(--border))" strokeWidth="1" style={{ animationDelay: '1.5s' }} />
          <line className="building-line" x1="70" y1="130" x2="250" y2="130" stroke="hsl(var(--border))" strokeWidth="1" style={{ animationDelay: '1.8s' }} />
           <line className="building-line" x1="70" y1="150" x2="180" y2="150" stroke="hsl(var(--border))" strokeWidth="1" style={{ animationDelay: '2.1s' }} />
        </svg>
        <div className="text-center mt-4">
          <p className="text-lg font-headline font-semibold text-primary fade-in-text">Robots at Work</p>
          <p className="text-muted-foreground fade-in-text" style={{ animationDelay: '0.5s' }}>Assembling components...</p>
        </div>
      </div>
    );
  };
`,
  "src/components/ui/scroll-area.tsx": `
"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
`,
  "src/components/ui/select.tsx": `
"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
`,
  "src/components/ui/separator.tsx": `
"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
`,
  "src/components/ui/sheet.tsx": `
"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
`,
  "src/components/ui/sidebar.tsx": `
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3.5rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }

        // This sets the cookie to keep the sidebar state.
        document.cookie = \`\${SIDEBAR_COOKIE_NAME}=\${openState}; path=/; max-age=\${SIDEBAR_COOKIE_MAX_AGE}\`
      },
      [setOpenProp, open]
    )

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right"
    variant?: "sidebar" | "floating" | "inset"
    collapsible?: "offcanvas" | "icon" | "none"
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "icon",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "flex h-full w-[--sidebar-width] flex-col bg-card text-card-foreground",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      )
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width] bg-background p-0 text-foreground [&>button]:hidden"
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            side={side}
          >
            <SheetTitle className="sr-only">Sidebar</SheetTitle>
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <div
        ref={ref}
        className="group peer hidden md:block text-foreground"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
      >
        {/* This is what handles the sidebar gap on desktop */}
        <div
          className={cn(
            "duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear",
            "group-data-[collapsible=offcanvas]:w-0",
            "group-data-[side=right]:rotate-180",
            variant === "floating" || variant === "inset"
              ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
          )}
        />
        <div
          className={cn(
            "duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex",
            side === "left"
              ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
              : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
            // Adjust the padding for floating and inset variants.
            variant === "floating" || variant === "inset"
              ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
            className
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className="flex h-full w-full flex-col bg-card group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-border group-data-[variant=floating]:shadow"
          >
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"


const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"


const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-3", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-3 mt-auto", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"


const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden p-3",
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"


const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-1", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("group/menu-item relative", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-3 overflow-hidden rounded-md px-3 text-left text-sm outline-none ring-ring transition-[width,height,padding] hover:bg-secondary focus-visible:ring-2 active:bg-secondary disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-primary data-[active=true]:font-semibold data-[active=true]:text-primary-foreground data-[state=open]:hover:bg-secondary group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:!px-0 group-data-[collapsible=icon]:!size-10 [&>span:last-child]:truncate [&>svg]:size-5 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-secondary",
        outline:
          "bg-transparent shadow-[0_0_0_1px_hsl(var(--border))] hover:bg-secondary hover:shadow-[0_0_0_1px_hsl(var(--accent))]",
      },
      size: {
        default: "h-10 py-2",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: Omit<React.ComponentProps<typeof TooltipContent>, 'children'> & {children: React.ReactNode}
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const { isMobile, state } = useSidebar()

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        {...props}
      />
    )

    if (!tooltip) {
      return button
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          hidden={state !== "collapsed" || isMobile}
          {...tooltip}
        />
      </Tooltip>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
}
`,
  "src/components/ui/skeleton.tsx": `
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
`,
  "src/components/ui/slider.tsx": `
"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
`,
  "src/components/ui/switch.tsx": `
"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
`,
  "src/components/ui/table.tsx": `
import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
`,
  "src/components/ui/tabs.tsx": `
"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
`,
  "src/components/ui/textarea.tsx": `
import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
`,
  "src/components/ui/toast.tsx": `
"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
`,
  "src/components/ui/toaster.tsx": `
"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
`,
  "src/components/ui/tooltip.tsx": `
"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
`,
  "src/hooks/use-mobile.tsx": `
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(\`(max-width: \${MOBILE_BREAKPOINT - 1}px)\`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
`,
  "src/hooks/use-toast.ts": `
"use client"

// Inspired by react-hot-toast library
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
`,
  "src/lib/docx-generator.ts": `
import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  VerticalAlign,
  TabStopType,
  ShadingType,
  TabStopPosition,
  AlignmentType,
} from 'docx';
import type { GetResumeFeedbackOutput } from '@/ai/flows/resume-feedback-tool';

type ResumeData = GetResumeFeedbackOutput['rewrittenResume'];

const FONT_FAMILY = 'Calibri';
const ACCENT_COLOR = '0d243c';
const ACCENT_TEXT_COLOR = 'FFFFFF';
const TEXT_COLOR = '333333';
const LIGHT_TEXT_COLOR = '555555';
const LINK_COLOR = '2563EB';

const createSection = (title: string, isSidebar: boolean = false) => {
  const titleColor = isSidebar ? ACCENT_TEXT_COLOR : '000000';
  const borderColor = isSidebar ? '555555' : 'D1D5DB';

  return new Paragraph({
    children: [new TextRun({ text: title, bold: true, allCaps: true, color: titleColor, size: 14, font: { name: FONT_FAMILY } })],
    border: { bottom: { color: borderColor, space: 1, value: 'single', size: 4 } },
    spacing: { after: 80, before: 200 },
  });
};

const getAchievementIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('engagement')) return '🎯';
    if (lowerTitle.includes('cost')) return '📉';
    if (lowerTitle.includes('conversion')) return '✅';
    if (lowerTitle.includes('leadership')) return '👥';
    return '⭐';
};


export function createResumeDocx(resumeData: ResumeData): Document {
  const { name, title, contact, summary, experience, education, projects, skills, keyAchievements, training } = resumeData;

  const leftColumnContent = [
    new Paragraph({
      children: [new TextRun({ text: name.toUpperCase(), bold: true, color: ACCENT_TEXT_COLOR, size: 36, font: { name: FONT_FAMILY } })],
      spacing: { after: 200 },
    }),

    ...(projects.length > 0 ? [
      createSection('Projects', true),
      ...projects.flatMap(proj => [
        new Paragraph({
          children: [new TextRun({ text: proj.title, bold: true, color: ACCENT_TEXT_COLOR, size: 17, font: { name: FONT_FAMILY } })],
          spacing: { after: 20, before: 60 },
        }),
        new Paragraph({
          children: [new TextRun({ text: proj.description, color: 'DDDDDD', size: 16, font: { name: FONT_FAMILY } })],
          spacing: { after: 20 },
        }),
        ...(proj.link ? [new Paragraph({
          children: [new TextRun({ text: proj.link, color: 'a9c5e8', size: 16, style: 'Hyperlink', font: { name: FONT_FAMILY } })],
          style: "Hyperlink",
        })] : []),
      ]),
      new Paragraph({ text: '', spacing: { after: 100 } }),
    ] : []),

    ...(keyAchievements.length > 0 ? [
      createSection('Key Achievements', true),
      ...keyAchievements.flatMap(ach => [
        new Paragraph({
            children: [
                new TextRun({ text: \`\${getAchievementIcon(ach.title)} \`, size: 16, font: { name: 'Segoe UI Emoji' } }),
                new TextRun({ text: ach.title, bold: true, color: ACCENT_TEXT_COLOR, size: 17, font: { name: FONT_FAMILY } })
            ],
            spacing: { before: 80, after: 20 }
        }),
        new Paragraph({
          children: [new TextRun({ text: ach.description, color: 'DDDDDD', size: 16, font: { name: FONT_FAMILY } })],
          indent: { left: 280 },
          spacing: { after: 60 }
        })
      ]),
      new Paragraph({ text: '', spacing: { after: 100 } }),
    ] : []),

    ...(skills.length > 0 ? [
      createSection('Skills', true),
      new Paragraph({
        children: [new TextRun({ text: skills.join(', '), color: 'DDDDDD', size: 16, font: { name: FONT_FAMILY } })],
        spacing: { before: 60 },
      }),
      new Paragraph({ text: '', spacing: { after: 100 } }),
    ] : []),

    ...(training.length > 0 ? [
      createSection('Training / Courses', true),
      ...training.flatMap(course => [
        new Paragraph({
          children: [new TextRun({ text: course.title, bold: true, color: ACCENT_TEXT_COLOR, size: 17, font: { name: FONT_FAMILY } })],
          spacing: { after: 20, before: 60 },
        }),
        new Paragraph({
          children: [new TextRun({ text: course.description, color: 'DDDDDD', size: 16, font: { name: FONT_FAMILY } })],
        }),
      ]),
    ] : []),
  ];

  const rightColumnContent = [
    new Paragraph({
      children: [new TextRun({ text: title, bold: false, color: TEXT_COLOR, size: 22, font: { name: FONT_FAMILY } })],
      spacing: { after: 60 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: [
            contact.phone ? \`📞 \${contact.phone}\` : null,
            contact.email ? \`✉️ \${contact.email}\` : null,
            contact.linkedin ? \`💼 \${contact.linkedin}\`: null,
            contact.location ? \`📍 \${contact.location}\`: null
        ].filter(Boolean).join(' | '), color: LIGHT_TEXT_COLOR, size: 16, font: { name: FONT_FAMILY } }),
      ],
      spacing: { after: 150 },
    }),

    ...(summary ? [
      createSection('Summary'),
      new Paragraph({ children: [new TextRun({ text: summary, size: 16, color: TEXT_COLOR, font: { name: FONT_FAMILY } })], spacing: { after: 80, before: 60 } }),
    ] : []),

    ...(experience.length > 0 ? [
      createSection('Experience'),
      ...experience.flatMap(exp => [
        new Paragraph({
          children: [
            new TextRun({ text: exp.title, bold: true, size: 18, color: TEXT_COLOR, font: { name: FONT_FAMILY } }),
            new TextRun({ text: \`\\t\${exp.dates}\`, color: LIGHT_TEXT_COLOR, size: 16, font: { name: FONT_FAMILY } }),
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          spacing: { before: 60 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: exp.company, bold: false, color: LINK_COLOR, size: 17, font: { name: FONT_FAMILY } }),
            new TextRun({ text: \`\\t\${exp.location}\`, color: LIGHT_TEXT_COLOR, size: 16, font: { name: FONT_FAMILY } }),
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          spacing: { after: 40 },
        }),
        ...exp.bullets.map(bullet => new Paragraph({
          children: [new TextRun({ text: bullet, size: 16, color: TEXT_COLOR, font: { name: FONT_FAMILY } })],
          bullet: { level: 0 },
          indent: { left: 280, hanging: 280 },
          spacing: { after: 20 },
        })),
        new Paragraph({ text: '', spacing: { after: 60 } }),
      ])] : []),

    ...(education.length > 0 ? [
      createSection('Education'),
      ...education.flatMap(edu => [
        new Paragraph({
          children: [
            new TextRun({ text: edu.degree, bold: true, size: 18, color: TEXT_COLOR, font: { name: FONT_FAMILY } }),
            new TextRun({ text: \`\\t\${edu.dates}\`, color: LIGHT_TEXT_COLOR, size: 16, font: { name: FONT_FAMILY } }),
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          spacing: { before: 60 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: edu.school, bold: false, color: LINK_COLOR, size: 17, font: { name: FONT_FAMILY } }),
            new TextRun({ text: \`\\t\${edu.location}\`, color: LIGHT_TEXT_COLOR, size: 16, font: { name: FONT_FAMILY } }),
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          spacing: { after: 80 }
        }),
      ])] : []),
  ];


  const doc = new Document({
    creator: "AI Mentor",
    title: \`Resume for \${name}\`,
    styles: {
      default: {
        document: {
          run: {
            font: { name: FONT_FAMILY },
          },
        },
      },
      hyperlink: {
        run: {
          color: LINK_COLOR,
        },
      },
    },
    numbering: {
      config: [
        {
          reference: "default-bullets",
          levels: [
            {
              level: 0,
              format: "bullet",
              text: "●",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: {
                  indent: { left: 280, hanging: 280 },
                },
              },
            },
          ],
        },
      ],
    },
    sections: [{
      properties: {
        page: {
          margin: { top: '0.4in', right: '0.4in', bottom: '0.4in', left: '0.4in' },
        },
      },
      children: [
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          columnWidths: [3400, 6100],
          borders: {
            top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: leftColumnContent,
                  shading: { fill: ACCENT_COLOR, type: ShadingType.CLEAR, val: "clear" },
                  verticalAlign: VerticalAlign.TOP,
                  margins: { left: 200, right: 200, top: 200, bottom: 200 },
                }),
                new TableCell({
                  children: rightColumnContent,
                  verticalAlign: VerticalAlign.TOP,
                  margins: { left: 280, right: 100, top: 200, bottom: 200 },
                }),
              ],
            }),
          ],
        }),
      ],
    }],
  });

  return doc;
}
`,
  "src/lib/utils.ts": `
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`,
  "src/tailwind.config.ts": `
import type {Config} from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        body: ['Inter', 'sans-serif'],
        headline: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      typography: (theme: (arg0: string) => any) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'hsl(var(--foreground))',
            '--tw-prose-headings': 'hsl(var(--primary))',
            '--tw-prose-lead': 'hsl(var(--muted-foreground))',
            '--tw-prose-links': 'hsl(var(--primary))',
            '--tw-prose-bold': 'hsl(var(--foreground))',
            '--tw-prose-counters': 'hsl(var(--muted-foreground))',
            '--tw-prose-bullets': 'hsl(var(--border))',
            '--tw-prose-hr': 'hsl(var(--border))',
            '--tw-prose-quotes': 'hsl(var(--foreground))',
            '--tw-prose-quote-borders': 'hsl(var(--border))',
            '--tw-prose-captions': 'hsl(var(--muted-foreground))',
            '--tw-prose-code': 'hsl(var(--foreground))',
            '--tw-prose-pre-code': 'hsl(var(--foreground))',
            '--tw-prose-pre-bg': 'hsl(var(--muted))',
            '--tw-prose-th-borders': 'hsl(var(--border))',
            '--tw-prose-td-borders': 'hsl(var(--border))',
            '--tw-prose-invert-body': 'hsl(var(--foreground))',
            '--tw-prose-invert-headings': 'hsl(var(--primary))',
            '--tw-prose-invert-lead': 'hsl(var(--muted-foreground))',
            '--tw-prose-invert-links': 'hsl(var(--primary))',
            '--tw-prose-invert-bold': 'hsl(var(--foreground))',
            '--tw-prose-invert-counters': 'hsl(var(--muted-foreground))',
            '--tw-prose-invert-bullets': 'hsl(var(--border))',
            '--tw-prose-invert-hr': 'hsl(var(--border))',
            '--tw-prose-invert-quotes': 'hsl(var(--foreground))',
            '--tw-prose-invert-quote-borders': 'hsl(var(--border))',
            '--tw-prose-invert-captions': 'hsl(var(--muted-foreground))',
            '--tw-prose-invert-code': 'hsl(var(--foreground))',
            '--tw-prose-invert-pre-code': 'hsl(var(--foreground))',
            '--tw-prose-invert-pre-bg': 'hsl(var(--muted))',
            '--tw-prose-invert-th-borders': 'hsl(var(--border))',
            '--tw-prose-invert-td-borders': 'hsl(var(--border))',
          },
        },
      }),
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
} satisfies Config

export default config;
`,
};

export const downloadProject = () => {
  const zip = new JSZip();
  for (const [path, content] of Object.entries(files)) {
    zip.file(path, content);
  }
  zip.generateAsync({ type: 'blob' }).then((content) => {
    saveAs(content, 'ai-mentor-project.zip');
  });
};
