import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const FriendRequestList = ({ info }) => {
  const [notif, setNotif] = useState("");
  const mutationAdd = useMutation((senderId) => {
    return makeRequest.put("/relationships", { senderId: senderId });
  });

  const mutationDelete = useMutation((senderId) => {
    return makeRequest.delete("/relationships?sender=" + senderId);
  });

  const addFriend = (senderId) => {
    mutationAdd.mutate(senderId);
    setNotif('Đã xác nhận lời mời');
  };
  const deleteFriend = (senderId) => {
    setNotif('Đã gỡ bỏ lời mời');
    mutationDelete.mutate(senderId);
  };

  return (
    <div className="user" key={info.id}>
      <div className="userImage">
        <img src={info.avater} alt="" />
      </div>
      <div className="userInfo">
        <span>{info.username}</span>
        <div style={{fontSize:"0.85rem", color:"gray"}}>{notif}</div>
        <div className="buttons">
          <button onClick={() => addFriend(info.id)}>Confirm</button>
          <button onClick={() => deleteFriend(info.id)}>Deny</button>
        </div>
      </div>
    </div>
  );
};
export default FriendRequestList;
