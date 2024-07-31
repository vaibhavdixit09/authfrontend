import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/reg.png";

const SignupPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "employee", // Default role
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
      const response = await fetch("http://localhost:4000/api/v1/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setErr("Check details...");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      setErr("Server Error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen purple-bg ">
      <div className="mx-auto w-[70vw]  flex bg-[#fcfcfc]">
        <div className="w-[50%] p-4 lg:block hidden bg-[#281870]">
          <p className="mt-4 text-center">
            <span className="text-slate-100 text-3xl font-bold">
              Welcome !!
            </span>{" "}
            <p className="text-center text-base text-slate-100 font-normal italic">
              Please <span>Register</span> with us to continue
            </p>
          </p>
          <img src={bg} className="" alt="" />
        </div>
        <div className="w-[50%] p-4 bg-slate-50">
          <h1 className=" text-[#281870] font-bold text-3xl mt-4 border-b-4 inline-block pb-1 border-[#281870]">
            Sign Up
          </h1>
          <form className="flex flex-col mt-7 gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="p-2 outline-0 bg-transparent placeholder-gray-600 shadow-md border-b-2 border-[#281870]"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="p-2 outline-0 bg-transparent placeholder-gray-600 shadow-md border-b-2 border-[#281870]"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              className="p-2 outline-0 bg-transparent placeholder-gray-600 shadow-md border-b-2 border-[#311a98]"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="p-2 outline-0 bg-transparent placeholder-gray-600 shadow-md border-b-2 border-[#281870]"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="p-2 outline-0 bg-transparent text-gray-600 shadow-md border-b-2 border-[#281870]"
              required
            >
              <option disabled value="admin" className="">
                Admin
              </option>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>
            {err && <p className="text-red-400 text-lg font-bold">{err}</p>}
            <button type="submit" className="button mt-4">
              {loading ? "Submitting..." : "Sign up"}
            </button>
            <div onClick={() => navigate("/login")} className="">
              Already have an account?{" "}
              <span className="cursor-pointer  text-[#281870] font-semibold">
                Login
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
