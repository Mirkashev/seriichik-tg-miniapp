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

interface PetSectionProps {
  petName: string;
  petImageUrl: string;
  progressValue: number;
  progressMax: number;
  remainingPoints: number;
}

const petImages = [petLevel1, petLevel2, petLevel3, petLevel4, petLevel5];

export const PetSection = ({
  petName,
  petImageUrl,
  progressValue,
  progressMax,
  remainingPoints,
}: PetSectionProps) => {
  console.log(petImageUrl);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [totalSlides, setTotalSlides] = useState(petImages.length);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
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
          variant="titleFirstBold"
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
          color="#FB8A0E"
          striped
        />
        <Typography
          variant="captionFirst"
          className={styles.progressDescription}
        >
          {remainingPoints} очков до нового облика
        </Typography>
      </div>
    </div>
  );
};
