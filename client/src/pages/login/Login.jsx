import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { ToastContainer, toast } from "react-toastify";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import "react-toastify/dist/ReactToastify.css";
import "./login.scss";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  // const [err, setErr] = useState(null);
  const [openList,setOpenList] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));


  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  // Lấy giá trị của ngữ cảnh mà đã đăng ký. Hiện tại là hàm login
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(inputs);
      navigate("/");
    } catch (err) {
      toast.error(err.response.data, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  return (
    <div className="login">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="card">
        {/* <div className="left">
          {user && (
            <div className="fast">
              <div className="block_img">
                <img width="50%" src={user.profilePic} alt="" />
              </div>
              <div className="block_name">{user.username}</div>
            </div>
          )}

          <div className="add">
            <div className="block_img">
              <img
                width="30%"
                src={"https://cdn-icons-png.flaticon.com/128/3416/3416075.png"}
                alt=""
              />
            </div>
            <Link
              to="/register"
              style={{ color: "#333", textDecoration: "none" }}
            >
              <div className="block_name">Thêm tài khoản</div>
            </Link>
          </div>
        </div> */}
        <div className="usersLogin">
          <KeyboardArrowLeftIcon />
        </div>
        <div className="left">
          <h1>SOCIAL MEDIAL</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <div className="title">
            <h1>LOGIN</h1>
            <p>Welome back!</p>
          </div>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            {/* <div style={{ color: "red" }}>{err && err}</div> */}
            <button onClick={handleLogin}>Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
