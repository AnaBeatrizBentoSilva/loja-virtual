package com.dev.backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.dev.backend.enitity.Product;
import com.dev.backend.enitity.ProductImages;
import com.dev.backend.repository.ProductImagesRepository;
import com.dev.backend.repository.ProductRepository;

@Service
public class ProductImagesService {
    
    @Autowired
    private ProductImagesRepository productImagesRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<ProductImages> searchAll(){
        return productImagesRepository.findAll();
    }

    public ProductImages insert(Long idProduct, MultipartFile file){
        Product product = productRepository.findById(idProduct).get();
        ProductImages productImagesNew = new ProductImages();

        try{
            if(!file.isEmpty()){
                byte[] bytes = file.getBytes();
                String nameImage = String.valueOf(product.getId()) + file.getOriginalFilename();
                Path path = Paths.get("/Users/anabeatriz/images/" +nameImage );
                Files.write(path, bytes);
                productImagesNew.setName(nameImage);
            }
        }catch(IOException e){
            e.printStackTrace();
        }
        productImagesNew.setProduct(product);
        productImagesNew.setDateCreation(new Date());
        productImagesNew = productImagesRepository.saveAndFlush(productImagesNew);
        return productImagesNew;
    }

    public ProductImages alter(ProductImages productImages){
        productImages.setDateUpdate(new Date());
        return productImagesRepository.saveAndFlush(productImages);
    }

    public void delete(Long id){
        ProductImages productImages = productImagesRepository.findById(id).get();
        productImagesRepository.delete(productImages);
    }
}

