import InputWrapper from './InputWrapper';



export default function InputTextArea(name,props,key){
    const input = (<textarea {...props.input}/>)
    return <InputWrapper name={name} props={props} key={key} input={input}/>
}