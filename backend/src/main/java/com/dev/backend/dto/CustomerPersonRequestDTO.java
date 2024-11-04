package com.dev.backend.dto;

import org.springframework.beans.BeanUtils;

import com.dev.backend.enitity.City;
import com.dev.backend.enitity.Person;

import lombok.Data;

@Data
public class CustomerPersonRequestDTO {
    
    private String name;
    private String cpf;
    private String email;
    private String address;
    private String cep;
    private City city;

    public Person converter(CustomerPersonRequestDTO customerPersonRequestDTO){
        Person person = new Person();
        BeanUtils.copyProperties(customerPersonRequestDTO, person);
        return person;
    }
}
