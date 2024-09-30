package com.dev.backend.enitity;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;

@Entity
@Table(name = "product")
@Data

public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String shortDescription;
    private String detailedDescription;
    private Double costValue;
    private Double saleValue;

    @ManyToOne
    @JoinColumn(name = "idMark")
    private Mark mark;

    @ManyToOne
    @JoinColumn(name = "idCategory")
    private Category category;

    @Temporal(TemporalType.TIMESTAMP)
    private Date dateCreation;

    @Temporal(TemporalType.TIMESTAMP)
    private Date dateUpdate;
}
