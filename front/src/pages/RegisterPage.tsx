import React from "react";
import { registerUser } from "../lib/auth";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const nav = useNavigate();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      await registerUser(name, email, password);
      nav("/login");
    } catch (err: any) {
      if (err?.response?.status === 422) {
        const errors = err?.response?.data?.errors;
        if (errors) {
          const firstField = Object.keys(errors)[0];
          const firstMsg = errors[firstField]?.[0];
          setError(firstMsg ?? "Verifique os campos.");
          return;
        }
      }

      const msg =
        err?.response?.data?.message ??
        (typeof err?.response?.data === "string" ? err.response.data : null) ??
        `Falha no cadastro (status ${err?.response?.status ?? "?"}).`;

      setError(msg);
    }
  }

  return (
    <div style={{ width: "100%", border: "1px solid #333", padding: 16 }}>
      <h2>Cadastrar</h2>

      {error && <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div>}

      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label>Nome</label>
          <input
            style={{ width: "100%", padding: 8 }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Email</label>
          <input
            style={{ width: "100%", padding: 8 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@exemplo.com"
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Senha</label>
          <input
            style={{ width: "100%", padding: 8 }}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="mínimo 8 caracteres"
          />
        </div>

        <button type="submit" style={{ padding: "8px 12px" }}>
          Criar conta
        </button>
      </form>

      <p style={{ marginTop: 12 }}>
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </div>
  );
}
