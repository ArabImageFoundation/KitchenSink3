import React from 'react';
import {assign} from '../utils/';
import {IconClose} from './UI';
import * as Models from './models';

class Column extends React.Component{
    static shift = 70
    constructor(props,context){
        super(props,context);
    }
    makeBreadCrumbs(path){
        return (<div className='breadCrumbs'>
            {path.map(key=>{
                if(typeof key=='number'){return;}
                if(key==='relations'){return}
                return <span className='breadCrumb' key={key}>{key}</span>
            })}
        </div>)
    }
    renderInside(Model){
        const {props} = this.props;
        
        return <Model {...props}/>
    }
    getModel(){
        const {props} = this.props;
        const type = props.type;

        var Model = Models[type];

        if(props.mode){
            Model = Model.Manager;
        }
        return Model;
    }
    renderTitle(Model){
        const {props} = this.props;
        const parentPath = props.parentPath;
        const name = parentPath ? parentPath : [Model.type];
        return this.makeBreadCrumbs(name);
    }
    render(){
        const {onClick,position} = this.props;
        const shift = this.constructor.shift;
        const right = shift * position;
        const className = 'Column';
        const style = assign(this.props.style,{right})
        const props = {style,className};
        const Model = this.getModel();

        return (<div {...props}>
            <div className='header'>
                <button onClick={onClick} className='close'><IconClose/></button>
                {this.renderTitle(Model)}
            </div>
            <div className='contents'>
                {this.renderInside(Model)}
            </div>
        </div>)
    }
}

export default Column;
