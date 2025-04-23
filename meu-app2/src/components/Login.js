import React, { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/pessoas/pessoas14", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, senha }),
            });

            if (response.ok) {
                const data = await response.json(); // Espera um JSON da API
                setMensagem(data.mensagem); // Exibe a mensagem vinda do backend
                console.log("Login realizado com sucesso!");
                // Aqui você pode redirecionar ou salvar um token, etc.
            } else {
                const erro = await response.text();
                setMensagem("Erro no login: " + erro);
                console.error("Erro ao fazer login:", erro);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            setMensagem("Erro na requisição");
        }
    };

    return (
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

            <Link to="/esqueci-senha" style={{ marginTop: "15px", display: "inline-block", color: "#007bff" }}>
                Esqueci minha senha
            </Link>


            {mensagem && <p>{mensagem}</p>}
        </div>
    );
}

export default Login;
