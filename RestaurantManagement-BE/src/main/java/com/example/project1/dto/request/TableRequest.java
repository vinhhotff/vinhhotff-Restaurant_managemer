package com.example.project1.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TableRequest {
    @NotNull(message = "restaurantId is required")
    private Integer restaurantId;

    @NotNull(message = "areaId is required")
    private Integer areaId;

    @NotBlank(message = "tableNumber is required")
    private String tableNumber;

    @NotBlank(message = "tableName is required")
    private String tableName;

    @NotNull(message = "capacity is required")
    @Min(value = 1, message = "capacity must be >= 1")
    private Integer capacity;
    private Integer minPersons;
    private String positionDescription;
    private String status;
    private Map<String, Object> features;
}
