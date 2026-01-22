package com.example.project1.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TableResponse {
    private Integer id;
    private Integer restaurantId;
    private Integer areaId;
    private String areaName;
    private String tableNumber;
    private String tableName;
    private Integer capacity;
    private Integer minPersons;
    private String positionDescription;
    private String status;
    private Map<String, Object> features;
    private Instant createdAt;
    private Instant updatedAt;
}
