package com.dev.backend.service;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.backend.enitity.Person;
import com.dev.backend.repository.PersonRepository;

@Service
public class PersonManagementService {
    
    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private EmailService emailService;

    public String requestCode(String email){
        Person person = personRepository.findByEmail(email);
        person.setPasswordRecoveryCode(getPasswordRecoveryCode(person.getId()));
        person.setShippingDateCode(new Date());
        personRepository.saveAndFlush(person);
        emailService.sendEmailText(person.getEmail(), "Código de Recuperação de Senha", "Olá, o seu código para recuperação de senha é o seguinte: "+person.getPasswordRecoveryCode());
        return "Código Enviado!";
    }

    public String changePassword(Person person){

        Person personBank = personRepository.findByEmailAndPasswordRecoveryCode(person.getEmail(), person.getPasswordRecoveryCode());
        if(personBank != null){
            Date difference = new Date(new Date().getTime() - personBank.getShippingDateCode().getTime());
        
            if(difference.getTime()/1000<900){
                personBank.setPassword(person.getPassword());
                personBank.setPasswordRecoveryCode(null);
                personRepository.saveAndFlush(personBank);
                return "Senha alterada com sucesso!";
            }else{
                return "Tempo expirado, solicite um novo código";
            }
        }else{
            return "Email ou código não encontrado!";
        }
    }

    private String getPasswordRecoveryCode(Long id){
        DateFormat format = new SimpleDateFormat("ddMMyyyyHHmmssmm");
        return format.format(new Date())+id;
    }
}
