import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new URLSearchParams();
        formData.append("email", email);
        formData.append("password", senha);

        try {
            const response = await fetch("http://localhost:8080/pessoas/pessoas12", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData.toString(),
                credentials: "include"
            });

            if (response.ok) {
                const data = await response.json();
                setMensagem("Login realizado com sucesso!");
                console.log("Login efetuado por:", data);
                sessionStorage.setItem("emailUsuario", email);
                navigate("/MenuInicial");

            } else if (response.status === 401) {
                const erro = await response.json();
                setMensagem(erro.erro || "Email ou senha inválidos.");
            } else {
                const erro = await response.text();
                setMensagem("Erro no login: " + erro);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            setMensagem("Erro na requisição");
        }
    };

    return (
        <div>
            <Header />
            <div className="login-container">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Digite seu e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Digite sua senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                    <button type="submit">Entrar</button>
                </form>

                <Link
                    to="/esqueci-senha"
                    style={{ marginTop: "15px", display: "inline-block", color: "#007bff" }}
                >
                    Esqueci minha senha
                </Link>

                <br />

                <Link
                    to="/registrarusuario"
                    style={{ marginTop: "10px", display: "inline-block", color: "#28a745" }}
                >
                    Criar nova conta
                </Link>

                {mensagem && <p>{mensagem}</p>}
            </div>
        </div>
    );
}

export default Login;
