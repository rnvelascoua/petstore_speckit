package com.petstore.pet;

import com.petstore.pet.dto.CreatePetRequest;
import com.petstore.pet.dto.PetDetailDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/pets")
@Tag(name = "Admin", description = "Admin: manage pet listings")
public class AdminPetController {

    private final PetService petService;

    public AdminPetController(PetService petService) {
        this.petService = petService;
    }

    @PostMapping
    @Operation(summary = "Create pet")
    public ResponseEntity<PetDetailDto> createPet(@Valid @RequestBody CreatePetRequest req) {
        PetDetailDto created = petService.createPet(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update pet")
    public ResponseEntity<PetDetailDto> updatePet(
            @PathVariable UUID id,
            @Valid @RequestBody CreatePetRequest req) {
        PetDetailDto updated = petService.updatePet(id, req);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete pet")
    public ResponseEntity<Void> deletePet(@PathVariable UUID id) {
        petService.deletePet(id);
        return ResponseEntity.noContent().build();
    }
}
