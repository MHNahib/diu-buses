const express = require("express");
const { Student } = require("../models/student");
const { Route } = require("../models/route");
const { ticketValidation, Ticket } = require("../models/ticket");
const mongoose = require("mongoose");
const Joi = require("joi");

const router = express.Router();

// get ticket details form student id
router.get("/:studentId", async (req, res) => {
  // vaidtate student id
  const { error } = validation({ studentId: req.params.studentId });
  if (error) return res.status(400).send(error.details[0].message);

  // check student is exist or not
  const user = await Student.findOne({ studentId: req.params.studentId });
  if (!user)
    return res.status(404).send(`${req.params.studentId} is not found`);

  // check user have parchased ticket or not
  const ticket = await Ticket.find({ studentId: user._id });
  if (!ticket) return res.status(404).send(`No ticket found`);

  res.send(ticket);
});

// buy ticket by student id
router.post("/", async (req, res) => {
  // vaidtate student id
  let { error } = validation({ studentId: req.body.studentId });
  if (error) return res.status(400).send(error.details[0].message);

  // check student is exist or not
  const user = await Student.findOne({ studentId: req.body.studentId });
  if (!user) return res.status(404).send(`${req.body.studentId} is not found`);

  // change request body student id with user._id
  req.body.studentId = user._id;

  // vaidate request body
  error = ticketValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check route
  //   const route = await Route.fi

  const ticket = new Ticket({
    studentId: Joi.objectId().required(),
    routeId: Joi.objectId().required(),
    from: Joi.string().max(255).required(),
    to: Joi.string().max(255).required(),
    price: Joi.number().min(1).max(1000).required(),
    numberOfTicket: Joi.number().min(1).max(4).required(),
  });

  res.send(ticket);
});

// delete ticket
router.delete("/:id", async (req, res) => {
  const route = await Ticket.findByIdAndRemove(req.params.id);

  if (!route) return res.status(404).send("Ticket not found");

  res.send(`successfully removed`);
});

// student id validatoin
const validation = (studentId) => {
  // joi schema
  const schema = Joi.object({
    studentId: Joi.string().max(12).min(12).required(),
  });

  return schema.validate(studentId);
};

module.exports = router;

/**
 * todo: update ticket & add middleware and update api
 */
