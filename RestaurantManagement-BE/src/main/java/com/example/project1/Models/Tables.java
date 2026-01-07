package com.example.project1.Models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.Map;

@Getter
@Setter
@Entity
@jakarta.persistence.Table(name = "tables")
public class Tables {
    @Id
    @ColumnDefault("nextval('tables_table_id_seq'")
    @Column(name = "table_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
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

    @Column(name = "features")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> features;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private Instant createdAt;

/*
 TODO [Reverse Engineering] create field to map the 'status' column
 Available actions: Define target Java type | Uncomment as is | Remove column mapping
    @ColumnDefault("available")
    @Column(name = "status", columnDefinition = "table_status")
    private Object status;
*/
}