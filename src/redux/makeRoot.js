import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import DevTools from './devTools'
import getStore from './store';
import {connect} from 'react-redux';
import mapStateToProps from './mapStateToProps';


const store = getStore();

export default function addRoot(App){
    App = connect(mapStateToProps)(App);
    class Root extends Component{
        constructor(props,context){
            super(props,context)
            this.state = {
                showDebug:false
            ,    pinnedDebug:false
            }
        }
        render(){
            return (<Provider store={store}>
                <div>
                    <App />
                    <DevTools/>
                </div>
            </Provider>);
        }
    };

    return Root;
}
