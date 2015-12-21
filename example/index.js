import style from "./style.styl";
import React from 'react';
import ReactDOM from 'react-dom';
var Root = require('../src/App.js').default;

function render(){
        ReactDOM.render(<Root/>, document.getElementById('Content'));

}


if(module.hot) {
    module.hot.accept('../src/App.js', function() {
                Root = require('../src/App.js').default
                        render();

    });

}

render();
