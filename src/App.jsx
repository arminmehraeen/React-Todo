import React, { useEffect, useState } from "react";
import Todos from "./components/todos";

function App() {
  const [localTodos, setLocalTodos] = useState(null); // Set it to null initially

  // Load todos from localStorage with a 2-second delay when App component mounts
  useEffect(() => {
    setTimeout(() => {
      const storedTodos = localStorage.getItem("todos");
      if (storedTodos) {
        setLocalTodos(JSON.parse(storedTodos)); // Parse and set the todos if available
      } else {
        setLocalTodos([]); // If no todos in localStorage, set an empty array
      }
    }, 1000); 
  }, []);

  // Only render Todos component when localTodos is not null (i.e., after it's loaded)
  if (localTodos === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
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
