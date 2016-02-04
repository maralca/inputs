function XtrButao(xtrButaoObj){
	var butaoType = "xtrButao-default";
	var butaoContent = "";

	var exceptions = ["content","type","addEventListener"];

	butao = document.createElement("div");


	if(XtrGraficoUtil.isobj(xtrButaoObj)){
		if(XtrGraficoUtil.isset(xtrButaoObj.type))
			butaoType = "xtrButao-"+xtrButaoObj.type;

		if(XtrGraficoUtil.isset(xtrButaoObj.content)){
			butaoContent = xtrButaoObj.content;
			if(!(butaoContent instanceof Node)){
				butaoContent = document.createTextNode(butaoContent);
			}
			butao.appendChild(butaoContent);
		}
		butao = setAttrs(butao,xtrButaoObj);
	}
	else{
		butaoContent = document.createTextNode(xtrButaoObj);
		butao.appendChild(butaoContent);
	}


	butao.className="xtrButao "+butaoType;

	function changeAttr(element,attr,value){
		var originalValue = null;
		if(XtrGraficoUtil.isset(attr.style)){
			var attrStyleName = attr.style.name;
			element.style[attrStyleName] = value;
		}
		else{
			element.setAttribute(attr,value);
		}
	}	
	function changeAttrWhen(element,attrName,attrCondValues,cond){
		var verdadeiro = attrCondValues.verdadeiro;
		var falso = attrCondValues.falso;
		var attrValue = !XtrGraficoUtil.isset(cond) ? falso : cond ? verdadeiro : falso;
		element.setAttribute(attrName,attrValue);
	}
	function getAttr(element,attr,neddEval){
		var originalValue = null;
		if(XtrGraficoUtil.isset(attr.style)){
			var attrStyleName = attr.style.name;
			originalValue = element.style[attrStyleName];
		}
		else{
			originalValue = element.getAttribute(attr);
		}
		if(XtrGraficoUtil.isset(neddEval) ? neddEval : false)
			originalValue = eval(originalValue);
		return originalValue;
	}
	function setAttrs(target,objAttrs){
		var newTarget = target;
		if(XtrGraficoUtil.isobj(objAttrs)){
			for(var propName in objAttrs){			
				var propValue = objAttrs[propName];	
				if(exceptions.indexOf(propName) < 0){
					if(!XtrGraficoUtil.isobj(propValue))			
						newTarget.setAttribute(propName,propValue);
					else{
						for(var subPropName in propValue){
							var subPropValue = propValue[subPropName];
							newTarget[propName][subPropName]=subPropValue;
						}
					}
				}
			}			
			if(XtrGraficoUtil.isset(objAttrs.addEventListener)){
				var propValue=objAttrs.addEventListener;
				var evento = "click";
				var callback = function(t,bt){console.log(t,bt)};

				if(XtrGraficoUtil.isset(propValue.event))
					evento = propValue.event;

				if(XtrGraficoUtil.isset(propValue.func))
					callback = propValue.func;

				newTarget.addEventListener(evento,function(){
					this.getAttr = function(x,y){
						return getAttr(this,x,y);
					}
					this.changeAttr = function(x,y){
						changeAttr(this,x,y);
					}
					this.changeAttrWhen = function(x,y,z){
						changeAttrWhen(this,x,y,z);
					}
					callback(this,butaoType);
				});
			}
		}
		return newTarget;
	}
	this.node = butao;
	return this;
}