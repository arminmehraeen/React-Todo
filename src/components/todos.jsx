import { useState } from "react";
import TodoList from "./todo_list";


export default function Todos() {
  const [todos,setTodos] = useState([
    {
      "title" : "This is a school",
      "status" : false
    },
    {
      "title" : "This is a home",
      "status" : true
    },
    {
      "title" : "This is a gym",
      "status" : false
    },
  ]) ;
  return (
    <>
      <div className="bg-gray-100">
        <div className="flex items-center justify-center h-screen">
            <div className="w-full px-4 py-8 mx-auto shadow lg:w-1/3  bg-white">
                <div className="flex items-center mb-6">
                    <h1 className="mr-6 text-4xl font-bold text-purple-600"> TO DO APP</h1>
                </div>
                <div className="relative">
                    <input type="text" placeholder="What needs to be done today?"
                    className="w-full px-2 py-3 border rounded outline-none border-grey-600" />
                </div>
                <TodoList todos={todos}/>
            </div>
        </div>
    </div>
    </>
  )
}


