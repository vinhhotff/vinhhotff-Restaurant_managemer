package com.example.project1.util;

import com.example.project1.Models.Enums.TableStatus;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter(autoApply = false)
public class TableStatusConverter implements AttributeConverter<TableStatus, String> {

    @Override
    public String convertToDatabaseColumn(TableStatus attribute) {
        if (attribute == null) {
            return null;
        }
        // Convert Java AVAILABLE to database available (lowercase)
        return attribute.name().toLowerCase();
    }

    @Override
    public TableStatus convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return null;
        }
        // Convert database available to Java AVAILABLE (uppercase)
        return TableStatus.valueOf(dbData.toUpperCase());
    }
}
