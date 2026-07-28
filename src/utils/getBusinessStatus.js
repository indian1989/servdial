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
      .toLocaleDateString("en-US", {
        weekday:"long"
      })
      .toLowerCase();


  const todayHours = hours[today];


  if (!todayHours) {
    return null;
  }


  // closed manually
  if (todayHours.closed === true) {
    return {
      available:true,
      status:"closed",
      text:"Closed Today"
    };
  }


  // empty hours
  if (
    !todayHours.open ||
    !todayHours.close
  ) {
    return null;
  }



  const parseTime = (time)=>{

    if(!time) return null;


    const parts =
      time.trim().split(" ");


    let hourMinute = parts[0];

    const modifier =
      parts[1];


    let [
      hour,
      minute
    ] =
      hourMinute
      .split(":")
      .map(Number);



    if(Number.isNaN(hour) ||
       Number.isNaN(minute)
    ){
      return null;
    }



    // AM PM support
    if(modifier==="PM" && hour !== 12){
      hour += 12;
    }


    if(modifier==="AM" && hour === 12){
      hour = 0;
    }


    return hour * 60 + minute;

  };



  const openTime =
    parseTime(todayHours.open);


  const closeTime =
    parseTime(todayHours.close);



  if(
    openTime === null ||
    closeTime === null
  ){
    return null;
  }



  const now = new Date();


  const currentTime =
    now.getHours()*60 +
    now.getMinutes();



  if(
    currentTime >= openTime &&
    currentTime <= closeTime
  ){

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