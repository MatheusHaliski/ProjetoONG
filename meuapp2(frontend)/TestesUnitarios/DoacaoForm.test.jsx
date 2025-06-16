import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import DoacaoForm from './DoacaoForm';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Swal from 'sweetalert2';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// Mock SweetAlert2
jest.mock('sweetalert2', () => ({
    fire: jest.fn(() => Promise.resolve({ isConfirmed: true })),
}));

describe('DoacaoForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        sessionStorage.clear();
        global.fetch = jest.fn();
    });

    const renderComponent = () => {
        return render(
            <BrowserRouter>
                <DoacaoForm />
            </BrowserRouter>
        );
    };

    it('carrega e exibe produtos ao montar o componente', async () => {
        sessionStorage.setItem('emailUsuario', 'teste@teste.com');

        const produtosMock = [
            {
                id: 1,
                nome: 'Arroz',
                descricao: 'Arroz branco tipo 1',
                preco: 5.99,
                categoria: 'Alimentos',
                imagem_url: 'https://example.com/arroz.jpg'
            }
        ];

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => produtosMock
        });

        renderComponent();

        expect(await screen.findByText('Arroz')).toBeInTheDocument();
        expect(screen.getByText('Descrição: Arroz branco tipo 1')).toBeInTheDocument();
        expect(screen.getByText('R$ 5.99')).toBeInTheDocument();
    });

    it('exibe alerta se tentar submeter sem selecionar produto ou quantidade', async () => {
        sessionStorage.setItem('emailUsuario', 'teste@teste.com');

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => []
        });

        renderComponent();

        fireEvent.submit(screen.getByRole('button', { name: /enviar doação/i }));

        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith({
                icon: 'error',
                title: 'Oops...',
                text: 'Selecione um produto e informe a quantidade.',
            });
        });
    });

    it('realiza a doação com sucesso e redireciona', async () => {
        sessionStorage.setItem('emailUsuario', 'doador@email.com');

        const produtoMock = {
            id: 1,
            nome: 'Feijão',
            descricao: 'Feijão carioca',
            preco: 6.49,
            categoria: 'Alimentos',
            imagem_url: 'https://example.com/feijao.jpg'
        };

        fetch
            .mockResolvedValueOnce({ ok: true, json: async () => [produtoMock] }) // GET produtos
            .mockResolvedValueOnce({ ok: true }); // POST doação

        renderComponent();

        const produto = await screen.findByText('Feijão');
        fireEvent.click(produto);

        const inputQuantidade = screen.getByLabelText(/quantidade/i);
        fireEvent.change(inputQuantidade, { target: { value: '2' } });

        fireEvent.click(screen.getByRole('button', { name: /enviar doação/i }));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:8080/realizar-doacao2', expect.objectContaining({
                method: 'POST',
            }));
            expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
                icon: 'success',
                title: 'Doação realizada!',
            }));
            expect(mockNavigate).toHaveBeenCalledWith('/menuinicial');
        });
    });

    it('exibe erro se a doação falhar', async () => {
        sessionStorage.setItem('emailUsuario', 'teste@email.com');

        const produtoMock = {
            id: 1,
            nome: 'Leite',
            descricao: 'Integral',
            preco: 4.99,
            categoria: 'Bebidas',
            imagem_url: ''
        };

        fetch
            .mockResolvedValueOnce({ ok: true, json: async () => [produtoMock] }) // GET produtos
            .mockRejectedValueOnce(new Error('Erro na doação')); // POST doação

        renderComponent();

        const produto = await screen.findByText('Leite');
        fireEvent.click(produto);

        fireEvent.change(screen.getByLabelText(/quantidade/i), { target: { value: '1' } });

        fireEvent.click(screen.getByRole('button', { name: /enviar doação/i }));

        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
                icon: 'error',
                title: 'Erro',
            }));
        });
    });
});
