import { StylesContext } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import SidebarWrapper from "./SideBarWrapper";
import styles from "../../styles/bookings.module.css";
import style from "../../styles/dashboard.module.css";
import Button from "@mui/material/Button";
import { Api } from "../../utils/Api";
var jwt = require("jsonwebtoken");
import moment from "moment";
import "moment/locale/de";

import Pagination from "../../Components/Pagination";
import Loader from "../../Components/Loader";
import AuthProtected from "../../utils/AuthProtected";
import { Rating } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Index = () => {
  const [booking, setBookings] = React.useState();
  const [UserID, setUserID] = React.useState();
  const [confirmed, setConfirmed] = React.useState();
  const [pending, setPending] = React.useState();
  const [status, setStatus] = useState("Confirmed");
  const [values, setValue] = useState("upcoming");
  const [tabValue, setTabValue] = useState("upcoming");
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState([]);
  useEffect(() => {
    let token = jwt.decode(window.localStorage.getItem("zolu-auth-token"));
    setUserID(token?.data?._id);
    getbooking(token?.data?._id, currentPage);
  }, [currentPage, values]);
  const getbooking = async (id, page) => {
    setLoading(true);
    const response = await Api("get", `api/expert/booking/${id}?type=${values}&page=${page}&limit=10`);
    if (response.status === 200) {
      setLoading(false);
      console.log(response?.data?.data);
      setBookings(response?.data?.data);
      if (pages.length === 0) {
        for (let i = 1; i <= response?.data.pagination?.pages; i++) {
          pages.push(i);
        }
        setPages(pages);
      }
    } else {
      setLoading(false);
    }
  };
  function getEndTime(start_time, min_to_add) {
    const date = new Date(`1970-01-01T${start_time}:00`);
    date.setMinutes(date.getMinutes() + min_to_add);
    const newTimeString = date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
    return newTimeString;
  }
  function getStartTime(date, start_time) {
    let datee = moment(date).format("YYYY-MM-DD");
    let time = start_time;
    let concaDate = datee + "T" + time;
    let newDate = new Date(concaDate);
    return newDate;
  }
  function completeBooking(start_time, min_to_add, valueDate) {
    const date = new Date(`1970-01-01T${start_time}:00`);
    date.setMinutes(date.getMinutes());
    const newTimeString = date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
    let datee = moment(valueDate).format("YYYY-MM-DD");
    let time = newTimeString;
    let concaDate = datee + "T" + time;
    let newDate = new Date(concaDate);
    var now = moment();
    if (now > newDate) {
      return "Als erledigt markieren";
    }
  }
  const statusBooking = async (bookingID, productID) => {
    const response = await Api("put", `api/customer/booking/rating/${bookingID}?product_id=${productID}`);
    if (response.status == 200) {
      toast.success(response?.data?.msg);
      getbooking(UserID, currentPage);
    } else {
      toast.error(response?.data?.msg);
    }
  };
  const cancelBookingHandler = async (bookingID, productID) => {
    const response = await Api("put", `api/expert/booking/${UserID}?booking_id=${bookingID}&product_id=${productID}`);
    if (response.status == 200) {
      toast.success(response?.data?.msg);
      getbooking(UserID, currentPage);
    } else {
      toast.error(response?.data?.msg);
    }
  };
  return (
    <>
      {loading ? <Loader /> : null}
      <SidebarWrapper>
        <div className="container-fluid margin-sidebar  mt-5 pt-2">
          <Box className={`${styles.tabZIndexTop}`} sx={{ width: "100%" }}>
            <Tabs value={values} onChange={(e, values) => setValue(values)} aria-label="lab API tabs example">
              <Tab label={`Anstehende Buchugen`} className={values === "upcoming" ? "activeLink" : "tab_1_style"} value={"upcoming"} style={{ marginRight: "18px" }} />
              <Tab label={`letzte Buchungen`} className={values === "past" ? "activeLink" : "tab_1_style"} value={"past"} />
            </Tabs>
          </Box>
          <div className="row pt-3">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 col-12 pad-small-zero">
              <div className={`${styles.marginTopBookingTiitle} mt-4`}>
                {values === "upcoming" ? (
                  <h4 className="pb-4" style={style}>
                    Anstehende Buchungen
                  </h4>
                ) : (
                  <h4 className="pb-4" style={style}>
                    letzte Buchungen
                  </h4>
                )}
                {booking?.map((row, index) => {
                  return row?.products.map((value, key) => {
                    return (
                      <>
                        <div className="CardBookingExpert my-3" key={index}>
                          <div className="flex-calenderBox-Btns">
                            <div className="d-flex pt-1">
                              <div className="calenderBookingBox mt-1">
                                <div className="weekNameCalender">{moment(value?.date).locale("de").format("dddd").slice(0, 3)}</div>
                                <div className="weekDayCalender ">{moment(value?.date).format("DD")}</div>
                                <div className="monthNameCalender">{moment(value?.date).format("MMM ")}</div>
                              </div>
                              <div className="mt-1">
                                <div className="BookingMassage-NameExpert">{value?.service_id?.name}</div>
                                <div className="BookingMassage-Time pt-1">{value?.duration} min</div>
                                <div className="BookingMassage-Time">
                                  {" "}
                                  Dauer {value?.start_time}-{getEndTime(value?.start_time, value?.duration)}
                                </div>
                              </div>
                            </div>
                            <div className="d-flex mt-2">
                              {value?.rating > 0 ? (
                                <>
                                  <Rating name="read-only" value={value?.rating} readOnly className="mt-2" />
                                </>
                              ) : (
                                <div>
                                  {completeBooking(value?.start_time, value?.duration, value?.date) && value?.status === "pending" ? (
                                    <Button
                                      // title={"pending"}
                                      className={styles.OnWayCompleted}
                                      onClick={() => {
                                        statusBooking(row?._doc?._id, value?._id);
                                      }}
                                    >
                                      {completeBooking(value?.start_time, value?.duration, value?.date)}
                                    </Button>
                                  ) : (
                                    <>
                                      {value?.status === "completed" ? (
                                        <Button className={styles.OnWay}>{"abgeschlossen"}</Button>
                                      ) : value?.status === "pending" ? (
                                        <Button className={styles.OnWay}>{"Anstehend"}</Button>
                                      ) : (
                                        <Button className={styles.OnWay}>{value?.status}</Button>
                                      )}
                                    </>
                                  )}
                                  {value?.status === "pending" && !completeBooking(value?.start_time, value?.duration, value?.date) ? (
                                    <Button className={styles.OnWay} onClick={() => cancelBookingHandler(row?._doc?._id, value?._id)}>
                                      Stornieren
                                    </Button>
                                  ) : null}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  });
                })}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "25px",
                  }}
                >
                  {booking?.length > 0 ? <Pagination currentPage={currentPage} setCurrentPage={(page) => setCurrentPage(page)} pages={pages} /> : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarWrapper>
    </>
  );
};
export default AuthProtected(Index);
