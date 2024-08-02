import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faUser,
  faEnvelope,
  faPhone,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

const MemberModal = ({ isOpen, onClose, memberData }) => {
  if (!isOpen) return null;

  const { employeename, email, phone, isVerified } = memberData.user;

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
          Member Details
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faUser} className="text-gray-600" />
            <span className="font-medium text-gray-600 w-24">Name:</span>
            <span className="text-gray-800">{employeename}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faEnvelope} className="text-gray-600" />
            <span className="font-medium text-gray-600 w-24">Email:</span>
            <span className="text-gray-800">{email}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faPhone} className="text-gray-600" />
            <span className="font-medium text-gray-600 w-24">Phone:</span>
            <span className="text-gray-800">{phone}</span>
          </div>
          <div className="flex items-center space-x-2">
            {isVerified ? (
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-500"
              />
            ) : (
              <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" />
            )}
            <span className="font-medium text-gray-600 w-24">Verified:</span>
            <span className="text-gray-800">{isVerified ? "Yes" : "No"}</span>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
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

export default MemberModal;
