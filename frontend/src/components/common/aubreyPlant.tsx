import React from "react";
import "../../styles/aubreyPlant.scss";

const AubreyPlant: React.FC = () => {
  return (
    <section className="main-content">
      <div className="text-content">
        <h1>GreenThumb Tracker</h1>
        <p>Monitor and nurture your plants with ease.</p>
      </div>

      <div className="plant-container">
        <div className="plant-upper">
          <img
            src="../../../public/aubrey-head-open.png"
            className="plant-head"
            alt="Aubrey Head"
          />
          <img
            src="../../../public/aubrey-torso.png"
            className="plant-torso"
            alt="Aubrey Body"
          />
        </div>
        <img
          src="../../../public/aubrey-pot.png"
          className="plant-pot"
          alt="Aubrey Pot"
        />
      </div>
    </section>
  );
};

export default AubreyPlant;
