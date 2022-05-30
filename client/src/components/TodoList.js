import { useEffect } from "react";

import Loading from "./Loading";
import Error from "./Error";

import { useSelector, useDispatch } from "react-redux";
import {
    toggleTodoAsync,
    getTodosAsync,
    removeTodoAsync,
} from "../redux/todos/todosSlice";
import { selectFilteredTodos } from "../redux/todos/todosSlice";

function TodoList() {
    const dispatch = useDispatch();
    const filteredTodos = useSelector(selectFilteredTodos);
    const isLoading = useSelector((state) => state.todos.isLoading);
    const error = useSelector((state) => state.todos.error);

    useEffect(() => {
        dispatch(getTodosAsync());
    }, [dispatch]);

    const handleDestroy = async (id) => {
        if (window.confirm("Are you sure?")) {
            await dispatch(removeTodoAsync(id));
        }
    };

    const handleToggle = async (id, completed) => {
        await dispatch(toggleTodoAsync({ id, data: { completed } }));
    };

    if (isLoading) {
        return <Loading />;
    }
    if (error) {
        return <Error message={error} />;
    }

    return (
        <ul className="todo-list">
            {filteredTodos.map((item) => (
                <li className={item.completed ? "completed" : ""} key={item.id}>
                    <div className="view">
                        <input
                            className="toggle"
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => handleToggle(item.id, !item.completed)}
                        />
                        <label>{item.title}</label>
                        <button
                            className="destroy"
                            onClick={() => handleDestroy(item.id)}
                        />

                    </div>
                </li>
            ))}
        </ul>
    );
}

export default TodoList;