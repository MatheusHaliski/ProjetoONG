package com.example.projetandosist

import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import org.springframework.web.util.UriComponentsBuilder

@Service
class GoogleImageSearchService {

    private val apiKey = "AIzaSyCYSDK-cnJVbRPdmhhSv3-TQX9OdAuJSBI"
    private val cx = "31e687f33649f4e55"
    private val restTemplate = RestTemplate()

    fun buscarImagem(nomeProduto: String): String? {
        val url = UriComponentsBuilder.fromHttpUrl("https://www.googleapis.com/customsearch/v1")
            .queryParam("key", apiKey)
            .queryParam("cx", cx)
            .queryParam("q", nomeProduto)
            .queryParam("searchType", "image")
            .queryParam("num", 1)
            .build()
            .toUriString()

        val response = restTemplate.getForObject(url, Map::class.java)
        val items = response?.get("items") as? List<Map<String, Any>>
        val firstItem = items?.firstOrNull()
        return firstItem?.get("link") as? String
    }
}
