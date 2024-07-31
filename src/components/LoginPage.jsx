import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";
import bg from "../assets/log.png";
const LoginPage = () => {
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(false);
    try {
      setLoading(true);
      const normalizedFormData = {
        ...formData,
        email: formData.email.toLowerCase(),
      };
      const response = await fetch("http://localhost:4000/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(normalizedFormData),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("isAuthenticated", "true");
        if (data.role == "admin") {
          navigate("/admin-panel");
        } else if (data.role == "manager") {
          navigate("/manager-panel");
        } else {
          navigate("/employee-panel");
        }
      } else {
        alert(data.message || "Login failed!");
        console.log(err);
        setErr("Check your credentials");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setErr("Server Error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen purple-bg bg-cover flex justify-center items-center">
      <div className="login-card flex  rounded-sm overflow-hidden w-[60vw]  bg-white ">
        {/* image */}
        <div className="w-[50%] bg-[#281870] p-4 lg:block hidden">
          <p className="text-3xl text-slate-100 font-bold text-center text-white">
            Welcome Back !!{" "}
          </p>
          <p className="text-base font-normal italic my-4 text-center text-white">
            login to continue
          </p>
          <img className="w-[70%] mx-auto bg-cover " src={bg} alt="" />
        </div>
        {/* form */}
        <div className="mx-auto w-[100%] lg:w-[50%] p-4 bg-slate-50">
          <h1 className="auth-heading inline-block text-[#281870] font-bold text-3xl mt-4 border-b-4 border-[#281870] pb-1">
            Login
            <div className="w-4 h-1 block text-purple-700"></div>
          </h1>
          <form
            className="auth-form flex flex-col mt-7 gap-4 "
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="auth-input p-2 outline-0 bg-transparent  border-b-2 border-b-purple-800"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="auth-input p-2 outline-0 bg-transparent border-b-2 border-b-purple-800 roun"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {err && <p className="text-red-400 text-lg font-bold">{err}</p>}
            <button type="submit" className="button mt-4">
              {loading ? "please wait..." : "login"}
            </button>
            <div onClick={() => navigate("/signup")} className="">
              Dont have an account ?{" "}
              <span className="cursor-pointer text-[#281870] font-semibold">
                {" "}
                signup
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
