import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./protected-home.css";
import "./AuthPage.css";
import "./modal.css";
import { MdMenuOpen } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { RxCross2 } from "react-icons/rx";
import Table from "./Table";
import EditModal from "./EditModal";

const AdminPanel = () => {
  const [email, setEmail] = useState("");
  const [employeeList, setEmployeeList] = useState([]);
  const [managerList, setManagerList] = useState([]);
  const [status, setStatus] = useState("Loading...");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("");
  const [role, setRole] = useState("");
  const [selectedTable, setSelectedTable] = useState("employee");
  const [profileTab, setProfileTab] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

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
    } catch (error) {
      setVerificationMessage("Failed to send verification email");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const refreshData = async () => {
    try {
      const employeeResponse = await fetch(
        "http://localhost:4000/api/v1/get-all/employee",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const employeeData = await employeeResponse.json();
      setEmployeeList(employeeData.data);

      const managerResponse = await fetch(
        "http://localhost:4000/api/v1/get-all/manager",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const managerData = await managerResponse.json();
      setManagerList(managerData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (role === "admin" && status === "Verified") {
      refreshData();
    }
  }, [selectedTable, role, status]);

  const openEditModal = (item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleSave = async (updatedUser) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/update/${updatedUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(updatedUser),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update item");
      }
      // Refresh the relevant table data
      await refreshData();
      setIsModalOpen(false); // Close the modal after saving
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  return (
    <div className="min-w-full min-h-[100vh] bg-slate-100 ">
      <div className=" w-full h-[4vh] flex justify-between items-center p-6 bg-[#281870] relative z-20">
        <MdMenuOpen size={25} color="white" />
        {profileTab ? (
          <RxCross2
            className="cursor-pointer"
            onClick={() => setProfileTab(!profileTab)}
            size={25}
            color="white"
          />
        ) : (
          <CgProfile
            className="cursor-pointer"
            onClick={() => setProfileTab(!profileTab)}
            size={25}
            color="white"
          />
        )}
      </div>
      <div className="w-5 h-5 rotate-45 bg-white absolute top-[-10px] right-10 shadow-lg z-10"></div>
      <div
        className={`profile-dropdown ${
          profileTab ? "block" : "hidden"
        } absolute right-4 top-16 w-72 bg-white shadow-xl rounded-lg p-6 z-30`}
      >
        <div className="text-sm space-y-4">
          <div className="font-medium text-gray-800">
            <span className="font-semibold text-[#281870]">Email:</span> {email}
          </div>
          <div className="font-medium text-gray-800">
            <span className="font-semibold text-[#281870]">Role:</span> {role}
          </div>
          <div className="font-medium text-gray-800">
            <span className="font-semibold text-[#281870]">Status:</span>{" "}
            <span
              className={`${
                status === "Verified" ? "text-green-500" : "text-red-500"
              }`}
            >
              {status}
            </span>
          </div>
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

      {verificationStatus === "Verification Email Sent" && (
        <p>{verificationMessage}</p>
      )}

      <div className="tabs p-4 ">
        <button
          className={`tab-button p-2 ${
            selectedTable === "employee"
              ? "bg-[#281870] rounded-md text-white"
              : ""
          }`}
          onClick={() => setSelectedTable("employee")}
        >
          Employee
        </button>
        <button
          className={`tab-button p-2 ${
            selectedTable === "manager"
              ? "bg-[#281870] rounded-md text-white"
              : ""
          }`}
          onClick={() => setSelectedTable("manager")}
        >
          Manager
        </button>
      </div>

      {role === "admin" && status === "Verified" && (
        <>
          {selectedTable === "employee" && (
            <Table data={employeeList} onEdit={openEditModal} />
          )}
          {selectedTable === "manager" && (
            <Table data={managerList} onEdit={openEditModal} />
          )}
        </>
      )}

      {isModalOpen && (
        <EditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          item={currentItem}
          onSave={handleSave} // Pass the handleSave function
        />
      )}
    </div>
  );
};

export default AdminPanel;
