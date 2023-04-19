import React, { Fragment, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import CustomDeleteModal from "../../adminDashboard/Models/CustomDeleteModal";
import { Api } from "../../../utils/Api";
import RatingModalBookings from "./RatingModalBookings";
import RatingModal from "./RatingModal";
import ZouluButton from "../../Common/ZouluButton/ZouluButton";
import { Rating } from "@mui/material";
import "moment/locale/de";
const RightTable = (props) => {
  const { data, setLoading } = props;
  const [booking, setBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showAddRatingModal, setShowAddRatingModal] = useState(false);
  const deleteBooking = async () => {
    setLoading(true);
    const response = await Api("PUT", `api/customer/booking/${booking?.row?._doc?.user_id?._id}?booking_id=${booking?.row?._doc?._id}&product_id=${booking?.service?._id}`);
    if (response.status === 200) {
      setLoading(false);
      setShowModal(false);
      props.callback();
    } else {
      setLoading(false);
      toast.error(response.data.msg);
    }
  };
  const concatDate = (date, start_time) => {
    let concat = moment(date).format("YYYY-MM-DD") + "T" + start_time + "";
    return new Date(concat);
  };
  const confirmedBooking = async () => {
    setLoading(true);
    const response = await Api("PUT", `api/customer/booking/rating/${booking?.row?._doc?._id}?product_id=${booking?.service?._id}`);
    if (response.status === 200) {
      setLoading(false);
      setShowModal(false);
      props.callback();
    } else {
      setLoading(false);
      toast.error(response.data.msg);
    }
  };
  const getEndTime = (start_time, duration) => {
    let [start_hours, start_minutes] = start_time.split(":").map(Number);
    let end_minutes = start_minutes + duration;
    let end_hours = start_hours + Math.floor(end_minutes / 60);
    end_minutes = end_minutes % 60;
    let end_time = `${String(end_hours).padStart(2, "0")}:${String(end_minutes).padStart(2, "0")}`;
    let end_time_stamps = "1970-10-10" + "T" + end_time + "";
    let start_time_stamps = "1970-10-10" + "T" + start_time + "";
    return { start_time_stamps, end_time_stamps };
  };
  return (
    <Fragment>
      {data?.map((row, index) =>
        row?.products?.map((value, i) => (
          <div className="CardBookingExpert my-3" key={i}>
            <div className="flex-calenderBox-Btns">
              <div className="d-flex pt-1">
                <div className="calenderBookingBox mt-1">
                  <div className="weekNameCalender">{moment(concatDate(value?.date, value?.start_time)).locale("de").format("dddd").slice(0, 3)}</div>
                  <div className="weekDayCalender">{moment(concatDate(value?.date, value?.start_time)).format("DD")}</div>
                  <div className="monthNameCalender">{moment(concatDate(value?.date, value?.start_time)).format("MMM")}</div>
                </div>
                <div className="mt-1">
                  <div className="BookingMassage-Name">{value?.service_id?.name}</div>
                  <div className="BookingMassage-Time">{value?.duration} mins</div>
                  <div className="BookingMassage-Time">
                    Uhrzeit: {moment(getEndTime(value?.start_time, value?.duration)?.start_time_stamps).format("hh:mm a")}-
                    {moment(getEndTime(value?.start_time, value?.duration)?.end_time_stamps).format("hh:mm a")} Uhr
                    {/* {Math.round(moment.duration(value?.duration, "minute").asHours())} hour message {moment(getEndTime(value?.start_time, value?.duration)?.start_time_stamps).format("hh:mm a")}-
                    {moment(getEndTime(value?.start_time, value?.duration)?.end_time_stamps).format("hh:mm a")} */}
                  </div>
                </div>
              </div>
              <div className="d-flex mt-2">
                {console.log("value?.status", value?.status)}
                {value?.status === "confirmed" ? null : value?.status === "pending" ? (
                  <div
                    className="bookingCancel-btn "
                    onClick={() => {
                      setBooking({ service: value, row: row });
                      setTimeout(() => {
                        setShowModal(true);
                      }, 200);
                    }}
                  >
                    Stornieren
                  </div>
                ) : value?.status === "cancelled" ? (
                  <>
                    <div className="bookingCancel-text">{value?.status}</div>
                    {console.log("value?.status", value?.status)}
                  </>
                ) : null}
                {value?.status === "confirmed" && value?.rating === 0 && (
                  <ZouluButton
                    title={"Bewerte deine Behandlung"}
                    className="comfirmationBooking-btn "
                    onClick={() => {
                      setBooking({ service: value, row: row });
                      setTimeout(() => {
                        setShowAddRatingModal(true);
                      }, 200);
                    }}
                  />
                )}
                {value?.status === "completed" && (
                  <ZouluButton
                    title={"Bestätigung"}
                    className="comfirmationBooking-btn "
                    onClick={() => {
                      setBooking({ service: value, row: row });
                      setTimeout(() => {
                        setShowModal(true);
                      }, 200);
                    }}
                  />
                )}
                {value?.rating > 0 && <Rating name="read-only" value={value?.rating} readOnly />}
              </div>
            </div>
          </div>
        ))
      )}
      <RatingModalBookings show={showRatingModal} setShow={(e) => setShowRatingModal(e)} />
      {showModal && (
        <CustomDeleteModal
          showModal={showModal}
          hideModal={() => setShowModal(false)}
          title="Bestätigung"
          subTitle={
            booking?.service?.status === "completed"
              ? "Bist du sicher, dass du die Buchung bestätigen möchtest? Das kann nicht rückgängig gemacht werden"
              : "Sind Sie sicher, dass Sie die Buchung stornieren möchten ? Das kann nicht rückgängig gemacht werden"
          }
          callback={() => (booking?.service?.status === "completed" ? confirmedBooking() : deleteBooking())}
          setLoading={setLoading}
          btnTitle={booking?.service?.status === "completed" ? "Bestätigen" : "Schließen"}
        />
      )}
      {showAddRatingModal && <RatingModal show={showAddRatingModal} data={booking} setShow={(e) => setShowAddRatingModal(e)} callback={() => props.callback()} setLoading={setLoading} />}
    </Fragment>
  );
};
export default RightTable;
export const CancelBtnStyle = {
  width: 80,
  backgroundColor: "transprent",
  padding: 5,
  color: "red",
  borderRadius: 10,
  textAlign: "center",
  cursor: "pointer",
  border: "1px solid red",
};
export const ConfirmBtnStyle = {
  width: 120,
  backgroundColor: "#027CFF",
  padding: 5,
  color: "white",
  borderRadius: 10,
  textAlign: "center",
  cursor: "pointer",
  marginLeft: 10,
};
