import React, { useEffect, useState } from "react";
import SwiperCore, { Virtual, Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "../../styles/treatment.module.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import ProfileModal from "../bookNow/ProfileModal";
import { Rating } from "@mui/material";
import { AiTwotoneStar } from "react-icons/ai";
SwiperCore.use([Virtual, Navigation, Pagination]);
const ProfileSlider = (props) => {
  const { cart } = props;
  const [value, setValue] = useState(props?.data);
  const [expertID, setExpertID] = useState();
  const [expert, setExpert] = useState(null);
  const [swiperRef, setSwiperRef] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [rating, setRating] = useState(null);
  const handlerValues = (e, charges) => {
    setExpertID(e?.user_id?._id);
    props?.setBookingExpert(e, charges);
  };
  useEffect(() => {
    if (value?.selectedDate && value?.selectedTime) {
      var day = value?.selectedDate?.day;
      var date = value?.selectedDate?.date;
      var time = value?.selectedTime?.hour;
      var serviceId = value?.serviceId?._id;
      var duration = value?.duration;
      getbooking(day, date, time, duration, serviceId);
    }
  }, [cart]);
  const getExpertPriceAgainstService = (expert_services, obj) => {
    const findService = expert_services?.find((e) => e?.services?.service_id === obj?.service_id?._id);
    console.log(findService?.services);
    let sum = 0;
    if (findService?.services !== undefined) {
      for (const pkg of findService?.services?.packages) {
        console.log(pkg);
        for (const cartPkg of obj?.packages) {
          console.log(cartPkg);
          if (pkg?.package_id === cartPkg?.package_id?._id) {
            sum = sum + pkg?.price;
          }
        }
      }
      var mandatoryPackage = obj?.service_id?.options.find((data, index) => {
        if (data?.mandatory) {
          return data;
        }
      });
      var servicePrice;
      if (mandatoryPackage) {
        servicePrice = 0;
      } else {
        servicePrice = findService?.services?.price;
      }
    }
    return Number(sum + servicePrice);
  };
  return (
    <>
      <Swiper
        className={`${styles.swiper} relclass`}
        onSwiper={setSwiperRef}
        slidesPerView={6}
        spaceBetween={10}
        navigation={true}
        breakpoints={{
          200: { slidesPerView: 2, spaceBetween: 10 },
          300: { slidesPerView: 2, spaceBetween: 10 },
          400: { slidesPerView: 3, spaceBetween: 15 },
          500: { slidesPerView: 4, spaceBetween: 10 },
          630: { slidesPerView: 5, spaceBetween: 10 },
          768: { slidesPerView: 6, spaceBetween: 10 },
          1024: { slidesPerView: 6, spaceBetween: 10 },
          1124: { slidesPerView: 6, spaceBetween: 10 },
        }}
      >
        {cart?.expertProfile ? (
          cart?.expertProfile?.map((expert, index) => {
            return (
              <SwiperSlide
                style={cart.expert_id === expert?.user_id?._id || cart.expert_id?.id === expert?.user_id?._id ? { border: "2px solid #3a7ae4", cursor: "pointer" } : { cursor: "pointer" }}
                key={index}
                virtualIndex={index}
                className={styles.SwiperSliderProfile}
                onClick={() => {
                  handlerValues(expert, getExpertPriceAgainstService(expert?.expert_services, cart));
                  // props.setCharges(getExpertPriceAgainstService(expert?.expert_services, cart));
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <img
                    src={expert?.user_id?.image ? expert?.user_id?.image : "/Images/avatarIcon.png"}
                    className={styles.ProfileImage}
                    onClick={() => {
                      setRating(expert?.rating || 0);
                      setExpert(expert?.user_id?._id);
                      setShowProfileModal(true);
                    }}
                  />
                  <div className="datesliderdate text-capitalize">{expert?.user_id.name?.slice(0, 15)}</div>
                  <div className="text-black f-flex align-items-center">
                    {expert?.rating?.toString().replace(".", ",") || 0}
                    <AiTwotoneStar style={{ marginLeft: 5, color: "#3a7ae4" }} />
                  </div>
                  <div className="datesliderdate text-capitalize">€ {getExpertPriceAgainstService(expert?.expert_services, cart) || 0}</div>
                </div>
              </SwiperSlide>
            );
          })
        ) : cart?.expert_idd ? (
          <>
            <SwiperSlide style={cart?.expert_id === cart?.expert_id ? { border: "2px solid #3a7ae4", cursor: "pointer" } : { cursor: "pointer" }} className={styles.SwiperSliderProfile}>
              <div style={{ textAlign: "center" }}>
                <img
                  src={cart?.expert_id?.image ? cart?.expert_id?.image : "/Images/avatarIcon.png"}
                  className={styles.ProfileImage}
                  onClick={() => {
                    setRating(expert?.rating || 0);
                    setExpert(cart?.expert_id?._id);
                    setShowProfileModal(true);
                  }}
                />
                <div className="datesliderdate text-capitalize">{cart?.expert_id.name?.slice(0, 15)}</div>
              </div>
            </SwiperSlide>
          </>
        ) : null}
      </Swiper>
      {expert && <ProfileModal show={showProfileModal} setShow={(e) => setShowProfileModal(e)} data={expert} rating={rating} />}
    </>
  );
};
export default ProfileSlider;
