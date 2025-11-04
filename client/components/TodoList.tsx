"use client";

import { addDocument, getCollection } from "@/lib/firebase";
import { FormEvent, useEffect, useState } from "react";
import { nanoid } from "nanoid";
interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const fetchTodos = async () => {
    const todos = await getCollection<Todo>("todo_list");
    setTodos(todos || []);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    setIsAdding(true);
    try {
      await addDocument("todo_list", {
        title: newTodoTitle.trim(),
        completed: false,
        id: nanoid(10),
      });
      setNewTodoTitle("");
      await fetchTodos(); // Refresh the list
    } catch (error) {
      console.error("Error adding todo:", error);
    } finally {
      setIsAdding(false);
    }
  };

  if (!todos)
    return <div className="text-zinc-500 dark:text-zinc-400">Loading...</div>;

  return (
    <div className="space-y-4">
      <form onSubmit={handleAddTodo} className="flex gap-2">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Add a new todo..."
          className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isAdding}
        />
        <button
          type="submit"
          disabled={isAdding || !newTodoTitle.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isAdding ? "Adding..." : "Add"}
        </button>
      </form>

      {todos.length === 0 ? (
        <div className="text-zinc-500 dark:text-zinc-400 text-center py-8">
          No todos yet. Add one above!
        </div>
      ) : (
        <div className="space-y-2">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center gap-3"
            >
              <input
                type="checkbox"
                checked={todo.completed || false}
                readOnly
                className="w-4 h-4 rounded"
              />
              <span
                className={
                  todo.completed
                    ? "line-through text-zinc-500 dark:text-zinc-400 flex-1"
                    : "text-black dark:text-zinc-50 flex-1"
                }
              >
                {todo.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoList;
