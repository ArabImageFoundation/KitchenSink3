import React,{Component} from 'react';
import InputAddress from './InputAddress';
import InputMap from './InputMap';
import InputWrapper from './InputWrapper';

const _props = ['country','city','street','lat','lng','zoom'];
const _propsLength = _props.length;

class InputLocation extends Component{
	constructor(props,context){
		super(props,context)
		this.state = this.updateStateFromProps(props) || {};
		this.state.addressLine = '';
		this.onAddressChange = this.onAddressChange.bind(this);
		this.onMapChange = this.onMapChange.bind(this);
		this.onChange = this.onChange.bind(this);
	}
	updateStateFromProps(props){
		const state = {};
		var hasProps = false;
		var i = 0;
		while(i<_propsLength){
			const propertyName = _props[i++];
			if(propertyName in props){
				state[propertyName] = props[propertyName];
				hasProps = true;
			}
		}
		if(hasProps){return state;}
		return false;
	}
	onChange(){
		if(this.props.onChange){
			const {country,city,street,lat,lng,zoom} = this.state;
			this.props.onChange({country,city,street,lat,lng,zoom});
		}
	}
	componentWillReceiveProps(props){
		const state = this.updateStateFromProps(props);
		if(state){this.setState(state);}
	}
	onAddressChange({country,city,street}){
		const addressLine = [country,city,street].filter(Boolean).join(',');
		this.setState({country,city,street,addressLine},this.onChange);
	}
	onMapChange({lat,lng,zoom}){
		this.setState({lat,lng,zoom},this.onChange);
	}
	render(){
		const {country,city,street,lat,lng,zoom,addressLine} = this.state;
		const input = (<div>
			<InputAddress country={country} city={city} street={street} onChange={this.onAddressChange}/>
			<InputMap address={addressLine} showInput={false} onChange={this.onMapChange}/>
		</div>)
		return <InputWrapper name='location' props={{title:'Location'}} input={input}/>
	}
}

export default InputLocation;