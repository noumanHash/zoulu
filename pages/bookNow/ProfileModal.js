import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import styles from "../../styles/profile.module.css";
import serviceStyles from "../../styles/treatment.module.css";
import Rating from "@mui/material/Rating";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { LinearProgress } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import useMediaQuery from "@mui/material/useMediaQuery";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper";
import { useRouter } from "next/router";
import { Api } from "../../utils/Api";
import { Col, Row } from "reactstrap";
import moment from "moment";
import Loader from "../../Components/Loader";
function ProfileModal(props) {
  const { data, rating } = props;
  const matches = useMediaQuery("(min-width:700px)");
  const col_sm = useMediaQuery("(min-width:450px)");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleClose = () => props.setShow(false);
  const [value, setValue] = React.useState(4);
  const [profile, setProfile] = React.useState();
  const [reviews, setReviews] = useState([]);
  const [confirmed, setConfirmed] = useState([]);
  const [tab, setTab] = React.useState(0);
  const Slider = () => {
    return (
      <>
        <Swiper
          className={`${styles.swiperMainContainer} profileViewSliderContainer`}
          cssMode={true}
          navigation={true}
          pagination={true}
          mousewheel={true}
          keyboard={true}
          slidesPerView={col_sm ? 2 : 2}
          modules={[Navigation, Pagination, Mousewheel, Keyboard]}
          spaceBetween={2}
        >
          {[1, 2, 3, 4].map((e, index) => (
            <SwiperSlide key={index} style={{ paddingBottom: "10px", paddingTop: "30px" }}>
              {SliderCard()}
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    );
  };
  const SliderCard = () => {
    return (
      <div className={styles.sliderCardContainer}>
        <div className={styles.sliderHeader}>
          <div>
            <img src={"/Images/profile.png"} className={styles.sliderCardImg} />
            <span className={styles.sliderClientName}>M. Dar</span>
          </div>
          <div>
            <img src={"/Images/googleIcon.png"} className={styles.sliderCardImg} />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 6,
            alignItems: "center",
            marginTop: 7,
          }}
        >
          <Rating size="small" style={{ color: "#30D5C8" }} name="simple-controlled" value={value} readOnly />
          <MdOutlineVerifiedUser className={styles.SliderVerifiedIcon} />
          <span className={styles.SliderVerifiedText}> Verified Review</span>
        </div>
        <span className={styles.SliderVerifiedDate}>Aug 5, 2022</span>
        <div>
          <div className={styles.sliderContentContainer}>
            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout of using Lorem Ipsum.
          </div>
        </div>
      </div>
    );
  };
  const getRating = async () => {
    setLoading(true);
    const response = await Api("get", `api/expert/booking/${data}?type="past"&page=1&limit=10`);
    if (response.status === 200) {
      setReviews(response?.data?.data);
      setConfirmed(response?.data?.confirmedBookings);
      setLoading(false);
    } else {
    }
  };
  const getProfile = async () => {
    setLoading(true);

    const response = await Api("get", `api/profile/${data}`);
    if (response.status === 200) {
      setProfile(response?.data?.data);
      setLoading(false);
    } else {
    }
  };
  useEffect(() => {
    if (data) {
      getRating();
      getProfile();
    }
  }, [data]);
  const progressHandler = (text) => {
    var rating = 0;
    var length = 0;
    reviews?.map((item) => {
      item?.products?.map((product, key) => {
        if (product?.status === "confirmed") {
          length = length + 1;

          if (Math.round(product?.rating) == text) {
            rating = rating + 1;
          }
        }
      });
    });
    return (rating / length) * 100;
  };
  const Progress = [
    { text: "5", value: "100" },
    { text: "4", value: "70" },
    { text: "3", value: "50" },
    { text: "2", value: "30" },
    { text: "1", value: "15" },
  ];
  const ratingHandler = () => {
    var rating = 0;
    var length = 0;
    var avrgRating;
    reviews?.map((item, index) => {
      item?.products?.map((product, key) => {
        if (product?.status === "confirmed") {
          length = length + 1;
          rating = rating + product?.rating;
        }
      });
    });
    avrgRating = rating / length;

    return avrgRating || 0;
  };
  const ReviewsPerson = () => {
    var rating = 0;
    var length = 0;
    var avrgRating;
    reviews?.map((item, index) => {
      item?.products?.map((product, key) => {
        if (product?.status === "confirmed") {
          length = length + 1;
          rating = rating + product?.rating;
        }
      });
    });
    avrgRating = rating / length;

    return length || 0;
  };
  const dotColor = ["#30D5C8", "#F96E01", "#DCD6CD"];
  console.log(profile, "profile");
  return (
    <Modal show={props.show} onHide={handleClose} animation={false} size="lg">
      {loading ? <Loader /> : null}
      <Modal.Header closeButton className={`${styles.ProfileModalHead}`}></Modal.Header>
      <Modal.Body style={{ padding: 0 }}>
        <div className={styles.mainContainer}>
          <div className={` ${styles.ShadDiv} container m-0 p-0`}>
            <div className="d-flex" style={{ marginLeft: "20px" }}>
              <div
              // style={{ marginLeft: "10px" }}
              >
                <img src={profile?.image ? profile?.image : "/Images/avatarIcon.png"} className={styles.ProfileImage} />
              </div>
              <div>
                <h4 className={`${styles.ClientName} mb-4 ml-3 text-capitalize`}>{profile?.name}</h4>
                <div className={styles.Tabcontainer}>
                  {["Über", "Behandlungen", "Rezension", "Portefeuille"].map((e, i) => (
                    <div key={e} className={i === tab ? ` ${styles.BorderTab} ${styles.activeTab}` : `${styles.BorderTab}`} onClick={() => setTab(i)}>
                      {e}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {tab === 0 && (
            <div className="row" style={{ marginLeft: "30px", marginTop: "20px" }}>
              <div className={`${styles.TabOne} row`}>
                <div className="col-5">
                  <span className={styles.ReviewText}>Kundenbewertungen</span>
                  <h4 className={styles.PointText}>{rating || 0}</h4>
                  {Number.isInteger(rating) ? (
                    <Rating style={{ color: "#027CFF" }} name="simple-controlled" value={rating} readOnly />
                  ) : (
                    <Rating style={{ color: "#027CFF" }} name="simple-controlled" defaultValue={rating} precision={0.5} readOnly />
                  )}
                  <br />
                  <span className={styles.BasedText}>Basierend auf {ReviewsPerson()} Bewertungen</span>
                </div>
                <div className="col-7">
                  <ErrorOutlineIcon className={styles.ErrorIcon} />
                  <div className={`${styles.ProgressContainer} `}>
                    {Progress.map((item, index) => (
                      <div className="row mt-2" key={index}>
                        <div className="col-lg-1">
                          <span className={styles.ProgresNumber}>{item.text}</span>
                        </div>
                        <div className="col-lg-8 ">
                          <LinearProgress className={`${styles.LineStyle}`} variant="determinate" value={reviews?.length > 0 ? progressHandler(item.text) : 0} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.ButtonsContainerLeft}>
                <div className="mt-2">
                  <CalendarMonthIcon className={styles.CalenderIcon} />
                  <span className={styles.ProfileRatingText}>
                    {" "}
                    <b>{confirmed} </b>Buchungen abgeschlossen
                  </span>
                </div>
                {/* <div className="mt-2">
                  <RestoreIcon className={styles.CalenderIcon} />
                  <span className={styles.ProfileRatingText}>{data?.questions?.find((e) => e?.question === "Berufserfahrung")?.answer + " Experience"}</span>
                </div> */}
              </div>
            </div>
          )}
          {tab === 1 && (
            <Row style={{ marginLeft: "30px", marginTop: "15px" }}>
              {profile?.profile[0]?.treatments?.map((data, index) => {
                if (data?.approved == true) {
                  return (
                    <>
                      <span className={`${serviceStyles.TreatmentHeading} text-capitalize`} key={index}>
                        {data?.category_id?.name}
                      </span>
                      {data?.category_id?.services?.map((service, i) => (
                        <Col sm={6} md={6} lg={4} className="mb-2">
                          <div className={serviceStyles.Display} key={i}>
                            <div className={serviceStyles.AllDotsContainer}>
                              <div
                                key={i}
                                style={{
                                  backgroundColor: dotColor[i % dotColor.length],
                                }}
                                className={serviceStyles.TreatmentDotColor}
                              ></div>
                            </div>
                            <span className={`${serviceStyles.TreatmentText} text-capitalize`}>{service?.name}</span>
                          </div>
                        </Col>
                      ))}
                    </>
                  );
                }
              })}
            </Row>
          )}
          {tab === 2 && (
            <div>
              {!matches ? (
                Slider()
              ) : (
                <div className="mt-5">
                  {reviews?.map((item) =>
                    item?.products
                      ?.filter((e) => e?.status === "confirmed")
                      ?.map((ele, index) => (
                        <div className={`${styles.SecondDiv} row`} key={index}>
                          {console.log(item)}
                          <div className="col-lg-12" style={{ marginLeft: "40px", marginTop: "20px" }}>
                            <img src={item?._doc?.user_id?.image ? item?._doc?.user_id?.image : "/Images/avatarIcon.png"} className={styles.SecondProfileImage} />
                            <span className={styles.SecondDivName}>{item?._doc.user_id?.name}</span>
                            <br />
                            <Rating style={{ color: "#027CFF", marginTop: "20px" }} name="simple-controlled" value={ele?.rating} readOnly />
                          </div>
                          <span className={styles.VerifiedDate}>{moment(ele?.data).format("lll")}</span>
                          <span className={styles.VerifiedPeragraph}>{ele?.reviews || "No Comment"}</span>
                          <div className="col-lg-9 mt-5" style={{ paddingLeft: "52px" }}>
                            <div className={styles.Linediv}></div>
                          </div>
                        </div>
                      ))
                  )}
                  {/* <ZouluButton
                    style={{ marginLeft: "40px" }}
                    className={`${styles.ProfileWhiteButtonLast} mb-4`}
                    title="See all reviews"
                  /> */}
                </div>
              )}
            </div>
          )}
          {tab === 3 && (
            <Row style={{ marginLeft: "20px", marginTop: "15px", marginRight: "20px" }}>
              {profile?.profile[0]?.portfolio?.map((data, index) => {
                return (
                  <>
                    <Col sm={6} md={6} lg={4} className="mb-2">
                      <div className={serviceStyles.Display} key={index}>
                        <object
                          data={data?.filename}
                          onClick={() => window.open(data?.filename, "_blank")}
                          width="100%"
                          height="190px"
                          style={{
                            borderTopLeftRadius: "9px",
                            borderTopRightRadius: "9px",
                          }}
                        ></object>
                      </div>
                    </Col>
                  </>
                );
              })}
            </Row>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer style={{ border: "none" }}></Modal.Footer>
    </Modal>
  );
}
export default ProfileModal;
