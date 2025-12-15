import React from "react";
import { useNavigate } from "react-router-dom";

import { logoutUser, me as getMe } from "../lib/auth";
import { deposit, getWallet, listTransactions, reverseTransaction, transfer } from "../lib/wallet";
import type { Transaction } from "../lib/wallet";

const cardStyle: React.CSSProperties = {
  padding: 16,
  border: "1px solid #3a3a3a",
  borderRadius: 12,
  background: "#151515",
  minWidth: 0,
};

export default function DashboardPage() {
  const nav = useNavigate();

  const [user, setUser] = React.useState<any>(null);

  const [balance, setBalance] = React.useState<number>(0);
  const [txs, setTxs] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const [depositValue, setDepositValue] = React.useState<string>("50");
  const [toEmail, setToEmail] = React.useState<string>("");
  const [transferValue, setTransferValue] = React.useState<string>("10");

  async function reload() {
    setLoading(true);
    setError(null);

    try {
      const [u, w, t] = await Promise.all([getMe(), getWallet(), listTransactions(1)]);
      setUser(u);
      setBalance(w.balance);
      setTxs(t.data);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Erro ao carregar dados do dashboard.");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    reload();
  }, []);

  async function onLogout() {
    await logoutUser();
    nav("/login");
  }

  async function onDeposit() {
    setError(null);
    try {
      await deposit(Number(depositValue));
      setDepositValue("50");
      await reload();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Falha no depósito.");
    }
  }

  async function onTransfer() {
    setError(null);
    try {
      await transfer(toEmail.trim(), Number(transferValue));
      setToEmail("");
      setTransferValue("10");
      await reload();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Falha na transferência.");
    }
  }

  async function onReverse(tx: Transaction) {
    setError(null);
    try {
      await reverseTransaction(tx.id, "Reversão solicitada pelo usuário.");
      await reload();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Falha ao reverter transação.");
    }
  }

  function canReverse(t: Transaction) {
    return t.status === "completed" && (t.type === "deposit" || t.type === "transfer");
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Dashboard</h2>
        <button onClick={onLogout}>Sair</button>
      </div>

      {error && <div style={{ color: "crimson", margin: "12px 0" }}>{error}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
        <div style={cardStyle}>
          <strong>Usuário:</strong>{" "}
          {user ? `${user.name} (${user.email})` : loading ? "Carregando..." : "—"}
        </div>

        <div style={cardStyle}>
          <strong>Saldo:</strong> R$ {balance.toFixed(2)}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Depósito</h3>

          <label style={{ display: "block", marginBottom: 6 }}>Valor</label>
          <input
            value={depositValue}
            onChange={(e) => setDepositValue(e.target.value)}
            placeholder="Ex.: 50"
          />

          <div style={{ marginTop: 10 }}>
            <button onClick={onDeposit} disabled={loading}>
              Depositar
            </button>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Transferência</h3>

          <label style={{ display: "block", marginBottom: 6 }}>Email do destinatário</label>
          <input
            value={toEmail}
            onChange={(e) => setToEmail(e.target.value)}
            placeholder="destinatario@email.com"
          />

          <div style={{ height: 10 }} />

          <label style={{ display: "block", marginBottom: 6 }}>Valor</label>
          <input
            value={transferValue}
            onChange={(e) => setTransferValue(e.target.value)}
            placeholder="Ex.: 10"
          />

          <div style={{ marginTop: 10 }}>
            <button onClick={onTransfer} disabled={loading}>
              Transferir
            </button>
          </div>
        </div>
      </div>

      <div style={{ ...cardStyle, marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>Transações</h3>
          <button onClick={reload} disabled={loading}>
            {loading ? "Carregando..." : "Atualizar"}
          </button>
        </div>

        {loading ? (
          <div style={{ padding: 12 }}>Carregando...</div>
        ) : txs.length === 0 ? (
          <div style={{ padding: 12 }}>Sem transações ainda.</div>
        ) : (
          <div style={{ marginTop: 10, overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th>Valor</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {txs.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.type}</td>
                    <td>{t.status}</td>
                    <td>R$ {Number(t.amount).toFixed(2)}</td>
                    <td>{new Date(t.created_at).toLocaleString()}</td>
                    <td>
                      {canReverse(t) ? (
                        <button onClick={() => onReverse(t)}>Reverter</button>
                      ) : (
                        <span style={{ color: "rgba(255,255,255,0.5)" }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
