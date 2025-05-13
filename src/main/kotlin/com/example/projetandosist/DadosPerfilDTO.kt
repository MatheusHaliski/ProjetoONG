package com.example.projetandosist

data class DadosPerfilDTO(
    val nome: String,
    val email: String,
    val senha: String?,
    var tipoDeUsuario: TipoDeUsuario?,
    val emailUsuario: String
)
