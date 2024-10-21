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
@Table(name = "product_images")
@Data

public class ProductImages {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "idProduct")
    private Product product;

    @Temporal(TemporalType.TIMESTAMP)
    private Date dateCreation;

    @Temporal(TemporalType.TIMESTAMP)
    private Date dateUpdate;
}
