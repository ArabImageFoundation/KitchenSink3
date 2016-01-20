import InputWrapper from './InputWrapper';



export default function InputText({name,props,onChange}){
    const input = (<input {...props.input} onChange={onChange}/>)
    return <InputWrapper name={name} props={props} input={input}/>
}