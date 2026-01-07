package com.example.project1.Models;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.util.Objects;

@Getter
@Setter
@Embeddable
public class RestaurantCategoryId implements java.io.Serializable {
    private static final long serialVersionUID = -2215097887124216224L;
    @Column(name = "restaurant_id", nullable = false)
    private Integer restaurantId;

    @Column(name = "category_id", nullable = false)
    private Integer categoryId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        RestaurantCategoryId entity = (RestaurantCategoryId) o;
        return Objects.equals(this.restaurantId, entity.restaurantId) &&
                Objects.equals(this.categoryId, entity.categoryId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(restaurantId, categoryId);
    }

}
