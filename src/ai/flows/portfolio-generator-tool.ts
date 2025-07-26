'use server';

/**
 * @fileOverview Generates a single-page portfolio website.
 *
 * - generatePortfolio - A function that generates HTML and CSS for a portfolio.
 * - GeneratePortfolioInput - The input type for the function.
 * - GeneratePortfolioOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GeneratePortfolioInputSchema = z.object({
  resumeText: z.string().describe('The structured resume text containing sections like Summary, Experience, Education, Skills.'),
});
export type GeneratePortfolioInput = z.infer<typeof GeneratePortfolioInputSchema>;

const GeneratePortfolioOutputSchema = z.object({
  html: z.string().describe('The full HTML content for the single-page portfolio.'),
  css: z.string().describe('The full CSS content for styling the portfolio.'),
});
export type GeneratePortfolioOutput = z.infer<typeof GeneratePortfolioOutputSchema>;

export async function generatePortfolio(input: GeneratePortfolioInput): Promise<GeneratePortfolioOutput> {
  return generatePortfolioFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePortfolioPrompt',
  input: { schema: GeneratePortfolioInputSchema },
  output: { schema: GeneratePortfolioOutputSchema },
  prompt: `You are an expert web developer. Your task is to take the provided resume text and inject it into the provided HTML and CSS template. You MUST NOT change the structure, layout, or styling of the template. Your only job is to populate the template with the user's information from the 'Resume Content' section.

**Resume Content:**
---
{{{resumeText}}}
---

**HTML and CSS Template (DO NOT CHANGE THIS STRUCTURE):**

**CSS:**
\`\`\`css
body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    margin: 0;
    padding: 2em;
    background-color: #fff;
    color: #333;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
.container {
    width: 100%;
    max-width: 900px;
    margin: auto;
    display: flex;
    flex-direction: column;
}
.header {
    width: 100%;
    padding-bottom: 1em;
    margin-bottom: 1.5em;
}
.header h1 {
    font-size: 2.8em;
    font-weight: bold;
    margin: 0;
    color: #000;
}
.header h2 {
    font-size: 1.5em;
    font-weight: normal;
    margin: 0.1em 0;
    color: #007BFF;
}
.contact-info {
    display: flex;
    gap: 1.5em;
    margin-top: 1em;
    font-size: 0.9em;
    color: #555;
}
.contact-info span {
    display: flex;
    align-items: center;
    gap: 0.4em;
}
.main-content {
    display: flex;
    width: 100%;
    gap: 2em;
}
.left-column {
    width: 65%;
}
.right-column {
    width: 35%;
}
.section {
    margin-bottom: 1.5em;
}
.section-title {
    font-size: 1.2em;
    font-weight: bold;
    color: #000;
    margin-bottom: 0.8em;
    padding-bottom: 0.3em;
    border-bottom: 2px solid #000;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
.section p {
    margin: 0;
    line-height: 1.6;
}
.experience-item, .education-item, .project-item, .achievement-item {
    margin-bottom: 1.5em;
}
h3 {
    font-size: 1.1em;
    font-weight: bold;
    margin: 0 0 0.2em 0;
}
.sub-heading {
    font-size: 1em;
    color: #007BFF;
    font-weight: bold;
    margin: 0 0 0.3em 0;
}
.meta-info {
    display: flex;
    gap: 1em;
    font-size: 0.85em;
    color: #777;
    margin-bottom: 0.5em;
}
.meta-info span {
    display: flex;
    align-items: center;
    gap: 0.3em;
}
ul {
    list-style-position: outside;
    padding-left: 1.2em;
    margin: 0;
}
ul li {
    margin-bottom: 0.5em;
    line-height: 1.5;
}
.profile-pic-placeholder {
    width: 120px;
    height: 120px;
    background-color: #007BFF;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3em;
    color: white;
    font-weight: bold;
    float: right;
    margin-bottom: 1.5em;
}
.skills-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5em;
    margin-top: 0.5em;
}
.skill-tag {
    background-color: #f0f0f0;
    padding: 0.4em 0.8em;
    border-radius: 4px;
    font-size: 0.9em;
}
.clear {
    clear: both;
}
\`\`\`

**HTML:**
\`\`\`html
<div class="container">
    <div class="header">
        <h1>ARPIT PISE</h1>
        <h2>AI Engineer / Robotics Software Engineer</h2>
        <div class="contact-info">
            <span>&#x260E; 7276602831</span>
            <span>&#x2709; arpitpise1@gmail.com</span>
            <span>&#x1F517; linkedin.com/in/arpit-pise-20029a287</span>
            <span>&#x1F4CD; Nagpur, India</span>
        </div>
    </div>
    <div class="main-content">
        <div class="left-column">
            <div class="section">
                <h2 class="section-title">Summary</h2>
                <p><!-- Populate with Summary from Resume Content --></p>
            </div>
            <div class="section">
                <h2 class="section-title">Experience</h2>
                <div class="experience-item">
                    <h3>Technical Member</h3>
                    <p class="sub-heading">Priyadarshini College of Engineering</p>
                    <div class="meta-info">
                        <span>&#x1F4C5; 01/2023 - 01/1970</span>
                        <span>&#x1F4CD; Nagpur, India</span>
                    </div>
                    <ul>
                        <!-- Populate with Experience bullet points -->
                    </ul>
                </div>
            </div>
            <div class="section">
                <h2 class="section-title">Education</h2>
                <div class="education-item">
                    <h3>Bachelor of Technology in Robotics and Artificial Intelligence (B.Tech)</h3>
                    <p class="sub-heading">Priyadarshini College Of Engineering</p>
                    <div class="meta-info">
                        <span>&#x1F4C5; 08/2024 - 05/2028</span>
                        <span>&#x1F4CD; Nagpur, India</span>
                    </div>
                </div>
                 <div class="education-item">
                    <h3>HSC</h3>
                    <p class="sub-heading">ST. PAUL PUBLIC SCHOOL & JUNIOR COLLEGE</p>
                    <div class="meta-info">
                        <span>&#x1F4C5; 01/2021 - 05/2023</span>
                    </div>
                </div>
                 <div class="education-item">
                    <h3>SSC</h3>
                    <p class="sub-heading">PURUSHOTTAM DAS BAGLA CONVENT</p>
                    <div class="meta-info">
                        <span>&#x1F4C5; 01/2019 - 05/2021</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="right-column">
            <div class="profile-pic-placeholder">AP</div>
            <div class="clear"></div>
            <div class="section">
                <h2 class="section-title">Key Achievements</h2>
                <div class="achievement-item">
                     <h3>AI Mentor by AP Platform Development</h3>
                     <p><!-- Populate with Key Achievement description --></p>
                </div>
            </div>
            <div class="section">
                <h2 class="section-title">Skills</h2>
                <div class="skills-container">
                    <!-- Populate with .skill-tag divs -->
                </div>
            </div>
            <div class="section">
                <h2 class="section-title">Projects</h2>
                <div class="project-item">
                    <h3>AI Mentor by AP</h3>
                     <div class="meta-info">
                        <span>&#x1F4C5; 05/2025 - 01/1970</span>
                    </div>
                    <p>AI Mentor by AP - Personal Project</p>
                    <ul>
                         <!-- Populate with Project bullet points -->
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>
\`\`\`

Generate the final, populated HTML and CSS now. Do not deviate from the template.`,
});


const generatePortfolioFlow = ai.defineFlow(
  {
    name: 'generatePortfolioFlow',
    inputSchema: GeneratePortfolioInputSchema,
    outputSchema: GeneratePortfolioOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
