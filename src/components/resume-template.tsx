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
        <ul className="mt-1 space-y-1.5 list-disc pl-5">
            {items.map((item, index) => (
                <li key={index} className="text-xs text-gray-700 leading-relaxed">
                    {item}
                </li>
            ))}
        </ul>
    );
};

export const ResumeTemplate: React.FC<{ resumeData: ResumeData }> = ({ resumeData }) => {
    if (!resumeData) {
        return <div className="p-10">Loading resume data...</div>;
    }

    const { name, contact, summary, experience, education, projects, skills, achievements } = resumeData;
    const initials = name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'AP';

    return (
        <div className="bg-white text-gray-900 font-sans text-sm" style={{ width: '816px', minHeight: '1056px' }}>
            <div className="p-10">
                {/* Header */}
                <header className="flex justify-between items-start pb-4 border-b-2 border-gray-200">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{name}</h1>
                        <p className="mt-2 text-xs text-gray-500">
                            {contact.phone} | {contact.email}
                            {contact.github && ` | ${contact.github}`}
                             | {contact.linkedin} | {contact.location}
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center">
                            <span className="text-white text-xl font-bold">{initials}</span>
                        </div>
                    </div>
                </header>

                {/* Body */}
                <main className="flex gap-10 pt-6">
                    {/* Left Column */}
                    <div className="w-[65%]">
                        {summary && (
                            <section>
                                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-600">Summary</h2>
                                <div className="w-full h-px bg-gray-900 my-1"></div>
                                <p className="mt-2 text-xs text-gray-700 leading-relaxed">{summary}</p>
                            </section>
                        )}

                        {experience && experience.length > 0 && (
                            <section className="mt-6">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-600">Experience</h2>
                                <div className="w-full h-px bg-gray-900 my-1"></div>
                                <div className="mt-2 space-y-4">
                                    {experience.map((exp, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-bold text-sm">{exp.title}</h3>
                                                <p className="text-xs text-gray-500 font-medium">{exp.dates}</p>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-700">{exp.company}</p>
                                            <BulletList items={exp.bullets} />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                         {education && education.length > 0 && (
                            <section className="mt-6">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-600">Education</h2>
                                <div className="w-full h-px bg-gray-900 my-1"></div>
                                <div className="mt-2 space-y-2">
                                    {education.map((edu, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-bold text-sm">{edu.school}</h3>
                                                <p className="text-xs text-gray-500 font-medium">{edu.dates}</p>
                                            </div>
                                            <p className="text-sm text-gray-700">{edu.degree}</p>
                                            <p className="text-xs text-gray-500">{edu.location}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="w-[35%]">
                        {achievements && achievements.length > 0 && (
                            <section>
                                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-600">Key Achievements</h2>
                                <div className="w-full h-px bg-gray-900 my-1"></div>
                                <ul className="mt-2 space-y-2">
                                    {achievements.map((ach, i) => (
                                        <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                                            <span className="text-blue-600 mt-0.5">&#10003;</span>
                                            <span>{ach}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                        {skills && skills.technical.length > 0 && (
                            <section className="mt-6">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-600">Skills</h2>
                                <div className="w-full h-px bg-gray-900 my-1"></div>
                                <div className="mt-2">
                                    <h3 className="font-bold text-xs mb-1">Technical:</h3>
                                    <div className="flex flex-wrap gap-1">
                                        {skills.technical.map((skill, i) => (
                                            <span key={i} className="bg-gray-200 text-gray-800 text-[10px] font-medium px-2 py-0.5 rounded-full">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                                {skills.other && skills.other.length > 0 && (
                                     <div className="mt-2">
                                        <h3 className="font-bold text-xs mb-1">Other:</h3>
                                        <div className="flex flex-wrap gap-1">
                                            {skills.other.map((skill, i) => (
                                                <span key={i} className="bg-gray-200 text-gray-800 text-[10px] font-medium px-2 py-0.5 rounded-full">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}
                         {projects && projects.length > 0 && (
                            <section className="mt-6">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-600">Projects</h2>
                                <div className="w-full h-px bg-gray-900 my-1"></div>
                                <div className="mt-2 space-y-3">
                                    {projects.map((proj, i) => (
                                        <div key={i}>
                                            <h3 className="font-bold text-sm">{proj.title}</h3>
                                            <BulletList items={proj.bullets} />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};
