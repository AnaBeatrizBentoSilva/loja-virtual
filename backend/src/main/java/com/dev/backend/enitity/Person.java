package com.dev.backend.enitity;

import java.util.Date;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AccessLevel;
import lombok.Data;
import lombok.Setter;

@Entity
@Table(name = "person")
@Data

public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;
    private String cpf;
    private String email;
    private String password;
    private String address;
    private String cep;

    @ManyToOne
    @JoinColumn(name = "idCity")
    private City city;

    @OneToMany(mappedBy = "person", orphanRemoval = true, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @Setter(value = AccessLevel.NONE)
    private List<PermissionPerson> permissionPersons;

    @Temporal(TemporalType.TIMESTAMP)
    private Date dateCreation;

    @Temporal(TemporalType.TIMESTAMP)
    private Date dateUpDate;

    public void setPermissionPersons(List<PermissionPerson> pp){
        for(PermissionPerson p:pp){
            p.setPerson(this);
        }
        this.permissionPersons = pp;
    }
}
