package com.example.projetandosist

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id

@Entity
data class Pessoa(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    var nome: String = "",
    var email: String = "",
    var senha: String = "",
    val confirmarSenha: String = ""
)
