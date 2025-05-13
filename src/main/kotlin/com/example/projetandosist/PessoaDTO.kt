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
    val confirmarsenha: String
)
