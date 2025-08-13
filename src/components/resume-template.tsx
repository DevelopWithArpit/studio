
'use client';
import React from 'react';

// Define the types for the structured resume data
interface ResumeData {
  name: string;
  contact: {
    phone: string;
    email: string;
    linkedin: string;
    github?: string;
    location: string;
  };
  summary: string;
  experience: {
    title: string;
    company: string;
    dates: string;
    bullets: string[];
  }[];
  education: {
    degree: string;
    school: string;
    dates: string;
    location: string;
  }[];
  projects: {
    title: string;
    bullets: string[];
  }[];
  skills: {
    technical: string[];
    other?: string[];
  };
  achievements: string[];
}


const BulletList = ({ items }: { items: string[] }) => {
    if (!items || items.length === 0) return null;
    return (
        <ul className="mt-2 space-y-1.5 list-disc pl-5">
            {items.map((item, index) => (
                <li key={index} className="text-sm text-gray-700 leading-relaxed">
                    {item}
                </li>
            ))}
        </ul>
    );
};

export const ResumeTemplate: React.FC<{ resumeData: ResumeData }> = ({ resumeData }) => {
    if (!resumeData) {
        return <div className="p-12">Loading resume data...</div>;
    }

    const { name, contact, summary, experience, education, projects, skills, achievements } = resumeData;

    return (
        <div className="bg-white text-gray-900 font-sans" style={{ width: '816px', minHeight: '1056px' }}>
            <div className="p-12">
                {/* Header */}
                <header className="text-center pb-6 border-b-2 border-gray-200">
                    <h1 className="text-5xl font-bold text-gray-800 tracking-tight">{name}</h1>
                    <p className="mt-3 text-sm text-gray-500 space-x-4">
                        <span>{contact.location}</span>
                        <span>&bull;</span>
                        <span>{contact.phone}</span>
                        <span>&bull;</span>
                        <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">{contact.email}</a>
                        {contact.linkedin && (
                            <>
                                <span>&bull;</span>
                                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn</a>
                            </>
                        )}
                        {contact.github && (
                            <>
                                <span>&bull;</span>
                                <a href={contact.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GitHub</a>
                            </>
                        )}
                    </p>
                </header>

                {/* Body using CSS Grid for visual layout, but semantic HTML for ATS */}
                <main className="mt-8 grid gap-x-12" style={{
                    gridTemplateColumns: '1fr 280px',
                    gridTemplateAreas: `
                        "summary    skills"
                        "experience projects"
                        "education  achievements"
                    `,
                    gridTemplateRows: 'auto auto 1fr'
                }}>
                    {summary && (
                        <section style={{ gridArea: 'summary' }}>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-600 border-b-2 pb-1 mb-3">Summary</h2>
                            <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
                        </section>
                    )}

                    {experience && experience.length > 0 && (
                        <section className="mt-6" style={{ gridArea: 'experience' }}>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-600 border-b-2 pb-1 mb-3">Experience</h2>
                            <div className="space-y-5">
                                {experience.map((exp, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="font-bold text-base">{exp.title}</h3>
                                            <p className="text-sm text-gray-500 font-medium">{exp.dates}</p>
                                        </div>
                                        <p className="text-base font-semibold text-gray-700">{exp.company}</p>
                                        <BulletList items={exp.bullets} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {education && education.length > 0 && (
                        <section className="mt-6" style={{ gridArea: 'education' }}>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-600 border-b-2 pb-1 mb-3">Education</h2>
                            <div className="space-y-4">
                                {education.map((edu, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="font-bold text-base">{edu.school}</h3>
                                            <p className="text-sm text-gray-500 font-medium">{edu.dates}</p>
                                        </div>
                                        <p className="text-base text-gray-700">{edu.degree}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    
                    {skills && skills.technical.length > 0 && (
                        <section style={{ gridArea: 'skills' }}>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-600 border-b-2 pb-1 mb-3">Skills</h2>
                            <div>
                                <h3 className="font-bold text-sm mb-2">Technical:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {skills.technical.map((skill, i) => (
                                        <span key={i} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">{skill}</span>
                                    ))}
                                </div>
                            </div>
                            {skills.other && skills.other.length > 0 && (
                                 <div className="mt-4">
                                    <h3 className="font-bold text-sm mb-2">Other:</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {skills.other.map((skill, i) => (
                                            <span key={i} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                    )}
                    
                    {projects && projects.length > 0 && (
                        <section className="mt-6" style={{ gridArea: 'projects' }}>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-600 border-b-2 pb-1 mb-3">Projects</h2>
                            <div className="space-y-4">
                                {projects.map((proj, i) => (
                                    <div key={i}>
                                        <h3 className="font-bold text-base">{proj.title}</h3>
                                        <BulletList items={proj.bullets} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {achievements && achievements.length > 0 && (
                        <section className="mt-6" style={{ gridArea: 'achievements' }}>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-600 border-b-2 pb-1 mb-3">Achievements</h2>
                            <ul className="mt-2 space-y-2">
                                {achievements.map((ach, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                        <span className="text-blue-600 mt-0.5">&#10003;</span>
                                        <span>{ach}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                </main>
            </div>
        </div>
    );
};
