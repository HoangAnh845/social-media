import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");


  // const mutationUpload = useMutation((formData) => {
  //   return makeRequest.post("/upload", formData);
  // });

  const upload = async () => {
    try {
      const nameFile = file.name.split(".")[0];
      const typeFile = file.type.split("/")[1];
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const newFileImage = `${nameFile}-${timestamp}-${randomString}.${typeFile}`;

      let blob = file.slice(0, file.size, "image/jpeg");
      const newFile = new File([blob], `${newFileImage}`, { type: file.type });

      const formData = new FormData();
      formData.append("myImage", newFile);

      const res = await makeRequest.post("/upload", formData);
      return res.data.image_url;
    } catch (err) {
      console.log(err);
    }
  };

  // const uploadImages = async (e) => {
  //   const file = imageRef.current.files[0];
  //   const nameFile = file.name.split(".")[0];
  //   const typeFile = file.type.split("/")[1];
  //   const timestamp = Date.now();
  //   const randomString = Math.random().toString(36).substring(2, 8);
  //   const newFileImage = `${nameFile}-${timestamp}-${randomString}.${typeFile}`;

  //   let blob = file.slice(0, file.size, "image/jpeg");
  //   const newFile = new File([blob], `${newFileImage}`, { type: file.type });

  //   setContent(
  //     `https://storage.cloud.google.com/storage-upload/${newFileImage}`
  //   );
  //   let formData = new FormData();
  //   formData.append("myImage", newFile);
  //   mutationUpload.mutate(formData);
  // };

  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newPost) => {
      return makeRequest.post("/posts", newPost);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await upload();

    console.log("--- DATA ---", imgUrl);
    mutation.mutate({ desc, image_url: imgUrl });
    setDesc("");
    setFile(null);
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <div className="lefTop">
              <img src={currentUser.avater} alt="" />
              <div>{currentUser.username}</div>
              {/* <select
                name="audience"
                >
                  <option value="Tất cả">Tất cả</option>
                  <option value="Bạn bè">Bạn bè</option>
                  <option value="Chỉ mình tôi">Chỉ mình tôi</option>
                </select> */}
            </div>
            <div>
              <input
                type="text"
                placeholder={`What's on your mind ${currentUser.username}?`}
                onChange={(e) => setDesc(e.target.value)}
                value={desc}
              />
            </div>
          </div>
          <div className="right">
            {file && (
              <img className="file" alt="" src={URL.createObjectURL(file)} />
            )}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              name="myImage"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
