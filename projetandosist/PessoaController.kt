package com.example.projetandosist
import com.example.projetandosist.EmailService
import jakarta.servlet.http.HttpSession
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/pessoas")
class PessoaController(private val pessoaRepository: PessoaRepository,private val emailService: EmailService) {

    @GetMapping
    fun listar(): List<Pessoa> = pessoaRepository.findAll()

    @PostMapping("/pessoas1")
    fun salvar(@RequestParam nome: String, @RequestParam email: String, @RequestParam senha: String): Pessoa {
        val pessoa = Pessoa(nome = nome, email = email, senha = senha)
        return pessoaRepository.save(pessoa)
    }

    @PostMapping("/pessoas12")
    fun verificarLogin(
        @RequestParam email: String,
        @RequestParam password: String,
        session: HttpSession
    ): ResponseEntity<Any> {
        val pessoa = pessoaRepository.findByEmailAndSenha(email, password)

        return if (pessoa != null) {
            session.setAttribute("username", pessoa.nome)
            ResponseEntity.ok(mapOf("mensagem" to "Login realizado com sucesso!"))
        } else {
            ResponseEntity.status(401).body(mapOf("erro" to "Email ou senha inválidos."))
        }
    }

    @PostMapping("/pessoas14")
    fun login(@RequestBody loginDTO: LoginDTO): ResponseEntity<Map<String, String>> {
        val email = loginDTO.email
        val senha = loginDTO.senha

        println("Recebido email: $email e senha: $senha")
        return ResponseEntity.ok(mapOf("mensagem" to "Login recebido com sucesso!"))
    }

    @PostMapping("/redefinir-senha")
    fun redefinirSenha(@RequestParam email: String): ResponseEntity<String> {
        val pessoa = pessoaRepository.findByEmail(email)

        return if (pessoa != null) {
            val linkRedefinicao = "http://localhost:3000/redefinir-senha?email=$email"
            val mensagem = """
            <p>Olá!</p>
            <p>Clique no link abaixo para redefinir sua senha:</p>
            <a href="$linkRedefinicao">Redefinir Senha</a>
        """.trimIndent()

            emailService.enviarEmail(
                destinatario = email,
                assunto = "Redefinição de Senha - Projeto Solidário",
                corpo = mensagem
            )

            ResponseEntity.ok("E-mail de redefinição enviado com sucesso.")
        } else {
            ResponseEntity.badRequest().body("E-mail não encontrado.")
        }
    }


    data class LoginDTO(
        val email: String,
        val senha: String
    )
}
