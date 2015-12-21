import React from 'react';
import {assign} from '../utils/';
import * as Models from './models';

class Column extends React.Component{
    static shift = 30
    constructor(props,context){
        super(props,context);
    }
    render(){
        const {type,name,view,index,onClick,position} = this.props;
        const shift = this.constructor.shift;
        const right = shift * position;
        const className = 'Column';
        const style = assign(this.props.style,{right})
        const props = {style,className};
        const Component = Models[type];
        if(!Component){
            return (<div {...props}>ERROR</div>)
        }
        const options = {
            view
        ,   index
        }
        return (<div {...props}>
            <button onClick={onClick}>x</button>
            <h2>{name}</h2>
            <Component options={options}/>
        </div>)
    }
}

export default Column;
