import React,{Component,PropTypes} from 'react';
import cx from 'classnames'

class ModelManager extends Component{
    static propTypes = {
        view:PropTypes.oneOf(['Summary','Form'])
    ,   childrenView:PropTypes.oneOf(['Summary','Form'])
    ,   mode:PropTypes.oneOf(['List','Load'])
    ,   allowCreate:PropTypes.bool
    ,   allowMultiple:PropTypes.bool
    }
    static defaultProps = {
        view:'Summary'
    ,   mode:'List'
    ,   allowCreate:true
    ,   allowMultiple:false
    ,   allowLoad:false
    }
    constructor(props,context){
        super(props,context)
        this.state = {
            searchString:''
        }
        this.create = this.create.bind(this);
        this.viewSelection = this.viewSelection.bind(this);
        this.onChangeSearchString = this.onChangeSearchString.bind(this);
    }
    onChangeSearchString(evt){
        const value = evt.target.value;
        this.setState({
            searchString:value
        ,   searchRegex:value && new RegExp(value)
        })
    }
    getClassName(mode){
        const typeName = this.getTypeName();
        const {allowCreate,allowMultiple} = this.props
        return cx(
            'ModelManager'
        ,   `ModelManager${typeName}`
        ,   `mode-${mode}`
        )
    }
    getComponent(){
        return this.constructor.model;
    }
    getTypeName(){
        return this.constructor.type;
    }
    getView(){
        return this.props.view;
    }
    getMode(){
        return this.props.mode;
    }
    create(evt){
        evt && evt.preventDefault();
        const parentPath = this.props.parentPath
        this.props.actions.create(parentPath);
    }
    viewSelection(evt){
        const {actions,parentPath} = this.props;
        const mode = 'Load';
        const view = 'Summary'
        evt && evt.preventDefault();
        actions.view(null,parentPath,view,mode)
    }
    view(index){
        const {actions,parentPath,childrenView} = this.props;
        return function(evt){
            evt && evt.preventDefault();
            actions.view(index,parentPath,childrenView)
        }
    }
    addItemToParent(index){
        const parentPath = this.props.parentPath;
        this.props.actions.add(index,parentPath)
    }
    removeItemFromParent(index){
        const parentPath = this.props.parentPath;
        this.props.actions.remove(index,parentPath)
    }
    onCheckBoxChange(index){
        const that = this;
        return function(evt){
            const checked = evt.target.checked;
            if(checked){return that.addItemToParent(index)}
            return that.removeItemFromParent(index);
        }
    }
    getItemPropsForList(index,view){
        const itemProps = {
            index
        ,   view
        }
        const wrapperProps = {
            onClick:this.view(index)
        ,   className:`${this.getTypeName()}-item ${this.getTypeName()}-item-${view} model-item-${view}`
        }
        return {
            item:itemProps
        ,   wrapper:wrapperProps
        }
    }
    renderItemForList(props,key){
        const Comp = this.getComponent();
        return (
            <a {...props.wrapper} key={key}>
                <Comp {...props.item}/>
            </a>
        )
    }
    isItemIncludedInSearch(index){
        if(!this.state.searchRegex){return false;}
        const reg = this.state.searchRegex;
        const prop = this.getItemDefiningProp(index);
        return reg.test(prop);
    }
    getItemDefiningProp(index){
        return this.props.collection.getIn([index,'value','name']);
    }
    getItemParents(index,type,parentIndex){
        const collection = this.props.collection;
        const parents = collection.get(index).get('relations');
        if(!type){
            return parents.toJS();
        }
        const specificTypeParents = parents.get(type);
        if(!specificTypeParents){
            return null;
        }
        if(parentIndex == null){
            return specificTypeParents.toJS();
        }
        return specificTypeParents.get(index);
    }
    getItemPropsForLoad(index,view){
        if(!this.isItemIncludedInSearch(index)){return;}
        var checked = false;
        if(this.props.parentPath){
            const [parentType,parentIndex] = this.props.parentPath;
            const parent = this.getItemParents(index,parentType,parentIndex);
            checked = (parent != null);
        }
        return {
            item:{
                index
            ,   view
            }
        ,   wrapper:{
                type:'checkbox'
            ,   onChange:this.onCheckBoxChange(index)
            ,   checked
            }
        }
    }
    renderItemForLoad(props,key){
        const {allowMultiple} = this.props;
        const Comp = this.getComponent();
        return (<div key={key}>
            <input {...props.wrapper}/>
            <Comp {...props.item}/>
        </div>)
    }
    renderItemsFor(mode){
        const {collection,exclude,include} = this.props;
        const view = this.getView();
        const items = [];
        const getItemPropsFunction = `getItemPropsFor${mode}`
        const renderItemFunction = `renderItemFor${mode}`;
        collection.forEach((_,index)=>{
            if(exclude && exclude.indexOf(index)>=0){return;}
            if(include && include.indexOf(index)<0){return;}
            const props = this[getItemPropsFunction](index,view)
            if(!props){return;}
            const item = this[renderItemFunction](props,index);
            if(!item){return;}
            items.push(item);
        });
        return items;
    }
    renderLoad(){
        const items = this.renderItemsFor('Load');
        const {allowCreate} = this.props;
        const className = this.getClassName('Load');
        return (<div className={className}>
            <input type='text' onChange={this.onChangeSearchString} value={this.state.searchString}/>
            {items}
        </div>)
    }
    renderList(){
        const items = this.renderItemsFor('List');
        const {allowCreate,allowLoad} = this.props;
        const className = this.getClassName('List');
        return (<div className={className}>
            {items}
            {(allowCreate || allowLoad) && (<div className='buttonGroup'>
                {allowCreate && <button onClick={this.create}>Add</button>}
                {allowLoad && <button onClick={this.viewSelection}>Load</button>}
                </div>)
            }
        </div>)
    }
    render(){
        const mode = this.getMode();
        const renderFunction = `render${mode}`;
        if(!this[renderFunction]){throw new Error(`there is no ${renderFunction} function defined on ${this.getTypeName()}`);}
        return this[renderFunction]();
    }
}

export default ModelManager;