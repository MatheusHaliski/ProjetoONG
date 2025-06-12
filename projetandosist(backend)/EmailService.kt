package com.example.projetandosist

import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.stereotype.Service

@Service
class EmailService(private val mailSender: JavaMailSender) {

    fun enviarEmail(destinatario: String, assunto: String, corpo: String) {
        val mensagem = mailSender.createMimeMessage()
        val helper = MimeMessageHelper(mensagem, true)

        helper.setTo(destinatario)
        helper.setSubject(assunto)
        helper.setText(corpo, true)

        mailSender.send(mensagem)
    }
}
