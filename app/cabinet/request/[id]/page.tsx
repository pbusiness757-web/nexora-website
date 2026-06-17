"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { clientApi, RequestDetail, StatusHistoryEntry } from "@/lib/clientApi";

const STATUS_ORDER = [
  "CREATED", "WAITING_PAYMENT", "CRYPTO_RECEIVED", "AML_REVIEW",
  "READY_FOR_PAYOUT", "PROCESSING", "COMPLETED",
];

const STATUS_LABELS: Record<string, string> = {
  CREATED: "Создана", WAITING_PAYMENT: "Ожидает оплаты",
  CRYPTO_RECEIVED: "Крипта получена", AML_REVIEW: "AML проверка",
  READY_FOR_PAYOUT: "Готово к выплате", PROCESSING: "В обработке",
  COMPLETED: "Завершена", ON_HOLD: "Приостановлена",
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

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [req, setReq] = useState<RequestDetail | null>(null);
  const [history, setHistory] = useState<StatusHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadOk, setUploadOk] = useState(false);
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
    if (!file) { setUploadError("Выберите файл"); return; }
    setUploadError(null); setUploadOk(false); setUploading(true);
    try {
      await clientApi.uploadProof(id, file);
      setUploadOk(true);
      if (fileRef.current) fileRef.current.value = "";
      load();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally { setUploading(false); }
  };

  const handleDownload = async (uploadId: string) => {
    setDownloading(uploadId);
    try {
      const { blob, filename } = await clientApi.downloadProof(id, uploadId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = filename; a.click();
      URL.revokeObjectURL(url);
    } catch { /* silent */ } finally { setDownloading(null); }
  };

  if (loading) return <div className="text-gray-400 text-sm text-center py-12">Загрузка...</div>;

  if (!req) return (
    <div className="text-center py-12">
      <p className="text-gray-400 mb-4">Заявка не найдена</p>
      <Link href="/cabinet/requests" className="text-indigo-400 hover:text-indigo-300 text-sm">← Назад к заявкам</Link>
    </div>
  );

  const currentIdx = STATUS_ORDER.indexOf(req.status);
  const isOnHold = req.status === "ON_HOLD";

  // Build timeline: prefer real history from API; fall back to static progress bar
  const useRealHistory = history.length > 0;

  return (
    <div>
      <div className="mb-6">
        <Link href="/cabinet/requests" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">← Мои заявки</Link>
        <h1 className="text-xl font-semibold text-white mt-2 font-mono">{req.requestNumber}</h1>
        <p className="text-gray-400 text-sm mt-0.5">Создана {formatDate(req.createdAt)}</p>
      </div>

      {/* Status timeline */}
      {isOnHold ? (
        <div className="mb-8 bg-red-900/30 border border-red-800 rounded-lg p-4 text-red-300 text-sm">
          Заявка приостановлена (ON_HOLD). Обратитесь к менеджеру.
        </div>
      ) : useRealHistory ? (
        /* Real history from API */
        <div className="mb-8 bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">История статусов</div>
          <ol className="relative border-l border-gray-700 ml-2 space-y-4">
            {history.map((entry, i) => (
              <li key={entry.id} className="ml-4">
                <div className={`absolute -left-1.5 w-3 h-3 rounded-full border-2 ${
                  i === history.length - 1
                    ? "bg-indigo-500 border-indigo-500"
                    : "bg-gray-600 border-gray-600"
                }`} />
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-white text-sm font-medium">
                    {STATUS_LABELS[entry.toStatus] ?? entry.toStatus}
                  </span>
                  {entry.fromStatus !== entry.toStatus && (
                    <span className="text-gray-500 text-xs">
                      ← {STATUS_LABELS[entry.fromStatus] ?? entry.fromStatus}
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-xs mt-0.5">{formatDate(entry.createdAt)}</p>
              </li>
            ))}
            {/* Current status if not yet in history */}
            {history.every(h => h.toStatus !== req.status) && (
              <li className="ml-4">
                <div className="absolute -left-1.5 w-3 h-3 rounded-full border-2 bg-white border-white" />
                <span className="text-white text-sm font-medium">{STATUS_LABELS[req.status] ?? req.status}</span>
                <p className="text-gray-500 text-xs mt-0.5">Текущий статус</p>
              </li>
            )}
          </ol>
        </div>
      ) : (
        /* Fallback static progress bar */
        <div className="mb-8">
          <div className="flex items-center gap-0 overflow-x-auto pb-2">
            {STATUS_ORDER.map((s, i) => {
              const done = i < currentIdx;
              const active = i === currentIdx;
              const isLast = i === STATUS_ORDER.length - 1;
              return (
                <div key={s} className="flex items-center flex-shrink-0">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full border-2 ${
                      done ? "bg-indigo-500 border-indigo-500"
                        : active ? "bg-white border-white"
                        : "bg-transparent border-gray-600"
                    }`} />
                    <span className={`mt-1.5 text-xs whitespace-nowrap ${
                      active ? "text-white font-medium" : done ? "text-indigo-400" : "text-gray-600"
                    }`}>
                      {STATUS_LABELS[s] ?? s}
                    </span>
                  </div>
                  {!isLast && (
                    <div className={`h-0.5 w-10 mb-4 mx-1 flex-shrink-0 ${done ? "bg-indigo-500" : "bg-gray-700"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">Крипта</div>
          <div className="space-y-2">
            <Row label="Актив" value={`${req.cryptoAsset} (${req.network})`} />
            <Row label="Сумма" value={`${req.cryptoAmount} ${req.cryptoAsset}`} />
            {req.rateSnapshot && (
              <Row label="Курс" value={`1 ${req.cryptoAsset} = ${Number(req.rateSnapshot).toLocaleString("ru-RU")} ${req.payoutCurrency}`} />
            )}
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">Выплата</div>
          <div className="space-y-2">
            <Row label="Валюта" value={req.payoutCurrency} />
            <Row label="Сумма" value={`${Number(req.payoutAmount).toLocaleString("ru-RU")} ${req.payoutCurrency}`} />
            {req.netPayoutAmount && (
              <Row label="К выплате" value={`${Number(req.netPayoutAmount).toLocaleString("ru-RU")} ${req.payoutCurrency}`} highlight />
            )}
          </div>
        </div>
        {(req.nexoraFeeAmount || req.partnerFeeAmount) && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">Комиссии</div>
            <div className="space-y-2">
              {req.nexoraFeeAmount && <Row label={`Nexora (${req.nexoraFeePercent}%)`} value={`${Number(req.nexoraFeeAmount).toLocaleString("ru-RU")} ${req.payoutCurrency}`} />}
              {req.partnerFeeAmount && <Row label={`Партнёр (${req.partnerFeePercent}%)`} value={`${Number(req.partnerFeeAmount).toLocaleString("ru-RU")} ${req.payoutCurrency}`} />}
            </div>
          </div>
        )}
        {req.payout && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">Ордер выплаты</div>
            <div className="space-y-2">
              <Row label="Номер" value={req.payout.payoutNumber} />
              <Row label="Статус" value={req.payout.status} />
              <Row label="Сумма" value={`${Number(req.payout.amount).toLocaleString("ru-RU")} ${req.payout.currency}`} />
            </div>
          </div>
        )}
      </div>

      {/* Proof uploads */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-4">
        <div className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">Подтверждающие документы</div>
        {req.proofUploads.length === 0 ? (
          <p className="text-gray-500 text-sm mb-4">Документы ещё не загружены</p>
        ) : (
          <ul className="space-y-2 mb-4">
            {req.proofUploads.map((f) => (
              <li key={f.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-gray-300 text-sm truncate block">{f.originalName}</span>
                  <span className="text-gray-500 text-xs">{formatBytes(f.size)} · {formatDate(f.uploadedAt)}</span>
                </div>
                <button onClick={() => handleDownload(f.id)} disabled={downloading === f.id}
                  className="text-xs text-indigo-400 hover:text-indigo-300 disabled:opacity-50 flex-shrink-0 transition-colors">
                  {downloading === f.id ? "..." : "Скачать"}
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-center gap-3 flex-wrap">
          <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp,.pdf"
            className="text-sm text-gray-400 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-gray-700 file:text-gray-300 hover:file:bg-gray-600" />
          <button onClick={handleUpload} disabled={uploading}
            className="text-sm bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-3 py-1 rounded transition-colors">
            {uploading ? "Загрузка..." : "Загрузить"}
          </button>
        </div>
        {uploadError && <p className="text-red-400 text-xs mt-2">{uploadError}</p>}
        {uploadOk && <p className="text-green-400 text-xs mt-2">Файл успешно загружен</p>}
        <p className="text-gray-600 text-xs mt-2">JPG, PNG, WEBP, PDF — максимум 10 МБ</p>
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-baseline gap-2">
      <span className="text-gray-500 text-xs flex-shrink-0">{label}</span>
      <span className={`text-sm text-right ${highlight ? "text-white font-semibold" : "text-gray-200"}`}>{value}</span>
    </div>
  );
}
