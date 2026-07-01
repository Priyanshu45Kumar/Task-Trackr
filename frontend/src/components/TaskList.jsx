import TaskCard from "./TaskCard";



function TaskList({
  tasks,
  fetchTasks,
  setEditingTask,
  setIsFormOpen
}) {
  if (tasks.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-md text-center text-gray-500">
        No tasks found. Add your first task.
      </div>
    );
  }

  return (
   <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
  {tasks.map((task) => (
    <TaskCard
      key={task._id}
      task={task}
      fetchTasks={fetchTasks}
      setEditingTask={setEditingTask}
      setIsFormOpen={setIsFormOpen}
    />
  ))}
</div>
  );
}

export default TaskList;