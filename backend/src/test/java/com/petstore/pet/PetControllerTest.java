package com.petstore.pet;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.petstore.pet.dto.PetDetailDto;
import com.petstore.pet.dto.PetSummaryDto;
import com.petstore.pet.dto.PhotoDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PetController.class)
class PetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PetService petService;

    private final UUID petId = UUID.fromString("a0000001-0000-0000-0000-000000000001");

    private PetSummaryDto sampleSummary() {
        return new PetSummaryDto(petId, "Buddy", "DOG", "Golden Retriever", 18,
                new BigDecimal("850.00"), true, "https://example.com/buddy.jpg");
    }

    private PetDetailDto sampleDetail() {
        return new PetDetailDto(petId, "Buddy", "DOG", "Golden Retriever", 18,
                new BigDecimal("850.00"), true, "https://example.com/buddy.jpg",
                "Friendly dog", List.of(new PhotoDto("https://example.com/buddy.jpg", true)));
    }

    // ---- US1: Browse All Pets ----

    @Test
    void getPets_noFilter_returns200WithContent() throws Exception {
        var page = new PageImpl<>(List.of(sampleSummary()), PageRequest.of(0, 12), 1);
        when(petService.getAllPets(any(), any())).thenReturn(page);

        mockMvc.perform(get("/api/pets").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("Buddy"))
                .andExpect(jsonPath("$.content[0].category").value("DOG"))
                .andExpect(jsonPath("$.totalElements").value(1));
    }

    @Test
    void getPets_emptyDb_returns200WithEmptyContent() throws Exception {
        var emptyPage = new PageImpl<PetSummaryDto>(List.of(), PageRequest.of(0, 12), 0);
        when(petService.getAllPets(any(), any())).thenReturn(emptyPage);

        mockMvc.perform(get("/api/pets").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isEmpty())
                .andExpect(jsonPath("$.totalElements").value(0));
    }

    @Test
    void getPets_invalidPaginationParams_returns400() throws Exception {
        mockMvc.perform(get("/api/pets?size=100").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    // ---- US2: Filter by Category ----

    @Test
    void getPets_filterByDog_returns200WithDogsOnly() throws Exception {
        var page = new PageImpl<>(List.of(sampleSummary()), PageRequest.of(0, 12), 1);
        when(petService.getAllPets(any(), any())).thenReturn(page);

        mockMvc.perform(get("/api/pets?category=DOG").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].category").value("DOG"));
    }

    @Test
    void getPets_filterByMultipleCategories_returns200WithMatching() throws Exception {
        var page = new PageImpl<>(List.of(sampleSummary()), PageRequest.of(0, 12), 1);
        when(petService.getAllPets(any(), any())).thenReturn(page);

        mockMvc.perform(get("/api/pets?category=DOG&category=CAT").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void getPets_invalidCategoryValue_returns400() throws Exception {
        mockMvc.perform(get("/api/pets?category=DRAGON").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    // ---- US3: Pet Detail ----

    @Test
    void getPetById_validId_returns200WithDetail() throws Exception {
        when(petService.getPetById(petId)).thenReturn(sampleDetail());

        mockMvc.perform(get("/api/pets/" + petId).accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Buddy"))
                .andExpect(jsonPath("$.description").value("Friendly dog"))
                .andExpect(jsonPath("$.photos[0].isPrimary").value(true));
    }

    @Test
    void getPetById_notFound_returns404() throws Exception {
        UUID unknownId = UUID.randomUUID();
        when(petService.getPetById(unknownId)).thenThrow(new PetNotFoundException(unknownId));

        mockMvc.perform(get("/api/pets/" + unknownId).accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").exists());
    }

    @Test
    void getPetById_invalidUuid_returns400() throws Exception {
        mockMvc.perform(get("/api/pets/not-a-uuid").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }
}
