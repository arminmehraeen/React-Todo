import DeleteIcon from "./icons/delete_icon";
import EditIcon from "./icons/edit_icon";

export default function TodoListItem({ todo , onTodoDeletedHandler }) {
    return (
        <>
            <li className="relative flex items-center justify-between px-2 py-6 border-b">
                <div>
                    <input checked={todo?.status} onChange={()=> {}} type="checkbox" />
                    <p className={`inline-block mt-1 ml-2 text-gray-600 ${todo?.status ? 'line-through' : ''}`}>{ todo.title }</p>
                </div>
                <button type="button" className="absolute right-0 flex items-center  space-x-1">
                    <EditIcon/>
                    <DeleteIcon onClick={()=> onTodoDeletedHandler(todo) }/>
                </button>
            </li>
        </>
    )
}
