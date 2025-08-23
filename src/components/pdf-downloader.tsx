
'use client';

import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ResumePdfDocument } from '@/components/resume-pdf-document';
import type { GetResumeFeedbackOutput } from '@/ai/flows/resume-feedback-tool';
import { Button } from './ui/button';
import { Download, Loader2 } from 'lucide-react';

interface PdfDownloaderProps {
    resumeData: GetResumeFeedbackOutput['rewrittenResume'];
}

export const PdfDownloader: React.FC<PdfDownloaderProps> = ({ resumeData }) => {
    return (
        <PDFDownloadLink
            document={<ResumePdfDocument resumeData={resumeData} />}
            fileName="resume.pdf"
        >
            {({ blob, url, loading, error }) => (
                <Button disabled={loading}>
                    {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Download className="mr-2 h-4 w-4" />
                    )}
                    {loading ? 'Generating PDF...' : 'Download as PDF'}
                </Button>
            )}
        </PDFDownloadLink>
    );
};
