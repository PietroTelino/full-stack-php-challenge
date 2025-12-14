import { api, ensureCsrfCookie } from "./api";

export type Transaction = {
  id: number;
  type: "deposit" | "transfer" | "reversal";
  status: "completed" | "reversed" | "failed";
  amount: string;
  from_user_id: number | null;
  to_user_id: number | null;
  reference_id: number | null;
  meta: any;
  created_at: string;
};

export async function getWallet() {
  const res = await api.get("/api/wallet");
  return res.data as { balance: number };
}

export async function listTransactions(page = 1) {
  const res = await api.get(`/api/transactions?page=${page}`);
  return res.data as {
    data: Transaction[];
    current_page: number;
    last_page: number;
  };
}

export async function deposit(amount: number) {
  await ensureCsrfCookie();
  const res = await api.post("/api/wallet/deposit", { amount });
  return res.data as { transaction: Transaction };
}

export async function transfer(to_email: string, amount: number) {
  await ensureCsrfCookie();
  const res = await api.post("/api/wallet/transfer", { to_email, amount });
  return res.data as { transaction: Transaction };
}

export async function reverseTransaction(id: number, reason?: string) {
  await ensureCsrfCookie();
  const res = await api.post(`/api/transactions/${id}/reverse`, { reason });
  return res.data as { transaction: Transaction };
}
