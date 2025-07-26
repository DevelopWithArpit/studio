'use client';
import React from 'react';

const parseResumeText = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const sections: Record<string, string[]> = {
        SUMMARY: [],
        EXPERIENCE: [],
        EDUCATION: [],
        'KEY ACHIEVEMENTS': [],
        SKILLS: [],
        PROJECTS: [],
    };

    let name = lines.shift() || '';
    let title = lines.shift() || '';
    let contactLine = lines.shift() || '';

    let currentSection: keyof typeof sections | null = null;

    for (const line of lines) {
        const trimmedLine = line.trim().toUpperCase();
        if (Object.keys(sections).includes(trimmedLine)) {
            currentSection = trimmedLine as keyof typeof sections;
        } else if (currentSection) {
            sections[currentSection].push(line);
        }
    }
    
    // A fallback to ensure all sections are arrays
    for (const key in sections) {
        if (!Array.isArray(sections[key])) {
            sections[key] = [];
        }
    }

    return { name, title, contactLine, sections };
};

const BulletList = ({ items }: { items: string[] }) => (
    <ul className="list-disc pl-5 mt-2 space-y-1">
        {items.map((item, index) => (
            <li key={index} className="text-gray-700 text-xs leading-snug">{item.replace(/^•\s*/, '')}</li>
        ))}
    </ul>
);

