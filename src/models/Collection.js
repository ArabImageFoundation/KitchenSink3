import React,{Component} from 'react'
import makeModel from './makeModel';
import Validator from './Validator';
import Contract from './Contract';
import Photo from './Photo';
import {IconCheck,IconError,MessageHelp,MessageError} from '../UI'

export default makeModel(
    'Collection'
,   [
        'name'
    ,   'reference'
    ,   'donor'
    ,   'acquisition'
    ,   {
            name:'date'
        ,   label:'date'
        ,   type:'date'
        }
    ,   Contract
    ]
,	function renderSummary(){
		const {db} = this.props;
		const name = this.getValueFor('name');
		const reference = this.getValueFor('reference')
		const contracts = (this.getRelatedItemsFor('Contract') || []).map(id=>db.get('Contract').get(id))
		const photos = contracts
			.map(contract=>{
				const contract_photos = contract.get('relations').get('Photo');
				if(!contract_photos || !contract_photos.size){return;}
				return contract_photos.toJS()
			})
			.filter(Boolean)
			.reduce((a,b)=>a.concat(b),[])
			.slice(0,5)
			.map((id,i)=>{
				const photo = db.get('Photo').get(id);
				if(photo){
					return <Photo {...photo.toJS()} view='Summary' key={i}/>
				}
			})
		;
		const hasErrors = this.props.hasErrors;
        const className = this.getClassName('Summary');
		return (<div className={className}>
			<div className='main'>
				<div className='header'>
					<span className='title'>{name || '(no name)'}</span>
					<span className='ref'>{reference || '#'}</span>
				</div>
				<div className='contracts'>Contracts: {contracts.length || 'none'}</div>
			</div>
			<div className='photos'>{photos}</div>
			{hasErrors && <IconError/>}
		</div>)
	}
);