package com.example.projetandosist

import org.junit.jupiter.api.Test
import org.mockito.Mockito.*
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import javax.mail.internet.MimeMessage

class EmailServiceTest {

    @Test
    fun `deve enviar email com sucesso`() {
        // Arrange
        val mailSender = mock(JavaMailSender::class.java)
        val mimeMessage = mock(MimeMessage::class.java)
        `when`(mailSender.createMimeMessage()).thenReturn(mimeMessage)

        val service = EmailService(mailSender)

        // Act
        service.enviarEmail("teste@email.com", "Assunto", "<b>Mensagem</b>")

        // Assert
        verify(mailSender).createMimeMessage()
        verify(mailSender).send(mimeMessage)
    }
}
//colocar no .gradle
//dependencies {
//    testImplementation("org.junit.jupiter:junit-jupiter:5.10.0")
//    testImplementation("org.mockito:mockito-core:5.10.0")
//    testImplementation("org.springframework.boot:spring-boot-starter-test")
//}
