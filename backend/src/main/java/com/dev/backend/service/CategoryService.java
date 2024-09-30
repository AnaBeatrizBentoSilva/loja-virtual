package com.dev.backend.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.backend.enitity.Category;
import com.dev.backend.repository.CategoryRepository;

@Service
public class CategoryService {
    
    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> searchAll(){
        return categoryRepository.findAll();
    }

    public Category insert(Category category){
        category.setDateCreation(new Date());
        Category categoryNew = categoryRepository.saveAndFlush(category);
        return categoryNew;
    }

    public Category alter(Category category){
        category.setDateUpdate(new Date());
        return categoryRepository.saveAndFlush(category);
    }

    public void delete(Long id){
        Category category = categoryRepository.findById(id).get();
        categoryRepository.delete(category);
    }
}
