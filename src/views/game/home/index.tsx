import NotificationValues from "@typings/NotificationValues";
import { useRef, useState } from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import treasureMapNavContent from "@constants/treasureMapNavContent";
import { addNotification } from "@actions/notifications";
import Layout from "@components/partials/layout";
import Header from "@components/partials/header";
import Content from "@components/partials/content";
import Status from "@components/partials/status";
import MapNavigation from "@components/mapNavigation";
import MapConnections from "@components/mapConnections/MapConnectionsAssets";
import s from "./styles.module.css";
import backMap from "src/assets/images/NewMap/back-map.png";

interface Props {
  addNotification: (notification: { error: boolean; content: string; close?: boolean; duration?: number }) => void;
}

const Home: React.FC<Props> = ({ addNotification }) => {
  const blockBtnRef = useRef<HTMLButtonElement>(null);
  const [viewed, setViewed] = useState(!!localStorage.getItem("block-instructions"));

  // Zoom and movement 
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <Layout>
      <Header title={!viewed ? "Instructions" : "Treasure Map"} />
      <Content
        addCoins={!viewed ? "coins1" : "coins2"}
        {...(!viewed && { style: { padding: "30px 30px 14px 30px" } })}
      >
        {!viewed ? (
          <div className={s.notViewed}>
            <ul>
              <li>Visit the learn and earn page to get more info about the challenges!</li>
              <li>Visit the business island to see challenges (day 3–4 / hours 49–120)</li>
              <li>Click on raffle page to use your dubl-u-nes</li>
            </ul>
            <div>
              <button
                className={`${s.blockBtn} fade move`}
                ref={blockBtnRef}
                onClick={() => {
                  localStorage.setItem("block-instructions", "true");
                  addNotification({ error: false, content: "Instructions are now blocked ✔", duration: 4000 });
                  if (blockBtnRef.current) blockBtnRef.current.disabled = true;
                }}
              >
                Don't show this again
              </button>
              <button className="okBtn flip" onClick={() => setViewed(true)} />
            </div>
          </div>
        ) : (
          <>
            {/* Controls for moving and zooming */}
            <div className={s.mapControls}>
              <button onClick={() => setScale(prev => Math.min(prev + 0.1, 2))}></button>
              <button onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))}></button>
              <button onClick={() => setPos(prev => ({ ...prev, x: prev.x - 10 }))}></button>
              <button onClick={() => setPos(prev => ({ ...prev, x: prev.x + 10 }))}></button>
              <button onClick={() => setPos(prev => ({ ...prev, y: prev.y - 10 }))}></button>
              <button onClick={() => setPos(prev => ({ ...prev, y: prev.y + 10 }))}></button>
            </div>

            <div className={s.mapContainer} style={{ position: "relative", width: "100%", height: "410px" }}>
              {/* Background map */}
              <img
                src={backMap}
                alt="Treasure Map"
                style={{
                  position: "absolute",
                  top: `calc(50% + ${-15}px)`,
                  left: `calc(50% + ${-10}px)`,
                  transform: `translate(-50%, -50%) scale(${1.4})`,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  zIndex: 0,
                  transition: "transform 0.2s ease, top 0.2s ease, left 0.2s ease",
                }}
              />

              {/* Dotted line image assets */}
              <MapConnections />

              {/* Nodes */}
              {treasureMapNavContent.map(content => (
                <MapNavigation
                  key={content.id}
                  img={content.img}
                  to={content.to}
                  disableOn={content.disableOn}
                  position={content.position}
                  size={content.size}
                />
              ))}
            </div>
          </>
        )}
      </Content>

      {viewed && <Status />}
    </Layout>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  addNotification: (notification: any) => dispatch(addNotification(notification)),
});

export default connect(null, mapDispatchToProps)(Home);