export const ResumeTemplate: React.FC<{ resumeText: string }> = ({ resumeText }) => {
    const { name, title, contactLine, sections } = parseResumeText(resumeText);
    const contactParts = contactLine.split('|').map(p => p.trim());
    const [phone, email, linkedin, location] = contactParts;

    const initials = name.split(' ').map(n => n[0]).join('');

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#fff', color: '#1f2937', padding: '2rem' }}>
            <div className="max-w-4xl mx-auto text-sm">
                
                <header className="flex items-start justify-between pb-4">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-800">{name}</h1>
                        <h2 className="text-lg font-semibold text-blue-600 mt-1">{title}</h2>
                        <div className="flex items-center text-xs text-gray-500 mt-3 space-x-4">
                            {phone && <span className="flex items-center gap-1.5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                {phone}
                            </span>}
                            {email && <span className="flex items-center gap-1.5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                                {email}
                            </span>}
                            {linkedin && <span className="flex items-center gap-1.5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                                {linkedin}
                            </span>}
                            {location && <span className="flex items-center gap-1.5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                {location}
                            </span>}
                        </div>
                    </div>
                     <div className="flex-shrink-0">
                        <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-4xl font-bold">{initials}</span>
                        </div>
                    </div>
                </header>
                
                <main className="flex gap-10 pt-5">
                    <div className="w-[65%]">
                        <section>
                            <h3 className="text-sm font-extrabold uppercase tracking-widest text-gray-700">Summary</h3>
                            <div className="w-full h-px bg-gray-900 my-1" style={{borderWidth: '1.5px'}}></div>
                            <p className="mt-2 text-gray-600 leading-relaxed text-xs">{sections.SUMMARY.join('\n')}</p>
                        </section>

                        <section className="mt-6">
                            <h3 className="text-sm font-extrabold uppercase tracking-widest text-gray-700">Experience</h3>
                            <div className="w-full h-px bg-gray-900 my-1" style={{borderWidth: '1.5px'}}></div>
                            <div className="mt-2 space-y-4">
                                {sections.EXPERIENCE.reduce((acc, line) => {
                                    if(line.startsWith('•')) {
                                        if (acc.length > 0) {
                                            acc[acc.length - 1].bullets.push(line);
                                        }
                                    } else {
                                        const [role, institution] = line.split('\n');
                                        const [date, location] = (lines.find(l => l.includes(institution) && l.includes('•')) || ' • ').split('•').map(s => s.trim());
                                        acc.push({ role, institution, date, location, bullets: [] });
                                    }
                                    return acc;
                                }, [] as any[]).map((exp, i) => {
                                    const roleAndInstitution = exp.role.split("Priyadarshini");
                                    const role = roleAndInstitution[0];
                                    const institution = "Priyadarshini" + roleAndInstitution[1];
                                    const detailsLine = sections.EXPERIENCE.find(line => line.includes('•'));
                                    const [date, location] = detailsLine ? detailsLine.split('•').map(s => s.trim()) : ['',''];

                                    return (
                                    <div key={i} className="text-xs">
                                        <p className="font-bold text-gray-800 text-sm">{role}</p>
                                        <p className="font-semibold text-blue-600 text-xs">{institution}</p>
                                        <div className="flex text-gray-500 my-1 space-x-4">
                                            <span className='flex items-center gap-1.5'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                                {date}
                                            </span>
                                            <span className='flex items-center gap-1.5'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                                {location}
                                            </span>
                                        </div>
                                        <BulletList items={exp.bullets} />
                                    </div>
                                )})}
                            </div>
                        </section>

                        <section className="mt-6">
                            <h3 className="text-sm font-extrabold uppercase tracking-widest text-gray-700">Education</h3>
                            <div className="w-full h-px bg-gray-900 my-1" style={{borderWidth: '1.5px'}}></div>
                            <div className="mt-2 space-y-4 text-xs">
                                {sections.EDUCATION.map((edu, i) => {
                                    const lines = edu.split('\n');
                                    const [degree, institution, details] = lines;
                                    const [date, location] = details ? details.split('•').map(s => s.trim()) : ['', ''];
                                    return (
                                        <div key={i}>
                                            <p className="font-bold text-gray-800 text-sm">{degree}</p>
                                            <p className="font-semibold text-blue-600 text-xs">{institution}</p>
                                            {details && <div className="flex text-gray-500 mt-1 space-x-4">
                                                 <span className='flex items-center gap-1.5'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                                    {date}
                                                </span>
                                                <span className='flex items-center gap-1.5'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                                    {location}
                                                </span>
                                            </div>}
                                        </div>
                                    )
                                })}
                            </div>
                        </section>
                    </div>

                    <div className="w-[35%]">
                         <section>
                            <h3 className="text-sm font-extrabold uppercase tracking-widest text-gray-700">Key Achievements</h3>
                             <div className="w-full h-px bg-gray-900 my-1" style={{borderWidth: '1.5px'}}></div>
                            <div className="mt-2 space-y-3">
                                {sections['KEY ACHIEVEMENTS'].map((ach, i) => (
                                    <div key={i} className="flex items-start gap-3 text-xs">
                                        <div className="flex-shrink-0 text-blue-500 mt-0.5">
                                             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{ach.split('\n')[0]}</p>
                                            <p className="text-gray-600 leading-snug">{ach.split('\n').slice(1).join('\n')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="mt-6">
                            <h3 className="text-sm font-extrabold uppercase tracking-widest text-gray-700">Skills</h3>
                            <div className="w-full h-px bg-gray-900 my-1" style={{borderWidth: '1.5px'}}></div>
                            <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                {sections.SKILLS.join(', ').split(',').map((skill, i) => (
                                    <span key={i} className="bg-gray-100 text-gray-700 font-medium px-2.5 py-1 rounded-md border border-gray-200">{skill.trim()}</span>
                                ))}
                            </div>
                        </section>

                         <section className="mt-6">
                            <h3 className="text-sm font-extrabold uppercase tracking-widest text-gray-700">Projects</h3>
                            <div className="w-full h-px bg-gray-900 my-1" style={{borderWidth: '1.5px'}}></div>
                            <div className="mt-2 space-y-4">
                                {sections.PROJECTS.reduce((acc, line) => {
                                     if(line.startsWith('•')) {
                                        if (acc.length > 0) {
                                            acc[acc.length - 1].bullets.push(line);
                                        }
                                    } else {
                                        const [title, date, description] = line.split('\n');
                                        acc.push({ title, date, description, bullets: [] });
                                    }
                                    return acc;
                                }, [] as any[]).map((proj, i) => (
                                    <div key={i} className="text-xs">
                                        <p className="font-bold text-gray-800">{proj.title}</p>
                                        {proj.date && (
                                            <div className="flex text-gray-500 my-1 space-x-4">
                                            <span className='flex items-center gap-1.5'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                                {proj.date}
                                            </span>
                                        </div>
                                        )}
                                        <p className="text-gray-600 leading-snug">{proj.description}</p>
                                        <BulletList items={proj.bullets} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};
