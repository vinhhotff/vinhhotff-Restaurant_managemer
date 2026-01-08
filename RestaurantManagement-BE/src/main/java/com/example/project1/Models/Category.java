package com.example.project1.Models;

import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "categories")
public class Category {
    @Id
    @ColumnDefault("nextval('categories_category_id_seq'")
    @Column(name = "category_id", nullable = false)
    private Integer id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "icon", length = 100)
    private String icon;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Category parent;

}
