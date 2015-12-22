
export default function Icon({type}){
	const className = 'material-icons material-icons-'+type;
	return <i className={className}>{type}</i>
}