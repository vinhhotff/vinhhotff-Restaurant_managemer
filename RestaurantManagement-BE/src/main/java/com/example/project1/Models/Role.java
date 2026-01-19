package com.example.project1.Models;

import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private Integer id;

    @Column(name = "name", nullable = false, unique = true, length = 50)
    private String name; // e.g., ROLE_USER, ROLE_OWNER, ROLE_ADMIN

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "role_permissions", joinColumns = @JoinColumn(name = "role_id"), inverseJoinColumns = @JoinColumn(name = "permission_id"))
    private Set<Permission> permissions;
}
