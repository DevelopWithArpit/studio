'use client';

import React from 'react';

type ResumeSectionProps = {
  title: string;
  children: React.ReactNode;
};

const ResumeSection: React.FC<ResumeSectionProps> = ({ title, children }) => (
  <div className="mb-4">
    <h2 className="text-sm font-bold uppercase tracking-wider border-b-2 border-black pb-1 mb-2">{title}</h2>
    <div className="text-sm text-gray-800">
        {children}
    </div>
  </div>
);

type ExperienceItemProps = {
    title: string;
    company: string;
    date: string;
    points: string[];
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({ title, company, date, points}) => (
    <div className="mb-3">
        <h3 className="text-base font-bold">{title} | {company} | {date}</h3>
        <ul className="list-disc pl-5 mt-1">
            {points.map((point, i) => <li key={i} className="mb-1">{point}</li>)}
        </ul>
    </div>
);

type EducationItemProps = {
    degree: string;
    institution: string;
    date: string;
}

const EducationItem: React.FC<EducationItemProps> = ({ degree, institution, date }) => (
    <div className="mb-3">
        <h3 className="text-base font-bold">{degree} | {institution}</h3>
        <p className="meta-info text-sm text-gray-600 mb-1">{date}</p>
    </div>
);

const parseResumeText = (text: string) => {
    const sections: Record<string, string> = {};
    const lines = text.split('\n');
    
    const name = lines[0];
    const role = lines[1];
    const contactInfoLine = lines[2];
    
    let currentSection = '';
    lines.slice(3).forEach(line => {
        const trimmedLine = line.trim();
        if (['SUMMARY', 'EXPERIENCE', 'EDUCATION', 'KEY ACHIEVEMENTS', 'SKILLS', 'PROJECTS'].includes(trimmedLine)) {
            currentSection = trimmedLine;
            sections[currentSection] = '';
        } else if (currentSection && trimmedLine) {
            sections[currentSection] += line + '\n';
        }
    });

    const experienceItems = sections.EXPERIENCE?.split('\n\n').filter(p => p.trim()).map(p => {
        const lines = p.split('\n').filter(l => l.trim());
        const titleLine = lines.shift() || '';
        const [title, company, date] = titleLine.split(' | ').map(s => s.trim());
        return { title, company, date, points: lines};
    }).filter(item => item.title && item.company && item.date);

    const educationItems = sections.EDUCATION?.split('\n\n').filter(p => p.trim()).map(p => {
        const lines = p.split('\n').filter(l => l.trim());
        const [degree, institution, date] = lines[0].split('|').map(s => s.trim());
        return { degree, institution, date };
    }).filter(item => item.degree && item.institution && item.date);

    return {
        name,
        role,
        contactInfo: contactInfoLine,
        summary: sections.SUMMARY?.trim(),
        experience: experienceItems,
        education: educationItems,
    };
};

export const ResumeTemplate: React.FC<{ resumeText: string }> = ({ resumeText }) => {
    
    const data = parseResumeText(resumeText);
    
    return (
    <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", backgroundColor: '#fff', color: '#333', padding: '2.5em' }}>
      <div className="container max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-right mb-6">
          <h1 className="text-4xl font-bold text-black mb-1">{data.name}</h1>
          <p className="text-sm text-blue-600">{data.contactInfo}</p>
        </div>

        {/* Main Content */}
        <div className="main-content">
            {data.summary && (
                <ResumeSection title="SUMMARY">
                    <p className="whitespace-pre-line">{data.summary}</p>
                </ResumeSection>
            )}
            
            {data.experience && data.experience.length > 0 && (
                <ResumeSection title="EXPERIENCE">
                    {data.experience.map((item, index) => (
                        <ExperienceItem key={index} {...item} />
                    ))}
                </ResumeSection>
            )}

            {data.education && data.education.length > 0 && (
                <ResumeSection title="EDUCATION">
                    {data.education.map((item, index) => (
                        <EducationItem key={index} {...item} />
                    ))}
                </ResumeSection>
            )}
        </div>
      </div>
    </div>
  );
};
