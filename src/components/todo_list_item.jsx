import { useState } from "react";
import DeleteIcon from "./icons/delete_icon";
import EditIcon from "./icons/edit_icon";

export default function TodoListItem({ todo, deleteTodo, toggleTodoStatus, editTodoTitle }) {
    const [editMode, setEditMode] = useState(false);

    const editTodoHandler = (event) => {
        if (event.key === 'Enter') {
            editTodoTitle(todo, event.target.value);
            setEditMode(false);
        }
    }

    return (
        <li className="relative flex items-center justify-between px-4 py-4 bg-gray-800 border border-gray-700 rounded-lg mb-2">
            {
                editMode
                ? (
                    <div className="w-full flex items-center">
                        <input 
                            type="text" 
                            defaultValue={todo?.title} 
                            onChange={() => {}} 
                            onKeyDown={editTodoHandler} 
                            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded" 
                        />
                        <DeleteIcon className="ml-4 text-red-500" onClick={() => setEditMode(false)} /> 
                    </div>
                )
                : (
                    <div className="flex items-center w-full justify-between"> {/* راست‌چین کردن کل محتوا */}
                        <div className="flex items-center mr-4"> {/* چک باکس و متن در سمت چپ */}
                            <label className="flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={todo?.status} 
                                    onChange={() => toggleTodoStatus(todo)} 
                                    className="hidden" // پنهان کردن چک باکس
                                />
                                <span className="h-6 w-6 inline-block rounded-full border-2 mx-2 border-gray-600 flex items-center justify-center transition duration-200 ease-in-out">
                                    <span className={`h-4 w-4 bg-green-500 rounded-full ${todo?.status ? 'block' : 'hidden'}`} />
                                </span>
                            </label>
                            <p className={`inline-block text-white ${todo?.status ? 'line-through' : ''}`}>{todo?.title}</p>
                        </div>
                        <div className="flex items-center space-x-2"> {/* آیکن‌ها در سمت راست */}
                            <EditIcon className="text-blue-400" onClick={() => setEditMode(true)} />
                            <DeleteIcon className="text-red-500" onClick={() => deleteTodo(todo)} />
                        </div>
                    </div>
                )
            }
        </li>
    )
}
