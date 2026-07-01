import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Bell, Search, Plus, ClipboardList } from "lucide-react";
import API from "./services/api";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/");
      setTasks(res.data.tasks);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const notifications = tasks.filter((task) => {
    if (task.status === "completed") return false;

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    return diffDays <= 2;
  });

  const getNotificationText = (task) => {
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: `Overdue: ${task.title}`, urgent: true };
    if (diffDays === 0) return { text: `Due today: ${task.title}`, urgent: true };
    return { text: `Due in ${diffDays} day(s): ${task.title}`, urgent: false };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 sm:p-6">
      <Toaster position="top-right" />

      <TaskForm
        fetchTasks={fetchTasks}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
        isFormOpen={isFormOpen}
        setIsFormOpen={setIsFormOpen}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-blue-500/30">
              <ClipboardList className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent tracking-tight leading-tight">
                Task Trackr
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 font-medium">
                Stay on top of what matters
              </p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <Bell size={20} className="text-gray-600" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-40">
                  <h2 className="font-semibold text-gray-900 mb-3">Task Alerts</h2>

                  {notifications.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-4">
                      You're all caught up 🎉
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-72 overflow-y-auto">
                      {notifications.map((task) => {
                        const { text, urgent } = getNotificationText(task);
                        return (
                          <div
                            key={task._id}
                            className={`p-3 rounded-lg text-sm border ${
                              urgent
                                ? "bg-red-50 border-red-100 text-red-700"
                                : "bg-yellow-50 border-yellow-100 text-yellow-700"
                            }`}
                          >
                            {text}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Search + Add */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mb-6">
          <div className="relative w-full sm:w-96">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            />
          </div>

          <button
            onClick={() => {
              setEditingTask(null);
              setIsFormOpen(true);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-fuchsia-500/30 hover:shadow-xl hover:shadow-fuchsia-500/40 hover:from-violet-700 hover:to-fuchsia-700 active:scale-[0.98] transition-all"
          >
            <Plus size={18} /> Add Task
          </button>
        </div>

        {/* Task count */}
        {tasks.length > 0 && (
          <p className="text-sm text-gray-500 mb-4">
            {filteredTasks.length} of {tasks.length} task{tasks.length !== 1 ? "s" : ""}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        )}

        {/* Empty state */}
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-white p-5 rounded-2xl shadow-sm mb-4">
              <ClipboardList size={32} className="text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">
              {searchTerm ? "No tasks match your search" : "No tasks yet"}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {searchTerm ? "Try a different keyword" : "Click \"Add Task\" to get started"}
            </p>
          </div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            fetchTasks={fetchTasks}
            setEditingTask={setEditingTask}
            setIsFormOpen={setIsFormOpen}
          />
        )}
      </div>
    </div>
  );
}

export default App;