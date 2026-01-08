package com.example.project1.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ApiResponse<T> {
    private int status;
    private String message;
    private T data;
    private String error;
    private Instant timestamp;
    private String traceId;

    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .status(200)
                .message(message)
                .data(data)
                .timestamp(Instant.now())
                .traceId(java.util.UUID.randomUUID().toString())
                .build();
    }

    public static ApiResponse<Void> error(String message, int status) {
        return ApiResponse.<Void>builder()
                .status(status)
                .message(message)
                .error(message)
                .timestamp(Instant.now())
                .traceId(java.util.UUID.randomUUID().toString())
                .build();
    }
}
