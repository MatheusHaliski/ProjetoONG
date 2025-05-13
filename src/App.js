import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import EsqueciSenha from "./components/EsqueciSenha";
import RegistrarUsuario from "./components/RegistrarUsuario";
import MenuInicial from './components/MenuInicial';
import DoacaoForm from './components/DoacaoForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import MinhasDoacoes from "./components/MinhasDoacoes";
import FormPerfil from "./components/AlterarPerfil";
import MenuInicial2 from "./components/MenuInicial2";
import ListaDoacoesRecebidas from "./components/ListaDoacoesRecebidas";
import ListaDoadoresCadastrados from "./components/ListaDoadoresCadastrados";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/esqueci-senha" element={<EsqueciSenha />} />
                <Route path="/registrarusuario" element={<RegistrarUsuario />} />
                <Route path="/menuinicial" element={<MenuInicial />} />
                <Route path="/menuinicial2" element={<MenuInicial2 />} />
                <Route path="/realizar-doacao" element={<DoacaoForm />} />
                <Route path="/visualizar-minhas-doacoes" element={<MinhasDoacoes />} />
                <Route path="/form-alterar-perfil" element={<FormPerfil />} />
                <Route path="/visualizar-doacoes-recebidas" element={<ListaDoacoesRecebidas />} />
                <Route path="/visualizar-doadores-lista" element={<ListaDoadoresCadastrados />} />
            </Routes>
        </Router>
    );
}

export default App;
