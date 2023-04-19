import React, { useState, useRef } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Iphone from "../../../../public/Images/Iphone.png";
import styles from "../../../../styles/Home.module.css";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
const Slider = () => {
  const matches = useMediaQuery("(max-width:600px)");
  const ref = useRef();
  const [index, setIndex] = useState(0);
  let arr = [
    {
      header: "Unsere",
      headerTitle: " Experten",
      clientName: "Julia Nguyen ",
      designation: "Masseurin, Essen und Umgebung ",
      image: <img src="/Images/imageExpert1.png" className={styles.SliderImage} />,
      desc: "Julia ist seit über 10 Jahren als Masseurin tätig und hat sich auf Schwangerschaftsmassage spezialisiert. Mit ihrer umfassenden Erfahrung und ihrem tiefen Verständnis für die Bedürfnisse schwangerer Frauen kann sie helfen, körperliche Beschwerden während der Schwangerschaft zu lindern und das allgemeine Wohlbefinden zu verbessern. Julia ist bekannt für ihre freundliche und einfühlsame Art, und sie arbeitet eng mit ihren Kunden zusammen, um ihre Bedürfnisse zu verstehen und maßgeschneiderte Behandlungen anzubieten. Sie gibt auch wertvolle Tipps und Ratschläge, um ihren Kunden zu helfen, ihre körperliche Gesundheit und Wohlbefinden zu verbessern.",
    },
    {
      header: "Unsere ",
      headerTitle: " Experten",
      clientName: "Jonas Müller",
      designation: "Physiotherapeut, Essen und Umgebung",
      image: <img src="/Images/imageExpert2.png" className={styles.SliderImage} />,
      desc: "Jonas ist ein erfahrener Physiotherapeut, der sich auf die allgemeine Physiotherapie spezialisiert hat. Er arbeitet eng mit seinen Kunden zusammen, um ihre körperlichen Beschwerden zu verstehen und maßgeschneiderte Behandlungspläne zu entwickeln, die ihnen helfen, sich schneller zu erholen und ihre Beweglichkeit und Kraft zu verbessern. Sein Ziel ist es, seinen Kunden zu helfen, ihre körperlichen Ziele zu erreichen und ihre Lebensqualität zu verbessern. Dank seiner umfangreichen Erfahrung und seiner Fähigkeit, sich auf die individuellen Bedürfnisse jedes Kunden einzustellen, hat er bereits vielen Menschen geholfen, ihre körperlichen Beschwerden zu überwinden und ihre körperlichen Fähigkeiten zu verbessern.",
    },
    {
      header: "Unsere ",
      headerTitle: " Experten",
      clientName: "Lisa Schmitt",
      designation: "Nageldesignerin, Essen und Umgebung",
      image: <img src="/Images/sliderImage1.png" className={styles.SliderImage} />,
      desc: "Lisa hat ihre Erfahrung als Nageldesignerin in den letzten fünf Jahren gesammelt, indem sie zwei Jahre in einem Nagelstudio gearbeitet und sich dann selbstständig gemacht hat. Sie ist eine zertifizierte Nageldesignerin mit Spezialisierung auf Gel- und Acrylnägel. Lisa legt großen Wert auf eine individuelle Beratung, um sicherzustellen, dass sie die Bedürfnisse und Wünsche jedes Kunden berücksichtigt. Sie ist bekannt für ihre kreative und professionelle Arbeitsweise und arbeitet eng mit ihren Kunden zusammen, um sicherzustellen, dass das Ergebnis ihren Vorstellungen entspricht.",
    },
  ];
  const handleInc = () => {
    if (index === arr.length - 1) return null;

    setIndex((e) => e + 1);
  };
  const handleDec = () => {
    if (index === 0) return null;

    setIndex((e) => e - 1);
  };

  return (
    <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
      <div className={`${styles.CircleContainer} container-fluid`}>
        <div className="row">
          <div className="col-xl-2 col-lg-2 col-sm-2 col-md-2 col-xs-2 col-2" style={{ textAlign: "left", float: "left", alignItems: "flex-start", display: "flex" }}>
            <ol className={`carousel-indicators`}>
              <li className={index == 0 ? `${styles.SliderCircle} active` : `${styles.SliderCircle1}`} data-target="#carouselExampleIndicators" onClick={() => setIndex(0)}></li>
              <li className={index == 1 ? `${styles.SliderCircle} active` : `${styles.SliderCircle1}`} data-target="#carouselExampleIndicators" onClick={() => setIndex(1)}></li>
            </ol>
          </div>
        </div>
      </div>
      <div className="carousel-inner" style={{ height: "fit-content" }}>
        <div className={`carousel-item active`} ref={ref}>
          <div className={styles.SlideOneContainer}>
            <br />
            {matches ? (
              <>
                <center>
                  <span className={styles.SliderHeading}>
                    {arr[index]?.header} {arr[index]?.headerTitle}
                  </span>
                  <div className="row">
                    <div className="col-md-12 col-sm-12 col-xs-12 col-12 mt-4 ">
                      <div>{arr[index]?.image}</div>
                      {/* <img src={"/Images/imageExpert1.png"} className={styles.SliderImageSmall} /> */}
                    </div>
                  </div>
                </center>
                <h3 className={`${styles.SecondHeadin} mt-4`}>{arr[index]?.clientName}</h3>
                <h5 className={styles.SliderDesignation}>{arr[index]?.designation}</h5>
                <div className="d-flex ">
                  <p className={`${styles.SliderText} mt-4`}>{arr[index]?.desc}</p>
                </div>
              </>
            ) : (
              <>
                <div className={styles.SliderHeading}>
                  {arr[index]?.header}
                  <span style={{ color: "#3A7AE4" }}>{arr[index]?.headerTitle}</span>
                </div>
                <br />
                <h3 className={`${styles.SecondHeadin} mt-1`}>{arr[index]?.clientName}</h3>
                <h5 className={styles.SliderDesignation}>{arr[index]?.designation}</h5>
                <div className="d-flex">
                  <p className={`${styles.SliderText} mt-4`}>{arr[index]?.desc}</p>
                  <div>{arr[index]?.image}</div>
                  <div className={styles.ResponsiveBackDiv}> </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className={`${styles.Arrows} d-flex justify-content-between`}>
        <div className={`${styles.ArrowOne} `} onClick={handleDec}>
          <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true" style={{ color: `${index === 0 ? "#a1a1a1" : "#3A7AE4"}` }}>
              <KeyboardArrowLeftIcon className={styles.IconClassblack} />
            </span>
          </a>
        </div>
        <div className={`${styles.ArrowOne}`} onClick={handleInc}>
          <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true" style={{ color: `${index === arr.length - 1 ? "#a1a1a1" : "#3A7AE4"}` }}>
              <KeyboardArrowRightIcon className={styles.IconClass1} />
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Slider;
