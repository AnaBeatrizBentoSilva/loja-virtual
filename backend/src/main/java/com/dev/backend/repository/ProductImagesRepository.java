package com.dev.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dev.backend.enitity.ProductImages;

public interface ProductImagesRepository extends JpaRepository<ProductImages, Long>{
    
}
