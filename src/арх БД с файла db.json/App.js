import React, {useState} from 'react';
import logo from './logo.svg';
import listSvg from '../src/assets/img/list.svg';

import DB from './assets/db.json';

import List from './components/List/List';
import AddListButton from './components/AddButtonList/AddButtonList';
import Tasks from './components/Tasks/Tasks';



import './App.css';

function App() {
  const [lists, setLists] = useState(
    DB.lists.map((item) => {
      item.color = DB.colors.filter((color) => color.id === item.colorId)[0].name;
      return item;
    })
  );

  const onAddList = (obj) => {
    const newList = [
      ...lists,
      obj
    ];
    setLists(newList);
  };

  return (
    <div className="todo">
      <div className="todo__sidebar">
        <List label={'Все задачи'} items={[
          {
          icon: <i><img src={listSvg} alt="list icon"/></i>,
          name: 'Все задачи',
          active: true,
          }
        ]}/>
        <List label={'Все задачи'} 
        items={lists}
        //для теста
        // items={[
        //   {
        //   icon: null,
        //   color: 'green',
        //   name: 'Покупки'
        //   },
        //   {
        //     icon: null,
        //     color: 'blue',
        //     name: 'Фронтенд'
        //   },
        //   {
        //     icon: null,
        //     color: 'pink',
        //     name: 'Фильмы, сериалы...'
        //     }
        // ]}
        onRemove={(lists) => {
          console.log(lists);
        }}
        isRemovable
        />
        <AddListButton onAdd={onAddList} colors={DB.colors}/>
      </div>
      <div className="todo__tasks">
          <Tasks />
      </div>
    </div>
  );
}

export default App;
