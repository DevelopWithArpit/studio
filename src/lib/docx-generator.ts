
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
  TabStopType,
  AlignmentType,
} from 'docx';
import type { GetResumeFeedbackOutput } from '@/ai/flows/resume-feedback-tool';

type ResumeData = GetResumeFeedbackOutput['rewrittenResume'];

const FONT_FAMILY = 'Helvetica';
const ACCENT_COLOR = '0d243c';
const ACCENT_TEXT_COLOR = 'FFFFFF';
const TEXT_COLOR = '333333';
const LIGHT_TEXT_COLOR = '555555';
const LINK_COLOR = '2563EB';

const createSection = (title: string, children: Paragraph[], isSidebar: boolean = false) => {
    const titleColor = isSidebar ? ACCENT_TEXT_COLOR : TEXT_COLOR;
    const borderColor = isSidebar ? '4A5568' : 'D1D5DB';

    return [
        new Paragraph({
            children: [new TextRun({ text: title, bold: true, allCaps: true, color: titleColor, size: 18 })],
            border: { bottom: { color: borderColor, space: 1, value: 'single', size: 4 } },
            spacing: { after: 120, before: 240 },
        }),
        ...children,
    ];
}


export function createResumeDocx(resumeData: ResumeData): Document {
  const { name, title, contact, summary, experience, education, projects, skills, keyAchievements, training } = resumeData;

  const leftColumnContent = [
    new Paragraph({
      children: [new TextRun({ text: name.toUpperCase(), bold: true, color: ACCENT_TEXT_COLOR, size: 36, font: 'Helvetica-Bold' })],
      spacing: { after: 300 },
      alignment: AlignmentType.CENTER,
    }),

    ...(projects.length > 0 ? createSection('Projects', 
        projects.flatMap(proj => [
            new Paragraph({
                children: [new TextRun({ text: proj.title, bold: true, color: ACCENT_TEXT_COLOR, size: 20 })],
                spacing: { after: 40 },
            }),
            new Paragraph({
                children: [new TextRun({ text: proj.description, color: 'DDDDDD', size: 18 })],
                spacing: { after: 40 },
            }),
             ...(proj.link ? [new Paragraph({
                children: [new TextRun({ text: proj.link, color: 'a9c5e8', size: 18, style: 'Hyperlink' })],
                style: "Hyperlink",
            })] : []),
            new Paragraph({ text: '', spacing: { after: 150 } }),
        ]),
        true
    ) : []),

    ...(keyAchievements.length > 0 ? createSection('Key Achievements', 
        keyAchievements.flatMap(ach => [
             new Paragraph({
                children: [new TextRun({text: ach.description, color: 'DDDDDD', size: 18})],
                bullet: { level: 0 },
                indent: { left: 200, hanging: 200 },
                spacing: { after: 80 },
            }),
        ]),
        true
    ) : []),

    ...(skills.length > 0 ? createSection('Skills', [
        new Paragraph({
            children: [new TextRun({ text: skills.join(' • '), color: 'DDDDDD', size: 18 })],
        }),
    ], true) : []),

     ...(training.length > 0 ? createSection('Training / Courses', 
        training.flatMap(course => [
            new Paragraph({
                children: [new TextRun({ text: course.title, bold: true, color: ACCENT_TEXT_COLOR, size: 20 })],
                spacing: { after: 40 },
            }),
            new Paragraph({
                children: [new TextRun({ text: course.description, color: 'DDDDDD', size: 18 })],
                spacing: { after: 150 },
            }),
        ]),
        true
    ) : []),
  ];
  
  const rightColumnContent = [
     new Paragraph({
        children: [new TextRun({ text: title, bold: true, color: TEXT_COLOR, size: 24 })],
        spacing: { after: 50 },
    }),
    new Paragraph({
        children: [
            new TextRun({ text: [contact.phone, contact.email, contact.linkedin, contact.location].filter(Boolean).join(' | '), color: LIGHT_TEXT_COLOR, size: 18 }),
        ],
        spacing: { after: 200 },
        border: { bottom: { color: 'D1D5DB', space: 1, value: 'single', size: 2 } },

    }),

    ...(summary ? createSection('Summary', [
        new Paragraph({ children: [new TextRun({text: summary, size: 20, color: TEXT_COLOR})]}),
        new Paragraph({ text: '' }),
    ]) : []),
    
    ...(experience.length > 0 ? createSection('Experience', experience.flatMap(exp => [
        new Paragraph({
            children: [
                new TextRun({ text: exp.title, bold: true, size: 22, color: TEXT_COLOR }),
                new TextRun({ text: `\t${exp.dates}`, color: LIGHT_TEXT_COLOR, size: 18 }),
            ],
            tabStops: [{ type: TabStopType.RIGHT, position: 6500 }],
        }),
        new Paragraph({
            children: [
                new TextRun({ text: exp.company, bold: false, color: LINK_COLOR, size: 20, italics: true }),
                new TextRun({ text: `\t${exp.location}`, color: LIGHT_TEXT_COLOR, size: 18 }),
            ],
             tabStops: [{ type: TabStopType.RIGHT, position: 6500 }],
             spacing: { after: 80 },
        }),
        ...exp.bullets.map(bullet => new Paragraph({
            children: [new TextRun({text: bullet, size: 19, color: TEXT_COLOR})],
            bullet: { level: 0 },
            indent: { left: 280, hanging: 280 },
            spacing: { after: 40 },
        })),
         new Paragraph({ text: '', spacing: { after: 150 } }),
    ])) : []),

    ...(education.length > 0 ? createSection('Education', education.flatMap(edu => [
        new Paragraph({
            children: [
                 new TextRun({ text: edu.degree, bold: true, size: 22, color: TEXT_COLOR }),
                 new TextRun({ text: `\t${edu.dates}`, color: LIGHT_TEXT_COLOR, size: 18 }),
            ],
            tabStops: [{ type: TabStopType.RIGHT, position: 6500 }]
        }),
        new Paragraph({
             children: [
                 new TextRun({ text: edu.school, bold: false, color: LINK_COLOR, size: 20, italics: true }),
                 new TextRun({ text: `\t${edu.location}`, color: LIGHT_TEXT_COLOR, size: 18 }),
             ],
              tabStops: [{ type: TabStopType.RIGHT, position: 6500 }],
              spacing: { after: 150 }
        }),
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
        hyperlink: {
            run: {
                color: LINK_COLOR,
                underline: {
                    type: "single",
                    color: LINK_COLOR,
                },
            },
        },
    },
    sections: [{
      properties: {
        page: {
            margin: { top: '0.4in', right: '0.4in', bottom: '0.4in', left: '0.4in' },
        },
      },
      children: [
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            columnWidths: [3000, 6500],
            borders: {
                top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: leftColumnContent,
                             shading: { fill: ACCENT_COLOR },
                             verticalAlign: VerticalAlign.TOP,
                             margins: { left: 200, right: 200, top: 200, bottom: 200 },
                        }),
                        new TableCell({
                            children: rightColumnContent,
                            verticalAlign: VerticalAlign.TOP,
                            margins: { left: 300, right: 100, top: 200, bottom: 200 },
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
