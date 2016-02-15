function XtrDivSelect(id,kwargs){
	///////////////////////////
	//VARIAVEIS DE INSTANCIA //
	///////////////////////////
		var exceptions;

		var opcaoEscolhidaValor;

		var input;
		var select;
			var icone;
			var titulo;
			var pesquisa; // se tiver pesquisa
			var containerIcone;		
			var opcoes;
				var opcao,opcaoEscolhida;
					var circulo;
				var nenhum;
	///////////////
	//CONSTRUÇÃO //
	///////////////
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
				primeiraOpcao = kwargs.value;
			}
			if(XtrGraficoUtil.isset(kwargs["data-value"])){
				primeiraOpcao = kwargs["data-value"];
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

					if(opcao.getAttribute("data-value") == opcaoEscolhidaValor){
						opcaoEscolhida = opcao;
					}				
				}
			}
		}
		if(opcaoEscolhida instanceof Node)
			selecionar(opcaoEscolhida);
	/////////////////////////
	//EVENTOS DE CONTRUÇÃO //
	/////////////////////////
		if(XtrGraficoUtil.isset(window.MutationObserver)){
			var node;
			var mo;
			mo = new MutationObserver(function(mutations){
				mutations.forEach(function(mutation) {
			        setWidth(mutation.target);
			    });
				mo.disconnect();
			});

			mo.observe(select,{ 
				attributes: true, 
				childList: true, 
				characterData: true 
			});
		}
		else{
			select.addEventListener("DOMNodeInserted",setWidthEvent);
		}

		function setWidthEvent(){
			setTimeout(setWidth,10);
			setTimeout(function(){
				select.removeEventListener("DOMNodeInserted",setWidthEvent);
			},20)
		}

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

		select.addError = function(){
			addError(this)
		};
		select.removeError = function(){
			removeError(this)
		};
		select.unselectAll = function(){
			desselecionarTodos(this);
		};
		select.selecionarPorValor = function(valor){
			var opcao;

			opcao = this.querySelector(".opcao[data-value='"+valor+"']");
			if(opcao == null){
				console.warn("XtrDivSelect, nenhuma opcao encontrada");
				return;
			}

			selecionar(opcao);
		}
		XtrDivSelect.selecionar = function(select,value){
			var opcao;

			opcao = select.querySelector(".opcao[data-value='"+value+"']");
			if(opcao == null){
				console.warn("XtrDivSelect, nenhuma opcao encontrada");
				return;
			}

			selecionar(opcao);
		};

		select.unselect = desselecionar;
		select.select = selecionar;

	return select;

	//////////////////////
	//METODOS DE CLASSE //
	//////////////////////
		function addError(select){
			removeError(select);
			select.className += " erro";
		}
		function removeError(select){
			select.className = select.className.replace(" erro","");
			select.className = select.className.replace("erro ","");
			select.className = select.className.replace("erro","");
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
			select.className = select.className.replace("selecionado ","");
			select.className = select.className.replace("selecionado","");

			opcao.className = opcao.className.replace(" selecionado","");
			opcao.className = opcao.className.replace("selecionado ","");
			opcao.className = opcao.className.replace("selecionado","");
		}
		function selecionar(opcao){
			var select;
			var input;
			var titulo;

			select = opcao.parentNode.parentNode;
			input = select.querySelector("input[type='hidden']");
			titulo = select.querySelector('.titulo');

			desselecionarTodos(select);

			select.className += " selecionado";

			opcao.className += " selecionado";

			input.value = opcao.getAttribute("data-value");

			titulo.innerHTML = opcao.innerHTML;

			esconder(select);
			pararPesquisa(select);
		}
	/////////////////////
	//METODOS PROPRIOS //
	/////////////////////
		function setWidth(select){
			var opcoes;
			var pesquisa;

			opcoes = select.querySelector(".opcoes");				
			pesquisa = select.querySelector(".pesquisa");

			opcoes.style.setProperty("width",titulo.getBoundingClientRect().width+"px");
			pesquisa.style.setProperty("width",titulo.getBoundingClientRect().width+"px");
			pesquisa.style.setProperty("height",titulo.getBoundingClientRect().height+"px");
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
				selects = document.querySelectorAll('[class*="xtr select"]');
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
			select.className = select.className.replace("mostrando ","");
			select.className = select.className.replace("mostrando","");
		}
		function mostrar(select){
			esconder(select);
			select.className += " mostrando";
		}
		function pararPesquisa(select){
			select.className = select.className.replace(" pesquisando","");
			select.className = select.className.replace("pesquisando ","");
			select.className = select.className.replace("pesquisando","");
		}
		function comecarPesquisa(select){
			pararPesquisa(select);
			select.className += " pesquisando";
		}
		function naoVazio(select){
			select.className = select.className.replace(" vazio","");
			select.className = select.className.replace("vazio ","");
			select.className = select.className.replace("vazio","");
		}
		function vazio(select){
			naoVazio(select);
			select.className += " vazio";
		}
		function perder(opcao){
			opcao.className = opcao.className.replace(" encontrada","");
			opcao.className = opcao.className.replace("encontrada ","");
			opcao.className = opcao.className.replace("encontrada","");
		}
		function encontrar(opcao){
			perder(opcao);
			opcao.className += " encontrada";
		}
		function recolher(opcao){
			opcao.className = opcao.className.replace(" ativa","");
			opcao.className = opcao.className.replace("ativa ","");
			opcao.className = opcao.className.replace("ativa","");
		}
		function escolher(opcao){
			recolher(opcao);
			opcao.className += " ativa";
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
		function pesquisar(select){
			var pesquisa;
			var pesquisado;

			var opcoes,opcao;
			var valor,conteudo;
			var opcaoIndex;

			pesquisa = select.querySelector(".pesquisa");

			if(pesquisa == null){
				return;
			}

			pesquisado = pesquisa.value;
			pesquisado = pesquisado.toLowerCase();

			comecarPesquisa(select);

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
}