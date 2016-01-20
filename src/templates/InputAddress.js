import React,{Component} from 'react';
import cities from './countries.json';
import InputWrapper from './InputWrapper';
import InputSelect from './InputSelect';
import InputText from './InputText';

const countries = Object.keys(cities).sort();
countries.forEach(name=>cities[name] = cities[name].sort());

class InputAddress extends Component{
	constructor(props,context){
		super(props,context);
		this.state = this.updateStateFromProps(props) || {
			country:-1
		,	city:-1
		,	street:''
		};
		this.state.focused = false;
		this.onFocus = this.onFocus.bind(this)
		this.onBlur = this.onBlur.bind(this);
		this.onCountryChange = this.onCountryChange.bind(this);
		this.onCityChange = this.onCityChange.bind(this);
		this.onStreetChange = this.onStreetChange.bind(this);
		this.onFocusChange = this.onFocusChange.bind(this);
		this.onChange = this.onChange.bind(this);
	}
	updateStateFromProps(props){
		if(!props){
			return false
		}
		const state = {}
		var hasProps = false;
		if(props.country != null){
			state.country = countries.indexOf(props.country);
			hasProps = true;
		}
		if(state.country >=0 && props.city!=null){
			state.city = cities[props.country].indexOf(props.city)
			hasProps = true;
		}
		if(props.street != null){
			state.street = props.street;
			hasProps = true;
		}
		if(!hasProps){return false;}
		return state;
	}
	componentWillReceiveProps(props){
		const state = this.updateStateFromProps(props);
		if(state){this.setState(state);}
	}
	onFocus(){
		this.setState({focused:true},this.onFocusChange);
	}
	onBlur(){
		this.setState({focused:false},this.onFocusChange);
	}
	onFocusChange(){
		clearTimeout(this.focusChangeTimeout);
		this.focusChangeTimeout = setTimeout(()=>{
			if(this.state.focus && this.props.onFocus){
				this.props.onFocus();
			}
			if(!this.state.focus && this.props.onBlur){
				this.props.onBlur();
			}
		},200);
	}
	onChange(){
		if(this.props.onChange){
			const {country,city,street} = this.state;
			this.props.onChange({
				country:countries[country]
			,	city:cities[countries[country]][city]
			,	street:street
			})
		}
	}
	onStreetChange(evt){
		this.setState({street:evt.target.value},this.onChange)
	}
	onCountryChange(evt){
		const country = evt.target.value;
		this.setState({country},this.onChange);
	}
	onCityChange(evt){
		const city = evt.target.value;
		this.setState({city},this.onChange);
	}
	render(){
		const {country,city,street,focused} = this.state;
		return (<div tabIndex={0} onBlur={this.onBlur} onFocus={this.onFocus}>
			<InputSelect
				name='country'
				value={country}
				props={{title:'Country',isValid:(country>=0),focused}}
				options={countries}
				placeholder='Choose a country'
				onChange={this.onCountryChange}
				/>
			<InputSelect
				name='city'
				value={city}
				props={{title:'City',isValid:(city>=0),focused}}
				options={cities[countries[country]]}
				placeholder='Choose a city'
				onChange={this.onCityChange}
				disabled={country<0}
				/>
			<InputText name='street' props={{title:'Street',isValid:(!!street),focused}} value={street} onChange={this.onStreetChange}/>
		</div>)
	}
}

export default InputAddress;