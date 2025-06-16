// EsqueciSenha.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EsqueciSenha from "./EsqueciSenha";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// Mock do Swal
jest.mock("sweetalert2", () => ({
  fire: jest.fn(() => Promise.resolve({ isConfirmed: true })),
}));

// Mock do useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
});

describe("Componente EsqueciSenha", () => {
  test("renderiza corretamente e envia o formulário com sucesso", async () => {
    // Mock fetch para sucesso
    global.fetch.mockResolvedValueOnce({
      ok: true,
    });

    render(<EsqueciSenha />);

    const inputEmail = screen.getByPlaceholderText("Digite seu e-mail");
    userEvent.type(inputEmail, "teste@teste.com");

    const botaoEnviar = screen.getByRole("button", { name: /enviar link/i });
    userEvent.click(botaoEnviar);

    // Esperar a chamada fetch
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    // Verificar se o fetch foi chamado com os parâmetros corretos
    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:8080/pessoas/redefinir-senha",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "email=teste%40teste.com",
      })
    );

    // Verificar se a mensagem de sucesso foi exibida na tela
    expect(await screen.findByText("Verifique seu e-mail para redefinir sua senha.")).toBeInTheDocument();

    // Verificar se o Swal foi chamado
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: "success",
        title: "E-mail enviado!",
        text: "Verifique seu e-mail para redefinir sua senha.",
        confirmButtonText: "OK",
      })
    );

    // Esperar e verificar se navegação ocorreu para /MenuInicial
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/MenuInicial"));
  });

  test("exibe erro quando fetch retorna erro", async () => {
    // Mock fetch com resposta não ok e texto de erro
    global.fetch.mockResolvedValueOnce({
      ok: false,
      text: async () => "Email não encontrado",
    });

    render(<EsqueciSenha />);

    const inputEmail = screen.getByPlaceholderText("Digite seu e-mail");
    userEvent.type(inputEmail, "erro@teste.com");

    const botaoEnviar = screen.getByRole("button", { name: /enviar link/i });
    userEvent.click(botaoEnviar);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    // Verifica mensagem de erro na tela
    expect(await screen.findByText(/Erro ao enviar e-mail: Email não encontrado/)).toBeInTheDocument();

    // Verifica Swal de erro
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: "error",
        title: "Erro ao enviar e-mail",
        text: "Email não encontrado",
      })
    );
  });

  test("exibe erro quando fetch lança exceção", async () => {
    // Mock fetch que lança erro
    global.fetch.mockRejectedValueOnce(new Error("Falha na rede"));

    render(<EsqueciSenha />);

    const inputEmail = screen.getByPlaceholderText("Digite seu e-mail");
    userEvent.type(inputEmail, "excecao@teste.com");

    const botaoEnviar = screen.getByRole("button", { name: /enviar link/i });
    userEvent.click(botaoEnviar);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    // Mensagem de erro da requisição
    expect(await screen.findByText("Erro na requisição.")).toBeInTheDocument();

    // Verifica Swal de erro na requisição
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: "error",
        title: "Erro na requisição",
        text: "Tente novamente mais tarde.",
      })
    );
  });
});
