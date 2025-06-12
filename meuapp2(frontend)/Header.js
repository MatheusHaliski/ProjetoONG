import React from 'react';

function Header() {
    return (
        <header className="header bg-primary text-white py-3 shadow">
            <div className="container d-flex align-items-center">
                <img
                    src="assets/3091312E-DF4A-4690-B756-86E19BAE7C24.jpeg" // Caminho da logo da empresa
                    alt="Logo da ONG"
                    style={{ height: "50px", marginRight: "150px" }}
                />
                <h1 className="h4 m-0">ONG Eletrônicos - Apoio Social e Inclusão no mundo digital</h1>
            </div>
        </header>
    );
}

export default Header;
