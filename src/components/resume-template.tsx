'use client';
import React from 'react';

interface Experience {
    title: string;
    details: string;
    bullets: string[];
}

interface Education {
    school: string;
    location: string;
    degree: string;
    dates: string;
}

interface Project {
    title: string;
    details: string;
    bullets: string[];
}

interface Skills {
    [category: string]: string[];
}

interface ResumeData {
    name: string;
    contact: string;
    summary: string;
    experience: Experience[];
    education: Education[];
    projects: Project[];
    skills: Skills;
    achievements: string[];
}

const parseResumeText = (text: string): ResumeData => {
    const cleanedText = text.replace(/^##\s*/gm, '');
    const lines = cleanedText.split('\n').map(line => line.trim()).filter(line => line);

    const data: ResumeData = {
        name: '',
        contact: '',
        summary: '',
        experience: [],
        education: [],
        projects: [],
        skills: {},
        achievements: [],
    };

    if (lines.length > 0) data.name = lines[0];
    if (lines.length > 1) data.contact = lines[1];
    
    const sectionHeaders = ['SUMMARY', 'EXPERIENCE', 'EDUCATION', 'PROJECTS', 'SKILLS', 'KEY ACHIEVEMENTS'];
    let sectionMap: { [key: string]: number } = {};

    lines.forEach((line, index) => {
        const upperLine = line.toUpperCase().trim();
        if (sectionHeaders.includes(upperLine)) {
            sectionMap[upperLine] = index;
        }
    });

    const getSectionContent = (sectionName: string): string[] => {
        const start = sectionMap[sectionName];
        if (start === undefined) return [];

        let end = lines.length;
        for (const header of sectionHeaders) {
            if (sectionMap[header] > start && sectionMap[header] < end) {
                end = sectionMap[header];
            }
        }
        return lines.slice(start + 1, end);
    };

    data.summary = getSectionContent('SUMMARY').join(' ');
    data.achievements = getSectionContent('KEY ACHIEVEMENTS').map(line => line.replace(/^\*?\s*/, ''));

    // Parse Skills
    const skillContent = getSectionContent('SKILLS');
    let currentCategory = '';
    skillContent.forEach(line => {
        if (line.endsWith(':')) {
            currentCategory = line.slice(0, -1).replace(/^\*?\s*/, '').trim();
            data.skills[currentCategory] = [];
        } else if (currentCategory) {
            const skills = line.split(',').map(s => s.trim()).filter(Boolean);
            data.skills[currentCategory].push(...skills);
        }
    });
     Object.keys(data.skills).forEach(category => {
        data.skills[category] = data.skills[category].join(', ').split(',').map(s => s.trim()).filter(s => s);
    });

    // Parse Experience
    const experienceContent = getSectionContent('EXPERIENCE');
    let currentExperience: Experience | null = null;
    experienceContent.forEach(line => {
        if (line.startsWith('*')) {
            if (currentExperience) {
                currentExperience.bullets.push(line.substring(1).trim());
            }
        } else {
            if (currentExperience) {
                data.experience.push(currentExperience);
            }
            const parts = line.split('|').map(p => p.trim());
            currentExperience = {
                title: parts[0] || '',
                details: parts.slice(1).join(' | '),
                bullets: [],
            };
        }
    });
    if (currentExperience) data.experience.push(currentExperience);

    // Parse Education
    const educationContent = getSectionContent('EDUCATION');
    if (educationContent.length > 1) {
        const schoolParts = educationContent[0].split('|').map(p => p.trim());
        const degreeParts = educationContent[1].split('|').map(p => p.trim());
        data.education.push({
            school: schoolParts[0] || '',
            location: schoolParts[1] || '',
            degree: degreeParts[0] || '',
            dates: degreeParts[1] || '',
        });
    }
    
    // Parse Projects
    const projectsContent = getSectionContent('PROJECTS');
    let currentProject: Project | null = null;
     projectsContent.forEach(line => {
        if (line.startsWith('*')) {
            if (currentProject) {
                currentProject.bullets.push(line.substring(1).trim());
            }
        } else {
            if (currentProject) {
                data.projects.push(currentProject);
            }
            const parts = line.split('|').map(p => p.trim());
            currentProject = {
                title: parts[0] || '',
                details: parts.slice(1).join(' | '),
                bullets: [],
            };
        }
    });
    if (currentProject) data.projects.push(currentProject);

    return data;
};


const BulletList = ({ items }: { items: string[] }) => {
    if (!items || items.length === 0) return null;
    return (
        <ul style={{ margin: '4px 0 0 20px', paddingLeft: '1em', listStyleType: 'disc' }}>
            {items.map((item, index) => (
                <li key={index} style={{ fontSize: '9pt', lineHeight: '1.4', color: '#374151', paddingLeft: '0.5em' }}>
                    {item}
                </li>
            ))}
        </ul>
    );
};

export const ResumeTemplate: React.FC<{ resumeText: string }> = ({ resumeText }) => {
    const data = parseResumeText(resumeText);
    const {name, contact, summary, experience, education, skills, projects, achievements} = data;
    const initials = name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '';

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#fff', color: '#111827', padding: '40px', width: '816px', minHeight: '1056px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
            
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '28pt', fontWeight: '900', margin: 0, letterSpacing: '-1px' }}>{name}</h1>
                    <p style={{ fontSize: '9pt', color: '#4b5563', margin: '4px 0 0 0' }}>{contact}</p>
                </div>
                <div style={{ flexShrink: 0, width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '24pt', fontWeight: 'bold' }}>{initials}</span>
                </div>
            </header>

            <main style={{ display: 'flex', flexGrow: 1, paddingTop: '24px', gap: '40px' }}>
                {/* Left Column */}
                <div style={{ width: '65%' }}>
                    {summary && (
                        <section>
                            <h2 style={{ fontSize: '10pt', fontWeight: 'bold', textTransform: 'uppercase', color: '#374151', letterSpacing: '1px', borderBottom: '2px solid #111827', paddingBottom: '4px', marginBottom: '8px' }}>Summary</h2>
                            <p style={{ fontSize: '9pt', color: '#374151', lineHeight: '1.5' }}>{summary}</p>
                        </section>
                    )}

                    {experience && experience.length > 0 && (
                        <section style={{ marginTop: '24px' }}>
                            <h2 style={{ fontSize: '10pt', fontWeight: 'bold', textTransform: 'uppercase', color: '#374151', letterSpacing: '1px', borderBottom: '2px solid #111827', paddingBottom: '4px', marginBottom: '8px' }}>Experience</h2>
                            {experience.map((exp, i) => (
                                <div key={i} style={{ marginBottom: i < experience.length - 1 ? '16px' : '0' }}>
                                    <h3 style={{ fontSize: '10pt', fontWeight: 'bold', margin: 0 }}>{exp.title}</h3>
                                    <p style={{ fontSize: '9pt', color: '#4b5563', margin: '2px 0 0 0' }}>{exp.details}</p>
                                    <BulletList items={exp.bullets} />
                                </div>
                            ))}
                        </section>
                    )}

                    {education && education.length > 0 && (
                         <section style={{ marginTop: '24px' }}>
                            <h2 style={{ fontSize: '10pt', fontWeight: 'bold', textTransform: 'uppercase', color: '#374151', letterSpacing: '1px', borderBottom: '2px solid #111827', paddingBottom: '4px', marginBottom: '8px' }}>Education</h2>
                            {education.map((edu, i) => (
                                <div key={i} style={{ marginBottom: '8px' }}>
                                    <h3 style={{ fontSize: '10pt', fontWeight: 'bold', margin: 0 }}>{edu.school}</h3>
                                    <p style={{ fontSize: '9pt', color: '#4b5563', margin: '2px 0 0 0' }}>{edu.degree} | {edu.dates}</p>
                                </div>
                            ))}
                        </section>
                    )}

                </div>

                {/* Right Column */}
                <div style={{ width: '35%', borderLeft: '1px solid #e5e7eb', paddingLeft: '40px' }}>
                     {achievements && achievements.length > 0 && (
                         <section>
                            <h2 style={{ fontSize: '10pt', fontWeight: 'bold', textTransform: 'uppercase', color: '#374151', letterSpacing: '1px', borderBottom: '2px solid #111827', paddingBottom: '4px', marginBottom: '8px' }}>Key Achievements</h2>
                             <ul style={{ margin: '8px 0 0 0', paddingLeft: '1em', listStyleType: 'none' }}>
                                 {achievements.map((ach, i) => (
                                    <li key={i} style={{ fontSize: '9pt', lineHeight: '1.4', color: '#374151', paddingLeft: '0.5em', marginBottom: '4px', display: 'flex', alignItems: 'flex-start' }}>
                                         <span style={{ marginRight: '0.5em', marginTop: '4px' }}>•</span>
                                         <span>{ach}</span>
                                     </li>
                                 ))}
                             </ul>
                        </section>
                    )}

                    {skills && Object.keys(skills).length > 0 && (
                        <section style={{ marginTop: '24px' }}>
                            <h2 style={{ fontSize: '10pt', fontWeight: 'bold', textTransform: 'uppercase', color: '#374151', letterSpacing: '1px', borderBottom: '2px solid #111827', paddingBottom: '4px', marginBottom: '8px' }}>Skills</h2>
                            {Object.entries(skills).map(([category, skillList]) => (
                                <div key={category} style={{ marginBottom: '12px' }}>
                                    <h3 style={{ fontSize: '9pt', fontWeight: 'bold', margin: '0 0 4px 0' }}>{category}:</h3>
                                    <p style={{ fontSize: '9pt', color: '#374151', lineHeight: '1.4' }}>
                                        {Array.isArray(skillList) ? skillList.join(', ') : ''}
                                    </p>
                                </div>
                            ))}
                        </section>
                    )}

                     {projects && projects.length > 0 && (
                        <section style={{ marginTop: '24px' }}>
                            <h2 style={{ fontSize: '10pt', fontWeight: 'bold', textTransform: 'uppercase', color: '#374151', letterSpacing: '1px', borderBottom: '2px solid #111827', paddingBottom: '4px', marginBottom: '8px' }}>Projects</h2>
                            {projects.map((proj, i) => (
                                <div key={i} style={{ marginBottom: i < projects.length - 1 ? '16px' : '0' }}>
                                    <h3 style={{ fontSize: '10pt', fontWeight: 'bold', margin: 0 }}>{proj.title}</h3>
                                    {proj.details && <p style={{ fontSize: '9pt', color: '#4b5563', margin: '2px 0 0 0' }}>{proj.details}</p>}
                                    <BulletList items={proj.bullets} />
                                </div>
                            ))}
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
};
