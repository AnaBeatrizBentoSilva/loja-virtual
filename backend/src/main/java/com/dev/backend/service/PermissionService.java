package com.dev.backend.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.backend.enitity.Permission;
import com.dev.backend.repository.PermissionRepository;

@Service
public class PermissionService {
    
    @Autowired
    private PermissionRepository permissionRepository;

    public List<Permission> searchAll(){
        return permissionRepository.findAll();
    }

    public Permission insert(Permission permission){
        permission.setDateCreation(new Date());
        Permission permissionNew = permissionRepository.saveAndFlush(permission);
        return permissionNew;
    }

    public Permission alter(Permission permission){
        permission.setDateUpdate(new Date());
        return permissionRepository.saveAndFlush(permission);
    }

    public void delete(Long id){
        Permission permission = permissionRepository.findById(id).get();
        permissionRepository.delete(permission);
    }
}
