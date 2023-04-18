import connectDB from "../../../../midleware/connectDB";
import Category from "../../../../models/Category";
import ExpertProfile from "../../../../models/ExpertProfile";
import Booking from "../../../../models/Booking";
import Formidable from "formidable";
import moment from "moment";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  try {
    if (req.method === "POST") {
      const form = new Formidable.IncomingForm();
      form.parse(req, async (err, fields, files, query) => {
        const timeSlots = {
          "00:01": [],
          "00:30": [],
          "01:00": [],
          "01:30": [],
          "02:00": [],
          "02:30": [],
          "03:00": [],
          "03:30": [],
          "04:00": [],
          "04:30": [],
          "05:00": [],
          "05:30": [],
          "06:00": [],
          "06:30": [],
          "07:00": [],
          "07:30": [],
          "08:00": [],
          "08:30": [],
          "09:00": [],
          "09:30": [],
          "10:00": [],
          "10:30": [],
          "11:00": [],
          "11:30": [],
          "12:00": [],
          "12:30": [],
          "13:00": [],
          "13:30": [],
          "14:00": [],
          "14:30": [],
          "15:00": [],
          "15:30": [],
          "16:00": [],
          "16:30": [],
          "17:00": [],
          "17:30": [],
          "18:00": [],
          "18:30": [],
          "19:00": [],
          "19:30": [],
          "20:00": [],
          "20:30": [],
          "21:00": [],
          "21:30": [],
          "22:00": [],
          "22:30": [],
          "23:00": [],
          "23:30": [],
          "24:00": [],
        };

        const days = [
          "Sonntag",
          "Montag",
          "Dienstag",
          "Mittwoch",
          "Donnerstag",
          "Freitag",
          "Samstag",
        ];

        if (!fields.date || !fields.coordinates || !fields.categoryId)
          return res
            .status(400)
            .json({ msg: "date, coordinates & categoryId are required" });

        let checkCategory = await Category.findOne({
          _id: fields.categoryId,
        }).populate({ path: "services", populate: { path: "packages" } });
        if (!checkCategory)
          return res.status(404).json({
            msg: `no category exists against id: ${fields.categoryId}`,
          });
        let coordinates = JSON.parse(fields.coordinates);
        let categoryExperts = await ExpertProfile.find({
          treatments: {
            $elemMatch: { category_id: checkCategory._id, approved: true },
          },
        });
        let expertsInRadius = new Array();
        for (const categoryExpert of categoryExperts) {
          expertsInRadius = await ExpertProfile.find({
            treatments: {
              $elemMatch: { category_id: checkCategory._id, approved: true },
            },
            availability: { $ne: [] },
            location: {
              $near: {
                $maxDistance: categoryExpert.radius * 1000,
                $geometry: {
                  type: "Point",
                  coordinates: [coordinates.long, coordinates.lat],
                },
              },
            },
          }).populate([
            { path: "treatments.category_id", populate: { path: "services" } },
            { path: "user_id" },
            { path: "expert_services" },
          ]);
        }
        let rating = 0;
        let ratingCount = 0;
        let expertHavingRadius = [];
        console.log(expertsInRadius, "expertsInRadius");
        for (let expert of expertsInRadius) {
          var expertss = expert.expert_services.find((e) => {
            if (
              e.services.service_id.toString() === fields.serviceId.toString()
            ) {
              return e;
            }
          });

          if (!expertss) {
            continue;
          }
          if (JSON.parse(fields.packages).length > 0) {
            let foundPackage = false;
            for (const packageid of JSON.parse(fields.packages)) {
              var expertspackage = expertss.services.packages.find((e) => {
                console.log(e.package_id.toString(), packageid.toString());
                if (e.package_id.toString() === packageid.toString()) {
                  return e.package_id.toString();
                }
              });

              if (!expertspackage) {
                foundPackage = false;
                break;
              } else {
                foundPackage = true;
              }
            }
            if (!foundPackage) {
              continue;
            }
          }
          console.log(expert, "expert341");
          expert = expert.toObject();
          let completedBookings = await Booking.find(
            {
              status: "checkedOut",
              products: {
                $elemMatch: {
                  status: { $eq: "confirmed" },
                  expert_id: expert.user_id._id.toString(),
                },
              },
            },
            {
              products: {
                $elemMatch: {
                  status: { $eq: "confirmed" },
                  expert_id: expert.user_id._id.toString(),
                },
              },
            }
          );
          for (const booking of completedBookings) {
            for (const product of booking.products) {
              if (
                product.expert_id.toString() ===
                  expert.user_id._id.toString() &&
                product.status === "confirmed" &&
                product.rating > 0
              ) {
                rating += product.rating;
                ratingCount++;
                expert.rating = ratingCount > 0 ? rating / ratingCount : 0;
              }
            }
          }

          expertHavingRadius.push(expert);
        }

        // for (const expertInRadius of expertsInRadius) {
        //   let day = new Date(`${fields.date}`).getDay();
        //   let availability = expertInRadius.availability.find((e) => e.available === true && days[day] === e.day);
        //   for (let i = availability?.start_time?.split(":")[0] * 60 + 30; i <= availability?.end_time?.split(":")[0] * 60; i += 30) {
        //     let hours = Math.floor(i / 60);
        //     let minutes = i % 60;
        //     let time = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
        //     let booking = await Booking.findOne({ status: "paid", products: { $elemMatch: { date: fields.date, start_time: availability?.start_time } } });
        //     let currentTime = new Date();
        //     let selectedTime = new Date(`${fields.date} ${time}`);
        //     if (currentTime.getTime() > selectedTime.getTime()) {
        //       continue; // skip this time slot as it's in the past
        //     }
        //     if (
        //       !booking &&
        //       expertInRadius.expert_services?.find((ele) => ele?.services?.service_id.toString() === fields?.serviceId.toString())?.services?.packages?.length ===
        //         checkCategory?.services?.find((ele) => ele?._id?.toString() === fields?.serviceId?.toString())?.packages?.length &&
        //       expertInRadius.expert_services &&
        //       !expertInRadius.expert_services?.services?.packages?.find((e) => e?.price)
        //     )
        //       timeSlots[time].push(expertInRadius);
        //   }
        // }
        const bookings = await Booking.aggregate([
          { $match: { status: "paid", "products.date": fields.date } },
          { $project: { start_time: "$products.start_time" } },
          { $unwind: "$start_time" },
        ]);
        const selectedDate = new Date(`${fields.date}`);
        const expertServices = expertHavingRadius.map(
          (expert) => expert.expert_services
        );
        for (const expert of expertHavingRadius) {
          console.log(expert, "availability2");
          const day = selectedDate.getDay();

          const availability = expert.availability.find(
            (e) => e.available === true && days[day] === e.day
          );

          if (!availability) {
            continue;
          }

          const startMinutes = parseInt(availability.start_time.split(":")[1]);

          const start =
            parseInt(availability.start_time.split(":")[0]) +
            (startMinutes === 30 ? 0.5 : 0);
          console.log(
            parseInt(availability.start_time.split(":")[0]),
            startMinutes,
            "startstrat"
          );
          const end = parseInt(availability.end_time.split(":")[0]);

          for (let i = start * 60; i <= end * 60; i += 30) {
            const hours = Math.floor(i / 60);
            const minutes = i % 60;
            console.log(minutes);
            let time = `${hours.toString().padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}`;

            const booking = bookings.find(
              (b) => b.start_time === availability.start_time
            );

            if (booking) {
              continue;
            }
            let currentTime = new Date();
            let selectedTime = new Date(`${fields.date} ${time}`);
            console.log(currentTime, selectedTime, "new Date()");
            console.log(
              currentTime.getTime(),
              selectedTime.getTime(),
              "getTime"
            );
            if (currentTime.getTime() > selectedTime.getTime()) {
              continue;
            }
            console.log(time, "after Filter");
            // const expertService = expertServices.find((es) =>
            //   es.some(
            //     (e) =>
            //       e.services.service_id.toString() ===
            //       fields.serviceId.toString()
            //   )
            // );
            // if (!expertService) {
            //   continue;
            // }
            const categoryService = checkCategory.services.find(
              (s) => s._id.toString() === fields.serviceId.toString()
            );
            if (!categoryService) {
              continue;
            }

            if (time == "00:00") {
              time = "00:01";
            }

            timeSlots[time].push(expert);
          }
        }
        let slots = Object.entries(timeSlots).reduce(
          (a, [k, v]) => (v.length === 0 ? a : ((a[k] = v), a)),
          {}
        );
        return res
          .status(200)
          .json({ msg: "list of available slots with experts", data: slots });
      });
    }
  } catch (err) {
    if (err.kind === "ObjectId")
      return res.status(400).json({ msg: "invalid id format" });
    return res.status(500).json({ msg: "Server Error" });
  }
};

export default connectDB(handler);
