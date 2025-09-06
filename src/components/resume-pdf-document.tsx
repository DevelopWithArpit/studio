'use client';

import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Link } from '@react-pdf/renderer';
import type { GetResumeFeedbackOutput } from '@/ai/flows/resume-feedback-tool';

type ResumeData = GetResumeFeedbackOutput['rewrittenResume'];

// Register fonts
Font.register({
    family: 'Inter',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2', fontWeight: 400 },
        { src: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2ZL7.woff2', fontWeight: 500 },
        { src: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa8ZL7.woff2', fontWeight: 700 },
    ],
});

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        fontFamily: 'Inter',
        fontSize: 9,
        lineHeight: 1.4,
        color: '#2d3748', // gray-800
    },
    sidebar: {
        width: '33%',
        padding: 24,
        backgroundColor: '#0e3d4e', // Custom dark teal
        color: '#FFFFFF',
    },
    mainContent: {
        width: '67%',
        padding: 32,
    },
    // Header
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: '#FFFFFF',
        marginBottom: 40,
    },
    title: {
        fontSize: 14,
        fontWeight: 'medium',
        color: '#718096', // gray-500
    },
    contactInfo: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
        fontSize: 8,
        color: '#a0aec0', // gray-400
        gap: 8,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    link: {
        color: '#63b3ed', // blue-300
        textDecoration: 'none',
    },

    // Sections
    mainSection: {
        marginBottom: 20,
    },
    sidebarSection: {
        marginBottom: 24,
    },
    sectionTitleMain: {
        fontSize: 11,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: '#4a5568', // gray-600
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0', // gray-200
        paddingBottom: 4,
        marginBottom: 12,
    },
     sectionTitleSidebar: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: '#cbd5e0', // gray-300
        borderBottomWidth: 0.5,
        borderBottomColor: '#718096', // gray-500
        paddingBottom: 4,
        marginBottom: 12,
    },
    
    // Experience
    expItem: {
        marginBottom: 16,
    },
    expHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    jobTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#2d3748', // gray-800
    },
    expDates: {
        fontSize: 8,
        color: '#718096',
    },
    company: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#3182ce', // blue-600
        marginBottom: 4,
    },
    bulletList: {
        paddingLeft: 10,
    },
    bullet: {
        flexDirection: 'row',
    },
    bulletText: {
       flex: 1,
       fontSize: 9,
    },

    // Education
    eduItem: {
        marginBottom: 12,
    },
    degree: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    school: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#3182ce', // blue-600
    },
    
    // Sidebar Content
    sidebarText: {
        fontSize: 9,
        color: '#e2e8f0', // gray-200
    },
    sidebarProject: {
        marginBottom: 16,
    },
    sidebarProjectTitle: {
        fontWeight: 'bold',
        fontSize: 10,
        color: '#FFFFFF',
    },
    sidebarAchievement: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
     sidebarAchievementText: {
        flex: 1,
    },

    summary: {
        fontSize: 9,
        color: '#4a5568', // gray-700
    },
});


const Bullet = ({ children }: { children: React.ReactNode }) => (
    <View style={styles.bullet}>
        <Text>• </Text>
        <Text style={styles.bulletText}>{children}</Text>
    </View>
);


export const ResumePdfDocument: React.FC<{ resumeData: ResumeData }> = ({ resumeData }) => {
    if (!resumeData) return null;
    const { name, title, contact, summary, experience, education, projects, skills, keyAchievements, training } = resumeData;

    return (
        <Document title={`Resume - ${name}`} author="AI Mentor">
            <Page size="A4" style={styles.page}>
                {/* Sidebar */}
                <View style={styles.sidebar}>
                    <Text style={styles.name}>{name}</Text>

                    {projects?.length > 0 && (
                        <View style={styles.sidebarSection}>
                            <Text style={styles.sectionTitleSidebar}>Projects</Text>
                            {projects.map((proj, i) => (
                                <View key={i} style={styles.sidebarProject}>
                                    <Text style={styles.sidebarProjectTitle}>{proj.title}</Text>
                                    <Text style={styles.sidebarText}>{proj.description}</Text>
                                    {proj.link && <Link src={proj.link} style={styles.link}>{proj.link}</Link>}
                                </View>
                            ))}
                        </View>
                    )}

                    {keyAchievements?.length > 0 && (
                        <View style={styles.sidebarSection}>
                            <Text style={styles.sectionTitleSidebar}>Key Achievements</Text>
                            {keyAchievements.map((ach, i) => (
                                <View key={i} style={styles.sidebarAchievement}>
                                    <Text style={{marginRight: 4}}>•</Text>
                                    <View style={styles.sidebarAchievementText}>
                                        <Text style={styles.sidebarProjectTitle}>{ach.title}</Text>
                                        <Text style={styles.sidebarText}>{ach.description}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                     {skills?.length > 0 && (
                        <View style={styles.sidebarSection}>
                            <Text style={styles.sectionTitleSidebar}>Skills</Text>
                            <Text style={styles.sidebarText}>{skills.join(', ')}</Text>
                        </View>
                    )}

                    {training?.length > 0 && (
                        <View style={styles.sidebarSection}>
                            <Text style={styles.sectionTitleSidebar}>Training / Courses</Text>
                             {training.map((course, i) => (
                                <View key={i} style={{marginBottom: 8}}>
                                    <Text style={styles.sidebarProjectTitle}>{course.title}</Text>
                                    <Text style={styles.sidebarText}>{course.description}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                </View>

                {/* Main Content */}
                <View style={styles.mainContent}>
                    <View style={{ marginBottom: 24 }}>
                        <Text style={styles.title}>{title}</Text>
                        <View style={styles.contactInfo}>
                            {contact.phone && <Text>{contact.phone}</Text>}
                            {contact.email && <Text>{contact.email}</Text>}
                            {contact.location && <Text>{contact.location}</Text>}
                            {contact.linkedin && <Link src={contact.linkedin} style={styles.link}>LinkedIn</Link>}
                            {contact.github && <Link src={contact.github} style={styles.link}>GitHub</Link>}
                        </View>
                    </View>
                    
                    {summary && (
                        <View style={styles.mainSection}>
                            <Text style={styles.sectionTitleMain}>Summary</Text>
                            <Text style={styles.summary}>{summary}</Text>
                        </View>
                    )}

                     {experience?.length > 0 && (
                        <View style={styles.mainSection}>
                            <Text style={styles.sectionTitleMain}>Experience</Text>
                            {experience.map((exp, i) => (
                                <View key={i} style={styles.expItem}>
                                    <View style={styles.expHeader}>
                                        <Text style={styles.jobTitle}>{exp.title}</Text>
                                        <Text style={styles.expDates}>{exp.dates}</Text>
                                    </View>
                                    <Text style={styles.company}>{`${exp.company}${exp.location ? `, ${exp.location}` : ''}`}</Text>
                                    <View style={styles.bulletList}>
                                        {exp.bullets.map((bullet, j) => <Bullet key={j}>{bullet}</Bullet>)}
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {education?.length > 0 && (
                        <View style={styles.mainSection}>
                            <Text style={styles.sectionTitleMain}>Education</Text>
                             {education.map((edu, i) => (
                                <View key={i} style={styles.eduItem}>
                                     <View style={styles.expHeader}>
                                        <Text style={styles.degree}>{edu.degree}</Text>
                                        <Text style={styles.expDates}>{edu.dates}</Text>
                                    </View>
                                    <Text style={styles.school}>{`${edu.school}${edu.location ? `, ${edu.location}` : ''}`}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </Page>
        </Document>
    );
}
