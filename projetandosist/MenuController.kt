package com.example.projetandosist
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpSession
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.*

@Controller
@RequestMapping
class MenuController(
    private val doacoesRepository: DoacoesRepository,
    private val pessoaRepository: PessoaRepository
) {

    @PostMapping("/realizar-doacao2")
    fun realizarDoacao(
        @RequestParam descricao: String,
        @RequestParam quantidade: Int,
        @RequestParam email: String,
        session: HttpSession
    ): String {
        val username1 = session.getAttribute("username") as? String ?: "desconhecido"

        val doacao = Doacao(descricao = descricao, quantidade = quantidade, email = email)
        doacoesRepository.save(doacao)

        return "redirect:/menuinicial.html"
    }



    @GetMapping("/visualizar-minhas-doacoes")
    fun visualizarMinhasDoacoes(@RequestParam email: String): ResponseEntity<List<Doacao>> {
        val doacoesUsuario = doacoesRepository.findByEmail(email)
        return ResponseEntity.ok(doacoesUsuario)
    }


    @PostMapping("/salvar-dados-perfil")
    fun salvarDadosPerfil(
        @RequestBody dados: DadosPerfilDTO,
        session: HttpSession
    ): ResponseEntity<String> {
        val pessoa = pessoaRepository.findByEmail(dados.emailUsuario)

        if (pessoa != null) {
            pessoa.nome = dados.nome
            pessoa.email = dados.email
            if (!dados.senha.isNullOrBlank()) {
                pessoa.senha = dados.senha
            }

            pessoaRepository.save(pessoa)
            session.setAttribute("username", pessoa.nome)

            return ResponseEntity.ok("Perfil atualizado com sucesso")
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado")
    }



    @GetMapping("/logout")
    fun logout(session: HttpSession): String {
        session.invalidate()
        return "redirect:/login.html"
    }
}
