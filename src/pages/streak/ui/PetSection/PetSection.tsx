import { useEffect, useRef, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Typography } from "@/shared/ui/Typography";
import { ProgressBar } from "@/shared/ui/ProgressBar";
import styles from "./PetSection.module.scss";
import PencilIcon from "@/assets/icons/pencil.svg?svgr";
import ChevronRightIcon from "@/assets/icons/chevron-right.svg?svgr";
import petLevel1 from "@/assets/images/pets/1.png";
import petLevel2 from "@/assets/images/pets/2.png";
import petLevel3 from "@/assets/images/pets/3.png";
import petLevel4 from "@/assets/images/pets/4.png";
import petLevel5 from "@/assets/images/pets/5.png";

import noPetLevel2 from "@/assets/images/pets/no-2.png";
import noPetLevel3 from "@/assets/images/pets/no-3.png";
import noPetLevel4 from "@/assets/images/pets/no-4.png";
import noPetLevel5 from "@/assets/images/pets/no-5.png";

import sadPetLevel1 from "@/assets/images/pets/sad-1.png";
import sadPetLevel2 from "@/assets/images/pets/sad-2.png";
import sadPetLevel3 from "@/assets/images/pets/sad-3.png";
import sadPetLevel4 from "@/assets/images/pets/sad-4.png";
import sadPetLevel5 from "@/assets/images/pets/sad-5.png";

import { postEvent } from "@tma.js/sdk-react";
import { Modal } from "@/shared/ui/Modal";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { useChangePetName, type Pet } from "@/entities/pet";
import { toast } from "sonner";
import { accentColors, linearGradientAccentColors } from "@/shared/consts";
import { getTodayStart } from "@/shared/utils/helpers/getTodayStart";

interface PetSectionProps {
  pet: Pet;
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
}

const allPetImages = [petLevel1, petLevel2, petLevel3, petLevel4, petLevel5];
const noPetImages = [noPetLevel2, noPetLevel3, noPetLevel4, noPetLevel5];
const sadPetLevelImages = [
  sadPetLevel1,
  sadPetLevel2,
  sadPetLevel3,
  sadPetLevel4,
  sadPetLevel5,
];

// TODO: в будущем добавить транзишн для header цвета
const getPetImages = (level: number, stateSad: boolean): string[] => {
  const images: string[] = [];

  for (let i = 0; i < 5; i++) {
    if (i < level) {
      images.push(stateSad ? sadPetLevelImages[i] : allPetImages[i]);
    } else {
      images.push(noPetImages[i - 1]);
    }
  }

  return images;
};

