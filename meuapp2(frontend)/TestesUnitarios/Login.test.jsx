import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import { BrowserRouter } from 'react-router-dom';

// Mocks
jest.mock('sweetalert2', () => ({
    fire: jest.fn().mockResolvedValue({}),
}));
jest.mock('./Header', () => () => <div data-testid="header" />);
jest.mock('./Footer', () => () => <div data-testid="footer" />);
global.fetch = jest.fn();

const renderComponent = () => {
    render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
    );
};

describe('Login Component', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    it('renderiza o formulário de login corretamente', () => {
        renderComponent();
        expect(screen.getByPlaceholderText(/Digite seu e-mail/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Digite sua senha/i)).toBeInTheDocument();
    });

    it('exibe erro se o e-mail for inválido', async () => {
        const Swal = require('sweetalert2');
        renderComponent();

        fireEvent.change(screen.getByPlaceholderText(/Digite seu e-mail/i), {
            target: { value: 'emailinvalido' }
        });
        fireEvent.change(screen.getByPlaceholderText(/Digite sua senha/i), {
            target: { value: 'Senha123' }
        });

        fireEvent.click(screen.getByText(/Entrar/i));

        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith({
                icon: 'error',
                title: 'Erro',
                text: 'Formato de e-mail inválido.'
            });
        });
    });

    it('realiza login com sucesso', async () => {
        const Swal = require('sweetalert2');
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ tipoUsuario: 'USUARIO_ADM' })
        });

        renderComponent();

        fireEvent.change(screen.getByPlaceholderText(/Digite seu e-mail/i), {
            target: { value: 'teste@exemplo.com' }
        });
        fireEvent.change(screen.getByPlaceholderText(/Digite sua senha/i), {
            target: { value: 'Senha123' }
        });

        fireEvent.click(screen.getByText(/Entrar/i));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/pessoas/pessoas12',
                expect.objectContaining({
                    method: 'POST',
                    body: expect.any(String),
                })
            );
            expect(Swal.fire).toHaveBeenCalledWith({
                icon: 'success',
                title: 'Sucesso',
                text: 'Login realizado com sucesso!'
            });
        });
    });

    it('exibe erro ao receber status 401', async () => {
        const Swal = require('sweetalert2');
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 401,
            json: async () => ({ erro: 'Email ou senha inválidos.' })
        });

        renderComponent();

        fireEvent.change(screen.getByPlaceholderText(/Digite seu e-mail/i), {
            target: { value: 'teste@exemplo.com' }
        });
        fireEvent.change(screen.getByPlaceholderText(/Digite sua senha/i), {
            target: { value: 'Senha123' }
        });

        fireEvent.click(screen.getByText(/Entrar/i));

        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith({
                icon: 'error',
                title: 'Erro',
                text: 'Email ou senha inválidos.'
            });
        });
    });
});