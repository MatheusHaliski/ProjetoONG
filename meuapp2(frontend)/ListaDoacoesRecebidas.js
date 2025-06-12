import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const ListaDoacoesRecebidas = () => {
    const [doacoes, setDoacoes] = useState([]);
    const [emailUsuario, setEmailUsuario] = useState('');
    const [tipoUsuario, setTipoUsuario] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const email = sessionStorage.getItem("emailUsuario");
        const tipo = sessionStorage.getItem("tipoUsuario");

        if (!email) {
            console.error("Email do usuário não encontrado.");
            navigate('/login');
        } else {
            setEmailUsuario(email);
            setTipoUsuario(tipo);
        }

        fetch(`http://localhost:8080/visualizar-todas-doacoes`)
            .then(response => response.json())
            .then(data => {
                console.log("Dados recebidos:", data);
                setDoacoes(data);
            })
            .catch(error => {
                console.error("Erro ao buscar doações:", error);
                setDoacoes([]);
            });
    }, []);

    const rotaMenu = tipoUsuario === "USUARIO_ADM" ? "/menuinicial2" : "/menuinicial";

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Lista de Doações</h2>

            {doacoes.length === 0 ? (
                <div className="alert alert-info text-center">
                    Nenhuma doação registrada.
                </div>
            ) : (
                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Email (Doado por)</th>
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
                <Link to={rotaMenu} className="btn btn-primary">Voltar ao Menu</Link>
            </div>
        </div>
    );
};

export default ListaDoacoesRecebidas;
