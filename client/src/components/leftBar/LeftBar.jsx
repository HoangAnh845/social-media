import "./leftBar.scss";
import Friends from "../../assets/1.png";
import Groups from "../../assets/2.png";
import Market from "../../assets/3.png";
import Watch from "../../assets/4.png";
import Memories from "../../assets/5.png";
import Events from "../../assets/6.png";
import Gaming from "../../assets/7.png";
import Gallery from "../../assets/8.png";
import Videos from "../../assets/9.png";
import Messages from "../../assets/10.png";
import Tutorials from "../../assets/11.png";
import Courses from "../../assets/12.png";
import Fund from "../../assets/13.png";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

const LeftBar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="user">
            <img src={currentUser.avater} alt="" />
            <span>{currentUser.username || "NUll"}</span>
          </div>
          <Link className="item" to={"/friends"}>
            <img src={Friends} alt="" />
            <span>Friends</span>
          </Link>
          <Link className="item" to={"/groups"}>
            <img src={Groups} alt="" />
            <span>Groups</span>
          </Link>
          <Link className="item" to={"/market"}>
            <img src={Market} alt="" />
            <span>Marketplace</span>
          </Link>
          <Link className="item" to={"/watch"}>
            <img src={Watch} alt="" />
            <span>Watch</span>
          </Link>
          <Link className="item" to={"/memories"}>
            <img src={Memories} alt="" />
            <span>Memories</span>
          </Link>
        </div>
        <hr />
        <div className="menu">
          <span>Your shortcuts</span>
          <Link className="item" to={"/events"}>
            <img src={Events} alt="" />
            <span>Events</span>
          </Link>
          <Link className="item" to={"/gaming"}>
            <img src={Gaming} alt="" />
            <span>Gaming</span>
          </Link>
          <Link className="item" to={"/gallery"}>
            <img src={Gallery} alt="" />
            <span>Gallery</span>
          </Link>
          <Link className="item" to={"/videos"}>
            <img src={Videos} alt="" />
            <span>Videos</span>
          </Link>
          <Link className="item" to={"/messages"}>
            <img src={Messages} alt="" />
            <span>Messages</span>
          </Link>
        </div>
        <hr />
        <div className="menu">
          <span>Others</span>
          <Link className="item" to={"/fund"}>
            <img src={Fund} alt="" />
            <span>Fundraiser</span>
          </Link>
          <Link className="item" to={"/tutorials"}>
            <img src={Tutorials} alt="" />
            <span>Tutorials</span>
          </Link>
          <Link className="item" to={"/courses"}>
            <img src={Courses} alt="" />
            <span>Courses</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
