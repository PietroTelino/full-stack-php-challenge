import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import LoginPage from "../LoginPage";

vi.mock("../../lib/auth", () => {
  return {
    loginUser: vi.fn().mockResolvedValue({ ok: true }),
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual: any = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("LoginPage", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it("faz login e navega para /", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText("email@exemplo.com"), "user@email.com");
    await user.type(screen.getByPlaceholderText("********"), "12345678");
    await user.click(screen.getByRole("button", { name: /entrar/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
