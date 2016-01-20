import InputWrapper from './InputWrapper';

export default function InputSelect({name,options,value,placeholder,onChange,props,key,disabled}){
	const opts = (options && options.map((text,index)=>
		<option value={index} key={index}>{text}</option>
	)) || <option>---</option>;
	const input = (<select value={value} onChange={onChange} disabled={disabled} {...props.select}>
		<option value={-1} disabled>{placeholder}</option>
		{opts}
	</select>)
	return (<InputWrapper name={name} props={props} input={input}/>);
}