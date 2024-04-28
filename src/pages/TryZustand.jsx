import { useMemo, useState } from "react";
import { useTaskStore } from "../store/taskStore";

const TryZustand = () => {
    return (
        <div className="h-screen bg-gray-700 pt-[150px]">
            <div className="flex h-full w-full items-start justify-center gap-10 bg-gray-700 px-10">
                <Column state="PLANNED" />
                <Column state="ONGOING" />
                <Column state="DONE" />
            </div>
        </div>
    );
};

const Column = ({ state }) => {
    const { tasks, draggedTask, addTask, setDraggedTask, moveTask } = useTaskStore();
    const taskFilters = tasks.filter((task) => task.state === state);
    const [taskTitle, setTaskTitle] = useState("");
    const [drop, setDrop] = useState(false);

    return (
        <div
            className={`flex min-h-[60%] w-[33%] flex-col border border-dashed border-transparent bg-gray-600 p-2 ${drop && "!border-white"}`}
            onDragOver={(e) => {
                e.preventDefault();
                setDrop(true);
            }}
            onDragLeave={() => setDrop(false)}
            onDrop={() => {
                setDrop(false);
                moveTask(draggedTask.title, state);
                setDraggedTask(null, null);
            }}
        >
            <div className="mb-2 flex items-center justify-between">
                <span className="text-white">{state}</span>
                <label
                    htmlFor={"add-item-" + state}
                    className="cursor-pointer bg-white px-2 py-1 text-black"
                    onClick={(e) => {
                        console.log(
                            e.currentTarget.nextElementSibling.nextElementSibling.children[1].children[1].focus(),
                        );
                    }}
                >
                    Add
                </label>
                <input id={"add-item-" + state} type="checkbox" className="hidden [&:checked+div]:flex" />
                <div className="fixed left-0 top-0 hidden h-screen w-screen items-center justify-center">
                    <label
                        htmlFor={"add-item-" + state}
                        className="absolute left-0 top-0 -z-10 h-full w-full bg-[#000000b9]"
                    ></label>
                    <label>
                        <span className="text-white">Title: </span>
                        <input
                            type="text"
                            className="pl-2 outline-none"
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.keyCode == 13) {
                                    addTask(taskTitle, state);
                                    setTaskTitle("");
                                    e.currentTarget.parentElement.parentElement.previousElementSibling.checked = false;
                                }
                            }}
                        />
                    </label>
                </div>
            </div>
            <div className="flex w-full flex-1 flex-col gap-2">
                {taskFilters.map((task, index) => {
                    return <Task key={index} state={state} title={task.title} />;
                })}
            </div>
        </div>
    );
};

const Task = ({ title, state }) => {
    const { deleteTask, draggedTask, setDraggedTask } = useTaskStore();

    console.log(draggedTask);

    return (
        <div
            className={`h-auto w-full p-2 ${state === "PLANNED" && "bg-gray-400"} ${state === "ONGOING" && "bg-blue-400"} ${state === "DONE" && "bg-green-400"} cursor-move`}
            draggable
            onDragStart={() => setDraggedTask(title, state)}
        >
            <span>{title}</span>
            <div className="flex h-[60px] w-full items-end justify-between">
                <span onClick={() => deleteTask(title)} className="cursor-pointer">
                    <i className="fa-light fa-trash-xmark"></i>
                </span>
                <span className="border border-white p-1">{state}</span>
            </div>
        </div>
    );
};

export default TryZustand;
