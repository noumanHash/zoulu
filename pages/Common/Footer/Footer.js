import React, { useEffect, useState } from "react";
import styles from "../../../styles/Home.module.css";
import { FiFacebook } from "react-icons/fi";
import { AiOutlineTwitter } from "react-icons/ai";
import { AiOutlineInstagram } from "react-icons/ai";
import ZouluButton from "../../Common/ZouluButton/ZouluButton";
import { FiLinkedin } from "react-icons/fi";
import { Api } from "../../../utils/Api";
import Link from "next/link";
const Footer = (props) => {
  const { categories } = props;

  useEffect(() => {
    if (categories) {
      servicesHandler();
    }
  }, [categories]);

  const servicesHandler = () => {
    const array = [];
    categories?.map((data, index) => {
      if (data?.services?.length > 0) {
        data?.services?.map((service) => {
          array.push(service);
        });
      }
    });
    return array;
  };

  return (
    <>
      <div
        className={`${styles.PaddingfooterScreen} `}
        style={{
          backgroundColor: "#06152D",
          color: "white",
          width: "100%",
          paddingTop: "67px",
          paddingBottom: "30px",
        }}
      >
        <div className="row">
          <div className="col-lg-4 col-xl-4 col-md-12 col-sm-12 col-12 ">
            <div className="footerzoluLogo">
              {" "}
              <img src={"/Images/logo.png"} alt="abc"></img>
            </div>
            <div className="footerText">
              Alle Experten bei Zoulu sind unabhängige und zertifizierte
              Therapeuten
            </div>
            <div style={{ display: "flex" }}>
              <div className={styles.SocialMedia}>
                <img src={"/Images/fb.png"}></img>
              </div>
              <div className={styles.SocialMedia}>
                <img src={"/Images/tw.png"}></img>
              </div>
              <div className={styles.SocialMedia}>
                <img src={"/Images/insta.png"}></img>
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-xl-2  col-md-3 col-sm-4  col-6  mblList">
            <div>
              <div className="ListHeading">Behandlungen</div>
              {categories?.map((data, index) => {
                return <div className="footerItems">{data?.name}</div>;
              })}
              {/* <div className="footerItems">Nails</div>
              <div className="footerItems">Massage</div>
              <div className="footerItems">Spray Tan</div>
              <div className="footerItems">Waxing</div>
              <div className="footerItems">Facials</div>
              <div className="footerItems">Lashes</div>
              <div className="footerItems">Hair</div>
              <div className="footerItems">Make Up</div>
              <div className="footerItems">Brows</div>
              <div className="footerItems">Health</div> */}
            </div>
          </div>
          <div className="col-lg-2 col-xl-2  col-md-3 col-sm-4   col-6  ">
            <div>
              <div className="ListHeading">Über Zoulu</div>
              <div className="footerItems mt-2 pt-1">Experte Werden</div>
              <div className="footerItems">Über Zoulu</div>
              <Link href="/terms&Conditions">
                <div className="footerItems">AGB</div>
              </Link>
              <Link href="/privacy">
                <div className="footerItems">Datenschutzerklärung</div>
              </Link>
              <div className="footerItems">Impressum</div>
            </div>
          </div>
          <div className="col-lg-2 col-xl-2  col-md-3 col-sm-4  col-6 laptopeView ">
            <div>
              <div className="ListHeading">Behandlungen</div>
              {categories?.map((data, index) => {
                if (index < 5) {
                  return (
                    <div
                      className={
                        index === 0 ? "footerItems mt-2 pt-1" : "footerItems"
                      }
                    >
                      {data?.name}
                    </div>
                  );
                }
              })}
              {/* <div className="footerItems mt-2 pt-1">Nägel</div>
              <div className="footerItems">Massage</div>
              <div className="footerItems">Spray Tan</div>
              <div className="footerItems">Waxing</div>
              <div className="footerItems">Kosmetik</div> */}
            </div>
          </div>
          <div className="col-lg-2 col-xl-2  col-md-3 col-sm-4  col-6  laptopeView">
            <div>
              {categories?.map((data, index) => {
                if (index > 4) {
                  return (
                    <div
                      className={
                        index === 5
                          ? "footerItems footerServices mt-5 pt-3"
                          : "footerItems"
                      }
                    >
                      {data?.name}
                    </div>
                  );
                }
              })}
              {/* <div className="footerItems footerServices mt-5 pt-3">
                Wimpern
              </div>
              <div className="footerItems">Haare</div>
              <div className="footerItems">Make Up</div>
              <div className="footerItems">Augenbrauen</div>
              <div className="footerItems">Physiotherapie</div> */}
            </div>
          </div>
          <div className="col-lg-2 col-xl-2  col-md-3 col-sm-4   col-6 ">
            <div>
              <div className="ListHeading services">Services</div>
              {/* <div className="ListHeading googleLogo">Get the App</div> */}
              <div className="ListHeading googleLogo">Services</div>
              {servicesHandler()?.map((data, index) => {
                if (index < 4) {
                  return <div className={"footerItems pt-3"}>{data?.name}</div>;
                }
              })}
              {/* <div className="footimage mt-2 pt-2"><img src={"/Images/google.png"} className={`${styles.GoogleImageFooter} `} /></div> */}
              <div className="versionStyle mt-4 mb-2">Ver 1.2.1</div>
            </div>
          </div>
          {/* <center className="mb-4 mt-4 pt-3 ">
          <span className={`${styles.FooterText1} `}>
            Terms of use | privacy zoulu, 2022. all right reserved
          </span>
        </center> */}
        </div>
      </div>
    </>
  );
};
export default Footer;
