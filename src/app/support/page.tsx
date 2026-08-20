import React from 'react';
import { HelpCircle, PhoneCall, Mail, FileText } from 'lucide-react';

export default function SupportPage() {
  const faqs = [
    { q: 'How does ISLAH protect citizen privacy?', a: 'All public ticket tracking displays location and status while masking citizen phone numbers and email addresses.' },
    { q: 'What happens if a report is marked emergency?', a: 'Emergency reports trigger priority notifications to city marshals and enforce a 4-hour completion window.' },
    { q: 'How does AI photo resolution verification work?', a: 'When a department officer uploads a completion photo, ISLAH AI compares surface features against the original photo to confirm fix quality.' },
  ];

  return (
    <div className="w-full max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">
          Help & Guidance
        </span>
        <h1 className="text-3xl font-bold text-slate-900">
          Support & Frequently Asked Questions
        </h1>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white border border-slate-200 p-6 rounded-2xl space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600" /> {faq.q}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed pl-6">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
