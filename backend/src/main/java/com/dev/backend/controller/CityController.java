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

import com.dev.backend.enitity.City;
import com.dev.backend.service.CityService;

@RestController
@RequestMapping("/api/city")
public class CityController {
    
    @Autowired
    private CityService cityService;

    @GetMapping("/")
    public List<City> searchAll(){
        return cityService.searchAll();
    }

    @PostMapping("/")
    public City insert(@RequestBody City city){
        return cityService.insert(city);
    }

    @PutMapping("/")
    public City alter(@RequestBody City city){
        return cityService.alter(city);
    }

    @DeleteMapping("/")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id){
        cityService.delete(id);
        return ResponseEntity.ok().build();
    }
}
