package com.example.project1.Models;

import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "menus")
@SQLDelete(sql = "UPDATE menus SET deleted_at = NOW() WHERE menu_id = ?")
@Where(clause = "deleted_at IS NULL")
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

    @ColumnDefault("'VND'")
    @Column(name = "currency", length = 3)
    private String currency = "VND";

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @ColumnDefault("true")
    @Column(name = "is_available")
    private Boolean isAvailable = true;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;
}
