import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getTodosAsync = createAsyncThunk('todos/getTodosAsync', async () => {
    const res = await axios(`${process.env.REACT_APP_API_BASE_ENDPOINT}/todos`);
    return res.data;
    }
)

export const addTodoAsync = createAsyncThunk('todos/addTodoAsync', async (data) => {
    const res =await axios.post(`${process.env.REACT_APP_API_BASE_ENDPOINT}/todos`, data);
    return res.data;
})

export const removeTodoAsync = createAsyncThunk(
    "todos/removeTodoAsync",
    async (id) => {
        await axios.delete(
            `${process.env.REACT_APP_API_BASE_ENDPOINT}/todos/${id}`
        );
        return id;
    }
);

// Remove all Todos
export const removeAllTodosAsync = createAsyncThunk(
    "todos/removeAllTodosAsync",
    async () => {
        await axios.delete(
            `${process.env.REACT_APP_API_BASE_ENDPOINT}/todos`
        );
    }
);

// add toggle to do
export const toggleTodoAsync = createAsyncThunk(
    "todos/toggleTodoAsync",
    async ({ id, data }) => {
        const res = await axios.patch(
            `${process.env.REACT_APP_API_BASE_ENDPOINT}/todos/${id}`,
            data
        );
        return res.data;
    }
);

export const todosSlice = createSlice({
    name: "todos",
    initialState: {
        items: [],
        isLoading: false,
        error: null,
        activeFilter: "all",
        addNewIsTodoLoading: false,
        addNewTodoError: null,
    },
    reducers: {
        /*addTodo: {  // Bu reducera gerek yok. Çünkü todos/addTodoAsync async thunk'ı kullanıyoruz.
            reducer: (state, action) => {
                state.items.push(action.payload);
            },
            prepare: ({ title }) => {
                return {
                    payload: {
                        id: nanoid(10),
                        completed: false,
                        title
                    },
                };
            },
        },*/
        /*toggle: (state, action) => { // Bu reducera gerek yok. Çünkü todos/toggleTodoAsync async thunk'ı kullanıyoruz.
            const { id } = action.payload;
            const item = state.items.find((item) => item.id === id);

            item.completed = !item.completed;
        },*/
        /*destroy: (state, action) => {
            const id = action.payload;
            const filtered = state.items.filter((item) => item.id !== id);
            state.items = filtered;
        },*/
        changeActiveFilter: (state, action) => {
            state.activeFilter = action.payload;
        },
        clearCompleted: (state) => {
            const filtered = state.items.filter((item) => item.completed === false);
            state.items = filtered;
        },
    },
    extraReducers: {
        // Get todos
        [getTodosAsync.pending]: (state, action) => {
            state.isLoading = true;
        },
        [getTodosAsync.fulfilled]: (state, action) => {
            state.items = action.payload;
            state.isLoading = false;
        },
        [getTodosAsync.rejected]: (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        },
        // Add todo
        [addTodoAsync.pending]: (state, action) => {
            state.addNewIsTodoLoading = true;
        },
        [addTodoAsync.fulfilled]: (state, action) => {
            state.items.push(action.payload);
            state.addNewIsTodoLoading = false;
        },
        [addTodoAsync.rejected]: (state, action) => {
            state.addNewIsTodoLoading = false;
            state.addNewTodoError = action.error.message;
        },
        // Toggle todo
        [toggleTodoAsync.fulfilled]: (state, action) => {
            const { id, completed } = action.payload;
            const index = state.items.findIndex((item) => item.id === id);
            state.items[index].completed = completed;
        },
        // Remove todo
        [removeTodoAsync.fulfilled]: (state, action) => {
            const id = action.payload;
            const filtered = state.items.filter((item) => item.id !== id);
            state.items = filtered;
        },
        // Remove all todos
        [removeAllTodosAsync.fulfilled]: (state, action) => {
            state.items = [];
        },
    }
});

export const selectTodos = (state) => state.todos.items;
export const selectFilteredTodos = (state) => {
    if (state.todos.activeFilter === "all") {
        return state.todos.items;
    }
    return state.todos.items.filter((todo) =>
        state.todos.activeFilter === "active"
            ? todo.completed === false
            : todo.completed === true
    );
};

export const {    changeActiveFilter, clearCompleted } =
    todosSlice.actions;
export default todosSlice.reducer;