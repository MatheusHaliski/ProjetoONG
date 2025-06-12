package com.example.projetandosist
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpSession
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import java.net.URI

@Controller
@RequestMapping
class MenuController(
    private val doacoesRepository: DoacoesRepository,
    private val pessoaRepository: PessoaRepository,
    private val ProdutoRepository: ProdutoRepository
) {

    @PostMapping("/realizar-doacao2", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun realizarDoacao(
        @RequestParam("descricao") descricao: String,
        @RequestParam("quantidade") quantidade: Int,
        @RequestParam("email") email: String,
        @RequestParam(value = "imagem_url", required = false) imagemUrl: String?,
        session: HttpSession
    ): ResponseEntity<Any> {
        val username1 = session.getAttribute("username") as? String ?: "desconhecido"

        val doacao = Doacao(
            descricao = descricao,
            quantidade = quantidade,
            username = username1,
            email = email,
            imagemUrl = imagemUrl
        )

        val doacaoSalva = doacoesRepository.save(doacao)

        return ResponseEntity
            .created(URI.create("/doacoes/${doacaoSalva.id}"))
            .body(doacaoSalva)
    }


    @GetMapping("/visualizar-minhas-doacoes")
    fun visualizarMinhasDoacoes(@RequestParam email: String): ResponseEntity<List<Doacao>> {
        val doacoesUsuario = doacoesRepository.findByEmail(email)
        return ResponseEntity.ok(doacoesUsuario)
    }

    @GetMapping("/visualizar-todas-doacoes")
    fun visualizarTodasDoacoes(): ResponseEntity<List<Doacao>> {
        val todasAsDoacoes = doacoesRepository.findAll()
        return ResponseEntity.ok(todasAsDoacoes)
    }
    @GetMapping("/visualizar-doadores-lista")
    fun visualizarDoadoresLista(): ResponseEntity<List<Pessoa>> {
        val todosDoadores = pessoaRepository.findAll()
        return ResponseEntity.ok(todosDoadores)
    }


    @PostMapping("/salvar-dados-perfil")
    fun salvarDadosPerfil(
        @RequestPart("dados") dados: DadosPerfilDTO,
        @RequestPart("imagemPerfil", required = false) imagemPerfil: MultipartFile?,
        session: HttpSession
    ): ResponseEntity<String> {
        val pessoa = pessoaRepository.findByEmail(dados.emailUsuario)

        if (pessoa != null) {
            pessoa.nome = dados.nome
            pessoa.email = dados.email

            if (dados.tipoDeUsuario != null) {
                pessoa.tipoDeUsuario = dados.tipoDeUsuario!!
            }

            if (!dados.senha.isNullOrBlank()) {
                pessoa.senha = dados.senha
                pessoa.confirmarSenha = dados.senha
            }

            // Se o arquivo foi enviado, salvar no objeto pessoa
            if (imagemPerfil != null && !imagemPerfil.isEmpty) {
                pessoa.imagemPerfil = imagemPerfil.bytes // Supondo que o campo é um ByteArray no banco
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
