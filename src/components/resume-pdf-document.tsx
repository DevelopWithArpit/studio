
'use client';
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import type { GetResumeFeedbackOutput } from '@/ai/flows/resume-feedback-tool';

type ResumeData = GetResumeFeedbackOutput['rewrittenResume'];

// Register fonts
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcC-3FwrK3iLTeHuS_fvQtMwCp50KnMa2ZL7W0Q5nw.woff2', fontWeight: 500 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcC-3FwrK3iLTeHuS_fvQtMwCp50KnMa2ZL7W0Q5nw.woff2', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2', fontWeight: 700 },
   ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    fontFamily: 'Inter',
    fontSize: 9,
    color: '#374151', // text-gray-700
  },
  sidebar: {
    width: '33%',
    backgroundColor: '#0e3d4e',
    padding: 24,
    color: '#ffffff',
  },
  mainContent: {
    width: '67%',
    padding: 32,
  },
  // Sidebar Styles
  sidebarName: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: -0.5,
    marginBottom: 20,
    color: '#ffffff',
  },
  sidebarSection: {
    marginBottom: 20,
  },
  sidebarSectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderBottomColor: '#6b7280', // gray-500
    paddingBottom: 2,
    marginBottom: 8,
    color: '#d1d5db', // gray-300
  },
  sidebarText: {
    fontSize: 8.5,
    lineHeight: 1.5,
    color: '#d1d5db', // gray-300
  },
  sidebarProjectTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  sidebarLink: {
    fontSize: 8,
    color: '#93c5fd', // blue-300
    textDecoration: 'none',
  },
  // Main Content Styles
  mainHeader: {
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 14,
    fontWeight: 'medium',
    color: '#4b5563', // gray-600
  },
  contactLine: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    fontSize: 8,
    color: '#6b7280',
  },
  contactItem: {
    marginRight: 10,
  },
  mainSection: {
    marginBottom: 20,
  },
  mainSectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#4b5563', // gray-600
    borderBottomWidth: 1.5,
    borderBottomColor: '#e5e7eb', // gray-200
    paddingBottom: 2,
    marginBottom: 8,
  },
  mainText: {
    fontSize: 9,
    lineHeight: 1.4,
  },
  jobEntry: {
    marginBottom: 12,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  dates: {
    fontSize: 8,
    color: '#6b7280', // gray-500
  },
  companyLine: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'baseline',
     marginBottom: 4,
  },
  companyName: {
    fontSize: 10,
    fontWeight: 600,
    color: '#2563eb', // blue-600
  },
  location: {
     fontSize: 8,
     color: '#6b7280', // gray-500
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bullet: {
    width: 10,
    fontSize: 10,
    lineHeight: 1.4
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.4
  },
});

export const ResumePdfDocument: React.FC<{ resumeData: ResumeData }> = ({ resumeData }) => {
    const { name, title, contact, summary, experience, education, projects, skills, keyAchievements, training } = resumeData;
    
    return (
    <Document author={name} title={`Resume for ${name}`}>
      <Page size="A4" style={styles.page}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
            <Text style={styles.sidebarName}>{name}</Text>
            
            {projects?.length > 0 && (
                <View style={styles.sidebarSection}>
                    <Text style={styles.sidebarSectionTitle}>Projects</Text>
                    {projects.map((proj, i) => (
                        <View key={i} style={{ marginBottom: 10 }}>
                            <Text style={styles.sidebarProjectTitle}>{proj.title}</Text>
                            <Text style={styles.sidebarText}>{proj.description}</Text>
                            {proj.link && <Text style={styles.sidebarLink}>{proj.link}</Text>}
                        </View>
                    ))}
                </View>
            )}

            {keyAchievements?.length > 0 && (
                <View style={styles.sidebarSection}>
                    <Text style={styles.sidebarSectionTitle}>Key Achievements</Text>
                    {keyAchievements.map((ach, i) => (
                        <View key={i} style={{ marginBottom: 10 }}>
                            <Text style={styles.sidebarProjectTitle}>{ach.title}</Text>
                            <Text style={styles.sidebarText}>{ach.description}</Text>
                        </View>
                    ))}
                </View>
            )}

            {skills?.length > 0 && (
                <View style={styles.sidebarSection}>
                    <Text style={styles.sidebarSectionTitle}>Skills</Text>
                    <Text style={styles.sidebarText}>{skills.join(', ')}</Text>
                </View>
            )}

             {training?.length > 0 && (
                <View style={styles.sidebarSection}>
                    <Text style={styles.sidebarSectionTitle}>Training / Courses</Text>
                     {training.map((course, i) => (
                        <View key={i} style={{ marginBottom: 6 }}>
                            <Text style={styles.sidebarProjectTitle}>{course.title}</Text>
                            <Text style={styles.sidebarText}>{course.description}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
            <View style={styles.mainHeader}>
                <Text style={styles.mainTitle}>{title}</Text>
                <View style={styles.contactLine}>
                    {contact?.phone && <Text style={styles.contactItem}>{contact.phone}</Text>}
                    {contact?.email && <Text style={styles.contactItem}>{contact.email}</Text>}
                    {contact?.linkedin && <Text style={styles.contactItem}>{contact.linkedin}</Text>}
                    {contact?.location && <Text style={styles.contactItem}>{contact.location}</Text>}
                </View>
            </View>

            {summary && (
                <View style={styles.mainSection}>
                    <Text style={styles.mainSectionTitle}>Summary</Text>
                    <Text style={styles.mainText}>{summary}</Text>
                </View>
            )}

            {experience?.length > 0 && (
                <View style={styles.mainSection}>
                    <Text style={styles.mainSectionTitle}>Experience</Text>
                    {experience.map((exp, i) => (
                        <View key={i} style={styles.jobEntry}>
                            <View style={styles.jobHeader}>
                                <Text style={styles.jobTitle}>{exp.title}</Text>
                                <Text style={styles.dates}>{exp.dates}</Text>
                            </View>
                            <View style={styles.companyLine}>
                                <Text style={styles.companyName}>{exp.company}</Text>
                                <Text style={styles.location}>{exp.location}</Text>
                            </View>
                            {exp.bullets.map((bullet, j) => (
                                <View key={j} style={styles.bulletPoint}>
                                    <Text style={styles.bullet}>• </Text>
                                    <Text style={styles.bulletText}>{bullet}</Text>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>
            )}

            {education?.length > 0 && (
                <View style={styles.mainSection}>
                    <Text style={styles.mainSectionTitle}>Education</Text>
                     {education.map((edu, i) => (
                        <View key={i} style={{marginBottom: 8}}>
                             <View style={styles.jobHeader}>
                                <Text style={styles.jobTitle}>{edu.degree}</Text>
                                <Text style={styles.dates}>{edu.dates}</Text>
                            </View>
                             <View style={styles.companyLine}>
                                <Text style={styles.companyName}>{edu.school}</Text>
                                <Text style={styles.location}>{edu.location}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </View>
      </Page>
    </Document>
)};
