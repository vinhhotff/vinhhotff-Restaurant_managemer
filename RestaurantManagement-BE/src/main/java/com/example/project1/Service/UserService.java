package com.example.project1.Service;

import com.example.project1.Models.User;
import com.example.project1.Repository.UserRepository;
import com.example.project1.dto.request.CreateUserRequest;
import com.example.project1.dto.request.UpdateUserRequest;
import com.example.project1.exception.AppException;
import com.example.project1.exception.EmailAlreadyExistsException;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new AppException("User not found", 404));
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