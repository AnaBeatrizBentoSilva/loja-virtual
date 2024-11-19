package com.dev.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.enitity.Person;
import com.dev.backend.service.PersonManagementService;

@RestController
@RequestMapping("/api/person-management")
public class PersonManagementController {
    
    @Autowired
    private PersonManagementService personManagementService;

    @PostMapping("/password-code")
    public String recoverCode(@RequestBody Person person){
        return personManagementService.requestCode(person.getEmail());
    }

    @PostMapping("/password-change")
    public String changePassword(@RequestBody Person person){
        return personManagementService.changePassword(person);
    }
}
