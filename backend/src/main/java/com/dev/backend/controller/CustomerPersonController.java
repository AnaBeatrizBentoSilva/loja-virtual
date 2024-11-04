package com.dev.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.dto.CustomerPersonRequestDTO;
import com.dev.backend.enitity.Person;
import com.dev.backend.service.CustomerPersonService;

@RestController
@RequestMapping("/api/customer")
public class CustomerPersonController {
    
    @Autowired
    private CustomerPersonService customerPersonService;

    @PostMapping("/")
    public Person insert(@RequestBody CustomerPersonRequestDTO customerPersonRequestDTO){
        return customerPersonService.register(customerPersonRequestDTO);
    }
}
