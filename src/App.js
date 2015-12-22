import React,{Component} from 'react';
import styles from './style.styl';
import ColumnManager from './ColumnManager';
import makeRoot from './redux/makeRoot'
import * as Models from './models';
import actions from './redux/actionsReducer';
//import ModelsManager from './ModelsManager';


const Managers = Object.keys(Models).map(name=>{
    const Model = Models[name];
    const Manager = Model.Manager;
    return (<div className='manager' key={name}>
        <h1>{name}</h1>
        <Manager childrenView='Form'/>
    </div>)
})

class App extends Component{
   render(){
        return(<div>
            press `ctrl-h` to hide the debugger, `ctrl-q` to move it around the screen
            {Managers}
        	<ColumnManager/>
        </div>)
    }
}

//{Managers.map((Manager,index)=><Manager key={index}/>)}
//
export default makeRoot(App);
