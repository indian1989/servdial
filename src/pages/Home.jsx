import { useEffect, useState } from "react";

const Home = () => {

  useEffect(() => {
    console.log("Home mounted");
  }, []);

  return (
    <div style={{ padding: "50px" }}>
      <h1>ServDial Home Working</h1>
    </div>
  );

};

export default Home;