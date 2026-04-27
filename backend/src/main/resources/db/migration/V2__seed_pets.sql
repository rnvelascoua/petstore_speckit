-- ============================================================
-- Seed data: 20 pets across all four categories (5 per category)
-- ============================================================

-- DOGS
INSERT INTO pets (id, name, category, breed, age_months, description, price, available) VALUES
  ('a0000001-0000-0000-0000-000000000001','Buddy','DOG','Golden Retriever',18,'Friendly and energetic Golden Retriever who loves to play fetch and cuddle with the family.',850.00,true),
  ('a0000001-0000-0000-0000-000000000002','Max','DOG','German Shepherd',24,'Loyal and intelligent German Shepherd, excellent with families and great as a watch dog.',950.00,true),
  ('a0000001-0000-0000-0000-000000000003','Charlie','DOG','Beagle',8,'Curious Beagle puppy with a great nose for adventure. Playful and good with children.',550.00,true),
  ('a0000001-0000-0000-0000-000000000004','Rocky','DOG','French Bulldog',14,'Compact and charming French Bulldog. Very low maintenance and perfect for apartment living.',1200.00,true),
  ('a0000001-0000-0000-0000-000000000005','Bella','DOG','Labrador Retriever',36,'Gentle Labrador Retriever, well trained and great with kids and other pets.',750.00,false);

-- CATS
INSERT INTO pets (id, name, category, breed, age_months, description, price, available) VALUES
  ('a0000002-0000-0000-0000-000000000001','Luna','CAT','Siamese',12,'Elegant Siamese with striking blue eyes. Very vocal and loves attention.',400.00,true),
  ('a0000002-0000-0000-0000-000000000002','Mochi','CAT','Persian',6,'Fluffy Persian kitten with a calm temperament. Perfect indoor companion.',500.00,false),
  ('a0000002-0000-0000-0000-000000000003','Nala','CAT','Maine Coon',10,'Majestic Maine Coon with a silky coat. Friendly, curious and dog-like in personality.',650.00,true),
  ('a0000002-0000-0000-0000-000000000004','Oliver','CAT','British Shorthair',18,'Round-faced British Shorthair. Independent, calm and very easy to care for.',480.00,true),
  ('a0000002-0000-0000-0000-000000000005','Cleo','CAT','Sphynx',9,'Hairless Sphynx cat — warm, affectionate and endlessly entertaining.',700.00,true);

-- BIRDS
INSERT INTO pets (id, name, category, breed, age_months, description, price, available) VALUES
  ('a0000003-0000-0000-0000-000000000001','Kiwi','BIRD','Budgerigar',3,'Cheerful budgie already starting to mimic words. Easy to tame and great for beginners.',80.00,true),
  ('a0000003-0000-0000-0000-000000000002','Rio','BIRD','African Grey Parrot',14,'Highly intelligent African Grey with an impressive vocabulary. Requires daily interaction.',1200.00,true),
  ('a0000003-0000-0000-0000-000000000003','Sunny','BIRD','Cockatiel',5,'Sweet Cockatiel with a yellow crest. Loves to whistle and sit on shoulders.',120.00,true),
  ('a0000003-0000-0000-0000-000000000004','Pepper','BIRD','Lovebird',7,'Vibrant Lovebird pair. Playful, social and full of personality. Sold as a pair.',180.00,false),
  ('a0000003-0000-0000-0000-000000000005','Echo','BIRD','Blue-and-Gold Macaw',30,'Stunning Macaw with brilliant plumage. Experienced owner required.',2500.00,true);

-- FISH
INSERT INTO pets (id, name, category, breed, age_months, description, price, available) VALUES
  ('a0000004-0000-0000-0000-000000000001','Nemo','FISH','Clownfish',2,'Vibrant Clownfish with classic orange and white markings. Great for reef tanks.',25.00,true),
  ('a0000004-0000-0000-0000-000000000002','Ariel','FISH','Betta',1,'Stunning Betta with flowing iridescent fins. Keep in its own tank.',15.00,true),
  ('a0000004-0000-0000-0000-000000000003','Bubbles','FISH','Goldfish',4,'Classic fancy Goldfish with twin tail. Very hardy and ideal for beginners.',10.00,true),
  ('a0000004-0000-0000-0000-000000000004','Dory','FISH','Blue Tang',6,'Vivid Blue Tang — requires a large reef aquarium and experienced care.',95.00,true),
  ('a0000004-0000-0000-0000-000000000005','Flash','FISH','Discus',8,'Show-quality Discus fish with brilliant red and blue pattern. For advanced hobbyists.',150.00,false);

-- PRIMARY PHOTOS (one per pet using placehold.co)
INSERT INTO pet_photos (pet_id, url, is_primary, sort_order) VALUES
  ('a0000001-0000-0000-0000-000000000001','https://placehold.co/400x300/f5a623/ffffff?text=Buddy',true,0),
  ('a0000001-0000-0000-0000-000000000002','https://placehold.co/400x300/8b5e3c/ffffff?text=Max',true,0),
  ('a0000001-0000-0000-0000-000000000003','https://placehold.co/400x300/c8a26b/ffffff?text=Charlie',true,0),
  ('a0000001-0000-0000-0000-000000000004','https://placehold.co/400x300/aaaaaa/ffffff?text=Rocky',true,0),
  ('a0000001-0000-0000-0000-000000000005','https://placehold.co/400x300/f5d08a/ffffff?text=Bella',true,0),
  ('a0000002-0000-0000-0000-000000000001','https://placehold.co/400x300/87ceeb/ffffff?text=Luna',true,0),
  ('a0000002-0000-0000-0000-000000000002','https://placehold.co/400x300/d4a0d4/ffffff?text=Mochi',true,0),
  ('a0000002-0000-0000-0000-000000000003','https://placehold.co/400x300/8fbc8f/ffffff?text=Nala',true,0),
  ('a0000002-0000-0000-0000-000000000004','https://placehold.co/400x300/708090/ffffff?text=Oliver',true,0),
  ('a0000002-0000-0000-0000-000000000005','https://placehold.co/400x300/e8d5b7/333333?text=Cleo',true,0),
  ('a0000003-0000-0000-0000-000000000001','https://placehold.co/400x300/98fb98/333333?text=Kiwi',true,0),
  ('a0000003-0000-0000-0000-000000000002','https://placehold.co/400x300/808080/ffffff?text=Rio',true,0),
  ('a0000003-0000-0000-0000-000000000003','https://placehold.co/400x300/ffd700/333333?text=Sunny',true,0),
  ('a0000003-0000-0000-0000-000000000004','https://placehold.co/400x300/ff6347/ffffff?text=Pepper',true,0),
  ('a0000003-0000-0000-0000-000000000005','https://placehold.co/400x300/4169e1/ffffff?text=Echo',true,0),
  ('a0000004-0000-0000-0000-000000000001','https://placehold.co/400x300/ff8c00/ffffff?text=Nemo',true,0),
  ('a0000004-0000-0000-0000-000000000002','https://placehold.co/400x300/dc143c/ffffff?text=Ariel',true,0),
  ('a0000004-0000-0000-0000-000000000003','https://placehold.co/400x300/ffd700/333333?text=Bubbles',true,0),
  ('a0000004-0000-0000-0000-000000000004','https://placehold.co/400x300/00bfff/ffffff?text=Dory',true,0),
  ('a0000004-0000-0000-0000-000000000005','https://placehold.co/400x300/ff4500/ffffff?text=Flash',true,0);
