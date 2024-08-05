import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./protected-home.css";
import "./AuthPage.css";
import "./modal.css";
import { MdMenuOpen } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { RxCross2 } from "react-icons/rx";
import Table from "./Table";
import EditModal from "./EditModal";
import AddTask from "./AddTask";
import TaskTable from "./TaskTable";

const ManagerPanel = () => {
  const [_id, set_id] = useState(null);
  const [email, setEmail] = useState("");
  const [employeeList, setEmployeeList] = useState([]);
  const [status, setStatus] = useState("Loading...");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("");
  const [role, setRole] = useState("");
  const [profileTab, setProfileTab] = useState(false);
  const [selectedTab, setSelectedTab] = useState("employee");
  const [managerTaskList, setManagerTaskList] = useState([]);
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);

  const handleSave = async (task) => {
    console.log("User ID (_id):", _id);
    console.log("Task data:", task);

    const final_data = { ...task, owner: _id };
    console.log("Final data to send:", final_data);

    try {
      const response = await fetch(`http://localhost:4000/api/v1/create-task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(final_data),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Response error:", errorResponse);
        throw new Error(errorResponse.message || "Failed to create task");
      }

      const result = await response.json();
      console.log("Task created successfully:", result);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

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
        // console.log(user, "pop");
        set_id(user._id);
        setEmployeeList(user.assigned_employees);
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

  const handleClickOutside = (event) => {
    if (
      profileDropdownRef.current &&
      !profileDropdownRef.current.contains(event.target)
    ) {
      setProfileTab(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // useEffect(() => {});
  const handleManagerTasks = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/get-manager-task/${_id}`
      );

      if (!response.ok) {
        throw new error("error in fetching manager tasks");
      }
      const data = await response.json();
      setManagerTaskList([...data.allManagerTasks]);
      // console.log(typeof data.allManagerTasks, "datata");
      // console.log(managerTaskList);
      setSelectedTab("managetasks");
    } catch (err) {
      console.log(err);
    }
  };
  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/delete-task/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete the item");
      }
      handleManagerTasks();
      console.log("Item deleted successfully");
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };
  const handleAssign = async (task_id, emp_id) => {
    try {
      const response = await fetch("http://localhost:4000/api/v1/assign-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          taskId: task_id, // No need for template literals
          employeeId: emp_id, // No need for template literals
        }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Get detailed error response
        throw new Error(errorData.message || "Task not assigned"); // Use detailed message if available
      }

      console.log("Task assigned successfully");
    } catch (err) {
      console.error("Error assigning task:", err.message); // Log detailed error message
    }
  };

  return (
    <div className="min-w-full min-h-[100vh] bg-slate-100 ">
      <div className=" w-full h-[4vh] flex justify-between items-center p-6 bg-[#281870] relative z-20">
        <MdMenuOpen size={25} color="white" />
        {profileTab ? (
          <RxCross2
            className="cursor-pointer"
            onClick={() => setProfileTab(false)}
            size={25}
            color="white"
          />
        ) : (
          <CgProfile
            className="cursor-pointer"
            onClick={() => setProfileTab(true)}
            size={25}
            color="white"
          />
        )}
      </div>
      <div className="w-5 h-5 rotate-45 bg-white absolute top-[-10px] right-10 shadow-lg z-10"></div>
      <div
        ref={profileDropdownRef}
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
        <p className="fixed top-4 left-1/2 transform -translate-x-1/2 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg shadow-md z-50 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
          {verificationMessage}
        </p>
      )}
      <div className="tabs p-4 transition-all duration-700 flex gap-2">
        <button
          className={`rounded-md tab-button p-2 transition-all duration-300 ease-in-out ${
            selectedTab === "employee"
              ? "bg-[#281870]  text-white"
              : "bg-gray-200 text-black"
          }`}
          onClick={() => setSelectedTab("employee")}
        >
          Team List
        </button>
        <button
          className={`rounded-md tab-button p-2 transition-all duration-300 ease-in-out ${
            selectedTab === "addtask"
              ? "bg-[#281870]  text-white"
              : "bg-gray-200 text-black"
          }`}
          onClick={() => setSelectedTab("addtask")}
        >
          Add Task
        </button>
        <button
          className={`rounded-md tab-button p-2 transition-all duration-300 ease-in-out ${
            selectedTab === "managetasks"
              ? "bg-[#281870]  text-white"
              : "bg-gray-200 text-black"
          }`}
          onClick={handleManagerTasks}
        >
          Manage Task
        </button>
      </div>
      {selectedTab == "addtask" && <AddTask onSaveTask={handleSave} />}
      {selectedTab == "managetasks" && (
        <TaskTable
          dataList={managerTaskList}
          employeeList={employeeList}
          onDelete={handleDelete}
          onAssign={handleAssign}
        ></TaskTable>
      )}
      {selectedTab == "employee" && (
        <Table data={employeeList} roles={"taskTable"} />
      )}
    </div>
  );
};

export default ManagerPanel;
