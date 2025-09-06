
import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  VerticalAlign,
} from 'docx';
import type { GetResumeFeedbackOutput } from '@/ai/flows/resume-feedback-tool';

type ResumeData = GetResumeFeedbackOutput['rewrittenResume'];

const FONT_FAMILY = 'Helvetica';
const ACCENT_COLOR = '0d243c';
const ACCENT_TEXT_COLOR = 'FFFFFF';
const TEXT_COLOR = '333333';
const LINK_COLOR = '4A90E2';

const createSection = (title: string, children: Paragraph[]) => [
  new Paragraph({
    children: [new TextRun({ text: title, bold: true, allCaps: true, color: TEXT_COLOR, size: 24 })],
    border: { bottom: { color: 'auto', space: 1, value: 'single', size: 12 } },
    spacing: { after: 150, before: 300 },
  }),
  ...children,
];

export function createResumeDocx(resumeData: ResumeData): Document {
  const { name, title, contact, summary, experience, education, projects, skills, keyAchievements, training } = resumeData;

  const leftColumnContent = [
    new Paragraph({
      children: [new TextRun({ text: name, bold: true, color: ACCENT_TEXT_COLOR, size: 56 })],
      spacing: { after: 200 },
    }),

    ...(projects.length > 0 ? [
      new Paragraph({
        children: [new TextRun({ text: 'Projects', bold: true, allCaps: true, color: ACCENT_TEXT_COLOR, size: 24 })],
        border: { bottom: { color: ACCENT_TEXT_COLOR, space: 1, value: 'single', size: 4 } },
        spacing: { after: 150, before: 300 },
      }),
      ...projects.flatMap(proj => [
        new Paragraph({
          children: [new TextRun({ text: proj.title, bold: true, color: ACCENT_TEXT_COLOR, size: 22 })],
          spacing: { after: 50 },
        }),
        new Paragraph({
          children: [new TextRun({ text: proj.description, color: 'DDDDDD', size: 20 })],
          spacing: { after: 150 },
        }),
      ]),
    ] : []),

     ...(keyAchievements.length > 0 ? [
      new Paragraph({
        children: [new TextRun({ text: 'Key Achievements', bold: true, allCaps: true, color: ACCENT_TEXT_COLOR, size: 24 })],
        border: { bottom: { color: ACCENT_TEXT_COLOR, space: 1, value: 'single', size: 4 } },
        spacing: { after: 150, before: 300 },
      }),
      ...keyAchievements.flatMap(ach => [
         new Paragraph({
          children: [new TextRun({ text: ach.title, bold: true, color: ACCENT_TEXT_COLOR, size: 22 })],
          spacing: { after: 50 },
        }),
        new Paragraph({
          children: [new TextRun({ text: ach.description, color: 'DDDDDD', size: 20 })],
          spacing: { after: 150 },
        }),
      ]),
    ] : []),

    ...(skills.length > 0 ? [
      new Paragraph({
        children: [new TextRun({ text: 'Skills', bold: true, allCaps: true, color: ACCENT_TEXT_COLOR, size: 24 })],
        border: { bottom: { color: ACCENT_TEXT_COLOR, space: 1, value: 'single', size: 4 } },
        spacing: { after: 150, before: 300 },
      }),
      new Paragraph({
        children: [new TextRun({ text: skills.join(', '), color: 'DDDDDD', size: 20 })],
      }),
    ] : []),
  ];
  
  const rightColumnContent = [
     new Paragraph({
        children: [new TextRun({ text: title, bold: true, color: ACCENT_COLOR, size: 36 })],
        spacing: { after: 50 },
    }),
    new Paragraph({
        children: [
            new TextRun({ text: [contact.phone, contact.email, contact.linkedin, contact.location, contact.github].filter(Boolean).join(' | '), color: TEXT_COLOR, size: 20 }),
        ],
        spacing: { after: 150 },
        border: { bottom: { color: 'auto', space: 1, value: 'single', size: 12 } },
    }),

    ...(summary ? createSection('Summary', [new Paragraph({ children: [new TextRun({text: summary, size: 20, color: TEXT_COLOR})]})]) : []),
    
    ...(experience.length > 0 ? createSection('Experience', experience.flatMap(exp => [
        new Paragraph({
            children: [
                new TextRun({ text: exp.title, bold: true, size: 22, color: TEXT_COLOR }),
            ],
            spacing: { after: 20 },
        }),
        new Paragraph({
            children: [
                new TextRun({ text: exp.company, color: LINK_COLOR, italics: true, size: 22 }),
                new TextRun({ text: `\t${exp.dates} | ${exp.location}`, color: '555555', size: 20 }),
            ],
             tabStops: [{ type: 'right', position: 5500 }]
        }),
        ...exp.bullets.map(bullet => new Paragraph({
            children: [new TextRun({text: bullet, size: 20, color: TEXT_COLOR})],
            bullet: { level: 0 },
            spacing: { after: 50 },
        })),
         new Paragraph({ text: '' }),
    ])) : []),

    ...(education.length > 0 ? createSection('Education', education.flatMap(edu => [
        new Paragraph({
            children: [
                 new TextRun({ text: edu.degree, bold: true, size: 22, color: TEXT_COLOR }),
                 new TextRun({ text: `\t${edu.dates}`, color: '555555', size: 20 }),
            ],
            tabStops: [{ type: 'right', position: 5500 }]
        }),
        new Paragraph({
             children: [
                 new TextRun({ text: edu.school, color: LINK_COLOR, italics: true, size: 22 }),
                 new TextRun({ text: `\t${edu.location}`, color: '555555', size: 20 }),
             ],
              tabStops: [{ type: 'right', position: 5500 }]
        }),
        new Paragraph({ text: '' }),
    ])) : []),

  ];


  const doc = new Document({
    creator: "AI Mentor",
    title: `Resume for ${name}`,
    styles: {
        default: {
            document: {
                run: {
                    font: FONT_FAMILY,
                },
            },
        },
    },
    sections: [{
      properties: {
        page: {
            margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
        },
      },
      children: [
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            columnWidths: [35, 65],
            borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
                insideHorizontal: { style: BorderStyle.NONE },
                insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: leftColumnContent,
                             shading: { fill: ACCENT_COLOR },
                             verticalAlign: VerticalAlign.TOP,
                             margins: { left: 200, right: 200, top: 200, bottom: 200 },
                             borders: { right: { style: BorderStyle.NONE } }
                        }),
                        new TableCell({
                            children: rightColumnContent,
                            verticalAlign: VerticalAlign.TOP,
                            margins: { left: 200, right: 200, top: 200, bottom: 200 },
                            borders: { left: { style: BorderStyle.NONE } }
                        }),
                    ],
                }),
            ],
        }),
      ],
    }],
  });

  return doc;
}
