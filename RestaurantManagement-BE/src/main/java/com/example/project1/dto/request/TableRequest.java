package com.example.project1.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TableRequest {
    private Integer restaurant_id;
    private Integer area_id;
    private String tableNumber;
    private String tableName;
    private Integer capacity;
    private Integer min_persons;
    private String positionDescription;
    private Map<String, Object> features;
}
