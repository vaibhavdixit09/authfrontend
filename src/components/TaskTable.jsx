import React, { useEffect, useState } from "react";
import TableRow from "./TableRow";

// const data = [
//   {
//     name: "Steven Jobs",
//     email: "jobs@sailboatui.com",
//     status: "Active",
//     role: "Product Designer",
//     team: [
//       { label: "Design", bgColor: "bg-blue-50", textColor: "text-blue-600" },
//       {
//         label: "Product",
//         bgColor: "bg-indigo-50",
//         textColor: "text-indigo-600",
//       },
//       {
//         label: "Develop",
//         bgColor: "bg-violet-50",
//         textColor: "text-violet-600",
//       },
//     ],
//     onEdit: () => console.log("Edit"),
//     onDelete: () => console.log("Delete"),
//   },
//   {
//     name: "Steven Jobs",
//     email: "jobs@sailboatui.com",
//     status: "Active",
//     role: "Product Designer",
//     team: [
//       { label: "Design", bgColor: "bg-blue-50", textColor: "text-blue-600" },
//       {
//         label: "Product",
//         bgColor: "bg-indigo-50",
//         textColor: "text-indigo-600",
//       },
//       {
//         label: "Develop",
//         bgColor: "bg-violet-50",
//         textColor: "text-violet-600",
//       },
//     ],
//     onEdit: () => console.log("Edit"),
//     onDelete: () => console.log("Delete"),
//   },
//   {
//     name: "Steven Jobs",
//     email: "jobs@sailboatui.com",
//     status: "Active",
//     role: "Product Designer",
//     team: [
//       { label: "Design", bgColor: "bg-blue-50", textColor: "text-blue-600" },
//       {
//         label: "Product",
//         bgColor: "bg-indigo-50",
//         textColor: "text-indigo-600",
//       },
//       {
//         label: "Develop",
//         bgColor: "bg-violet-50",
//         textColor: "text-violet-600",
//       },
//     ],
//     onEdit: () => console.log("Edit"),
//     onDelete: () => console.log("Delete"),
//   },
//   // Add more rows as needed
// ];

const TaskTable = ({ dataList, onDelete, onAssign, employeeList }) => {
  console.log(employeeList, "in table task component");

  return (
    <div className="relative  rounded-lg border border-gray-200 shadow-md m-5">
      <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-4 font-medium text-gray-900">
              Title
            </th>
            <th scope="col" className="px-6 py-4 font-medium text-gray-900">
              Description
            </th>
            <th scope="col" className="px-6 py-4 font-medium text-gray-900">
              Priority
            </th>
            <th scope="col" className="px-6 py-4 font-medium text-gray-900">
              Due date
            </th>
            <th
              scope="col"
              className="px-6 py-4 font-medium text-gray-900"
            ></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 border-t border-gray-100">
          {dataList.map((row, index) => (
            <TableRow
              key={index}
              _id={row._id}
              title={row.title}
              description={row.description}
              priority={row.priority}
              dueDate={row.dueDate}
              employeeList={employeeList}
              onDelete={onDelete}
              onAssign={onAssign}
              //   team={row.team}
              //   onEdit={row.onEdit}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
