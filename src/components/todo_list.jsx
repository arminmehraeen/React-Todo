import TodoListItem from "./todo_list_item";


export default function TodoList({ todos , onTodoDeletedHandler , onChangeTodoStatusHandler, editTodoTitle}) {
    return (
        <>
            <ul className="list-reset">
                {todos.map( (todo,index) =>  <TodoListItem key={index} todo={todo} deleteTodo={onTodoDeletedHandler} toggleTodoStatus={onChangeTodoStatusHandler} editTodoTitle={editTodoTitle}/>)}
            </ul>
        </>
    )
}
