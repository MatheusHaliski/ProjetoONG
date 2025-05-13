package com.example.projetandosist
import PessoaDTO
import com.example.projetandosist.EmailService
import jakarta.servlet.http.HttpSession
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.net.URI

@RestController
@RequestMapping("/pessoas")
class PessoaController(private val pessoaRepository: PessoaRepository,private val emailService: EmailService) {

    @GetMapping
    fun listar(): List<Pessoa> = pessoaRepository.findAll()

    @PostMapping("/pessoas1")
    fun salvar(@RequestBody @Valid pessoaDTO: PessoaDTO): ResponseEntity<Any> {
        val emailExistente = pessoaRepository.findByEmail(pessoaDTO.email)

        if (emailExistente != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(mapOf("erro" to "E-mail já cadastrado."))
        }


        val pessoa = Pessoa(
            nome = pessoaDTO.nome,
            email = pessoaDTO.email,
            senha = pessoaDTO.senha,
            confirmarSenha = pessoaDTO.confirmarsenha,
            tipoDeUsuario = TipoDeUsuario.USUARIO_COMUM
        )

        if (pessoaDTO.senha != pessoa.confirmarSenha) {
            return ResponseEntity
                .badRequest()
                .body(mapOf("erro" to "Senha e confirmação não conferem."))
        }
        val pessoaSalva = pessoaRepository.save(pessoa)

        // Boa prática: retornar 201 Created com Location
        return ResponseEntity
            .created(URI.create("/pessoas/${pessoaSalva.id}"))
            .body(pessoaSalva)
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
            ResponseEntity.ok(
                mapOf(
                    "mensagem" to "Login realizado com sucesso!",
                    "tipoUsuario" to pessoa.tipoDeUsuario.name
                )
            )
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