export const PetSection = ({
  pet,
  currentSlide,
  setCurrentSlide,
}: PetSectionProps) => {
  const {
    chatId,
    level,
    name,
    // streakCount,
    streakLastIncrementAt,
    // streakRestoreCount,
    fromUser,
    exp,
    expForNextLevel,
  } = pet;
  const progressValue = exp;

  const remainingPoints = expForNextLevel - exp;
  const petLevel = level;
  const petName = name;
  const petTimeZone = fromUser.timeZone;

  const todayStart = getTodayStart(petTimeZone);
  const stateSad = todayStart.getTime() > streakLastIncrementAt.getTime();

  const petImages = getPetImages(petLevel, stateSad);

  const inputRef = useRef<HTMLInputElement>(null);



  const [isChangeNameModalOpen, setIsChangeNameModalOpen] = useState(false);
  const [newPetName, setNewPetName] = useState(petName);

  const { mutateAsync: updatePetName, isPending: isUpdatingPetName } =
    useChangePetName();

  const handleUpdatePetName = () => {
    if (newPetName.length > 20) {
      return toast.error("Имя должно быть не более 20 символов");
    }

    updatePetName({
      chatId: chatId,
      name: newPetName,
    }).then(() => {
      setIsChangeNameModalOpen(false);
    });
  };

  const [loaded, setLoaded] = useState(false);
  const [totalSlides, setTotalSlides] = useState(petImages.length);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: petLevel - 1,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
      try {
        postEvent("web_app_set_background_color", {
          color: `#f8f8f8`,
        });
        postEvent("web_app_set_header_color", {
          color: `#${stateSad ? "C9C6D9" : linearGradientAccentColors[slider.track.details.rel]}`,
        });
      } catch (error: unknown) {
        console.warn("Failed to set background color:", error);
      }
      document.body.style.background = `linear-gradient(180deg, #${stateSad ? "C9C6D9" : linearGradientAccentColors[slider.track.details.rel]} 0%, #f8f8f8 100%)`;
    },
    created(slider) {
      setLoaded(true);
      setTotalSlides(slider.track.details.slides.length);
    },
  });

  useEffect(() => {
    const inputRefVar = inputRef?.current;

    if (isChangeNameModalOpen && inputRefVar) {
      inputRefVar?.focus();
    }

    return () => {
      if (inputRefVar) {
        inputRefVar?.blur();
      }
    };
  }, [isChangeNameModalOpen]);

  return (
    <div className={styles.petSection}>
      <Modal
        isOpen={isChangeNameModalOpen}
        onClose={() => setIsChangeNameModalOpen(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={styles.changeNameModalContent}
        >
          <Typography className={styles.modalTitle} variant="textLgSemibold">
            Смена имени
          </Typography>
          <Input
            ref={inputRef}
            className={styles.modalInput}
            placeholder="Введите новое имя"
            maxLength={20}
            value={newPetName}
            onChange={(e) => setNewPetName(e.target.value)}
          />
          <Typography variant="textSm" className={styles.letterCount}>
            {newPetName.length}/20
          </Typography>
          <Button onClick={handleUpdatePetName} disabled={isUpdatingPetName}>
            Сохранить
          </Button>
        </div>
      </Modal>
      <div className={styles.petImageContainer}>
        <div ref={sliderRef} className={`keen-slider ${styles.slider}`}>
          {petImages.map((image, index) => (
            <div key={index} className={`keen-slider__slide ${styles.slide}`}>
              <img
                src={image}
                alt={`Pet level ${index + 1}`}
                className={styles.petImage}
              />
            </div>
          ))}
        </div>
        {loaded && (
          <>
            <button
              className={`${styles.arrow} ${styles.arrowLeft} ${currentSlide === 0 ? styles.arrowDisabled : ""
                }`}
              onClick={(e) => {
                e.stopPropagation();
                instanceRef.current?.prev();
              }}
              style={{
                opacity: currentSlide === 0 ? 0 : 1,
              }}
              disabled={currentSlide === 0}
              aria-label="Previous pet"
            >
              <ChevronRightIcon width={24} height={24} />
            </button>
            <button
              className={`${styles.arrow} ${styles.arrowRight} ${currentSlide === totalSlides - 1 ? styles.arrowDisabled : ""
                }`}
              onClick={(e) => {
                e.stopPropagation();
                instanceRef.current?.next();
              }}
              style={{
                opacity: currentSlide === totalSlides - 1 ? 0 : 1,
              }}
              disabled={currentSlide === totalSlides - 1}
              aria-label="Next pet"
            >
              <ChevronRightIcon width={24} height={24} />
            </button>
          </>
        )}
      </div>
      <button onClick={() => setIsChangeNameModalOpen(true)} className={styles.petNameContainer}>
        <Typography
          variant="textLgSemibold"
          className={styles.petName}
          as="span"
        >
          {petName}
        </Typography>
        <PencilIcon width={20} height={20} />
      </button>
      <div className={styles.progressSection}>
        <ProgressBar
          value={progressValue}
          max={expForNextLevel}
          showLabel
          labelPosition="inside"
          color={stateSad ? "#C9C6D9" : accentColors[currentSlide]}
          striped
        />
        <Typography variant="textXs" className={styles.progressDescription}>
          {remainingPoints} очков до нового облика
        </Typography>
      </div>
    </div>
  );
};
