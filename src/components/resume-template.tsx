'use client';
import React from 'react';

interface Experience {
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
    skills: Skills;
}


const parseResumeText = (text: string): ResumeData => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    const data: ResumeData = {
        name: '',
        contact: '',
        summary: '',
        experience: [],
        skills: {},
    };

    let currentSection = '';
    let currentExperience: Experience | null = null;
    let currentSkillCategory = '';

    const sectionHeaders = ['SUMMARY', 'EXPERIENCE', 'SKILLS'];

    data.name = lines[0] || '';
    data.contact = lines[1] || '';

    for (let i = 2; i < lines.length; i++) {
        const line = lines[i];
        
        const header = sectionHeaders.find(h => line.toUpperCase().startsWith(h));
        if (header) {
            currentSection = header;
            if (header === 'EXPERIENCE') {
                currentExperience = null;
            }
            continue;
        }

        switch (currentSection) {
            case 'SUMMARY':
                data.summary += (data.summary ? ' ' : '') + line;
                break;
            case 'EXPERIENCE':
                if (line.startsWith('•') || line.startsWith('*')) {
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
                break;
            case 'SKILLS':
                 if (line.includes(':')) {
                    const parts = line.split(':');
                    currentSkillCategory = parts[0].trim();
                    data.skills[currentSkillCategory] = parts[1].split(',').map(s => s.trim()).filter(s => s);
                 } else if (currentSkillCategory) {
                    // This line is a continuation of the previous category
                    const newSkills = line.split(',').map(s => s.trim()).filter(s => s);
                    data.skills[currentSkillCategory] = [...(data.skills[currentSkillCategory] || []), ...newSkills];
                 }
                break;
        }
    }

    if (currentExperience) {
        data.experience.push(currentExperience);
    }
    
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
    const initials = data.name.split(' ').map(n => n[0]).join('').substring(0, 2);

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#fff', color: '#111827', padding: '40px', width: '816px', height: '1056px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
            
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '28pt', fontWeight: '900', margin: 0, letterSpacing: '-1px' }}>{data.name}</h1>
                    <p style={{ fontSize: '9pt', color: '#4b5563', margin: '4px 0 0 0' }}>{data.contact}</p>
                </div>
                <div style={{ flexShrink: 0, width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '24pt', fontWeight: 'bold' }}>{initials}</span>
                </div>
            </header>

            <main style={{ display: 'flex', flexGrow: 1, paddingTop: '24px', gap: '40px' }}>
                {/* Left Column */}
                <div style={{ width: '65%' }}>
                    {data.summary && (
                        <section>
                            <h2 style={{ fontSize: '10pt', fontWeight: 'bold', textTransform: 'uppercase', color: '#374151', letterSpacing: '1px', borderBottom: '2px solid #111827', paddingBottom: '4px', marginBottom: '8px' }}>Summary</h2>
                            <p style={{ fontSize: '9pt', color: '#374151', lineHeight: '1.5' }}>{data.summary}</p>
                        </section>
                    )}

                    {data.experience.length > 0 && (
                        <section style={{ marginTop: '24px' }}>
                            <h2 style={{ fontSize: '10pt', fontWeight: 'bold', textTransform: 'uppercase', color: '#374151', letterSpacing: '1px', borderBottom: '2px solid #111827', paddingBottom: '4px', marginBottom: '8px' }}>Experience</h2>
                            {data.experience.map((exp, i) => (
                                <div key={i} style={{ marginBottom: i < data.experience.length - 1 ? '16px' : '0' }}>
                                    <h3 style={{ fontSize: '10pt', fontWeight: 'bold', margin: 0 }}>{exp.title}</h3>
                                    <p style={{ fontSize: '9pt', color: '#4b5563', margin: '2px 0 0 0' }}>{exp.details}</p>
                                    <BulletList items={exp.bullets} />
                                </div>
                            ))}
                        </section>
                    )}
                </div>

                {/* Right Column */}
                <div style={{ width: '35%', borderLeft: '1px solid #e5e7eb', paddingLeft: '40px' }}>
                     {Object.keys(data.skills).length > 0 && (
                        <section>
                            <h2 style={{ fontSize: '10pt', fontWeight: 'bold', textTransform: 'uppercase', color: '#374151', letterSpacing: '1px', borderBottom: '2px solid #111827', paddingBottom: '4px', marginBottom: '8px' }}>Skills</h2>
                            {Object.entries(data.skills).map(([category, skills]) => (
                                <div key={category} style={{ marginBottom: '12px' }}>
                                    <h3 style={{ fontSize: '9pt', fontWeight: 'bold', margin: '0 0 4px 0' }}>{category}:</h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                        {skills.map((skill, i) => (
                                            <span key={i} className="skill-badge">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
};
