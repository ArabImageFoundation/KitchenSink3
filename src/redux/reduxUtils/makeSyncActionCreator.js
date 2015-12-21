import {assign} from '../../../utils';

export default function makeSyncActionCreator(type,metaDefault={}){
	return function syncActionCreator(_meta){
		return {
			type
		,	meta:assign(metaDefault,_meta)
		}
	}
}