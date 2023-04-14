import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import ZouluButton from "../../Common/ZouluButton/ZouluButton";
import styles from "../../../styles/ratingBooking.module.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { Api } from "../../../utils/Api";
function RatingModal(props) {
  const { data, setLoading } = props;
  const [reviews, setReviews] = useState("");
  const [rating, setRating] = useState(1);
  const handleClose = () => props.setShow(false);
  const addRating = async () => {
    if (!rating === 0) return toast.warning("Minimum 1 star is required to proceed the review");
    setLoading(true);
    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("reviews", reviews);
    const response = await Api("put", `api/customer/booking/rating/${data?.row?._doc?._id}?product_id=${data?.service?._id}`, formData);
    if (response.status === 200) {
      setLoading(false);
      toast.success(response.data.msg);
      handleClose();
      props.callback();
    } else {
      setLoading(false);
      toast.error(response.data.msg);
    }
  };
  return (
    <>
      <Modal centered show={props.show} onHide={handleClose} animation={false} size="lg" className={`${styles.AdressModalHeight}`}>
        <Modal.Header closeButton className={`${styles.ModalHead}  ${styles.AddressModallClass}`}>
          <Modal.Title className={styles.modalHeading}></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.reviewContainer}>
            <div className={styles.headingMessageType}>{data?.service?.service_id?.name}</div>
            <center>
              <img src={data?.service?.expert_id?.image || "/Images/avatarIcon.png"} className={`${styles.profileRatingMain} mt-4`} />
              <div className={`${styles.imageTitle} mt-3`}>{data?.service?.expert_id?.name}</div>
            </center>
            <div className={`${styles.youRateText} mt-4 pt-1`}>what is you rate?</div>
            <Stack spacing={2} className="stackRating-mainProfileModal mt-3" style={{ width: "170px" }}>
              <Rating name="size-medium" value={rating} precision={0.5} size="medium" onChange={(e, newvalue) => Math.round(setRating(newvalue))} />
            </Stack>
          </div>
          <div className={`${styles.paddingMainBox} mt-4 pt-2`}>
            <div className={`${styles.writereviewTitle}`}>write a review</div>
            <textarea
              placeholder="Type Something..."
              value={reviews}
              className={`${styles.commentBoxRating} mt-3`}
              maxLength={500}
              onChange={(e) => {
                if (reviews.length <= 500) {
                  setReviews(e.target.value);
                }
              }}
            ></textarea>
            <div className={`${styles.charactersRemaining} mt-2`}>{reviews?.length}/500 characters remaining</div>
          </div>
          <div className={`${styles.flexButnRatingModal}  mt-5 mb-4 pt-5`}>
            <div>
              <ZouluButton title="Submit Review" className={`${styles.SubmitButton}`} onClick={addRating} />
            </div>
            <div>
              <ZouluButton title="Not Now" className={`${styles.NotNowButton}`} onClick={handleClose} />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
export default RatingModal;
