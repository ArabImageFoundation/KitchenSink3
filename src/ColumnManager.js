import React,{Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import cx from 'classnames';
import actions from './redux/actionsReducer';
import {assign,transform} from '../utils';
import Column from './Column';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

function getStyles(items){
    let configs = {};
    items.forEach((value,key)=>{
        configs[key] = {
            right: spring(0)
        ,   item: value
        };
    });
    return configs;
}

function willEnter(key,style){
    return {
        right: spring(-100)
    ,   item:style.item
    };
}

function willLeave(key, style) {
    return {
        right: spring(-100)
    ,   item:style.item
    };
}

function mapStateToProps(props){
    return {
        columns:props.get('columns')
            .map(column=>({
                type:column.get('type')
            ,   view:column.get('view')
            ,   index:column.get('index')
            ,   name:column.get('name')
            }))
            .toJS()
    }
}

function mapDispatchToProps(dispatch){
    return {actions:bindActionCreators({removeColumn:actions.removeColumn},dispatch)}
}

class ColumnManager extends Component{
    constructor(props,context){
        super(props,context);
        this.willEnter = willEnter.bind(this);
    }
    renderColumns(columns){
        if(!columns || !columns.length){return null;}
        const total = columns.length-1;
        return columns.map((column,key)=>{
            const props = Object.assign({
                position:total-key
            ,   onClick:this.props.actions.removeColumn
            ,   key:key
            },column);
            return (<Column {...props}/>)
        })
    }
    renderOverlay(items){
        if(!items || !items.length){return null;}
        return (<div className='ColumnManagerOverlay' onClick={this.props.actions.removeColumn}/>)
    }
    render(){
        const columns = this.renderColumns(this.props.columns);
        const overlay = this.renderOverlay(this.props.columns);
        const style = assign(this.props.style);
        const className = cx('ColumnManager',{'has-items':this.props.columns.length});
        const props = {style,className};
        const transitionProps = {
            transitionName:"ColumnItem"
        ,   transitionEnterTimeout:300
        ,   transitionLeaveTimeout:300
        ,   transitionAppearTimeout:300
        ,   transitionAppear:true
        ,   component:'div'
        ,   style
        ,   className
        }
        return (<ReactCSSTransitionGroup {...transitionProps}>
                {overlay}
                {columns}
        </ReactCSSTransitionGroup>)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ColumnManager);
