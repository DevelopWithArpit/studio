
'use client';
import React from 'react';
import { Phone, Mail, MapPin, Linkedin, Star, Award, TrendingUp, Users, Target, Percent, Check, Zap } from 'lucide-react';

interface ResumeData {
  name: string;
  title: string;
  contact: {
    phone?: string;
    email?: string;
    linkedin?: string;
    location?: string;
    extraField?: string;
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

const SidebarSection: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <section className={cn('mb-8', className)}>
        <h2 className="text-sm font-bold tracking-widest text-white border-b border-gray-400 pb-1 mb-3">{title}</h2>
        {children}
    </section>
);

const MainSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b-2 border-gray-200 pb-1 mb-4">{title}</h2>
        {children}
    </section>
);

const getIconForAchievement = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('engagement') || lowerTitle.includes('brand')) return <Target className="w-4 h-4 text-white mt-1" />;
    if (lowerTitle.includes('cost') || lowerTitle.includes('reduction')) return <Percent className="w-4 h-4 text-white mt-1" />;
    if (lowerTitle.includes('conversion') || lowerTitle.includes('increase')) return <Check className="w-4 h-4 text-white mt-1" />;
    if (lowerTitle.includes('team') || lowerTitle.includes('leadership')) return <Users className="w-4 h-4 text-white mt-1" />;
    return <Award className="w-4 h-4 text-white mt-1" />;
}

export const ResumeTemplate: React.FC<{ resumeData: ResumeData }> = ({ resumeData }) => {
    if (!resumeData) {
        return <div className="p-12 text-center">Loading resume data...</div>;
    }

    const { name, title, contact, summary, experience, education, projects, skills, keyAchievements, training } = resumeData;

    return (
        <div className="bg-white flex font-sans" style={{ width: '816px', minHeight: '1056px', fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
            {/* Sidebar (Left Column) */}
            <aside className="w-[33%] bg-[#0d243c] text-white p-8 flex flex-col">
                <div className="text-left mb-10">
                    <h1 className="text-4xl font-bold tracking-wider text-white">{name.toUpperCase().split(' ')[0]}</h1>
                    <h1 className="text-4xl font-bold tracking-wider text-white">{name.toUpperCase().split(' ')[1]}</h1>
                </div>

                {projects?.length > 0 && (
                    <SidebarSection title="PROJECTS">
                        <div className="space-y-4">
                            {projects.map((proj, i) => (
                                <div key={i}>
                                    <h3 className="font-bold text-base text-white">{proj.title}</h3>
                                    <p className="text-sm text-gray-300 mt-1">{proj.description}</p>
                                    {proj.link && <p className="text-sm text-gray-300 break-all">{proj.link}</p>}
                                </div>
                            ))}
                        </div>
                    </SidebarSection>
                )}

                {keyAchievements?.length > 0 && (
                    <SidebarSection title="KEY ACHIEVEMENTS">
                         <div className="space-y-4">
                            {keyAchievements.map((ach, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    {getIconForAchievement(ach.title)}
                                    <div>
                                        <h3 className="font-bold text-base text-white">{ach.title}</h3>
                                        <p className="text-sm text-gray-300 mt-1">{ach.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </SidebarSection>
                )}
                
                {skills?.length > 0 && (
                     <SidebarSection title="SKILLS">
                        <p className="text-sm text-gray-300 leading-relaxed">{skills.join(', ')}</p>
                    </SidebarSection>
                )}

                {training?.length > 0 && (
                    <SidebarSection title="TRAINING / COURSES" className="mt-auto">
                        <div className="space-y-3">
                        {training.map((course, i) => (
                            <div key={i}>
                                <h3 className="font-bold text-base text-white">{course.title}</h3>
                                <p className="text-sm text-gray-300">{course.description}</p>
                            </div>
                        ))}
                        </div>
                    </SidebarSection>
                )}
                 <div className="text-xs text-gray-400 mt-4">Powered by <span className="font-bold">Enhancv</span></div>
            </aside>

            {/* Main Content (Right Column) */}
            <main className="w-[67%] bg-white p-8 text-gray-800">
                <header className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
                    <div className="text-xs text-gray-500 mt-2 flex items-center flex-wrap gap-x-4 gap-y-1">
                        {contact?.phone && <span className="flex items-center gap-1.5"><Phone className="w-3 h-3"/>{contact.phone}</span>}
                        {contact?.email && <span className="flex items-center gap-1.5"><Mail className="w-3 h-3"/>{contact.email}</span>}
                        {contact?.linkedin && <span className="flex items-center gap-1.5"><Linkedin className="w-3 h-3"/>{contact.linkedin}</span>}
                    </div>
                     <div className="text-xs text-gray-500 mt-1 flex items-center flex-wrap gap-x-4 gap-y-1">
                        {contact?.location && <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3"/>{contact.location}</span>}
                        {contact?.extraField && <span className="flex items-center gap-1.5"><Star className="w-3 h-3"/>{contact.extraField}</span>}
                    </div>
                </header>

                {summary && (
                    <MainSection title="SUMMARY">
                        <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
                    </MainSection>
                )}

                {experience?.length > 0 && (
                    <MainSection title="EXPERIENCE">
                        <div className="space-y-5">
                            {experience.map((exp, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-base font-bold text-gray-800">{exp.title}</h3>
                                        <p className="text-xs text-gray-500 font-medium text-right">{exp.dates}</p>
                                    </div>
                                    <div className="flex justify-between items-start mb-2">
                                       <p className="text-sm font-semibold text-[#3b82f6]">{exp.company}</p>
                                       <p className="text-xs text-gray-500 font-medium text-right">{exp.location}</p>
                                    </div>
                                    <ul className="space-y-1.5 list-disc pl-5 text-sm text-gray-700 leading-relaxed">
                                        {exp.bullets.map((bullet, j) => <li key={j} className="pl-1">{bullet}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </MainSection>
                )}
                
                 {education?.length > 0 && (
                     <MainSection title="EDUCATION">
                         <div className="space-y-4">
                            {education.map((edu, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-base font-bold text-gray-800">{edu.degree}</h3>
                                        <p className="text-xs text-gray-500 font-medium text-right">{edu.dates}</p>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm font-semibold text-[#3b82f6]">{edu.school}</p>
                                        <p className="text-xs text-gray-500 font-medium text-right">{edu.location}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </MainSection>
                )}
                <div className="text-right text-xs text-gray-400 mt-auto pt-8">www.enhancv.com</div>
            </main>
        </div>
    );
};
