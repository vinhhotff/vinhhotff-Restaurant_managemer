package com.example.project1.Models.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum RestaurantStatus {
    pending,
    active,
    inactive,
    rejected;

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static RestaurantStatus fromValue(String value) {
        if (value == null) return null;
        try {
            return RestaurantStatus.valueOf(value.toLowerCase());
        } catch (IllegalArgumentException e) {
            return RestaurantStatus.valueOf(value.toUpperCase());
        }
    }
}
