import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "../../styles/webVersion.module.css";
import Rating from "@mui/material/Rating";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper";
export default function App() {
  const [value, setValue] = React.useState(1);
  return (
    <div className="profileSlider-ButonContainer">
      <Swiper
        className={`  ${styles.headSwiperContainer} ${styles.SwiperContainer} pros-say-slider-container greenCardDot`}
        spaceBetween={20}
        pagination={{ clickable: true }}
        navigation={true}
        breakpoints={{
          280: { slidesPerView: 1, spaceBetween: 20 },
          340: { slidesPerView: 1, spaceBetween: 10 },
          600: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 40 },
          1024: { slidesPerView: 3, spaceBetween: 20 },
        }}
        modules={[Pagination, Navigation, Mousewheel, Keyboard]}
      >
        <div className={` ${styles.swiperWrapper} swiper-wrapper`}>
          <SwiperSlide>
            <div className={styles.SliderHeight}>
              <div style={{ marginTop: "30px" }}>
                <img src={"/Images/imageSlider.png"} className={`${styles.ProfileSliderImage} mt-1`} />
                <div className={styles.ProfileSliderHeading}>J. Nguyen</div>
              </div>
              <div className={styles.ProfileSliderText}>
                Als spezialisierte Masseurin für Schwangere habe ich mich bei Zoulu angemeldet, um meine Dienstleistungen mobil anzubieten. Seitdem ich Teil von Zoulu bin, habe ich eine Vielzahl von
                neuen Kunden gewonnen und konnte meine Dienstleistungen flexibler anbieten. Besonders für schwangere Frauen ist die Möglichkeit, eine Massage in ihrem eigenen Zuhause zu erhalten, sehr
                vorteilhaft und angenehm. Ich empfehle Zoulu jedem Therapeuten, der nach neuen Möglichkeiten sucht, sein Einkommen zu erhöhen und seine Arbeit flexibler zu gestalten
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={styles.SliderHeight}>
              <div style={{ marginTop: "30px" }}>
                <img src={"/Images/learn1.png"} className={`${styles.ProfileSliderImage} mt-1`} />
                <div className={styles.ProfileSliderHeading}>L. Schmitt</div>
              </div>
              <div className={styles.ProfileSliderText}>
                Mit dem Ziel, meine Dienstleistungen mobil anzubieten, habe ich mich als Nageldesignerin bei Zoulu registriert. Seitdem ich Teil dieser Plattform bin, konnte ich meine Kundenbasis
                erweitern und meine Arbeit flexibler gestalten. Es ist großartig zu sehen, wie zufrieden meine Kunden sind, wenn sie meine Arbeit in ihrer eigenen Komfortzone genießen können. Ich
                würde Zoulu jedem Nageldesigner empfehlen, der seine Reichweite erhöhen und seine Arbeit flexibler gestalten möchte.
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={styles.SliderHeight}>
              <div style={{ marginTop: "30px" }}>
                <img src={"/Images/cardservices1.png"} className={`${styles.ProfileSliderImage} mt-1`} />
                <div className={styles.ProfileSliderHeading}>E. Madien</div>
              </div>
              <div className={styles.ProfileSliderText}>
                Wirkt sich auf den Return on Investment des Kundeninteraktionsdesigns aus. Rockstar Equity Interaction Design Alpha First Mover Vorteil Social Proof Accelerator Assets.
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={styles.SliderHeight}>
              <div style={{ marginTop: "30px" }}>
                <img src={"/Images/imageSlider1.png"} className={`${styles.ProfileSliderImage} mt-1`} />
                <div className={styles.ProfileSliderHeading}>R. samith</div>
              </div>
              <div className={styles.ProfileSliderText}>
                Wirkt sich auf den Return on Investment des Kundeninteraktionsdesigns aus. Rockstar Equity Interaction Design Alpha First Mover Vorteil Social Proof Accelerator Assets.
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={styles.SliderHeight}>
              <div style={{ marginTop: "30px" }}>
                <img src={"/Images/imageSlider2.png"} className={`${styles.ProfileSliderImage} mt-1`} />
                <div className={styles.ProfileSliderHeading}>M. Maria</div>
              </div>
              <div className={styles.ProfileSliderText}>
                Durch Zoulu kann ich als Kosmetikerin meine Dienstleistungen nun flexibler anbieten und meine Arbeitszeiten selbst bestimmen. Ich habe viele zufriedene Kunden durch die Plattform
                gewonnen und würde jederzeit wieder mit Zoulu arbeiten.
              </div>
            </div>
          </SwiperSlide>
        </div>
      </Swiper>
    </div>
  );
}
