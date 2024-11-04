package com.dev.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dev.backend.enitity.PermissionPerson;

public interface PermissionPersonRepository extends JpaRepository<PermissionPerson, Long>{
    
}
