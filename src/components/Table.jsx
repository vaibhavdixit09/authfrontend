import React, { useEffect, useState } from "react";
import { PencilIcon } from "@heroicons/react/24/solid";
import {
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  IconButton,
  Tooltip,
  Input,
} from "@material-tailwind/react";
import EditModal from "./EditModal";
import MemberModal from "./MemberModal";
import EditTaskModal from "./EditTaskModal";
import TaskShowModal from "./TaskShowModal";

const Table = ({ data, onEdit, roles }) => {
  // console.log(data, "for task table");
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskShowModalOpen, setTaskShowModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [currentMemberData, setCurrentMemberData] = useState(null);
  const [alltasks, setAllTasks] = useState([]);
  const ITEMS_PER_PAGE = 4;

  const TABLE_HEAD = [
    "Name",
    "Email",
    "Verification",
    `${
      roles === "employee"
        ? "Assigned Manager"
        : roles === "taskTable"
        ? "Tasks"
        : "Teams"
    }`,
    `${roles === "taskTable" ? "" : "Role"}`,
    "",
  ];
  const TABLE_HEAD_TEAMS = ["Team Manager", "Assigned Members"];
  const selectedHeader = roles === "teams" ? TABLE_HEAD_TEAMS : TABLE_HEAD;

  const getUsername = (item) => item.employeename || item.managername;

  const filteredData = data.filter(
    (item) =>
      getUsername(item).toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const GetAllTasks = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/v1/get-all-tasks"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch task data");
      }
      const allTasksData = await response.json();
      // console.log("all task", allTasksData.allTask);
      setAllTasks(allTasksData.allTask);
    } catch (err) {
      console.log("error while getting tasks", err);
    }
  };
  // console.log(alltasks);
  const handleEdit = (item) => {
    if (roles === "taskTable") {
      setTaskModalOpen(true);
      setCurrentItem(item);
    } else {
      setCurrentItem(item);
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    console.log("lll");
    GetAllTasks();
    setMemberModalOpen(false);
    setTaskModalOpen(false);
    setCurrentItem(null);
    setSelectedMemberId(null);
  };

  const handleSave = (updatedItem) => {
    onEdit(updatedItem);
    closeModal();
  };
  const handleTaskSubmit = (taskData) => {
    onEdit(taskData);
  };
  const handleMemberClick = async (memberId) => {
    try {
      setSelectedMemberId(memberId);
      const response = await fetch(
        `http://localhost:4000/api/v1/get-user/${memberId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch member data");
      }
      const memberData = await response.json();
      // console.log("Member Data:", memberData);
      setCurrentMemberData(memberData);
      setMemberModalOpen(true);
    } catch (error) {
      console.error("Error fetching member data:", error);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < Math.ceil(filteredData.length / ITEMS_PER_PAGE)) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setTaskShowModalOpen(true);
  };

  const handleModalClose = () => {
    setTaskShowModalOpen(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      // Send a DELETE request to the server
      const response = await fetch(
        `http://localhost:4000/api/v1/delete-task/${taskId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      // Optionally refresh the tasks list or update local state
      // Example: Fetch updated task list or use a state management library to update the task list

      console.log("Task deleted successfully with ID:", taskId);
    } catch (error) {
      console.error("Error deleting task:", error);
    }

    // Close the modal and reset state
    handleModalClose();
  };
  useEffect(() => {
    GetAllTasks(); // Fetch all tasks on component mount
  }, []);

  return (
    <div className="px-5 rounded-2xl">
      <Card className="w-full  relative z-10">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <Typography color="gray" className="mt-1 font-normal">
                Here is the information about all {roles}
              </Typography>
            </div>
            <div className="flex w-full shrink-0 gap-2 md:w-max mt-2">
              <div className="w-full md:w-72">
                <Input
                  label="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={
                    <MagnifyingGlassIcon className="h-5 w-5 cursor-pointer" />
                  }
                />
              </div>
              <Button
                onClick={() => window.print()}
                className="flex items-center gap-3 bg-[#282870]"
              >
                <ArrowDownTrayIcon strokeWidth={2} className="h-4 w-4" /> Print
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-auto px-0">
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {selectedHeader.map((head, id) => (
                  <th
                    key={id}
                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => {
                const username = getUsername(item);
                const { _id, email, isVerified, role, assigned_manager, team } =
                  item;
                const teamInfo =
                  role === "manager" && team
                    ? `Team Count : ${team.count}`
                    : assigned_manager
                    ? assigned_manager.managername
                    : "No manager assigned";

                return (
                  role !== "admin" && (
                    <tr key={item._id}>
                      <td className="p-3 border-blue-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {username}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      {roles !== "teams" && (
                        <td className="p-3 border-blue-gray-50">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {email}
                          </Typography>
                        </td>
                      )}
                      {roles !== "teams" && (
                        <td className="p-3 border-blue-gray-50">
                          <div className="w-max">
                            <Chip
                              size="sm"
                              variant="ghost"
                              value={isVerified ? "Verified" : "Not Verified"}
                              color={isVerified ? "green" : "red"}
                            />
                          </div>
                        </td>
                      )}
                      {roles === "employee" && (
                        <td className="p-3 border-blue-gray-50">
                          <div className="w-max">
                            <Chip
                              size="sm"
                              variant="ghost"
                              value={
                                assigned_manager
                                  ? assigned_manager.managername
                                  : "No manager"
                              }
                              color={assigned_manager ? "blue" : "gray"}
                            />
                          </div>
                        </td>
                      )}
                      {roles === "manager" && (
                        <td className="p-3 border-blue-gray-50">
                          <Typography
                            variant="small"
                            color={team.count > 0 ? "green" : "red"}
                            className="font-bold"
                          >
                            {teamInfo}
                          </Typography>
                        </td>
                      )}

                      {roles === "taskTable" && (
                        <td className="p-3 flex flex-col flex-wrap   border-blue-gray-50">
                          <div
                            className="font-bold cursor-pointer"
                            onClick={() =>
                              handleTaskClick({
                                title: alltasks
                                  .filter((task) =>
                                    task.assignedTo.includes(_id)
                                  )
                                  .map((t) => t.title)
                                  .join(", "),
                              })
                            }
                          >
                            {
                              alltasks
                                .filter((task) => task.assignedTo.includes(_id)) // Filter tasks
                                .map((t) => t.title) // Map to task titles
                                .join(", ") // Join titles with commas
                            }
                          </div>
                        </td>
                      )}

                      {roles === "teams" && (
                        <td className="p-3 border-blue-gray-50">
                          <div className="inline-block">
                            <div className="flex flex-row gap-2 cursor-pointer">
                              {team.members.map((member, mIndex) => (
                                <Chip
                                  key={mIndex}
                                  size="sm"
                                  variant="ghost"
                                  value={member}
                                  color="blue"
                                  onClick={() => {
                                    const employee =
                                      item.assigned_employees.find(
                                        (emp) => emp.employeename === member
                                      );
                                    if (employee) {
                                      handleMemberClick(employee._id);
                                    }
                                  }}
                                />
                              ))}
                              {!team.members.length && (
                                <p className="text-red-600 font-semibold">
                                  No member
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                      )}
                      {roles !== "teams" && roles !== "taskTable" && (
                        <td className="p-3 border-blue-gray-50">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-medium"
                          >
                            {role}
                          </Typography>
                        </td>
                      )}
                      {role == "admin" && (
                        <td className="p-3 border-blue-gray-50">
                          <Tooltip content="Edit User">
                            <IconButton
                              variant="text"
                              color="blue-gray"
                              onClick={() => handleEdit(item)}
                            >
                              <PencilIcon className="h-5 w-5" />
                            </IconButton>
                          </Tooltip>
                        </td>
                      )}
                    </tr>
                  )
                );
              })}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 bg-white p-4">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outlined"
              color="blue-gray"
              onClick={handlePrevious}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outlined"
              color="blue-gray"
              onClick={handleNext}
            >
              Next
            </Button>
          </div>
          <Typography variant="small" color="blue-gray" className="font-normal">
            Page {currentPage} of{" "}
            {Math.ceil(filteredData.length / ITEMS_PER_PAGE)}
          </Typography>
        </CardFooter>
      </Card>
      {modalOpen && currentItem && roles !== "taskTable" && (
        <EditModal
          isOpen={modalOpen}
          onClose={closeModal}
          onSave={handleSave}
          item={currentItem}
        />
      )}
      {memberModalOpen && selectedMemberId && (
        <MemberModal
          isOpen={memberModalOpen}
          onClose={closeModal}
          memberData={currentMemberData}
        />
      )}
      {taskModalOpen && currentItem && roles === "taskTable" && (
        <EditTaskModal
          isOpen={taskModalOpen}
          onClose={closeModal}
          onSave={handleTaskSubmit}
          userDetails={currentItem}
        />
      )}
      {taskShowModalOpen && (
        <TaskShowModal
          isOpen={taskShowModalOpen}
          onClose={handleModalClose}
          taskData={selectedTask}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
};

export default Table;
