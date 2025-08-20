
'use client';
import React from 'react';
import { Phone, Mail, Linkedin, MapPin, Github, Briefcase, GitFork, Star, TrendingUp, CheckCircle, Award, Target, Users } from 'lucide-react';

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

const SidebarSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 border-gray-300 pb-1 mb-3">{title}</h2>
        {children}
    </section>
);

const MainSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-6">
        <h2 className="text-lg font-bold uppercase tracking-widest text-gray-700 border-b-2 border-gray-300 pb-1 mb-4">{title}</h2>
        {children}
    </section>
);

const getIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('engagement')) return <TrendingUp className="w-5 h-5 mr-3 text-white" />;
    if (lowerTitle.includes('cost') || lowerTitle.includes('reduction')) return <Target className="w-5 h-5 mr-3 text-white" />;
    if (lowerTitle.includes('conversion') || lowerTitle.includes('increase')) return <CheckCircle className="w-5 h-5 mr-3 text-white" />;
    if (lowerTitle.includes('leadership') || lowerTitle.includes('team')) return <Users className="w-5 h-5 mr-3 text-white" />;
    return <Star className="w-5 h-5 mr-3 text-white" />;
};

export const ResumeTemplate: React.FC<{ resumeData: ResumeData }> = ({ resumeData }) => {
    if (!resumeData) {
        return <div className="p-12 text-center">Loading resume data...</div>;
    }

    const { name, title, contact, summary, experience, education, projects, skills, keyAchievements, training } = resumeData;

    return (
        <div className="bg-white text-gray-800 font-sans leading-relaxed flex" style={{ width: '816px', minHeight: '1056px' }}>
           {/* Left Sidebar */}
            <aside className="w-1/3 bg-[#0e3d4e] text-white p-6 flex flex-col">
                <h1 className="text-4xl font-bold uppercase tracking-tight mb-8">{name}</h1>
                
                {projects?.length > 0 && (
                    <SidebarSection title="Projects">
                        <div className="space-y-4">
                            {projects.map((proj, i) => (
                                <div key={i}>
                                    <h3 className="font-bold text-base">{proj.title}</h3>
                                    <p className="text-xs text-gray-300 mt-1">{proj.description}</p>
                                    {proj.link && <a href={proj.link} className="text-xs text-blue-300 hover:underline break-all">{proj.link}</a>}
                                </div>
                            ))}
                        </div>
                    </SidebarSection>
                )}

                {keyAchievements?.length > 0 && (
                    <SidebarSection title="Key Achievements">
                         <div className="space-y-4">
                            {keyAchievements.map((ach, i) => (
                                <div key={i} className="flex items-start">
                                    {getIcon(ach.title)}
                                    <div>
                                        <h3 className="font-bold text-base">{ach.title}</h3>
                                        <p className="text-xs text-gray-300 mt-1">{ach.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SidebarSection>
                )}
                
                {skills?.length > 0 && (
                     <SidebarSection title="Skills">
                        <p className="text-xs text-gray-300">{skills.join(', ')}</p>
                    </SidebarSection>
                )}

                {training?.length > 0 && (
                    <SidebarSection title="Training / Courses">
                        <div className="space-y-2">
                        {training.map((course, i) => (
                            <div key={i}>
                                <h3 className="font-bold text-base">{course.title}</h3>
                                <p className="text-xs text-gray-300">{course.description}</p>
                            </div>
                        ))}
                        </div>
                    </SidebarSection>
                )}

                <div className="mt-auto text-center text-xs text-gray-400">
                    <p>Powered by AI Mentor</p>
                </div>

            </aside>

            {/* Main Content */}
            <main className="w-2/3 bg-white p-8">
                <header className="mb-6">
                    <h2 className="text-xl font-medium text-gray-600">{title}</h2>
                    <div className="flex flex-wrap text-xs text-gray-500 mt-2 gap-x-4 gap-y-1">
                        {contact?.phone && <span className="flex items-center gap-1.5"><Phone size={12} /> {contact.phone}</span>}
                        {contact?.email && <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 text-blue-600 hover:underline"><Mail size={12} /> {contact.email}</a>}
                        {contact?.linkedin && <a href={contact.linkedin} className="flex items-center gap-1.5 text-blue-600 hover:underline"><Linkedin size={12} /> {contact.linkedin}</a>}
                        {contact?.github && <a href={contact.github} className="flex items-center gap-1.5 text-blue-600 hover:underline"><Github size={12} /> {contact.github}</a>}
                        {contact?.location && <span className="flex items-center gap-1.5"><MapPin size={12} /> {contact.location}</span>}
                    </div>
                </header>

                {summary && (
                    <MainSection title="Summary">
                        <p className="text-sm text-gray-700">{summary}</p>
                    </MainSection>
                )}

                {experience?.length > 0 && (
                    <MainSection title="Experience">
                        <div className="space-y-5">
                            {experience.map((exp, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="text-base font-bold text-gray-800">{exp.title}</h3>
                                        <p className="text-xs text-gray-500 font-medium">{exp.dates}</p>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                       <p className="text-sm font-semibold text-blue-600">{exp.company}</p>
                                       {exp.location && <p className="text-xs text-gray-500">{exp.location}</p>}
                                    </div>
                                    <ul className="mt-2 space-y-1.5 list-disc pl-5 text-sm text-gray-700">
                                        {exp.bullets.map((bullet, j) => <li key={j}>{bullet}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </MainSection>
                )}
                
                 {education?.length > 0 && (
                     <MainSection title="Education">
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
                    </MainSection>
                )}
            </main>
        </div>
    );
};
