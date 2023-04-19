import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import ZouluButton from "../Common/ZouluButton/ZouluButton";
import styles from "../../styles/booknow.module.css";
import DoneIcon from "@mui/icons-material/Done";
function DeepTissueMassage(props) {
  const handleClose = () => props.setShow(false);
  return (
    <Modal show={props.show} onHide={handleClose} animation={false} size="lg" style={{ overflow: "scroll" }}>
      <Modal.Header closeButton className={`${styles.ModalHead}  ${styles.AddressModallClass}`}>
        <Modal.Title>
          <span className={styles.ModalHeader}>{props?.serviceId?.name}</span>{" "}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.DeepTissueModalBody}>
        <div style={{ minHeight: "350px", overflowY: "scroll" }}>
          <div className="row mt-4 pt-1 mb-4 m-0 p-0">
            <div className="col-lg-12">
              <div className={styles.DeepModalHeading}>Description</div>
              <span className={styles.DeepModalText}>{props?.serviceId?.description}</span>
            </div>
          </div>
          <div className="row mt-4 pt-1 mb-4 pb-3 m-0 p-0">
            <div className="col-lg-12">
              <div className={styles.DeepTissueModalHeading}>Preparation</div>
              <span className={`${styles.DeepModalText} mt-3`}>{props?.serviceId?.preparations}</span>
            </div>
          </div>

          <div className="row" style={{ marginBottom: "100px" }}>
            {props?.serviceId?.steps?.map((data, index) => {
              return (
                <div className="col-lg-12" key={index}>
                  <div className={styles.DoneTextDiv}>
                    <DoneIcon className={styles.DoneIcon} />
                    <div className={`${styles.ModalDetailText} `}>{data}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Modal.Body>

      <ZouluButton
        title="Jetzt Buchen"
        className={`${styles.AddressButton}  mt-3 mb-4`}
        onClick={() => {
          props.setShow(false);
          props.setTimeModal(true);
        }}
      />
    </Modal>
  );
}
export default DeepTissueMassage;
