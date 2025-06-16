import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ListaDoacoesRecebidas from './ListaDoacoesRecebidas';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

beforeEach(() => {
    fetch.resetMocks();
    sessionStorage.clear();
});

// Mocks para o hook useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate,
}));

test('redireciona para /login se emailUsuario não estiver no sessionStorage', () => {
    render(
        <MemoryRouter>
            <ListaDoacoesRecebidas />
        </MemoryRouter>
    );
    expect(mockedNavigate).toHaveBeenCalledWith('/login');
});

test('exibe mensagem quando não há doações', async () => {
    sessionStorage.setItem('emailUsuario', 'teste@teste.com');
    sessionStorage.setItem('tipoUsuario', 'USUARIO_ADM');
    fetch.mockResponseOnce(JSON.stringify([]));

    render(
        <MemoryRouter>
            <ListaDoacoesRecebidas />
        </MemoryRouter>
    );

    await waitFor(() => {
        expect(screen.getByText('Nenhuma doação registrada.')).toBeInTheDocument();
    });
});

test('renderiza tabela com doações', async () => {
    sessionStorage.setItem('emailUsuario', 'teste@teste.com');
    sessionStorage.setItem('tipoUsuario', 'USUARIO_COMUM');
    fetch.mockResponseOnce(
        JSON.stringify([
            {
                id: 1,
                email: 'doador@teste.com',
                descricao: 'Roupa',
                quantidade: 2,
                imagemObjeto: 'base64fakeimage',
            },
        ])
    );

    render(
        <MemoryRouter>
            <ListaDoacoesRecebidas />
        </MemoryRouter>
    );

    await waitFor(() => {
        expect(screen.getByText('Roupa')).toBeInTheDocument();
        expect(screen.getByText('doador@teste.com')).toBeInTheDocument();
        expect(screen.getByAltText('Imagem do objeto')).toBeInTheDocument();
    });
});

test('botão volta ao menu leva para o caminho correto', async () => {
    sessionStorage.setItem('emailUsuario', 'teste@teste.com');
    sessionStorage.setItem('tipoUsuario', 'USUARIO_ADM');
    fetch.mockResponseOnce(JSON.stringify([]));

    render(
        <MemoryRouter>
            <ListaDoacoesRecebidas />
        </MemoryRouter>
    );

    await waitFor(() => {
        const botao = screen.getByText('Voltar ao Menu');
        expect(botao).toHaveAttribute('href', '/menuinicial2');
    });
});
