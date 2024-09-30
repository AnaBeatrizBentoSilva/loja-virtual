package com.dev.backend.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.backend.enitity.City;
import com.dev.backend.repository.CityRepository;

@Service
public class CityService {
    
    @Autowired
    private CityRepository cityRepository;

    public List<City> searchAll(){
        return cityRepository.findAll();
    }

    public City insert(City city){
        city.setDateCreation(new Date());
        City cityNew = cityRepository.saveAndFlush(city);
        return cityNew;
    }

    public City alter(City city){
        city.setDateUpdate(new Date());
        return cityRepository.saveAndFlush(city);
    }

    public void delete(Long id){
        City city = cityRepository.findById(id).get();
        cityRepository.delete(city);
    }
}
