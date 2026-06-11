'use client';

import { useState } from 'react';

type FaqItem = {
  question: string;
  answer: string;
};

const FAQS: FaqItem[] = [
  {
    question: 'What is Nexora?',
    answer:
      'Nexora is a crypto-to-bank payout infrastructure platform for individuals and businesses.',
  },
  {
    question: 'Which cryptocurrencies are supported?',
    answer: 'USDT, BTC, ETH, TON, TRX, USDC and LTC.',
  },
  {
    question: 'Which countries are supported?',
    answer: 'Russia, Kazakhstan, Uzbekistan, Azerbaijan and Kyrgyzstan.',
  },
  {
    question: 'Can Nexora send payouts to organizations?',
    answer:
      'Yes. Nexora supports payouts to legal entities and corporate bank accounts.',
  },
  {
    question: 'Can I pay suppliers with crypto?',
    answer:
      'Yes. Nexora can process supplier payments through crypto-to-bank settlement.',
  },
  {
    question: 'How long does processing take?',
    answer:
      'Processing time depends on country, payout method and transaction verification.',
  },
  {
    question: 'How are exchange rates calculated?',
    answer: 'Rates are based on market data and include the service margin.',
  },
  {
    question: 'Are transactions checked for AML risk?',
    answer:
      'Yes. Transactions may be reviewed according to AML and risk policies.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <div className="mb-4 inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-700">
            FAQ
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Everything you need to know about Nexora crypto-to-bank payouts.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-semibold text-slate-950">
                    {faq.question}
                  </span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-lg font-bold text-blue-900 transition ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                  >
                    +
                  </span>
                </button>

                {isOpen && (
                  <p className="px-6 pb-5 text-base leading-7 text-slate-600">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
