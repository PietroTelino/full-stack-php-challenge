import React from "react";
import { loginUser } from "../lib/auth";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // loginUser deve:
      // 1) GET /sanctum/csrf-cookie (withCredentials)
      // 2) POST /login (withCredentials + X-XSRF-TOKEN via axios)
      await loginUser(email.trim(), password);
      nav("/");
    } catch (err: any) {
      const status = err?.response?.status;

      const msg =
        err?.response?.data?.message ??
        (status === 422
          ? "Verifique os campos."
          : status === 401
          ? "Email ou senha inválidos."
          : status === 419
          ? "Sessão expirada (CSRF). Recarregue a página e tente novamente."
          : "Falha no login.");

      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h2>Login</h2>

      {error && <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div>}

      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label>Email</label>
          <input
            style={{ width: "100%", padding: 8 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@exemplo.com"
            autoComplete="email"
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Senha</label>
          <input
            style={{ width: "100%", padding: 8 }}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            autoComplete="current-password"
          />
        </div>

        <button type="submit" style={{ padding: "8px 12px" }} disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p style={{ marginTop: 12 }}>
        Não tem conta? <Link to="/register">Cadastrar</Link>
      </p>
    </div>
  );
}
