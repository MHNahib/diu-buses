let totalselected = [];

// check the seat is selected
const checkSelected = (list) => list.find((element) => element === "selected");
const checkBooking = (list) => {
  const booked = list.find((element) => element === "booked");
  const bookedF = list.find((element) => element === "bookedF");
  if (booked === undefined && bookedF === undefined) {
    // console.log(undefined);
    return undefined;
  } else {
    // console.log(false);
    return true;
  }
};

const updateSelection = () => {
  if (totalselected.length > 0) {
    if (totalselected[0] !== undefined) {
      document.getElementById("selectedOne").innerText = totalselected[0];
      document.getElementById("seatOne").value = totalselected[0];
    }
    if (totalselected[1] !== undefined) {
      document.getElementById("selectedTwo").innerText = totalselected[1];
      document.getElementById("seatTwo").value = totalselected[1];
    }
    if (totalselected[2] !== undefined) {
      document.getElementById("selectedThree").innerText = totalselected[2];
      document.getElementById("seatThree").value = totalselected[2];
    }
    if (totalselected[3] !== undefined) {
      document.getElementById("selectedFour").innerText = totalselected[3];
      document.getElementById("seatFour").value = totalselected[3];
    }
  }
};

const clearSelection = () => {
  document.getElementById("selectedOne").innerText = "";
  document.getElementById("seatOne").value = "";
  document.getElementById("selectedTwo").innerText = "";
  document.getElementById("seatTwo").value = "";
  document.getElementById("selectedThree").innerText = "";
  document.getElementById("seatThree").value = "";
  document.getElementById("selectedFour").innerText = "";
  document.getElementById("seatFour").value = "";
};

// selected seat
const selectedSeat = (seat) => {
  // console.log(seat);
  const seatId = document.getElementById(seat).className;
  const checkClass = seatId.split(" ");
  clearSelection();

  // validation
  if (!checkSelected(checkClass) && !checkBooking(checkClass)) {
    if (totalselected.length <= 3) {
      totalselected.push(seat);
      console.log(totalselected);
      document.getElementById(seat).classList.add("selected");
    } else {
      alert("Maximum 4 seats can be selectd");
    }

    updateSelection();
  } else {
    document.getElementById(seat).classList.remove("selected");
    totalselected = totalselected.filter((item) => item !== seat);
    console.log(totalselected);
    clearSelection();
    updateSelection();
  }
};

// add booked options on seat
window.addEventListener("load", (event) => {
  let value = document
    .getElementById("selectedSeatsId")
    .value.replace(/\s+/g, " ")
    .trim();
  let female = document
    .getElementById("femaleSeatsId")
    .value.replace(/\s+/g, " ")
    .trim();

  const bookedSeats = value.split(",");
  const femaleSeats = female.split(",");

  // remove seats from men
  for (let i = 0; i < bookedSeats.length; i++) {
    index = bookedSeats.indexOf(femaleSeats[i]);
    if (index > -1) {
      bookedSeats.splice(index, 1);
    }
  }

  // console.log(bookedSeats);
  // console.log(femaleSeats);

  for (let i = 0; i < bookedSeats.length; i++)
    document.getElementById(bookedSeats[i].toString()).classList.add("booked");

  for (let i = 0; i < femaleSeats.length; i++)
    document.getElementById(femaleSeats[i].toString()).classList.add("bookedF");
});
