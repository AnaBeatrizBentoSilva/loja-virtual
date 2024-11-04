package com.dev.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dev.backend.enitity.Person;

public interface CustomerPersonRepository extends JpaRepository<Person, Long>{
    
}
