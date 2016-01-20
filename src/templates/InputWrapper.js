import cx from 'classnames';
import {IconCheck,IconError,MessageHelp,MessageError} from '../UI'

export default function InputWrapper({name,input,props,key}){

    const className = cx(
        'input-control'
    ,   `input-${name}`
    ,   {
            focused:props.focused
    ,       hasErrors:props.errors && props.errors.length
        }
    )

    return (
        <div key={key} className={className}>
            {props.title && (<label {...props.label}>{props.title}</label>)}
            <div className='input-field'>
                {input}
                {props.isValid && <IconCheck/>}
            </div>
            <div className='input-info'>
                {props.errors && props.errors.map((err,index)=><MessageError key={index} text={err.replace('$key$',props.title)}/>)}
                {props.help && <MessageHelp text={props.help}/>}
            </div>
        </div>
    )
}