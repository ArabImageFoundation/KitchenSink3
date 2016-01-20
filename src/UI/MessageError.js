import IconError from './IconError'

export default function Err({text,children}){
	return <div className='error'><IconError/>{text}{children}</div>
}