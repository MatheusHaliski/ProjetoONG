// AlterarPerfil.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AlterarPerfil from "./AlterarPerfil";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// Mock do Swal
jest.mock("sweetalert2", () => ({
    fire: jest.fn(() => Promise.resolve({ isConfirmed: true })),
}));

// Mock do useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

// Mock do sessionStorage
const sessionStorageMock = (() => {
    let store = {};
    return {
        getItem(key) {
            return store[key] || null;
        },
        setItem(key, value) {
            store[key] = value.toString();
        },
        clear() {
            store = {};
        },
        removeItem(key) {
            delete store[key];
        }
    };
})();
Object.defineProperty(window, "sessionStorage", {
    value: sessionStorageMock,
});

// Mock global fetch
beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    global.fetch = jest.fn();
});

describe("Componente AlterarPerfil", () => {
    test("redireciona para /login se não houver emailUsuario no sessionStorage", () => {
        sessionStorage.clear(); // Sem emailUsuario
        render(<AlterarPerfil />);
        expect(mockNavigate).toHaveBeenCalledWith("/login");
    });

    test("renderiza formulário com dados e permite submissão com sucesso", async () => {
        // Setup sessionStorage
        sessionStorage.setItem("emailUsuario", "usuario@teste.com");
        sessionStorage.setItem("tipoUsuario", "USUARIO_COMUM");

        // Mock fetch com sucesso
        global.fetch.mockResolvedValueOnce({
            ok: true,
        });

        render(<AlterarPerfil />);

        // Espera o carregamento (isLoading = false)
        await waitFor(() => expect(screen.getByLabelText(/nome/i)).toBeInTheDocument());

        // Preenche os campos
        userEvent.type(screen.getByLabelText(/nome/i), "Nome Teste");
        userEvent.type(screen.getByLabelText(/e-mail/i), "novoemail@teste.com");
        userEvent.type(screen.getByLabelText(/nova senha/i), "123456");

        // Submete o formulário
        const botaoSalvar = screen.getByRole("button", { name: /salvar alterações/i });
        userEvent.click(botaoSalvar);

        // Espera a chamada fetch
        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

        // Verifica chamada fetch com formData contendo os dados
        const chamada = global.fetch.mock.calls[0];
        expect(chamada[0]).toBe("http://localhost:8080/salvar-dados-perfil");
        expect(chamada[1].method).toBe("POST");
        expect(chamada[1].body).toBeInstanceOf(FormData);

        // Verifica Swal sucesso
        expect(Swal.fire).toHaveBeenCalledWith(
            expect.objectContaining({
                icon: "success",
                title: "Sucesso!",
                text: "Dados alterados com sucesso!",
                confirmButtonText: "OK",
            })
        );

        // Verifica que emailUsuario foi atualizado no sessionStorage
        expect(sessionStorage.getItem("emailUsuario")).toBe("novoemail@teste.com");

        // Verifica navegação após confirmação
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/MenuInicial"));
    });

    test("exibe erro ao salvar dados com resposta fetch não ok", async () => {
        sessionStorage.setItem("emailUsuario", "usuario@teste.com");
        sessionStorage.setItem("tipoUsuario", "USUARIO_ADM");

        global.fetch.mockResolvedValueOnce({
            ok: false,
        });

        render(<AlterarPerfil />);

        await waitFor(() => expect(screen.getByLabelText(/nome/i)).toBeInTheDocument());

        userEvent.type(screen.getByLabelText(/nome/i), "Nome Teste");
        userEvent.type(screen.getByLabelText(/e-mail/i), "email@teste.com");

        userEvent.click(screen.getByRole("button", { name: /salvar alterações/i }));

        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

        expect(Swal.fire).toHaveBeenCalledWith(
            expect.objectContaining({
                icon: "error",
                title: "Erro!",
                text: "Erro ao salvar dados.",
            })
        );
    });

    test("exibe erro ao falhar requisição fetch", async () => {
        sessionStorage.setItem("emailUsuario", "usuario@teste.com");
        sessionStorage.setItem("tipoUsuario", "USUARIO_ADM");

        global.fetch.mockRejectedValueOnce(new Error("Falha na rede"));

        render(<AlterarPerfil />);

        await waitFor(() => expect(screen.getByLabelText(/nome/i)).toBeInTheDocument());

        userEvent.type(screen.getByLabelText(/nome/i), "Nome Teste");
        userEvent.type(screen.getByLabelText(/e-mail/i), "email@teste.com");

        userEvent.click(screen.getByRole("button", { name: /salvar alterações/i }));

        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

        expect(Swal.fire).toHaveBeenCalledWith(
            expect.objectContaining({
                icon: "error",
                title: "Erro de conexão!",
                text: "Não foi possível salvar os dados. Tente novamente.",
            })
        );
    });
});