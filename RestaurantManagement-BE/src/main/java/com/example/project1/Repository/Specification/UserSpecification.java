package com.example.project1.Repository.Specification;

import com.example.project1.Models.User;
import org.springframework.data.jpa.domain.Specification;
import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class UserSpecification {

    public static Specification<User> filterUsers(String keyword, Boolean isVerified, String authProvider) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (keyword != null && !keyword.isEmpty()) {
                String lkKeyword = "%" + keyword.toLowerCase() + "%";
                Predicate fullNamePredicate = cb.like(cb.lower(root.get("fullName")), lkKeyword);
                Predicate emailPredicate = cb.like(cb.lower(root.get("email")), lkKeyword);
                Predicate phonePredicate = cb.like(cb.lower(root.get("phone")), lkKeyword);
                predicates.add(cb.or(fullNamePredicate, emailPredicate, phonePredicate));
            }

            if (isVerified != null) {
                predicates.add(cb.equal(root.get("isVerified"), isVerified));
            }

            if (authProvider != null && !authProvider.isEmpty()) {
                predicates.add(cb.equal(root.get("authProvider"), authProvider));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
