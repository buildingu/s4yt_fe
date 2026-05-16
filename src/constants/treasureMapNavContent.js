import routeDisableOn from "@root/routes/disableOn";

import playAndGet from "@images/NewMap/play_and_get.png";
import rafflePage from "@images/NewMap/raffle_page.png";
import seePartners from "@images/NewMap/see_partners.png";
import wrapUp from "@images/NewMap/event_wrap_up.png";
import profilePage from "@images/NewMap/profile_page.png";
import referFriendsGetMore from "@images/NewMap/refer_friends_get_more.png";
import welcomeAboard from "@images/NewMap/welcome_aboard.png";
import win3Dub from "@images/NewMap/win_3_dub.png";
import freeDub from "@images/NewMap/free_dub.png";

export default [
  {
    id: "play_and_get",
    img: { src: playAndGet, alt: "Play and Get Tokens" },
    to: "/learn",
    position: { x: 430, y: -25 },
    connectsTo: ["raffle"],
    disableOn: routeDisableOn["/learn"]
  },
    {
    id: "free_dub",
    img: { src: freeDub, alt: "Free Dub" },
    to: "/dublness",
    position: { x: 140, y: 210 },
    size: 140,
    connectsTo: [""],
    disableOn: routeDisableOn["/dublness"]
  },
  {
    id: "raffle",
    img: { src: rafflePage, alt: "Raffle" },
    to: "/raffle",
    position: { x: 510, y: 120 },
    connectsTo: ["partners"],
    disableOn: routeDisableOn["/raffle"]
  },
  {
    id: "partners",
    img: { src: seePartners, alt: "Partners" },
    to: "/businesses",
    position: { x: 535, y: 285 },
    connectsTo: ["wrap_up"],
    disableOn: routeDisableOn["/businesses"]
  },
  {
    id: "wrap_up",
    img: { src: wrapUp, alt: "Wrap Up" },
    to: "/results",
    position: { x: 710, y: 70 },
    connectsTo: [],
    disableOn: routeDisableOn["/results"]
  },
  {
    id: "profile",
    img: { src: profilePage, alt: "Profile" },
    to: "/profile",
    position: { x: 300, y: 110},
    connectsTo: [],
    size: 120,
    disableOn: routeDisableOn["/profile"]
  },
  {
    id: "refer_friends",
    img: { src: referFriendsGetMore, alt: "Refer Friends Get More" },
    to: "/refer",
    position: { x: 280, y: 265 },
    connectsTo: [],
    disableOn: routeDisableOn["/refer"]
  },
  {
    id: "welcome_aboard",
    img: { src: welcomeAboard, alt: "Welcome Aboard" },
    to: "/welcome",
    position: { x: -20, y: -20 },
    connectsTo: [],
    size: 190,
    disableOn: routeDisableOn["/welcome"]
  },
  {
    id: "win_3_dub",
    img: { src: win3Dub, alt: "Win 3 Dub" },
    to: "/prizes",
    position: { x: 150, y: -40 },
    connectsTo: [],
    size: 135,
    disableOn: routeDisableOn["/prizes"]
  }
];