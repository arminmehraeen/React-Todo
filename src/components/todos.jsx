import React, { useEffect, useState } from "react";
import TodoList from "./todo_list";
import { v4 as uuidv4 } from 'uuid';

export default function Todos({ localTodos }) {
  const [todos, setTodos] = useState(localTodos ?? []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const onKeyDownHandler = (event) => {
    if (event.key == "Enter" && event.target.value !== "") {
      setTodos([
        ...todos,
        {
          id: uuidv4(),
          title: event.target.value,
          status: false
        }
      ]);
      event.target.value = "";
    }
  }

  const onTodoDeletedHandler = (todo) => {
    const newTodos = todos.filter((item) => todo?.id !== item?.id);
    setTodos(newTodos);
  }

  const onChangeTodoStatusHandler = (todo) => {
    const newTodos = todos.map((item) => {
      if (todo?.id === item?.id) {
        item.status = !item.status;
      }
      return item;
    });
    setTodos(newTodos);
  }

  const editTodoTitleHandler = (todo, newTitleValue) => {
    const newTodos = todos.map((todoItem) => {
      if (todo.id === todoItem.id) {
        todoItem.title = newTitleValue;
      }
      return todoItem;
    });
    setTodos(newTodos);
  }

  const clearAllTodoHandler = () => {
    setTodos([]) ;
  }

  return (
    <div className="bg-gray-900">
      <div className="flex items-center justify-center h-screen">
        <div className="w-full px-4 py-8 mx-auto shadow lg:w-1/3 bg-gray-800">
          <div className="flex items-center mb-6">
            <h1 onClick={clearAllTodoHandler} className="mr-6 text-4xl font-bold text-green-600 font-vazir">Todo App</h1>
          </div>
          <div className="relative">
            <input
              type="text"
              onKeyDown={onKeyDownHandler}
              placeholder="What tasks need to be done today?"
              className="w-full px-2 py-3 border rounded outline-none border-grey-600 bg-gray-700 text-white font-vazir" 
            />
          </div>
          <hr className="border-t border-gray-300 my-4" />
          <TodoList 
            todos={todos} 
            onTodoDeletedHandler={onTodoDeletedHandler} 
            onChangeTodoStatusHandler={onChangeTodoStatusHandler} 
            editTodoTitle={editTodoTitleHandler} 
          />
        </div>
      </div>
    </div>
  );
}
