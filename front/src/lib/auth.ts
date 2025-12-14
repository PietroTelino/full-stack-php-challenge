import { api, ensureCsrfCookie } from "./api";

export async function registerUser(name: string, email: string, password: string) {
  const res = await api.post("/api/register", { name, email, password });
  return res.data;
}

export async function loginUser(email: string, password: string) {
  // CSRF é obrigatório para /login (rota web)
  await ensureCsrfCookie();

  // login (sessão via cookie)
  await api.post("/api/login", { email, password });

  // confirma usuário autenticado
  const me = await api.get("/api/me");
  return me.data;
}

export async function logoutUser() {
  // opcional: também pode exigir CSRF dependendo de como você expôs /logout (web)
  await ensureCsrfCookie();
  await api.post("/api/logout");
}

export async function me() {
  const res = await api.get("/api/me");
  return res.data;
}
