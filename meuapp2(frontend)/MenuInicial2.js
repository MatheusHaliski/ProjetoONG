// Importa os hooks do React e a ferramenta de navegação entre páginas (react-router-dom)
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './MenuInicial.css';
import Header from "./Header";
import Footer from "./Footer";
// Função principal do componente MenuInicial
function MenuInicial() {
    const [emailUsuario, setEmailUsuario] = useState(null);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [imagemPerfil, setImagemPerfil] = useState(null);

    useEffect(() => {
        const email = sessionStorage.getItem("emailUsuario");
        if (!email) {
            navigate('/login');
        } else {
            setEmailUsuario(email);
            fetch(`http://localhost:8080/pessoas/${email}/imagemPerfil`)
                .then(response => {
                    if (response.ok) {
                        return response.blob();
                    }
                    throw new Error("Imagem não encontrada");
                })
                .then(imageBlob => {
                    const imageObjectURL = URL.createObjectURL(imageBlob);
                    setImagemPerfil(imageObjectURL);
                })
                .catch(error => {
                    console.error("Erro ao buscar imagem do perfil:", error);
                });
            setIsLoading(false);
        }
    }, [navigate]);

    if (isLoading) {
        return null;
    }

    return (
        <>
            <Header />

            {/* Underheader com nome e imagem do usuário */}
            <div className="underheader d-flex justify-content-between align-items-center p-3">
                <div className="d-flex align-items-center">
                    {imagemPerfil && (
                        <div
                            style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                border: '2px solid #ccc',
                                backgroundColor: '#f8f9fa',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '16px'
                            }}
                        >
                            <img
                                src={imagemPerfil}
                                alt="Imagem de perfil"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain'
                                }}
                            />
                        </div>
                    )}
                    <h4 className="mb-0">Bem-vindo administrador, {emailUsuario}!</h4>
                </div>
                <button
                    className="btn btn-danger"
                    onClick={() => {
                        sessionStorage.clear();
                        navigate('/login');
                    }}
                >
                    Sair
                </button>
            </div>



            {/* Grid de cartões */}
            <div className="container mt-4 mb-5">
                <div className="card-grid">
                    <CardMenu
                        image="assets/a3.png"
                        text="Realizar Doação - Clique aqui para doar um equipamento eletrônico!"
                        onClick={() => navigate('/realizar-doacao')}
                    />
                    <CardMenu
                        image="assets/a.jpeg"
                        text="Visualizar Minhas Doações - Clique para visualizar suas doações!"
                        onClick={() => navigate('/visualizar-minhas-doacoes')}
                    />
                    <CardMenu
                        image="assets/a2.png"
                        text="Visualizar Todas as doações - Clique para visualizar doações de todos os usuários!"
                        onClick={() => navigate('/visualizar-doacoes-recebidas')}
                    />
                    <CardMenu
                        image="assets/imgg.png"
                        text="Visualizar doadores(pessoas) cadastradas - Clique para visualizar doadores cadastrados!"
                        onClick={() => navigate('/visualizar-doadores-lista')}
                    />
                    <CardMenu
                        image="assets/altp.png"
                        text="Alterar Dados de Perfil - Clique aqui para alterar seus dados de perfil!"
                        onClick={() => navigate('/form-alterar-perfil')}
                    />
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-dark text-white text-center py-3">
                &copy; {new Date().getFullYear()} Minha Aplicação de Doações. Todos os direitos reservados.
            </footer>
        </>
    );
}

function CardMenu({ image, text, onClick }) {
    return (
        <div className="card card-menu" onClick={onClick}>
            <img
                src={image}
                alt={text}
                className="card-img-top"
                style={{
                    height: '250px',
                    objectFit: 'cover',
                    borderTopLeftRadius: '15px',
                    borderTopRightRadius: '15px'
                }}
            />
            <div className="card-body d-flex justify-content-center align-items-center">
                <h5 className="card-title text-center">{text}</h5>
            </div>
        </div>
    );
}

export default MenuInicial;
