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

import com.dev.backend.enitity.Permission;
import com.dev.backend.service.PermissionService;

@RestController
@RequestMapping("/api/permission")
public class PermissionController {
    
    @Autowired
    private PermissionService permissionService;

    @GetMapping("/")
    public List<Permission> searchAll(){
        return permissionService.searchAll();
    }

    @PostMapping("/")
    public Permission insert(@RequestBody Permission permission){
        return permissionService.insert(permission);
    }

    @PutMapping("/")
    public Permission alter(@RequestBody Permission permission){
        return permissionService.alter(permission);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id){
        permissionService.delete(id);
        return ResponseEntity.ok().build();
    }
}
