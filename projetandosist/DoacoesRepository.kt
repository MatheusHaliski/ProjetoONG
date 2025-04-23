package com.example.projetandosist

import org.springframework.data.jpa.repository.JpaRepository

interface DoacoesRepository : JpaRepository<Doacao, Long> {
    fun findByUsername(username: String): List<Doacao>
    fun findByEmail(email: String): List<Doacao>

}
