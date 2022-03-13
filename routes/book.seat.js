const express = require("express");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { Schedule } = require("../models/schedule");
const { Student } = require("../models/student");
const { Employee } = require("../models/employee");
const { Teacher } = require("../models/teacher");
const { Ticket } = require("../models/ticket");
const { RequestNewBus } = require("../models/request.new.bus");
const auth = require("../middleware/auth");
const booked = require("../middleware/booking");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/:id", auth, async (req, res) => {
  const schedule = await Schedule.find({ _id: req.params.id });

  res.render("bookSeat", { responce: schedule });
});

router.post("/:id", [auth, booked], async (req, res) => {
  const { error } = validation(req.body);

  if (error) {
    req.flash("error_msg", error.details[0].message);
    return res.redirect("/search");
  }

  let schedule = await Schedule.findById(req.params.id);
  if (schedule.length === 0) {
    req.flash(
      "error_msg",
      "No bus found! Try with different location or time."
    );
    return res.redirect("/search");
  }

  // console.log(schedule.availabeSeats);

  const requestNewBus = await RequestNewBus.find({
    bookedSchedule: schedule._id,
  });
  if (requestNewBus.length === 0) {
    if (schedule.availabeSeats <= 10) {
      const requestNewBus = new RequestNewBus({
        bookedSchedule: schedule._id,
        routeName: schedule.routeName,
      });
      await requestNewBus.save();
    }
  }

  let selectedSeatNumber = 0;
  const requestSeats = [];

  // push selected seats in an array
  if (req.body.seatOne) requestSeats.push(req.body.seatOne.trim());
  if (req.body.seatTwo) requestSeats.push(req.body.seatTwo.trim());
  if (req.body.seatThree) requestSeats.push(req.body.seatThree.trim());
  if (req.body.seatFour) requestSeats.push(req.body.seatFour.trim());

  // removed empty string
  const selectedSeats = requestSeats.filter((element) => {
    return element !== "";
  });

  let user;

  // check user
  if (req.user.role[0] === "Student")
    user = await Student.findById(req.user._id);
  if (req.user.role[0] === "Teacher")
    user = await Teacher.findById(req.user._id);
  if (req.user.role[0] === "Employee")
    user = await Employee.findById(req.user._id);
  // console.log(user);
  if (!user) {
    res.clearCookie("jwt");
    res.clearCookie("booked");
    req.flash("error_msg", "Acess denied. Please login.");
    return res.redirect("/auth/student/login");
  }

  // check user have booked ticket but cleard cookies
  // if booked is availabe
  let checkUserBooking = await Ticket.find({
    userId: user._id,
    scheduleId: schedule._id,
  });

  if (!req.cookies.booked) {
    // check schedule again
    schedule = await Schedule.findById(req.params.id);
    if (schedule.length === 0) {
      req.flash(
        "error_msg",
        "No bus found! Try with different location or time."
      );
      return res.redirect("/search");
    }

    // check and assign new seat
    if (selectedSeats.length > schedule.availabeSeats) {
      req.flash(
        "error_msg",
        `${selectedSeats.length} seat(s) are/is not available`
      );
      return res.redirect("/search");
    }

    // removed duplicate seats
    for (let i = 0; i < schedule.bookedSeats.length; i++) {
      index = selectedSeats.indexOf(schedule.bookedSeats[i]);
      if (index > -1) {
        selectedSeats.splice(index, 1);
      }
    }

    // console.log(`outside of check booking`);
    // update if no booking found
    if (checkUserBooking.length === 0) {
      // console.log(`on check bookign `);
      const ticket = new Ticket({
        userId: user._id,
        scheduleId: schedule._id,
        routeName: schedule.routeName,
        numberOfTicket: selectedSeats.length,
        bookedSeats: selectedSeats,
      });
      await ticket.save();

      schedule.availabeSeats = schedule.availabeSeats - selectedSeats.length;
      schedule.bookedBy = ticket._id;
      schedule.bookedSeats.push(...selectedSeats);
      if (req.user.gender === "female")
        schedule.femaleSeats.push(...selectedSeats);

      await schedule.save();

      // sign booked token
      const token = ticket.generateAuthToken();

      res.cookie("booked", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 30,
      });
      if (selectedSeats.length > 0) {
        req.flash(
          "success_msg",
          `${selectedSeats.length} seat(s) is/are already booked!`
        );
      } else {
        req.flash(
          "success_msg",
          `${selectedSeats.length} seat(s) is/are booked. Check dashboard for more details`
        );
      }
      return res.redirect("/search");
    }
  }

  let ticket = checkUserBooking;

  // check and assign new seat
  if (selectedSeats.length > schedule.availabeSeats) {
    req.flash(
      "error_msg",
      `${selectedSeats.length} seat(s) are/is not available`
    );
    return res.redirect("/search");
  } else if (selectedSeats.length + ticket[0].numberOfTicket > 4) {
    req.flash(
      "error_msg",
      `${selectedSeats.length} seat(s) can not be added. One can book 4 sits.`
    );
    return res.redirect("/search");
  }

  // removed duplicate seats
  for (let i = 0; i < schedule.bookedSeats.length; i++) {
    index = selectedSeats.indexOf(schedule.bookedSeats[i]);
    if (index > -1) {
      selectedSeats.splice(index, 1);
    }
  }

  // update booking and all
  ticket = await Ticket.findById(checkUserBooking[0]._id);

  ticket.numberOfTicket = selectedSeats.length + ticket.numberOfTicket;
  ticket.bookedSeats.push(...selectedSeats);
  await ticket.save();

  schedule.availabeSeats = schedule.availabeSeats - selectedSeats.length;
  schedule.bookedBy = ticket._id;
  schedule.bookedSeats.push(...selectedSeats);
  if (req.user.gender === "female") schedule.femaleSeats.push(...selectedSeats);
  await schedule.save();

  if (selectedSeats.length > 0) {
    req.flash(
      "success_msg",
      `${selectedSeats.length} seat(s) is/are already booked!`
    );
  } else {
    req.flash(
      "success_msg",
      `${selectedSeats.length} seat(s) is/are booked. Check dashboard for more details`
    );
  }

  return res.redirect("/search");
});

const validation = (body) => {
  const schema = Joi.object({
    start: Joi.string().required(),
    destination: Joi.string().required(),
    startTime: Joi.string().required(),
  });

  return schema.validate(body);
};
module.exports = router;
