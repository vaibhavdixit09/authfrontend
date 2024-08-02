import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
} from "@mui/material";

// Component to edit user details
const EditModal = ({ isOpen, onClose, item, onSave }) => {
  const [formData, setFormData] = useState({ ...item });
  const [managers, setManagers] = useState([]);

  // Fetch managers list when modal is opened
  useEffect(() => {
    const fetchAllManagers = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/v1/get-all/manager"
        );
        const data = await response.json(); // Parse JSON data from response
        setManagers(data.data || []); // Adjust according to your API response structure
      } catch (error) {
        console.error("Error fetching managers:", error);
      }
    };

    if (isOpen) {
      fetchAllManagers();
    }
  }, [isOpen]);

  // Update formData when item changes
  useEffect(() => {
    setFormData({ ...item });
  }, [item]);

  // Handle text field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle manager selection change
  const handleManagerChange = (event, newValue) => {
    setFormData((prev) => ({
      ...prev,
      assigned_manager: newValue ? newValue._id : "",
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      await onSave(formData); // Call the parent component's handleSave function
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <TextField
          disabled
          margin="dense"
          name="email"
          label="Email"
          type="email"
          fullWidth
          variant="outlined"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          autoFocus
          margin="dense"
          name="employeename"
          label="Name"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.employeename}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="role"
          label="Role"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.role}
          onChange={handleChange}
        />
        <Autocomplete
          style={{ marginTop: 20 }}
          margin="dense"
          options={managers}
          getOptionLabel={(option) => option.managername || ""} // Adjust according to your data structure
          value={
            managers.find(
              (manager) => manager._id === formData.assigned_manager
            ) || null
          }
          onChange={handleManagerChange}
          renderInput={(params) => (
            <TextField
              {...params}
              name="assigned_manager"
              label="Assigned Manager"
              fullWidth
              variant="outlined"
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          style={{ backgroundColor: "maroon", color: "white" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          style={{ backgroundColor: "green", color: "white" }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditModal;
