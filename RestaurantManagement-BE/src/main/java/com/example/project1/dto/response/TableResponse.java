package com.example.project1.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TableResponse {
    private Integer id;
    private Integer restaurant_id;
    private Integer area_id;
    private String tableNumber;
    private String tableName;
    private Integer capacity;
    private Integer min_persons;
    private String positionDescription;
    private Object features;
    private Instant createdAt;
}
