package com.example.project1.Service;

import com.example.project1.Models.*;
import com.example.project1.Repository.*;
import com.example.project1.Service.Ipm.IReservationServices;
import com.example.project1.dto.request.ReservationDTO;
import com.example.project1.dto.response.ReservationResponse;
import com.example.project1.exception.AppException;
import com.example.project1.mapper.ReservationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReservationServices implements IReservationServices {
        private final ReservationRepository reservationRepository;
        private final UserRepository userRepository;
        private final RestaurantRepository restaurantRepository;
        private final TablesRepository tablesRepository;
        private final PaymentRepository paymentRepository;
        private final CartItemRepository cartItemRepository;
        private final PreOrderRepository preOrderRepository;
        private final ReservationMapper reservationMapper;

        @Override
        @Transactional
        public ReservationResponse CreateReservation(ReservationDTO dto) {
                if (!dto.getEndTime().isAfter(dto.getStartTime())) {
                        throw new AppException("End time must be after start time", 400);
                }

                User user = userRepository.findById(dto.getUserId())
                                .orElseThrow(() -> new AppException("User not found with ID: " + dto.getUserId(), 404));

                Restaurant restaurant = restaurantRepository.findById(dto.getRestaurantId())
                                .orElseThrow(() -> new AppException(
                                                "Restaurant not found with ID: " + dto.getRestaurantId(), 404));

                Tables table = tablesRepository.findById(dto.getTableId())
                                .orElseThrow(() -> new AppException("Table not found with ID: " + dto.getTableId(),
                                                404));

                String reservationCode = dto.getReservationCode();
                if (reservationCode == null || reservationCode.isBlank()) {
                        reservationCode = "RES" + UUID.randomUUID().toString().replace("-", "")
                                        .substring(0, 8).toUpperCase();
                }

                if (reservationRepository.existsByReservationCode(reservationCode)) {
                        throw new AppException("Reservation code already exists: " + reservationCode, 409);
                }

                Instant now = Instant.now();

                Reservation reservation = reservationMapper.toEntity(dto);
                reservation.setReservationCode(reservationCode);
                reservation.setUser(user);
                reservation.setRestaurant(restaurant);
                reservation.setTables(table);
                reservation.setCreatedAt(now);

                Reservation saved = reservationRepository.save(reservation);

                // Handle pre-orders from cart
                List<CartItem> cartItems = cartItemRepository.findByUser_Id(dto.getUserId());
                if (!cartItems.isEmpty()) {
                        List<PreOrder> preOrders = cartItems.stream().map(ci -> {
                                PreOrder po = new PreOrder();
                                po.setReservation(saved);
                                po.setMenu(ci.getMenu());
                                po.setQuantity(ci.getQuantity());
                                po.setSpecialInstructions(ci.getSpecialInstructions());
                                po.setCreatedAt(now);
                                return po;
                        }).toList();
                        preOrderRepository.saveAll(preOrders);
                        cartItemRepository.deleteAllByUser_Id(dto.getUserId());
                }

                return reservationMapper.toResponse(saved);
        }

        @Override
        public List<ReservationResponse> getAllReservations() {
                return reservationRepository.findAll().stream()
                                .map(reservationMapper::toResponse)
                                .toList();
        }

        @Override
        @Transactional
        public ReservationResponse UpdateReservation(Long id, ReservationDTO dto) {
                Reservation reservation = reservationRepository.findById(id)
                                .orElseThrow(() -> new AppException("Reservation not found with ID: " + id, 404));

                if (!dto.getEndTime().isAfter(dto.getStartTime())) {
                        throw new AppException("End time must be after start time", 400);
                }

                User user = userRepository.findById(dto.getUserId())
                                .orElseThrow(() -> new AppException("User not found with ID: " + dto.getUserId(), 404));

                Restaurant restaurant = restaurantRepository.findById(dto.getRestaurantId())
                                .orElseThrow(() -> new AppException(
                                                "Restaurant not found with ID: " + dto.getRestaurantId(), 404));

                Tables table = tablesRepository.findById(dto.getTableId())
                                .orElseThrow(() -> new AppException("Table not found with ID: " + dto.getTableId(),
                                                404));

                reservationMapper.updateEntity(reservation, dto);
                reservation.setUser(user);
                reservation.setRestaurant(restaurant);
                reservation.setTables(table);
                reservation.setUpdatedAt(Instant.now());

                return reservationMapper.toResponse(reservationRepository.save(reservation));
        }

        @Override
        @Transactional
        public void DeleteReservation(Long id) {
                Reservation reservation = reservationRepository.findById(id)
                                .orElseThrow(() -> new AppException("Reservation not found with ID: " + id, 404));

                if (paymentRepository.existsByReservation(reservation)) {
                        long paymentCount = paymentRepository.countByReservation(reservation);
                        throw new AppException("Cannot delete reservation. There are " + paymentCount +
                                        " payments associated with it. Please delete payments first.", 409);
                }

                reservationRepository.delete(reservation);
        }

        @Override
        public ReservationResponse getReservationById(Long id) {
                Reservation reservation = reservationRepository.findById(id)
                                .orElseThrow(() -> new AppException("Reservation not found with ID: " + id, 404));

                return reservationMapper.toResponse(reservation);
        }
}
