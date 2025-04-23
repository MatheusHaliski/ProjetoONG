import React, { useState } from "react";

function AlterarPerfil() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        const emailUsuario = sessionStorage.getItem("emailUsuario");

        const dadosPerfil = {
            nome,
            email,
            senha,
            emailUsuario
        };

        fetch("http://localhost:8080/salvar-dados-perfil", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosPerfil)
        })
            .then((response) => {
                if (response.ok) {
                    alert("Dados alterados com sucesso!");
                } else {
                    alert("Erro ao salvar dados.");
                }
            })
            .catch((error) => {
                console.error("Erro na requisição:", error);
            });
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-lg mx-auto" style={{ maxWidth: "600px" }}>
                <div className="card-header text-center bg-primary text-white">
                    <h4>Alterar Dados do Perfil</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
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
                        <div className="d-flex justify-content-between">
                            <a href="/MenuInicial" className="btn btn-secondary">Cancelar</a>
                            <button type="submit" className="btn btn-primary">Salvar Alterações</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AlterarPerfil;
