package com.example.project1.Service;

import com.example.project1.Models.User;
import com.example.project1.Repository.UserRepository;
import com.example.project1.dto.request.CreateUserRequest;
import com.example.project1.dto.request.UpdateUserRequest;
import com.example.project1.exception.AppException;
import com.example.project1.exception.EmailAlreadyExistsException;

import com.example.project1.Repository.ReservationRepository;
import com.example.project1.dto.response.ReservationResponse;
import com.example.project1.dto.response.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ReservationRepository reservationRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Lấy danh sách user có phân trang và sắp xếp.
     * 
     * @param pageable đối tượng chứa thông tin page, size và sort
     * @return Page<UserResponse> kết quả phân trang
     */
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(UserResponse::from);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new AppException("User not found", 404));
    }

    /**
     * Lấy danh sách đặt chỗ của một user.
     * 
     * @param userId ID của người dùng
     * @return List<ReservationResponse> danh sách đặt chỗ đã được map sang DTO
     */
    public List<ReservationResponse> getUserReservations(Long userId) {
        // Kiểm tra user có tồn tại không
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

    public User createUser(CreateUserRequest request) {
        // Kiểm tra email đã tồn tại
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());

        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(
                        "No class User entity with id " + id + " exists!", 404));

        userRepository.delete(user);
    }

    public User updateUser(Long id, UpdateUserRequest request) {
        // Lấy user, nếu không có -> throw AppException 404
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(
                        "No class User entity with id " + id + " exists!", 404));

        // Kiểm tra email mới có bị trùng không (nếu thay đổi)
        if (!user.getEmail().equals(request.getEmail()) &&
                userRepository.existsByEmail(request.getEmail())) {
            throw new AppException("Email đã tồn tại: " + request.getEmail(), 409);
        }

        // Cập nhật các trường
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setProfileImage(request.getProfileImage());

        return userRepository.save(user);
    }

}