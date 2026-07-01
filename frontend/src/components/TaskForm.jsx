import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { X, Type, AlignLeft, Flag, Calendar } from "lucide-react";
import API from "../services/api";

function TaskForm({
  fetchTasks,
  editingTask,
  setEditingTask,
  isFormOpen,
  setIsFormOpen,
}) {
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "pending",
    dueDate: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTask({
        title: editingTask.title,
        description: editingTask.description,
        status: editingTask.status,
        dueDate: editingTask.dueDate.split("T")[0],
      });
    }
  }, [editingTask]);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setTask({
      title: "",
      description: "",
      status: "pending",
      dueDate: "",
    });
    setEditingTask(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!task.title || !task.description || !task.dueDate) {
      toast.error("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    try {
      if (editingTask) {
        await API.put(`/${editingTask._id}`, task);
        toast.success("Task updated successfully");
      } else {
        await API.post("/", task);
        toast.success("Task added successfully");
      }

      resetForm();
      setIsFormOpen(false);
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    setIsFormOpen(false);
  };

  if (!isFormOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {editingTask ? "Update Task" : "Add New Task"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
              <Type size={15} className="text-gray-400" />
              Title
            </label>
            <input
              name="title"
              value={task.title}
              onChange={handleChange}
              placeholder="e.g. Finish quarterly report"
              className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
              <AlignLeft size={15} className="text-gray-400" />
              Description
            </label>
            <textarea
              name="description"
              value={task.description}
              onChange={handleChange}
              placeholder="Add more details about this task..."
              rows={3}
              className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                <Flag size={15} className="text-gray-400" />
                Status
              </label>
              <select
                name="status"
                value={task.status}
                onChange={handleChange}
                className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm bg-white"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                <Calendar size={15} className="text-gray-400" />
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={task.dueDate}
                onChange={handleChange}
                className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-sm"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting
                ? "Saving..."
                : editingTask
                ? "Update Task"
                : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;