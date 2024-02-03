import { UserReduxState } from "@reducers/user";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dispatch } from "redux";
import { connect } from "react-redux";

import updateField from "@utils/forms/updateField";
import checkValidity from "@utils/forms/checkValidity";
import checkValidPlayerId from "@utils/forms/checkValidPlayerId";
import delay from "@utils/delay";

import { loginPlayer } from "@actions/user";

import Layout from "@components/partials/layout";
import Header from "@components/partials/header";
import Content from "@components/partials/content";
import Input from "@components/forms/controls/Input";

import s from "./styles.module.css";

interface Props {
  userToken: string | undefined;
  loginPlayer: (
    userData: LoginFormData,
    setForm: React.Dispatch<
      React.SetStateAction<{
        processing: boolean;
      }>
    >
  ) => Promise<any>;
}

interface LoginFormData {
  player_id: string;
  password: string;
}

const Login: React.FC<Props> = ({ userToken, loginPlayer }) => {
    const [form, setForm] = useState({
      processing: false,
    }),
    [currentData, setCurrentData] = useState<LoginFormData>({
      player_id: "",
      password: "",
    });

  useEffect(() => {
    if (localStorage.getItem("persist:root") && !userToken && !localStorage.getItem("loginLoaded")) 
    {
      localStorage.removeItem("persist:root");
      delay(1000, () => {
        window.location.reload();
        localStorage.setItem("loginLoaded", "true");
      });
    }
  }, []);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fields =
      document.querySelectorAll<HTMLInputElement>("#loginForm input");
    let valid = true;

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      if (field.name === "player_id") {
        checkValidPlayerId(field);
      } else {
        checkValidity(field);
      }

      if (!field.validity.valid && valid) valid = false;
    }

    if (valid) {
      setForm((prev) => ({ ...prev, processing: true }));
      await loginPlayer(currentData, setForm);
    }
  };

  return (
    <Layout style={{ position: "relative", maxWidth: "600px" }}>
      <Header title="Login" />
      <Content addCoins="coins1">
        <form
          id="loginForm"
          onSubmit={(e) => submit(e)}
          className={s.form}
          autoComplete="off"
          noValidate
        >
          <div role="presentation">
            <label htmlFor="player_id">Player Id</label>
            <Input
              id="player_id"
              name="player_id"
              type="text"
              errorMsg="Not a valid player ID."
              onChange={(e) => updateField<LoginFormData>(e, setCurrentData)}
              disabled={form.processing}
              autoComplete="off"
              required
            />
          </div>

          <div role="presentation">
            <label htmlFor="password" aria-label="Password">
              Pass
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              onChange={(e) => updateField<LoginFormData>(e, setCurrentData)}
              disabled={form.processing}
              autoComplete="off"
              minLength={8}
              maxLength={24}
              required
            />
          </div>

          <div role="presentation">
            <Link to="/login/forgot" className={`${s.forgot} fade move`}>
              Forgot pass?
            </Link>
          </div>

          <div role="presentation">
            <button className="okBtn" disabled={form.processing}></button>
          </div>
        </form>
        <Link className="fade" to="/register" />
      </Content>
      <a
        href="https://building-u.com/privacy/"
        target="_blank"
        rel="noopener noreferrer"
        className="privacy fade move"
        style={{
          position: "absolute",
          right: 30,
          bottom: "-24px",
        }}
      >
        Private Policy
      </a>
    </Layout>
  );
};

const mapStateToProps = ({ user }: { user: UserReduxState }) => ({
  userToken: user.token,
});
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  loginPlayer: (
    userData: LoginFormData,
    setForm: React.Dispatch<
      React.SetStateAction<{
        processing: boolean;
      }>
    >
  ) => dispatch(loginPlayer(userData, setForm) as unknown) as Promise<any>,
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
