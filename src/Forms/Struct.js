import React, {Component} from 'react';

class Struct extends Component{

	renderItems(items,value){

		return items.map((item,key)=>{
			const {name} = item;
			return (<div key={key}>
				{item.render(value[name])}
			</div>)
		})

	}

	render(){
		const {value,options,meta,templates} = this.props;
		const items = this.renderItems(meta.items,value);
		return (<div>
			{items}
		</div>)
	}
}

export default Struct