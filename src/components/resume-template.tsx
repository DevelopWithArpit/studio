'use client';

import React from 'react';

type ResumeSectionProps = {
  title: string;
  children: React.ReactNode;
};

const ResumeSection: React.FC<ResumeSectionProps> = ({ title, children }) => (
  <div className="section mb-4">
    <h2 className="section-title text-sm font-bold uppercase tracking-wider text-black border-b-2 border-black pb-1 mb-3">{title}</h2>
    <div className="section-content text-sm text-gray-700">
        {children}
    </div>
  </div>
);

type ExperienceItemProps = {
    title: string;
    company: string;
    date: string;
    location?: string;
    points: string[];
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({ title, company, date, location, points}) => (
    <div className="experience-item mb-3">
        <h3 className="text-base font-bold text-black">{title} | {company} | {date}</h3>
        {location && <p className="meta-info text-sm text-gray-600 mb-1">{location}</p>}
        <ul className="list-disc pl-5 mt-1">
            {points.map((point, i) => <li key={i} className="mb-1">{point}</li>)}
        </ul>
    </div>
);

type EducationItemProps = {
    degree: string;
    institution: string;
    date: string;
    location?: string;
}

const EducationItem: React.FC<EducationItemProps> = ({ degree, institution, date, location }) => (
    <div className="education-item mb-3">
        <h3 className="text-base font-bold text-black">{degree} | {institution}</h3>
        <p className="meta-info text-sm text-gray-600 mb-1">{date} {location && `| ${location}`}</p>
    </div>
);


type AchievementItemProps = {
    points: string[];
}

const AchievementItem: React.FC<AchievementItemProps> = ({ points }) => (
     <ul className="list-disc pl-5 mt-1">
        {points.map((point, i) => <li key={i} className="mb-1">{point}</li>)}
    </ul>
);

type ProjectItemProps = {
    title: string;
    date: string;
    description: string;
    points?: string[];
}

const ProjectItem: React.FC<ProjectItemProps> = ({ title, date, description, points }) => (
    <div className="project-item mb-3">
        <h3 className="text-base font-bold text-black">{title} | {date}</h3>
        <p className="text-sm text-gray-600 mb-1">{description}</p>
        {points && (
             <ul className="list-disc pl-5 mt-1">
                {points.map((point, i) => <li key={i} className="mb-1">{point}</li>)}
            </ul>
        )}
    </div>
);


const parseResumeText = (text: string) => {
    const sections: Record<string, string> = {};
    const lines = text.split('\n');
    
    const name = lines[0];
    const role = lines[1];
    const contactInfo = lines[2].split(' | ');
    
    let currentSection = '';
    lines.slice(4).forEach(line => {
        if (['SUMMARY', 'EXPERIENCE', 'EDUCATION', 'KEY ACHIEVEMENTS', 'SKILLS', 'PROJECTS'].includes(line.trim())) {
            currentSection = line.trim();
            sections[currentSection] = '';
        } else if (currentSection) {
            sections[currentSection] += line + '\n';
        }
    });

    const experienceItems = sections.EXPERIENCE?.split('\n\n').filter(p => p.trim()).map(p => {
        const lines = p.split('\n').filter(l => l.trim());
        const [titleLine, ...points] = lines;
        const [title, company, date, location] = titleLine.split(' | ').map(s => s.trim());
        return { title, company, date, location, points};
    });

    const educationItems = sections.EDUCATION?.split('\n\n').filter(p => p.trim()).map(p => {
        const lines = p.split('\n').filter(l => l.trim());
        const [degree, institution, date, location] = lines[0].split('|').map(s => s.trim());
        return { degree, institution, date, location };
    });

    const achievementPoints = sections['KEY ACHIEVEMENTS']?.split('\n').filter(l => l.trim());
    
    const skills = sections.SKILLS?.split(',').map(s => s.trim()).filter(s => s);

    const projectItems = sections.PROJECTS?.split('\n\n').filter(p => p.trim()).map(p => {
        const lines = p.split('\n').filter(l => l.trim());
        const [title, date, description] = lines[0].split('|').map(s => s.trim());
        return { title, date, description, points: lines.slice(1) };
    });

    return {
        name,
        role,
        contact: {
            phone: contactInfo[0],
            email: contactInfo[1],
            linkedin: contactInfo[2],
            location: contactInfo[3],
        },
        summary: sections.SUMMARY,
        experience: experienceItems,
        education: educationItems,
        achievements: achievementPoints,
        skills,
        projects: projectItems,
    };
};

export const ResumeTemplate: React.FC<{ resumeText: string }> = ({ resumeText }) => {
    
    const data = parseResumeText(resumeText);
    
    return (
    <div style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", backgroundColor: '#fff', color: '#333', padding: '2em' }}>
      <style>
        {`
          .skill-tag {
            background-color: #f0f0f0;
            padding: 0.3em 0.6em;
            border-radius: 4px;
            font-size: 0.85em;
            display: inline-block;
            margin: 0.2em;
          }
        `}
      </style>
      <div className="container max-w-4xl mx-auto">
        {/* Header */}
        <div className="header text-center mb-6">
          <h1 className="text-4xl font-bold text-black mb-0">{data.name}</h1>
          <h2 className="text-lg font-normal text-blue-600 mb-2">{data.role}</h2>
          <div className="contact-info text-xs text-gray-600 flex justify-center gap-x-4">
            <span>{data.contact.phone}</span>
            <span>{data.contact.email}</span>
            <span>{data.contact.linkedin}</span>
            <span>{data.contact.location}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content flex gap-x-8">
          {/* Left Column */}
          <div className="left-column" style={{ width: '65%' }}>
            <ResumeSection title="SUMMARY">
              <p>{data.summary}</p>
            </ResumeSection>
            
            <ResumeSection title="EXPERIENCE">
              {data.experience?.map((item, index) => (
                <ExperienceItem key={index} {...item} />
              ))}
            </ResumeSection>

            <ResumeSection title="EDUCATION">
                {data.education?.map((item, index) => (
                    <EducationItem key={index} {...item} />
                ))}
            </ResumeSection>
          </div>

          {/* Right Column */}
          <div className="right-column" style={{ width: '35%' }}>
            <div className="flex justify-center mb-6">
                 <div className="profile-pic-placeholder w-28 h-28 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">
                        {data.name?.split(' ').map(n => n[0]).join('')}
                    </span>
                </div>
            </div>

            <ResumeSection title="KEY ACHIEVEMENTS">
                <AchievementItem points={data.achievements || []} />
            </ResumeSection>

            <ResumeSection title="SKILLS">
                <div className="skills-container flex flex-wrap">
                    {data.skills?.map(skill => <span key={skill} className="skill-tag">{skill}</span>)}
                </div>
            </ResumeSection>

             <ResumeSection title="PROJECTS">
                {data.projects?.map((item, index) => (
                    <ProjectItem key={index} {...item} />
                ))}
            </ResumeSection>
          </div>
        </div>
      </div>
    </div>
  );
};
