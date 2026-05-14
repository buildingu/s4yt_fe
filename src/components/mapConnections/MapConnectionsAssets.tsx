import React from "react";
import { connect } from "react-redux";
import type { GameConfigReduxState } from "@reducers/gameConfig";

import DL_01 from "../../assets/images/NewMap/dl_01.png";
import DL_02 from "../../assets/images/NewMap/DL_02.png";
import DL_03 from "../../assets/images/NewMap/DL_03.png";
import DL_04 from "../../assets/images/NewMap/DL_04.png";
import DL_05 from "../../assets/images/NewMap/DL_05.png";
import DL_06 from "../../assets/images/NewMap/DL_06.png";

import s from "./styles.module.css";

const MapConnectionsAssets: React.FC<{ gameConfig: GameConfigReduxState }> = () => {
  const ALWAYS_GREEN = new Set([0, 1]);

  const lines = [
    { src: DL_01, className: s.dl01 },
    { src: DL_02, className: s.dl02 },
    { src: DL_03, className: s.dl03 },
    { src: DL_04, className: s.dl04 },
    { src: DL_05, className: s.dl05 },
    { src: DL_06, className: s.dl06 },
  ];

  return (
    <>
      {lines.map((line, i) => (
        <img
          key={i}
          src={line.src}
          alt={`dotted-line-${i + 1}`}
          className={[
            s.dottedLine,
            line.className,
            ALWAYS_GREEN.has(i) ? s.completed : "",
          ].join(" ")}
          draggable={false}
        />
      ))}
    </>
  );
};

const mapStateToProps = ({ gameConfig }: { gameConfig: GameConfigReduxState }) => ({
  gameConfig,
});

export default connect(mapStateToProps)(MapConnectionsAssets);