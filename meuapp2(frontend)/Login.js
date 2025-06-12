import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import "./Login.css";
import Header from "./Header";
import Footer from "./Footer";
import img55 from '../assets/bg-register.jpg';
import EsqueciSenha from "./EsqueciSenha";
import { FaBookOpen, FaHeartbeat, FaLeaf, FaDollarSign } from "react-icons/fa";
function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const navigate = useNavigate();
    const areas = [
        { name: "Educação", icon: <FaBookOpen size={28} /> },
        { name: "Saúde", icon: <FaHeartbeat size={28} /> },
        { name: "Meio Ambiente", icon: <FaLeaf size={28} /> },
        { name: "Economia", icon: <FaDollarSign size={28} /> },
    ];
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
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <div className="flex-grow-1 d-flex align-items-center justify-content-center bg-light">
                <div
                    className="row w-100 shadow-lg rounded"
                    style={{
                        maxWidth: "1500px",
                        backgroundColor: "white",
                        minHeight: "80vh",
                        overflow: "hidden",
                    }}
                >
                    {/* Lado esquerdo com imagem */}
                    <div className="col-md-6">
                        <div
                            style={{
                                height: "100%",
                                backgroundImage: "url('/assets/img55.jpg')",
                                backgroundSize: "cover",
                                backgroundPosition: "center -10%",
                                borderTopLeftRadius: "0.5rem",
                                borderBottomLeftRadius: "0.5rem",
                            }}

                        />
                    </div>

                    {/* Lado direito com formulário */}
                    <div
                        className="col-md-6 d-flex flex-column justify-content-center"
                        style={{ padding: "3rem" }}
                    >
                        <h2 className="mb-4 text-center text-black">Login</h2>
                        <form onSubmit={handleSubmit}>
                            {/* Campos do formulário */}
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
                                        color: "#6c757d",
                                    }}
                                >
                {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
              </span>
                            </div>
                            <div className="d-grid mb-4">
                                <button type="submit" className="btn btn-primary">
                                    Entrar
                                </button>
                            </div>
                        </form>

                        {/* Links abaixo do formulário */}
                        <div className="text-center mb-4">
            <span
                onClick={handleEsqueciSenha}
                className="text-decoration-none text-primary"
                style={{ cursor: "pointer" }}
            >
              Esqueci minha senha
            </span>
                            <br />
                            <Link
                                to="/registrarusuario"
                                className="text-decoration-none text-success"
                            >
                                Criar nova conta
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            {/* SEÇÃO "Sua doação faz a diferença!" E DEPOIMENTOS */}
            <div className="container my-5">
                <div
                    className="shadow-lg rounded p-4 mb-5"
                    style={{ backgroundColor: "white" }}
                >
                    <h2 className="fw-bold mb-3 text-center">
                        Veja como sua doação faz a diferença!
                    </h2>
                    <p className="text-center">
                        Sua contribuição mensal ajuda a transformar vidas, oferecendo acesso a
                        equipamentos eletrônicos para quem mais precisa.
                    </p>

                    {/* BLOQUINHOS DE ÁREAS DE APOIO */}
                    <div className="d-flex justify-content-center flex-wrap gap-4 mt-4">
                        {areas.map(({ name, icon }) => (
                            <div
                                key={name}
                                className="shadow-sm rounded d-flex flex-column align-items-center justify-content-center"
                                style={{
                                    width: "140px",
                                    height: "110px",
                                    backgroundColor: "#007bff",
                                    color: "white",
                                    fontWeight: "bold",
                                    fontSize: "1.1rem",
                                    cursor: "pointer",
                                    userSelect: "none",
                                    padding: "12px",
                                    transition: "all 0.3s ease",
                                    boxShadow: "0 4px 12px rgba(0, 123, 255, 0.3)",
                                }}
                                onClick={() => alert(`Obrigado por apoiar a causa de ${name}!`)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "#0056b3";
                                    e.currentTarget.style.boxShadow = "0 6px 18px rgba(0, 86, 179, 0.6)";
                                    e.currentTarget.style.transform = "scale(1.05)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "#007bff";
                                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 123, 255, 0.3)";
                                    e.currentTarget.style.transform = "scale(1)";
                                }}
                            >
                                {icon}
                                <span style={{ marginTop: "8px" }}>{name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Depoimentos */}
                <div className="shadow-lg rounded p-4" style={{ backgroundColor: "white" }}>
                    <h5 className="text-center mb-3 text-black">Depoimentos</h5>

                    {/* Depoimento 1 */}
                    <div
                        className="border rounded p-3 mb-3 d-flex align-items-center"
                        style={{ gap: "15px" }}
                    >
                        <img
                            src="/assets/ana.png"  // substitua pelo caminho correto da foto
                            alt="Ana"
                            style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                flexShrink: 0,
                            }}
                        />
                        <div>
                            <p className="mb-1 fst-italic" style={{ color: "#333" }}>
                                "Conseguir um computador me ajudou a estudar e a buscar melhores
                                oportunidades. Sou muito grato!"
                            </p>
                            <small style={{ color: "#555" }}>- João, beneficiário</small>
                        </div>
                    </div>

                    {/* Depoimento 2 */}
                    <div
                        className="border rounded p-3 mb-3 d-flex align-items-center"
                        style={{ gap: "15px" }}
                    >
                        <img
                            src="/assets/carlos.png"  // substitua pelo caminho correto da foto
                            alt="Carlos"
                            style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                flexShrink: 0,
                            }}
                        />
                        <div>
                            <p className="mb-1 fst-italic" style={{ color: "#333" }}>
                                "Apoiar esta ONG é saber que estou ajudando a levar tecnologia para quem mais precisa."
                            </p>
                            <small style={{ color: "#555" }}>- Carlos, doador</small>
                        </div>
                    </div>
                </div>

            </div>

            <Footer />
        </div>
    );



}

const handleEsqueciSenha = async (navigate) => {
    const { value: email } = await Swal.fire({
        title: "Recuperar Senha",
        html: `<input type="email" id="email" class="swal2-input" placeholder="Digite seu e-mail" />`,
        showCancelButton: true,
        confirmButtonText: "Enviar",
        preConfirm: () => {
            const email = Swal.getPopup().querySelector('#email').value;
            if (!email) {
                Swal.showValidationMessage(`Por favor insira um e-mail`);
            }
            return email;
        }
    });

    if (email) {
        try {
            const response = await fetch("http://localhost:8080/pessoas/redefinir-senha", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({ email }).toString(),
            });

            if (response.ok) {
                await Swal.fire({
                    icon: 'success',
                    title: 'E-mail enviado!',
                    text: 'Verifique seu e-mail para redefinir sua senha.',
                    confirmButtonText: 'OK'
                });
                navigate("/MenuInicial");  // redireciona se quiser
            } else {
                const erro = await response.text();
                await Swal.fire({
                    icon: 'error',
                    title: 'Erro ao enviar e-mail',
                    text: erro || 'Algo deu errado ao tentar enviar o e-mail.'
                });
            }
        } catch (error) {
            console.error("Erro ao enviar e-mail:", error);
            await Swal.fire({
                icon: 'error',
                title: 'Erro na requisição',
                text: 'Tente novamente mais tarde.'
            });
        }
    }
};


export default Login;
