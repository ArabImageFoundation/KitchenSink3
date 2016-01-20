import {addProperty} from '../../utils';
import makeActionsReducers from './reduxUtils';
import actionsReducers from '../actions';

const [actions,reducer] = makeActionsReducers(actionsReducers);

addProperty(actions, 'reducer', reducer);

export default actions;
