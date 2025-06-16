import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.web.client.RestTemplate
import org.mockito.Mockito.*
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.beans.factory.annotation.Autowired

@SpringBootTest
class GoogleImageSearchServiceTest {

    @Autowired
    lateinit var googleImageSearchService: GoogleImageSearchService

    @MockBean
    lateinit var restTemplate: RestTemplate

    @Test
    fun `deve retornar url de imagem quando resposta for válida`() {
        val fakeResponse = mapOf("items" to listOf(mapOf("link" to "http://imagem.jpg")))
        val produto = "Arroz"

        `when`(restTemplate.getForObject(anyString(), eq(Map::class.java))).thenReturn(fakeResponse)

        val resultado = googleImageSearchService.buscarImagem(produto)
        assertEquals("http://imagem.jpg", resultado)
    }
}
