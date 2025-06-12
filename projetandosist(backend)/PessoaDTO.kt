import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import org.hibernate.annotations.processing.Pattern

data class PessoaDTO(
    @field:NotBlank(message = "Nome é obrigatório.")
    @field:jakarta.validation.constraints.Pattern(
        regexp = "^[A-Z][a-z]+(?: [A-Z][a-z]+)*\$",
        message = "Nome deve ter a primeira letra maiúscula e apenas letras."
    )
    val nome: String,

    @field:NotBlank(message = "E-mail é obrigatório.")
    @field:Email(message = "E-mail inválido.")
    val email: String,

    @field:NotBlank(message = "Senha é obrigatória.")
    @field:Size(min = 6, message = "A senha deve ter pelo menos 6 caracteres.")
    val senha: String,

    @field:NotBlank(message = "Confirmar Senha é obrigatória.")
    @field:Size(min = 6, message = "A senha deve ter pelo menos 6 caracteres.")
    val confirmarsenha: String,

    var imagemPerfil: ByteArray? = null
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as PessoaDTO

        if (nome != other.nome) return false
        if (email != other.email) return false
        if (senha != other.senha) return false
        if (confirmarsenha != other.confirmarsenha) return false
        if (imagemPerfil != null) {
            if (other.imagemPerfil == null) return false
            if (!imagemPerfil.contentEquals(other.imagemPerfil)) return false
        } else if (other.imagemPerfil != null) return false

        return true
    }

    override fun hashCode(): Int {
        var result = nome.hashCode()
        result = 31 * result + email.hashCode()
        result = 31 * result + senha.hashCode()
        result = 31 * result + confirmarsenha.hashCode()
        result = 31 * result + (imagemPerfil?.contentHashCode() ?: 0)
        return result
    }
}
