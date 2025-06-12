package com.example.projetandosist
import java.util.Base64
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.net.URL
import kotlin.io.encoding.ExperimentalEncodingApi

@RestController
@RequestMapping("/produtos")
class ProdutoController(
    private val produtoRepository: ProdutoRepository,
    private val googleImageSearchService: GoogleImageSearchService
) {

    @OptIn(ExperimentalEncodingApi::class)
    @GetMapping
    fun listarProdutos(): ResponseEntity<List<ProdutoComImagem>> {
        val produtos = produtoRepository.findAll()

        val produtosComImagem = produtos.map { produto ->
            val imagemBase64 = produto.imagem?.let {
                Base64.getEncoder().encodeToString(it)
            } ?: ""

            ProdutoComImagem(
                id = produto.id,
                nome = produto.nome,
                descricao = produto.descricao,
                preco = produto.preco,
                categoria = produto.categoria,
                imagem_url = if (imagemBase64.isNotBlank()) "data:image/jpeg;base64,$imagemBase64" else ""
            )
        }

        return ResponseEntity.ok(produtosComImagem)
    }


    @GetMapping("/atualizar-imagens")
    fun atualizarImagens(): ResponseEntity<String> {
        val produtos = produtoRepository.findAll()
        val produtosAtualizados = mutableListOf<Produto>()

        produtos.forEach { produto ->
            val imagemUrl = googleImageSearchService.buscarImagem(produto.nome)

            if (imagemUrl != null) {
                try {
                    // Faz o download da imagem como ByteArray
                    val imagemBytes = URL(imagemUrl).readBytes()

                    // Cria uma nova instância com a imagem atualizada
                    val produtoAtualizado = produto.copy(imagem = imagemBytes)

                    // Salva no banco
                    produtoRepository.save(produtoAtualizado)
                    produtosAtualizados.add(produtoAtualizado)
                } catch (e: Exception) {
                    println("Erro ao baixar imagem para ${produto.nome}: ${e.message}")
                }
            }
        }

        return ResponseEntity.ok("Imagens atualizadas para ${produtosAtualizados.size} produtos.")
    }

    data class ProdutoComImagem(
        val id: Long,
        val nome: String,
        val descricao: String?,
        val preco: Double?,
        val categoria: String,
        val imagem_url: String
    )
}