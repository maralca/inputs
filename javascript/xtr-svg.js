function XtrSVG(svgObj,whereId){	
	var container;
	var svg;
	var tree;

	const exceptions = ["level","tag","parent","index"];
	const SVGREF = "http://www.w3.org/2000/svg";

	tree = []

	if(XtrGraficoUtil.isset(whereId)){
		container = document.getElementById(whereId);
		if(container == null){
			console.warn("XtrSVG, element with whereId was not find");
			return;
		}
	}
	else{
		container = document.body;
	}
	if(XtrGraficoUtil.isobj(svgObj)){
		if(XtrGraficoUtil.isset(svgObj.id)){
			svg = document.getElementById(svgObj.id);			
		}
		else{
			console.warn("XtrSVG, svgObj\\id is not set");
			return;
		}
	}
	else if(XtrGraficoUtil.isset(svgObj)){
		svg = document.getElementById(svgObj);
	}
	if(XtrGraficoUtil.isset(svg) ? svg == null : true){
		svg = document.createElementNS(SVGREF,"svg");
	}
	tree.push(svg);

	svg = setAttrs(svg,svgObj);
	container.appendChild(svg);

	this.append = append;
	this.setAttrs = setAttrs;
	this._ = svg;

	return this;

	function setAttrs(target,objAttrs){
		var newTarget = target;
		if(XtrGraficoUtil.isobj(objAttrs)){
			for(var propName in objAttrs){			
				var propValue = objAttrs[propName];	
				if(exceptions.indexOf(propName) < 0){
					if(!XtrGraficoUtil.isobj(propValue))			
						newTarget.setAttributeNS(null,propName,propValue);
					else{
						for(var subPropName in propValue){
							var subPropValue = propValue[subPropName];
							newTarget[propName][subPropName]=subPropValue;
						}
					}
				}
			}
		}
		return newTarget;
	}

	function append(oneObj,callback){
		var oneLevel,higherLevel;
		var levelSeeker;

		var oneTag;
		var oneParent;
		var oneIndex;
		var one;
		var parent;		

		if(XtrGraficoUtil.isobj(oneObj)){
			oneTag = XtrGraficoUtil.isset(oneObj.tag) ? oneObj.tag : "g";
			oneParent = XtrGraficoUtil.isset(oneObj.parent) ? oneObj.parent : tree[tree.length - 1];
		}
		if(!oneObj.parent instanceof Node)
			oneParent = tree[oneParent];

		if(XtrGraficoUtil.isset(oneParent) ? oneParent == null : true){
			console.error("XtrSVG, append\\parent is not set");
			return;
		}

		if(XtrGraficoUtil.isset(one) ? one == null : true){
			one = document.createElementNS(SVGREF,oneTag);
			tree.push(one);
		}

		one = setAttrs(one,oneObj);
		one.setAttrs = function(oneObj){
			return setAttrs(one,oneObj);
		}
		oneParent.appendChild(one);

		if(XtrGraficoUtil.iscallable(callback)){
			callback();
		}

		return one;
	}
}