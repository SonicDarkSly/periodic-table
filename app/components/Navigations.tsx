import React from "react";

interface NavigationsProps {
  id: number;
}

const Navigations: React.FC<NavigationsProps> = ({ id }) => {
  const goToPrevious = () => {
    if (id > 1) {
      window.location.href = `/elements/${id - 1}`;
    }
  };

  const goToNext = () => {
    if (id < 118) {
      window.location.href = `/elements/${id + 1}`;
    }
  };

  const goToTable = () => {
    window.location.href = `/table`;
  };

  return (
    <div className="navbar">
      <nav className="neon-border">
        <ul className="navigation-list">
          <li className={`nav-item`} onClick={goToTable}>
            Tableau
          </li>
          <li
            className={`nav-item ${id === 1 ? "disabled" : ""}`}
            onClick={goToPrevious}
          >
            Précédent
          </li>

          <li
            className={`nav-item ${id === 118 ? "disabled" : ""}`}
            onClick={goToNext}
          >
            Suivant
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navigations;
