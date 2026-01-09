package com.example.project1.Models;

import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Getter
@Setter
@Entity
@Table(name = "restaurant_areas")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class RestaurantArea {
    @Id
    @ColumnDefault("nextval('restaurant_areas_area_id_seq'")
    @Column(name = "area_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description", length = Integer.MAX_VALUE)
    private String description;

    @Column(name = "capacity")
    private Integer capacity;

    @ColumnDefault("false")
    @Column(name = "smoking_allowed")
    private Boolean smokingAllowed;

    @ColumnDefault("false")
    @Column(name = "outdoor")
    private Boolean outdoor;

    @ColumnDefault("active")
    @Column(name = "status", length = 20)
    private String status;

}
