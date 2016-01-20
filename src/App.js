import React,{Component} from 'react';
import styles from './style.styl';
import ColumnManager from './ColumnManager';
import makeRoot from './redux/makeRoot'
import * as Models from './models';
import actions from './redux/actionsReducer';
import IconHome from './UI/IconHome';
import IconDB from './UI/IconDB';
import IconPhoto from './UI/IconPhoto';
import Navigation from './UI/Navigation';
import routes from './menu';
//import ModelsManager from './ModelsManager';

const Managers = Object.keys(Models).map(name=>{
    const Model = Models[name];
    const Manager = Model.Manager;
    return (<div className='manager' key={name}>
        <h2>{name}</h2>
        <Manager childrenView='Form'/>
    </div>)
})

class App extends Component{
    constructor(props,context){
        super(props,context)
        this.onClick = this.onClick.bind(this);
    }
    onClick(route){
        const {dispatch} = this.props;
        return function(evt){
            evt.preventDefault();
            dispatch(actions.route({route}));
        }
    }
    render(){
        const {route} = this.props;
        var page,title;
        if(route[0] == 'db'){
            page = Managers;
            title = 'Database'
        }
        else if(route[0] == 'photos'){
            page = <Models.Photo.Manager childrenView='Form' mode='List'/>
            title = 'Photos';
        }
        else if(route[0] == 'photographers'){
            page = <Models.Photographer.Manager childrenView='Form' mode='List'/>
            title = 'Photographers';   
        }
        else{
            page = <Models.Collection.Manager childrenView='Form'/>
            title = 'Collections';
            if(route[1] == 'byReference'){
                title+= ' (by reference number)';
            }
            else{
                title+= ' (by creation date)';
            }
        }
        return(<div>
            <div className='menu'>
                <div className='header menu-item'>
                    <img src='logo.jpg'/>
                    <span>AIF Database</span>
                </div>
                <span className='help menu-item'>(press `ctrl-h` to hide the debugger, `ctrl-q` to move it around the screen)</span>
                <Navigation routes={routes} onClick={this.onClick} active={route}/>
            </div>
            <div className='body'>
                <h1>{title}</h1>
                {page}
            </div>
        	<ColumnManager/>
        </div>)
    }
}

//{Managers.map((Manager,index)=><Manager key={index}/>)}
//
export default makeRoot(App);
