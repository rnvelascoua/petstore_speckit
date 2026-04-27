package com.petstore.pet.dto;

import jakarta.validation.constraints.NotBlank;

public record PhotoRequest(
        @NotBlank String url,
        boolean isPrimary
) {}
