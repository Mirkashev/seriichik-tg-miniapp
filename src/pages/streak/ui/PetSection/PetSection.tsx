import { useState } from "react";
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
import { postEvent } from "@tma.js/sdk-react";

interface PetSectionProps {
  petName: string;
  petLevel: number;
  progressValue: number;
  progressMax: number;
  remainingPoints: number;
}

const allPetImages = [petLevel1, petLevel2, petLevel3, petLevel4, petLevel5];
const noPetImages = [noPetLevel2, noPetLevel3, noPetLevel4, noPetLevel5];
// TODO: в будущем добавить транзишн для header цвета
const tgHeaderColors = ["ffd179", "fea386", "ff8efa", "6873ff", "99fff2"];
const progressColors = ["#fb8a0e", "#F15C1E", "#D841A5", "#358BED", "#15B0E9"];

const getPetImages = (level: number): string[] => {
  const images: string[] = [];

  for (let i = 0; i < 5; i++) {
    if (i < level) {
      images.push(allPetImages[i]);
    } else {
      images.push(noPetImages[i - 1]);
    }
  }

  return images;
};

export const PetSection = ({
  petName,
  petLevel,
  progressValue,
  progressMax,
  remainingPoints,
}: PetSectionProps) => {
  const petImages = getPetImages(petLevel);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [totalSlides, setTotalSlides] = useState(petImages.length);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: petLevel - 1,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
      postEvent("web_app_set_background_color", {
        color: `#f8f8f8`,
      });
      postEvent("web_app_set_header_color", {
        color: `#${tgHeaderColors[slider.track.details.rel]}`,
      });
      document.body.style.background = `linear-gradient(180deg, #${tgHeaderColors[slider.track.details.rel]} 0%, #f8f8f8 100%)`;
    },
    created(slider) {
      setLoaded(true);
      setTotalSlides(slider.track.details.slides.length);
    },
  });

  return (
    <div className={styles.petSection}>
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
              className={`${styles.arrow} ${styles.arrowLeft} ${
                currentSlide === 0 ? styles.arrowDisabled : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                instanceRef.current?.prev();
              }}
              disabled={currentSlide === 0}
              aria-label="Previous pet"
            >
              <ChevronRightIcon width={24} height={24} />
            </button>
            <button
              className={`${styles.arrow} ${styles.arrowRight} ${
                currentSlide === totalSlides - 1 ? styles.arrowDisabled : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                instanceRef.current?.next();
              }}
              disabled={currentSlide === totalSlides - 1}
              aria-label="Next pet"
            >
              <ChevronRightIcon width={24} height={24} />
            </button>
          </>
        )}
      </div>
      <div className={styles.petNameContainer}>
        <Typography
          variant="textXlBold"
          className={styles.petName}
          as="span"
        >
          {petName}
        </Typography>
        <PencilIcon width={20} height={20} />
      </div>
      <div className={styles.progressSection}>
        <ProgressBar
          value={progressValue}
          max={progressMax}
          showLabel
          labelPosition="inside"
          color={progressColors[currentSlide]}
          striped
        />
        <Typography variant="textSm" className={styles.progressDescription}>
          {remainingPoints} очков до нового облика
        </Typography>
      </div>
    </div>
  );
};
