import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ListaDoadoresCadastrados from './ListaDoadoresCadastrados';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';

const mockNavigate = jest.fn();

// Mock useNavigate
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('ListaDoadoresCadastrados', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
        fetch.resetMocks?.(); // Caso esteja usando `jest-fetch-mock`
        global.fetch = jest.fn();

        sessionStorage.clear();
    });

    const renderComponent = () => {
        render(
            <BrowserRouter>
                <ListaDoadoresCadastrados />
            </BrowserRouter>
        );
    };

    it('redireciona para /login se não houver email na sessionStorage', async () => {
        renderComponent();
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });

    it('renderiza tabela com dados de doadores', async () => {
        sessionStorage.setItem('emailUsuario', 'admin@teste.com');
        sessionStorage.setItem('tipoUsuario', 'ADMIN');

        const mockData = [
            { id: 1, email: 'doador1@example.com', nome: 'João', tipoDeUsuario: 'USUARIO' },
            { id: 2, email: 'doador2@example.com', nome: 'Maria', tipoDeUsuario: 'USUARIO_ADM' },
        ];

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        });

        renderComponent();

        expect(await screen.findByText(/Os Doadores Cadastrados/i)).toBeInTheDocument();

        for (const doador of mockData) {
            expect(await screen.findByText(doador.email)).toBeInTheDocument();
            expect(screen.getByText(doador.nome)).toBeInTheDocument();
            expect(screen.getByText(doador.tipoDeUsuario)).toBeInTheDocument();
        }
    });

    it('exibe mensagem de "Nenhuma doação registrada" se array estiver vazio', async () => {
        sessionStorage.setItem('emailUsuario', 'admin@teste.com');
        sessionStorage.setItem('tipoUsuario', 'ADMIN');

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        renderComponent();

        expect(await screen.findByText(/Nenhuma doação registrada/i)).toBeInTheDocument();
    });

    it('lida com erro na requisição de doadores', async () => {
        sessionStorage.setItem('emailUsuario', 'admin@teste.com');
        sessionStorage.setItem('tipoUsuario', 'ADMIN');

        fetch.mockRejectedValueOnce(new Error('Erro na requisição'));

        renderComponent();

        expect(await screen.findByText(/Nenhuma doação registrada/i)).toBeInTheDocument();
    });

    it('botão de voltar ao menu está presente e funcional', async () => {
        sessionStorage.setItem('emailUsuario', 'admin@teste.com');
        sessionStorage.setItem('tipoUsuario', 'ADMIN');

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        renderComponent();

        const link = await screen.findByRole('link', { name: /voltar ao menu/i });
        expect(link).toHaveAttribute('href', '/menuinicial2');
    });
});
