import React from 'react';

import {useSelector, useDispatch} from "react-redux";
import {changeActiveFilter,  removeAllTodosAsync} from "../redux/todos/todosSlice";

function ContentFooter() {

    const items = useSelector((state) => state.todos.items);
    const activeFilter = useSelector((state) => state.todos.activeFilter);
    const itemsLeft = items.filter((item) => !item.completed).length;
     const dispatch = useDispatch();
    const handleDestroyAll = async () => {
        if (window.confirm("Are you sure?")) {
            const completedItems = items.filter((item) => item.completed === true);
            await dispatch(removeAllTodosAsync(completedItems));
        }
    };
    return (
        <footer className="footer">
		     <span className="todo-count">
			 <strong>{itemsLeft}</strong> item{itemsLeft >1 && 's'} left
		     </span>

            <ul className="filters">
                <li>
                    <a href="#/" className={activeFilter === 'all' ? 'selected' : ''}
                    onClick={() => dispatch(changeActiveFilter('all'))}
                    >All</a>
                </li>
                <li>
                    <a href="#/"
                       className={activeFilter === 'active' ? 'selected' : ''}
                       onClick={() => dispatch(changeActiveFilter('active'))}
                    >Active</a>
                </li>
                <li>
                    <a href="#/"
                       className={activeFilter === 'completed' ? 'selected' : ''}
                       onClick={() => dispatch(changeActiveFilter('completed'))}
                    >Completed</a>
                </li>
            </ul>

            <button className="clear-completed" onClick={handleDestroyAll}>
                Clear completed
            </button>
        </footer>
    );
}

export default ContentFooter;