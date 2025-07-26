'use client';

import React from 'react';

type ResumeSectionProps = {
  title: string;
  children: React.ReactNode;
};

const ResumeSection: React.FC<ResumeSectionProps> = ({ title, children }) => (
  <div className="mb-6">
    <h2 className="text-base font-bold uppercase tracking-widest border-b border-black pb-1 mb-3">{title}</h2>
    <div className="text-sm whitespace-pre-line text-gray-800">
        {children}
    </div>
  </div>
);

const parseResumeText = (text: string) => {
    const sections: Record<string, string> = {};
    const lines = text.split('\n');
    
    // The first few lines are consistent: Name, Title, Contact
    const name = lines.shift() || '';
    // This template doesn't use the title line, but we remove it to align with the parser logic
    lines.shift(); 
    const contactInfo = lines.shift() || '';
    
    let currentSection = '';
    lines.forEach(line => {
        const trimmedLine = line.trim();
        // Check for section headers
        if (['SUMMARY', 'EXPERIENCE', 'EDUCATION', 'KEY ACHIEVEMENTS', 'SKILLS', 'PROJECTS'].includes(trimmedLine)) {
            currentSection = trimmedLine;
            sections[currentSection] = '';
        } else if (currentSection) {
            // Append the original line (with leading/trailing spaces) to preserve formatting
            sections[currentSection] += line + '\n';
        }
    });

    // Trim trailing newline from each section
    for (const key in sections) {
        sections[key] = sections[key].trimEnd();
    }

    return {
        name,
        contactInfo,
        sections,
    };
};

export const ResumeTemplate: React.FC<{ resumeText: string }> = ({ resumeText }) => {
    
    const data = parseResumeText(resumeText);
    
    return (
    <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", backgroundColor: '#fff', color: '#333', padding: '2.5rem' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-right mb-8">
          <h1 className="text-4xl font-bold text-black">{data.name}</h1>
          <p className="text-sm text-blue-600 mt-1">{data.contactInfo}</p>
        </div>

        {/* Main Content */}
        <div>
            {data.sections.SUMMARY && (
                <ResumeSection title="SUMMARY">
                    {data.sections.SUMMARY}
                </ResumeSection>
            )}
             {data.sections.EXPERIENCE && (
                <ResumeSection title="EXPERIENCE">
                    {data.sections.EXPERIENCE}
                </ResumeSection>
            )}
            {data.sections.EDUCATION && (
                <ResumeSection title="EDUCATION">
                    {data.sections.EDUCATION}
                </ResumeSection>
            )}
            {data.sections['KEY ACHIEVEMENTS'] && (
                <ResumeSection title="KEY ACHIEVEMENTS">
                    {data.sections['KEY ACHIEVEMENTS']}
                </ResumeSection>
            )}
            {data.sections.SKILLS && (
                <ResumeSection title="SKILLS">
                    {data.sections.SKILLS}
                </ResumeSection>
            )}
            {data.sections.PROJECTS && (
                <ResumeSection title="PROJECTS">
                    {data.sections.PROJECTS}
                </ResumeSection>
            )}
        </div>
      </div>
    </div>
  );
};
