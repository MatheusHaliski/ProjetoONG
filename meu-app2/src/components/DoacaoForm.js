import React, { useState } from 'react';

const DoacaoForm = () => {
    const [descricao, setDescricao] = useState('');
    const [quantidade, setQuantidade] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const email = sessionStorage.getItem("emailUsuario");

        const dados = new URLSearchParams();
        dados.append("descricao", descricao);
        dados.append("quantidade", quantidade);
        dados.append("email", email);

        try {
            const response = await fetch("http://localhost:8080/realizar-doacao2", {
                method: "POST",
                body: dados,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });

            if (response.ok) {
                alert("Doação enviada com sucesso!");
                setDescricao('');
                setQuantidade('');
            } else {
                alert("Erro ao enviar doação.");
            }
        } catch (error) {
            console.error("Erro:", error);
            alert("Erro na requisição.");
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2>Fazer uma Doação</h2>

                <label style={styles.label}>Descrição:</label>
                <input
                    type="text"
                    name="descricao"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    required
                    style={styles.input}
                />

                <label style={styles.label}>Quantidade:</label>
                <input
                    type="number"
                    name="quantidade"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                    required
                    style={styles.input}
                />

                <button type="submit" style={styles.button}>Enviar Doação</button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        margin: 0
    },
    form: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
        textAlign: 'center',
        width: '300px'
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 'bold',
        color: '#333'
    },
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        fontSize: '14px'
    },
    button: {
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        padding: '12px 20px',
        fontSize: '16px',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease'
    }
};

export default DoacaoForm;
