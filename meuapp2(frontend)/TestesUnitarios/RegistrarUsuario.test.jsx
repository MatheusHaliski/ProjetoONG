import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegistrarUsuario from './RegistrarUsuario';
import { MemoryRouter } from 'react-router-dom';

// Mock de dependências externas
jest.mock('./Header', () => () => <div data-testid="header">Header</div>);
jest.mock('./Footer', () => () => <div data-testid="footer">Footer</div>);

// Mock do Swal
jest.mock('sweetalert2', () => ({
    fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
}));

describe('RegistrarUsuario', () => {
    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({}),
            })
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renderiza campos corretamente', () => {
        render(<RegistrarUsuario />, { wrapper: MemoryRouter });

        expect(screen.getByLabelText(/Nome completo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Senha/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Confirmar Senha/i)).toBeInTheDocument();
        expect(screen.getByText(/Registrar/i)).toBeInTheDocument();
    });

    test('validação de campos: não permite envio com campos inválidos', async () => {
        render(<RegistrarUsuario />, { wrapper: MemoryRouter });

        fireEvent.click(screen.getByText(/Registrar/i));

        await waitFor(() => {
            expect(screen.getByText(/Verifique os campos/i)).toBeInTheDocument();
        });
    });

    test('envia formulário com dados válidos', async () => {
        render(<RegistrarUsuario />, { wrapper: MemoryRouter });

        fireEvent.change(screen.getByLabelText(/Nome completo/i), { target: { value: 'João Silva' } });
        fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'joao@exemplo.com' } });
        fireEvent.change(screen.getByPlaceholderText(/^Senha$/i), { target: { value: 'abc123' } });
        fireEvent.change(screen.getByPlaceholderText(/Confirmar Senha/i), { target: { value: 'abc123' } });

        fireEvent.click(screen.getByText(/Registrar/i));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(screen.getByText(/Registrado!/i)).toBeInTheDocument();
        });
    });
});

// se for necessario colocar isso no package.json

// "jest": {
//     "testEnvironment": "jsdom"
// }