import TodoListItem from "./todo_list_item";


export default function TodoList() {
    return (
        <>
            <ul className="list-reset">
                <TodoListItem />
                <TodoListItem />
                <TodoListItem />
            </ul>
        </>
    )
}
