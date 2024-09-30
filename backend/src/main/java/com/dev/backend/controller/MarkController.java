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

import com.dev.backend.enitity.Mark;
import com.dev.backend.service.MarkService;

@RestController
@RequestMapping("/api/mark")
public class MarkController {

    @Autowired
    private MarkService markService;

    @GetMapping("/")
    public List<Mark> searchAll(){
        return markService.searchAll();
    }

    @PostMapping("/")
    public Mark insert(@RequestBody Mark mark){
        return markService.insert(mark);
    }

    @PutMapping("/")
    public Mark alter(@RequestBody Mark mark){
        return markService.alter(mark);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id){
        markService.delete(id);
        return ResponseEntity.ok().build();
    }
    
}
