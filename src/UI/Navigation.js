import Icon from './Icon';

export default function Navigation({routes,onClick,active,root}){
	var activeIndex = -1;
	var subMenu;
	const mainRoutes = routes.map((route,i)=>{
		var className = 'menu-item';
		const path = root!=null ? [root,route.route] : [route.route];
		const _onClick = onClick(path);
		if(route.route == active[0]){activeIndex = i; className+=' active';}
	    return (<a className={className} href='#' onClick={_onClick} key={i}>
           	{route.icon && <Icon type={route.icon}/>}
            <span>{route.title}</span>
        </a>);
	});
	if(activeIndex>=0 && routes[activeIndex].sub){
		subMenu = Navigation({
			routes:routes[activeIndex].sub
		,	onClick:onClick
		,	active:active.slice(1)
		,	root:routes[activeIndex].route
		})
	}
	return (<nav>
		{mainRoutes}
		{subMenu}
	</nav>)
}