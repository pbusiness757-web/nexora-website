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
  CREATED:          "Создана",
  WAITING_PAYMENT:  "Ожидает оплаты",
  CRYPTO_RECEIVED:  "Крипта получена",
  AML_REVIEW:       "AML проверка",
  READY_FOR_PAYOUT: "Готово к выплате",
  PROCESSING:       "В обработке",
  COMPLETED:        "Завершена",
  ON_HOLD:          "Приостановлена",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}
function formatBytes(n: number) {
  if (n < 1024)        return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="nexora-card p-4">
      <div className="text-xs font-bold uppercase tracking-widest mb-3"
           style={{ color: "var(--color-text-muted)" }}>
        {title}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-baseline gap-2">
      <span className="text-xs flex-shrink-0" style={{ color: "var(--color-text-muted)" }}>{label}</span>
      <span className="text-sm text-right font-medium"
            style={{ color: highlight ? "var(--color-brand)" : "var(--color-text-primary)" }}>
        {value}
      </span>
    </div>
  );
}

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
    setLoading(true);
    Promise.all([
      clientApi.getRequest(id),
      clientApi.getStatusHistory(id).catch(() => [] as StatusHistoryEntry[]),
    ])
      .then(([r, h]) => { setReq(r); setHistory(h); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [id]);

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

  if (loading) {
    return (
      <div className="text-center py-16 text-sm" style={{ color: "var(--color-text-muted)" }}>
        Загрузка…
      </div>
    );
  }

  if (!req) {
    return (
      <div className="text-center py-16">
        <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>Заявка не найдена</p>
        <Link href="/cabinet/requests" style={{ color: "var(--color-brand)" }}>← Назад к заявкам</Link>
      </div>
    );
  }

  const currentIdx     = STATUS_ORDER.indexOf(req.status);
  const isOnHold       = req.status === "ON_HOLD";
  const useRealHistory = history.length > 0;

  return (
    <div>
      {/* Breadcrumb + title */}
      <div className="mb-6">
        <Link href="/cabinet/requests" className="text-sm font-medium"
              style={{ color: "var(--color-text-muted)" }}>
          ← Мои заявки
        </Link>
        <h1 className="text-xl font-black mt-2 font-mono"
            style={{ color: "var(--color-text-primary)" }}>
          {req.requestNumber}
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>
          Создана {formatDate(req.createdAt)}
        </p>
      </div>

      {/* AML status */}
      {req.amlStatus === "PASSED" && (
        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold mb-4"
             style={{ background: "var(--color-green-dim)", color: "var(--color-green)",
                      border: "1px solid rgba(5,150,105,0.25)" }}>
          ✓ AML пройдена
        </div>
      )}
      {req.amlStatus === "REJECTED" && (
        <div className="rounded-xl px-4 py-3 text-sm mb-4"
             style={{ background: "var(--color-red-dim)", color: "var(--color-red)",
                      border: "1px solid rgba(239,68,68,0.25)" }}>
          AML проверка не пройдена. Обратитесь в поддержку.
        </div>
      )}

      {/* ON_HOLD banner */}
      {isOnHold && (
        <div className="rounded-xl px-4 py-3 text-sm mb-8"
             style={{ background: "var(--color-amber-dim)", color: "var(--color-amber)",
                      border: "1px solid rgba(217,119,6,0.25)" }}>
          Заявка приостановлена (ON_HOLD). Обратитесь к менеджеру.
        </div>
      )}

      {/* Status timeline */}
      {!isOnHold && (useRealHistory ? (
        <div className="nexora-card p-4 mb-8">
          <div className="text-xs font-bold uppercase tracking-widest mb-3"
               style={{ color: "var(--color-text-muted)" }}>
            История статусов
          </div>
          <ol className="relative ml-2 space-y-4"
              style={{ borderLeft: "2px solid var(--color-border)" }}>
            {history.map((entry, i) => (
              <li key={entry.id} className="ml-4">
                <div className="absolute -left-[9px] w-3.5 h-3.5 rounded-full border-2 transition-colors"
                     style={{
                       background:  i === history.length - 1 ? "var(--color-brand)" : "var(--color-bg-elevated)",
                       borderColor: i === history.length - 1 ? "var(--color-brand)" : "var(--color-border)",
                     }} />
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                    {STATUS_LABELS[entry.toStatus] ?? entry.toStatus}
                  </span>
                  {entry.fromStatus !== entry.toStatus && (
                    <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                      ← {STATUS_LABELS[entry.fromStatus] ?? entry.fromStatus}
                    </span>
                  )}
                </div>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                  {formatDate(entry.createdAt)}
                </p>
              </li>
            ))}
            {history.every(h => h.toStatus !== req.status) && (
              <li className="ml-4">
                <div className="absolute -left-[9px] w-3.5 h-3.5 rounded-full border-2"
                     style={{ background: "var(--color-brand)", borderColor: "var(--color-brand)" }} />
                <span className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                  {STATUS_LABELS[req.status] ?? req.status}
                </span>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>Текущий статус</p>
              </li>
            )}
          </ol>
        </div>
      ) : (
        /* Fallback progress bar */
        <div className="nexora-card p-4 mb-8 overflow-x-auto">
          <div className="flex items-center min-w-max">
            {STATUS_ORDER.map((s, i) => {
              const done   = i < currentIdx;
              const active = i === currentIdx;
              const isLast = i === STATUS_ORDER.length - 1;
              return (
                <div key={s} className="flex items-center flex-shrink-0">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full border-2"
                         style={{
                           background:  done || active ? "var(--color-brand)" : "transparent",
                           borderColor: done || active ? "var(--color-brand)" : "var(--color-border)",
                           opacity:     active ? 1 : done ? 0.7 : 0.35,
                         }} />
                    <span className="mt-1.5 text-xs whitespace-nowrap"
                          style={{
                            color:      active ? "var(--color-brand)" : done ? "var(--color-text-secondary)" : "var(--color-text-muted)",
                            fontWeight: active ? 700 : 400,
                          }}>
                      {STATUS_LABELS[s] ?? s}
                    </span>
                  </div>
                  {!isLast && (
                    <div className="h-0.5 w-8 mb-4 mx-1"
                         style={{ background: done ? "var(--color-brand)" : "var(--color-border)" }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <InfoCard title="Крипта">
          <Row label="Актив" value={`${req.cryptoAsset} (${req.network})`} />
          <Row label="Сумма" value={`${req.cryptoAmount} ${req.cryptoAsset}`} />
          {req.rateSnapshot && (
            <Row label="Курс"
                 value={`1 ${req.cryptoAsset} = ${Number(req.rateSnapshot).toLocaleString("ru-RU")} ${req.payoutCurrency}`} />
          )}
        </InfoCard>

        <InfoCard title="Выплата">
          <Row label="Валюта" value={req.payoutCurrency} />
          <Row label="Сумма"  value={`${Number(req.payoutAmount).toLocaleString("ru-RU")} ${req.payoutCurrency}`} />
          {req.netPayoutAmount && (
            <Row label="К выплате"
                 value={`${Number(req.netPayoutAmount).toLocaleString("ru-RU")} ${req.payoutCurrency}`}
                 highlight />
          )}
        </InfoCard>

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
        <div className="text-xs font-bold uppercase tracking-widest mb-4"
             style={{ color: "var(--color-text-muted)" }}>
          Подтверждающие документы
        </div>

        {req.proofUploads.length === 0 ? (
          <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
            Документы ещё не загружены
          </p>
        ) : (
          <ul className="space-y-0 mb-4">
            {req.proofUploads.map(f => (
              <li key={f.id} className="flex items-center justify-between gap-3 py-3"
                  style={{ borderBottom: "1px solid var(--color-border-soft)" }}>
                <div className="min-w-0">
                  <span className="text-sm font-medium truncate block"
                        style={{ color: "var(--color-text-primary)" }}>
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

        <div className="flex items-center gap-3 flex-wrap pt-2">
          <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp,.pdf"
                 className="text-sm" style={{ color: "var(--color-text-secondary)" }} />
          <button onClick={handleUpload} disabled={uploading}
                  className="nexora-btn-primary text-sm px-4 py-2 disabled:opacity-50">
            {uploading ? "Загрузка…" : "Загрузить"}
          </button>
        </div>
        {uploadErr && (
          <p className="text-xs mt-2" style={{ color: "var(--color-red)" }}>{uploadErr}</p>
        )}
        {uploadOk && (
          <p className="text-xs mt-2" style={{ color: "var(--color-green)" }}>Файл успешно загружен</p>
        )}
        <p className="text-xs mt-2" style={{ color: "var(--color-text-muted)" }}>
          JPG, PNG, WEBP, PDF — максимум 10 МБ
        </p>
      </div>
    </div>
  );
}
