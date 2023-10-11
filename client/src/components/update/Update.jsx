import { useState } from "react";
import { makeRequest } from "../../axios";
import "./update.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const Update = ({ setOpenUpdate, user }) => {
  const [avater, setAvater] = useState(null);
  const [texts, setTexts] = useState({
    email: user.email,
    password: user.passwrod,
    name: user.fullname,
  });

  const upload = async (file) => {
    console.log(file);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
  };

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (user) => {
      return makeRequest.put("/users", user);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["user"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();

    let avaterUrl;
    avaterUrl = avater ? await upload(avater) : user.avaterPic;

    mutation.mutate({ ...texts, avater: avaterUrl });
    setOpenUpdate(false);
    setAvater(null);
  };
  return (
    <div className="update">
      <div className="wrapper">
        <h1>Update Your avater</h1>
        <form>
          <div className="files">
            <label htmlFor="avater">
              <span>avater Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    avater
                      ? URL.createObjectURL(avater)
                      : user.avater
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="avater"
              style={{ display: "none" }}
              onChange={(e) => setAvater(e.target.files[0])}
            />
          </div>
          <label>Email</label>
          <input
            type="text"
            value={texts.email}
            name="email"
            onChange={handleChange}
          />
          <label>Password</label>
          <input
            type="text"
            value={texts.password}
            name="password"
            onChange={handleChange}
          />
          <label>Name</label>
          <input
            type="text"
            value={texts.name}
            name="name"
            onChange={handleChange}
          />
          <button onClick={handleClick}>Update</button>
        </form>
        <button className="close" onClick={() => setOpenUpdate(false)}>
          close
        </button>
      </div>
    </div>
  );
};

export default Update;
