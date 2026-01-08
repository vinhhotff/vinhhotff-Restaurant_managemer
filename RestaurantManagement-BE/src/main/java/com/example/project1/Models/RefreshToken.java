package com.example.project1.Models;

import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(nullable = false, unique = true)
        private String tokenId;   // dùng để query

        @Column(nullable = false)
        private String tokenHash;

        @ManyToOne(fetch = FetchType.LAZY)
        private User user;

        private Instant expiryDate;

        private Boolean revoked = false;

        private Instant revokedAt;

        public String getTokenHash() {
                return tokenHash;
        }

        public void setTokenHash(String tokenHash) {
                this.tokenHash = tokenHash;
        }
}
