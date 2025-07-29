
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

- Based on the content, determine the person's profession (e.g., 'Software Engineer', 'Graphic Designer') and populate the 'profession' field.
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
    prompt: `You are an expert web developer and designer, specializing in creating modern, animated portfolio websites. Your task is to generate the complete HTML, CSS, and JavaScript for a portfolio, visually tailored to the user's profession.

**User's Profession:** {{{profession}}}

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
\`\`\`

**CSS:**
\`\`\`css
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
\`\`\`

**JavaScript:**
\`\`\`javascript
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
\`\`\`
`,
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
