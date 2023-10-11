import "./relationship.scss";
import { AuthContext } from "../../context/authContext";
import React, { useContext, useEffect, useState } from "react";
import { makeRequest } from "../../axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import FindInPageTwoToneIcon from "@mui/icons-material/FindInPageTwoTone";
import Loading from "react-loading";

const Relationshp = ({ type }) => {
  const { currentUser } = useContext(AuthContext);
  const [notif, setNotif] = useState("");
  const { isLoading, error, data } = useQuery(
    ["relationships", currentUser.id, type],
    async () => {
      const res = await makeRequest.get(`/relationships`, {
        params: {
          type: type,
          recipientId: currentUser.id,
          status: type === "Bạn bè" ? "accepted" : "pending",
        },
      });
      return res.data || [];
    }
  );

  const mutationSend = useMutation((userId) => {
    return makeRequest.post("/relationships", {
      senderId: currentUser.id,
      recipientId: userId,
    });
  });

  const mutationConfirm = useMutation((senderId) => {
    return makeRequest.put("/relationships", { senderId: senderId });
  });

  const mutationDeny = useMutation((senderId) => {
    return makeRequest.delete("/relationships?sender=" + senderId);
  });

  const sendRelationship = (userId) => {
    mutationSend.mutate(userId);
    setNotif("Đã gửi lời mời");
  };

  const confirmRelationship = (senderId) => {
    mutationConfirm.mutate(senderId);
    setNotif("Đã xác nhận lời mời");
  };

  const denyRelationship = (userId) => {
    mutationDeny.mutate(userId);
    setNotif("Đã gỡ bỏ lời mời");
  };
  error && alert(error);
  
  return isLoading ? (
    <div className="loading">
      <Loading
        className="loading"
        type={"bars"}
        color={"#c0c0c0e0"}
        height={50}
        width={50}
      />
    </div>
  ) : error || (data && data.length === 0) ? (
    <div className="notFound">
      <FindInPageTwoToneIcon />
      <div>Invitation not found</div>
    </div>
  ) : (
    <>
      {data.map((userInfo) => {
        return (
          <div className="box" key={userInfo.id}>
            <div>
              <div
                className="image"
                style={{ backgroundImage: `url(${userInfo.avater})` }}
              ></div>
              <div className="name">{userInfo.username}</div>
              <div
                style={{
                  fontSize: "0.9rem",
                  color: "gray",
                  textAlign: "center",
                }}
              >
                {notif}
              </div>
              {type !== "Bạn bè" && (
                <div className="buttons">
                  {type === "Gợi ý" ? (
                    <button onClick={() => sendRelationship(userInfo.id)}>
                      Send
                    </button>
                  ) : (
                    <button onClick={() => confirmRelationship(userInfo.id)}>
                      Confirm
                    </button>
                  )}
                  <button onClick={() => denyRelationship(userInfo.id)}>
                    {type === "Gợi ý" ? "Remove" : "Deny"}
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Relationshp;
