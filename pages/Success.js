import React, { useEffect, useState } from "react";
import ThanksModal from "./treatment/ThanksModal";
import styles from "../styles/Home.module.css";
import style from "../styles/treatment.module.css";
import DoneIcon from "@mui/icons-material/Done";
import ZouluButton from "./Common/ZouluButton/ZouluButton";
import CancelIcon from "@mui/icons-material/Cancel";
import { Api } from "../utils/Api";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Success = (props) => {
  const router = useRouter();
  return (
    <>
      {" "}
      <div className="row  m-0 p-0">
        <div className={`col-lg-12 mt-5 ${styles.CenterData}`}>
          <h2 className={`${styles.ModalHeading} mt-4`}>Booking completed</h2>
          <DoneIcon className={style.ThanksDoneIcon} />
          <div className={style.ThanksText}>Thank You !</div>
          <div className={style.CompleteText}>
            Your Booking process is successfully <br /> completed
          </div>
        </div>

        <ZouluButton
          title="My Bookings"
          className={`${style.goBack} mt-3`}
          onClick={() => {
            router.push("/mybooking");
          }}
        />
      </div>
    </>
  );
};

export default Success;
