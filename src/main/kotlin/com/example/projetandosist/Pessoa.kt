package com.example.projetandosist

import jakarta.persistence.*

@Entity
data class Pessoa(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    var nome: String = "",

    @Column(unique = true)
    var email: String = "",

    @Column(unique = true)
    var senha: String = "",

    var confirmarSenha: String = "",

    @Enumerated(EnumType.STRING)
    var tipoDeUsuario: TipoDeUsuario = TipoDeUsuario.USUARIO_ADM
)