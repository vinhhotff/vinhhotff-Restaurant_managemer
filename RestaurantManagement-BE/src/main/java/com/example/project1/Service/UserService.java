package com.example.project1.Service;

import com.example.project1.Models.User;
import com.example.project1.Repository.UserRepository;
import com.example.project1.Repository.Specification.UserSpecification;
import com.example.project1.Service.Ipm.IUserService;
import com.example.project1.dto.request.CreateUserRequest;
import com.example.project1.dto.request.UpdateUserRequest;
import com.example.project1.exception.AppException;
import com.example.project1.exception.EmailAlreadyExistsException;
import com.example.project1.mapper.UserMapper;

import com.example.project1.Repository.ReservationRepository;
import com.example.project1.dto.response.ReservationResponse;
import com.example.project1.dto.response.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final ReservationRepository reservationRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Override
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(userMapper::toResponse);
    }

    @Override
    public Page<UserResponse> getUsers(String keyword, Boolean isVerified, String authProvider, Pageable pageable) {
        Specification<User> spec = UserSpecification.filterUsers(keyword, isVerified, authProvider);
        return userRepository.findAll(spec, pageable)
                .map(userMapper::toResponse);
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new AppException("User not found", 404));
    }

    @Override
    public List<ReservationResponse> getUserReservations(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new AppException("User not found with id: " + userId, 404);
        }

        return reservationRepository.findByUserId(userId).stream()
                .map(res -> new ReservationResponse(
                        res.getId(),
                        res.getReservationCode(),
                        res.getUser().getId(),
                        res.getUser().getFullName(),
                        res.getRestaurant().getId(),
                        res.getRestaurant().getName(),
                        res.getTables().getId(),
                        res.getTables().getTableName() != null ? res.getTables().getTableName()
                                : res.getTables().getTableNumber(),
                        res.getReservationDate(),
                        res.getStartTime(),
                        res.getEndTime(),
                        res.getNumberOfGuests(),
                        res.getSpecialRequests(),
                        res.getCreatedAt(),
                        res.getUpdatedAt()))
                .toList();
    }

    @Override
    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        User user = userMapper.toEntity(request);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(
                        "No class User entity with id " + id + " exists!", 404));

        userRepository.delete(user);
    }

    @Override
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(
                        "No class User entity with id " + id + " exists!", 404));

        if (!user.getEmail().equals(request.getEmail()) &&
                userRepository.existsByEmail(request.getEmail())) {
            throw new AppException("Email đã tồn tại: " + request.getEmail(), 409);
        }

        userMapper.updateEntity(user, request);
        return userMapper.toResponse(userRepository.save(user));
    }
}