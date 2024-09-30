package com.dev.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.enitity.Person;
import com.dev.backend.service.PersonService;

@RestController
@RequestMapping("/api/person")
public class PersonController {
    
    @Autowired
    private PersonService personService;

    @GetMapping("/")
    public List<Person> searchAll(){
        return personService.searchAll();
    }

    @PostMapping("/")
    public Person insert(@RequestBody Person person){
        return personService.insert(person);
    }

    @PutMapping("/")
    public Person alter(@RequestBody Person person){
        return personService.alter(person);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id){
        personService.delete(id);
        return ResponseEntity.ok().build();
    }
}
