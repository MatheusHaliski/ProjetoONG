package com.example.projetandosist

import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class DataInitializr {

    @Bean
    fun loadData(pessoaRepository: PessoaRepository) = CommandLineRunner {

        val pessoa = Pessoa(
            nome = "João da Silva",
            email = "joao@email.com",
            senha = "senha123",
            confirmarSenha = "senha123",
            tipoDeUsuario = TipoDeUsuario.USUARIO_ADM
        )
        val pessoa1 = Pessoa(
            nome = "Stephen Silva",
            email = "steph@email.com",
            senha = "set123",
            confirmarSenha = "set123",
            tipoDeUsuario = TipoDeUsuario.USUARIO_ADM
        )

        pessoaRepository.save(pessoa)
        pessoaRepository.save(pessoa1)

        println("Pessoa inserida: $pessoa")
    }
}
