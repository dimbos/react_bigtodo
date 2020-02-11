import React, {useState, useEffect} from 'react';

import listSvg from '../src/assets/img/list.svg';
import axios from 'axios';
import {Route, useHistory} from 'react-router-dom';

//import DB from './assets/db.json';

import List from './components/List/List';
import AddListButton from './components/AddButtonList/AddButtonList';
import Tasks from './components/Tasks/Tasks';



import './App.css';

function App() {
  const [lists, setLists] = useState(null);
    // DB.lists.map((item) => {
    //   item.color = DB.colors.filter((color) => color.id === item.colorId)[0].name;
    //   return item;
    // })

  const [colors, setColors] = useState(null);
  const [activeItem, setActiveItem] = useState(null);

  let history = useHistory();

  useEffect(() => {
    axios.get('http://localhost:3001/lists?_expand=color&_embed=tasks').then(({data}) => {
      setLists(data);
    });
    axios.get('http://localhost:3001/colors').then(({data}) => {
      setColors(data);
    });
  }, []);

  const onAddList = (obj) => {
    const newList = [
      ...lists,
      obj
    ];
    setLists(newList);
  };

  const onAddTask = (listId, taskObj) => {
    const newList = lists.map((item) => {
      if(item.id === listId){
        item.tasks = [ ...item.tasks, taskObj]
      }
      return item;
    })
    setLists(newList);
  };

  const onCompleteTask = (listId, taskId, completed) => {
    const newList = lists.map((list) => {
      if(list.id === listId){
        list.tasks = list.tasks.map((task) => {
          if(task.id === taskId){
            task.completed = completed;
          }
          return task;
        });
      }
      return list;
    });
    setLists(newList);
    axios.patch('http://localhost:3001/tasks/' + taskId, {completed}).catch(() => alert('Не удалось обновить задачу'));
  }

  const onEditListTitle = (id, title) => {
    const newList = lists.map((item) => {
      if(item.id === id){
        item.name = title;
      }
      return item;
    })
    setLists(newList);
  };

  const onRemoveTask = (listId, taskId) => {
    if(window.confirm('Вы действительно хотите удалить задачу?')){
      const newList = lists.map((item) => {
        if(item.id === listId){
          item.tasks = item.tasks.filter((task) => task.id !== taskId);
        }
        return item;
      })
      setLists(newList);
        axios.delete('http://localhost:3001/tasks/' + taskId)
        .catch(() => alert('Не удалось удалить задачу'));
    }
  };

  const onEditTask = (listId, taskObj) => {
    const newTaskText = window.prompt('Задача', taskObj.text);

    if(!newTaskText){
      return;
    }
      const newList = lists.map((list) => {
        if(list.id === listId){
          list.tasks = list.tasks.map((task) => {
            if(task.id === taskObj.id){
              task.text = newTaskText;
            }
            return task;
          });
        }
        return list;
      })
      setLists(newList);
        axios.patch('http://localhost:3001/tasks/' + taskObj.id, {text: newTaskText})
        .catch(() => alert('Не удалось изменить задачу'));
    
  };

  useEffect(() => {
    const listId = history.location.pathname.split('lists/')[1];
    if(lists){
      const list = lists.find((list) => list.id === Number(listId));
      setActiveItem(list);
    }
  }, [lists, history.location.pathname])

  return (
    <div className="todo">
      <div className="todo__sidebar">
        <List
        onClickItem={(list) => {history.push(`/`)}}
        items={[{
          active: history.location.pathname === '/',
          icon: ( <img src={listSvg} alt="список" />
          ),
        name: 'Все задачи'
        }]}
        />
        {lists ? (
          <List
          items={lists}
          onRemove={(id) => {
            const newLists = lists.filter((item) => item.id !== id);
            setLists(newLists);
            }}
            // onClickItem={(item) => {setActiveItem(item)}}
            onClickItem={(list) => {history.push(`/lists/${list.id}`)}}
            activeItem={activeItem}
            isRemovable
          />
        ):('Загрузка...')
        }
        
        <AddListButton onAdd={onAddList} colors={colors}/>
      </div>
      <div className="todo__tasks">
        <Route exact path="/">
          {lists &&
            lists.map((list) => (
              <Tasks
              key={list.id}
              list={list}
              onAddTask={onAddTask}
              onEditTitle={onEditListTitle}
              onEditTask={onEditTask}
              onRemoveTask={onRemoveTask}
              onCompleteTask={onCompleteTask}
              withoutEmpty
              />
            ))
          }
        </Route>
        <Route path="/lists/:id">
          {lists && activeItem && <Tasks list={activeItem} onCompleteTask={onCompleteTask} onAddTask={onAddTask} onEditTask={onEditTask} onEditTitle={onEditListTitle} onRemoveTask={onRemoveTask} />}
        </Route>
      </div>
    </div>
  );
}

export default App;
