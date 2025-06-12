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
    var tipoDeUsuario: TipoDeUsuario = TipoDeUsuario.USUARIO_ADM,

    @Lob
    var imagemPerfil: ByteArray? = null
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Pessoa

        if (id != other.id) return false
        if (nome != other.nome) return false
        if (email != other.email) return false
        if (senha != other.senha) return false
        if (confirmarSenha != other.confirmarSenha) return false
        if (tipoDeUsuario != other.tipoDeUsuario) return false
        if (imagemPerfil != null) {
            if (other.imagemPerfil == null) return false
            if (!imagemPerfil.contentEquals(other.imagemPerfil)) return false
        } else if (other.imagemPerfil != null) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + nome.hashCode()
        result = 31 * result + email.hashCode()
        result = 31 * result + senha.hashCode()
        result = 31 * result + confirmarSenha.hashCode()
        result = 31 * result + tipoDeUsuario.hashCode()
        result = 31 * result + (imagemPerfil?.contentHashCode() ?: 0)
        return result
    }
}