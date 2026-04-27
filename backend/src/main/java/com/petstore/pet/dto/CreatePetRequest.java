package com.petstore.pet.dto;

import com.petstore.pet.Category;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public record CreatePetRequest(
        @NotBlank String name,
        @NotNull Category category,
        @NotBlank String breed,
        @Min(0) int ageMonths,
        @NotBlank String description,
        @DecimalMin("0.0") BigDecimal price,
        boolean available,
        List<PhotoRequest> photos
) {}
