package com.dev.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
//import org.hibernate.mapping.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dev.backend.enitity.State;
import com.dev.backend.service.StateService;


@RestController
@RequestMapping("/api/state")
public class StateController {

    @Autowired
    private StateService stateService;

    @GetMapping("/")
    public List<State> searchAll(){
       return stateService.searchAll();
    }

    @PostMapping("/")
    public State insert(@RequestBody State state){
        return stateService.insert(state);
    }

    @PutMapping("/")
    public State alter(@RequestBody State state){
        return stateService.alter(state);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id){
        stateService.delete(id);
        return ResponseEntity.ok().build();
    }
}
