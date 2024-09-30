package com.dev.backend.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.backend.enitity.Mark;
import com.dev.backend.repository.MarkRepository;

@Service
public class MarkService {
    
    @Autowired
    private MarkRepository markRepository;

    public List<Mark> searchAll(){
        return markRepository.findAll();
    }

    public Mark insert(Mark mark){
        mark.setDateCreation(new Date());
        Mark markNew = markRepository.saveAndFlush(mark);
        return markNew;
    }

    public Mark alter(Mark mark){
        mark.setDateUpdate(new Date());
        return markRepository.saveAndFlush(mark);
    }

    public void delete(Long id){
        Mark mark = markRepository.findById(id).get();
        markRepository.delete(mark);
    }
}
