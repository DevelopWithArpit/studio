
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
  ShadingType,
} from 'docx';
import type { GetResumeFeedbackOutput } from '@/ai/flows/resume-feedback-tool';

type ResumeData = GetResumeFeedbackOutput['rewrittenResume'];

const FONT_FAMILY = 'Helvetica';
const ACCENT_COLOR = '0d243c';
const ACCENT_TEXT_COLOR = 'FFFFFF';
const TEXT_COLOR = '333333';
const LIGHT_TEXT_COLOR = '555555';
const LINK_COLOR = '2563EB';

const createSection = (title: string, isSidebar: boolean = false) => {
    const titleColor = isSidebar ? 'CCCCCC' : '555555';
    const borderColor = isSidebar ? '555555' : 'D1D5DB';

    return new Paragraph({
        children: [new TextRun({ text: title, bold: true, allCaps: true, color: titleColor, size: 16, font: FONT_FAMILY })],
        border: { bottom: { color: borderColor, space: 1, value: 'single', size: 4 } },
        spacing: { after: 140, before: 200 },
    });
}


export function createResumeDocx(resumeData: ResumeData): Document {
  const { name, title, contact, summary, experience, education, projects, skills, keyAchievements, training } = resumeData;

  const leftColumnContent = [
    new Paragraph({
      children: [new TextRun({ text: name.toUpperCase(), bold: true, color: ACCENT_TEXT_COLOR, size: 36, font: 'Helvetica-Bold' })],
      spacing: { after: 300 },
    }),

    ...(projects.length > 0 ? [
        createSection('Projects', true),
        ...projects.flatMap(proj => [
            new Paragraph({
                children: [new TextRun({ text: proj.title, bold: true, color: ACCENT_TEXT_COLOR, size: 19, font: FONT_FAMILY })],
                spacing: { after: 40, before: 80 },
            }),
            new Paragraph({
                children: [new TextRun({ text: proj.description, color: 'DDDDDD', size: 18, font: FONT_FAMILY })],
                spacing: { after: 40 },
            }),
             ...(proj.link ? [new Paragraph({
                children: [new TextRun({ text: proj.link, color: 'a9c5e8', size: 18, style: 'Hyperlink', font: FONT_FAMILY })],
                style: "Hyperlink",
            })] : []),
        ]),
        new Paragraph({ text: '', spacing: { after: 150 } }),
    ] : []),

    ...(keyAchievements.length > 0 ? [
        createSection('Key Achievements', true),
        ...keyAchievements.flatMap(ach => [
             new Paragraph({
                children: [
                    new TextRun({text: `•\t`, font: 'Symbol', size: 18, color: 'DDDDDD'}),
                    new TextRun({text: ach.title, bold: true, color: ACCENT_TEXT_COLOR, size: 19, font: FONT_FAMILY})
                ],
                spacing: { after: 40, before: 80 }
             }),
             new Paragraph({
                 children: [new TextRun({text: ach.description, color: 'DDDDDD', size: 18, font: FONT_FAMILY})],
                 indent: { left: 200 },
                 spacing: { after: 80 }
             })
        ]),
         new Paragraph({ text: '', spacing: { after: 150 } }),
    ] : []),

    ...(skills.length > 0 ? [
        createSection('Skills', true),
        new Paragraph({
            children: [new TextRun({ text: skills.join(', '), color: 'DDDDDD', size: 18, font: FONT_FAMILY })],
            spacing: { before: 80 },
        }),
        new Paragraph({ text: '', spacing: { after: 150 } }),
    ] : []),

     ...(training.length > 0 ? [
        createSection('Training / Courses', true),
        ...training.flatMap(course => [
            new Paragraph({
                children: [new TextRun({ text: course.title, bold: true, color: ACCENT_TEXT_COLOR, size: 19, font: FONT_FAMILY })],
                spacing: { after: 40, before: 80 },
            }),
            new Paragraph({
                children: [new TextRun({ text: course.description, color: 'DDDDDD', size: 18, font: FONT_FAMILY })],
            }),
        ]),
    ] : []),
  ];
  
  const rightColumnContent = [
     new Paragraph({
        children: [new TextRun({ text: title, bold: true, color: TEXT_COLOR, size: 22, font: FONT_FAMILY })],
        spacing: { after: 40 },
    }),
    new Paragraph({
        children: [
            new TextRun({ text: [contact.phone, contact.email, contact.linkedin, contact.location, contact.extraField].filter(Boolean).join(' | '), color: LIGHT_TEXT_COLOR, size: 18, font: FONT_FAMILY }),
        ],
        spacing: { after: 200 },
    }),

    ...(summary ? [
        createSection('Summary'),
        new Paragraph({ children: [new TextRun({text: summary, size: 18, color: TEXT_COLOR, font: FONT_FAMILY})], spacing: { after: 100, before: 80 }}),
    ] : []),
    
    ...(experience.length > 0 ? [
        createSection('Experience'), 
        ...experience.flatMap(exp => [
        new Paragraph({
            children: [
                new TextRun({ text: exp.title, bold: true, size: 20, color: TEXT_COLOR, font: FONT_FAMILY }),
                new TextRun({ text: `\t${exp.dates}`, color: LIGHT_TEXT_COLOR, size: 18, font: FONT_FAMILY }),
            ],
            tabStops: [{ type: TabStopType.RIGHT, position: 6800 }],
            spacing: { before: 80 }
        }),
        new Paragraph({
            children: [
                new TextRun({ text: exp.company, bold: false, color: LINK_COLOR, size: 19, font: FONT_FAMILY }),
                new TextRun({ text: `\t${exp.location}`, color: LIGHT_TEXT_COLOR, size: 18, font: FONT_FAMILY }),
            ],
             tabStops: [{ type: TabStopType.RIGHT, position: 6800 }],
             spacing: { after: 60 },
        }),
        ...exp.bullets.map(bullet => new Paragraph({
            children: [new TextRun({text: bullet, size: 18, color: TEXT_COLOR, font: FONT_FAMILY})],
            bullet: { level: 0 },
            indent: { left: 280, hanging: 280 },
            spacing: { after: 40 },
        })),
         new Paragraph({ text: '', spacing: { after: 100 } }),
    ])] : []),

    ...(education.length > 0 ? [
        createSection('Education'), 
        ...education.flatMap(edu => [
        new Paragraph({
            children: [
                 new TextRun({ text: edu.degree, bold: true, size: 20, color: TEXT_COLOR, font: FONT_FAMILY }),
                 new TextRun({ text: `\t${edu.dates}`, color: LIGHT_TEXT_COLOR, size: 18, font: FONT_FAMILY }),
            ],
            tabStops: [{ type: TabStopType.RIGHT, position: 6800 }],
            spacing: { before: 80 }
        }),
        new Paragraph({
             children: [
                 new TextRun({ text: edu.school, bold: false, color: LINK_COLOR, size: 19, font: FONT_FAMILY }),
                 new TextRun({ text: `\t${edu.location}`, color: LIGHT_TEXT_COLOR, size: 18, font: FONT_FAMILY }),
             ],
              tabStops: [{ type: TabStopType.RIGHT, position: 6800 }],
              spacing: { after: 100 }
        }),
    ])] : []),
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
            margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
        },
      },
      children: [
        new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            columnWidths: [3100, 6400],
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
                             shading: { fill: ACCENT_COLOR, type: ShadingType.CLEAR, val: "clear" },
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
