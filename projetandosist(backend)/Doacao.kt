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
    val email: String = "",

    val imagemUrl: String? = null,
    @Lob
    val imagemObjeto: ByteArray? = null
) : Serializable {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Doacao

        if (id != other.id) return false
        if (quantidade != other.quantidade) return false
        if (descricao != other.descricao) return false
        if (username != other.username) return false
        if (email != other.email) return false
        if (imagemObjeto != null) {
            if (other.imagemObjeto == null) return false
            if (!imagemObjeto.contentEquals(other.imagemObjeto)) return false
        } else if (other.imagemObjeto != null) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + quantidade
        result = 31 * result + descricao.hashCode()
        result = 31 * result + username.hashCode()
        result = 31 * result + email.hashCode()
        result = 31 * result + (imagemObjeto?.contentHashCode() ?: 0)
        return result
    }
}
