"use client";

import { updateDocument } from "@/lib/firebase";
import { Todo } from "./TodoList";
import { useState } from "react";

export const TodoListItem: React.FC<Todo> = (todo) => {
  const [todoItem, setTodoItem] = useState(todo);

  const handleCompletion = async (todo: Todo) => {
    setTodoItem((prev) => ({ ...prev, isCompleted: !prev.isCompleted }));
    await updateDocument<Todo>(`todo_list/${todo.id}`, {
      isCompleted: !todo.isCompleted,
    });
  };

  return (
    <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center gap-3">
      <input
        type="checkbox"
        checked={todoItem.isCompleted}
        className="w-4 h-4 rounded"
        onChange={() => handleCompletion(todo)}
      />
      <span
        className={
          todoItem.isCompleted
            ? "line-through text-zinc-500 dark:text-zinc-400 flex-1"
            : "text-black dark:text-zinc-50 flex-1"
        }
      >
        {todo.title}
      </span>
    </div>
  );
};
