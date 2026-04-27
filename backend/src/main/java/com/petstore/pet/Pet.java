package com.petstore.pet;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "pets")
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Category category;

    @Column(nullable = false, length = 100)
    private String breed;

    @Column(name = "age_months", nullable = false)
    private int ageMonths;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private boolean available = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<PetPhoto> photos = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = OffsetDateTime.now();
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public Category getCategory() { return category; }
    public String getBreed() { return breed; }
    public int getAgeMonths() { return ageMonths; }
    public String getDescription() { return description; }
    public BigDecimal getPrice() { return price; }
    public boolean isAvailable() { return available; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public List<PetPhoto> getPhotos() { return photos; }

    public void setName(String name) { this.name = name; }
    public void setCategory(Category category) { this.category = category; }
    public void setBreed(String breed) { this.breed = breed; }
    public void setAgeMonths(int ageMonths) { this.ageMonths = ageMonths; }
    public void setDescription(String description) { this.description = description; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public void setAvailable(boolean available) { this.available = available; }
    public void setPhotos(List<PetPhoto> photos) { this.photos = photos; }
}
