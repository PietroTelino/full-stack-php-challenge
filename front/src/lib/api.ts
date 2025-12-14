import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,

  // IMPORTANTE: força o Axios a enviar o header XSRF mesmo sendo cross-origin
  withXSRFToken: true,

  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// Laravel Sanctum SPA cookies
api.defaults.xsrfCookieName = "XSRF-TOKEN";
api.defaults.xsrfHeaderName = "X-XSRF-TOKEN";

// reforça credentials para qualquer request
api.defaults.withCredentials = true;

/**
 * Necessário antes de chamar /api/login (rota API)
 * para obter XSRF-TOKEN + cookie de sessão.
 */
export async function ensureCsrfCookie() {
  await api.get("/sanctum/csrf-cookie", {
    withCredentials: true,
    withXSRFToken: true,
  });
}
