import TodoListItem from "./todo_list_item";


export default function TodoList({ todos , onTodoDeletedHandler}) {
    return (
        <>
            <ul className="list-reset">
                {todos.map( (todo,index) =>  <TodoListItem key={index} todo={todo} onTodoDeletedHandler={onTodoDeletedHandler}/>)}
            </ul>
        </>
    )
}
