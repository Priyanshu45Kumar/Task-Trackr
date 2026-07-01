import { Pencil, Trash2, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import API from "../services/api";

function TaskCard({ task, fetchTasks, setEditingTask, setIsFormOpen }) {
  const deleteTask = async () => {
    try {
      await API.delete(`/${task._id}`);
      toast.success("Task deleted");
      fetchTasks();
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const isCompleted = task.status === "completed";

  return (
    <div className="group bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-200">
      <div className="flex justify-between items-start gap-3">
        <h3 className="text-lg font-semibold text-gray-900 leading-snug break-words">
          {task.title}
        </h3>

        <span
          className={`flex items-center gap-1.5 shrink-0 px-3 py-1 rounded-full text-xs font-medium ${
            isCompleted
              ? "bg-green-50 text-green-700"
              : "bg-yellow-50 text-yellow-700"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isCompleted ? "bg-green-500" : "bg-yellow-500"
            }`}
          />
          {task.status}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-3">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-4">
        <Calendar size={14} />
        <span>Due {new Date(task.dueDate).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}</span>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={() => {
            setEditingTask(task);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Pencil size={16} /> Edit
        </button>

        <button
          onClick={deleteTask}
          className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;