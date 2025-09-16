
'use client';
import React from 'react';
import { Phone, Mail, MapPin, Linkedin, Github, Briefcase, Star, Award, TrendingUp, Users, Target, Percent, Check, Zap, Building, GraduationCap, Mountain, Link } from 'lucide-react';
import { cn } from '@/lib/utils';


interface ResumeData {
  name: string;
  title: string;
  contact: {
    phone?: string;
    email?: string;
    linkedin?: string;
    github?: string;
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
    title:string;
    description: string;
  }[];
}

const SidebarSection: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <section className={cn('mb-6', className)}>
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b-2 border-gray-500 pb-1 mb-3">{title}</h2>
        {children}
    </section>
);

const MainSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 border-b border-gray-300 pb-1 mb-3">{title}</h2>
        {children}
    </section>
);

const achievementIcons: { [key: string]: React.FC<any> } = {
    'engagement': Target,
    'cost': Percent,
    'conversions': Check,
    'leadership': Users,
    'default': Star,
};

const getAchievementIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('engagement')) return achievementIcons['engagement'];
    if (lowerTitle.includes('cost')) return achievementIcons['cost'];
    if (lowerTitle.includes('conversion')) return achievementIcons['conversions'];
    if (lowerTitle.includes('leadership')) return achievementIcons['leadership'];
    return achievementIcons['default'];
};


export const ResumeTemplate: React.FC<{ resumeData: ResumeData }> = ({ resumeData }) => {
    if (!resumeData) {
        return <div className="p-12 text-center text-black">Loading resume data...</div>;
    }

    const { name, title, contact, summary, experience, education, projects, skills, keyAchievements, training } = resumeData;

    return (
        <div className="bg-white flex font-sans text-black" style={{ width: '816px', minHeight: '1056px' }}>
            {/* Sidebar (Left Column) */}
            <aside className="w-[33.33%] bg-[#0d243c] text-white p-8 flex flex-col" style={{fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'}}>
                 <div className="text-left mb-8">
                    <h1 className="text-4xl font-bold tracking-tight text-white uppercase">{name}</h1>
                </div>

                {projects?.length > 0 && (
                    <SidebarSection title="Projects">
                        <div className="space-y-4">
                            {projects.map((proj, i) => (
                                <div key={i}>
                                    <h3 className="font-bold text-sm text-white">{proj.title}</h3>
                                    <p className="text-xs text-gray-300 mt-1 leading-snug">{proj.description}</p>
                                    {proj.link && <a href={proj.link} className="text-xs text-blue-300 break-all mt-1 block">{proj.link}</a>}
                                </div>
                            ))}
                        </div>
                    </SidebarSection>
                )}

                {keyAchievements?.length > 0 && (
                    <SidebarSection title="Key Achievements">
                         <div className="space-y-4">
                            {keyAchievements.map((ach, i) => {
                                const Icon = getAchievementIcon(ach.title);
                                return (
                                <div key={i} className="flex items-start gap-3">
                                    <Icon className="w-4 h-4 text-white mt-0.5 shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-sm text-white leading-tight">{ach.title}</h3>
                                        <p className="text-xs text-gray-300 mt-1 leading-snug">{ach.description}</p>
                                    </div>
                                </div>
                            )})}
                        </div>
                    </SidebarSection>
                )}

                {skills?.length > 0 && (
                     <SidebarSection title="Skills">
                        <p className="text-xs text-gray-300 leading-relaxed">
                          {skills.join(', ')}
                        </p>
                    </SidebarSection>
                )}

                {training?.length > 0 && (
                    <SidebarSection title="Training / Courses">
                        <div className="space-y-3">
                        {training.map((course, i) => (
                            <div key={i}>
                                <h3 className="font-semibold text-sm text-white">{course.title}</h3>
                                <p className="text-xs text-gray-300 mt-1">{course.description}</p>
                            </div>
                        ))}
                        </div>
                    </SidebarSection>
                )}
            </aside>

            {/* Main Content (Right Column) */}
            <main className="w-[66.67%] bg-white p-8 text-gray-800" style={{fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'}}>
                <header className="mb-6 text-left">
                    <h2 className="text-xl font-bold text-gray-700 tracking-wider">{title}</h2>
                    <div className="text-xs text-gray-500 flex items-center flex-wrap gap-x-3 gap-y-1 mt-2">
                        {contact?.phone && <span className="flex items-center gap-1.5"><Phone className="w-3 h-3"/>{contact.phone}</span>}
                        {contact?.email && <span className="flex items-center gap-1.5"><Mail className="w-3 h-3"/>{contact.email}</span>}
                        {contact?.linkedin && <span className="flex items-center gap-1.5"><Linkedin className="w-3 h-3"/>{contact.linkedin}</span>}
                        {contact?.location && <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3"/>{contact.location}</span>}
                        {contact?.extraField && <span className="flex items-center gap-1.5"><Star className="w-3 h-3"/>{contact.extraField}</span>}
                    </div>
                </header>

                {summary && (
                    <MainSection title="Summary">
                        <p className="text-xs text-gray-700 leading-relaxed">{summary}</p>
                    </MainSection>
                )}

                {experience?.length > 0 && (
                    <MainSection title="Experience">
                        <div className="space-y-5">
                            {experience.map((exp, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline mb-1">
                                       <h3 className="text-sm font-bold text-gray-800">{exp.title}</h3>
                                       <p className="text-xs text-gray-500 font-medium text-right">{exp.dates}</p>
                                    </div>
                                     <div className="flex justify-between items-baseline mb-1">
                                       <p className="text-sm font-semibold text-blue-600">{exp.company}</p>
                                       <p className="text-xs text-gray-500 font-medium text-right">{exp.location}</p>
                                    </div>
                                    <ul className="space-y-1 list-disc pl-3.5 text-xs text-gray-700 leading-relaxed">
                                        {exp.bullets.map((bullet, j) => <li key={j} className="pl-1">{bullet}</li>)}
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
                                        <h3 className="text-sm font-bold text-gray-800">{edu.degree}</h3>
                                         <p className="text-xs text-gray-500 font-medium text-right">{edu.dates}</p>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <p className="text-sm font-semibold text-blue-600">{edu.school}</p>
                                        <p className="text-xs text-gray-500 font-medium text-right">{edu.location}</p>
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
