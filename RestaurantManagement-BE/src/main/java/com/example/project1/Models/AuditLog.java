package com.example.project1.Models;

import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "audit_logs")
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "action", nullable = false)
    private String action; // e.g., UPDATE_PRICE, CANCEL_BOOKING

    @Column(name = "entity_name")
    private String entityName;

    @Column(name = "entity_id")
    private Long entityId;

    @Column(name = "old_value", columnDefinition = "text")
    private String oldValue;

    @Column(name = "new_value", columnDefinition = "text")
    private String newValue;

    @Column(name = "timestamp", nullable = false)
    private Instant timestamp = Instant.now();
}
