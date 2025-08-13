
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { handleSuggestCareerPathsAction } from '@/app/actions';
import type { SuggestCareerPathsOutput } from '@/ai/flows/career-path-suggester-tool';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  interests: z.string().min(10, 'Please describe your interests in at least 10 characters.'),
  skills: z.string().min(10, 'Please describe your skills in at least 10 characters.'),
});

type FormData = z.infer<typeof formSchema>;

export default function CareerPathSuggesterTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SuggestCareerPathsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: '',
      skills: '',
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setResult(null);
    const response = await handleSuggestCareerPathsAction(data);
    setIsLoading(false);

    if (response.success) {
      setResult(response.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error suggesting careers',
        description: response.error,
      });
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold font-headline">Career Path Suggester</h1>
        <p className="text-muted-foreground">Get personalized career suggestions based on your interests and skills.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Find Your Career Path</CardTitle>
          <CardDescription>
            Tell us about what you enjoy and what you're good at, and we'll suggest some career paths for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Interests & Passions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., I love creative writing, playing strategy games, and learning about new technologies..."
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Skills & Experience</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., I have 3 years of experience in customer support, am proficient in Microsoft Excel, and a fast learner..."
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Suggesting...' : 'Suggest Careers'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Suggested Career Paths</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      )}

      {result && result.careerPaths.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Suggested Career Paths</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {result.careerPaths.map((path, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>{path.title}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">{path.description}</p>
                      <div>
                        <h4 className="font-semibold mb-2">Required Skills:</h4>
                        <div className="flex flex-wrap gap-2">
                          {path.requiredSkills.map((skill) => (
                            <Badge key={skill} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
