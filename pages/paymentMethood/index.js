import React, { useEffect } from "react";
import styles from "../../styles/payment.module.css";
import ZouluButton from "../Common/ZouluButton/ZouluButton";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
const stripe = require("stripe")("sk_test_51MP636JNDOmTcINHfgKrsTMq1lbF9KnIObEUL8KTcBiTw79gMf00zCbLakzTSWhL0fpK8Z6QcHd0234PjugZ21fJ00LDnndRct");
import "react-credit-cards/es/styles-compiled.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import { Avatar } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cards from "react-credit-cards";
var jwt = require("jsonwebtoken");
import { Form, InputGroup } from "react-bootstrap";
import { Api } from "../../utils/Api";
import Loader from "../../Components/Loader";
import moment from "moment";
import { useRouter } from "next/router";
import AuthProtected from "../../utils/AuthProtected";
import AddressModal from "../bookNow/AddressModal";

const Index = (props) => {
  const router = useRouter();

  const [cardValues, setCardValues] = useState({
    name: "",
    number: "",
    expiry: "",
    cvc: "",
    focus: "",
  });
  const [error, setError] = React.useState({});

  const [stripe_customer_id, setStripe_customer_id] = useState();
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [expire, setExpire] = useState();
  const [manageDisplay, setManageDisplay] = useState(true);
  const [locationModal, setLocationModal] = useState(false);
  const [cvc, setCVC] = useState();
  const [userID, setuserID] = useState();
  const [address, setAdress] = useState();
  const [location, setLocation] = useState();
  const [loader, setLoader] = useState(false);

  const onHandleChange = (e) => {
    if (e.target.name == "cvc" && e.target.value.toString().length > 4) return;
    if (e.target.name == "number" && e.target.value.toString().length > 16) return;
    setCardValues({
      ...cardValues,
      [e.target.name]: e.target.value,
    });
  };
  const onHandleExpire = (e) => {
    if (e.target.value.length > 5) return;
    var inputChar = String.fromCharCode(e.keyCode);
    var code = e.keyCode;
    var allowedKeys = [8];
    if (allowedKeys.indexOf(code) !== -1) {
      return;
    }
    e.target.value = e.target.value
      .replace(
        /^([1-9]\/|[2-9])$/g,
        "0$1/" // 3 > 03/
      )
      .replace(
        /^(0[1-9]|1[0-2])$/g,
        "$1/" // 11 > 11/
      )
      .replace(
        /^([0-1])([3-9])$/g,
        "0$1/$2" // 13 > 01/3
      )
      .replace(
        /^(0?[1-9]|1[0-2])([0-9]{2})$/g,
        "$1/$2" // 141 > 01/41
      )
      .replace(
        /^([0]+)\/|[0]+$/g,
        "0" // 0/ > 0 and 00 > 0
      )
      .replace(
        /[^\d\/]|^[\/]*$/g,
        "" // To allow only digits and `/`
      )
      .replace(
        /\/\//g,
        "/" // Prevent entering more than 1 `/`
      );
    setExpire(e.target.value);
  };
  const checkDate = () => {
    const output = stripeCardExpirValidation(expire);
    if (output !== undefined) {
      setError({ output: output });
      return false;
    } else if (output === undefined) {
      setError({ output: "" });
      return true;
    }
  };
  const stripeCardExpirValidation = (value) => {
    if (value) {
      if (/^(0[1-9]|1[0-2])\/[0-9]{2}$/i.test(value.trim())) {
        let today = new Date();
        let CurrentDate = moment(new Date(today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()));
        let visaValue = value.split("/");
        let visaDate = new Date(`20${visaValue[1]}`, visaValue[0], 0);
        return CurrentDate < moment(visaDate) ? undefined : "Please enter valid date";
      } else {
        return "Invalid date format";
      }
    }
  };
  const onHandleFocus = (e) => {
    setCardValues({
      ...cardValues,
      focus: e.target.name,
    });
  };
  useEffect(() => {
    let user = window.localStorage.getItem("zolu-auth-token");
    let token = jwt.decode(user);
    setuserID(token?.data);
    getUser(token?.data?._id);
    console.log(token?.data);
    getCart(token?.data?._id);
  }, []);
  useEffect(() => {
    if (address) {
      getLatLngFromAddress(address);
    }
  }, [address]);
  const getUser = async (id) => {
    if (id) {
      const response = await Api("get", `api/profile/${id}`);
      if (response?.status === 200) {
        setStripe_customer_id(response?.data?.data?.stripe_customer_id);
      } else {
      }
    }
  };
  const getCart = async (id) => {
    if (id) {
      const response = await Api("get", `api/customer/cart/${id}`);
      if (response?.status === 200) {
        setCart(response?.data?.data?.products);

        {
          response?.data?.data?.products?.length < 1 && router.push("/bookNow");
        }
        props?.setcartLength(response?.data?.data?.products?.length);
        setAdress(response?.data?.data?.address);
      } else {
        router.push("/bookNow");
      }
    }
  };
  console.log(cart);

  const booking = async () => {
    var userAvailable = cart?.find((data, index) => {
      if (data?.userAvailable) {
        return data;
      }
    });
    console.log(userAvailable);
    if (userAvailable !== undefined) {
      return toast.warning("Expert not available");
    }
    if (!cardValues?.number || cardValues?.number.length < 16) {
      return toast.warning("Add Accurate Card Number");
    } else if (checkDate() === false) {
      return toast.warning("Add Valid Date");
    } else if (!expire) {
      return toast.warning("Add expire date");
    } else if (!cardValues?.cvc) {
      return toast.warning("Add cvc");
    } else if (cart.length < 1) {
      return toast.warning("There is no cart against this User");
    } else {
      setLoader(true);
      const payload = new FormData();
      payload.append("userId", userID?._id);
      payload.append("checkout", true);
      payload.append("products", JSON.stringify(cart));
      payload.append("address", address);
      payload.append("cardNumber", cardValues?.number);
      payload.append("expiryYear", expire.slice(3, 5));
      payload.append("expiryMonth", expire.slice(0, 1) == 0 ? expire.slice(1, 2) : expire.slice(0, 2));
      payload.append("cvc", cardValues?.cvc);
      const response = await Api("post", `api/customer/cart`, payload);
      if (response.status === 200) {
        setLoader(false);
        toast.success("Booking completed successfully");
        props?.setcartLength();
        router.push("/Success");
        props?.setStatic(response.data.msg);
      } else {
        setLoader(false);
        toast.warning(response.data.msg);
      }
    }
  };
  const totalcharg = () => {
    const totalcharge = 0;
    cart?.map((data) => {
      totalcharge = data?.charges + totalcharge;
    });
    return totalcharge;
  };
  useEffect(() => {
    if (cart[0]?.expert_id && cart[0]?.service_id?._id && cart[0]?.date && location) {
      cart?.map((data, index) => {
        getbooking("value", location, "1", data?.date, data?.service_id?.category_id?._id, data?.service_id?._id, index, data);
      });
    }
  }, [location]);
  const getLatLngFromAddress = async (address) => {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyC7Jz78vSl5-mHKv4eBOy1fRhmoph6loMA`);
    const data = await response.json();
    const lat = data.results[0].geometry.location.lat;
    const lng = data.results[0].geometry.location.lng;
    setLocation({ lat: lat, long: lng });
  };
  const getbooking = async (value, location, index, cartDate, cartCategoryid, cartServiceid, key, cartData) => {
    setLoader(true);
    if (!cartDate) {
    }
    if (cartDate) {
      var date = moment(cartDate).format("YYYY-MM-DD");
    } else {
      var makeFormat = value?.selectedDate?.date + " " + value?.selectedDate?.month + "," + value?.selectedDate?.year;
      var date = moment(makeFormat).format("YYYY-MM-DD");
    }
    console.log(date, "date");

    const payload = new FormData();
    payload.append("categoryId", props?.value?.service_id?.category_id?._id || props?.value?.category_id || cartCategoryid);
    payload.append("serviceId", value?.service_id?._id || cartServiceid);
    payload.append("packages", JSON.stringify(cartData?.packages?.map((e) => e?.package_id._id)));
    payload.append("date", date);
    payload.append("coordinates", JSON.stringify(location));
    const response = await Api("post", `api/expert/availability`, payload);
    if (response.status === 200) {
      setLoader(false);

      var a = response?.data?.data[cart[key]?.start_time];
      console.log(cart[key]?.start_time);
      if (a == undefined || a.length === 0) {
        cart[key].userAvailable = "Expert is not available at this address";
      } else {
        cart[key].userAvailable && delete cart[key].userAvailable;
      }

      if (Object.keys(response.data.data)?.length === 0) {
        setLoader(false);

        cart[key].userAvailable = "Expert is not available at this address";
      }
    } else {
      setLoader(false);

      cart[key].userAvailable = "Expert is not available at this address";
    }
  };
  console.log(stripe_customer_id);
  useEffect(() => {
    const fetchCustomer = async () => {
      console.log(stripe.customers);
      try {
        const customer = await stripe.customers.retrieve(stripe_customer_id);

        setCustomer(customer);
        console.log(customer);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchCustomer();
  }, [stripe_customer_id]);

  return (
    <>
      {loader ? <Loader /> : null}
      <div className="container-fluid" style={{ backgroundColor: "#F5F5F5" }}>
        <div className={`row ${styles.PaddingSmall}`}>
          <div className={`${styles.PaddingContainer} container`}>
            <div className={`${styles.ReverseClass} row `}>
              <div className={"col-xl-5 col-lg-12 "}>
                <div className={`${styles.CardContainer}   ${styles.PaymentCardsShadow} `}>
                  <div className={styles.CardHeading}>Service-Adresse</div>
                  <div className="d-flex justify-content-between mt-3 mb-4">
                    <div className="d-flex ">
                      <div className={styles.CardImage}>
                        <img src={"/Images/homeIcon.png"} />
                      </div>
                      <div className={styles.NotMergeCardSmallHeading}>
                        <div className={styles.CardText}>{address}</div>
                      </div>
                    </div>

                    <div
                      style={{ float: "right" }}
                      className={styles.NotMergeCardSmallHeading}
                      onClick={() => {
                        setLocationModal(true);
                      }}
                    >
                      <div className={styles.CardText} style={{ cursor: "pointer" }}>
                        Bearbeiten
                      </div>
                    </div>
                  </div>
                  <div className="d-flex " style={{}}>
                    <div className={styles.CardImage}>
                      <img src={"/Images/callicon.png"} />
                    </div>
                    <div className={`${styles.TextPlayfairFamily} mt-1`}>
                      <span className="ml-4">{userID?.phone_number}</span>
                    </div>
                  </div>
                  <div className="d-flex mt-4">
                    <div className={styles.CardImage}>
                      <img src={"/Images/gmail.png"} />
                    </div>
                    <div className={`${styles.TextPlayfairFamily} mt-1`}>
                      <span className="ml-4">{userID?.email}</span>
                    </div>
                  </div>
                </div>
                {cart[0]?.userAvailable ? (
                  <div>
                    <center>
                      <div className={styles.triangleup}></div>
                    </center>
                    <div className={styles.tooltipDiv}>Die ausgewählten Experten bedienen nicht die aktuelle Adresse.</div>
                  </div>
                ) : null}
                <div className={`${styles.CardContainer} ${styles.PaymentCardsShadow} ${styles.ProCardsShadowClass}  mt-4`}>
                  <div className={styles.CardHeadingOrder}>Details zur Bestellung</div>
                </div>

                {cart?.map((data) => {
                  return (
                    <>
                      <div className={`${styles.CardContainer} ${styles.PaymentCardsShadow} ${styles.ProCardsShadowClass}  mt-4`}>
                        <div className="d-flex justify-content-between mt-4">
                          <div className="d-flex">
                            <div className={styles.CardImage}>
                              <Avatar src={data?.expert_id?.image ? data?.expert_id?.image : ""} className={styles.ProfileImage} />
                            </div>
                            <div className={`${styles.CardSmallHeading} mt-1`}>{data?.expert_id?.name}</div>
                          </div>
                          <div className="d-flex">
                            <CalendarMonthIcon className={styles.CalenderIcon} />
                            <p className={styles.TextPlayfairFamily}>{moment(data?.date).format("DD/MM/yyyy")}</p>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between mt-4">
                          <div className="d-flex">
                            <div className={styles.CardImage1}>
                              <img src={"/Images/mask.png"} />
                            </div>
                            <div className={styles.CardSmallHeading}>
                              {data?.service_id?.name}
                              <div className={styles.MinutesText}>{data?.duration} Minuten </div>
                            </div>
                          </div>
                          <div className="d-flex">
                            <AccessTimeFilledIcon className={styles.CalenderIcon} />
                            <p className={styles.TextPlayfairFamily1}>{data?.start_time}</p>
                          </div>
                        </div>

                        {/* <center>
                          <BootstrapTooltip open={true} title="The Selected professional doesn't service the current address.">
                            <Button></Button>
                          </BootstrapTooltip>
                        </center> */}
                      </div>

                      {/* <center>
                        <div className={styles.triangleup}></div>
                      </center>
                      <div className={styles.tooltipDiv}>The Selected professional doesn't service the current address.</div> */}
                    </>
                  );
                })}

                <div className={`${styles.CardContainer} ${styles.PaymentCardsShadow} ${styles.ProCardsShadowClass}  mt-4`}>
                  <div className={styles.CardHeadingOrder}>Details zur Rechnung</div>
                  <div className="d-flex justify-content-between mt-4">
                    <div className="d-flex">
                      <div className={styles.CalenderIc}>
                        <img src={"/Images/group.png"} />
                      </div>
                      <div>
                        <div className={styles.CardSmallHeading}>Rechnungsdatum</div>
                        <div className={styles.DateText}>{moment().format("DD MMMM, yyyy")}</div>
                      </div>
                    </div>
                  </div>
                  {cart?.map((data) => {
                    return (
                      <div>
                        <div className={styles.DisplayDiv}>
                          <div className={styles.WorkType}>{data?.service_id?.name}</div>
                          <div className={styles.WorkAmount}> €{data?.charges}.00</div>
                        </div>
                        <div className={styles.DisplayDiv}>
                          <div className={styles.WorkAmount}>Dauer</div>
                          <div className={styles.WorkAmount}>60 Minuten</div>
                        </div>
                      </div>
                    );
                  })}
                  <div className={styles.BorderBottom}></div>
                  <div className={styles.DisplayDiv}>
                    <div className={styles.WorkType}>Zahlbarer Gesamtbetrag</div>
                    <div className={styles.WorkAmount}> €{totalcharg()}.00</div>
                  </div>
                </div>
              </div>
              {/* center */}

              <div className={`${styles.CenterDiv} col-xl-1 col-lg-0 col-md-0 col-sm-0 col-0`}>
                <div className={styles.BorderDoted}></div>
              </div>

              <div className=" col-xl-5 col-lg-12">
                {/* second Card */}
                <div className={`${styles.CardContainer} ${styles.PaymentCardsShadow} ${styles.ProCardsShadowClass}  `}>
                  <div className={styles.CardHeading}>Kreditkarten-Info</div>
                  {/* Card  start */}
                  <div>
                    <div className="row mt-4">
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 col-12">
                        <Cards classNames={styles.DebitCardsDiv} cvc={cardValues.cvc} expiry={cardValues.expiry} name={cardValues.name} number={cardValues.number} focused={cardValues.focus} />
                      </div>
                    </div>
                    <Form>
                      <div className="form-row mt-2">
                        {/* name */}
                        <Form.Group className="col-md-12">
                          <Form.Label className={styles.InputLabel}>Name des Karteninhabers</Form.Label>
                          <Form.Control
                            className={styles.CraditCardInput}
                            type="text"
                            placeholder="Name des Karteninhabers"
                            name="name"
                            onChange={(e) => {
                              onHandleChange(e);
                            }}
                            onFocus={(e) => {
                              onHandleFocus(e);
                            }}
                          />
                        </Form.Group>
                        {/*   Card Number*/}
                        <Form.Group className="col-md-12">
                          <Form.Label className={styles.InputLabel}>Kartennummer</Form.Label>
                          <InputGroup>
                            <Form.Control
                              className={styles.CraditCardInput}
                              type="number"
                              placeholder="-----  -----  -----  -----"
                              name="number"
                              value={cardValues.number}
                              onChange={(e) => {
                                onHandleChange(e);
                              }}
                              onFocus={(e) => {
                                onHandleFocus(e);
                              }}
                            />
                          </InputGroup>
                        </Form.Group>
                      </div>
                      <div className="row">
                        <Form.Group className="  col-lg-6">
                          <Form.Label className={styles.InputLabel}>Ablaufdatum</Form.Label>
                          <Form.Control
                            className={styles.CraditCardInput}
                            type="text"
                            placeholder=" MM/YY"
                            name="expiry"
                            value={expire}
                            onChange={(e) => {
                              onHandleExpire(e) || onHandleChange(e);
                            }}
                            onFocus={(e) => {
                              onHandleFocus(e);
                            }}
                          />
                        </Form.Group>

                        <Form.Group className=" col-lg-6">
                          <Form.Label className={styles.InputLabel}>CVC</Form.Label>
                          <Form.Control
                            className={styles.CraditCardInput}
                            type={"number"}
                            placeholder="---"
                            name="cvc"
                            value={cardValues?.cvc}
                            onChange={(e) => {
                              onHandleChange(e);
                            }}
                            onFocus={(e) => {
                              onHandleFocus(e);
                            }}
                          />
                        </Form.Group>
                        <p style={{ color: "red" }}>{error && error?.output}</p>
                      </div>
                    </Form>
                    <div className="mt-5" style={{ width: "100%", height: "35px" }}></div>
                    <ZouluButton
                      className={`${styles.PaymentButton} mt-5 ${styles.PaymentButton}`}
                      title="Senden"
                      onClick={() => {
                        booking();
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AddressModal
          show={locationModal}
          setShow={(e) => setLocationModal(e)}
          // setDeepTissueMassage={(e) => setDeepTissueMassage(e)}
          setAddress={(e) => setAdress(e)}
          address={address}
          manageDisplay={manageDisplay}
          userID={userID?._id}
          cart={cart}
          // cartData={cartData}
          // setCartData={(e) => setCartData(e)}
        />
      </div>
    </>
  );
};
export default Index;
