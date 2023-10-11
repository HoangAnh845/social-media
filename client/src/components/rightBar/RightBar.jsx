import { useContext } from "react";
import "./rightBar.scss";
import { AuthContext } from "../../context/authContext";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import FindInPageTwoToneIcon from "@mui/icons-material/FindInPageTwoTone";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import Loading from "react-loading";
import FriendRequestList from "../friendRequestList/FriendRequestList";
import { Link } from "react-router-dom";

const RightBar = () => {
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(["relationships"], async () => {
    const res = await makeRequest.get(
      `/relationships?recipientId=${currentUser.id}&status=pending`
    );
    return res.data || [];
  });


  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <div className="title">
            <span>Friend Request</span>
            {data && data.length > 3 && <Link to={'/friends'}>See all</Link>}
          </div>
          <div className="listUsers">
            {isLoading ? (
              <Loading
                className="loading"
                type={"spin"}
                color={"#c0c0c0e0"}
                height={50}
                width={50}
              />
            ) : error || (data && data.length === 0) ? (
              <div className="notFound">
                <FindInPageTwoToneIcon />
                <div>Invitation not found</div>
              </div>
            ) : (
              <div className="listUsers">
                {(data || []).map((info) => {
                  return (
                    <FriendRequestList 
                    key={info.id}
                    info={info}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className="item">
          <div className="title">
            <span>Contact Person</span>
            <div className="tools">
              <PersonSearchOutlinedIcon />
              <MoreHorizOutlinedIcon />
            </div>
          </div>

          <div className="user">
            <div className="userImage">
              <img
                src="https://static.topcv.vn/user_avatars/CGsx57IzquvHZfcJuEeV_64bf52a3bea8e_av.jpg"
                alt=""
              />
              <div className="online" />
              <span>Hoang Anh</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightBar;
