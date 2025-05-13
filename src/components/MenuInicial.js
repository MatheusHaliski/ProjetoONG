import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MenuInicial.css';

function MenuInicial() {
    const [emailUsuario, setEmailUsuario] = useState(null);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true); // Novo estado para controlar carregamento

    useEffect(() => {
        const email = sessionStorage.getItem("emailUsuario");
        if (!email) {
            navigate('/login');
        } else {
            setEmailUsuario(email);
            setIsLoading(false); // Só deixa de carregar se encontrar o email
        }
    }, [navigate]);

    if (isLoading) {
        // Enquanto está carregando, ou enquanto email não é válido, não renderiza nada
        return null;
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card text-center">
                        <div className="card-header bg-primary text-white">
                            <h3>Bem-vindo, <span>{emailUsuario}</span>!</h3>
                        </div>
                        <div className="card-body">
                            <p className="lead mb-4">Escolha uma das opções abaixo para continuar:</p>
                            <div className="d-grid gap-3">
                                <button className="btn btn-primary" onClick={() => navigate('/realizar-doacao')}>
                                    Realizar Doação
                                </button>
                                <button className="btn btn-success" onClick={() => navigate('/visualizar-minhas-doacoes')}>
                                    Visualizar Minhas Doações
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
                                    sessionStorage.clear();
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

export default MenuInicial;