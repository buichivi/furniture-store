import { create } from "zustand";

const store = (set) => ({
    tasks: [
        {
            title: "test",
            state: "PLANNED",
        },
        {
            title: "test1",
            state: "ONGOING",
        },
        {
            title: "test2",
            state: "PLANNED",
        },
        {
            title: "test3",
            state: "DONE",
        },
    ],
    draggedTask: null,
    addTask: (title, state) => set((store) => ({ tasks: [...store.tasks, { title: title, state }] })),
    deleteTask: (title) => set((store) => ({ tasks: store.tasks.filter((task) => task.title !== title) })),
    moveTask: (title, state) =>
        set((store) => ({ tasks: store.tasks.map((task) => (task.title === title ? { title, state } : task)) })),
    setDraggedTask: (title, state) => set(() => ({ draggedTask: { title, state } })),
});

export const useTaskStore = create(store);
