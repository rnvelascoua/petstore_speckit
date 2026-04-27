package com.petstore.pet;

import com.petstore.pet.dto.CreatePetRequest;
import com.petstore.pet.dto.PetDetailDto;
import com.petstore.pet.dto.PetSummaryDto;
import com.petstore.pet.dto.PhotoDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class PetService {

    private final PetRepository petRepository;

    public PetService(PetRepository petRepository) {
        this.petRepository = petRepository;
    }

    public Page<PetSummaryDto> getAllPets(List<Category> categories, Pageable pageable) {
        Page<Pet> pets = (categories == null || categories.isEmpty())
                ? petRepository.findAll(pageable)
                : petRepository.findByCategoryIn(categories, pageable);
        return pets.map(this::toSummaryDto);
    }

    public PetDetailDto getPetById(UUID id) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new PetNotFoundException(id));
        return toDetailDto(pet);
    }

    @Transactional
    public PetDetailDto createPet(CreatePetRequest req) {
        Pet pet = new Pet();
        applyRequest(pet, req);
        return toDetailDto(petRepository.save(pet));
    }

    @Transactional
    public PetDetailDto updatePet(UUID id, CreatePetRequest req) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new PetNotFoundException(id));
        pet.getPhotos().clear();
        applyRequest(pet, req);
        return toDetailDto(petRepository.save(pet));
    }

    @Transactional
    public void deletePet(UUID id) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new PetNotFoundException(id));
        petRepository.delete(pet);
    }

    private void applyRequest(Pet pet, CreatePetRequest req) {
        pet.setName(req.name());
        pet.setCategory(req.category());
        pet.setBreed(req.breed());
        pet.setAgeMonths(req.ageMonths());
        pet.setDescription(req.description());
        pet.setPrice(req.price());
        pet.setAvailable(req.available());

        if (req.photos() != null) {
            List<PetPhoto> photos = new ArrayList<>();
            for (int i = 0; i < req.photos().size(); i++) {
                var pr = req.photos().get(i);
                PetPhoto photo = new PetPhoto();
                photo.setPet(pet);
                photo.setUrl(pr.url());
                photo.setIsPrimary(pr.isPrimary());
                photo.setSortOrder(i);
                photos.add(photo);
            }
            pet.getPhotos().addAll(photos);
        }
    }

    private PetSummaryDto toSummaryDto(Pet pet) {
        String primaryUrl = pet.getPhotos().stream()
                .filter(PetPhoto::isPrimary)
                .findFirst()
                .map(PetPhoto::getUrl)
                .orElse(null);
        return new PetSummaryDto(
                pet.getId(),
                pet.getName(),
                pet.getCategory().name(),
                pet.getBreed(),
                pet.getAgeMonths(),
                pet.getPrice(),
                pet.isAvailable(),
                primaryUrl
        );
    }

    private PetDetailDto toDetailDto(Pet pet) {
        String primaryUrl = pet.getPhotos().stream()
                .filter(PetPhoto::isPrimary)
                .findFirst()
                .map(PetPhoto::getUrl)
                .orElse(null);

        List<PhotoDto> photoDtos = pet.getPhotos().stream()
                .map(p -> new PhotoDto(p.getUrl(), p.isPrimary()))
                .toList();

        return new PetDetailDto(
                pet.getId(),
                pet.getName(),
                pet.getCategory().name(),
                pet.getBreed(),
                pet.getAgeMonths(),
                pet.getPrice(),
                pet.isAvailable(),
                primaryUrl,
                pet.getDescription(),
                photoDtos
        );
    }
}
