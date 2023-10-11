import { useContext, useRef, useState } from "react";
import "./stories.scss";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import InsertPhotoOutlinedIcon from "@mui/icons-material/InsertPhotoOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { Button, Grid } from "@mui/material";
import Slider from "react-slick";
import TextField from "@mui/material/TextField";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Stories = () => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    className: "wCustom",
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  const { currentUser } = useContext(AuthContext);
  const [storie, setStorie] = useState("text");
  const [content, setContent] = useState("");
  const imageRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { isLoading, error, data } = useQuery(["stories"], () => {
    return makeRequest.get("/stories").then((res) => res.data);
  });

  const mutationAdd = useMutation((story) => {
    return makeRequest.post("/stories", story);
  });

  const mutationUpload = useMutation((formData) => {
    return makeRequest.post("/upload", formData);
  });
  const uploadImages = async (e) => {
    const file = imageRef.current.files[0];
    const nameFile = file.name.split(".")[0];
    const typeFile = file.type.split("/")[1];
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const newFileImage = `${nameFile}-${timestamp}-${randomString}.${typeFile}`;

    let blob = file.slice(0, file.size, "image/jpeg");
    const newFile = new File([blob], `${newFileImage}`, { type: file.type });

    setContent(
      `https://storage.cloud.google.com/storage-upload/${newFileImage}`
    );
    let formData = new FormData();
    formData.append("myImage", newFile);
    mutationUpload.mutate(formData);
  };

  const addStorie = () => {
    mutationAdd.mutate({
      content: content,
      category: storie,
      userInfo: currentUser,
    });
  };
  return (
    <div className="stories">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ textAlign: "center" }}
          >
            Create Stories
          </Typography>
          {/* Option */}
          <Box sx={{ mt: 4, mb: 2, flexGrow: 1 }}>
            <Grid
              container
              spacing={2}
              sx={{ width: "100%", marginLeft: "0px", textAlign: "center" }}
            >
              <Grid
                xs={6}
                md={6}
                sx={{
                  backgroundColor: "#6868EA",
                  padding: "20px 10px",
                }}
              >
                <Button
                  sx={{ color: "#fff" }}
                  onClick={() => setStorie("image")}
                >
                  <InsertPhotoOutlinedIcon sx={{ paddingRight: "7px" }} />
                  <Box>Image</Box>
                </Button>
              </Grid>
              <Grid
                xs={6}
                md={6}
                sx={{
                  backgroundColor: "#B74DC6",
                  padding: "20px 10px",
                }}
              >
                <Button
                  sx={{ color: "#fff" }}
                  onClick={() => setStorie("text")}
                >
                  <EditNoteOutlinedIcon sx={{ paddingRight: "7px" }} />
                  <Box>Text</Box>
                </Button>
              </Grid>
            </Grid>
          </Box>
          {/* Content */}
          <Box>
            {storie === "text" ? (
              <TextField
                label="Content..."
                multiline
                rows={4} // Số dòng trong textarea
                variant="outlined"
                fullWidth // Điều này làm cho textarea rộng 100%
                onChange={(e) => setContent(e.target.value)}
              />
            ) : (
              <Box>
                <Button variant="contained" component="span" sx={{ mb: 2 }}>
                  Select Image
                  <input
                    accept="image/*"
                    ref={imageRef}
                    // style={{ opacity: "0" }}
                    id="contained-button-file"
                    multiple
                    name="myImage"
                    type="file"
                    onChange={() => uploadImages()}
                  />
                </Button>
                <Grid item>
                  <img
                    width="50%"
                    alt="emptyImage"
                    src={
                      "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg"
                    }
                  />
                </Grid>
              </Box>
            )}
          </Box>
          <Button
            onClick={() => addStorie()}
            sx={{ width: "100%", justifyContent: "flex-end" }}
          >
            Submit
          </Button>
        </Box>
      </Modal>
      <div className="story">
        <div className="imgAdd">
          <div></div>
          <img
            src={
              "https://www.fenews.co.uk/wp-content/uploads/2022/01/social-media-1200x800.jpg"
            }
            alt=""
          />
        </div>
        <div className="addStory">
          <button onClick={handleOpen}>+</button>
          <div>Tạo tin</div>
        </div>
      </div>

      <div className="slider">
        {isLoading
          ? "loading"
          : data?.map((story, index) => {
              return (
                <div key={index} className="category">
                  {story.category === "text" ? (
                    <>
                      <div className="category_image text_image"></div>
                      <span className="text_content">{story.content}</span>
                    </>
                  ) : (
                    <div
                      className="category_image image_content"
                      style={{
                        backgroundImage: `url('${story.content}')`,
                      }}
                    ></div>
                  )}
                  <div className="avater">
                    <img src={story.avater} alt="" />
                    <div>{story.username}</div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default Stories;
