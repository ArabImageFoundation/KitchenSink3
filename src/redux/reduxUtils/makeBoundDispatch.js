export default function makeDispatch(dispatch,type){
	return function disp(suffix,props){
		return dispatch(Object.assign({type:`${type}_${suffix}`},props));
	}
}