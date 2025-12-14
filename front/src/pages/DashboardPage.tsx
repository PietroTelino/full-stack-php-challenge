import React from "react";
import { logoutUser, me } from "../lib/auth";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
    const nav = useNavigate();
    const [user, setUser] = React.useState<any>(null);

    React.useEffect(() => {
        me().then(setUser).catch(() => setUser(null));
    }, []);

    async function onLogout() {
        await logoutUser();
        nav("/login");
    }

    return (
        <div style={{ maxWidth: 900, margin: "24px auto", padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>Dashboard</h2>
            <button onClick={onLogout}>Sair</button>
        </div>

        <div style={{ marginTop: 12, padding: 12, border: "1px solid #ddd" }}>
            <strong>Usuário:</strong> {user ? `${user.name} (${user.email})` : "Carregando..."}
        </div>

        <p style={{ marginTop: 16 }}>
            Próximo passo: implementar Wallet (saldo), depósito, transferência e reversão.
        </p>
        </div>
    );
}
