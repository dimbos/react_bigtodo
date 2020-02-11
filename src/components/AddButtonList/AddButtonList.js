import React, {useState, useEffect} from 'react';
import List from '../List/List';
import addSvg from '../../assets/img/add.svg';
import closeSvg from '../../assets/img/close.svg';

import Badge from '../Badge/Badge';
import axios from 'axios';

import './AddButtonList.scss';

const AddListButton = ({colors, onAdd}) => {

  const [visiblePopup, setVisiblePopup] = useState(false);
  const [selectedColor, selectColor] = useState(3);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if(Array.isArray(colors)){
      selectColor(colors[0].id);
    }
  }, [colors]);

  const onClose = () => {
    setVisiblePopup(false);
    setInputValue('');
    selectColor(colors[0].id);
  }

  const addList = () => {
    if(!inputValue){
      alert('Введите заголовок');
      return;
    }
    setIsLoading(true);
    axios.post('http://localhost:3001/lists',{
      name: inputValue, colorId: selectedColor
    }).then(({data}) => {
      const color = colors.filter((c) => c.id === selectedColor)[0];
      const listObj = {...data, color: {name: color.name, hex: color.hex}, tasks: []};
      onAdd(listObj);
      onClose();
    }).catch(() => {alert('Ошибка при добавлении списка')})
    .finally(() => { 
      setIsLoading(false);
    });
    
    
  }

    return (
      <div className="add-list">
        <List label={'Все задачи'} 
          onClick={()=> setVisiblePopup(true)}
          items={[
            {
            icon: <i><img src={addSvg} className="list__add-button" alt="list icon"/></i>,
            name: 'Добавить список'
            }
          ]}
        />
        {visiblePopup && 
        <div className="add-list__popup">
          <img onClick={onClose} src={closeSvg} alt="кнопка закрытия" className="add-list__popup-close-btn" />
          <input value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)}
            className="field" 
            type="text" 
            placeholder="Название списка"
          />
          <div className="add-list__popup-colors">
            {
              colors.map((color) => <Badge onClick={()=> selectColor(color.id)} className={selectedColor===color.id && 'active'} key={color.id} color={color.name}/>)
            }

          </div>
          <button onClick={addList} className="button">{isLoading ? 'Добавление...' : 'Добавить'}</button>
        </div>
        }
      </div>
    );
};

export default AddListButton;