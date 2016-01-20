import React,{Component,PropTypes} from 'react';
import ReactDOM from 'react-dom';

let $script_ = null
,	loadPromise_
,	resolveCustomPromise_
;

const gMapsURL = 'https://maps.googleapis.com/maps/api/js?callback=_$_google_map_initialize_$_';
const _customPromise = new Promise(resolve=>{resolveCustomPromise_ = resolve;});
const style = {
	width:'100%'
,	height:'100%'
,	minHeight:'25em'
,	minWidth:'5em'
}
const mapStyle = {
	width:'100%'
,	height:'100%'
,	minHeight:'25em'
,	minWidth:'5em'
}

function gmapLoaded(){
	return (window.google && window.google.maps);
}

function googleMapLoader(){

	if(!loadPromise_){
		
		if(!$script_){$script_ = require('scriptjs');}
		loadPromise_ = new Promise((resolve, reject) => {

			if(typeof window === 'undefined') {
				return reject(new Error('google map cannot be loaded outside browser env'));
			}

			if(gmapLoaded()){
				return resolve(window.google.maps);
			}

			if (typeof window._$_google_map_initialize_$_ !== 'undefined') {
				reject(new Error('google map already initialized'));
			}

			window._$_google_map_initialize_$_ = ()=>resolve(window.google.maps);

			$script_(
				gMapsURL
			,	() => gmapLoaded() || reject(new Error('google map initialization error (not loaded)'))
			);
		});
	}


	return loadPromise_;
}

function createMap(node,opts){
	return new Promise(function(resolve,reject){
		const map = new google.maps.Map(node,opts.map);
		const marker = new google.maps.Marker({...opts.marker,map});
		const geocoder = new google.maps.Geocoder();
		const result = {map,marker,geocoder};
		google.maps.event.addListenerOnce(map,'idle',function(){
			resolve(result);
        });
	})
}

function geocodeAddress(geocoder,map,marker,address){
	geocoder.geocode({address},(results, status)=>{
		if (status === google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
			marker.setPosition(results[0].geometry.location);
		} else {
			console.log('no location found')
		}
	});
}

class GoogleMap extends Component{
	static propTypes = {
		zoom:PropTypes.number
	,	lat:PropTypes.number
	,	lng:PropTypes.number
	,	label:PropTypes.string
	,	address:PropTypes.string
	,	showInput:PropTypes.bool
	}
	static defaultProps = {
		zoom: 8
	,	lat: 43.6425569
	,	lng: -79.4073126
	,	label:'Here'
	,	showInput:true
	}
	constructor(props,context){
		super(props,context)
		this.state = {map:null,api:false,address:''}
		this.onTextChange = this.onTextChange.bind(this);
		this.setAddress = this.setAddress.bind(this);
		googleMapLoader().then(()=>this.setState({api:true}))
	}
	onTextChange(evt){
		const address = evt.target.value;
		this.setAddress(address);
	}
	onMapChange(map){
		return ()=>{
			if(!this.props.onChange){return;}
			const props = {...map.getCenter().toJSON(),zoom:map.getZoom()};
			this.props.onChange(props);
		}
	}
	getMapProps(){
		const {zoom,lat,lng,label} = this.props;
		const position = new google.maps.LatLng(lat,lng);
		return {
			map: {
				center:position
			,	zoom
			}
		,	marker:{
				position
			,	title:label
			}
		}
	}
	setAddress(address){
		if(address == this.address){return;}
		this.setState({address},()=>{
			clearTimeout(this.searchTimeout);
			const {map,geocoder,marker} = this;
			this.address = address;
			this.searchTimeout = setTimeout(()=>{
				geocodeAddress(geocoder,map,marker,address)
			},1000)
		});
	}
	componentWillReceiveProps(props){
		if(props.address && props.address!==this.state.address){
			this.setAddress(props.address);
		}
	}
	getMap(opts){
		if(!this.state.map){		
			const node = ReactDOM.findDOMNode(this.refs.canvas);
			createMap(node,opts).then(({map,marker,geocoder})=>{
				this.map = map;
				this.marker = marker;
				this.geocoder = geocoder
				this.setState({map:true});
				map.addListener('center_changed',this.onMapChange(map))
			});
			return false;
		}
		return this.map;

	}
	updateMap(){
		if(!this.state.api){return;}
		const opts = this.getMapProps();
		const map  = this.getMap(opts);
		if(!map){return false;}
		const marker = this.marker;
	}
	componentDidMount(){
		this.updateMap();
	}
	componentDidUpdate(){
		this.updateMap();
	}
	render(){
		const {showInput} = this.props;
		return (<div className='google-map' style={style}>
			{showInput && <input type='text' onChange={this.onTextChange} value={this.state.address} disabled={!!!this.state.map}/>}
			<div className='google-map-canvas' ref='canvas' style={mapStyle}/>
		</div>)
	}
}

export default GoogleMap;