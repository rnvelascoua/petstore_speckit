package com.petstore.pet;

import java.util.UUID;

public class PetNotFoundException extends RuntimeException {
    public PetNotFoundException(UUID id) {
        super("Pet not found: " + id);
    }
}
