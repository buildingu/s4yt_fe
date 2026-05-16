import { Link } from "react-router-dom";
import { connect } from "react-redux";
import type { GameConfigReduxState } from "@reducers/gameConfig";

import s from "./styles.module.css";

const disabled = false;
interface Props {
  img: { src: string; alt: string };
  to: string;
  disableOn?: readonly string[];
  position?: { x: number; y: number };
  gameConfig: GameConfigReduxState;
  size?: number;
}

const MapNavigation: React.FC<Props> = ({ img, to, disableOn, position, gameConfig, size = 130 }) => {
  const disabled =
    !to ||
    disableOn?.includes(
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

  const cardStyle: React.CSSProperties = {
    position: "absolute",
    left: position?.x ?? 0,
    top: position?.y ?? 0,
    width: size,
    height: size,
  };

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