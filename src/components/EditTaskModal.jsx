import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

// Component to assign a task with a simple date picker
const EditTaskModal = ({ isOpen, onClose, onSave, userDetails }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
    dueDate: "",
    assignedTo: `${userDetails._id}`,
  });
  const [dueDate, setDueDate] = useState(formData.dueDate || "");

  // Handle text field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle date change
  const handleDateChange = (e) => {
    setDueDate(e.target.value);
    setFormData((prev) => ({ ...prev, dueDate: e.target.value }));
  };

  // Handle form submission
  const handleSubmit = () => {
    try {
      console.log("Form Data Submitted:", formData); // Print formData
      onSave(formData); // Call the parent component's onSubmit function with formData
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Assign Task</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="title"
          label="Task Title"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.title}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="description"
          label="Description"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.description}
          onChange={handleChange}
        />
        {/* <TextField
          margin="dense"
          name="status"
          label="Status"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.status}
          onChange={handleChange}
        /> */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={handleDateChange}
            className="mt-1 block w-full text-sm border border-gray-300 rounded-lg p-2"
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} className="bg-red-500 text-white">
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="bg-green-500 text-white">
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTaskModal;
