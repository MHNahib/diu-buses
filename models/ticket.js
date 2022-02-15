const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// ticket schema
const ticketSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Students",
  },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Routes",
  },
  from: {
    type: String,
    required: true,
    maxlength: 255,
  },
  to: {
    type: String,
    required: true,
    maxlength: 255,
  },
  price: {
    type: Number,
    required: true,
    min: 1,
    max: 1000,
  },
  numberOfTicket: {
    type: Number,
    required: true,
    min: 1,
    max: 4,
  },
});

const Ticket = new mongoose.model("Ticket", ticketSchema);

// joi validation
const validation = (body) => {
  // joi schema
  const schema = Joi.object({
    studentId: Joi.objectId().required(),
    routeId: Joi.objectId().required(),
    from: Joi.string().max(255).required(),
    to: Joi.string().max(255).required(),
    price: Joi.number().min(1).max(1000).required(),
    numberOfTicket: Joi.number().min(1).max(4).required(),
  });

  return schema.validate(body);
};

module.exports.Ticket = Ticket;
module.exports.ticketValidation = validation;
