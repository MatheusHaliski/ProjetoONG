import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Footer from "./Footer";

function RegistrarUsuario() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarsenha, setConfirmarSenha] = useState("");
    const [imagem, setImagem] = useState(null);
    const [nomeValido, setNomeValido] = useState(null);
    const [emailValido, setEmailValido] = useState(null);
    const [senhaValida, setSenhaValida] = useState(null);
    const [confirmarSenhaValida, setConfirmarSenhaValida] = useState(null);

    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

    const navigate = useNavigate();

    const nomeRegex = /^[A-ZÀ-Ÿ][a-zà-ÿ]+(\s[A-ZÀ-Ÿ][a-zà-ÿ]+)+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const senhaRegex = /^(?=.*[A-Za-z])(?=.*\d)[^\s]{6,}$/;

    const handleNomeChange = (e) => {
        const valor = e.target.value;
        setNome(valor);
        setNomeValido(nomeRegex.test(valor));
    };

    const handleEmailChange = (e) => {
        const valor = e.target.value;
        setEmail(valor);
        setEmailValido(emailRegex.test(valor));
    };

    const handleSenhaChange = (e) => {
        const valor = e.target.value;
        setSenha(valor);
        const validaSenha = senhaRegex.test(valor);
        setSenhaValida(validaSenha);
        setConfirmarSenhaValida(valor === confirmarsenha);
    };

    const handleConfirmarSenhaChange = (e) => {
        const valor = e.target.value;
        setConfirmarSenha(valor);
        setConfirmarSenhaValida(valor === senha);
    };

    const validarCampos = () => {
        return (
            nomeRegex.test(nome) &&
            emailRegex.test(email) &&
            senhaRegex.test(senha) &&
            senha === confirmarsenha
        );
    };
    const handleImagemChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagem(file);
        } else {
            setImagem(null);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validarCampos()) {
            Swal.fire({
                icon: 'warning',
                title: 'Verifique os campos',
                text: 'Preencha todos os campos corretamente antes de enviar.'
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append("nome", nome);
            formData.append("email", email);
            formData.append("senha", senha);
            formData.append("confirmarsenha", confirmarsenha);
            if (imagem) {
                formData.append("imagemPerfil", imagem);
            }

            const response = await fetch("http://localhost:8080/pessoas/pessoas1", {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Registrado!',
                    text: 'Usuário registrado com sucesso.',
                    confirmButtonText: 'Ir para o login'
                }).then(() => {
                    navigate("/Login");
                });
            } else {
                const erro = await response.text();
                Swal.fire({
                    icon: 'error',
                    title: 'Erro ao registrar',
                    text: erro || 'Algo deu errado.'
                });
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            Swal.fire({
                icon: 'error',
                title: 'Erro na requisição',
                text: 'Tente novamente mais tarde.'
            });
        }
    };


    const getInputClass = (valido) => {
        if (valido === null) return "form-control";
        return valido ? "form-control is-valid" : "form-control is-invalid";
    };

    return (
        <div>
            <Header />
            <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light"
                 style={{
                     backgroundImage: "url('/assets/bg-register.jpg')",
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                 }}
            >
                <div className="row w-100 justify-content-center px-2">
                    <div
                        className="col-md-6 col-lg-4 bg-white bg-opacity-75 shadow-lg rounded-4 p-4 backdrop-blur"
                        style={{
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.3)"
                        }}
                    >
                        <h2 className="text-center mb-4 fw-bold text-primary">Criar Conta</h2>
                        <form onSubmit={handleSubmit} noValidate>
                            <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    className={getInputClass(nomeValido)}
                                    id="floatingNome"
                                    placeholder="Nome completo"
                                    value={nome}
                                    onChange={handleNomeChange}
                                    required
                                />
                                <label htmlFor="floatingNome">Nome completo</label>
                                {nomeValido === false && (
                                    <div className="invalid-feedback">
                                        Use pelo menos dois nomes com iniciais maiúsculas. Ex: João Silva
                                    </div>
                                )}
                            </div>

                            <div className="form-floating mb-3">
                                <input
                                    type="email"
                                    className={getInputClass(emailValido)}
                                    id="floatingEmail"
                                    placeholder="email@exemplo.com"
                                    value={email}
                                    onChange={handleEmailChange}
                                    required
                                />
                                <label htmlFor="floatingEmail">E-mail</label>
                                {emailValido === false && (
                                    <div className="invalid-feedback">
                                        Insira um e-mail válido.
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="floatingImagem" className="form-label">Imagem de Perfil</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="form-control"
                                    id="floatingImagem"
                                    onChange={handleImagemChange}
                                />
                            </div>
                            <div className="mb-3">
                                <div className="input-group">
                                    <input
                                        type={mostrarSenha ? "text" : "password"}
                                        className={getInputClass(senhaValida)}
                                        id="floatingSenha"
                                        placeholder="Senha"
                                        value={senha}
                                        onChange={handleSenhaChange}
                                        required
                                    />
                                    <span
                                        className="input-group-text"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setMostrarSenha(!mostrarSenha)}
                                    >
            {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
        </span>
                                    {senhaValida === false && (
                                        <div className="invalid-feedback d-block">
                                            A senha deve conter no mínimo 6 caracteres, incluindo letras e números.
                                        </div>
                                    )}
                                </div>
                            </div>


                            <div className="mb-3">
                                <div className="input-group">
                                    <input
                                        type={mostrarConfirmarSenha ? "text" : "password"}
                                        className={getInputClass(confirmarSenhaValida)}
                                        id="floatingCSenha"
                                        placeholder="Confirmar Senha"
                                        value={confirmarsenha}
                                        onChange={handleConfirmarSenhaChange}
                                        required
                                    />
                                    <span
                                        className="input-group-text"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                                    >
            {mostrarConfirmarSenha ? <FaEyeSlash /> : <FaEye />}
        </span>
                                    {confirmarSenhaValida === false && (
                                        <div className="invalid-feedback d-block">
                                            A confirmação deve ser igual à senha.
                                        </div>
                                    )}
                                </div>
                            </div>


                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary btn-lg">
                                    Registrar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default RegistrarUsuario;
