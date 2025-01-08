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

import s from "./styles.module.css";

interface Props {
  addNotification: (notification: Omit<NotificationValues, "id">) => void;
}

const Home: React.FC<Props> = ({ addNotification }) => {
  const blockBtnRef = useRef<HTMLButtonElement>(null),
    [viewed, setViewed] = useState(
      localStorage.getItem("block-instructions") ? true : false
    );

  return (
    <Layout>
      <Header title={!viewed ? "Instructions" : "Treasure Map"} />
      <Content
        addCoins={!viewed ? "coins1" : "coins2"}
        {...(!viewed && {
          style: { padding: "30px 30px 14px 30px" }
        })}
      >
        {!viewed ? (
          <>
            <div className={s.notViewed}>
              <ul>
                <li>
                  <p>Visit each island to answer the questions</p>
                </li>
                <li>
                  <p>
                    Click on raffle page, to use your free registration
                    dubl-u-nes
                  </p>
                </li>
              </ul>

              <div>
                <button
                  className={`${s.blockBtn} fade move`}
                  ref={blockBtnRef}
                  onClick={() => {
                    const blockBtn = blockBtnRef.current!;

                    localStorage.setItem("block-instructions", "true");
                    addNotification({
                      error: false,
                      content: "Instructions are now blocked. ✔",
                      close: false,
                      duration: 4000
                    });
                    blockBtn.disabled = true;
                  }}
                >
                  Don't show this again
                </button>
                <button
                  className="okBtn flip"
                  onClick={() => setViewed(true)}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={s.viewed}>
              {treasureMapNavContent.map((content) => (
                <MapNavigation
                  key={content.txt}
                  img={content.img}
                  txt={content.txt}
                  to={content.to}
                  disableOn={content.disableOn}
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
  addNotification: (notification: Omit<NotificationValues, "id">) =>
    dispatch(addNotification(notification))
});

export default connect(null, mapDispatchToProps)(Home);
