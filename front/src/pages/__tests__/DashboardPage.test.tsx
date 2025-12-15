import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import DashboardPage from "../DashboardPage";

vi.mock("../../lib/auth", () => {
  return {
    me: vi.fn().mockResolvedValue({ name: "Usuário", email: "u@email.com" }),
    logoutUser: vi.fn().mockResolvedValue(true),
  };
});

vi.mock("../../lib/wallet", () => {
  return {
    getWallet: vi.fn().mockResolvedValue({ balance: 50 }),
    listTransactions: vi.fn().mockResolvedValue({
      data: [
        {
          id: 1,
          type: "deposit",
          status: "completed",
          amount: "50.00",
          from_user_id: null,
          to_user_id: null,
          reference_id: null,
          meta: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      current_page: 1,
      last_page: 1,
    }),
    deposit: vi.fn().mockResolvedValue({}),
    transfer: vi.fn().mockResolvedValue({}),
    reverseTransaction: vi.fn().mockResolvedValue({}),
  };
});

describe("DashboardPage", () => {
  it("renderiza saldo e transações", async () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    const saldoLabel = await screen.findByText(/Saldo:/i);

    const saldoContainer = saldoLabel.closest("div");
    expect(saldoContainer).toBeTruthy();

    expect(within(saldoContainer as HTMLElement).getByText(/R\$\s*50\.00/i)).toBeInTheDocument();

    expect(await screen.findByText("deposit")).toBeInTheDocument();
    expect(await screen.findByText("completed")).toBeInTheDocument();
  });
});
