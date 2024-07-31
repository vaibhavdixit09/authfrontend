import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./protected-home.css";
import "./AuthPage.css";
import "./modal.css";
import { MdMenuOpen } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { RxCross2 } from "react-icons/rx";

const EmployeePanel = () => {
  const [email, setEmail] = useState("");
  const [employeeList, setEmployeeList] = useState([]);
  const [managerList, setManagerList] = useState([]);
  const [status, setStatus] = useState("Loading...");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("");
  const [role, setRole] = useState("");
  const [selectedTable, setSelectedTable] = useState("employee");
  const [profileTab, setProfileTab] = useState(false);
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [verificationLoading, setVerificationLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch(
          "http://localhost:4000/api/v1/user-details",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const user = await response.json();
        setRole(user.role);
        setEmail(user.email);
        setStatus(user.isVerified ? "Verified" : "Not Verified");
        setVerificationStatus(user.isVerified ? "" : "Not Verified");
      } catch (error) {
        console.error("Error fetching user details:", error);
        setStatus("Error fetching status");
      }
    };

    fetchUserDetails();
  }, []);

  const handleVerify = async () => {
    try {
      setVerificationLoading(true);
      const response = await fetch(
        "http://localhost:4000/api/v1/resend-verification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setVerificationMessage("Verification email sent successfully.");
        setVerificationStatus("Verification Email Sent");
      } else {
        setVerificationMessage(
          data.message || "Error sending verification email"
        );
      }
      setVerificationLoading(false);
    } catch (error) {
      setVerificationMessage("Failed to send verification email");
      setVerificationLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <div className="min-w-full min-h-[100vh] bg-slate-100">
      <div className=" w-[100%] h-[4vh] flex justify-between items-center p-6 bg-[#281870] relative">
        <MdMenuOpen size={25} color="white"></MdMenuOpen>
        {profileTab == true ? (
          <RxCross2
            className="cursor-pointer"
            onClick={() => {
              setProfileTab(!profileTab);
            }}
            size={25}
            color="white"
          ></RxCross2>
        ) : (
          <CgProfile
            className="cursor-pointer"
            onClick={() => {
              setProfileTab(!profileTab);
            }}
            size={25}
            color="white"
          ></CgProfile>
        )}
      </div>
      <h2 className="text-2xl text-[#281870] font-bold text-center">
        Welcome Employee
      </h2>
      {verificationStatus === "Verification Email Sent" && (
        <p className="text-lg text-[#281870] font-semibold italic text-center">
          {verificationMessage}
        </p>
      )}
      <div
        className={`profile-dropdown ${
          profileTab ? "block" : "hidden"
        } absolute right-4 top-16 w-72 bg-white shadow-xl rounded-lg p-6 z-30`}
      >
        <div className="w-5 h-5 rotate-45 bg-white absolute top-[-10px] right-10 shadow-lg"></div>
        <div className="text-sm space-y-4">
          <p className="font-medium text-gray-800">
            <span className="font-semibold text-[#281870]">Email:</span> {email}
          </p>
          <p className="font-medium text-gray-800">
            <span className="font-semibold text-[#281870]">Role:</span> {role}
          </p>
          <p className="font-medium text-gray-800">
            <span className="font-semibold text-[#281870]">Status:</span>{" "}
            <span
              className={`${
                status === "Verified" ? "text-green-500" : "text-red-500"
              }`}
            >
              {status}
            </span>
          </p>
          {verificationStatus === "Not Verified" && role !== "admin" && (
            <button
              className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
              onClick={handleVerify}
            >
              Verify Email
            </button>
          )}
          <button
            className="mt-2 w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-200"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeePanel;
