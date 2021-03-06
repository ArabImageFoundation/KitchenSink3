import React,{PropTypes,Component} from 'react'
import {EMPTY,DONE,ERROR,LOADING} from './constants';
import Image from './Image';
import File from './File';


class FileImage extends Component{
	static propTypes = {
		onChange:PropTypes.func
	,	name:PropTypes.string
	,	value:PropTypes.any
	,	files:PropTypes.array
	,	multiple:PropTypes.bool
	,	FileImageTemplate:PropTypes.any
	,	imageWidth:PropTypes.number
	,	imageHeight:PropTypes.number
	,	imageClassName:PropTypes.string
	}
	static defaultProps = {
		FileImageTemplate:'div'
	,	imageWidth:50
	,	imageHeight:50
	,	imageClassName:'image-container'
	}
	constructor(props,context){
		super(props,context);
		this.handleChange = this.handleChange.bind(this);
		this.state = {files:props.files || props.multiple ? [] : null}
	}
	handleChange(files){
		const multiple = this.props.multiple;
		if(this.props.onChange){
			this.props.onChange(files);
		}else{
			this.setState({files:files});
		}
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.files){this.setState({files:nextProps.files});}
	}
	renderImages(files){
		const that = this;
		if(files.length){		
			return (<div>
				{Array.prototype.slice.call(files).map(that.renderImage.bind(this))}
			</div>)
		}
	}
	renderImage(file,key){
		const {imageHeight,imageWidth,imageClassName} = this.props;
		key = key || 0;
		return (file ?
			(<div key={key} className={imageClassName}><Image file={file} width={imageWidth} height={imageHeight}/><span>{file.name}</span></div>) :
			(<div key={key} className={imageClassName}><Image status={EMPTY} width={imageWidth} height={imageHeight}/><span>no image</span></div>)
		)
	}
	renderMultiple(Comp,input,images){
		return (<Comp>
			{input}
			{images}
		</Comp>)
	}
	renderUnique(Comp,input,image){
		return (<Comp>
			{image}
			{input}
		</Comp>)
	}
	renderInput(name,multiple,files){
		return <File name={name} label={this.props.label} multiple={multiple} files={files} onChange={this.handleChange}/>
	}
	render(){
		const {files} = this.state;
		const {name,multiple} = this.props;
		const Comp = this.props.FileImageTemplate;
		const input = this.renderInput(name,multiple,files);
		const images = multiple ? this.renderImages(files) : this.renderImage(files);
		return multiple ? this.renderMultiple(Comp,input,images) : this.renderUnique(Comp,input,images);
	}
}

export default FileImage;