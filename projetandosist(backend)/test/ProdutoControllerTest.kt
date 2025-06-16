import org.junit.jupiter.api.Test
import org.mockito.Mockito.*
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import org.springframework.beans.factory.annotation.Autowired

@WebMvcTest(ProdutoController::class)
class ProdutoControllerTest {

    @Autowired
    lateinit var mockMvc: MockMvc

    @MockBean
    lateinit var produtoRepository: ProdutoRepository

    @MockBean
    lateinit var googleImageSearchService: GoogleImageSearchService

    @Test
    fun `listarProdutos deve retornar JSON com produtos`() {
        val produto = Produto(id = 1, nome = "Arroz", categoria = "Alimento")
        `when`(produtoRepository.findAll()).thenReturn(listOf(produto))

        mockMvc.perform(get("/produtos"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].nome").value("Arroz"))
    }
}
