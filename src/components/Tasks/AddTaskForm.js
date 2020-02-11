import React, {useState} from 'react';
import axios from 'axios';

import addSvg from '../../assets/img/add.svg';



import './Tasks.scss';

const AddTaskForm = ({list, onAddTask}) => {

    const [visibleForm, setFormVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const toggleFormVisible = () => {
        setFormVisible(!visibleForm);
        setInputValue('');
    }

    const addTask = () => {
        const obj = { 
            listId: list.id,
            text: inputValue,
            completed: false
        };
        setIsLoading(true);
        axios.post('http://localhost:3001/tasks', obj).then(({data}) => {
            onAddTask(list.id, data);
            toggleFormVisible();
        }).catch((e) => {alert('Ошибка. Задача не добавлена')})
        .finally(() => {
            setIsLoading(false);
        });
    };

    return (
        <div className="tasks__form">
            {!visibleForm ?             
                (<div className="tasks__form-new" onClick={toggleFormVisible}>
                    <img src={addSvg} alt="добавить" />
                    <span>Новая задача</span>
                </div>
                )
                :             
                (<div className="tasks__form-block">
                    <input
                        value={inputValue}
                        className="field" 
                        type="text" 
                        placeholder="Задача"
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <button disabled={isLoading} className="button" onClick={addTask}>{isLoading ? 'Добавление' : 'Добавить задачу'} </button>
                    <button className="button button--grey" onClick={toggleFormVisible}>Отмена</button>
                </div>)
            }


    </div>
    )
}

export default AddTaskForm