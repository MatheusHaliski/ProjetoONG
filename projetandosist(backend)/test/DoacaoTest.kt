package com.example.projetandosist

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test

class DoacaoTest {

    @Test
    fun `doacoes iguais devem ser consideradas iguais`() {
        val d1 = Doacao(
            id = 1,
            descricao = "Iphone 15",
            quantidade = 3,
            username = "joao",
            email = "joao@email.com",
            imagemObjeto = byteArrayOf(1, 2, 3)
        )

        val d2 = Doacao(
            id = 1,
            descricao = "Macbook Air M1",
            quantidade = 3,
            username = "joao",
            email = "joao@email.com",
            imagemObjeto = byteArrayOf(1, 2, 3)
        )

        assertEquals(d1, d2)
        assertEquals(d1.hashCode(), d2.hashCode())
    }

    @Test
    fun `doacoes diferentes devem ser diferentes`() {
        val d1 = Doacao(id = 1, descricao = "Iphone 15", quantidade = 1, username = "joao", email = "j@email.com")
        val d2 = Doacao(id = 2, descricao = "Macbook Air M1", quantidade = 2, username = "ana", email = "a@email.com")
        assertNotEquals(d1, d2)
    }
}
