import React,{PropTypes,Component} from 'react'
import {EMPTY,DONE,ERROR,LOADING} from './constants';

const buttonStyle={
	position:'relative'
}

const slice = Array.prototype.slice;

const inputStyle = {
	cursor: 'pointer'
,	position:'absolute'
,	top:0
,	bottom:0
,	right:0
,	left:0
,	width:'100%'
,	opacity:0
}

class File extends Component{
	static propTypes = {
		onChange:PropTypes.func
	,	name:PropTypes.string
	,	files:PropTypes.oneOfType([PropTypes.array,PropTypes.object]) 
	,	uploadFieldTemplate:PropTypes.any
	,	filesTemplate:PropTypes.func
	,	label:PropTypes.string
	,	accept:PropTypes.string
	}
	static defaultProps = {
		uploadFieldTemplate:'button'
	,	label:'upload'
	,	accept:'image/*'
	}
	constructor(props,context){
		super(props,context);
		this.handleChange = this.handleChange.bind(this);
		this.state = {files:props.files || props.multiple ? [] : null}
	}
	handleChange(evt){
		const files = evt.target.files;
		const multiple = this.props.multiple;
		if(this.props.onChange){
			this.props.onChange(multiple ? slice.call(files) : files[0],evt.target.value);
		}else{
			this.setState({files:multiple?slice.call(files):files[0]});
		}
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.files){this.setState({files:nextProps.files});}
	}
	renderInput(Comp,name,multiple,label,accept){
		return (<Comp style={buttonStyle}>
			{label}
			<input type='file' name={name} accept={accept} onChange={this.handleChange} multiple={multiple} style={inputStyle}/>
		</Comp>	)
	}
	render(){
		const {files} = this.state;
		const {name,multiple,label,accept} = this.props;
		const Comp = this.props.uploadFieldTemplate;
		return this.renderInput(Comp,name,multiple,label,accept);
	}
}

export default File;