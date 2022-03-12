require("dotenv").config();
const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const jwt = require("jsonwebtoken");
// ticket schema
const ticketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Students",
  },
  scheduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Schedules",
  },
  routeName: {
    type: String,
    required: true,
    maxlength: 255,
  },
  price: {
    type: Number,
    min: 1,
    max: 1000,
  },
  numberOfTicket: {
    type: Number,
    required: true,
    min: 1,
    max: 4,
  },
  bookedSeats: {
    type: [String],
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

ticketSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      userId: this.userId,
      scheduleId: this.scheduleId,
      numberOfTicket: this.numberOfTicket,
      bookedSeats: this.bookedSeats,
      routeName: this.from,
    },
    process.env.JWT_TOKEN_SECRET,
    {
      expiresIn: "30m",
    }
  );
};

const Ticket = new mongoose.model("Ticket", ticketSchema);

// joi validation
const validation = (body) => {
  // joi schema
  const schema = Joi.object({
    userId: Joi.objectId().required(),
    scheduleId: Joi.objectId().required(),
    from: Joi.string().max(255).required(),
    to: Joi.string().max(255).required(),

    numberOfTicket: Joi.number().min(1).max(4).required(),
  });

  return schema.validate(body);
};

module.exports.Ticket = Ticket;
module.exports.ticketValidation = validation;
