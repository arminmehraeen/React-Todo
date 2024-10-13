import React, { useEffect, useState } from "react";
import Todos from "./components/todos";

function App() {
  const [localTodos, setLocalTodos] = useState(null);

  useEffect(() => {
    console.log("Load data from local storage");
    
    setTimeout(() => {
      const storedTodos = localStorage.getItem("todos");
      if (storedTodos) {
        setLocalTodos(JSON.parse(storedTodos)); 
      } else {
        setLocalTodos([]); 
      }
    }, 1000); 
  }, []);

  if (localTodos === null) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
      </div>
    );
  }
  
  return (
    <>
      <Todos localTodos={localTodos} />
    </>
  );
}

export default App;
