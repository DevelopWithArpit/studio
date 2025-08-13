'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, LifeBuoy } from 'lucide-react';

export default function SupportPage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
        title: "Message Sent!",
        description: "Our support team will get back to you shortly."
    });
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Support</h1>
        <p className="text-muted-foreground">
          Get help with any issues or questions you have.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Mail className="w-6 h-6" />
                    Contact Support
                </CardTitle>
                <CardDescription>
                    Fill out the form below and our team will get back to you as soon as possible.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="email">Your Email</Label>
                        <Input id="email" type="email" placeholder="you@example.com" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" placeholder="e.g., Issue with Resume Generator" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" placeholder="Please describe your issue in detail..." rows={6} required/>
                    </div>
                    <Button type="submit">Send Message</Button>
                </form>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <LifeBuoy className="w-6 h-6" />
                   Frequently Asked Questions
                </CardTitle>
                <CardDescription>
                    Find answers to common questions.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-1">
                    <h4 className="font-semibold">How long does generation take?</h4>
                    <p className="text-sm text-muted-foreground">
                        Most tools generate content within 15-30 seconds. Image-heavy tools like the Presentation Generator may take up to a minute.
                    </p>
                </div>
                 <div className="space-y-1">
                    <h4 className="font-semibold">What file types are supported for upload?</h4>
                    <p className="text-sm text-muted-foreground">
                        Most tools support PDF, DOCX, and TXT files. Image tools support PNG, JPG, and GIF.
                    </p>
                </div>
                 <div className="space-y-1">
                    <h4 className="font-semibold">Is my data secure?</h4>
                    <p className="text-sm text-muted-foreground">
                        Yes, we prioritize your data privacy. All uploaded documents are processed securely and are not stored after the generation is complete.
                    </p>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
