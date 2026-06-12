"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type ApiPayout = {
  payoutNumber: string;
  status: string;
  amount: string;
  currency: string;
};

type ApiClient = {
  companyName: string;
  country: string;
  riskLevel: string;
};

type ApiRequest = {
  id: string;
  requestNumber: string;
  status: string;
  cryptoAsset: string;
  network: string;
  cryptoAmount: string;
  payoutCurrency: string;
  payoutAmount: string;
  createdAt: string;
  clientId: string;
  client: ApiClient | null;
  payout: ApiPayout | null;
};

const STATUS_META: Record<string, { label: string; style: string }> = {
  CREATED: { label: "Created", style: "bg-slate-100 text-slate-600" },
  WAITING_PAYMENT: { label: "Waiting Payment", style: "bg-slate-100 text-slate-600" },
  CRYPTO_RECEIVED: { label: "Crypto Received", style: "bg-blue-50 text-blue-700" },
  AML_REVIEW: { label: "AML Review", style: "bg-cyan-50 text-cyan-700" },
  READY_FOR_PAYOUT: { label: "Ready for Payout", style: "bg-indigo-50 text-indigo-700" },
  PROCESSING: { label: "Processing", style: "bg-amber-50 text-amber-600" },
  COMPLETED: { label: "Completed", style: "bg-emerald-50 text-emerald-600" },
  ON_HOLD: { label: "On Hold", style: "bg-rose-50 text-rose-600" },
};

const TIMELINE_ORDER = [
  "CREATED",
  "WAITING_PAYMENT",
  "CRYPTO_RECEIVED",
  "AML_REVIEW",
  "READY_FOR_PAYOUT",
  "PROCESSING",
  "COMPLETED",
];

function statusMeta(status: string) {
  return (
    STATUS_META[status] ?? { label: status, style: "bg-slate-100 text-slate-500" }
  );
}

function formatNumber(value: string) {
  return Number(value).toLocaleString("en-US");
}

const ACTIONS = [
  { label: "Approve AML", primary: true },
  { label: "Mark Ready for Payout", primary: false },
  { label: "Mark as Paid", primary: false },
  { label: "Put On Hold", primary: false },
];

const markerStyles = {
  done: "border-blue-900 bg-blue-900 text-white",
  current: "border-cyan-500 bg-cyan-50 text-cyan-700",
  pending: "border-slate-200 bg-white text-slate-400",
} as const;

function InfoCard({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: string; mono?: boolean }[];
}) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
      <h2 className="text-lg font-bold text-slate-950">{title}</h2>
      <dl className="mt-6 divide-y divide-slate-100">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-4 py-4"
          >
            <dt className="text-sm text-slate-600">{row.label}</dt>
            <dd
              className={`text-right font-semibold text-slate-950 ${
                row.mono ? "font-mono text-slate-500" : ""
              }`}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function AdminRequestDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [request, setRequest] = useState<ApiRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let active = true;

    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/requests/${id}`);
        if (!res.ok) throw new Error("request");
        const data = await res.json();
        if (active) setRequest(data);
      } catch {
        if (active) setError("Failed to load request.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm text-slate-500">Loading request…</p>
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
            {error ?? "Request not found."}
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = TIMELINE_ORDER.indexOf(request.status);
  const meta = statusMeta(request.status);

  const clientRows = request.client
    ? [
        { label: "Client", value: request.client.companyName },
        { label: "Country", value: request.client.country },
        { label: "Risk Level", value: statusMeta(request.client.riskLevel).label || request.client.riskLevel },
      ]
    : [{ label: "Client", value: request.clientId }];

  const cryptoRows = [
    { label: "Asset", value: request.cryptoAsset },
    { label: "Network", value: request.network },
    { label: "Amount", value: `${formatNumber(request.cryptoAmount)} ${request.cryptoAsset}` },
    { label: "Created", value: request.createdAt.slice(0, 10) },
  ];

  const payoutRows = request.payout
    ? [
        { label: "Payout Number", value: request.payout.payoutNumber, mono: true },
        { label: "Status", value: statusMeta(request.payout.status).label },
        {
          label: "Amount",
          value: `${formatNumber(request.payout.amount)} ${request.payout.currency}`,
        },
      ]
    : [
        {
          label: "Amount",
          value: `${formatNumber(request.payoutAmount)} ${request.payoutCurrency}`,
        },
        { label: "Currency", value: request.payoutCurrency },
        { label: "Payout", value: "Not created yet" },
      ];

  return (
    <div className="px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              Request {request.requestNumber}
            </h1>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${meta.style}`}
            >
              {meta.label}
            </span>
          </div>
          <p className="text-lg text-slate-600">
            Crypto-to-bank payout request details.
          </p>
        </div>

        <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
          <h2 className="text-lg font-bold text-slate-950">Status Timeline</h2>
          <ol className="mt-8 space-y-6">
            {TIMELINE_ORDER.map((step, index) => {
              const state =
                currentIndex === -1
                  ? "pending"
                  : index < currentIndex
                    ? "done"
                    : index === currentIndex
                      ? "current"
                      : "pending";
              const isLast = index === TIMELINE_ORDER.length - 1;
              return (
                <li key={step} className="relative flex gap-4">
                  {!isLast && (
                    <span
                      className={`absolute left-5 top-10 h-[calc(100%-0.5rem)] w-px ${
                        state === "done" ? "bg-blue-900" : "bg-slate-200"
                      }`}
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${markerStyles[state]}`}
                  >
                    {state === "done" ? "✓" : index + 1}
                  </span>
                  <div className="flex flex-1 items-center pt-2">
                    <p
                      className={`font-semibold ${
                        state === "pending" ? "text-slate-400" : "text-slate-950"
                      }`}
                    >
                      {statusMeta(step).label}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <InfoCard title="Client Information" rows={clientRows} />
          <InfoCard title="Crypto Payment" rows={cryptoRows} />
          <InfoCard title="Payout Details" rows={payoutRows} />

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60 sm:p-8">
            <h2 className="text-lg font-bold text-slate-950">Operator Actions</h2>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {ACTIONS.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  className={
                    action.primary
                      ? "rounded-2xl bg-blue-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-950"
                      : "rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-blue-200 hover:text-blue-900"
                  }
                >
                  {action.label}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
