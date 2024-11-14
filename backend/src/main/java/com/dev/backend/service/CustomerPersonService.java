package com.dev.backend.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.backend.dto.CustomerPersonRequestDTO;
import com.dev.backend.enitity.Person;
import com.dev.backend.repository.CustomerPersonRepository;

@Service
public class CustomerPersonService {

    @Autowired
    private CustomerPersonRepository customerPersonRepository;

    @Autowired
    private PermissionPersonService permissionPersonService;

    @Autowired
    private EmailService emailService;

    public Person register(CustomerPersonRequestDTO customerPersonRequestDTO){
        Person person = new CustomerPersonRequestDTO().converter(customerPersonRequestDTO);
        person.setDateCreation(new Date());
        Person personNew = customerPersonRepository.saveAndFlush(person);
        permissionPersonService.linkPersonCustomerPermission(personNew);
        emailService.sendEmailText(personNew.getEmail(), "Cadastro na ShopOnClick ", "O resgistro na loja foi realizado com sucesso. Em breve receberá a senha de acesso por e-mail!");
        return personNew;
    }
}
