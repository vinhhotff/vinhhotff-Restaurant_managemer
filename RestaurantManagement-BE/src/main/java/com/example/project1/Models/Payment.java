package com.example.project1.Models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @ColumnDefault("nextval('payments_payment_id_seq'")
    @Column(name = "payment_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @ColumnDefault("VND")
    @Column(name = "currency", length = 3)
    private String currency;

    @Column(name = "paid_at")
    private Instant paidAt;

    @Column(name = "transaction_id", length = 100)
    private String transactionId;
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private Instant createdAt;

/*
 TODO [Reverse Engineering] create field to map the 'payment_method' column
 Available actions: Define target Java type | Uncomment as is | Remove column mapping
    @Column(name = "payment_method", columnDefinition = "payment_method not null")
    private Object paymentMethod;
*/
/*
 TODO [Reverse Engineering] create field to map the 'payment_status' column
 Available actions: Define target Java type | Uncomment as is | Remove column mapping
    @ColumnDefault("pending")
    @Column(name = "payment_status", columnDefinition = "payment_status")
    private Object paymentStatus;
*/
}