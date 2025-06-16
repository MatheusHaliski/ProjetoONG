import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import MinhasDoacoes from './MinhasDoacoes';
import { MemoryRouter } from 'react-router-dom';

// Mock do useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('MinhasDoacoes', () => {
    beforeEach(() => {
        // Mock do sessionStorage
        Storage.prototype.getItem = jest.fn((key) => {
            if (key === 'emailUsuario') return 'teste@usuario.com';
            if (key === 'tipoUsuario') return 'USUARIO_COMUM';
            return null;
        });

        // Mock do fetch
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () =>
                    Promise.resolve([
                        {
                            id: 1,
                            email: 'teste@usuario.com',
                            descricao: 'Roupas usadas',
                            quantidade: 3,
                            imagemObjeto: null,
                        },
                    ]),
            })
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renderiza doações do usuário', async () => {
        render(<MinhasDoacoes />, { wrapper: MemoryRouter });

        expect(screen.getByText(/As minhas Doações/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText(/Roupas usadas/i)).toBeInTheDocument();
            expect(screen.getByText(/teste@usuario.com/i)).toBeInTheDocument();
            expect(screen.getByText(/3/)).toBeInTheDocument();
        });
    });

    test('exibe mensagem se não houver email no sessionStorage', () => {
        Storage.prototype.getItem = jest.fn(() => null); // força ausência do email
        render(<MinhasDoacoes />, { wrapper: MemoryRouter });

        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    test('exibe mensagem de ausência de doações', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve([]),
            })
        );

        render(<MinhasDoacoes />, { wrapper: MemoryRouter });

        await waitFor(() => {
            expect(screen.getByText(/Nenhuma doação registrada/i)).toBeInTheDocument();
        });
    });

    test('navega para o menu correto ao clicar em Voltar', async () => {
        render(<MinhasDoacoes />, { wrapper: MemoryRouter });

        await waitFor(() => {
            fireEvent.click(screen.getByText(/Voltar ao Menu/i));
        });

        expect(mockNavigate).toHaveBeenCalledWith('/menuinicial');
    });

    test('navega para o menu de admin se tipoUsuario for USUARIO_ADM', async () => {
        Storage.prototype.getItem = jest.fn((key) => {
            if (key === 'emailUsuario') return 'adm@exemplo.com';
            if (key === 'tipoUsuario') return 'USUARIO_ADM';
            return null;
        });

        render(<MinhasDoacoes />, { wrapper: MemoryRouter });

        await waitFor(() => {
            fireEvent.click(screen.getByText(/Voltar ao Menu/i));
        });

        expect(mockNavigate).toHaveBeenCalledWith('/menuinicial2');
    });
});
