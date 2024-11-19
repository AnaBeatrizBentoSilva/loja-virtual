package com.dev.backend.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;

import freemarker.template.Configuration;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private Configuration fmConfiguration;

    @Value("${spring.mail.username}")
    private String sender;
    
    public String sendEmailText(String recipient, String title, String message){

        try{
            SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
            simpleMailMessage.setFrom(sender);
            simpleMailMessage.setTo(recipient);
            simpleMailMessage.setSubject(title);
            simpleMailMessage.setText(message);
            javaMailSender.send(simpleMailMessage);
            return "Email enviado";
        }catch(Exception exception){
            return "Erro ao enviar o email";
        }
    }

    public void sendEmailTemplate(String recipient, String title, Map<String, Object> properties){
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        try{
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true);

            mimeMessageHelper.setSubject(title);
            mimeMessageHelper.setFrom(sender);
            mimeMessageHelper.setTo(recipient);

            mimeMessageHelper.setText(getTemplateContent(properties), true);

            javaMailSender.send(mimeMessageHelper.getMimeMessage());
        }catch(MessagingException e){
            e.printStackTrace();
        }
        }

    public String getTemplateContent(Map < String, Object >model){
        StringBuffer content = new StringBuffer();

        try{
            content.append(FreeMarkerTemplateUtils.processTemplateIntoString(fmConfiguration.getTemplate("email-recuperacao-codigo.flth"), model));
        }catch (Exception e){
            e.printStackTrace();
        }
        return content.toString();
        }
    }

