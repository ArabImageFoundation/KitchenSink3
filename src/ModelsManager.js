import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import cx from 'classnames';
import actions from './redux/actionsReducer';


export default function MakeModelsManager(name,Model){

    class ModelsManager extends Component{

        static displayName = name+'Manager'

        constructor(props,context){
            super(props,context);
            this.store = props.store;
        }

        render(){
            const collection = this.props.collection;
            const items = collection.map(function(item,index){
                const options = {
                    index
                ,   view:'summary'
                }
                return (<li key={index}>
                    <Model options={options}/>
                </li>);
            })
            return (<div>
                <h1>{name}</h1>
                <button onClick={this.props.actions.addNew}>add</button>
                    <ul>
                        {items}
                    </ul>
                </div>)
        }
    }

    function mapStateToProps(props){
        return {collection:props.get(name)}
    }

    function mapDispatchToProps(dispatch){
        return {actions:{
            addNew:()=>dispatch(actions.addColumn({type:name,view:'edit'}))
        }};
    }


    return connect(mapStateToProps,mapDispatchToProps)(ModelsManager);

}
