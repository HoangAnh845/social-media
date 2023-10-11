import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./register.scss";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [inputs, setInputs] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    birthday: "",
    gender: "",
  });
  // const [isFullInfor, setIsFullInfor] = useState(false);
  const inputRefs = useRef([]);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    e.target.classList.remove("error");
  };
  const handleClick = async (e) => {
    e.preventDefault();

    for (let i = 0; i < Object.keys(inputs).length; i++) {
      // Check full information
      if (inputRefs[i].value.length === 0) {
        inputRefs[i].classList.add("error");
        toast.warn("Information is missing", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        return;
      }
      // Check valid information
    }
    try {
      await axios.post("http://localhost:8800/api/auth/register", inputs);
      toast.success("User has been created", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setInputs({
        fullname: "",
        username: "",
        email: "",
        password: "",
        birthday: "",
        gender: "",
      });
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
    <div className="register">
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
        <div className="left">
          <h1>Create Account</h1>
          <form>
            <div className="name">
              <input
                ref={(el) => (inputRefs[0] = el)}
                type="text"
                placeholder="Full name"
                name="fullname"
                onChange={handleChange}
              />
              <input
                ref={(el) => (inputRefs[1] = el)}
                type="text"
                placeholder="User name"
                name="username"
                onChange={handleChange}
              />
            </div>
            <input
              ref={(el) => (inputRefs[2] = el)}
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <input
              ref={(el) => (inputRefs[3] = el)}
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            <div className="sub">
              <input
                ref={(el) => (inputRefs[4] = el)}
                type="date"
                placeholder="Birthday"
                name="birthday"
                onChange={handleChange}
              />
              <select
                ref={(el) => (inputRefs[5] = el)}
                name="gender"
                onChange={handleChange}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div></div>
            <button onClick={handleClick}>Submit</button>
          </form>
        </div>
        <div className="right">
          <h1>SOCIAL MEDIAL</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
