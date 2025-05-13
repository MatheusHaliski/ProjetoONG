import React from 'react';
import './LoginPage.css';

function LoginPage() {
    return (
        <div className="login-container">
            <form className="login-form">
                <h2>Login</h2>
                <input type="text" placeholder="E-mail" />
                <input type="password" placeholder="Senha" />
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}

export default LoginPage;
