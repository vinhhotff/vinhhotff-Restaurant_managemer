package com.example.project1.Service;

import com.example.project1.Models.*;
import com.example.project1.Repository.*;
import com.example.project1.Service.Ipm.IReservationServices;
import com.example.project1.dto.ReservationDTO;
import com.example.project1.dto.response.ReservationResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class ReservationServices implements IReservationServices {
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final TablesRepository tablesRepository;
    private final PaymentRepository paymentRepository;
    private final CartItemRepository cartItemRepository;
    private final PreOrderRepository preOrderRepository;
    
    public ReservationServices(
            ReservationRepository reservationRepository,
            UserRepository userRepository,
            RestaurantRepository restaurantRepository,
            TablesRepository tablesRepository,
            PaymentRepository paymentRepository,
            CartItemRepository cartItemRepository,
            PreOrderRepository preOrderRepository) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
        this.tablesRepository = tablesRepository;
        this.paymentRepository = paymentRepository;
        this.cartItemRepository = cartItemRepository;
        this.preOrderRepository = preOrderRepository;
    }

    @Override
    @Transactional
    public ReservationResponse CreateReservation(ReservationDTO dto) {

        if (!dto.getEndTime().isAfter(dto.getStartTime())) {
            throw new RuntimeException("End time must be after start time");
        }

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + dto.getUserId()));

        Restaurant restaurant = restaurantRepository.findById(dto.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("Restaurant not found with ID: " + dto.getRestaurantId()));

        Tables table = tablesRepository.findById(dto.getTableId())
                .orElseThrow(() -> new RuntimeException("Table not found with ID: " + dto.getTableId()));

        String reservationCode = dto.getReservationCode();
        if (reservationCode == null || reservationCode.isBlank()) {
            reservationCode = "RES" + UUID.randomUUID().toString().replace("-", "")
                    .substring(0, 8).toUpperCase();
        }

        if (reservationRepository.existsByReservationCode(reservationCode)) {
            throw new RuntimeException("Reservation code already exists: " + reservationCode);
        }

        Instant now = Instant.now();

        Reservation reservation = new Reservation();
        reservation.setReservationCode(reservationCode);
        reservation.setUser(user);
        reservation.setRestaurant(restaurant);
        reservation.setTables(table);
        reservation.setOccasion(dto.getOccasion());
        reservation.setReservationDate(dto.getReservationDate());
        reservation.setStartTime(dto.getStartTime());
        reservation.setEndTime(dto.getEndTime());
        reservation.setNumberOfGuests(dto.getNumberOfGuests());
        reservation.setSpecialRequests(dto.getSpecialRequests());
        reservation.setCreatedAt(now);

        Reservation saved = reservationRepository.save(reservation);

        Long userId = dto.getUserId();
        List<CartItem> cartItems = cartItemRepository.findByUser_Id(userId);


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
        cartItemRepository.deleteAllByUser_Id(userId);

        return new ReservationResponse(
                saved.getId(),
                saved.getReservationCode(),
                user.getId(),
                user.getFullName(),
                restaurant.getId(),
                restaurant.getName(),
                table.getId(),
                (table.getTableName() != null ? table.getTableName() : table.getTableNumber()),
                saved.getReservationDate(),
                saved.getStartTime(),
                saved.getEndTime(),
                saved.getNumberOfGuests(),
                saved.getSpecialRequests(),
                saved.getCreatedAt(),
                saved.getUpdatedAt()
        );
    }


    @Override
    public List<ReservationResponse> getAllReservations() {
        List<Reservation> reservations = this.reservationRepository.findAll();
        
        return reservations.stream()
                .map(reservation -> new ReservationResponse(
                        reservation.getId(),
                        reservation.getReservationCode(),
                        reservation.getUser().getId(),
                        reservation.getUser().getFullName(),
                        reservation.getRestaurant().getId(),
                        reservation.getRestaurant().getName(),
                        reservation.getTables().getId(),
                        reservation.getTables().getTableName() != null ? 
                            reservation.getTables().getTableName() : reservation.getTables().getTableNumber(),
                        reservation.getReservationDate(),
                        reservation.getStartTime(),
                        reservation.getEndTime(),
                        reservation.getNumberOfGuests(),
                        reservation.getSpecialRequests(),
                        reservation.getCreatedAt(),
                        reservation.getUpdatedAt()
                ))
                .toList();
    }

    @Override
    @Transactional
    public ReservationResponse UpdateReservation(Long id, ReservationDTO dto) {
        Reservation reservationResult = this.reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        // Validate time
        if (dto.getEndTime().isBefore(dto.getStartTime()) ||
            dto.getEndTime().equals(dto.getStartTime())) {
            throw new RuntimeException("End time must be after start time");
        }
        
        // Fetch entities by IDs if they're changed
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + dto.getUserId()));
        
        Restaurant restaurant = restaurantRepository.findById(dto.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("Restaurant not found with ID: " + dto.getRestaurantId()));
        
        Tables table = tablesRepository.findById(dto.getTableId())
                .orElseThrow(() -> new RuntimeException("Table not found with ID: " + dto.getTableId()));

        reservationResult.setReservationCode(dto.getReservationCode());
        reservationResult.setUser(user);
        reservationResult.setRestaurant(restaurant);
        reservationResult.setTables(table);
        reservationResult.setReservationDate(dto.getReservationDate());
        reservationResult.setStartTime(dto.getStartTime());
        reservationResult.setEndTime(dto.getEndTime());
        reservationResult.setNumberOfGuests(dto.getNumberOfGuests());
        reservationResult.setSpecialRequests(dto.getSpecialRequests());
        reservationResult.setUpdatedAt(Instant.now());
        
        Reservation updated = this.reservationRepository.save(reservationResult);
        
        // Convert to DTO
        return new ReservationResponse(
                updated.getId(),
                updated.getReservationCode(),
                user.getId(),
                user.getFullName(),
                restaurant.getId(),
                restaurant.getName(),
                table.getId(),
                table.getTableName() != null ? table.getTableName() : table.getTableNumber(),
                updated.getReservationDate(),
                updated.getStartTime(),
                updated.getEndTime(),
                updated.getNumberOfGuests(),
                updated.getSpecialRequests(),
                updated.getCreatedAt(),
                updated.getUpdatedAt()
        );
    }

    @Override
    @Transactional
    public void DeleteReservation(Long id) {
        Reservation reservation = this.reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with ID: " + id));
        
        // Check if there are any payments associated with this reservation
        if (paymentRepository.existsByReservation(reservation)) {
            long paymentCount = paymentRepository.countByReservation(reservation);
            throw new RuntimeException(
                "Cannot delete reservation. There " + (paymentCount == 1 ? "is 1 payment" : "are " + paymentCount + " payments") + 
                " associated with this reservation. Please delete the payment(s) first."
            );
        }
        
        // If no payments exist, allow hard delete
        this.reservationRepository.deleteById(id);
    }

    @Override
    public ReservationResponse getReservationById(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with ID: " + id));
        
        return new ReservationResponse(
                reservation.getId(),
                reservation.getReservationCode(),
                reservation.getUser().getId(),
                reservation.getUser().getFullName(),
                reservation.getRestaurant().getId(),
                reservation.getRestaurant().getName(),
                reservation.getTables().getId(),
                reservation.getTables().getTableName() != null ? 
                    reservation.getTables().getTableName() : reservation.getTables().getTableNumber(),
                reservation.getReservationDate(),
                reservation.getStartTime(),
                reservation.getEndTime(),
                reservation.getNumberOfGuests(),
                reservation.getSpecialRequests(),
                reservation.getCreatedAt(),
                reservation.getUpdatedAt()
        );
    }
}
