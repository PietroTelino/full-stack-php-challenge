import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,

  withXSRFToken: true,

  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

api.defaults.xsrfCookieName = "XSRF-TOKEN";
api.defaults.xsrfHeaderName = "X-XSRF-TOKEN";

api.defaults.withCredentials = true;

export async function ensureCsrfCookie() {
  await api.get("/sanctum/csrf-cookie", {
    withCredentials: true,
    withXSRFToken: true,
  });
}
