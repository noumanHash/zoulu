import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ZouluButton from "../../../Common/ZouluButton/ZouluButton";
import styles from "../../../../styles/Home.module.css";
import OTPInput from "react-otp-input";
import { Api } from "../../../../utils/Api";
import { auth, firebase } from "../../../../phoneVerification";
import { ToastContainer, toast } from "react-toastify";
function Recovery(props) {
  const [OTP, setOTP] = useState("");
  const [finalResult, setFinalResult] = useState(null);
  function handleChange(OTP) {
    setOTP(OTP);
  }
  const handleClose = () => props.setShow(false);
  const verified = () => {
    if (finalResult !== null) {
      try {
        finalResult
          .confirm(OTP)
          .then(async (result) => {
            onSubmit();
          })
          .catch((err) => {
            toast.warning("You Enter Wrong Code");
          });
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        props?.final
          .confirm(OTP)
          .then(async (result) => {
            onSubmit();
          })
          .catch((err) => {
            toast.warning("You Enter Wrong Code");
          });
      } catch (err) {
        console.log(err);
      }
    }
  };
  const onSubmit = async () => {
    const payload = new FormData();
    payload.append("id", props?.values?._id);
    payload.append("phoneNumber", props?.phoneNum);

    const response = await Api("get", `api/auth/verify/${props?.values?._id}`);
    if (response.status === 200) {
      localStorage.setItem("zolu-auth-token", response?.data.data);
      toast.success("User Verfication successfully");
      getUser(props?.values?._id);
      props.setShowThanks(true);
      props.setShow(false);
    } else {
      alert("error");
    }
  };
  const getUser = async (id) => {
    if (id) {
      const response = await Api("get", `api/profile/${id}`);
      if (response.status === 200) {
        props?.setStatus(response?.data?.data);
      }
    }
  };
  const checkNumber = async () => {
    let verify = new firebase.auth.RecaptchaVerifier("recaptcha-containerss");
    auth
      .signInWithPhoneNumber(props?.phoneNum, verify)
      .then(async (result) => {
        setFinalResult(result);
        if (result) {
          console.log(result);
        }
      })
      .catch((err) => {
        alert(err);
      });
  };
  return (
    <>
      <Modal show={props.show} onHide={handleClose} animation={false} size="lg" centered>
        <Modal.Header closeButton style={{ background: "#FFF", borderBottom: "none", paddingTop: "25px", paddingRight: "25px" }}>
          <Modal.Title> </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: "#FFFF" }}>
          <div className="row mt-5  m-0 p-0">
            <div className={`col-lg-12 ${styles.CenterData}`}>
              <h2 className={styles.ModalHeading} style={{ marginLeft: "-28px" }}>
                Verifizierung
              </h2>
              <p className={styles.RecoverySmallHeading}>Wir senden Ihnen einen Code. Bitte überprüfen Sie Ihr Handy und geben Sie Ihren Code ein</p>
              <br />
              <div className={styles.otp}>
                <OTPInput onChange={handleChange} value={OTP} inputStyle="inputStyle" className={styles.inputStyle} numInputs={6} separator={<span></span>} />
              </div>
              <div className="mt-4">
                Hast du keinen Code erhalten?
                <span className={styles.RecoveryUnderlineText} style={{ cursor: "pointer" }} onClick={() => checkNumber()}>
                  Code erneut senden
                </span>
                <div id="recaptcha-containerss" style={{ display: "flex", justifyContent: "center", marginTop: "7rem" }}></div>
              </div>
              <ZouluButton title="Bestätigen" className={styles.RecoveryModalBtn} onClick={() => verified()} />
              <br />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
export default Recovery;
