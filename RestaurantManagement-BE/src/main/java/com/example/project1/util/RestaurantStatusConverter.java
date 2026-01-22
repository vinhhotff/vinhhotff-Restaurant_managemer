package com.example.project1.util;

import com.example.project1.Models.Enums.RestaurantStatus;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter(autoApply = false)
public class RestaurantStatusConverter implements AttributeConverter<RestaurantStatus, String> {

    @Override
    public String convertToDatabaseColumn(RestaurantStatus attribute) {
        if (attribute == null) {
            return null;
        }
        // Convert Java ACTIVE to database active (lowercase)
        return attribute.name().toLowerCase();
    }

    @Override
    public RestaurantStatus convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return null;
        }
        // Convert database active to Java ACTIVE (uppercase)
        return RestaurantStatus.valueOf(dbData.toUpperCase());
    }
}
