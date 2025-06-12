import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom"; // Importação
import Swal from 'sweetalert2';

function AlterarPerfil() {
    const [emailUsuario, setEmailUsuario] = useState(null);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [imagemPerfil, setImagemPerfil] = useState(null);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [tipoUsuario, setTipoUsuario] = useState('');
    useEffect(() => {
        const email = sessionStorage.getItem("emailUsuario");
        const tipo = sessionStorage.getItem("tipoUsuario");
        if (!email) {
            navigate('/login');
        } else {
            setEmailUsuario(email);
            setTipoUsuario(tipo);
            setIsLoading(false);
        }
    }, [navigate]);

    if (isLoading) {
        // Enquanto está carregando, ou enquanto email não é válido, não renderiza nada
        return null;
    }
    const rotaMenu = tipoUsuario === "USUARIO_ADM" ? "/menuinicial2" : "/menuinicial";

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Para pré-visualizar a imagem localmente:
            const imageUrl = URL.createObjectURL(file);
            setImagemPerfil(imageUrl);

            // Para enviar ao backend depois, você também pode guardar o File:
            setImagemPerfil(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const emailUsuario = sessionStorage.getItem("emailUsuario");

        const dadosPerfil = {
            nome,
            email,
            senha,
            emailUsuario,
            imagemPerfil
        };

        sessionStorage.setItem("emailUsuario", email);

        const formData = new FormData();

// Adicione os dados JSON como Blob
        formData.append("dados", new Blob([JSON.stringify(dadosPerfil)], { type: "application/json" }));

// Adicione a imagem apenas se ela existir e for um arquivo
        if (imagemPerfil && typeof imagemPerfil !== 'string') {
            formData.append("imagemPerfil", imagemPerfil);
        }

        fetch("http://localhost:8080/salvar-dados-perfil", {
            method: "POST",
            body: formData
        })
            .then((response) => {
                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Sucesso!',
                        text: 'Dados alterados com sucesso!',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        const tipodeusuario1 = sessionStorage.getItem("tipoUsuario");
                        if (tipodeusuario1 === 'USUARIO_COMUM') {
                            navigate("/MenuInicial");
                        } else if (tipodeusuario1 === 'USUARIO_ADM') {
                            navigate("/MenuInicial2");
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro!',
                        text: 'Erro ao salvar dados.'
                    });
                }
            })
            .catch((error) => {
                console.error("Erro na requisição:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro de conexão!',
                    text: 'Não foi possível salvar os dados. Tente novamente.'
                });
            });

    };


    return (
        <div className="container mt-5">
            <div className="card shadow-lg mx-auto" style={{ maxWidth: "600px" }}>
                <div className="card-header text-center bg-primary text-white">
                    <h4>Alterar Dados do Perfil</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="mb-3">
                            <label htmlFor="nome" className="form-label">Nome:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nome"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">E-mail:</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="senha" className="form-label">Nova Senha (opcional):</label>
                            <input
                                type="password"
                                className="form-control"
                                id="senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="imagemPerfil" className="form-label">Imagem de Perfil (opcional):</label>
                            <input
                                type="file"
                                className="form-control"
                                id="imagemPerfil"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            {imagemPerfil && typeof imagemPerfil === 'string' && (
                                <div className="mt-3 text-center">
                                    <img
                                        src={imagemPerfil}
                                        alt="Pré-visualização"
                                        className="rounded-circle"
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            objectFit: 'cover',
                                            border: '2px solid #ccc'
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="d-flex justify-content-between">
                            <div className="text-center mt-4">
                                <Link to={rotaMenu} className="btn btn-primary">Voltar ao Menu</Link>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ height: '37px', fontSize: '14px', padding: '6px 12px', marginTop: '25px' }}
                            >
                                Salvar Alterações
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AlterarPerfil;
