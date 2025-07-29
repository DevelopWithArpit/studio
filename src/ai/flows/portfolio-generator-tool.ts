
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
    prompt: `You are an expert at parsing unstructured text and extracting structured information. Analyze the following document, which could be a resume, a LinkedIn profile, or an article about building a portfolio. Your task is to extract all relevant information and structure it according to the provided JSON schema.

- If the document is a guide or article, create a realistic and compelling portfolio for a fictional person (e.g., Alex Doe, a Full-Stack Developer) based on the principles and examples in the text.
- Infer missing information where it makes sense. For instance, if a job title is "Software Engineer," you can create plausible project descriptions or skill sets.
- For projects, if no image URL is provided, use a placeholder from 'https://placehold.co/600x400'.
- Ensure all fields in the schema are populated with high-quality, realistic data.

Document to analyze:
---
{{{text}}}
---

Extract the data now.`,
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
    prompt: `You are an expert web developer. Your task is to populate the provided HTML, CSS, and JavaScript template with the user's structured data.

**User's Portfolio Data:**
- Name: {{{name}}}
- Headline: {{{headline}}}
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

**Instructions:**
1.  Take the user's data and insert it into the correct locations in the HTML template below.
2.  For the hero section, use the user's name and headline.
3.  For the "About" section, use the user's "about" text.
4.  For the "Experience" section, create an entry for each item in the user's experience array.
5.  For the "Projects" section, create a card for each project. Use 'https://placehold.co/600x400' if no image URL is provided.
6.  For the "Skills" section, list all the user's skills.
7.  For the footer, include all contact information and social links.
8.  **Do not change the structure of the HTML, CSS, or JavaScript.** Only insert the data.
9.  Return the complete HTML, CSS, and JavaScript as a single JSON object.

**Template:**

**HTML:**
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio</title>
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet">
</head>
<body>

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
\`\`\`

**CSS:**
\`\`\`css
:root {
    --bg-color: #0A192F;
    --text-color: #ccd6f6;
    --accent-color: #64ffda;
    --card-bg-color: #112240;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Space Grotesk', sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
    line-height: 1.6;
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
}

.hero-name {
    font-size: 5rem;
}

.hero-headline {
    font-size: 1.5rem;
    margin-top: 1rem;
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
    background-color: var(--card-bg-color);
}

.social-links {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    gap: 1.5rem;
}
\`\`\`

**JavaScript:**
\`\`\`javascript
document.addEventListener('DOMContentLoaded', () => {
    const scrollTargets = document.querySelectorAll('.scroll-target');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    scrollTargets.forEach(target => {
        observer.observe(target);
    });

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
});
\`\`\``,
});


const generatePortfolioWebsiteFlow = ai.defineFlow(
  {
    name: 'generatePortfolioWebsiteFlow',
    inputSchema: PortfolioDataSchema,
    outputSchema: GeneratePortfolioWebsiteOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("The model failed to generate the website code.");
    }
    return output;
  }
);
