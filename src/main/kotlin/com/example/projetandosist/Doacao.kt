package com.example.projetandosist

import jakarta.persistence.*
import java.io.Serializable

@Entity
data class Doacao(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false)
    val descricao: String = "",

    @Column(nullable = false)
    val quantidade: Int = 0,

    @Column(nullable = false)
    val username: String = "",

    @Column(nullable = false)
    val email: String = ""
) : Serializable
