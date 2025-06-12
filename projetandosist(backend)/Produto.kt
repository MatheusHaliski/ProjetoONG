package com.example.projetandosist

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Lob

@Entity
data class Produto(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    val nome: String,
    val descricao: String? = null,
    val preco: Double? = null,

    @Lob
    val imagem: ByteArray? = null,  // Agora armazena a imagem como BLOB

    val categoria: String
) {
    constructor() : this(0, "", null, null, null, "")

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Produto

        if (id != other.id) return false
        if (preco != other.preco) return false
        if (nome != other.nome) return false
        if (descricao != other.descricao) return false
        if (imagem != null) {
            if (other.imagem == null) return false
            if (!imagem.contentEquals(other.imagem)) return false
        } else if (other.imagem != null) return false
        if (categoria != other.categoria) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + (preco?.hashCode() ?: 0)
        result = 31 * result + nome.hashCode()
        result = 31 * result + (descricao?.hashCode() ?: 0)
        result = 31 * result + (imagem?.contentHashCode() ?: 0)
        result = 31 * result + categoria.hashCode()
        return result
    }
}
