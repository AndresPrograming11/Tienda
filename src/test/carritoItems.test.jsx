/**
 * @jest-environment jsdom
 */import '@testing-library/jest-dom';
import { test, expect ,jest,beforeEach,describe} from "@jest/globals";

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NavbarTop from "../components/NavbarTop";


// Mock de servicios si los usas para carrito
jest.mock("../services/carritoItem", () => ({
  obtenerCarrito: jest.fn(() => Promise.resolve([])),
  eliminarDelCarritoBD: jest.fn(() => Promise.resolve()),
}));

describe("NavbarTop carrito - agregar, obtener y eliminar", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("role", "user");
    localStorage.setItem("userId", "123");
  });

  test("agregar items al carrito y mostrar", async () => {
    render(<NavbarTop />);
    fireEvent.click(screen.getByText(/camisa azul al carrito/i));
    fireEvent.click(screen.getByText(/pantalón negro al carrito/i));
    fireEvent.click(screen.getByRole("button", { name: "🛒" }));
    await waitFor(() => {
      expect(screen.getByText(/camisa azul/i)).toBeInTheDocument();
      expect(screen.getByText(/pantalón negro/i)).toBeInTheDocument();
    });
  });

  test("obtener items en el carrito", async () => {
    render(<NavbarTop />);

    fireEvent.click(screen.getByText(/camisa azul al carrito/i));
    fireEvent.click(screen.getByRole("button", { name: "🛒" }));

    await waitFor(() => {
      expect(screen.getByText(/camisa azul/i)).toBeInTheDocument();
    });
  });

  test("eliminar un item del carrito", async () => {
    render(<NavbarTop />);
  
    fireEvent.click(screen.getByText(/camisa azul al carrito/i));
    fireEvent.click(screen.getByRole("button", { name: "🛒" }));
  
    await waitFor(() => {      
      expect(screen.getByRole("heading", { name: /tu carrito/i })).toBeInTheDocument();  
     
      expect(screen.getByText(/camisa azul/i)).toBeInTheDocument();
    });
  
  });
  
});
