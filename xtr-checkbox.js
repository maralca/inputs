function XtrCheckbox(xtrCheckboxObj){
	var checkboxType = "";
	var checkboxContent = document.createTextNode(" ");
	var checkboxId = "xtrCheckbox"
	var exceptions = ["content","class","type","addEventListener","id","checked","disabled","symbol","text"];

	var checkbox = document.createElement("div");
	var input = document.createElement("input");
	var label = document.createElement("label");
	var labelText = document.createElement("label");
	var container = document.createElement("div");
	
	labelText.className = "xtrCheckboxLabelText";
	label.className = "xtrCheckboxLabel";
	input.type = "checkbox";

	if(XtrGraficoUtil.isobj(xtrCheckboxObj)){

		if(XtrGraficoUtil.isset(xtrCheckboxObj.type)){
			checkboxType = "xtrCheckbox-"+xtrCheckboxObj.type;
		}

		if(XtrGraficoUtil.isset(xtrCheckboxObj.id)){
			checkboxId = xtrCheckboxObj.id;
		}

		if(XtrGraficoUtil.isset(xtrCheckboxObj.content)){
			checkboxContent = xtrCheckboxObj.content;
			if(!(checkboxContent instanceof Node)){
				checkboxContent = document.createTextNode(checkboxContent);
			}
		}

		checkbox = setAttrs(checkbox,xtrCheckboxObj);
	}
	else{
		checkboxContent = document.createTextNode(xtrCheckboxObj);
	}

	input.setAttribute("id",checkboxId);
	label.setAttribute("for",checkboxId);	

	labelText.appendChild(checkboxContent);
	labelText.setAttribute("for",checkboxId);

	checkbox.appendChild(input);
	checkbox.appendChild(label);
	checkbox.className="xtrCheckboxElement";
	checkbox.setAttribute("for",checkboxId);

	container.className +=" xtrCheckbox "+checkboxType;
	container.setAttribute("for",checkboxId);
	container.appendChild(checkbox);
	container.appendChild(labelText);

	function changeAttr(element,attr,value){
		var originalValue = null;
		if(XtrGraficoUtil.isset(attr.style)){
			var attrStyleName = attr.style.name;
			element.style.setProperty(attrStyleName,value);
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
							newTarget[propName].setProperty(subPropName,subPropValue);
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

				newTarget.addEventListener(evento,function(event){
					var where = eval(propValue.where);
					this.getAttr = function(x,y,z){
						var z1 = this;
						if(XtrGraficoUtil.isset(z))
							z1 = z;
						return getAttr(z1,x,y);
					}
					this.changeAttr = function(x,y,z){
						var z1 = this;
						if(XtrGraficoUtil.isset(z))
							z1 = z;
						changeAttr(z1,x,y);
					}
					this.changeAttrWhen = function(x,y,z,w){
						var w1 = this;
						if(XtrGraficoUtil.isset(w))
							w1 = w;
						changeAttrWhen(w1,x,y,z);
					}
					if(XtrGraficoUtil.isset(where) ? where==event.target : true)
						callback(this,checkboxType,{input:input,labelText:labelText,label:label});
				});
			}
			if(XtrGraficoUtil.isset(objAttrs.checked)){
				var checked = objAttrs.checked;
				if(checked){
					checkbox.setAttribute("checked",true);
					input.setAttribute("checked",true);
				}
				else{
					checkbox.removeAttribute("checked");
					input.removeAttribute("checked");
				}
			}
			if(XtrGraficoUtil.isset(objAttrs.disabled)){
				var disabled = objAttrs.disabled;
				if(disabled){					
					checkbox.setAttribute("disabled",true);
					input.setAttribute("disabled",true);
				}
				else{
					checkbox.removeAttribute("disabled");
					input.removeAttribute("disabled");
				}
			}
			if(XtrGraficoUtil.isset(objAttrs.symbol)){
				var labelAttrs = objAttrs.symbol;
				for(var propName in labelAttrs){
					var propValue = labelAttrs[propName];
					label.style.setProperty(propName,propValue);
				}
			}
			if(XtrGraficoUtil.isset(objAttrs.text)){
				var labelAttrs = objAttrs.text;
				for(var propName in labelAttrs){
					var propValue = labelAttrs[propName];
					labelText.style.setProperty(propName,propValue);
				}
			}
			if(XtrGraficoUtil.isset(objAttrs["class"])){
				var className = objAttrs["class"];
				container.className = className;
			}
		}
		return newTarget;
	}
	

	this.node = container;
	
	return this;
}