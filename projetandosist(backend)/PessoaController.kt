package com.example.projetandosist
import PessoaDTO
import com.example.projetandosist.EmailService
import jakarta.servlet.http.HttpSession
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.net.URI
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.bind.annotation.RequestParam
@RestController
@RequestMapping("/pessoas")
class PessoaController(private val pessoaRepository: PessoaRepository, private val emailService: EmailService) {

    @GetMapping
    fun listar(): List<Pessoa> = pessoaRepository.findAll()

    @GetMapping("/{email}/imagemPerfil")
    fun getImagemPerfil(@PathVariable email: String): ResponseEntity<ByteArray> {
        val pessoa = pessoaRepository.findByEmail(email)
            ?: return ResponseEntity.notFound().build()

        pessoa.imagemPerfil?.let {
            return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG) // ou outro se você estiver usando PNG
                .body(it)
        }

        return ResponseEntity.notFound().build()
    }



    @PostMapping("/pessoas1", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun salvar(
        @RequestParam("nome") nome: String,
        @RequestParam("email") email: String,
        @RequestParam("senha") senha: String,
        @RequestParam("confirmarsenha") confirmarsenha: String,
        @RequestPart(value = "imagemPerfil", required = false) imagemPerfil: MultipartFile?
    ): ResponseEntity<Any> {
        val emailExistente = pessoaRepository.findByEmail(email)
        if (emailExistente != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(mapOf("erro" to "E-mail já cadastrado."))
        }

        if (senha != confirmarsenha) {
            return ResponseEntity
                .badRequest()
                .body(mapOf("erro" to "Senha e confirmação não conferem."))
        }

        val pessoa = Pessoa(
            nome = nome,
            email = email,
            senha = senha,
            confirmarSenha = confirmarsenha,
            tipoDeUsuario = TipoDeUsuario.USUARIO_COMUM,
            imagemPerfil = imagemPerfil?.bytes // Aqui você armazena a imagem como byte[]
        )

        val pessoaSalva = pessoaRepository.save(pessoa)
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
