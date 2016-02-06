function XtrSelect(xtrSelectObj,xtrOptionsObj){
	var options = [];

	var container;
	var labelText;

	var exceptions = ["optionContent","type","optionPropContent","optionPropValue","addEventListener","title"];

	labelText = document.createElement("label");
	labelText.setAttribute("class","xtrSelectLabel");

	select = document.createElement("select");
	select.setAttribute("class","xtrSelectElement");

	container = document.createElement("div");
	container.setAttribute("class","xtrSelect");

	if(XtrGraficoUtil.isobj(xtrSelectObj)){
		if(XtrGraficoUtil.isset(xtrSelectObj.type)){
		}
		if(XtrGraficoUtil.isset(xtrSelectObj.title)){
			var ordem = XtrGraficoUtil.isset(xtrSelectObj.titleOrder) ? xtrSelectObj.titleOrder : "left";

			var title = xtrSelectObj.title;

			content = document.createTextNode(title);
			
			labelText.appendChild(content);			
			container.appendChild(select);			
			container.appendChild(labelText);
			if(ordem == "left"){
				container.insertBefore(labelText,select);
			}
		}

		if(XtrGraficoUtil.isset(xtrSelectObj.optionContent)){
			var optionsContent = xtrSelectObj.optionContent;
			optionsContent = XtrGraficoUtil.isarray(optionsContent) ? optionsContent : [optionsContent];

			for (var optionIndex = 0; optionIndex < optionsContent.length; optionIndex++){
				var optionObj = optionsContent[optionIndex];
				var optionText = optionObj;
				var value = optionText;
				var option;
				if(XtrGraficoUtil.isset(xtrSelectObj.optionPropContent) 
				&& XtrGraficoUtil.isobj(optionObj)){
					var optionPropContent = xtrSelectObj.optionPropContent;
					if(optionPropContent.indexOf(".") >= 0){
						var optionPropContent = optionPropContent.split(".");
						var outSide = optionPropContent[0];
						var inSide = optionPropContent[1];
						optionText = optionObj[outSide][inSide];
						value = optionText;
					}
					else{
						optionText = optionObj[optionPropContent];
						value = optionText;
					}
				}
				else if (!XtrGraficoUtil.isobj(optionObj)){
					value = optionObj;
				}
				if(XtrGraficoUtil.isset(xtrSelectObj.optionPropValue)
				&& XtrGraficoUtil.isobj(optionObj)){
					var optionPropValue = xtrSelectObj.optionPropValue;
					value = optionObj[optionPropValue];
				}
				if(!(optionText instanceof Option)){				
					if(!(optionText instanceof Text)){
						optionText = document.createTextNode(optionText);			
					}
					option = document.createElement("option");
					option.appendChild(optionText);
					option.value = value;				
				}					
				if(XtrGraficoUtil.isset(xtrSelectObj.optionsObj)){
					option = setAttrs(option,xtrSelectObj.optionsObj);
				}
				select.appendChild(option);
			}
		}
		select = setAttrs(select,xtrSelectObj);
	}
	else{
		options = document.createTextNode(xtrSelectObj);
		select.appendChild(options);
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
				else if(propName == "addEventListener"){
					var evento = "click";
					var callback = console.log(newTarget);

					if(XtrGraficoUtil.isset(propValue.event))
						evento = propValue.event;

					if(XtrGraficoUtil.isset(propValue.func))
						callback = propValue.func;

					newTarget.addEventListener(evento,callback);
				}
			}
		}
		return newTarget;
	}

	return container;
}