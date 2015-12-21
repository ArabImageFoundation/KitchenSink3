import Model,{t} from './Model';
import actions from '../redux/actionsReducer';

export default Model('Studio',{
    schema:{
        name:t.String
    ,   address:t.maybe(t.String)
    ,   telephone:t.maybe(t.String)
    ,   biography:t.maybe(t.String)
    ,   source:t.maybe(t.String)
    }
,   options:{}
,   methods:{
        search(str){
            return [
                {name:'dfsdfd'}
            ]
        }
    }
})
