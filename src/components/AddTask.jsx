import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
  Textarea,
  Select,
  Option,
} from "@material-tailwind/react";

const AddTask = ({ onSaveTask }) => {
  const [taskSaving, setTaskSaving] = useState("Add task");

  const [formData, setFormData] = useState({
    title: "",
    priority: "moderate",
    description: "",
    dueDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveTask(formData);
    setFormData({
      title: "",
      priority: "moderate",
      description: "",
      dueDate: "",
    });
    setTaskSaving("saving..");
    setTimeout(() => {
      setTaskSaving("Add task");
    }, 2000);
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader floated={false} shadow={false} className="p-4">
        <Typography variant="h4" className="text-center text-gray-800">
          Add New Task
        </Typography>
      </CardHeader>
      <CardBody className="px-8 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                type="text"
                label="Task Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="bg-gray-50 text-gray-800 border border-gray-300 focus:border-blue-500"
              />
            </div>
            <div>
              <Select
                label="Priority"
                name="priority"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e,
                  })
                }
                className="bg-gray-50 text-gray-800 border border-gray-300 focus:border-blue-500"
              >
                <Option value="urgent">Urgent</Option>
                <Option value="moderate">Moderate</Option>
                <Option value="lessimportant">Less Important</Option>
              </Select>
            </div>
          </div>
          <div>
            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="bg-gray-50 text-gray-800 border border-gray-300 focus:border-blue-500"
            />
          </div>
          <div>
            <Input
              type="date"
              label="Due Date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="bg-gray-50 text-gray-800 border border-gray-300 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-400 to-blue-600 text-white"
            >
              {taskSaving}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default AddTask;
