package com.example.project1.Models.Enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ReservationStatus {
    pending,
    confirmed,
    checked_in,
    cancelled,
    no_show,
    completed;

    @JsonValue
    public String toValue() {
        return this.name();
    }

    @JsonCreator
    public static ReservationStatus fromValue(String value) {
        if (value == null) return null;
        try {
            return ReservationStatus.valueOf(value.toLowerCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
