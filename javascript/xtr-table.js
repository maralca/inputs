function XtrTable(tableId,where){
	var table = document.getElementById(tableId);
	if(table==null){
		table = document.createElement("table");
		table.id = tableId;
		container = document.getElementById(where);
		container.appendChild(table);
	}
	var trs = [];
	var tds = [];
	var ths = [];
	var tdhs = [];
	var head,body,foot;
	var maxLines = 50;

	var exceptions = ["index","lineIndex",'colunaIndex','type','body','head','foot'];

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
		}
		return newTarget;
	}
	function newLine(objAttrs){
		var tr = document.createElement("tr");
		tr = setAttrs(tr,objAttrs);
		trs.push(tr);
		return tr;
	}
	function newBody(){
		body = document.createElement("tbody");
		return body;
	}
	function newFoot(){
		foot = document.createElement("tfoot");
		return foot;
	}
	function newHead(){
		head = document.createElement("thead");
		return head;
	}
	function newCell_td(objAttrs,LineIndex){
		var lineIndex;
		if(XtrGraficoUtil.isobj(objAttrs) ? XtrGraficoUtil.isset(objAttrs.lineIndex) : true)
			lineindex = trs.length;

		var td = document.createElement("td");
		td = setAttrs(td,objAttrs);
		if(!XtrGraficoUtil.isset(tds[lineIndex]))
			tds[lineIndex] = [];
		tds[lineIndex].push(td);
		if(!XtrGraficoUtil.isset(tdhs[lineIndex]))
			tdhs[lineIndex] = [];
		tdhs[lineIndex].push(td);
		return td;
	}
	function newCell_th(objAttrs,LineIndex){
		var lineIndex;
		if(!XtrGraficoUtil.isset(LineIndex))
			lineindex = trs.length;

		var th = document.createElement("th");
		th = setAttrs(th,objAttrs);
		if(!XtrGraficoUtil.isset(ths[lineIndex]))
			ths[lineIndex] = [];
		ths[lineIndex].push(th);
		if(!XtrGraficoUtil.isset(tdhs[lineIndex]))
			tdhs[lineIndex] = [];
		return th;
	}
	this.setMaxLines = function(max){
		maxLines = max;
	}
	this.appendIn = function(lineObj,columnObj,conteudo){
		var tr;
		var tdh;
		var content;
		var lineIndex,columnIndex;
		var anyTdh = "td";
		var space = table;

		if(!XtrGraficoUtil.isobj(lineObj)){
			lineIndex = lineObj;
			lineObj = {};
			lineObj.index = lineIndex;
		}
		else{
			lineIndex = lineObj.index;
			if(lineObj.body){
				space = body;

				if(!XtrGraficoUtil.isset(space))
					space = newBody();

				table.appendChild(space);
			}
			if(lineObj.head){
				space = head;

				if(!XtrGraficoUtil.isset(space))
					space = newHead();

				table.appendChild(space);
			}
			if(lineObj.foot){
				space = foot;

				if(!XtrGraficoUtil.isset(space))
					space = newFoot();

				table.appendChild(space);
			}
		}
		if(!XtrGraficoUtil.isobj(columnObj)){
			columnIndex = columnObj;
			columnObj = {};
			columnObj.index = columnIndex;
		}
		else{
			columnIndex = columnObj.index;
			if(XtrGraficoUtil.isset(columnObj.type)){
				anyTdh = columnObj.type;
			}
		}
		var calling = eval('newCell_'+anyTdh);
		tr = trs[lineIndex];
		tdh = tdhs[lineIndex];
		content = XtrGraficoUtil.isset(conteudo) ? conteudo : "";
		if(!XtrGraficoUtil.isset(tr)){
			var thisLineIndex = trs.length;
			while(lineIndex >= trs.length && thisLineIndex < maxLines){
				tr = newLine(thisLineIndex);
				//console.info("Nova Linha",tr,"adicionada em",space);
				space.appendChild(tr);	
				thisLineIndex++;
			}
		}
		if(XtrGraficoUtil.isset(tdh) ?  !XtrGraficoUtil.isset(tdh[columnIndex]) : true){
			tdh = calling(columnObj,lineIndex);
			//console.info("Nova Celula",tdh,"adicionada em",tr);
			tr.appendChild(tdh);
		}
		else{
			tdh = tdh[columnIndex];
		}
		if(!(content instanceof Node)){
			content = document.createTextNode(content);
		}
		tdh.appendChild(content);
	}

	this.changeAttr = function(selector,attrs,callback){
		var selecionados = table.querySelectorAll(selector);
		for (var selecionadoIndex = 0; selecionadoIndex < selecionados.length; selecionadoIndex++) {
			var selecionado = selecionados[selecionadoIndex];
			for(var attrName in attrs){
				var attrValue = attrs[attrName];
				if(XtrGraficoUtil.isset(callback) ? callback(selecionado,attrName,attrValue) : true){
					if(XtrGraficoUtil.isobj(attrValue)){
						for(var innerAttrName in attrValue){
							var innerAttrValue = attrValue[innerAttrName];						
							selecionado[attrName][innerAttrName]=innerAttrValue;
						}
					}
					else{
						selecionado.setAttribute(attrName,attrValue);
					}
				}
			}	
		};
	}
	this.getElements = function(selector){
		return table.querySelectorAll(selector);
	}
	this.getId = function(){
		return table.id;
	}

	return this;
}