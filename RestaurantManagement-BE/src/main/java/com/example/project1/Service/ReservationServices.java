package com.example.project1.Service;

import com.example.project1.Models.Reservation;
import com.example.project1.Models.Restaurant;
import com.example.project1.Models.Tables;
import com.example.project1.Models.User;
import com.example.project1.Repository.ReservationRepository;
import com.example.project1.Repository.RestaurantRepository;
import com.example.project1.Repository.TablesRepository;
import com.example.project1.Repository.UserRepository;
import com.example.project1.Repository.PaymentRepository;
import com.example.project1.Service.Ipm.IReservationServices;
import com.example.project1.dto.ReservationDTO;
import com.example.project1.dto.response.ReservationResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReservationServices implements IReservationServices {
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final TablesRepository tablesRepository;
    private final PaymentRepository paymentRepository;
    
    public ReservationServices(
            ReservationRepository reservationRepository,
            UserRepository userRepository,
            RestaurantRepository restaurantRepository,
            TablesRepository tablesRepository,
            PaymentRepository paymentRepository) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
        this.tablesRepository = tablesRepository;
        this.paymentRepository = paymentRepository;
    }

    @Override
    @Transactional
    public ReservationResponse CreateReservation(ReservationDTO reservationDto) {
        if (reservationDto.getEndTime().isBefore(reservationDto.getStartTime()) ||
            reservationDto.getEndTime().equals(reservationDto.getStartTime())) {
            throw new RuntimeException("End time must be after start time");
        }
        
        try {
            User user = userRepository.findById(reservationDto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + reservationDto.getUserId()));
            
            Restaurant restaurant = restaurantRepository.findById(reservationDto.getRestaurantId())
                    .orElseThrow(() -> new RuntimeException("Restaurant not found with ID: " + reservationDto.getRestaurantId()));
            
            Tables table = tablesRepository.findById(reservationDto.getTableId())
                    .orElseThrow(() -> new RuntimeException("Table not found with ID: " + reservationDto.getTableId()));
        

        String reservationCode = reservationDto.getReservationCode();
        if (reservationCode == null || reservationCode.isEmpty()) {
            reservationCode = "RES" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
        
        if(reservationRepository.existsByReservationCode(reservationCode)) {
            throw new RuntimeException("Reservation code already exists: " + reservationCode);
        }

        Reservation newReservation = new Reservation();
        newReservation.setReservationCode(reservationCode);
        newReservation.setUser(user);
        newReservation.setRestaurant(restaurant);
        newReservation.setTables(table);
        newReservation.setReservationDate(reservationDto.getReservationDate());
        newReservation.setStartTime(reservationDto.getStartTime());
        newReservation.setEndTime(reservationDto.getEndTime());
        newReservation.setNumberOfGuests(reservationDto.getNumberOfGuests());
        newReservation.setSpecialRequests(reservationDto.getSpecialRequests());
        newReservation.setCreatedAt(Instant.now());
        newReservation.setUpdatedAt(Instant.now());
        
        Reservation saved = reservationRepository.save(newReservation);
        
        // Convert to DTO
        return new ReservationResponse(
                saved.getId(),
                saved.getReservationCode(),
                user.getId(),
                user.getFullName(),
                restaurant.getId(),
                restaurant.getName(),
                table.getId(),
                table.getTableName() != null ? table.getTableName() : table.getTableNumber(),
                saved.getReservationDate(),
                saved.getStartTime(),
                saved.getEndTime(),
                saved.getNumberOfGuests(),
                saved.getSpecialRequests(),
                saved.getCreatedAt(),
                saved.getUpdatedAt()
        );
        } catch (Exception e) {
            throw new RuntimeException("Error creating reservation: " + e.getMessage(), e);
        }
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
    public Reservation getTodoById(Long id) {
        Reservation reservationFindById = this.reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        return reservationFindById;
    }
}
