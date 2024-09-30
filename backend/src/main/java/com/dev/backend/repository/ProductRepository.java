package com.dev.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dev.backend.enitity.Product;

public interface ProductRepository extends JpaRepository<Product, Long>{
    
}
