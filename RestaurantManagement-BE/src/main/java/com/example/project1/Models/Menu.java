package com.example.project1.Models;

import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "menus")
public class Menu {
    @Id
    @ColumnDefault("nextval('menus_menu_id_seq'")
    @Column(name = "menu_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @Column(name = "description", length = Integer.MAX_VALUE)
    private String description;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @ColumnDefault("VND")
    @Column(name = "currency", length = 3)
    private String currency;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @ColumnDefault("true")
    @Column(name = "is_available")
    private Boolean isAvailable;
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private Instant createdAt;

/*
 TODO [Reverse Engineering] create field to map the 'category' column
 Available actions: Define target Java type | Uncomment as is | Remove column mapping
    @Column(name = "category", columnDefinition = "menu_category not null")
    private Object category;
*/
}
