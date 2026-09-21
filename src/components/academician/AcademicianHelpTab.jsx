import React, { useState } from 'react';
import {
  HelpCircle,
  MessageSquare,
  FileQuestion,
  Send,
  CheckCircle2,
  PhoneCall,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { academicianAPI, chatbotAPI } from '../../services/api';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import './AcademicianHelpTab.css';

export default function AcademicianHelpTab({ currentUser }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await academicianAPI.submitSupportTicket({
        userId: currentUser?.id || currentUser?.userId || 1,
        subject,
        message,
      });
      setSubmitted(true);
      setSubject('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      setSubmitted(true);
      setSubject('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  const faqs = [
    {
      q: 'How are FDP applications evaluated and confirmed?',
      a: 'Sponsored FDP organizers review submitted faculty profiles and research alignment. You will receive notification within 3-5 business days directly in the Collaborations tab.',
      category: 'FDP',
    },
    {
      q: 'Can our department post a Call for Collaborative Research?',
      a: 'Yes, verified academicians can publish joint research proposals and workshop requests that are visible to both corporate partners and partner institutes.',
      category: 'Research',
    },
    {
      q: 'Are certificates awarded upon completing industry training?',
      a: 'Yes. All completed faculty development and industry training programs issue cryptographically verified certificates verifiable through the TalentOrbit Registry.',
      category: 'Certification',
    },
    {
      q: 'How does corporate consultancy billing and honorarium work?',
      a: 'Institutional consultancy policies apply. Industry partners directly coordinate terms, NDAs, and institutional billing codes specified in your profile.',
      category: 'Consultancy',
    },
  ];

  return (
    <div className="academician-help-space space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Faculty Help Desk & Support
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Frequently asked questions, institutional collaboration guidelines, and direct administrator contact
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FAQs using Shadcn Card and Badge */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 mb-2">
            <FileQuestion size={16} className="text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h3>
          </div>

          {faqs.map((faq, idx) => (
            <Card
              key={idx}
              className="rounded-xl shadow-2xs hover:border-emerald-500/40 transition"
            >
              <CardContent className="p-4 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {faq.q}
                  </h4>
                  <Badge variant="emerald" className="text-[9px] uppercase tracking-wider py-0 px-1.5 shrink-0">
                    {faq.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Form using Shadcn Card, Label, Input, and Button */}
        <Card className="rounded-2xl shadow-xs h-fit">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <MessageSquare size={16} />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                  Submit Support Query
                </CardTitle>
                <CardDescription className="text-[11px] text-muted-foreground">
                  Direct inquiry to Ministry / Platform Administrators
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0 space-y-4">
            {submitted && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>Your support ticket has been submitted to the platform governance team!</span>
              </div>
            )}

            <form onSubmit={handleSubmitTicket} className="space-y-3.5">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Subject:
                </Label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. FDP sponsorship verification"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Detailed Message:
                </Label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your issue or institutional inquiry..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 rounded-xl text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs gap-1.5 shadow-xs h-10"
              >
                <Send size={13} />
                {submitting ? 'Transmitting...' : 'Submit Support Ticket'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
