
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

const getAchievementIcon = (title: string) => {
    const lowerCaseTitle = title.toLowerCase();
    if (lowerCaseTitle.includes('lead') || lowerCaseTitle.includes('team')) return <Users className="w-5 h-5 text-blue-300" />;
    if (lowerCaseTitle.includes('engag') || lowerCaseTitle.includes('brand')) return <TrendingUp className="w-5 h-5 text-blue-300" />;
    if (lowerCaseTitle.includes('cost') || lowerCaseTitle.includes('reduc')) return <Target className="w-5 h-5 text-blue-300" />;
    if (lowerCaseTitle.includes('conver') || lowerCaseTitle.includes('increas')) return <CheckCircle className="w-5 h-5 text-blue-300" />;
    return <Star className="w-5 h-5 text-blue-300" />;
};


export const ResumeTemplate: React.FC<{ resumeData: ResumeData }> = ({ resumeData }) => {
    if (!resumeData) {
        return <div className="p-12 text-center">Loading resume data...</div>;
    }

    const { name, title, contact, summary, experience, education, projects, skills, keyAchievements, training } = resumeData;

    return (
        <div className="bg-white text-gray-800 font-sans leading-relaxed flex" style={{ width: '816px', minHeight: '1056px' }}>
            {/* Left Sidebar */}
            <aside className="w-1/3 bg-gray-800 text-white p-8">
                <h1 className="text-4xl font-bold tracking-tighter text-white uppercase">{name}</h1>
                <div className="mt-8">
                    {projects?.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 border-b-2 border-gray-600 pb-1 mb-4">Projects</h2>
                            <div className="space-y-4">
                                {projects.map((proj, i) => (
                                    <div key={i}>
                                        <h3 className="font-semibold text-base text-blue-300">{proj.title}</h3>
                                        <p className="text-xs text-gray-300 mt-1">{proj.description}</p>
                                        {proj.link && <a href={proj.link} className="text-xs text-blue-400 hover:underline break-all">{proj.link}</a>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    {keyAchievements?.length > 0 && (
                         <section className="mb-8">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 border-b-2 border-gray-600 pb-1 mb-4">Key Achievements</h2>
                             <div className="space-y-4">
                                {keyAchievements.map((ach, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="flex-shrink-0 mt-1">{getAchievementIcon(ach.title)}</div>
                                        <div>
                                            <h3 className="font-semibold text-sm">{ach.title}</h3>
                                            <p className="text-xs text-gray-300">{ach.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                     {skills?.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 border-b-2 border-gray-600 pb-1 mb-4">Skills</h2>
                            <p className="text-sm text-gray-300">{skills.join(', ')}</p>
                        </section>
                    )}
                    {training?.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 border-b-2 border-gray-600 pb-1 mb-4">Training / Courses</h2>
                             <div className="space-y-3">
                                {training.map((course, i) => (
                                    <div key={i}>
                                        <h3 className="font-semibold text-sm text-blue-300">{course.title}</h3>
                                        <p className="text-xs text-gray-300 mt-1">{course.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="w-2/3 p-8">
                 <header className="mb-8">
                    <h2 className="text-xl font-semibold text-blue-600">{title}</h2>
                    <div className="flex flex-wrap text-xs text-gray-600 mt-2 gap-x-4 gap-y-1">
                        {contact?.phone && <span className="flex items-center gap-1.5"><Phone size={12} /> {contact.phone}</span>}
                        {contact?.email && <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 text-blue-600 hover:underline"><Mail size={12} /> {contact.email}</a>}
                        {contact?.linkedin && <a href={contact.linkedin} className="flex items-center gap-1.5 text-blue-600 hover:underline"><Linkedin size={12} /> LinkedIn</a>}
                        {contact?.github && <a href={contact.github} className="flex items-center gap-1.5 text-blue-600 hover:underline"><Github size={12} /> GitHub</a>}
                        {contact?.location && <span className="flex items-center gap-1.5"><MapPin size={12} /> {contact.location}</span>}
                    </div>
                </header>
                
                {summary && (
                    <section className="mb-8">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 border-b-2 pb-1 mb-3">Summary</h2>
                        <p className="text-sm">{summary}</p>
                    </section>
                )}

                {experience?.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 border-b-2 pb-1 mb-3">Experience</h2>
                        <div className="space-y-6">
                            {experience.map((exp, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="text-lg font-bold">{exp.title}</h3>
                                        <p className="text-xs text-gray-500 font-medium">{exp.dates}</p>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                       <p className="text-base font-semibold text-blue-600">{exp.company}</p>
                                       <p className="text-xs text-gray-500">{exp.location}</p>
                                    </div>
                                    <ul className="mt-2 space-y-1 list-disc pl-5">
                                        {exp.bullets.map((bullet, j) => <li key={j} className="text-sm">{bullet}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {education?.length > 0 && (
                     <section>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 border-b-2 pb-1 mb-3">Education</h2>
                         <div className="space-y-4">
                            {education.map((edu, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="text-base font-bold">{edu.degree}</h3>
                                        <p className="text-xs text-gray-500 font-medium">{edu.dates}</p>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <p className="text-sm font-semibold text-blue-600">{edu.school}</p>
                                        <p className="text-xs text-gray-500">{edu.location}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

            </main>
        </div>
    );
};
