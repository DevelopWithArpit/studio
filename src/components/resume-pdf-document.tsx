
'use client';

import React from 'react';
import { Page, Text, View, Document, StyleSheet, Link, Font } from '@react-pdf/renderer';
import type { GetResumeFeedbackOutput } from '@/ai/flows/resume-feedback-tool';

type ResumeData = GetResumeFeedbackOutput['rewrittenResume'];

// Register fonts
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcC-3FwrK3iLTeHuS_fvQtMwCp50KnMa25L7SU-K.woff2', fontWeight: 500 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcC-3FwrK3iLTeHuS_fvQtMwCp50KnMa25L7SU-K.woff2', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    fontFamily: 'Inter',
    fontSize: 9,
    lineHeight: 1.4,
    color: '#2d3748',
  },
  sidebar: {
    width: '33%',
    backgroundColor: '#0e3d4e',
    color: '#ffffff',
    padding: 24,
  },
  mainContent: {
    width: '67%',
    padding: 32,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: -1,
    marginBottom: 32,
  },
  sidebarSection: {
    marginBottom: 24,
  },
  sidebarSectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 1.5,
    borderBottomColor: '#cbd5e0',
    paddingBottom: 4,
    marginBottom: 12,
  },
  projectTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  projectDescription: {
    fontSize: 8,
    color: '#d1d5db',
    marginBottom: 2,
  },
  projectLink: {
    fontSize: 8,
    color: '#93c5fd',
    textDecoration: 'none',
  },
  projectContainer: {
    marginBottom: 12,
  },
  achievementContainer: {
    marginBottom: 12,
  },
  achievementTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 8,
    color: '#d1d5db',
  },
  skills: {
    fontSize: 8,
    color: '#d1d5db',
  },
  trainingContainer: {
    marginBottom: 8,
  },
  trainingTitle: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  trainingDescription: {
    fontSize: 8,
    color: '#d1d5db',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'medium',
    color: '#4a5568',
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 8,
    color: '#6b7280',
    marginTop: 8,
    marginBottom: 24,
    gap: 12,
  },
  contactLink: {
     color: '#2563eb',
     textDecoration: 'none',
  },
  mainSection: {
    marginBottom: 24,
  },
  mainSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#4a5568',
    letterSpacing: 1,
    borderBottomWidth: 1.5,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 4,
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 9,
    color: '#4a5568',
  },
  experienceItem: {
    marginBottom: 20,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  expDates: {
    fontSize: 8,
    color: '#6b7280',
    fontWeight: 'medium',
  },
  companyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  companyName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  location: {
    fontSize: 8,
    color: '#6b7280',
  },
  bulletPoint: {
    flexDirection: 'row',
    marginTop: 2,
  },
  bullet: {
    width: 10,
    fontSize: 9,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
  },
  educationItem: {
    marginBottom: 16,
  },
  degree: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  schoolName: {
     fontSize: 10,
     fontWeight: 'bold',
     color: '#2563eb',
  },
});

export const ResumePdfDocument: React.FC<{ resumeData: ResumeData }> = ({ resumeData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Sidebar */}
      <View style={styles.sidebar}>
        <Text style={styles.name}>{resumeData.name}</Text>
        
        {resumeData.projects?.length > 0 && (
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Projects</Text>
            {resumeData.projects.map((proj, i) => (
              <View key={i} style={styles.projectContainer}>
                <Text style={styles.projectTitle}>{proj.title}</Text>
                <Text style={styles.projectDescription}>{proj.description}</Text>
                {proj.link && <Link src={proj.link} style={styles.projectLink}>{proj.link}</Link>}
              </View>
            ))}
          </View>
        )}

        {resumeData.keyAchievements?.length > 0 && (
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Key Achievements</Text>
            {resumeData.keyAchievements.map((ach, i) => (
              <View key={i} style={styles.achievementContainer}>
                <Text style={styles.achievementTitle}>{ach.title}</Text>
                <Text style={styles.achievementDescription}>{ach.description}</Text>
              </View>
            ))}
          </View>
        )}

        {resumeData.skills?.length > 0 && (
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Skills</Text>
            <Text style={styles.skills}>{resumeData.skills.join(', ')}</Text>
          </View>
        )}

        {resumeData.training?.length > 0 && (
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarSectionTitle}>Training / Courses</Text>
            {resumeData.training.map((course, i) => (
              <View key={i} style={styles.trainingContainer}>
                <Text style={styles.trainingTitle}>{course.title}</Text>
                <Text style={styles.trainingDescription}>{course.description}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <Text style={styles.headerTitle}>{resumeData.title}</Text>
        <View style={styles.contactInfo}>
            {resumeData.contact.phone && <Text>{resumeData.contact.phone}</Text>}
            {resumeData.contact.email && <Link src={`mailto:${resumeData.contact.email}`} style={styles.contactLink}>{resumeData.contact.email}</Link>}
            {resumeData.contact.linkedin && <Link src={resumeData.contact.linkedin} style={styles.contactLink}>{resumeData.contact.linkedin}</Link>}
            {resumeData.contact.github && <Link src={resumeData.contact.github} style={styles.contactLink}>{resumeData.contact.github}</Link>}
            {resumeData.contact.location && <Text>{resumeData.contact.location}</Text>}
        </View>

        {resumeData.summary && (
          <View style={styles.mainSection}>
            <Text style={styles.mainSectionTitle}>Summary</Text>
            <Text style={styles.summaryText}>{resumeData.summary}</Text>
          </View>
        )}

        {resumeData.experience?.length > 0 && (
          <View style={styles.mainSection}>
            <Text style={styles.mainSectionTitle}>Experience</Text>
            {resumeData.experience.map((exp, i) => (
              <View key={i} style={styles.experienceItem}>
                <View style={styles.expHeader}>
                  <Text style={styles.jobTitle}>{exp.title}</Text>
                  <Text style={styles.expDates}>{exp.dates}</Text>
                </View>
                 <View style={styles.companyHeader}>
                    <Text style={styles.companyName}>{exp.company}</Text>
                    {exp.location && <Text style={styles.location}>{exp.location}</Text>}
                 </View>
                <View style={{marginTop: 8}}>
                    {exp.bullets.map((bullet, j) => (
                        <View key={j} style={styles.bulletPoint}>
                            <Text style={styles.bullet}>• </Text>
                            <Text style={styles.bulletText}>{bullet}</Text>
                        </View>
                    ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {resumeData.education?.length > 0 && (
          <View style={styles.mainSection}>
            <Text style={styles.mainSectionTitle}>Education</Text>
            {resumeData.education.map((edu, i) => (
              <View key={i} style={styles.educationItem}>
                <View style={styles.expHeader}>
                    <Text style={styles.degree}>{edu.degree}</Text>
                    <Text style={styles.expDates}>{edu.dates}</Text>
                </View>
                 <View style={styles.companyHeader}>
                    <Text style={styles.schoolName}>{edu.school}</Text>
                    {edu.location && <Text style={styles.location}>{edu.location}</Text>}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </Page>
  </Document>
);
