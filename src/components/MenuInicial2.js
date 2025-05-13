import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function MenuInicial2() {
    const [emailUsuario, setEmailUsuario] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const email = sessionStorage.getItem("emailUsuario");
        if (!email) {
            navigate('/login');
        } else {
            setEmailUsuario(email);
        }
    }, [navigate]);

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card text-center">
                        <div className="card-header bg-primary text-white">
                            <h3>Bem-vindo ADM, <span>{emailUsuario}</span>!</h3>
                        </div>
                        <div className="card-body">
                            <p className="lead mb-4">Escolha uma das opções abaixo para continuar:</p>
                            <div className="d-grid gap-3">
                                <button className="btn btn-primary" onClick={() => navigate('/realizar-doacao')}>
                                    Realizar Doação
                                </button>
                                <button className="btn btn-success" onClick={() => navigate('/visualizar-doacoes-recebidas')}>
                                    Visualizar Doações Recebidas
                                </button>
                                <button className="btn btn-success" onClick={() => navigate('/visualizar-doadores-lista')}>
                                    Visualizar Doadores Cadastrados
                                </button>
                                <button className="btn btn-warning" onClick={() => navigate('/form-alterar-perfil')}>
                                    Alterar Dados de Perfil
                                </button>
                            </div>
                        </div>
                        <div className="card-footer">
                            <button
                                className="btn btn-danger w-100"
                                onClick={() => {
                                    sessionStorage.clear(); // Limpa o e-mail ao sair
                                    navigate('/login');
                                }}
                            >
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MenuInicial2;
