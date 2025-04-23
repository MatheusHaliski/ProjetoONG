package com.example.projetandosist
import jakarta.servlet.http.HttpSession
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.web.bind.annotation.*
@CrossOrigin(origins = ["http://localhost:3000"])
@RestController
@RequestMapping("/auth")
class LoginController(
    private val pessoaRepository: PessoaRepository,
    @Autowired private val mailSender: JavaMailSender
) {
    @CrossOrigin(origins = ["http://localhost:3000"])
    @PostMapping("/forget-password")
    fun enviarEmailRedefinicao(@RequestParam email: String): ResponseEntity<String> {
        val pessoa = pessoaRepository.findByEmail(email)

        return if (pessoa != null) {
            val mensagem = SimpleMailMessage()
            mensagem.setTo(email)
            mensagem.setSubject("Redefinição de Senha")
            mensagem.setText("Olá, ${pessoa.nome}. Clique no link abaixo para redefinir sua senha:\n\n" +
                    "http://localhost:8080/reset-password?email=${email}")

            mailSender.send(mensagem)

            ResponseEntity.ok("E-mail de redefinição enviado com sucesso.")
        } else {
            ResponseEntity.status(404).body("E-mail não encontrado.")
        }
    }
    @CrossOrigin(origins = ["http://localhost:3000"])
    @GetMapping("/usuario-logado")
    fun getUsuarioLogado(session: HttpSession): ResponseEntity<String> {
        val nome = session.getAttribute("username") as? String
        return if (nome != null) {
            ResponseEntity.ok(nome)
        } else {
            ResponseEntity.status(401).body("Usuário não autenticado.")
        }
    }

}
