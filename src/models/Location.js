import React,{Component} from 'react'
import makeModel from './makeModel';
import InputLocation from '../templates/InputLocation';

export default makeModel(
    'Location'
,   [
        'city'
    ,   'country'
    ,   'street'
    ,	'lat'
    ,	'lng'
    ,	'zoom'
    ]
,	function renderInputLocation(){
		const props = {
			city:this.getValueFor('city')
		,	country:this.getValueFor('country')
		,	street:this.getValueFor('street')
		,	lat:this.getValueFor('lat')
		,	lng:this.getValueFor('lng')
		,	zoom:this.getValueFor('zoom')
		,	onChange:this.onLocationChange()
		}
		return <InputLocation {...props}/>
	}
,	function onLocationChange(){
        const that = this;
        const actions = this.props.actions;
        const path = this.getPath();
        return function(props){
            actions.onChangeMultiple(path,props);
            //that.setOnChangeTimeoutFor(name,path);
        }
	}
,	function renderForm(){
	    const className = this.getClassName('Form');
        return (<div className={className}>
     		{this.renderInputLocation()}       
            <button onClick={this.props.actions.removeColumn}>ok</button>
        </div>)	
	}
,	function getSummary(){
        const city = this.getValueFor('city');
        const country = this.getValueFor('country');
        const street = this.getValueFor('street');
        const summary = [street,city,country].filter(Boolean).join(', ') || 'undefined location';
        return summary;
    }
)