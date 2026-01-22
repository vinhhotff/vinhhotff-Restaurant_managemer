package com.example.project1.Models;

import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
import com.example.project1.Models.Enums.TableStatus;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import com.vladmihalcea.hibernate.type.basic.PostgreSQLEnumType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.Instant;
import java.util.Map;

@Getter
@Setter
@Entity
@javax.persistence.Table(name = "tables")
@SQLDelete(sql = "UPDATE tables SET deleted_at = NOW() WHERE table_id = ?")
@Where(clause = "deleted_at IS NULL")
@TypeDef(name = "jsonb", typeClass = JsonBinaryType.class)
@TypeDef(name = "pgsql_enum", typeClass = PostgreSQLEnumType.class)
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Tables {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tables_table_id_seq")
    @SequenceGenerator(name = "tables_table_id_seq", sequenceName = "tables_table_id_seq", allocationSize = 1)
    @Column(name = "table_id")
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Type(type = "pgsql_enum")
    @ColumnDefault("'available'")
    @Column(name = "status", nullable = false, columnDefinition = "table_status")
    private TableStatus status = TableStatus.available;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "area_id")
    private RestaurantArea area;

    @Column(name = "table_number", nullable = false, length = 50)
    private String tableNumber;

    @Column(name = "table_name", length = 100)
    private String tableName;

    @Column(name = "capacity", nullable = false)
    private Integer capacity;

    @ColumnDefault("1")
    @Column(name = "min_persons")
    private Integer minPersons;

    @Column(name = "position_description", length = Integer.MAX_VALUE)
    private String positionDescription;

    @Type(type = "jsonb")
    @Column(name = "features", columnDefinition = "jsonb")
    private Map<String, Object> features;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private Instant createdAt;


    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;
}
