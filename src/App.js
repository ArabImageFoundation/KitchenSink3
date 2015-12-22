import React,{Component} from 'react';
import styles from './style.styl';
import ColumnManager from './ColumnManager';
import makeRoot from './redux/makeRoot'
import * as Models from './models';
import actions from './redux/actionsReducer';
//import ModelsManager from './ModelsManager';

/**
const Managers = [];
Object.keys(Models).forEach(model=>{
    Managers.push(ModelsManager(model,Models[model]));
})
**/
class App extends Component{
   render(){
        return(<div>
            press `ctrl-h` to hide the debugger, `ctrl-q` to move it around the screen
        	<h1>Studio</h1>
        	<Models.Studio.Manager childrenView='Form'/>
        	<h1>Photographer</h1>
        	<Models.Photographer.Manager childrenView='Form'/>
        	<ColumnManager/>
        </div>)
    }
}

//{Managers.map((Manager,index)=><Manager key={index}/>)}
//
export default makeRoot(App);
