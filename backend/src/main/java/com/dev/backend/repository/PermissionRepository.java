package com.dev.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dev.backend.enitity.Permission;

public interface PermissionRepository extends JpaRepository<Permission, Long>{
    
}
