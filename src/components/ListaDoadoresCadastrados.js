import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const ListaDoadoresCadastrados = () => {
    const [pessoas, setPessoas] = useState([]);
    const navigate = useNavigate();
    const [emailUsuario, setEmailUsuario] = useState('');

    useEffect(() => {
        const email = sessionStorage.getItem("emailUsuario");
        const tipodeusuario = sessionStorage.getItem("tipoUsuario");
        if (!email) {
            console.error("Email do usuário não encontrado.");
            navigate('/login');
        } else {
            setEmailUsuario(email);
        }
        fetch(`http://localhost:8080/visualizar-doadores-lista`)
            .then(response => response.json())
            .then(data => {
                console.log("Dados recebidos:", data);
                setPessoas(data);
            })
            .catch(error => {
                console.error("Erro ao buscar doações:", error);
                setPessoas([]);
            });
    }, []);



    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Os Doadores Cadastrados</h2>

            {pessoas.length === 0 ? (
                <div className="alert alert-info text-center">
                    Nenhuma doação registrada.
                </div>
            ) : (
                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Nome</th>
                        <th>Tipo de Usuario</th>
                    </tr>
                    </thead>
                    <tbody>
                    {pessoas.map((pessoa) => (
                        <tr key={pessoa.id}>
                            <td>{pessoa.id}</td>
                            <td>{pessoa.email}</td>
                            <td>{pessoa.nome}</td>
                            <td>{pessoa.tipoDeUsuario}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            <div className="text-center mt-4">
                <Link to="/menuinicial2" className="btn btn-primary">Voltar ao Menu</Link>
            </div>
        </div>
    );
};

export default ListaDoadoresCadastrados;
