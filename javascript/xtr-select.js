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
		if(XtrGraficoUtil.isset(xtrSelectObj.title)){
			var ordem = XtrGraficoUtil.isset(xtrSelectObj.titleOrder) ? xtrSelectObj.titleOrder : "left";

			var title = xtrSelectObj.title;

			content = document.createTextNode(title);
			
			labelText.appendChild(content);			
			container.appendChild(select);			
			container.appendChild(labelText);
			if(ordem == "left"){
				labelText.className += " left";
				container.insertBefore(labelText,select);
			}
			else{
				labelText.className += " right";
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

function XtrDivSelect(id,kwargs){
	/*
	<div class="xtrDivSelect" id="select">        
        <input type="hidden" name="select" id="select_select" />
        <div class="xtrDivSelectHeader">
            <span class="xtrDivSelectIcon">
                <i class="fi-play"></i>
            </span>
            <div class="xtrDivSelectTitle">lalala</div>                
        </div>          
        <div class="xtrDivSelectOptions">
            <div class="xtrDivSelectOption" data-value="1">1</div>
            <div class="xtrDivSelectOption" data-value="2">2</div>
            <div class="xtrDivSelectOption" data-value="3">3</div>
            <div class="xtrDivSelectOption" data-value="4">4</div>
            <div class="xtrDivSelectOption" data-value="5">5</div>
            <div class="xtrDivSelectOption" data-value="6">6</div>
        </div>
    </div>
	 */
	var exceptions;

	var startValue;

	var input;
	var select;
		var icone;
		var titulo;
		var pesquisa; // se tiver pesquisa
		var containerIcone;		
		var opcoes;
			var opcao;
				var circulo;
			var nenhum;

	exceptions = ["title","addEventListener","source","property","value","search","noneTitle","circulo"];


	select = document.createElement("div");
	select.setAttribute("class","xtr select");
	select.setAttribute("id",id);

	input = document.createElement("input");
	input.setAttribute("type","hidden");
	input.setAttribute("name","input_"+id);
	input.setAttribute("id","input_"+id);
	select.appendChild(input);

	pesquisa = document.createElement("input");
	pesquisa.setAttribute("class","pesquisa");
	pesquisa.setAttribute("type","text");
	pesquisa.setAttribute("name","pesquisa_"+id);
	pesquisa.setAttribute("id","pesquisa_"+id);
	pesquisa.setAttribute("value","");
	select.appendChild(pesquisa);

	containerIcone = document.createElement("div");
	containerIcone.setAttribute("class","icone");
	select.appendChild(containerIcone);

	icone = document.createElement("i");
	icone.setAttribute("class","fi-play");
	containerIcone.appendChild(icone);

	titulo = document.createElement("div");
	titulo.setAttribute("class","titulo");
	select.appendChild(titulo);

	opcoes = document.createElement("div");
	opcoes.setAttribute("class","opcoes");
	select.appendChild(opcoes);

	nenhum = document.createElement('div');
	nenhum.setAttribute("class","nenhum");
	nenhum.innerHTML = "Nada econtrado";
	opcoes.appendChild(nenhum);

	if(XtrGraficoUtil.isobj(kwargs)){
		for(property in kwargs){
			if(exceptions.indexOf(property) < 0){
				value = kwargs[property];
				if(XtrGraficoUtil.isobj(value)){
					for(innerProperty in value){
						innerValue = value[innerProperty];
						select[property].setProperty(innerProperty,innerValue);
					}
				}
				else{
					select.setAttribute(property,value);
				}
			}
		}
		if(XtrGraficoUtil.isset(kwargs.search) ? !kwargs.search : true){
			select.removeChild(pesquisa);
		}
		if(XtrGraficoUtil.isset(kwargs.value)){
			startValue = kwargs.value;
		}
		if(XtrGraficoUtil.isset(kwargs["data-value"])){
			startValue = kwargs["data-value"];
		}
		if(XtrGraficoUtil.isobj(kwargs.addEventListener)){
			fn = kwargs.addEventListener.fn;
			type = kwargs.addEventListener.type;
			select.addEventListener(type,function(event){
				if(XtrGraficoUtil.iscallable(fn)){
					fn(this,event);
				}
			});
		}
		if(XtrGraficoUtil.isset(kwargs.title)){
			titulo.innerHTML = kwargs.title;
		}
		if(XtrGraficoUtil.isset(kwargs.noneTitle)){
			noMatch.innerHTML = kwargs.noneTitle;
		}
		if(XtrGraficoUtil.isarray(kwargs.source)){
			collection = kwargs.source;
			for(itemIndex = 0; collection.length > itemIndex; itemIndex++){
				item = collection[itemIndex];

				opcao = document.createElement("div");
				opcao.setAttribute("class","opcao");

				opcoes.insertBefore(opcao,nenhum);

				if(XtrGraficoUtil.isobj(item)){
					property = kwargs.property;
					if(XtrGraficoUtil.isobj(property)){
						content = property.content;
						value = property.value;

						content = eval("item."+content);				
						value = eval("item."+value);	

						opcao.setAttribute("data-value",value);

						content = document.createTextNode(content);

						opcao.appendChild(content);

						if(XtrGraficoUtil.isobj(kwargs.circulo)){
							var prop = kwargs.circulo.on;
							var circle = eval("item."+prop);

							circle = kwargs.circulo.source[circle];

							circuloContainer = document.createElement("div");
							circuloContainer.className = "circulo";
							if(XtrGraficoUtil.isset(kwargs.circulo.tag) ? kwargs.circulo.tag == "svg" : false){
								circle = XtrGraficoUtil.parseSVG(circle);
								circle = new XMLSerializer().serializeToString(circle);
								circulo = document.createElement("img");
								circulo.className = "svg";
								circulo.style.width = "100%";
								circulo.style.height = "100%";
								circulo.src = 'data:image/svg+xml;base64,'+window.btoa(circle);	
							}
							else{
								var containerTemp;
								containerTemp = document.createElement("div");
								containerTemp.innerHTML = circle;
								circulo = containerTemp.firstChild;
								if(circulo.tagName == "IMG"){
									circulo.className = "img";					
								}
							}
							circuloContainer.appendChild(circulo);

							opcao.appendChild(circuloContainer);
						}
					}
					else{
						value = item[property];
						opcao.setAttribute("data-value",value);

						value = document.createTextNode(value);

						opcao.appendChild(value);
					}
				}
				else{
					opcao.setAttribute("data-value",item);

					item = document.createTextNode(item);

					opcao.appendChild(item);
				}

				startValue = opcao.getAttribute("data-value") == startValue ? opcao : startValue;
			}
		}
	}
	// if(startValue instanceof Node)
	// 	selectOption(select,startValue);
	
	select.addEventListener("DOMNodeInserted",setWidth);

	document.addEventListener("click",function(event){
		var select;

		select = XtrGraficoUtil.nodeClosest(event.target,".xtr.select");

		if(select == null){
			fecharExceto();
		}
	});

    select.addEventListener("click",function(event){
    	var clicado;
    	var select;

    	fecharExceto(this);

    	clicado = event.target;
    	
    	if(clicado.className.indexOf("opcao") >= 0){
    		desselecionarTodos(this);
    		selecionar(clicado);
    		esconder(this);
    		pararPesquisa(this);
    	}
    	else{
	    	pesquisar(this);
	    	if(this.className.indexOf("mostrando") >= 0){
	    		esconder(this);
	    		pararPesquisa(this);
	    		naoVazio(this);
	    	}
	    	else{
	    		moverScrollPos(this,0);
	    		mostrar(this);
	    	}
	    }
    });
    select.addEventListener("input",function(event){
    	fecharExceto(this);
    	mostrar(this);
    	pesquisar(this);
    }); 
    select.addEventListener("keypress",function(event){
    	var opcoes;
    	var opcaoIndex;
    	var opcaoAtual,opcaoSeguinte,opcaoAnterior;
    	var keys;
    	keys = {
    		charCode: [0,0,0,0,0],
    		keyCode: [40,38,13,9,27],
    		key: [ "arrowdown","arrowup","enter","tab","escape"]
    	}
    	if(keys.charCode.indexOf(event.charCode) < 0 && keys.keyCode.indexOf(event.keyCode) < 0
    	|| keys.key.indexOf(event.key.toLowerCase()) < 0){
    		return;
    	}
    	event.stopPropagation();

    	opcoes = this.querySelectorAll(".opcao.encontrada");
    	opcoes = opcoes.length < 1 ? this.querySelectorAll(".opcao") : opcoes;

     	opcaoAtual = this.querySelector(".opcao.ativa");

    	opcaoIndex = XtrGraficoUtil.nodeIndexOf(opcoes,opcaoAtual);

    	opcaoSeguinte = opcoes.item(opcaoIndex+1);
		opcaoAnterior = opcoes.item(opcaoIndex-1);

    	if(event.charCode == 0 && event.keyCode == 40 || event.key.toLowerCase() == "arrowdown"){
    		if(opcaoSeguinte != null){
    			if(opcaoAtual != null){
    				recolher(opcaoAtual);   
				}		
    			moverScroll(opcaoSeguinte);
    			escolher(opcaoSeguinte);
    		}
    	}
    	else if(event.charCode == 0 && event.keyCode == 38 || event.key.toLowerCase() == "arrowup"){
    		if(opcaoAnterior != null){
    			if(opcaoAtual != null){
    				recolher(opcaoAtual);   
				}		
    			moverScroll(opcaoAnterior);
    			escolher(opcaoAnterior);
    		}
    	}
    	else if(event.charCode == 0 && event.keyCode == 13 || event.key.toLowerCase() == "enter"
    	|| event.charCode == 0 && event.keyCode == 9 || event.key.toLowerCase() == "tab"){
    		if(opcaoAtual != null){
	    		escolher(opcaoAtual);
	    		selecionar(opcaoAtual);
	    	}
    	}
    	else if(event.charCode == 0 && event.keyCode == 27 || event.key.toLowerCase() == "escape"){
    		esconder(this);
    		pararPesquisa(this);
    	}
    });

	select.addError = function(){addError(this)};
	select.removeError = function(){removeError(this)};

	return select;
	function addError(select){
		removeError(select);
		select.className += " erro";
	}
	function removeError(select){
		select.className = select.className.replace(" erro","");
	}
	function setWidth(){
		setTimeout(function(){
			opcoes.style.setProperty("width",titulo.getBoundingClientRect().width+"px");
		},10);
	}
	function moverScroll(opcao){
		var opcaoContainer;

		opcaoContainer = opcao.parentNode;

		opcaoContainer.scrollTop = opcao.offsetTop - opcaoContainer.offsetHeight / 2 - opcao.offsetHeight / 2;
	}
	function moverScrollPos(select,pos){
		var opcaoContainer;

		opcaoContainer = select.querySelector(".opcoes");

		opcaoContainer.scrollTop = pos;
	}
	function fecharExceto(atual){
		if(XtrGraficoUtil.isset(atual)){
			id = atual.getAttribute("data-id");
			if(!XtrGraficoUtil.isset(id)){
				return;
			}
			selects = document.querySelectorAll('[data-id="'+id+'"]');
		}
		else{
			selects = document.querySelectorAll(".xtr.select");
		}
		for(selectIndex = 0; selects.length > selectIndex; selectIndex++){
			select = selects[selectIndex];
    		if(select != atual){
				esconder(select);
				pararPesquisa(select);
			}
		}
	}
	function esconder(select){
		select.className = select.className.replace(" mostrando","");
	}
	function mostrar(select){
		esconder(select);
		select.className += " mostrando";
	}
	function pararPesquisa(select){
		select.className = select.className.replace(" pesquisando","");
	}
	function comecarPesquisa(select){
		pararPesquisa(select);
		select.className += " pesquisando";
	}
	function naoVazio(select){
		select.className = select.className.replace(" vazio","");
	}
	function vazio(select){
		naoVazio(select);
		select.className += " vazio";
	}
	function perder(opcao){
		opcao.className = opcao.className.replace(" encontrada","");
	}
	function encontrar(opcao){
		perder(opcao);
		opcao.className += " encontrada";
	}
	function pesquisar(select){
		var pesquisa;
		var pesquisado;

		var opcoes,opcao;
		var valor,conteudo;
		var opcaoIndex;

		comecarPesquisa(select);

		pesquisa = select.querySelector(".pesquisa");
		pesquisado = pesquisa.value;
		pesquisado = pesquisado.toLowerCase();

		if(pesquisado == ""){
			vazio(select);
		}
		else{
			naoVazio(select);
		}

		opcoes = select.querySelectorAll(".opcao");
		for(opcaoIndex = 0; opcoes.length > opcaoIndex; opcaoIndex++){
        	opcao = opcoes[opcaoIndex];

        	valor = opcao.getAttribute("data-value");
        	valor = valor.toLowerCase();

        	conteudo = opcao.firstChild.nodeValue;
        	conteudo = conteudo.toLowerCase();

        	if(valor.indexOf(pesquisado) >= 0 || conteudo.indexOf(pesquisado) >= 0){
        		encontrar(opcao);
        	}
        	else{
        		perder(opcao);
        	}
        }
	}
	function desselecionarTodos(select){
		var opcoes,opcao;
		var opcaoIndex;

		opcoes = select.querySelectorAll(".opcao");
		for(opcaoIndex = 0; opcoes.length > opcaoIndex; opcaoIndex++){
			opcao = opcoes[opcaoIndex];
			desselecionar(opcao);
		}
	}
	function desselecionar(opcao){
		var select;

		select = opcao.parentNode.parentNode;

		select.className = select.className.replace(" selecionado","");

		opcao.className = opcao.className.replace(" selecionado","");
	}
	function selecionar(opcao){
		var select;

		select = opcao.parentNode.parentNode;

		desselecionarTodos(select);

		select.className += " selecionado";

		opcao.className += " selecionado";

		input.value = opcao.getAttribute("data-value");

		titulo.innerHTML = opcao.innerHTML;

		esconder(select);
		pararPesquisa(select);
	}
	function recolherTodos(select){
		var opcoes,opcao;
		var opcaoIndex;

		opcoes = select.querySelectorAll(".opcao");

		for(opcaoIndex = 0; opcoes.length > opcaoIndex; opcaoIndex++){
			opcao = opcoes[opcaoIndex];
			recolher(opcao);
		}
	}
	function recolher(opcao){
		opcao.className = opcao.className.replace(" ativa","");
	}
	function escolher(opcao){
		recolher(opcao);
		opcao.className += " ativa";
	}
}