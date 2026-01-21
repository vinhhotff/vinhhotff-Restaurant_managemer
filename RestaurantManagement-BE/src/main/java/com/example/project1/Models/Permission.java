package com.example.project1.Models;

import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "permissions")
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "permission_id")
    private Integer id;

    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name; // e.g., MANAGE_RESTAURANT, VIEW_REPORTS

    @Column(name = "description")
    private String description;
}
