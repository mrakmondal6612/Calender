import { useState, useCallback, useEffect, useMemo } from "react";
import type { Todo, TodoPriority, TodoStatus, TodoCategory } from "@/lib/calendar-types";

const TODOS_KEY = "calendar_todos";

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export type TodoSortBy = "dueDate" | "priority" | "status" | "created";
export type TodoFilterBy = {
  status?: TodoStatus | "all";
  priority?: TodoPriority | "all";
  category?: TodoCategory | "all";
  tag?: string;
};

const PRIORITY_ORDER: Record<TodoPriority, number> = { urgent: 0, high: 1, medium: 2, low: 3 };

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => load(TODOS_KEY, []));
  const [sortBy, setSortBy] = useState<TodoSortBy>("dueDate");
  const [filters, setFilters] = useState<TodoFilterBy>({ status: "all", priority: "all", category: "all" });

  useEffect(() => { localStorage.setItem(TODOS_KEY, JSON.stringify(todos)); }, [todos]);

  const addTodo = useCallback((todo: Todo) => {
    setTodos((prev) => [...prev, todo]);
  }, []);

  const updateTodo = useCallback((todo: Todo) => {
    setTodos((prev) => prev.map((t) => (t.id === todo.id ? todo : t)));
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTodoStatus = useCallback((id: string) => {
    setTodos((prev) => prev.map((t) => {
      if (t.id !== id) return t;
      const nextStatus: TodoStatus = t.status === "todo" ? "in_progress" : t.status === "in_progress" ? "completed" : "todo";
      return { ...t, status: nextStatus, completedAt: nextStatus === "completed" ? new Date().toISOString() : undefined };
    }));
  }, []);

  const toggleSubtask = useCallback((todoId: string, subtaskId: string) => {
    setTodos((prev) => prev.map((t) => {
      if (t.id !== todoId) return t;
      return { ...t, subtasks: t.subtasks.map((s) => s.id === subtaskId ? { ...s, completed: !s.completed } : s) };
    }));
  }, []);

  const bulkDelete = useCallback((ids: string[]) => {
    setTodos((prev) => prev.filter((t) => !ids.includes(t.id)));
  }, []);

  const bulkUpdateStatus = useCallback((ids: string[], status: TodoStatus) => {
    setTodos((prev) => prev.map((t) => ids.includes(t.id) ? { ...t, status, completedAt: status === "completed" ? new Date().toISOString() : undefined } : t));
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = [...todos];
    if (filters.status && filters.status !== "all") result = result.filter((t) => t.status === filters.status);
    if (filters.priority && filters.priority !== "all") result = result.filter((t) => t.priority === filters.priority);
    if (filters.category && filters.category !== "all") result = result.filter((t) => t.category === filters.category);
    if (filters.tag) result = result.filter((t) => t.tags.includes(filters.tag!));

    result.sort((a, b) => {
      switch (sortBy) {
        case "dueDate": return (a.dueDate || "9").localeCompare(b.dueDate || "9");
        case "priority": return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        case "status": return a.status.localeCompare(b.status);
        case "created": return b.createdAt.localeCompare(a.createdAt);
        default: return 0;
      }
    });
    return result;
  }, [todos, sortBy, filters]);

  const stats = useMemo(() => ({
    total: todos.length,
    todo: todos.filter((t) => t.status === "todo").length,
    inProgress: todos.filter((t) => t.status === "in_progress").length,
    completed: todos.filter((t) => t.status === "completed").length,
    overdue: todos.filter((t) => t.dueDate && t.status !== "completed" && new Date(t.dueDate) < new Date()).length,
  }), [todos]);

  const allTags = useMemo(() => [...new Set(todos.flatMap((t) => t.tags))], [todos]);

  return {
    todos, filteredAndSorted, stats, allTags,
    sortBy, setSortBy, filters, setFilters,
    addTodo, updateTodo, deleteTodo, toggleTodoStatus, toggleSubtask,
    bulkDelete, bulkUpdateStatus,
  };
}
