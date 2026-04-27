package com.petstore.pet;

import com.petstore.pet.dto.PetSummaryDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PetServiceTest {

    @Mock
    private PetRepository petRepository;

    @InjectMocks
    private PetService petService;

    private Pet dogPet;
    private PetPhoto primaryPhoto;

    @BeforeEach
    void setUp() {
        primaryPhoto = new PetPhoto();
        setField(primaryPhoto, "url", "https://example.com/buddy.jpg");
        setField(primaryPhoto, "isPrimary", true);
        setField(primaryPhoto, "sortOrder", 0);

        dogPet = new Pet();
        setField(dogPet, "id", UUID.randomUUID());
        setField(dogPet, "name", "Buddy");
        setField(dogPet, "category", Category.DOG);
        setField(dogPet, "breed", "Golden Retriever");
        setField(dogPet, "ageMonths", 18);
        setField(dogPet, "description", "Friendly dog");
        setField(dogPet, "price", new BigDecimal("850.00"));
        setField(dogPet, "available", true);
        setField(dogPet, "photos", List.of(primaryPhoto));
    }

    // ---- US1: Browse All Pets ----

    @Test
    void getAllPets_noFilter_returnsPageOfSummaryDtos() {
        Pageable pageable = PageRequest.of(0, 12);
        when(petRepository.findAll(pageable))
                .thenReturn(new PageImpl<>(List.of(dogPet), pageable, 1));

        Page<PetSummaryDto> result = petService.getAllPets(List.of(), pageable);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).name()).isEqualTo("Buddy");
        assertThat(result.getContent().get(0).category()).isEqualTo("DOG");
        assertThat(result.getContent().get(0).primaryPhotoUrl()).isEqualTo("https://example.com/buddy.jpg");
    }

    @Test
    void getAllPets_emptyResult_returnsEmptyPage() {
        Pageable pageable = PageRequest.of(0, 12);
        when(petRepository.findAll(pageable))
                .thenReturn(new PageImpl<>(List.of(), pageable, 0));

        Page<PetSummaryDto> result = petService.getAllPets(List.of(), pageable);

        assertThat(result.getContent()).isEmpty();
        assertThat(result.getTotalElements()).isZero();
    }

    @Test
    void getAllPets_nullPrice_returnedAsNull() {
        setField(dogPet, "price", null);
        Pageable pageable = PageRequest.of(0, 12);
        when(petRepository.findAll(pageable))
                .thenReturn(new PageImpl<>(List.of(dogPet), pageable, 1));

        Page<PetSummaryDto> result = petService.getAllPets(List.of(), pageable);

        assertThat(result.getContent().get(0).price()).isNull();
    }

    // ---- US2: Filter by Category ----

    @Test
    void getPetsByCategory_DOG_returnsOnlyDogs() {
        Pageable pageable = PageRequest.of(0, 12);
        when(petRepository.findByCategoryIn(List.of(Category.DOG), pageable))
                .thenReturn(new PageImpl<>(List.of(dogPet), pageable, 1));

        Page<PetSummaryDto> result = petService.getAllPets(List.of(Category.DOG), pageable);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).category()).isEqualTo("DOG");
    }

    @Test
    void getPetsByCategory_multipleCategories_returnsMatching() {
        Pet catPet = new Pet();
        setField(catPet, "id", UUID.randomUUID());
        setField(catPet, "name", "Luna");
        setField(catPet, "category", Category.CAT);
        setField(catPet, "breed", "Siamese");
        setField(catPet, "ageMonths", 12);
        setField(catPet, "description", "Elegant cat");
        setField(catPet, "price", new BigDecimal("400.00"));
        setField(catPet, "available", true);
        PetPhoto catPhoto = new PetPhoto();
        setField(catPhoto, "url", "https://example.com/luna.jpg");
        setField(catPhoto, "isPrimary", true);
        setField(catPhoto, "sortOrder", 0);
        setField(catPet, "photos", List.of(catPhoto));

        Pageable pageable = PageRequest.of(0, 12);
        when(petRepository.findByCategoryIn(List.of(Category.DOG, Category.CAT), pageable))
                .thenReturn(new PageImpl<>(List.of(dogPet, catPet), pageable, 2));

        Page<PetSummaryDto> result = petService.getAllPets(List.of(Category.DOG, Category.CAT), pageable);

        assertThat(result.getContent()).hasSize(2);
    }

    @Test
    void getPetsByCategory_noMatch_returnsEmptyPage() {
        Pageable pageable = PageRequest.of(0, 12);
        when(petRepository.findByCategoryIn(List.of(Category.BIRD), pageable))
                .thenReturn(new PageImpl<>(List.of(), pageable, 0));

        Page<PetSummaryDto> result = petService.getAllPets(List.of(Category.BIRD), pageable);

        assertThat(result.getContent()).isEmpty();
    }

    // ---- US3: Get Pet By ID ----

    @Test
    void getPetById_exists_returnsPetDetailDto() {
        when(petRepository.findById(dogPet.getId())).thenReturn(Optional.of(dogPet));

        var detail = petService.getPetById(dogPet.getId());

        assertThat(detail.name()).isEqualTo("Buddy");
        assertThat(detail.description()).isEqualTo("Friendly dog");
        assertThat(detail.photos()).hasSize(1);
        assertThat(detail.photos().get(0).isPrimary()).isTrue();
    }

    @Test
    void getPetById_notFound_throwsException() {
        UUID unknownId = UUID.randomUUID();
        when(petRepository.findById(unknownId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> petService.getPetById(unknownId))
                .isInstanceOf(PetNotFoundException.class)
                .hasMessageContaining(unknownId.toString());
    }

    @Test
    void getPetById_unavailablePet_returnsAvailableFalse() {
        setField(dogPet, "available", false);
        when(petRepository.findById(dogPet.getId())).thenReturn(Optional.of(dogPet));

        var detail = petService.getPetById(dogPet.getId());

        assertThat(detail.available()).isFalse();
    }

    @Test
    void getPetById_photosOrderedBySortOrder() {
        PetPhoto photo2 = new PetPhoto();
        setField(photo2, "url", "https://example.com/buddy2.jpg");
        setField(photo2, "isPrimary", false);
        setField(photo2, "sortOrder", 1);
        setField(dogPet, "photos", List.of(primaryPhoto, photo2));
        when(petRepository.findById(dogPet.getId())).thenReturn(Optional.of(dogPet));

        var detail = petService.getPetById(dogPet.getId());

        assertThat(detail.photos().get(0).isPrimary()).isTrue();
        assertThat(detail.photos().get(1).isPrimary()).isFalse();
    }

    // Helper to set private fields via reflection
    private void setField(Object target, String fieldName, Object value) {
        try {
            var field = findField(target.getClass(), fieldName);
            field.setAccessible(true);
            field.set(target, value);
        } catch (Exception e) {
            throw new RuntimeException("Failed to set field " + fieldName, e);
        }
    }

    private java.lang.reflect.Field findField(Class<?> clazz, String name) {
        Class<?> current = clazz;
        while (current != null) {
            try { return current.getDeclaredField(name); }
            catch (NoSuchFieldException ignored) { current = current.getSuperclass(); }
        }
        throw new RuntimeException("Field not found: " + name);
    }
}
