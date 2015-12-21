import React,{Component} from 'react';
import styles from './style.styl';
import ColumnManager from './ColumnManager';
import makeRoot from './redux/makeRoot'
import * as Models from './models';
import actions from './redux/actionsReducer';
import ModelsManager from './ModelsManager';

const Managers = [];
Object.keys(Models).forEach(model=>{
    Managers.push(ModelsManager(model,Models[model]));
})

class App extends Component{
   render(){
        return(<div>
            {Managers.map((Manager,index)=><Manager key={index}/>)}
            <ColumnManager/>
        </div>)
    }
}

export default makeRoot(App);
