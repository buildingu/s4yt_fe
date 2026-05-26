import { Link } from "react-router-dom";
import { connect } from "react-redux";
import type { GameConfigReduxState } from "@reducers/gameConfig";

import s from "./styles.module.css";

interface Props {
  img: { src: string; alt: string };
  to?: string; 
  disableOn?: readonly string[];
  position?: { x: number; y: number };
  gameConfig: GameConfigReduxState;
  size?: number;
}

const MapNavigation: React.FC<Props> = ({ img, to, disableOn, position, gameConfig, size = 130 }) => {
  
  const cardStyle: React.CSSProperties = {
    position: "absolute",
    left: position?.x ?? 0,
    top: position?.y ?? 0,
    width: size,
    height: size,
  };

if (!to) {
  return (
    <div style={cardStyle} className={`${s.card} ${s.noLink}`}>
      <img src={img.src} alt={img.alt} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </div>
  );
}
  const disabled = disableOn?.includes(
    gameConfig.preGame
      ? "preGame"
      : gameConfig.gameStart
      ? "gameStart"
      : gameConfig.reviewStart
      ? "reviewStart"
      : gameConfig.winnersAnnounced
      ? "winnersAnnounced"
      : ""
  );

  return (
    <Link
      to={to}
      className={s.card}
      style={cardStyle}
      {...(disabled && { "aria-disabled": true, onClick: (e: React.MouseEvent) => e.preventDefault() })}
    >
      <img src={img.src} alt={img.alt} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </Link>
  );
};

const mapStateToProps = ({ gameConfig }: { gameConfig: GameConfigReduxState }) => ({ gameConfig });

export default connect(mapStateToProps)(MapNavigation);