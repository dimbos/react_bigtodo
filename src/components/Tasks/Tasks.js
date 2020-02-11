import React from 'react';
import editSvg from '../../assets/img/edit.svg';

import AddTaskForm from './AddTaskForm';
import Task from '../Task/Task';

import axios from 'axios';
import {Link} from 'react-router-dom';

import './Tasks.scss';

const Tasks = ({list, onEditTitle, onAddTask, withoutEmpty, onEditTask, onRemoveTask, onCompleteTask}) => {

    const editTitle = () => {
        const newTitle = window.prompt('Введите название', list.name);
        if (newTitle){
            onEditTitle(list.id, newTitle);
            axios.patch('http://localhost:3001/lists/' + list.id, {
                name: newTitle
            }).catch(() => alert('Не удалось обновить название списка'));
        }
    };

    return (
        <div className="tasks">
            <Link to={`/lists/${list.id}`}>
                <h2 style={{color: list.color.hex}}className="tasks__title">{list.name}
                <img onClick={editTitle} src={editSvg} alt="редактирование"/>
                </h2>
            </Link>
            <div className="tasks__items">
                {!withoutEmpty && list.tasks && !list.tasks.length && (<h2 className="tasks__items-h2">Задачи отсутствуют</h2>)}
                {list.tasks &&
                    list.tasks.map((task) => (
                        <Task onRemove={onRemoveTask} onEdit={onEditTask} list={list} key={task.id} onComplete={onCompleteTask} {...task}/>
                    ))
                }
                <AddTaskForm key={list.id} list={list} onAddTask={onAddTask}/>
            </div>
        </div>
    );
};


export default Tasks;