// utils/getBusinessStatus.js


export const getBusinessStatus = (business) => {

  const hours =
    business?.businessHours ||
    business?.openingHours;


  // No hours
  if (!hours || typeof hours !== "object") {
    return null;
  }


  const today =
    new Date()
      .toLocaleDateString(
        "en-US",
        {
          weekday: "long"
        }
      )
      .toLowerCase();



  const todayHours = hours[today];


  if (!todayHours) {
    return null;
  }



  // Manual closed
  if (todayHours.closed === true) {

    return {
      available:true,
      status:"closed",
      text:"Closed Today"
    };

  }



  // 24 Hours
  if(todayHours.is24h){

    return {
      available:true,
      status:"open",
      text:"Open Now"
    };

  }




  if(
    !todayHours.open ||
    !todayHours.close
  ){

    return null;

  }





  // ==========================
  // TIME CONVERTER
  // ==========================

  const parseTime = (time)=>{


    if(!time) return null;


    time = time
      .toString()
      .trim()
      .toUpperCase();



    let hour;
    let minute;



    // 24 hour format
    // 07:00
    if(
      !time.includes("AM") &&
      !time.includes("PM")
    ){

      [
        hour,
        minute
      ] =
      time
      .split(":")
      .map(Number);

    }



    // AM PM format
    else {


      const parts =
        time.split(" ");


      const timePart =
        parts[0];


      const modifier =
        parts[1];



      [
        hour,
        minute
      ] =
      timePart
      .split(":")
      .map(Number);



      if(
        modifier === "PM" &&
        hour !== 12
      ){

        hour += 12;

      }



      if(
        modifier === "AM" &&
        hour === 12
      ){

        hour = 0;

      }


    }




    if(
      Number.isNaN(hour) ||
      Number.isNaN(minute)
    ){

      return null;

    }



    return (
      hour * 60 +
      minute
    );


  };





  const openTime =
    parseTime(
      todayHours.open
    );


  const closeTimeRaw =
    parseTime(
      todayHours.close
    );




  if(
    openTime === null ||
    closeTimeRaw === null
  ){

    return null;

  }





  // ==========================
  // MIDNIGHT NORMALIZATION
  // 12:00 AM = 24:00
  // ==========================


  const closeTime =
    closeTimeRaw === 0
      ? 1440
      : closeTimeRaw;






  const now = new Date();



  const currentTime =
    now.getHours() * 60 +
    now.getMinutes();






  let isOpen = false;




  // Normal timing
  // Example 07:00 - 18:00

  if(closeTime > openTime){


    isOpen =
      currentTime >= openTime &&
      currentTime <= closeTime;


  }



  // Overnight timing
  // Example 22:00 - 02:00

  else {


    isOpen =
      currentTime >= openTime ||
      currentTime <= closeTime;


  }






  if(isOpen){


    return {

      available:true,

      status:"open",

      text:"Open Now"

    };


  }




  return {

    available:true,

    status:"closed",

    text:"Closed Now"

  };


};