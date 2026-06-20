const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://nexoraexample.pro";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options?.headers ?? {}) },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export interface ClientUser { id: string; email: string; unreadCount: number }
export interface MyRequest {
  id: string; requestNumber: string; status: string; cryptoAsset: string;
  network: string; cryptoAmount: string; payoutCurrency: string; payoutAmount: string;
  createdAt: string; clientAccountId: string | null;
}
export interface RequestDetail extends MyRequest {
  rateSnapshot: string | null; nexoraFeePercent: string; nexoraFeeAmount: string | null;
  partnerFeePercent: string; partnerFeeAmount: string | null; netPayoutAmount: string | null;
  amlStatus: string;
  payout: { id: string; payoutNumber: string; status: string; amount: string; currency: string } | null;
  proofUploads: { id: string; originalName: string; mimeType: string; size: number; uploadedAt: string }[];
}
export interface StatusHistoryEntry {
  id: string; fromStatus: string; toStatus: string; changedBy: string; createdAt: string;
}
export interface Notification { id: string; message: string; isRead: boolean; createdAt: string; requestId: string | null }
export interface PageResult<T> { data: T[]; total: number; page: number; limit: number }
export interface RatesSnapshot { rates: Record<string, number>; updatedAt: string }
export interface CreateRequestBody {
  cryptoAsset: string; network: string; cryptoAmount: number; country: string;
}

export const clientApi = {
  register: (email: string, password: string) =>
    apiFetch<{ user: { id: string; email: string } }>("/api/client-auth/register", {
      method: "POST", body: JSON.stringify({ email, password }),
    }),
  login: (email: string, password: string) =>
    apiFetch<{ user: { id: string; email: string } }>("/api/client-auth/login", {
      method: "POST", body: JSON.stringify({ email, password }),
    }),
  logout: () => apiFetch<void>("/api/client-auth/logout", { method: "POST" }),
  me: () => apiFetch<ClientUser>("/api/client-auth/me"),
  getRates: () => apiFetch<RatesSnapshot>("/api/rates"),
  createRequest: (body: CreateRequestBody) =>
    apiFetch<MyRequest>("/api/client-requests", {
      method: "POST", body: JSON.stringify(body),
    }),
  getRequests: (page = 1, limit = 20) =>
    apiFetch<PageResult<MyRequest>>(`/api/client-requests?page=${page}&limit=${limit}`),
  getRequest: (id: string) => apiFetch<RequestDetail>(`/api/client-requests/${id}`),
  getStatusHistory: (id: string) =>
    apiFetch<StatusHistoryEntry[]>(`/api/client-requests/${id}/status-history`),
  uploadProof: (id: string, file: File) =>
    new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = (reader.result as string).split(",")[1];
          await apiFetch<void>(`/api/client-requests/${id}/upload`, {
            method: "POST",
            body: JSON.stringify({ originalName: file.name, mimeType: file.type, data: base64 }),
          });
          resolve();
        } catch (e) { reject(e); }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    }),
  downloadProof: async (requestId: string, uploadId: string): Promise<{ blob: Blob; filename: string }> => {
    const res = await fetch(`${BASE_URL}/api/client-requests/${requestId}/uploads/${uploadId}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const disposition = res.headers.get("Content-Disposition") ?? "";
    const match = disposition.match(/filename="([^"]+)"/);
    const filename = match?.[1] ?? "download";
    const blob = await res.blob();
    return { blob, filename };
  },
  getNotifications: () => apiFetch<Notification[]>("/api/client-requests/notifications"),
  markNotificationsRead: () =>
    apiFetch<void>("/api/client-requests/notifications/read", { method: "POST" }),
};
