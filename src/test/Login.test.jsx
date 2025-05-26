import '@testing-library/jest-dom';
import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../views/Login";
import { MemoryRouter } from "react-router-dom";
import * as loginService from "../services/login";

jest.mock("../services/login");

describe("Componente Login", () => {
  const mockAutentificar = jest.fn();
  const mockSetRole = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    loginService.loginUsuario.mockResolvedValue({
      success: true,
      role: "user",
      id: "123",
    });

    render(
      <MemoryRouter>
        <Login autentificar={mockAutentificar} setRole={mockSetRole} />
      </MemoryRouter>
    );
  });

  it("renderiza campos de usuario y contraseña", () => {
    expect(screen.getByPlaceholderText("Usuario")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Contraseña")).toBeInTheDocument();
    expect(screen.getByText("Ingresar")).toBeInTheDocument();
  });

  it("realiza login correctamente", async () => {
    fireEvent.change(screen.getByPlaceholderText("Usuario"), {
      target: { value: "usuario" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "clave" },
    });
    fireEvent.click(screen.getByText("Ingresar"));

    await waitFor(() => {
      expect(loginService.loginUsuario).toHaveBeenCalledWith("usuario", "clave");
      expect(mockAutentificar).toHaveBeenCalledWith(true);
      expect(mockSetRole).toHaveBeenCalledWith("user");
    });
  });

  it("muestra alerta si login falla", async () => {
    loginService.loginUsuario.mockResolvedValueOnce({
      success: false,
      message: "Credenciales incorrectas",
    });

    window.alert = jest.fn();

    fireEvent.change(screen.getByPlaceholderText("Usuario"), {
      target: { value: "usuario" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña"), {
      target: { value: "clave" },
    });
    fireEvent.click(screen.getByText("Ingresar"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Credenciales incorrectas");
    });
  });
});
