import petLevel1 from "@/assets/images/pets/1.png";
import petLevel2 from "@/assets/images/pets/2.png";
import petLevel3 from "@/assets/images/pets/3.png";
import petLevel4 from "@/assets/images/pets/4.png";
import petLevel5 from "@/assets/images/pets/5.png";

export const getPetImage = (level: number): string => {
  const petImages: Record<number, string> = {
    1: petLevel1,
    2: petLevel2,
    3: petLevel3,
    4: petLevel4,
    5: petLevel5,
  };

  // Если уровень больше 5, используем изображение уровня 5
  const imageLevel = Math.min(level, 5);
  // Если уровень меньше 1, используем изображение уровня 1
  const finalLevel = Math.max(imageLevel, 1);

  return petImages[finalLevel] || petLevel1;
};
