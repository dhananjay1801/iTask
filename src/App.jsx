import { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar'
import { v4 as uuidv4 } from 'uuid';
import { MdModeEdit, MdDeleteForever } from "react-icons/md";

function App() {
    const [todo, setTodo] = useState("");
    const [todos, setTodos] = useState([]);
    const [showFinished, setShowFinished] = useState(true)
    const inputRef = useRef(null);

    useEffect(() => {
        let todoString = localStorage.getItem("todos");
        if (todoString) {
            let todos = JSON.parse(localStorage.getItem("todos"));
            setTodos(todos);
        }
    }, []);


    const saveToLS = (todosToSave) => {
        localStorage.setItem("todos", JSON.stringify(todosToSave));
    }

    const toggleFinished = () => {
        setShowFinished(!showFinished);
    }

    const handleEdit = (id) => {
        let t = todos.filter(i => i.id === id);
        setTodo(t[0].todo);
        let newTodos = todos.filter(item => {
            return item.id !== id;
        });
        setTodos(newTodos);
        saveToLS(newTodos);

        requestAnimationFrame(() => {
            if (inputRef.current) {
                const end = t[0].todo.length
                inputRef.current.focus();
                inputRef.current.setSelectionRange(end, end);
            }
        })
    }

    const handleDelete = (id) => {
        let newTodos = todos.filter(item => {
            return item.id !== id;
        });
        setTodos(newTodos);
        saveToLS(newTodos);
    }

    const handleChange = (e) => {
        setTodo(e.target.value);
    }

    const handleAdd = () => {
        const newTodos = [...todos, { id: uuidv4(), todo, isCompleted: false }];
        setTodos(newTodos);
        setTodo("");
        saveToLS(newTodos);
    }

    const handleCheckbox = (e) => {
        let id = e.target.name;
        let index = todos.findIndex(item => {
            return item.id === id;
        })
        let newTodos = [...todos];
        newTodos[index].isCompleted = !newTodos[index].isCompleted;
        setTodos(newTodos);
        saveToLS(newTodos);
    }

    const handleEnter = (e) => {
        if (e.key === 'Enter' && todo.trim()) {
            handleAdd();
        }
    }

    return (
        <>
            <Navbar />
            <div className="md:container md:mx-auto m-8 rounded-xl p-5 bg-violet-100 min-h-[80vh] xl:w-1/2 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
                <div className="addTodo my-5 flex flex-col gap-4">
                    <h2 className='text-lg font-bold'>Add a Todo</h2>
                    <input onChange={handleChange} ref={inputRef} value={todo} type="text" onKeyDown={handleEnter} className='bg-white w-full rounded-md px-2 py-1 focus:border-violet-700 outline-none border-violet-400 border-2' />
                    <button onClick={handleAdd} disabled={todo.length === 0} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 font-bold text-white rounded-md cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed w-1/3 mx-auto'>Save</button>
                </div>

                <div className='flex gap-5 my-3'>
                    <input className='cursor-pointer' onChange={toggleFinished} type="checkbox" checked={showFinished} id='toggle-finished' />
                    <label htmlFor="toggle-finished">
                        <div className='cursor-pointer'>Show Finished</div>
                    </label>
                </div>
                <h2 className='text-lg font-bold'>Your Todos</h2>
                <div className="todos">
                    {todos.length === 0 && <div className='m-5'>No Todos to display!</div>}
                    {todos.map(item => {

                        return (showFinished || !item.isCompleted) && <div key={item.id} className="todo flex justify-between items-center w-full my-3">
                            <div className='flex gap-5 items-center'>
                                <input id={`${item.id}`} name={item.id} onChange={handleCheckbox} type="checkbox" checked={item.isCompleted} className='cursor-pointer' />
                                <label htmlFor={`${item.id}`}>
                                    <div className={item.isCompleted ? "line-through cursor-pointer" : "cursor-pointer"}>{item.todo}</div>
                                </label>
                            </div>

                            <div className="buttons flex h-full">
                                <button onClick={() => handleEdit(item.id)} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 font-bold text-white rounded-md mx-1 cursor-pointer'><MdModeEdit /></button>
                                <button onClick={() => handleDelete(item.id)} className='bg-violet-800 hover:bg-violet-950 p-2 py-1 font-bold text-white rounded-md mx-1 cursor-pointer'><MdDeleteForever /></button>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </>
    )
}

export default App
