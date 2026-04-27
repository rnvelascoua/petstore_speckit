package com.petstore.pet.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record PetSummaryDto(
        UUID id,
        String name,
        String category,
        String breed,
        int ageMonths,
        BigDecimal price,
        boolean available,
        String primaryPhotoUrl
) {}
