import IconInfo from './IconInfo'

export default function Help({text,children}){
	return <div className='help'><IconInfo/>{text}{children}</div>
}