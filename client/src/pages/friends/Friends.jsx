import "./friends.scss";
import React, { useState } from "react";
import Select from "react-select";
import Relationshp from "../../components/relationship/Relationshp";

function Friends() {
  const options = [
    { value: "Bạn bè", label: "Bạn bè" },
    { value: "Lời mời", label: "Lời mời" },
    { value: "Gợi ý", label: "Gợi ý" },
    { value: "Sinh nhật", label: "Sinh nhật" },
  ];
  const [type, setType] = useState("Bạn bè");

  const handleChange = ({ value }) => {
    // eslint-disable-next-line default-case
    switch (value) {
      case "Bạn bè":
        setType("Bạn bè");
        break;
      case "Lời mời":
        setType("Lời mời");
        break;
      case "Gợi ý":
        setType("Gợi ý");
        break;
      case "Sinh nhật":
        setType("Sinh nhật");
        break;
    }
  };

  return (
    <div className="friends">
      <Select
        defaultValue={options[0]}
        options={options}
        onChange={(e) => handleChange(e)}
      />
      <div className="list">
        <Relationshp type={type} />
      </div>
    </div>
  );
}

export default Friends;
