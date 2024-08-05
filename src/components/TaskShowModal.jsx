import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const TaskShowModal = ({ isOpen, onClose, taskData, onDelete }) => {
  if (!isOpen) return null;

  console.log(taskData, "taskdatafjnas");
  const handleDelete = () => {
    if (onDelete) onDelete(taskData._id); // Assuming taskData has a unique `id`
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 overflow-auto bg-black bg-opacity-70 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`relative bg-white p-8 rounded-lg shadow-2xl max-w-lg mx-auto my-6 w-full sm:w-4/5 md:w-3/5 lg:w-2/5 transform transition-transform duration-300 ${
          isOpen ? "scale-100" : "scale-90"
        }`}
      >
        <button
          type="button"
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          Task Details
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-600 w-24">Task Title:</span>
            <span className="text-gray-800">{taskData.title}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-600 w-24">Description:</span>
            <span className="text-gray-800">{taskData.description}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-600 w-24">Status:</span>
            <span className="text-gray-800">{taskData.status}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-600 w-24">Due Date:</span>
            <span className="text-gray-800">
              {new Date(taskData.dueDate).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-200"
            onClick={handleDelete}
          >
            <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
            Delete Task
          </button>
          <button
            type="button"
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskShowModal;
