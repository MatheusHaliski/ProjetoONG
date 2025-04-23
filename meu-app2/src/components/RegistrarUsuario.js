import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import "./RegistrarUsuario.css";

function RegistrarUsuario() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new URLSearchParams();
        formData.append("nome", nome);
        formData.append("email", email);
        formData.append("senha", senha);

        try {
            const response = await fetch("http://localhost:8080/pessoas/pessoas1", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData.toString(),
            });

            if (response.ok) {
                setMensagem("Usuário registrado com sucesso!");
                console.log("Registro realizado!");
                setTimeout(() => {
                    navigate("/Login"); // Redireciona para login após 2 segundos
                }, 2000);
            } else {
                const erro = await response.text();
                setMensagem("Erro ao registrar: " + erro);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            setMensagem("Erro na requisição");
        }
    };

    return (
        <div>
            <Header />
            <div className="register-container">
                <h2>Registrar Usuário</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                    <button type="submit">Registrar</button>
                </form>

                {mensagem && <p>{mensagem}</p>}
            </div>
        </div>
    );
}

export default RegistrarUsuario;
