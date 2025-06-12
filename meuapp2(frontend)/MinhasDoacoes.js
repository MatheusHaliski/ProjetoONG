import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const MinhasDoacoes = () => {
    const [doacoes, setDoacoes] = useState([]);
    const navigate = useNavigate();
    const [emailUsuario, setEmailUsuario] = useState('');
    const tipo = sessionStorage.getItem("tipoUsuario");

    useEffect(() => {
        const email = sessionStorage.getItem("emailUsuario");

        if (!email) {
            console.error("Email do usuário não encontrado.");
            navigate('/login');
        } else {
            setEmailUsuario(email);

            fetch(`http://localhost:8080/visualizar-minhas-doacoes?email=${encodeURIComponent(email)}`)
                .then(response => response.json())
                .then(data => {
                    console.log("Dados recebidos:", data);
                    setDoacoes(data);
                })
                .catch(error => {
                    console.error("Erro ao buscar doações:", error);
                    setDoacoes([]);
                });
        }
    }, [navigate]);

    const handleVoltar = () => {
        if (tipo === "USUARIO_ADM") {
            navigate("/menuinicial2");
        } else {
            navigate("/menuinicial");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">As minhas Doações</h2>

            {doacoes.length === 0 ? (
                <div className="alert alert-info text-center">
                    Nenhuma doação registrada.
                </div>
            ) : (
                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Descrição</th>
                        <th>Quantidade</th>
                        <th>Imagem Objeto</th>
                    </tr>
                    </thead>
                    <tbody>
                    {doacoes.map((doacao) => (
                        <tr key={doacao.id}>
                            <td>{doacao.id}</td>
                            <td>{doacao.email}</td>
                            <td>{doacao.descricao}</td>
                            <td>{doacao.quantidade}</td>
                            <td>
                                {doacao.imagemObjeto ? (
                                    <img
                                        src={`data:image/jpeg;base64,${doacao.imagemObjeto}`}
                                        alt="Imagem do objeto"
                                        style={{ width: '100px', height: 'auto', objectFit: 'cover', borderRadius: '5px' }}
                                    />
                                ) : (
                                    <span>Sem imagem</span>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            <div className="text-center mt-4">
                <button onClick={handleVoltar} className="btn btn-primary">
                    Voltar ao Menu
                </button>
            </div>
        </div>
    );
};

export default MinhasDoacoes;
