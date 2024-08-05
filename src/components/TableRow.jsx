import React, { useState, useEffect, useRef } from "react";
import { FaPlus } from "react-icons/fa"; // Importing a plus icon from react-icons

const TableRow = ({
  title,
  description,
  priority,
  dueDate,
  _id,
  onDelete,
  onAssign,
  employeeList,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDelete = () => {
    onDelete(_id);
  };

  const handleAssignClick = (e) => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSelectEmployee = (employee) => {
    console.log("Selected employee:", employee);
    onAssign(_id, employee._id);
    setIsDropdownOpen(false);
  };

  const handleCloseDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <tr className="relative hover:bg-gray-50">
      <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
        <div className="text-sm">
          <div className="font-medium text-gray-700">{title}</div>
        </div>
      </th>
      <td className="px-6 py-4">{description}</td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center gap-1 rounded-lg bg-blue-gray-900 px-2 py-1 text-xs font-semibold text-white">
          {priority}
        </span>
      </td>
      <td className="px-6 py-4">{formatDate(dueDate)}</td>
      <td className="pr-6 py-4 relative">
        <div className="flex justify-end gap-4">
          <button aria-label="Assign" onClick={handleAssignClick}>
            <svg
              fill="#0008"
              height="24px" // Adjust size as needed
              width="24px" // Adjust size as needed
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 328.5 328.5"
              xmlSpace="preserve"
              className="h-6 w-6" // Adjust class for styling as needed
            >
              <g>
                <g>
                  <polygon points="96.333,150.918 96.333,135.918 55.667,135.918 55.667,95.251 40.667,95.251 40.667,135.918 0,135.918 0,150.918 40.667,150.918 40.667,191.583 55.667,191.583 55.667,150.918" />
                  <path d="M259.383,185.941H145.858c-38.111,0-69.117,31.006-69.117,69.117v39.928H328.5v-39.928C328.5,216.948,297.494,185.941,259.383,185.941z M313.5,279.987H91.741v-24.928c0-29.84,24.276-54.117,54.117-54.117h113.524c29.84,0,54.117,24.277,54.117,54.117L313.5,279.987L313.5,279.987z" />
                  <path d="M202.621,178.84c40.066,0,72.662-32.597,72.662-72.663s-32.596-72.663-72.662-72.663s-72.663,32.596-72.663,72.663S162.555,178.84,202.621,178.84z M202.621,48.515c31.795,0,57.662,25.867,57.662,57.663s-25.867,57.663-57.662,57.663c-31.796,0-57.663-25.868-57.663-57.663S170.825,48.515,202.621,48.515z" />
                </g>
              </g>
            </svg>
          </button>
          {/* <button aria-label="Edit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
              />
            </svg>
          </button> */}
          <button aria-label="Delete" onClick={handleDelete}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
        </div>
        {isDropdownOpen && (
          <Dropdown
            items={employeeList}
            onSelect={handleSelectEmployee}
            onClose={handleCloseDropdown}
          />
        )}
      </td>
    </tr>
  );
};

const Dropdown = ({ items, onSelect, onClose }) => {
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!items.length) {
    return null; // Don't render the dropdown if there are no items
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute w-52 top-10 right-8 rounded-md shadow-lg bg-white ring-black ring-opacity-5 z-10"
    >
      <div className="my-2 border-0">
        {items.map((item, index) => (
          <button
            key={index}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => onSelect(item)}
          >
            <FaPlus className="mr-2 text-gray-500" /> {/* Add icon */}
            {item.employeename}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TableRow;
