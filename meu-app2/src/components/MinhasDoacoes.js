import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const MinhasDoacoes = () => {
    const [doacoes, setDoacoes] = useState([]);

    useEffect(() => {
        const email = sessionStorage.getItem("emailUsuario");

        if (!email) {
            console.error("Email do usuário não encontrado.");
            return;
        }

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
    }, []);



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
                        <th>Descrição</th>
                        <th>Quantidade</th>
                    </tr>
                    </thead>
                    <tbody>
                    {doacoes.map((doacao) => (
                        <tr key={doacao.id}>
                            <td>{doacao.id}</td>
                            <td>{doacao.descricao}</td>
                            <td>{doacao.quantidade}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            <div className="text-center mt-4">
                <Link to="/menuinicial" className="btn btn-primary">Voltar ao Menu</Link>
            </div>
        </div>
    );
};

export default MinhasDoacoes;
