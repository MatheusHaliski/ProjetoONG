import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function EsqueciSenha() {
    const [email, setEmail] = useState("");
    const [mensagem, setMensagem] = useState("");
    const navigate = useNavigate();

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

                // Mostra o modal de sucesso
                Swal.fire({
                    icon: 'success',
                    title: 'E-mail enviado!',
                    text: 'Verifique seu e-mail para redefinir sua senha.',
                    confirmButtonText: 'OK'
                }).then(() => {
                    navigate("/MenuInicial");
                });

            } else {
                const erro = await response.text();
                setMensagem("Erro ao enviar e-mail: " + erro);

                Swal.fire({
                    icon: 'error',
                    title: 'Erro ao enviar e-mail',
                    text: erro || 'Algo deu errado ao tentar enviar o e-mail.'
                });
            }
        } catch (error) {
            console.error("Erro ao enviar e-mail:", error);
            setMensagem("Erro na requisição.");

            Swal.fire({
                icon: 'error',
                title: 'Erro na requisição',
                text: 'Tente novamente mais tarde.'
            });
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
