import { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";

/* ---------- Task Type ---------- */
type Task = {
  text: string;
  completed: boolean;
};

export default function Todo() {
  /* ---------- States ---------- */
  const [task, setTask] = useState<string>("");

  const [tasks, setTasks] = useState<Task[]>(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  const [editIndex, setEditIndex] = useState<number | null>(null);

  /* ---------- Persist to localStorage ---------- */
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  /* ---------- Add / Update Task ---------- */
  const addTask = () => {
    if (task.trim() === "") return;

    if (editIndex !== null) {
      const updated = [...tasks];
      updated[editIndex].text = task;
      setTasks(updated);
      setEditIndex(null);
    } else {
      setTasks([...tasks, { text: task, completed: false }]);
    }

    setTask("");
  };

  /* ---------- Delete ---------- */
  const deleteTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  /* ---------- Edit ---------- */
  const editTask = (index: number) => {
    if (tasks[index].completed) return;
    setTask(tasks[index].text);
    setEditIndex(index);
  };

  /* ---------- Toggle Checkbox ---------- */
  const toggleComplete = (index: number) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);

    if (editIndex === index) {
      setEditIndex(null);
      setTask("");
    }
  };

  return (
    <div className="min-h-screen bg-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-pink-200 p-6 border border-pink-200">

        {/* ---------- Title ---------- */}
        <h1 className="flex items-center justify-center gap-3 text-3xl font-bold mb-6 text-pink-600 tracking-wide">
          <span className="animate-bounce">🎀</span>
          <span>TO-DO LIST</span>
          <span className="animate-bounce delay-150">🎀</span>
        </h1>

        {/* ---------- Input ---------- */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="enter your task..."
            className="flex-1 px-4 py-2 rounded-xl bg-pink-50 border border-pink-300 outline-none focus:ring-2 focus:ring-pink-300"
          />

          <button
  onClick={addTask}
  className="
    px-5 py-2 rounded-xl text-white
    bg-pink-500
    shadow-md shadow-pink-300
    hover:bg-pink-600
    hover:shadow-[0_0_12px_rgba(236,72,153,0.6)]
    active:scale-95
    transition-all duration-300
  "
>
  {editIndex !== null ? "UPDATE" : "ADD"}
</button>

        </div>

        {/* ---------- Task List ---------- */}
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-center text-pink-400">No tasks yet 🎀</p>
          ) : (
            tasks.map((item, index) => (
              <div
                key={index}
                className={`
                  flex items-center justify-between p-4 rounded-2xl
                  transition duration-300
                  ${
                    item.completed
                      ? "bg-pink-50 shadow-inner shadow-pink-200"
                      : "bg-pink-100 shadow-md shadow-pink-200 hover:shadow-lg hover:shadow-pink-300"
                  }
                `}
              >
                {/* ---------- Checkbox + Text ---------- */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleComplete(index)}
                    className="accent-pink-500 w-5 h-5"
                  />

                  <span
                    className={`font-medium ${
                      item.completed
                        ? "line-through text-pink-400"
                        : "text-pink-800"
                    }`}
                  >
                    {item.text}
                  </span>
                </div>

                {/* ---------- Icons ---------- */}
                <div className="flex gap-3">
                  {!item.completed && (
                    <button
                      onClick={() => editTask(index)}
                      title="Edit"
                      className="
                        text-pink-500
                        hover:text-pink-700
                        drop-shadow-md
                        hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]
                        hover:scale-110
                        transition
                      "
                    >
                      <Pencil size={20} />
                    </button>
                  )}

                  <button
                    onClick={() => deleteTask(index)}
                    title="Delete"
                    className="
                      text-pink-600
                      hover:text-pink-800
                      drop-shadow-md
                      hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.9)]
                      hover:scale-110
                      transition
                    "
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
