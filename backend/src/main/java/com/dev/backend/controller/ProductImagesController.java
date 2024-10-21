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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dev.backend.enitity.ProductImages;
import com.dev.backend.service.ProductImagesService;

@RestController
@RequestMapping("/api/productImages")
public class ProductImagesController {
    
    @Autowired
    private ProductImagesService productImagesService;

    @GetMapping("/")
    public List<ProductImages> searchAll(){
        return productImagesService.searchAll();
    }

    @PostMapping("/")
    public ProductImages insert(@RequestParam("idProduct") Long idProduct, @RequestParam("file") MultipartFile file){
        return productImagesService.insert(idProduct, file);
    }

    @PutMapping("/")
    public ProductImages alter(@RequestBody ProductImages productImages){
        return productImagesService.alter(productImages);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id){
        productImagesService.delete(id);
        return ResponseEntity.ok().build();
    }
}
