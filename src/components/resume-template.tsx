
'use client';
import React from 'react';

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
        <h2 className="text-sm font-bold uppercase tracking-wider text-white border-b border-gray-400 pb-2 mb-3">{title}</h2>
        {children}
    </section>
);

const MainSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 border-b-2 border-gray-200 pb-2 mb-3">{title}</h2>
        {children}
    </section>
);

export const ResumeTemplate: React.FC<{ resumeData: ResumeData }> = ({ resumeData }) => {
    if (!resumeData) {
        return <div className="p-12 text-center">Loading resume data...</div>;
    }

    const { name, title, contact, summary, experience, education, projects, skills, keyAchievements, training } = resumeData;

    return (
        <div className="bg-gray-100 flex font-sans" style={{ width: '816px', minHeight: '1056px' }}>
            {/* Sidebar */}
            <aside className="w-[35%] bg-gray-800 text-white p-6">
                {skills?.length > 0 && (
                     <SidebarSection title="Skills">
                        <p className="text-sm text-gray-300">{skills.join(', ')}</p>
                    </SidebarSection>
                )}

                {projects?.length > 0 && (
                    <SidebarSection title="Projects">
                        <div className="space-y-4">
                            {projects.map((proj, i) => (
                                <div key={i}>
                                    <h3 className="font-bold text-base text-white">{proj.title}</h3>
                                    <p className="text-sm text-gray-300 mt-1" dangerouslySetInnerHTML={{ __html: proj.description.replace(/•/g, '<br/>•') }} />
                                    {proj.link && <a href={proj.link} className="text-sm text-cyan-400 hover:underline break-all">{proj.link}</a>}
                                </div>
                            ))}
                        </div>
                    </SidebarSection>
                )}

                {keyAchievements?.length > 0 && (
                    <SidebarSection title="Key Achievements">
                         <div className="space-y-4">
                            {keyAchievements.map((ach, i) => {
                                return (
                                    <div key={i} className="flex items-start">
                                        <div>
                                            <h3 className="font-bold text-base text-white">{ach.title}</h3>
                                            <p className="text-sm text-gray-300 mt-1">{ach.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </SidebarSection>
                )}
                
                {training?.length > 0 && (
                    <SidebarSection title="Training & Courses">
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
            </aside>

            {/* Main Content */}
            <main className="w-[65%] bg-white p-8">
                <header className="text-center mb-6">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-800 mb-1">{name}</h1>
                    <p className="text-md font-medium text-gray-600">{title}</p>
                    <div className="text-xs text-gray-500 mt-3 flex justify-center items-center flex-wrap gap-x-4">
                        {contact?.email && <span>{contact.email}</span>}
                        {contact?.phone && <span>{contact.phone}</span>}
                        {contact?.linkedin && <a href={contact.linkedin} className="text-blue-600 hover:underline">LinkedIn</a>}
                        {contact?.github && <a href={contact.github} className="text-blue-600 hover:underline">GitHub</a>}
                        {contact?.location && <span>{contact.location}</span>}
                    </div>
                     <hr className="mt-4 border-t-2 border-gray-200" />
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
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="text-base font-bold text-gray-800">{exp.title}</h3>
                                        <p className="text-sm text-gray-500 font-medium">{exp.dates}</p>
                                    </div>
                                    <div className="flex justify-between items-baseline mb-1">
                                       <p className="text-sm font-semibold italic text-gray-600">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                                    </div>
                                    <ul className="space-y-1 list-disc pl-5 text-sm text-gray-700">
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
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="text-base font-bold">{edu.degree}</h3>
                                        <p className="text-sm text-gray-500 font-medium">{edu.dates}</p>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <p className="text-sm font-semibold italic text-gray-600">{edu.school}{edu.location ? `, ${edu.location}` : ''}</p>
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
