import React, { useState } from "react";

function EsqueciSenha() {
    const [email, setEmail] = useState("");
    const [mensagem, setMensagem] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {

            const response = await fetch("http://localhost:8080/pessoas/redefinir-senha", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({ email }).toString(),
            });

            if (response.ok) {
                setMensagem("Verifique seu e-mail para redefinir sua senha.");
            } else {
                const erro = await response.text();
                setMensagem("Erro ao enviar e-mail: " + erro);
            }
        } catch (error) {
            console.error("Erro ao enviar e-mail:", error);
            setMensagem("Erro na requisição.");
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <h2>Recuperar Senha</h2>
            <form onSubmit={handleSubmit} style={{ display: "inline-block", textAlign: "left", marginTop: "20px" }}>
                <label htmlFor="email">E-mail:</label>
                <br />
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Digite seu e-mail"
                    required
                    style={{ width: "300px", padding: "10px", marginTop: "5px" }}
                />
                <br />
                <button
                    type="submit"
                    style={{ marginTop: "15px", padding: "10px 20px", cursor: "pointer" }}
                >
                    Enviar Link
                </button>
            </form>

            {mensagem && <p style={{ marginTop: "20px" }}>{mensagem}</p>}
        </div>
    );
}

export default EsqueciSenha;
