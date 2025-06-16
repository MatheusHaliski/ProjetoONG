import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test

class PessoaTest {

    @Test
    fun `testa igualdade de duas pessoas com os mesmos dados`() {
        val pessoa1 = Pessoa(nome = "João", email = "joao@email.com", senha = "123", confirmarSenha = "123")
        val pessoa2 = pessoa1.copy()

        assertEquals(pessoa1, pessoa2)
        assertEquals(pessoa1.hashCode(), pessoa2.hashCode())
    }

    @Test
    fun `testa desigualdade quando emails diferentes`() {
        val pessoa1 = Pessoa(nome = "João", email = "joao@email.com")
        val pessoa2 = Pessoa(nome = "João", email = "outro@email.com")

        assertNotEquals(pessoa1, pessoa2)
    }
}
