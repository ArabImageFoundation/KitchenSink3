export Collection from './Collection'
export Studio from './Studio';
export File from './File';
export Contract from './Contract';
import Photo from './Photo';
import Photographer from './Photographer';

const _Photographer = Photographer.extend('Photographer',[Photo]);
export {
	_Photographer as Photographer
,	Photo
}