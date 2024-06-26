import React from "react";
import MediaPlayer from "./MediaPlayer";
import bg from "../../img/bg-90s.png"

const Home = () => {
  return (
    <>
      <section style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover" }}>
        <MediaPlayer />
      </section>
    </>
  );
};

export default Home;
