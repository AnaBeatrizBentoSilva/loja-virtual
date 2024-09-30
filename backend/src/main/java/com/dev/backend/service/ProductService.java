package com.dev.backend.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.backend.enitity.Product;
import com.dev.backend.repository.ProductRepository;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;

    public List<Product> searchAll(){
        return productRepository.findAll();
    }

    public Product insert(Product product){
        product.setDateCreation(new Date());
        Product productNew = productRepository.saveAndFlush(product);
        return productNew;
    }

    public Product alter(Product product){
        product.setDateUpdate(new Date());
        return productRepository.saveAndFlush(product);
    }

    public void delete(Long id){
        Product product = productRepository.findById(id).get();
        productRepository.delete(product);
    }
}
