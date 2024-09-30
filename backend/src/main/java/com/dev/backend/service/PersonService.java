package com.dev.backend.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.backend.enitity.Person;
import com.dev.backend.repository.PersonRepository;

@Service
public class PersonService {
    
    @Autowired
    private PersonRepository personRepository;

    public List<Person> searchAll(){
        return personRepository.findAll();
    }

    public Person insert(Person person){
        person.setDateCreation(new Date());
        Person personNew = personRepository.saveAndFlush(person);
        return personNew;
    }

    public Person alter(Person person){
        person.setDateUpDate(new Date());
        return personRepository.saveAndFlush(person);
    }

    public void delete(Long id){
        Person person = personRepository.findById(id).get();
        personRepository.delete(person);
    }
}
