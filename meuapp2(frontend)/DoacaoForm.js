// Importa as bibliotecas React e hooks necessários
import React, { useEffect, useState } from 'react';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
// Componente funcional principal
const DoacaoForm = () => {
    const [produtos, setProdutos] = useState([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [quantidade, setQuantidade] = useState('');
    const emailDoUsuario = sessionStorage.getItem("emailUsuario");
    const navigate = useNavigate();

    useEffect(() => {
        const listarProdutos = async () => {
            try {
                const response = await fetch('http://localhost:8080/produtos');
                if (!response.ok) {
                    throw new Error('Erro na resposta da API');
                }
                const data = await response.json();
                console.log('Produtos recebidos:', data);
                setProdutos(data);
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
            }
        };

        listarProdutos();
    }, []);

    const handleProdutoSelecionado = (produto) => {
        setProdutoSelecionado(produto);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!produtoSelecionado || !quantidade) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Selecione um produto e informe a quantidade.',
            });
            return;
        }
         // Cria um objeto FormData para enviar os dados para a API
        const formData = new FormData();
        formData.append('descricao', produtoSelecionado.nome);
        formData.append('quantidade', quantidade);
        formData.append('email', emailDoUsuario);
        formData.append('imagem_url', produtoSelecionado.imagem_url || '');

        try {
            const response = await fetch('http://localhost:8080/realizar-doacao2', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Erro na doação');
            }

            await Swal.fire({
                icon: 'success',
                title: 'Doação realizada!',
                text: 'Obrigado pela sua doação.',
                confirmButtonText: 'Voltar ao menu',
            });

            navigate('/menuinicial');

        } catch (error) {
            console.error('Erro ao doar produtos:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro',
                text: 'Não foi possível realizar a doação. Tente novamente.',
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: 'auto' }}>
            <label>Selecione o produto:</label>
            <div
                style={{
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    padding: '10px',
                    borderRadius: '5px',
                    marginBottom: '15px'
                }}
            >
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {produtos.map((produto) => (
                        <li
                            key={produto.id}
                            onClick={() => handleProdutoSelecionado(produto)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                padding: '10px',
                                backgroundColor: produtoSelecionado?.id === produto.id ? '#cce5ff' : 'transparent',
                                borderRadius: '5px',
                                marginBottom: '10px',
                                border: produtoSelecionado?.id === produto.id ? '1px solid #007bff' : '1px solid transparent',
                                transition: 'background-color 0.3s, border 0.3s'
                            }}
                        >
                            {produto.imagem_url && (
                                <img
                                    src={produto.imagem_url}
                                    alt={produto.nome}
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        marginRight: '15px',
                                        border: '1px solid #ddd'
                                    }}
                                />
                            )}
                            <div>
                                <h3 style={{ margin: '0 0 5px 0' }}>{produto.nome}</h3>
                                <p style={{ margin: '2px 0' }}><strong>Descrição:</strong> {produto.descricao}</p>
                                <p style={{ margin: '2px 0' }}><strong>Preço:</strong> R$ {produto.preco?.toFixed(2)}</p>
                                <p style={{ margin: '2px 0' }}><strong>Categoria:</strong> {produto.categoria}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <label>Quantidade:</label>
            <input
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                min="1"
                required
                style={{ width: '100%', padding: '8px', marginBottom: '15px', boxSizing: 'border-box' }}
            />

            <button
                type="submit"
                disabled={!produtoSelecionado || !quantidade}
                style={{
                    width: '100%',
                    padding: '10px',
                    cursor: (!produtoSelecionado || !quantidade) ? 'not-allowed' : 'pointer'
                }}
            >
                Enviar Doação
            </button>
        </form>
    );
};

export default DoacaoForm;
