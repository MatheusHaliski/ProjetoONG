import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Header from "./Header";
import Swal from "sweetalert2";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const navigate = useNavigate();

    const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validarSenha = (senha) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(senha);

    const exibirErro = (mensagem) => {
        Swal.fire({ icon: "error", title: "Erro", text: mensagem });
    };

    const exibirSucesso = (mensagem) => {
        Swal.fire({ icon: "success", title: "Sucesso", text: mensagem });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validarEmail(email)) {
            exibirErro("Formato de e-mail inválido.");
            return;
        }

        const formData = new URLSearchParams();
        formData.append("email", email);
        formData.append("password", senha);

        try {
            const response = await fetch("http://localhost:8080/pessoas/pessoas12", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formData.toString(),
                credentials: "include"
            });

            if (response.ok) {
                const data = await response.json();
                sessionStorage.setItem("emailUsuario", email);
                sessionStorage.setItem("tipoUsuario", data.tipoUsuario);
                exibirSucesso("Login realizado com sucesso!");
                setTimeout(() => {
                    navigate(data.tipoUsuario === "USUARIO_ADM" ? "/MenuInicial2" : "/MenuInicial");
                }, 1500);
            } else if (response.status === 401) {
                const erro = await response.json();
                exibirErro(erro.erro || "Email ou senha inválidos.");
            } else {
                const erro = await response.text();
                exibirErro("Erro no login: " + erro);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            exibirErro("Erro na requisição.");
        }
    };

    return (
        <div>
            <Header />
            <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
                <div className="row w-100 shadow-lg rounded" style={{ maxWidth: "900px", backgroundColor: "white" }}>
                    {/* Lado esquerdo com imagem */}
                    <div className="col-md-6 d-none d-md-block p-0">
                        <div
                            style={{
                                height: "100%",
                                backgroundImage: "url('assets/btn-register04.jpeg')",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                borderTopLeftRadius: "0.5rem",
                                borderBottomLeftRadius: "0.5rem"
                            }}
                        ></div>
                    </div>

                    {/* Lado direito com formulário */}
                    <div className="col-md-6 p-5">
                        <h2 className="mb-4 text-center">Login</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Digite seu e-mail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3 position-relative">
                                <input
                                    type={mostrarSenha ? "text" : "password"}
                                    className="form-control"
                                    placeholder="Digite sua senha"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    required
                                />
                                <span
                                    onClick={() => setMostrarSenha(!mostrarSenha)}
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        right: "15px",
                                        transform: "translateY(-50%)",
                                        cursor: "pointer",
                                        color: "#6c757d"
                                    }}
                                >
                                    {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary">Entrar</button>
                            </div>
                        </form>

                        <div className="mt-3 text-center">
                            <Link to="/esqueci-senha" className="text-decoration-none text-primary">
                                Esqueci minha senha
                            </Link>
                            <br />
                            <Link to="/registrarusuario" className="text-decoration-none text-success">
                                Criar nova conta
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
