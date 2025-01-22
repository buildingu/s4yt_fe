import type { UserReduxState } from "@reducers/user";
import type UserCredentials from "@typings/UserCredentials";

import { connect } from "react-redux";

import Layout from "@components/partials/layout";
import Header from "@components/partials/header";
import Content from "@components/partials/content";
import UserForm from "@components/forms/user";
import PasswordForm from "@components/forms/password";
import Referrals from "./Referrals";
import Coins from "./Coins";

import s from "./styles.module.css";

interface Props {
  user?: UserCredentials;
}

const Profile: React.FC<Props> = ({ user }) => {
  return (
    <Layout style={{ maxWidth: "1200px" }}>
      <Header title="Profile" />
      <Content style={{ backgroundColor: "transparent", border: "none" }}>
        <div className={s.container}>
          {user ? (
            <>
              <section className={s.profileInfo}>
                <h2>Update Profile Info</h2>
                <UserForm />
              </section>

              <Coins />

              <Referrals user={user} />

              <section className={s.updatePassword}>
                <h2>Update Password</h2>
                <PasswordForm />
              </section>
            </>
          ) : (
            <span role="alert" className={s.noUserMsg}>
              Pretty weird you are able to see this message, but you're not
              logged in.
            </span>
          )}
        </div>
      </Content>
    </Layout>
  );
};

const mapStateToProps = ({ user }: { user: UserReduxState }) => ({
  user: user.credentials
});

export default connect(mapStateToProps, null)(Profile);
