function TableMaker(tableId,compositeData,chunkSize,mesclando){
	///////////////////////////
	//VARIAVEIS DE INSTANCIA //
	///////////////////////////

	    var xtrTable;

	    var series,serie;
	    var serieNome;
	    var serieIndex;

	    var rotulos,rotulo;
	    var rotuloIndex;

	    var valores,valor;
	    var valorIndex;

	    var div;

	    var inverted;

	    var paginacaoScript;
    ///////////////
    //CONSTRUCAO //
    ///////////////

    	var inverted = true;

    	xtrTable = new XtrTable(tableId);

    	paginacaoScript = {};

	    rotulos = compositeData.rotulosFormatados;
	    if(compositeData.dado == "geografica")
		    rotulos = compositeData.rotulos;

	    series = compositeData.series;

	    organize();

	    mesclando = XtrGraficoUtil.isset(mesclando) ? mesclando : false;

	    tableName = mesclando ? "MECLAR GRAFICO" : "CRIAR GRAFICO";

	    classTableName = mesclando ? "xtr alert rosa" : "xtr alert ciano";
	    classSerie = "";
	    classRotulo = "principal";
	    classExtrapolate = "tamanho metade";
	    classInterpolate = "tamanho metade";
	    classPaginador = "xtr grupo liso linear centralizado padding dobrado arredondado espacado";
	    classGroupButtons = "xtr grupo linear centralizado desigualmente distribuido";
	    classSelects = "xtr grupo linear centralizado espacado igualmente distribuido";
	    classButtons = "xtr grupo linear centralizado espacado igualmente distribuido arredondado";
	    classInconsistenciaLegend = "xtr alert amarelo";
	    classInterpolateLegend = "xtr alert azul";
	    classExtrapolateLegend = "xtr alert vermelho";
	    classGenerateButton = "padding quadruplicado";

	    styleTableName = {
	    	"opacity": ".65",
	    	"text-align": "left",
	    	"padding-left": "0.6em"
	    };
	    styleColumn = {};
	    styleColumnPaginador = {};
	    styleGroupButtons = {
	    	"position": "relative"
	    };
	    styleExtrapolate = {};
	    styleInterpolate = styleExtrapolate;
	    styleRotulo = {};

	    styleColumnTitleRotulo = {
	    	
	    }; 
	    styleColumnTitleSerie = {
	    	"height": "100%",
	    	"position": "relative"
	    };
	    styleTitleSerie = {
	    	//"position": "absolute",
	    	"top": "0px",
	    	"height": "calc(100% - 0.6em)",
	    	"-webkit-flex-direction": "column",
	    	"flex-direction": "column",
	    	"text-align":"right"
	    }
	    styleSelects = {

	    }

	    hasDividerOnSelect = true;
	    hasDividerOnButtons = false;

	    widthColumn = 100/(chunkSize+1) + "%";
	    widthColumnTitleRotulo = 100/(chunkSize+1) + "%";
	    widthColumnTitleSerie = 100/(chunkSize+1) + "%";

	    this.titulos=titulos;
	    this.paginadores=paginadores;
	    this.conteudo=conteudo;
	    this.restante=restante;
	    this.selects=selects;
	    this.butoes=butoes;
	    this.make=make;

	    return this;

	/////////////////////
	//METODOS PROPRIOS //
	/////////////////////
		function interpolateAction(context){
			var alvo;

			var inconsistencias,inconsistencia;

			var polados;

			var temIncosistenciaAcumulada;
			var temIncosistenciaNaSerie;
			var temIncosistenciaNoRotulo1,temIncosistenciaNoRotulo2;

			var rotulos,rotulo1,rotulo2;

			var series,serie;
			var serieIndex;

			var valores;
			var formatados;

			var novoPonto;

			var paginaAtual;

			series = compositeData.series;

			inconsistencias = compositeData.inconsistencias;

			polados = compositeData.polados;

            rotulosFormatados = compositeData.rotulosFormatados;          
            rotulos = compositeData.rotulos;          

            alvo = context.getAttribute("data-ponto-interpolacao");

            for(serieIndex = 0; series.length > serieIndex; serieIndex++){
                serie = series[serieIndex];

                valores = serie.dados;
                formatados = serie.dadosFormatados;

            	novoPonto = XtrNumerico.interpolate(compositeData,serieIndex,alvo,3);

                novoPonto.x = novoPonto.x.toString();
                novoPonto.y = Math.round(novoPonto.y);

                if(alvo-1 >= 0){
                    inconsistencia = valores[alvo-1];
                }
                else{
                    inconsistencia = valores[alvo+1];
                }

                rotulo1 = rotulosFormatados[alvo];
                rotulo2 = rotulosFormatados[alvo-1];
                
                temIncosistenciaNaSerie = XtrGraficoUtil.hasInObj(inconsistencias,'serieIndex',serieIndex);

                temIncosistenciaNoRotulo1 = XtrGraficoUtil.hasInObj(inconsistencias,'rotulo',rotulo1);
                temIncosistenciaNoRotulo2 = XtrGraficoUtil.hasInObj(inconsistencias,'rotulo',rotulo2);
                temIncosistenciaNoRotulo = temIncosistenciaNoRotulo1 || temIncosistenciaNoRotulo2;

                temIncosistenciaAcumulada = temIncosistenciaNaSerie && temIncosistenciaNoRotulo;

                if(novoPonto.y < 0 || temIncosistenciaAcumulada){
                    novoPonto.y = inconsistencia;
                    inconsistencias.push({
                        "serie": serieIndex,
                        "rotulo": novoPonto.x
                    });
                }
                valores.splice(alvo,0,novoPonto.y);
                formatados.splice(alvo,0,novoPonto.y);

                polados.push({
                	"type": 'interpolacao', 
                	"value": novoPonto.x
                });
            };
            if(series.length > 0){
                rotulos.splice(alvo,0,novoPonto.x); 
                rotulosFormatados.splice(alvo,0,novoPonto.x); 
            }

            paginaAtual = paginacaoScript[tableId].getPaginaAtual();

            mesclarCustomizar(mesclando);

            paginacaoScript[tableId].paginar(paginaAtual);               
        }
		function extrapolateAction(context){
	        var alvo;

	        var inconsistencias,inconsistencia;

	        var temIncosistenciaAcumulada;
	        var temIncosistenciaNaSerie;
	        var temIncosistenciaNoRotulo;

	        var series,serie;
	        var serie;

	        var formatados;
	        var valores;
	        var novoPonto;

	        var polados;

	        var rotulos,rotulo;

	        alvo = context.getAttribute("data-ponto-extrapolacao");

	        rotulosFormatados = compositeData.rotulosFormatados;
	        rotulos = compositeData.rotulos;
	        inconsistencias = compositeData.inconsistencias;

	        series = compositeData.series;
	        polados = compositeData.polados;

	        for(serieIndex = 0; series.length > serieIndex; serieIndex++){

	            novoPonto = XtrNumerico.extrapolate(compositeData,serieIndex,alvo,3);   

	            novoPonto.x = novoPonto.x.toString();
	            novoPonto.y = Math.round(novoPonto.y);

	            serie = series[serieIndex];                
	            valores = serie.dados;
	            formatados = serie.dadosFormatados;

	            inconsistencia = valores[alvo];
	            rotulo = rotulosFormatados[alvo];

	            temIncosistenciaNaSerie = XtrGraficoUtil.hasInObj(inconsistencias,'serie',serieIndex);
	            temIncosistenciaNoRotulo = XtrGraficoUtil.hasInObj(inconsistencias,'rotulo',rotulo);

	            temIncosistenciaAcumulada = temIncosistenciaNaSerie && temIncosistenciaNoRotulo;
	            if(novoPonto.y < 0 || temIncosistenciaAcumulada){
	                novoPonto.y = inconsistencia;
	                inconsistencias.push({
	                    "serie": serieIndex,
	                    "valor": novoPonto.x
	                });
	            }
	           	valores.splice(alvo,0,novoPonto.y);
	           	formatados.splice(alvo,0,novoPonto.y);
	            polados.push({
	            	"type": 'extrapolacao', 
	            	"value": novoPonto.x
	            });
	        };
	        if(series.length > 0){
	            rotulos.splice(alvo,0,novoPonto.x); 
	            rotulosFormatados.splice(alvo,0,novoPonto.x); 
	        }

	        mesclarCustomizar(mesclando);
	    }
	    function selectorAction(acao,context){
	    	var clicado;

	    	var targetIndex;

	    	var objStyle;

	        clicado = context.getAttribute("data-clicado");
	        clicado = eval(clicado);

	        targetIndex = context.getAttribute('data-target-'+acao+'Index');
	        targetIndex = eval(targetIndex);

	        var cor = !clicado ? "rgba(34, 36, 38, 0.20)" : "";
	        
	        if(acao == "coluna"){
		        objStyle = {
		        	"data-colunaAtiva": clicado,
		        	"style": {
		        		"background": cor,
		        		"color": cor
		        	}
		        };
	    	}
	        else{
	        	objStyle = {
			        "data-linhaAtiva": clicado,
			        "style": {
			        	"background": cor,
			        	"color": cor
			        }
			    };
	        }

	        xtrTable.changeAttr('td[data-'+acao+'Index="'+targetIndex+'"]',
	            objStyle,
	            function(td,name,value){
	                if(name=="style"){
	                    var colunaAtiva = td.getAttribute("data-colunaAtiva");
	                    colunaAtiva = eval(colunaAtiva);
	                    var linhaAtiva = td.getAttribute("data-linhaAtiva");
	                    linhaAtiva = eval(linhaAtiva);
	                    var auxColunaAtiva = acao == "coluna" ? !colunaAtiva : colunaAtiva;
	                    var auxLinhaAtiva = acao == "linha" ? !linhaAtiva : linhaAtiva;
	                    if(auxColunaAtiva || auxLinhaAtiva){
	                        return true;
	                    }
	                    return false;
	                }
	                return true;
	            }
	        );
	    }
	    function generateAction(isActive,mesclar){
	       	var selectedCompositeData;
	       	var compositeData;

	       	compositeData = compositeDataHandler.previous().current();

	       	compositeDataHandler.override(compositeData);

	        selectedCompositeData = makeSelectedCompositeData(isActive,mesclar);
	        
	        if(selectedCompositeData){           

		        sideBar.desactiveAll();

		        if(mesclar){
		            compositeDataHandler.save(selectedCompositeData);
		            xtrTab.mostrarAtivarChamar('tab_exibir', function(){
		                mergeChartData(compositeDataHandler.load());                            
		            });

		        }
		        else{
		        	
		            if(['columns','bars','column','bar'].indexOf(selectedCompositeData.tipo) >= 0 && selectedCompositeData.series.length > 1){
		            	selectedCompositeData.tipo = "clustered"+selectedCompositeData.tipo;
		            }
		            
		            compositeDataHandler.override(selectedCompositeData);

		            xtrTab.mostrarAtivarChamar('tab_exibir', function(){                      
		                generateWithLoading(compositeDataHandler.current());
		                refreshType();
		            });
		        }
		    }
	    }	    
	    function action(invert){
	    	var celulas,celula;
	    	var celulaIndex;
	    	var bool;

	    	celulas = xtrTable.getElements(generalSelector());
	    	console.log(celulas);
	    	for(celulaIndex = 0; celulas.length > celulaIndex; celulaIndex++){
	    		celula = celulas[celulaIndex];
	    		if(invert){
	    			celula.click();	    			
	    		}
	    		else{
	    			bool = celula.getAttribute("data-colunaAtiva");
	    			bool = XtrGraficoUtil.getBool(bool);
	    			if(!bool){
	    				celula.click();
	    			}
	    		}
	    	}
	    }
	    function getColumnSelector(isActive){
	    	return 'tbody tr:first-of-type td[data-colunaAtiva="'+isActive+'"]:not([data-colunaRestante])';
	    }
	    function getLineSelector(isActive){
	    	return 'tbody tr td:first-of-type[data-linhaAtiva="'+isActive+'"]:not([data-linhaRestante])';
	    }
	    function generalSelector(){
	    	return 'tbody tr:first-of-type td:not([data-colunaRestante]),'
	    	+'tbody tr td:first-of-type:not([data-linhaRestante])';
	    }
	    function makeSelectedCompositeData(isActive,mesclar){
	        var linesToRemove,columnsToRemove,removeLinesAttr;
	        var seriesToRemove,pointsToRemove,removeSeriesAttr;
	        var removeColumnSelector,removeColumnAttr;
	        var removeLineSelector,removeLineAttr;

	        var hasSelected;

	        var toRemove;
	        var toRemoveIndex;
	        var index;

	        var series,serie;
	        var serieIndex;
	        var rotulos,rotulo;

	        var selectTema,selectTipo;

	        var msgerro,msg;

	        compositeData = dataHandler.search("tabela",0);
	        compositeData = XtrGraficoUtil.clone(compositeData);
	        series = compositeData.series;
	        rotulosFormatados = compositeData.rotulosFormatados;
	        rotulos = compositeData.rotulos;

	        removeColumnIndexes = [];
	        removeLineIndexes = [];

	        isActive = !isActive;

	        removeColumnSelector = getColumnSelector(isActive);
	        removeColumnAttr = "data-colunaIndex";
			removeLineSelector = getLineSelector(isActive);
			removeLineAttr = "data-linhaIndex";

			linesToRemove = xtrTable.getElements(removeLineSelector);
			columnsToRemove = xtrTable.getElements(removeColumnSelector);
			seriesToRemove = inverted ? columnsToRemove : linesToRemove;
			pointsToRemove = inverted ? linesToRemove : columnsToRemove;
			removeLinesAttr = inverted ? removeColumnAttr : removeLineAttr;
			removeSeriesAttr = inverted ? removeLineAttr : removeColumnAttr;

			hasSelected = series.length != seriesToRemove.length;
			for(toRemoveIndex = 0; seriesToRemove.length > toRemoveIndex && hasSelected; toRemoveIndex++){
				toRemove = seriesToRemove[toRemoveIndex];				
				index = toRemove.getAttribute(removeLinesAttr);
				index = index - toRemoveIndex;
				index = index > 0 ? index : 0;
				serie = series.splice(index,1);
				serie = serie[0];
				console.info("(",toRemoveIndex,")","Serie",serie.titulo,"foi removida");
			}

			hasSelected = rotulos.length != pointsToRemove.length;

			for(toRemoveIndex = 0; pointsToRemove.length > toRemoveIndex && hasSelected; toRemoveIndex++){
				toRemove = pointsToRemove[toRemoveIndex];
				index = toRemove.getAttribute(removeColumnAttr);
				index = parseInt(index);		
				index = index - toRemoveIndex;
				index = index > 0 ? index : 0;
				for(serieIndex = 0; series.length > serieIndex; serieIndex++){
					serie = series[serieIndex];
					serie.dados.splice(index,1);
					serie.dadosFormatados.splice(index,1);
				}
				rotulos.splice(index,1);
				rotulo = rotulosFormatados.splice(index,1);
				rotulo = rotulo[0];
				console.info("(",toRemoveIndex,")","Rotulo",rotulo,"foi removido");
			}
	        
	        if(!mesclar){
	            selectTema = document.getElementById("input_"+xtrTable.getId()+"_tema");
	            compositeData.tema = selectTema.value;
	        }

	        selectTipo = document.getElementById("input_"+xtrTable.getId()+"_tipo");

	        msgerro = "";

	        compositeData.tipo = selectTipo.value;
	        if(rotulos.length < 1){

	        	msg = isActive ? " deve estar selecionado" : " não deve estar selecionado";
	        	msg = "Pelo menos uma " + colunaLinha + msg;
	        	console.log(msg);

				msgerro += msg;
				msgerro += "\n";
	    	}
	        if(series.length < 1){

	        	msg = isActive ? " deve estar selecionada" : " não deve estar selecionada";
	        	msg = "Pelo menos uma " + linhaColuna + msg;
	        	console.log(msg);

				msgerro += msg;
				msgerro += "\n";
	        }
	        if("markersonly" == compositeData.tipo && series.length < 2){

	        	msg = "Grafico de Disperão deve ter pelo menos duas "+colunaLinha+"s selecionadas";
	        	console.log(msg);

				msgerro += msg;
				msgerro += "\n";       		
	       	}
	       	if("bubles" == compositeData.tipo && series.length < 2){

	       		msg = "Grafico de Bolhas deve ter pelo menos duas "+linhaColuna+"s selecionadas";
	       		console.log(msg);

	       		msgerro += msg;
	       		msgerro += "\n";       		
	       	}
	       	if(["lines","stackedlines"].indexOf(compositeData.tipo) >= 0 && rotulos.length < 2){
	       		msg = "Grafico de Linhas deve ter pelo menos duas "+colunaLinha+"s selecionados";
	       		console.log(msg);

	       		msgerro += msg;
	       		msgerro += "\n";
	       	}
	        if(compositeData.tipo == ""){

	        	msg = "Nenhum tipo foi selecionado";
	        	console.log(msg);

	        	msgerro += msg;
	        	msgerro += "\n";
	        }
	        if(compositeData.tema == ""){
				
	        	msg = "Nenhum tema foi selecionado";
	        	console.log(msg);
	        }
	        if(msgerro != ""){
	        	alert(msgerro);
	        	return false;
	        }
	        return compositeData;
	    }
        function getColumnIndexByRotulo(needle){
        	var seletores,seletor;
        	var seletorIndex;

        	var found;
        	var index;

        	var rotulos,rotulo;

        	rotulos = compositeData.rotulosFormatados;

            seletores = xtrTable.getElements("[data-colunaTitulo][data-colunaSeletor]");

            found = false;
            for(seletorIndex = 0; seletores.length > seletorIndex && !found; seletorIndex++){
                seletor = seletores[seletorIndex];
                rotulo = rotulos[seletorIndex];
                if(rotulo == needle){                  
                	index = seletor.getAttribute("data-colunaIndex");            
                    return index;
                }
            };
            return -1;
        } 
        function organize(){
        	if(compositeData.dado != "cronologica")
        		return;
        	var series,serie;

        	var valores;
        	var formatados;

        	var rotulos;
        	var rotulosFormatados;

        	var Ord;
        	var order,cloneOrder;

        	rotulos = compositeData.rotulos;
        	rotulosFormatados = compositeData.rotulosFormatados;
        	series = compositeData.series;

        	order = [];
        	rotulos.sort(function(a,b){
        		Ord = XtrGraficoUtil.compare(b,a);
        		order.push(Ord);
        		return Ord;
        	});
        	cloneOrder = XtrGraficoUtil.clone(order);
        	rotulosFormatados.sort(function(a,b){
        		return cloneOrder.shift();
        	});
        	for(serieIndex = 0; series.length > serieIndex; serieIndex++){
        		serie = series[serieIndex];
        		valores = serie.dados;
        		formatados = serie.dadosFormatados;

        		cloneOrder = XtrGraficoUtil.clone(order);
        		valores.sort(function(){
        			return cloneOrder.shift();
        		});

        		cloneOrder = XtrGraficoUtil.clone(order);
        		formatados.sort(function(){
        			return cloneOrder.shift();
        		});
        	}
        }
	    function evalInconsistencias(){
            var inconsistencias = compositeData.inconsistencias;
            if(inconsistencias){
                for(var incoIndex = 0; inconsistencias.length > incoIndex; incoIndex++){
                    var incosistencia = inconsistencias[incoIndex];
                    var serieIndex = incosistencia.serieIndex;
                    var rotulo = incosistencia.rotulo;
                    var dadoIndex = getColumnIndexByRotulo(rotulo);
                    if(dadoIndex){
                        var seletor = "td";
                        seletor += '[data-linhaIndex="'+serieIndex+'"]';
                        seletor += '[data-colunaIndex="'+dadoIndex+'"]';
                        var td = document.querySelector(seletor);
                        if(td){
                            td.className = classInconsistenciaLegend;
                        }
                    }
                }
            }
        }
        function evalPolados(){
            var polados,polado;
            var polatoType,poladoValue;
            var poladoIndex;

            var selector;

            var index;

            var tds,td;
            var tdIndex;

            polados = compositeData.polados;
            if(polados){
                for(poladoIndex = 0; poladoIndex < polados.length; poladoIndex++) {
                    polado = polados[poladoIndex];
                    poladoValue = polado.value;
                    poladoType = polado.type;
                    index = rotulos.indexOf(poladoValue);
                    if(inverted){
                    	selector = 'tbody > tr > td[data-linhaIndex="'+index+'"]';
                    }
                    else{
	                    selector = 'tbody > tr > td[data-colunaIndex="'+index+'"]';
                    }
                    tds = xtrTable.getElements(selector);
                    for(tdIndex = 0; tds.length > tdIndex; tdIndex++){
                        td = tds[tdIndex];
                        if(poladoType == "interpolacao"){
                            td.className = classInterpolateLegend;
                   		}
                        else{
                            td.className = classExtrapolateLegend;
                        }
                    }
                };
            }
        }
        function select(){
        	var selecionadoSeries,selecionadoSerie;
        	var selecionadoSerieIndex;
        	var selecionadoRotulos,selecionadoRotulo;
        	var selecionadoRotuloIndex;

        	var seletorRotulo,seletorSerie;

        	seletorRotulo = inverted ? "data-target-linhaIndex" : "data-target-colunaIndex";
        	seletorSerie = inverted ? "data-target-colunaIndex" : "data-target-linhaIndex";

        	selecionadoSeries = compositeData.selecionadoSeries;
        	selecionadoRotulos = compositeData.selecionadoRotulos;

        	if(XtrGraficoUtil.isset(selecionadoSeries)){
	        	for(selecionadoSerieIndex = 0; selecionadoSeries.length > selecionadoSerieIndex; selecionadoSerieIndex++){
	        		selecionadoSerie = selecionadoSeries[selecionadoSerieIndex];
	        		if(selecionadoSerie){
	        			selecionadoSerie = document.querySelector("["+seletorSerie+"='"+selecionadoSerieIndex+"']");
	        			if(selecionadoSerie != null){
	        				selecionadoSerie.click();
	        			}
	        		}
	        	};
	        }
	        if(XtrGraficoUtil.isset(selecionadoRotulos)){
				for(selecionadoRotuloIndex = 0; selecionadoRotulos.length > selecionadoRotuloIndex; selecionadoRotuloIndex++){
	        		selecionadoRotulo = selecionadoRotulos[selecionadoRotuloIndex];
	        		if(selecionadoRotulo){
	        			selecionadoRotulo = document.querySelector("["+seletorRotulo+"='"+selecionadoRotuloIndex+"']");
	        			if(selecionadoRotulo != null){
	        				selecionadoRotulo.click();
	        			}
	        		}        		
	        	};
	        }        	
        }
	//////////////////////
	//METODOS DE CLASSE //
	//////////////////////
		function paginadores(){

		    linhaObj = {
		        "index": 0,
		        "head": true
		    };
		    colunaObj = {
		    	"index": 0,
		    	"colspan": 100,
		    	"type": "th",
		    	"style": styleColumnPaginador
		    };    

		    div = document.createElement("div");
		    div.className = classPaginador;
		    div.id = xtrTable.getId()+"_paginasTop";
		    xtrTable.appendIn(linhaObj,colunaObj,div);

		    linhaObj = {
		        "index": inverted ? rotulos.length+2 : series.length+2,
		        "foot": true
		    };
		    colunaObj = {
		    	"index":0,
		    	"colspan": 100,
		    	"type": "th",
		        "foot": true,
		        "style": styleColumnPaginador
		    };    

		    div = document.createElement("div");
		    div.className = classPaginador;
		    div.id = xtrTable.getId()+"_paginasBottom";
		    xtrTable.appendIn(linhaObj,colunaObj,div);   
		}
	    function titulos(comPolacao){
		    linhaObj = {
		        "index": 1,
		        "head": true
		    };
		    colunaObj = {
		    	"index": 0,
		    	"type": "th",
		    	"class": classTableName,
		    	"style": styleTableName,
		    	"data-colunaTitulo": true,
		    	"data-linhaTitulo": true
		    };
		    xtrTable.appendIn(linhaObj,colunaObj,tableName);

		    for(rotuloIndex = 0; rotulos.length > rotuloIndex; rotuloIndex++){
				div = document.createElement("div");
				div.setAttribute("class",classGroupButtons);
				div = XtrGraficoUtil.setAttributes(div,styleGroupButtons);

		        rotulo = rotulos[rotuloIndex];
		        selectButtonObj = {
		            "content": rotulo,
		            "color": "default",
		            "style": styleRotulo,
		            "class": classRotulo,
		            "data-clicado":false,
		            "data-target-linhaIndex":rotuloIndex,
		            "onclick":function(){
		            	var clicado;

		            	clicado = this.getAttribute("data-clicado");
						clicado = eval(clicado);	

		            	selectorAction('linha',this); 

				        this.setAttribute("data-clicado",!clicado);

	                	if(clicado){
	                		this.mudarCor(this.corDefault);
	                	}
	                	else{
	                		this.mudarCor("inverse");
	                	}
		            }
		        };

		        extrapolateButtonObj = {
				    "content": inverted ? "<span class='fi-arrow-up' style='top:-.05em;position:relative'></span" : "e",
				    "data-ponto-extrapolacao": rotuloIndex,                               
				    "data-clicado":false,
				    "color": "vermelho",
				    "style": styleExtrapolate,
				    "class": classExtrapolate,
				    "onclick":function(){ 
				        extrapolateAction(this);
				    }
			    };
			    interpolateButtonObj = {
		            "content": inverted ? "<span class='fi-arrow-down' style='top:.35em;position:relative'></span" : "i",
		            "data-ponto-interpolacao": rotuloIndex+1,
		            "data-clicado": false,
		            "color": "azul",
		            "style": styleInterpolate,
		            "class": classInterpolate,
		            "onclick": function(){ 
	                    interpolateAction(this); 
		            }
		        };
		        if(comPolacao){
		        	if(rotuloIndex == 0){
		       			div.appendChild(XtrButao(extrapolateButtonObj));
	       			}     		
			        div.appendChild(XtrButao(selectButtonObj));
			        if(rotulos.length > rotuloIndex+1){
    			        div.appendChild(XtrButao(interpolateButtonObj));
    			    }
		        }
		        else{
		        	div.appendChild(XtrButao(selectButtonObj));
		        }

		        if(inverted){
			        linhaObj = {
			        	"index": rotuloIndex+2,
			        	"body": true
			    	};
			    }
			    else{
			    	linhaObj = {
			        	"index": 1,
			        	"head": true
			    	}
			    }
		        if(inverted){
		        	colunaObj = {
			            "index": inverted ? 1 : rotuloIndex+1,
			            "type":"th",
			            "width": widthColumnTitleRotulo,
			            "style": styleColumnTitleRotulo,
			    		"data-linhaTitulo": true,
			    		"data-linhaSeletor": true,
			            "data-colunaAtiva": true,
			            "data-linhaAtiva": true
			        };
		        }
		        else{
			        colunaObj = {
			            "index": inverted ? 1 : rotuloIndex+1,
			            "type":"th",
			            "width": widthColumnTitleRotulo,
			            "style": styleColumnTitleRotulo,
			    		"data-colunaTitulo": true,
			    		"data-colunaSeletor": true,
			            "data-colunaAtiva": true,
			            "data-linhaAtiva": true,

			            "data-colunaIndex": rotuloIndex,
			            "data-linhaIndex": 0
			        };
			    }

		        xtrTable.appendIn(linhaObj,colunaObj,div);
			};

			for(serieIndex = 0; series.length > serieIndex; serieIndex++){
		        serie = series[serieIndex];

		        valores = serie.dadosFormatados;
		        nome = serie.titulo;
		        //nome = XtrGraficoUtil.splitter(['Qtd de','Qtd'],nome,1)
		        //nome = nome.replace(" - "," ");
		        //nome = nome.replace("-"," ");
		        if(inverted){
		        	colunaObj = {
						"index": rotuloIndex,
						"data-colunaIndex": serieIndex,
				        "data-linhaIndex": 1,
						"type": "th",
			    		"data-colunaTitulo": true,
			    		"data-colunaSeletor": true,
						"width": widthColumnTitleSerie,
						"style": styleColumnTitleSerie
					};			            
		        }
		        else{
		        	colunaObj = {
						"index": 0,
						"type": "th",
			    		"data-linhaTitulo": true,
			    		"data-linhaSeletor": true,
						"width": widthColumnTitleSerie,
						"style": styleColumnTitleSerie
					}
		        }
				
		        linhaObj = {
		            "index": inverted ? 1 : serieIndex+2,
		            "body": true
		        };
	        	butaoObj = {
		            "content": nome,
		            "color": "default",
		            "class": classSerie,
		            "style": styleTitleSerie,
		            "data-clicado":false,
		            "data-target-colunaIndex":serieIndex,
		            "onclick":function(){
		            	var clicado;

		            	clicado = this.getAttribute("data-clicado");
						clicado = eval(clicado);	

	                	selectorAction('coluna',this);

				        this.setAttribute("data-clicado",!clicado);

	                	if(clicado){
	                		this.mudarCor(this.corDefault);
	                	}
	                	else{
	                		this.mudarCor("inverse");
	                	}
		            }
		        };

		        xtrTable.appendIn(linhaObj,colunaObj,XtrButao(butaoObj));
		    };

		    var xtrTooltip = new XtrTooltip("table_tooltip","baixo");
			xtrTooltip.addTrigger("[data-ponto-extrapolacao]",{
				content: "Extrapolar"
			});
			xtrTooltip.addTrigger("[data-ponto-interpolacao]",{
				content: "Interpolar"
			});
		}
		function conteudo(){
		    for(serieIndex = 0; series.length > serieIndex; serieIndex++){
		        serie = series[serieIndex];

		        valores = serie.dadosFormatados;
		        for(valorIndex = 0; valores.length > valorIndex; valorIndex++){
		            valor = valores[valorIndex];

			        linhaObj = {
			            "index": inverted ? valorIndex+2 : serieIndex+2,
			            "body": true
			        };
		            colunaObj = {
		                "index": inverted ? serieIndex : valorIndex+1,
		                "type":"td",
		                "width": widthColumn,
		                "data-colunaIndex": inverted ? serieIndex : valorIndex,
		                "data-linhaIndex": inverted ? valorIndex : serieIndex,
		                "data-colunaAtiva": true,
		                "data-linhaAtiva": true
		            };
		            xtrTable.appendIn(linhaObj,colunaObj,valor);
		        }                 
		    }
		}
		function restante(){
			var resto = inverted ? series.length : rotulos.length;
			
			while(resto % chunkSize != 0){
				var index;
				var maxIndex = inverted ? rotulos.length : series.length;
				for(index = 0; maxIndex >= index; index++){
					colunaObj = {
						"type": index==0 ? "th" : "td",
			            "index": inverted ? series.length : rotulos.length,
			            "data-colunaIndex": inverted ? series.length-1 : rotulos.length,
			            "data-linhaIndex": index > 0 ? index-1 : index,
			            "data-colunaAtiva": true,
			            "data-linhaAtiva": true,
			            "data-linhaRestante": true,
			            "data-colunaRestante": true,
			            "width": widthColumn
			        };
					linhaObj = {
						"index": index+1
					};

					xtrTable.appendIn(linhaObj,colunaObj,"");
				};
				resto++;
			}
		}
		function selects(){
			var dojo;
			var dojoTipos;
			var dojoTemas;

			var tipo,tema;

			var dojoTipoAtual;
			var dojoTemaAtual;

			var linhaObj;
			var colunaObj;

			var compositeDataOnCurrentChart;

			var selectTipo,selectTema;

			dojo = SuperModule(Object).getDojo();
	        dojoTipos = dojo.tipos;
	        dojoTemas = dojo.temas;

		    compositeDataOnCurrentChart = compositeDataHandler.current();

	        dojoTipos = dojoTipos.filter(function(item){
	            if(item.ativo)
	                return true;
	        });        
	        dojoTipos.sort(function(a,b){ 
	        	return XtrGraficoUtil.compare(a,b,"traducao.portuguesBr");
	        });   
	             
	        dojoTemas.sort(function(a,b){ 
	        	return XtrGraficoUtil.compare(a,b,"alias");
	        }); 

	        linhaObj = {
	        	"index": series.length + 33,
	        	"foot": true
	        };
	        colunaObj = {
	        	"index": 0,
	        	"style": styleSelects,
	        	"colspan": 222,
	        	"type": "th"
	        };
	        dojoTipoAtual = new SuperModule();
	        dojoTemaAtual = new SuperModule();

	        dojoTipoAtual = dojoTipoAtual.getDojoObject(compositeDataOnCurrentChart.tipo,"tipos"); 
	        dojoTemaAtual = dojoTemaAtual.getDojoObject(compositeDataOnCurrentChart.tema,"temas"); 
		    if(mesclando){		    	
	            dojoFusoes = new SuperModule();
	            dojoFusoes = dojoFusoes.getDojo("fusoes");
	            dojoTipos = dojoTipos.filter(function(dojoTipo){
	                if(!XtrGraficoUtil.isset(dojoTipoAtual))
	                	return false;
	                
	                var dojoFusao;
	                var dojoFusaoIndex;

	                var show,innerShow;

	                var categorias,categoria;
	                var categoriaIndex;

	                categorias = dojoTipoAtual.categoria;

	                show = false;
	                for(categoriaIndex = 0; categorias.length > categoriaIndex; categoriaIndex++){
	                    categoria = categorias[categoriaIndex]; 

	                    for(dojoFusaoIndex = 0; dojoFusoes.length > dojoFusaoIndex; dojoFusaoIndex++){
	                        dojoFusao = dojoFusoes[dojoFusaoIndex];
	                        innerShow = false;
	                        if(dojoFusao.de.indexOf(categoria) >= 0){
	                            innerShow = innerShow || dojoFusao.para.indexOf(dojoTipo.variavel) >= 0;
	                            innerShow = innerShow || dojoFusao.para.indexOf("all") >= 0;
	                            if(dojoFusao.exceto.indexOf(dojoTipo.variavel) >= 0
	                            || dojoFusao.exceto.indexOf("all") >= 0){
	                                innerShow = !innerShow;
	                            }
	                        }
	                        show = innerShow || show;
	                    };                                
	                };
	                return show;
	            });
		    }
	        else{
	        	tipo = XtrGraficoUtil.isset(dojoTipoAtual) ? dojoTipoAtual.ativo : false;
	        }
		    
		    tipo = tipo ? dojoTipoAtual.variavel : "";

		    tema = XtrGraficoUtil.isset(dojoTemaAtual) ? dojoTemaAtual.variavel : "";

		    selectTipostObj = {
	            "source": dojoTipos,
	            "value": tipo,
	            "search": true,
	            "id": tableId+"_tipo",
	            "data-id": "tipo&tema",
	            "property": {
	            	"content": "traducao.portuguesBr",
	           	 	"value": "variavel"
	           	},
	           	"circulo":{
	           		"source": ICONES_TIPOS,
	           		"on": "variavel"
	           	},
	            "title": "Tipo de Gráfico"
	        };
	        selectTemasObj = {	        	
	        	"source": dojoTemas,
	        	"value": tema,
	            "search": true,
	            "id": tableId+"_tema",
	            "data-id": "tipo&tema",
	            "property": {
	            	"content": "alias",
	           	 	"value": "variavel"
	           	},
	           	"onchange": refreshTheme,
	           	"circulo":{
	           		"source": ICONES_TEMAS,
	           		"on": "variavel",	           		
	           		"tag": "svg"
	           	},
	            "title": "Tema de Gráfico"
		    };
		    selectTipo = XtrDivSelect(xtrTable.getId()+"_tipo",selectTipostObj);
		    selectTema = XtrDivSelect(xtrTable.getId()+"_tema",selectTemasObj);

		    if(!mesclando){
		   		selectTipo.selecionarPorValor(compositeDataHandler.current().tipo);
		    }
		    selectTema.selecionarPorValor(compositeDataHandler.current().tema || xtrGrafico.Default.tema);

		    div = document.createElement("div");
		    div.className = classSelects;
		    div.appendChild(selectTipo);

		    if(hasDividerOnSelect){
			    divider = document.createElement("div");
			    divider.className = "divider";
		    	div.appendChild(divider);
		    }

		    div.appendChild(selectTema);

		    xtrTable.appendIn(linhaObj,colunaObj,div);
		}
		function butoes(){
			linhaObj = {
				"index": series.length+34,
				"foot": true
			}
			colunaObj = {
				"index": 0,
				"colspan": 222,
				"type": "th"
			}

			butaoGerarGrafico = {
		        "content": "Gerar Grafico",
		        "color": "roxo",
		        "class": classGenerateButton,
		        "onclick": function(){ 
		            generateAction(false,mesclando);
		        }
		    }
		    butaoInverterSelecao = {
	            "content": "Inverter Seleção",
	            "color": "inverse",
	            "onclick":function(){ 
                    action(true);
	            }
	        }
		    butaoLimparSelecao = {
	            "content": "Limpar Seleção",
	            "color": "default",
	            "onclick":function(){ 
                    action();
	            }
	        }
	        div = document.createElement("div");
	        div.className = classButtons;
	        div.appendChild(XtrButao(butaoInverterSelecao));

	        if(hasDividerOnButtons){
			    divider = document.createElement("div");
			    divider.className = "divider";
		    	div.appendChild(divider);
		    }

	        div.appendChild(XtrButao(butaoLimparSelecao));
	        xtrTable.appendIn(linhaObj,colunaObj,div);
	        linhaObj.index++;
	        xtrTable.appendIn(linhaObj,colunaObj,XtrButao(butaoGerarGrafico));
		}
		function make(evaluate){
			titulos(compositeData.dado == "cronologica");
			paginadores();
			conteudo();
			restante();
			selects();
			butoes();
			select();

			if(XtrGraficoUtil.isset(evaluate)){
				evalInconsistencias();
				evalPolados();
			}

            paginacaoScript[tableId] = new XtrPaginacaoScript(tableId,{
                "attribute": "data-colunaIndex",
                "chunkSize": chunkSize,
                "chunk": 0,
                "paginator":[tableId+"_paginasTop",tableId+"_paginasBottom"]
            });    
		}
}