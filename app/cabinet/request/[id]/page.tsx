"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { clientApi, RequestDetail, StatusHistoryEntry } from "@/lib/clientApi";

const STATUS_ORDER = [
  "CREATED", "WAITING_PAYMENT", "CRYPTO_RECEIVED",
  "AML_REVIEW", "READY_FOR_PAYOUT", "PROCESSING", "COMPLETED",
];
const STATUS_LABELS: Record<string, string> = {
  CREATED:          "Заявка создана",
  WAITING_PAYMENT:  "Ожидает оплаты",
  CRYPTO_RECEIVED:  "Крипта получена",
  AML_REVIEW:       "AML-проверка",
  READY_FOR_PAYOUT: "Готово к выплате",
  PROCESSING:       "В обработке",
  COMPLETED:        "Выплата завершена",
  ON_HOLD:          "Приостановлена",
};
const STATUS_INSTRUCTIONS: Record<string, { icon: string; title: string; body: string }> = {
  CREATED: {
    icon: "📋",
    title: "Заявка принята",
    body: "Менеджер назначает адрес кошелька. Обычно занимает несколько минут. Обновите страницу.",
  },
  WAITING_PAYMENT: {
    icon: "💸",
    title: "Отправьте криптовалюту",
    body: "Переведите точную сумму на адрес кошелька ниже. После отправки загрузите скриншот транзакции в раздел «Подтверждение».",
  },
  CRYPTO_RECEIVED: {
    icon: "✅",
    title: "Крипта получена — ждём подтверждений",
    body: "Транзакция обнаружена. Ожидаем подтверждений сети (обычно 1–15 минут). Ничего делать не нужно.",
  },
  AML_REVIEW: {
    icon: "🔍",
    title: "Идёт AML-проверка",
    body: "Стандартная процедура верификации. Занимает до 30 минут. Если потребуется — менеджер свяжется с вами.",
  },
  READY_FOR_PAYOUT: {
    icon: "🏦",
    title: "Подготовка к выплате",
    body: "Проверка пройдена. Средства готовятся к переводу на ваш счёт.",
  },
  PROCESSING: {
    icon: "⚡",
    title: "Выплата выполняется",
    body: "Средства отправлены в банк. Зачисление — от нескольких минут до 24 часов в зависимости от банка.",
  },
  COMPLETED: {
    icon: "🎉",
    title: "Выплата завершена",
    body: "Средства зачислены на указанный счёт. Спасибо за использование Nexora!",
  },
  ON_HOLD: {
    icon: "⚠️",
    title: "Заявка приостановлена",
    body: "Требуется дополнительная информация. Свяжитесь с менеджером.",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}
function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="nexora-card p-4">
      <div className="text-xs font-bold uppercase tracking-widest mb-3"
           style={{ color: "var(--color-text-muted)" }}>{title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
function Row({ label, value, highlight, mono }: { label: string; value: string; highlight?: boolean; mono?: boolean }) {
  return (
    <div className="flex justify-between items-baseline gap-2">
      <span className="text-xs flex-shrink-0" style={{ color: "var(--color-text-muted)" }}>{label}</span>
      <span className={`text-sm text-right font-medium ${mono ? "font-mono" : ""}`}
            style={{ color: highlight ? "var(--color-brand)" : "var(--color-text-primary)" }}>
        {value}
      </span>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="text-xs font-semibold px-3 py-1 rounded-lg transition-all flex-shrink-0"
      style={{
        background: copied ? "var(--color-green-dim)" : "var(--color-brand-dim)",
        color:      copied ? "var(--color-green)" : "var(--color-brand)",
        border:     "1px solid " + (copied ? "rgba(5,150,105,0.3)" : "rgba(37,99,235,0.3)"),
      }}>
      {copied ? "Скопировано ✓" : "Копировать"}
    </button>
  );
}

type RecipientDetails = { cardNumber?: string; bankName?: string; recipientName?: string };

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [req,         setReq]         = useState<RequestDetail | null>(null);
  const [history,     setHistory]     = useState<StatusHistoryEntry[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [uploading,   setUploading]   = useState(false);
  const [uploadErr,   setUploadErr]   = useState<string | null>(null);
  const [uploadOk,    setUploadOk]    = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => {
    Promise.all([
      clientApi.getRequest(id),
      clientApi.getStatusHistory(id).catch(() => [] as StatusHistoryEntry[]),
    ])
      .then(([r, h]) => { setReq(r); setHistory(h); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    load();
  }, [id]);

  // Auto-poll every 15s for active (non-terminal) statuses
  useEffect(() => {
    const TERMINAL = new Set(["COMPLETED", "ON_HOLD"]);
    if (!req || TERMINAL.has(req.status)) return;
    const timer = setInterval(load, 15_000);
    return () => clearInterval(timer);
  }, [req?.status, id]);

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) { setUploadErr("Выберите файл"); return; }
    setUploadErr(null); setUploadOk(false); setUploading(true);
    try {
      await clientApi.uploadProof(id, file);
      setUploadOk(true);
      if (fileRef.current) fileRef.current.value = "";
      load();
    } catch (err) {
      setUploadErr(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally { setUploading(false); }
  };

  const handleDownload = async (uploadId: string) => {
    setDownloading(uploadId);
    try {
      const { blob, filename } = await clientApi.downloadProof(id, uploadId);
      const url = URL.createObjectURL(blob);
      const a   = document.createElement("a");
      a.href = url; a.download = filename; a.click();
      URL.revokeObjectURL(url);
    } catch { /* silent */ } finally { setDownloading(null); }
  };

  if (loading) return (
    <div className="text-center py-16 text-sm" style={{ color: "var(--color-text-muted)" }}>Загрузка…</div>
  );
  if (!req) return (
    <div className="text-center py-16">
      <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>Заявка не найдена</p>
      <Link href="/cabinet/requests" style={{ color: "var(--color-brand)" }}>← Назад к заявкам</Link>
    </div>
  );

  const isOnHold   = req.status === "ON_HOLD";
  const isComplete = req.status === "COMPLETED";
  const instruction = STATUS_INSTRUCTIONS[req.status];
  const needsProof  = req.status === "WAITING_PAYMENT";

  // Parse recipientDetails
  let recipient: RecipientDetails = {};
  try { if (req.recipientDetails) recipient = JSON.parse(req.recipientDetails); } catch {}

  const walletAddress = req.walletAddress ?? null;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/cabinet/requests" className="text-sm font-medium"
              style={{ color: "var(--color-text-muted)" }}>← Мои заявки</Link>
        <h1 className="text-xl font-black mt-2 font-mono" style={{ color: "var(--color-text-primary)" }}>
          {req.requestNumber}
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>
          Создана {formatDate(req.createdAt)}
        </p>
      </div>

      {/* Current status instruction banner */}
      {instruction && (
        <div className="nexora-card p-4 mb-6"
             style={{
               background: isOnHold ? "var(--color-amber-dim)" : isComplete ? "rgba(5,150,105,0.08)" : "var(--color-brand-dim)",
               border: "1px solid " + (isOnHold ? "rgba(217,119,6,0.3)" : isComplete ? "rgba(5,150,105,0.25)" : "rgba(37,99,235,0.2)"),
             }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">{instruction.icon}</span>
            <div>
              <p className="font-bold text-sm mb-1" style={{ color: isOnHold ? "var(--color-amber)" : isComplete ? "var(--color-green)" : "var(--color-brand)" }}>
                {instruction.title}
              </p>
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                {instruction.body}
              </p>
              {isOnHold && (
                <a href="https://t.me/nexoranotify_bot" target="_blank" rel="noopener noreferrer"
                   className="inline-block mt-2 text-sm font-semibold"
                   style={{ color: "var(--color-amber)" }}>
                  Написать в поддержку →
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Wallet address — show when WAITING_PAYMENT */}
      {req.status === "WAITING_PAYMENT" && walletAddress && (
        <div className="nexora-card p-5 mb-6"
             style={{ border: "2px solid rgba(37,99,235,0.3)", background: "var(--color-brand-dim)" }}>
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--color-brand)" }}>
            📍 Адрес кошелька для отправки
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <code className="text-sm font-mono flex-1 break-all" style={{ color: "var(--color-text-primary)" }}>
              {walletAddress}
            </code>
            <CopyButton text={walletAddress} />
          </div>
          <div className="mt-3 p-3 rounded-xl text-xs space-y-1"
               style={{ background: "rgba(0,0,0,0.04)", color: "var(--color-text-secondary)" }}>
            <p>⚠️ Отправляйте только <strong>{req.cryptoAsset}</strong> через сеть <strong>{req.network}</strong></p>
            <p>⚠️ Точная сумма: <strong>{req.cryptoAmount} {req.cryptoAsset}</strong></p>
            <p>⚠️ После отправки загрузите скриншот транзакции ниже</p>
          </div>
        </div>
      )}

      {/* No wallet yet */}
      {req.status === "CREATED" && !walletAddress && (
        <div className="nexora-card p-4 mb-6 text-center"
             style={{ border: "1px dashed var(--color-border)" }}>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Менеджер назначит адрес кошелька в течение нескольких минут.
          </p>
          <button onClick={load} className="mt-3 text-xs font-semibold"
                  style={{ color: "var(--color-brand)" }}>
            🔄 Обновить
          </button>
        </div>
      )}

      {/* AML status */}
      {req.amlStatus === "PASSED" && (
        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold mb-4"
             style={{ background: "var(--color-green-dim)", color: "var(--color-green)", border: "1px solid rgba(5,150,105,0.25)" }}>
          ✓ AML пройдена
        </div>
      )}
      {req.amlStatus === "REJECTED" && (
        <div className="rounded-xl px-4 py-3 text-sm mb-4 flex items-start gap-2"
             style={{ background: "var(--color-red-dim)", color: "var(--color-red)", border: "1px solid rgba(239,68,68,0.25)" }}>
          <span>❌ AML проверка не пройдена. Свяжитесь с поддержкой —</span>
          <a href="https://t.me/nexoranotify_bot" target="_blank" rel="noopener noreferrer"
             className="font-semibold underline" style={{ color: "var(--color-red)" }}>
            @nexoranotify_bot
          </a>
        </div>
      )}

      {/* Status timeline */}
      {!isOnHold && history.length > 0 && (
        <div className="nexora-card p-4 mb-6">
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--color-text-muted)" }}>
            История статусов
          </div>
          <ol className="relative ml-2 space-y-4" style={{ borderLeft: "2px solid var(--color-border)" }}>
            {history.map((entry, i) => (
              <li key={entry.id} className="ml-4">
                <div className="absolute -left-[9px] w-3.5 h-3.5 rounded-full border-2"
                     style={{
                       background:  i === history.length - 1 ? "var(--color-brand)" : "var(--color-bg-elevated)",
                       borderColor: i === history.length - 1 ? "var(--color-brand)" : "var(--color-border)",
                     }} />
                <span className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                  {STATUS_LABELS[entry.toStatus] ?? entry.toStatus}
                </span>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{formatDate(entry.createdAt)}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <InfoCard title="Криптовалюта">
          <Row label="Актив"  value={`${req.cryptoAsset} (${req.network})`} />
          <Row label="Сумма"  value={`${req.cryptoAmount} ${req.cryptoAsset}`} />
          {req.rateSnapshot && (
            <Row label="Курс"
                 value={`1 ${req.cryptoAsset} = ${Number(req.rateSnapshot).toLocaleString("ru-RU")} ${req.payoutCurrency}`} />
          )}
        </InfoCard>

        <InfoCard title="Выплата">
          <Row label="Валюта"   value={req.payoutCurrency} />
          <Row label="Сумма"    value={`${Number(req.payoutAmount).toLocaleString("ru-RU")} ${req.payoutCurrency}`} />
          {req.netPayoutAmount && (
            <Row label="К выплате"
                 value={`${Number(req.netPayoutAmount).toLocaleString("ru-RU")} ${req.payoutCurrency}`}
                 highlight />
          )}
        </InfoCard>

        {/* Recipient */}
        {(recipient.cardNumber || recipient.recipientName) && (
          <InfoCard title="Реквизиты получателя">
            {recipient.recipientName && <Row label="ФИО"       value={recipient.recipientName} />}
            {recipient.cardNumber    && <Row label="Карта/счёт" value={recipient.cardNumber} mono />}
            {recipient.bankName      && <Row label="Банк"       value={recipient.bankName} />}
          </InfoCard>
        )}

        {(req.nexoraFeeAmount || req.partnerFeeAmount) && (
          <InfoCard title="Комиссии">
            {req.nexoraFeeAmount && (
              <Row label={`Nexora (${req.nexoraFeePercent}%)`}
                   value={`${Number(req.nexoraFeeAmount).toLocaleString("ru-RU")} ${req.payoutCurrency}`} />
            )}
            {req.partnerFeeAmount && (
              <Row label={`Партнёр (${req.partnerFeePercent}%)`}
                   value={`${Number(req.partnerFeeAmount).toLocaleString("ru-RU")} ${req.payoutCurrency}`} />
            )}
          </InfoCard>
        )}

        {req.payout && (
          <InfoCard title="Ордер выплаты">
            <Row label="Номер"  value={req.payout.payoutNumber} />
            <Row label="Статус" value={req.payout.status} />
            <Row label="Сумма"
                 value={`${Number(req.payout.amount).toLocaleString("ru-RU")} ${req.payout.currency}`} />
          </InfoCard>
        )}
      </div>

      {/* Proof uploads */}
      <div className="nexora-card p-5">
        <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--color-text-muted)" }}>
          Подтверждение транзакции
        </div>
        <p className="text-xs mb-4" style={{ color: "var(--color-text-secondary)" }}>
          {needsProof
            ? "После отправки крипты загрузите сюда скриншот / хеш транзакции — это ускорит обработку."
            : "Подтверждающие документы по заявке."}
        </p>

        {req.proofUploads.length > 0 && (
          <ul className="space-y-0 mb-4">
            {req.proofUploads.map(f => (
              <li key={f.id} className="flex items-center justify-between gap-3 py-3"
                  style={{ borderBottom: "1px solid var(--color-border-soft)" }}>
                <div className="min-w-0">
                  <span className="text-sm font-medium truncate block" style={{ color: "var(--color-text-primary)" }}>
                    {f.originalName}
                  </span>
                  <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {formatBytes(f.size)} · {formatDate(f.uploadedAt)}
                  </span>
                </div>
                <button onClick={() => handleDownload(f.id)} disabled={downloading === f.id}
                        className="text-xs font-semibold flex-shrink-0 disabled:opacity-50"
                        style={{ color: "var(--color-brand)" }}>
                  {downloading === f.id ? "…" : "Скачать"}
                </button>
              </li>
            ))}
          </ul>
        )}

        {!isComplete && (
          <>
            <div className="flex items-center gap-3 flex-wrap pt-2">
              <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp,.pdf"
                     className="text-sm" style={{ color: "var(--color-text-secondary)" }} />
              <button onClick={handleUpload} disabled={uploading}
                      className="nexora-btn-primary text-sm px-4 py-2 disabled:opacity-50">
                {uploading ? "Загрузка…" : "Загрузить"}
              </button>
            </div>
            {uploadErr && <p className="text-xs mt-2" style={{ color: "var(--color-red)" }}>{uploadErr}</p>}
            {uploadOk  && <p className="text-xs mt-2" style={{ color: "var(--color-green)" }}>Файл загружен ✓</p>}
            <p className="text-xs mt-2" style={{ color: "var(--color-text-muted)" }}>
              JPG, PNG, WEBP, PDF — максимум 10 МБ
            </p>
          </>
        )}
      </div>

      {/* Support link */}
      <div className="mt-4 text-center">
        <a href="https://t.me/nexoranotify_bot" target="_blank" rel="noopener noreferrer"
           className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          Вопросы? Напишите в поддержку →
        </a>
      </div>
    </div>
  );
}
