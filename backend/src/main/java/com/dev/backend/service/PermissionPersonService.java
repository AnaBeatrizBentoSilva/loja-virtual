package com.dev.backend.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.backend.enitity.Permission;
import com.dev.backend.enitity.PermissionPerson;
import com.dev.backend.enitity.Person;
import com.dev.backend.repository.PermissionPersonRepository;
import com.dev.backend.repository.PermissionRepository;

@Service
public class PermissionPersonService {
    
    @Autowired
    private PermissionPersonRepository permissionPersonRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    public void linkPersonCustomerPermission(Person person){
        List<Permission> permissionList = permissionRepository.findByName("cliente");
        if(permissionList.size()>0){
            PermissionPerson permissionPerson = new PermissionPerson();
            permissionPerson.setPerson(person);
            permissionPerson.setPermission(permissionList.get(0));
            permissionPerson.setDateCreation(new Date());
            permissionPersonRepository.saveAndFlush(permissionPerson);
        }
    }
}
