package com.example.project1.Models.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TableStatus {
    available,
    occupied,
    reserved,
    maintenance;

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static TableStatus fromValue(String value) {
        if (value == null) return null;
        try {
            return TableStatus.valueOf(value.toLowerCase());
        } catch (IllegalArgumentException e) {
            return TableStatus.valueOf(value.toUpperCase());
        }
    }
}
