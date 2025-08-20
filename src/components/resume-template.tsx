
'use client';
import React from 'react';
import { Phone, Mail, Linkedin, MapPin, Github, Briefcase, GitFork, Star, TrendingUp, CheckCircle, Percent, ArrowDown, User, Scale } from 'lucide-react';

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
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-300 border-b border-gray-500 pb-1 mb-3">{title}</h2>
        {children}
    </section>
);

const MainSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-5">
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-600 border-b-2 border-gray-200 pb-1 mb-3">{title}</h2>
        {children}
    </section>
);

const achievementIcons: { [key: string]: React.FC<any> } = {
    'brand': TrendingUp,
    'engagement': TrendingUp,
    'cost': ArrowDown,
    'reduction': ArrowDown,
    'conversions': CheckCircle,
    'increase': CheckCircle,
    'leadership': User,
    'team': User,
    'default': Star,
};

const getAchievementIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    for (const key in achievementIcons) {
        if (lowerTitle.includes(key)) {
            return achievementIcons[key];
        }
    }
    return achievementIcons['default'];
};


export const ResumeTemplate: React.FC<{ resumeData: ResumeData }> = ({ resumeData }) => {
    if (!resumeData) {
        return <div className="p-12 text-center">Loading resume data...</div>;
    }

    const { name, title, contact, summary, experience, education, projects, skills, keyAchievements, training } = resumeData;
    const AchievementIcon = keyAchievements.length > 0 ? getAchievementIcon(keyAchievements[0].title) : Star;


    return (
        <div className="bg-white text-gray-800 font-sans leading-normal flex" style={{ width: '816px', minHeight: '1056px' }}>
           {/* Left Sidebar */}
            <aside className="w-[34%] bg-[#0e3d4e] text-white p-6 flex flex-col">
                <h1 className="text-3xl font-bold uppercase tracking-tight mb-10 text-white">{name}</h1>
                
                {projects?.length > 0 && (
                    <SidebarSection title="Projects">
                        <div className="space-y-4">
                            {projects.map((proj, i) => (
                                <div key={i}>
                                    <h3 className="font-bold text-sm text-white">{proj.title}</h3>
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
                            {keyAchievements.map((ach, i) => {
                                const Icon = getAchievementIcon(ach.title);
                                return (
                                    <div key={i} className="flex items-start">
                                        <Icon className="w-4 h-4 mr-3 mt-0.5 text-white shrink-0" />
                                        <div>
                                            <h3 className="font-bold text-sm text-white">{ach.title}</h3>
                                            <p className="text-xs text-gray-300 mt-1">{ach.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
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
                                <h3 className="font-bold text-sm text-white">{course.title}</h3>
                                <p className="text-xs text-gray-300">{course.description}</p>
                            </div>
                        ))}
                        </div>
                    </SidebarSection>
                )}

                <div className="mt-auto pt-6">
                    <p className="text-xs text-gray-400">Powered by AI Mentor</p>
                </div>

            </aside>

            {/* Main Content */}
            <main className="w-[66%] bg-white p-8">
                <header className="mb-6">
                    <h2 className="text-lg font-medium text-gray-600">{title}</h2>
                    <div className="flex flex-wrap text-xs text-gray-500 mt-2 gap-x-3 gap-y-1 items-center">
                        {contact?.phone && <span className="flex items-center gap-1.5"><Phone size={12} /> {contact.phone}</span>}
                        {contact?.email && <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600"><Mail size={12} /> {contact.email}</a>}
                        {contact?.linkedin && <a href={contact.linkedin} className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600"><Linkedin size={12} /> linkedin.com</a>}
                        {contact?.location && <span className="flex items-center gap-1.5"><MapPin size={12} /> {contact.location}</span>}
                    </div>
                </header>

                {summary && (
                    <MainSection title="Summary">
                        <p className="text-xs text-gray-700">{summary}</p>
                    </MainSection>
                )}

                {experience?.length > 0 && (
                    <MainSection title="Experience">
                        <div className="space-y-4">
                            {experience.map((exp, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="text-sm font-bold text-gray-800">{exp.title}</h3>
                                        <p className="text-xs text-gray-500 font-medium">{exp.dates}</p>
                                    </div>
                                    <div className="flex justify-between items-baseline mb-1">
                                       <p className="text-sm font-semibold text-blue-600">{exp.company}</p>
                                       {exp.location && <p className="text-xs text-gray-500">{exp.location}</p>}
                                    </div>
                                    <ul className="space-y-1 list-disc pl-4 text-xs text-gray-700">
                                        {exp.bullets.map((bullet, j) => <li key={j} className="pl-1">{bullet}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </MainSection>
                )}
                
                 {education?.length > 0 && (
                     <MainSection title="Education">
                         <div className="space-y-3">
                            {education.map((edu, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="text-sm font-bold">{edu.degree}</h3>
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
