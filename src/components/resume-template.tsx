
'use client';
import React from 'react';
import { Phone, Mail, Linkedin, MapPin, Briefcase, GitFork, Star, TrendingUp, CheckCircle, Award, Target, Users, Github } from 'lucide-react';

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
    title: string;
    description: string;
  }[];
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600 border-b-2 border-gray-300 pb-1 mb-3">{title}</h2>
        {children}
    </section>
);


export const ResumeTemplate: React.FC<{ resumeData: ResumeData }> = ({ resumeData }) => {
    if (!resumeData) {
        return <div className="p-12 text-center">Loading resume data...</div>;
    }

    const { name, title, contact, summary, experience, education, projects, skills, keyAchievements, training } = resumeData;

    return (
        <div className="bg-white text-gray-800 p-10 font-sans leading-relaxed" style={{ width: '816px' }}>
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold tracking-tight text-gray-800 uppercase">{name}</h1>
                <h2 className="text-xl font-medium text-gray-600 mt-1">{title}</h2>
                <div className="flex justify-center flex-wrap text-xs text-gray-600 mt-3 gap-x-4 gap-y-1">
                    {contact?.location && <span className="flex items-center gap-1.5"><MapPin size={12} /> {contact.location}</span>}
                    {contact?.phone && <span className="flex items-center gap-1.5"><Phone size={12} /> {contact.phone}</span>}
                    {contact?.email && <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 text-blue-600 hover:underline"><Mail size={12} /> {contact.email}</a>}
                    {contact?.linkedin && <a href={contact.linkedin} className="flex items-center gap-1.5 text-blue-600 hover:underline"><Linkedin size={12} /> LinkedIn</a>}
                    {contact?.github && <a href={contact.github} className="flex items-center gap-1.5 text-blue-600 hover:underline"><Github size={12} /> GitHub</a>}
                </div>
            </header>
            
            <main>
                {summary && (
                    <Section title="Summary">
                        <p className="text-sm">{summary}</p>
                    </Section>
                )}
                
                {skills?.length > 0 && (
                    <Section title="Skills">
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, i) => (
                                <span key={i} className="bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">{skill}</span>
                            ))}
                        </div>
                    </Section>
                )}

                {experience?.length > 0 && (
                    <Section title="Experience">
                        <div className="space-y-5">
                            {experience.map((exp, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="text-lg font-bold">{exp.title}</h3>
                                        <p className="text-xs text-gray-500 font-medium">{exp.dates}</p>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                       <p className="text-base font-semibold text-blue-600">{exp.company}</p>
                                       {exp.location && <p className="text-xs text-gray-500">{exp.location}</p>}
                                    </div>
                                    <ul className="mt-2 space-y-1 list-disc pl-5 text-sm">
                                        {exp.bullets.map((bullet, j) => <li key={j}>{bullet}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </Section>
                )}

                {education?.length > 0 && (
                     <Section title="Education">
                         <div className="space-y-4">
                            {education.map((edu, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="text-base font-bold">{edu.degree}</h3>
                                        <p className="text-xs text-gray-500 font-medium">{edu.dates}</p>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <p className="text-sm font-semibold text-blue-600">{edu.school}</p>
                                        {edu.location && <p className="text-xs text-gray-500">{edu.location}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>
                )}

                {projects?.length > 0 && (
                    <Section title="Projects">
                        <div className="space-y-4">
                            {projects.map((proj, i) => (
                                <div key={i}>
                                    <h3 className="font-bold text-base text-gray-800">{proj.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{proj.description}</p>
                                    {proj.link && <a href={proj.link} className="text-xs text-blue-600 hover:underline break-all">{proj.link}</a>}
                                </div>
                            ))}
                        </div>
                    </Section>
                )}
            </main>
        </div>
    );
};
