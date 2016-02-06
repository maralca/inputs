function TableMaker(tableId,compositeData,chunkSize,mesclando){
	///////////////////////////
	//VARIAVEIS DE INSTANCIA //
	///////////////////////////
	    var splits;

	    var xtrTable;

	    var series,serie;
	    var serieNome;
	    var serieIndex;

	    var rotulos,rotulo;
	    var rotuloIndex;

	    var valores,valor;
	    var valorIndex;

	    var div;
    ///////////////
    //CONSTRUCAO //
    ///////////////

    	xtrTable = new XtrTable(tableId);

	    splits = ['Qtd de','Qtd'];

	    rotulos = compositeData.rotulos; 
	    series = compositeData.series;

	    organize();

	    mesclando = XtrGraficoUtil.isset(mesclando) ? mesclando : false;

	    tableName = mesclando ? "Novo Grafico" : "Adicionar Grafico";

	    classSerie = "";
	    classRotulo = "principal";
	    classExtrapolate = "";
	    classInterpolate = "";
	    classPaginador = "xtrGrupoButoes linear centralizado dobrado arredondado espacado";
	    classGroupButtons = "xtrGrupoButoes linear centralizado desigualmente distribuido";
	    classSelects = "xtrGrupoButoes linear centralizado espacado igualmente distribuido";
	    classButtons = "xtrGrupoButoes linear centralizado espacado igualmente distribuido";
	    classInconsistenciaLegend = "xtrAlert-amarelo";
	    classInterpolateLegend = "xtrAlert-azul";
	    classExtrapolateLegend = "xtrAlert-vermelho";

	    styleColumn = {};
	    styleColumnPaginador = {};
	    styleColumnGroupButtons = {};
	    styleColumnTitleRotulo = {}; 
	    styleColumnTitleSerie = {
	    	"text-align": "right"
	    };

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
		function interpolateAction(tableId,context){

            var alvo = context.getAttribute("data-ponto-interpolacao");
            var rotulos = compositeData.rotulos;                

            for (var serieIndex = 0; serieIndex < compositeData.series.length; serieIndex++){
                
                var newPoint = XtrNumerico.interpolate(compositeData,serieIndex,alvo,3);                    
                var valores = compositeData.series[serieIndex].dados;
                if(alvo-1 >= 0){
                    var inconsistencia = valores[alvo-1];
                }
                else{
                    var inconsistencia = valores[alvo+1];
                }                  

                var auxRotulo1 = rotulos[alvo];
                var auxRotulo2 = rotulos[alvo-1];
                
                var hasIncoSerie = XtrGraficoUtil.hasInObj(compositeData.inconsistencias,'serieIndex',serieIndex);
                var hasIncoRotulo1 = XtrGraficoUtil.hasInObj(compositeData.inconsistencias,'rotulo',auxRotulo1);
                var hasIncoRotulo2 = XtrGraficoUtil.hasInObj(compositeData.inconsistencias,'rotulo',auxRotulo2);

                var incoAcumulada = hasIncoSerie && (hasIncoRotulo1 || hasIncoRotulo2);

                if(newPoint.y < 0 || incoAcumulada){
                    newPoint.y = inconsistencia;
                    compositeData.inconsistencias.push({
                        "serie": serieIndex,
                        "rotulo": newPoint.x
                    });
                }
                compositeData.series[serieIndex].dados.splice(alvo,0,Math.round(newPoint.y));
                compositeData.polados.push({
                	"type": 'interpolacao', 
                	"value": newPoint.x
                });
            };
            if(newPoint)
                compositeData.rotulos.splice(alvo,0,newPoint.x); 

            nowYouSeeMeMore(context,tableId);                     
        }
		function extrapolateAction(tableId,context){

	        var alvo = context.getAttribute("data-ponto-extrapolacao");
	        var rotulos = compositeData.rotulos;

	        var inconsistencias,inconsistencia;
	        var incosistenciaAcumulada;
	        var incosistenciaNaSerie;
	        var incosistenciaNoRotulo;

	        var series,serie;
	        var serie;

	        var valores,valor;
	        var novoPonto;

	        var polados;

	        var rotulos,rotulo;

	        rotulos = compositeData.rotulos;
	        inconsistencias = compositeData.inconsistencias;
	        console.log(compositeData);
	        series = compositeData.series;
	        polados = compositeData.polados;

	        for(serieIndex = 0; series.length > serieIndex; serieIndex++){

	            novoPonto = XtrNumerico.extrapolate(compositeData,serieIndex,alvo,3);   

	            serie = series[serieIndex];                
	            valores = serie.dados; 

	            inconsistencia = valores[alvo];
	            rotulo = rotulos[alvo];

	            incosistenciaNaSerie = XtrGraficoUtil.hasInObj(inconsistencias,'serie',serieIndex);
	            incosistenciaNoRotulo = XtrGraficoUtil.hasInObj(inconsistencias,'rotulo',rotulo);

	            incosistenciaAcumulada = incosistenciaNaSerie && incosistenciaNoRotulo;
	            if(novoPonto.y < 0 || incosistenciaAcumulada){
	                novoPonto.y = inconsistencia;
	                compositeData.inconsistencias.push({
	                    "serie": serieIndex,
	                    "valor": novoPonto.x
	                });
	            }
	           	valores.splice(alvo,0,Math.round(novoPonto.y));
	            polados.push({
	            	"type": 'extrapolacao', 
	            	"value": novoPonto.x
	            });
	        };
	        if(novoPonto)
	            rotulos.splice(alvo,0,novoPonto.x); 

	        nowYouSeeMeMore(context,tableId);
	    }
	    function selectorAction(acao,context,classDefault){
	        var clicado = context.getAttr("data-clicado",true);

	        context.changeAttr("data-clicado",!clicado);
	        context.changeAttrWhen("class",{
	            "verdadeiro": "xtrButao xtrButao-inverse",
	            "falso": "xtrButao "+classDefault
	        },!clicado);

	        var targetIndex = context.getAttr('data-target-'+acao+'Index',true);

	        var cor = !clicado ? "rgba(34, 36, 38, 0.20)" : "";

	        objStyle = {};
	        objStyle['data-'+acao+'Ativa'] = clicado;
	        objStyle.style = {background: cor,color: cor};

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
	    function generateAction(isActive,mensage,mesclar){
	        var tds;
	       
	        var compilado = makeSelectedCompositeData(isActive,mesclar);
	        if(!compilado){
	            console.warn(mensage);
	            alert(mensage);
	            return;
	        }

	        sideBar.desactiveAll();

	        if(mesclar){
	            compositeDataHandler.save(compilado);
	            xtrTab.changeActiveAndCall('_xtr_tab_grafico_principal', function(){
	                mergeChartData(compositeDataHandler.load());                            
	            });

	        }
	        else{
	            compositeDataHandler.override(compilado)
	            xtrTab.changeActiveAndCall('_xtr_tab_grafico_principal', function(){                      
	                generateWithLoading(compositeDataHandler.current());
	            });
	        }
	    }
	    function makeSelectedCompositeData(isActive,mesclar){

	        var colunas,coluna;
	        var colunaIndex;

	        var linhas,linha;
	        var linhaIndex;

	        var removeColumnIndexes,removeColumnIndex;
	        var removeLineIndexes,removeLineIndex;

	        var indexSeeker;

	        var series,serie;
	        var rotulos,rotulo;

	        var selectTema,selectTipo;

	        compositeData = dataHandler.search("tabela",0);
	        compositeData = XtrGraficoUtil.clone(compositeData);
	        series = compositeData.series;
	        rotulos = compositeData.rotulos;

	        removeColumnIndexes = [];
	        removeLineIndexes = [];

	        isActive = !isActive;

	        console.info("selecionando Linhas e colunas",isActive);
	        colunas = xtrTable.getElements('tbody tr:first-child [data-colunaAtiva="'+isActive+'"]');
	        colunasRef = xtrTable.getElements('tbody tr:first-child [data-colunaAtiva]');
	        var alguma = colunasRef.length != colunas.length;
	        for(colunaIndex = 0; colunas.length > colunaIndex && alguma; colunaIndex++){
	            coluna = colunas[colunaIndex];
	            removeColumnIndex = coluna.getAttribute("data-colunaIndex");
	            removeColumnIndexes.push(removeColumnIndex);
	        };

	        linhas = xtrTable.getElements('tbody tr td:first-of-type[data-linhaAtiva="'+isActive+'"]');
	        for(linhaIndex = 0; linhas.length > linhaIndex; linhaIndex++){
	            linha = linhas[linhaIndex];
	            removeLineIndex = linha.getAttribute("data-linhaIndex");
	            removeLineIndexes.push(removeLineIndex);
	        };

	        console.info("selecao removeu",removeLineIndexes.length,"SERIES");
	        for(indexSeeker = 0; removeLineIndexes.length > indexSeeker; indexSeeker++){
	            removeLineIndex = removeLineIndexes[indexSeeker];
	            removeLineIndex = removeLineIndex - indexSeeker;
	            serie = series.splice(removeLineIndex,1)[0];
	            console.info("=>","(",indexSeeker+1,")",serie.titulo);
	        };
	        console.info("selecao removeu",removeColumnIndexes.length,"PONTOS");
	        for(indexSeeker = 0; removeColumnIndexes.length > indexSeeker; indexSeeker++){
	            removeColumnIndex = removeColumnIndexes[indexSeeker];
	            removeColumnIndex = removeColumnIndex - indexSeeker;
	            
	            for(serieIndex = 0; series.length > serieIndex; serieIndex++){
	                serie = series[serieIndex];
	                dados = serie.dados;
	                formatados = serie.dadosFormatados;

	                dados.splice(removeLineIndex,1); 
	                formatados.splice(removeLineIndex,1); 
	            };
	            rotulo = rotulos.splice(removeLineIndex,1);
	            console.info("=>","(",indexSeeker+1,")",rotulo);
	        };

	        if(!mesclar){
	            selectTema = document.getElementById(xtrTable.getId()+"_selectTema");
	            compositeData.tema = selectTema.value;
	        }

	        selectTipo = document.getElementById(xtrTable.getId()+"_selectTipo");

	        compositeData.tipo = selectTipo.value;
	        var notUse = rotulos.length < 1 || series.length < 1;
	        notUse = ["markersonly",""].indexOf(compositeData.tipo) >= 0 && series.length <=1 || notUse;

	        if(notUse){
	            return;
	        }
	        return compositeData;
	    }
        function getColumnIndexByRotulo(needle){
        	var seletores,seletor;
        	var seletorIndex;

        	var found;
        	var index;

        	var rotulos,rotulo;

        	rotulos = compositeData.rotulos;

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
        	var order,cloneOrder;

        	rotulos = compositeData.rotulos;
        	series = compositeData.series;

        	order = [];
        	rotulos.sort(function(a,b){
        		order.push(b > a);
        		return b > a;
        	});
        	cloneOrder = XtrGraficoUtil.clone(order);
        	for(serieIndex = 0; series.length > serieIndex; serieIndex++){
        		serie = series[serieIndex];
        		valores = serie.dados;
        		formatados = serie.dadosFormatados;
        		valores.sort(function(){
        			return order.unshift();
        		});
        		formatados.sort(function(){
        			return formatados.unshift();
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

                    index = getColumnIndexByRotulo(poladoValue);

                    selector = 'tbody > tr > td[data-colunaIndex="'+index+'"]';
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
		        "index": series.length+5,
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
		    	"data-colunaTitulo": true,
		    	"data-linhaTitulo": true,
		    	"style": styleColumnGroupButtons
		    };
		    xtrTable.appendIn(linhaObj,colunaObj,tableName);

		    for(rotuloIndex = 0; rotulos.length > rotuloIndex; rotuloIndex++){
				div = document.createElement("div");
				div.setAttribute("class",classGroupButtons);

		        rotulo = rotulos[rotuloIndex];

		        selectButtonObj = {
		            "content": rotulo,
		            "type": "default",
		            "class": classRotulo,
		            "data-clicado":false,
		            "data-target-colunaIndex":rotuloIndex,
		            "addEventListener":{
		                "event":"click",
		                "fn": function(context,classDefault){ 
		                    selectorAction('coluna',context,classDefault); 
		                }
		            }
		        };
		        extrapolateButtonObj = {
				    "content": "e",
				    "data-ponto-extrapolacao": rotuloIndex,                               
				    "data-clicado":false,
				    "type": "vermelho",
				    "class": classExtrapolate,
				    "addEventListener":{
				        "type": "click",
				        "fn": function(context){ 
				            extrapolateAction(tableId,context); 
				        }
				    }
			    };
			    interpolateButtonObj = {
		            "content": "i",
		            "data-ponto-interpolacao": rotuloIndex+1,
		            "data-clicado":false,
		            "type": "azul",
		            "class":classInterpolate,
		            "addEventListener":{
		                "type": "click",
		                "fn": function(context){ 
		                    interpolateAction(tableId,context); 
		                }
		            }
		        };
		        if(comPolacao){
		        	if(rotuloIndex == 0){
		       			div.appendChild(XtrButao(extrapolateButtonObj)._);
	       			}     		
			        div.appendChild(XtrButao(selectButtonObj)._);
			        if(rotulos.length > rotuloIndex+1){
    			        div.appendChild(XtrButao(interpolateButtonObj)._);
    			    }
		        }
		        else{
		        	div = XtrButao(selectButtonObj)._;
		        }
		        
		        colunaObj = {
		            "index":rotuloIndex+1,
		            "type":"th",
		            "data-colunaIndex": rotuloIndex,
		            "width": widthColumnTitleRotulo,
		            "style": styleColumnTitleRotulo,
		    		"data-colunaTitulo": true,
		    		"data-colunaSeletor": true,
		            "data-linhaIndex": 0,
		            "data-colunaAtiva": true,
		            "data-linhaAtiva": true
		        };

		        xtrTable.appendIn(linhaObj,colunaObj,div);
			};

			colunaObj = {
				"index":0,
				"type": "th",
	    		"data-linhaTitulo": true,
	    		"data-linhaSeletor": true,
				"width": widthColumnTitleSerie,
				"style": styleColumnTitleSerie
			};

			for(serieIndex = 0; series.length > serieIndex; serieIndex++){
		        serie = series[serieIndex];

		        valores = serie.dadosFormatados;
		        nome = serie.titulo;
		        nome = XtrGraficoUtil.splitter(splits,nome,1)
		        nome = nome.replace(" - "," ");
		        nome = nome.replace("-"," ");

		        linhaObj = {
		            "index": serieIndex+2,
		            "body": true
		        };
		        butaoObj = {
		            "content": nome,
		            "type": "default",
		            "class": classSerie,
		            "data-clicado":false,
		            "data-target-linhaIndex":serieIndex,
		            "addEventListener":{
		                "event":"click",
		                "fn": function(context,classDefault){
		                	selectorAction('linha',context,classDefault);
		                }
		            }
		        }

		        xtrTable.appendIn(linhaObj,colunaObj,XtrButao(butaoObj)._);
		    };    
		}
		function conteudo(){
		    colunaObj = {
		        "index":0,
		        "type":"th",
		        "style": styleColumn
		    };
		    for(serieIndex = 0; series.length > serieIndex; serieIndex++){
		        serie = series[serieIndex];

		        valores = serie.dadosFormatados;
		        linhaObj = {
		            "index": serieIndex+2,
		            "body": true
		        };
		        for(valorIndex = 0; valores.length > valorIndex; valorIndex++){
		            valor = valores[valorIndex]; 
		            colunaObj = {
		                "index":valorIndex+1,
		                "type":"td",
		                "width": widthColumn,
		                "data-colunaIndex": valorIndex,
		                "data-linhaIndex": serieIndex,
		                "data-colunaAtiva": true,
		                "data-linhaAtiva": true
		            };
		            xtrTable.appendIn(linhaObj,colunaObj,valor);
		        }                 
		    }
		}
		function restante(){
			restante = rotulos.length;
			colunaObj = {
	            "index": rotulos.length,
	            "data-colunaIndex": rotulos.length,
	            "data-colunaAtiva": true,
	            "data-linhaAtiva": true,
	            "width": widthColumn
	        };
			while(restante % chunkSize != 0){
				var serie;
				var serieIndex;
				for(serieIndex = 0; series.length >= serieIndex; serieIndex++){
					serie = series[serieIndex];
					colunaObj.linhaIndex = serieIndex;
					colunaObj.type = serieIndex==0 ? "th" : "td";
					linhaObj = {
						"index": serieIndex+1,
			            "data-colunaIndex": rotulos.length,
			            "data-linhaIndex": serieIndex,
			            "data-colunaAtiva": true,
			            "data-linhaAtiva": true
					};

					xtrTable.appendIn(linhaObj,colunaObj,"");
				};
				restante++;
			}
		}
		function selects(){
			var dojo;
			var dojoTipos;
			var dojoTemas;

			var compositeDataOnCurrentChart;

			dojo = SuperModule(Object).getDojo();
	        dojoTipos = dojo.tipos;
	        dojoTemas = dojo.temas;

		    compositeDataOnCurrentChart = compositeDataHandler.current();

	        dojoTipos = dojoTipos.filter(function(item){
	            if(item.ativo)
	                return true;
	        });        
	        dojoTipos.sort(function(a,b){ 
	        	return a.traducao.portuguesBr > b.traducao.portuguesBr; 
	        });   
	             
	        dojoTemas.sort(function(a,b){ 
	        	return a.alias > b.alias; 
	        }); 

	        linhaObj = {
	        	"index": series.length + 3,
	        	"foot": true
	        };
	        colunaObj = {
	        	"index": 0,
	        	"colspan": 222,
	        	"type": "th"
	        };
	        
		    selectTipostObj = {
	        	"value": compositeData.tipo,
	            "optionContent": dojoTipos,
	            "optionPropContent": "traducao.portuguesBr",
	            "optionPropValue": "variavel",
	            "id": xtrTable.getId()+"_selectTipo",
	            "title": "Tipo de Grafico",
	            "titleOrder": "left"
	        };
	        selectTemasObj = {
	        	"value": compositeData.tema,
		        "optionContent": dojoTemas,
		        "optionPropContent": "alias",
		        "optionPropValue": "variavel",
		        "id": xtrTable.getId()+"_selectTema",
		        "title": "Tema do Grafico",
		        "titleOrder": "right"
		    };
		    if(mesclando){
		    	console.log(compositeDataOnCurrentChart);
		    	dojoTipoAtual = SuperModule().getDojoObject(compositeDataOnCurrentChart.tipo,"tipos"); 
	            dojoFusoes = SuperModule().getDojo("fusoes");
	            console.log(dojoFusoes);
	            dojoTipos = dojoTipos.filter(function(value){
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
	                            innerShow = innerShow || dojoFusao.para.indexOf(value.variavel) >= 0;
	                            innerShow = innerShow || dojoFusao.para.indexOf("all") >= 0;
	                            if(dojoFusao.exceto.indexOf(value.variavel) >= 0
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

		    

		    div = document.createElement("div");
		    div.className = classSelects;
		    div.appendChild(XtrSelect(selectTipostObj));

		    if(hasDividerOnSelect){
			    divider = document.createElement("div");
			    divider.className = "divider";
		    	div.appendChild(divider);
		    }

		    div.appendChild(XtrSelect(selectTemasObj));

		    xtrTable.appendIn(linhaObj,colunaObj,div);
		}
		function butoes(){
			linhaObj = {
				"index": series.length+4,
				"foot": true
			}
			colunaObj = {
				"index": 0,
				"colspan": 222,
				"type": "th"
			}

			butaoSelecionadsObj = {
		        "content": "Selecionados",
		        "type": "inverse",
		        "addEventListener":{
		            "event":"click",
		            "fn": function(){ 
		                generateAction(false,mesclando,"Pelo menos uma serie deve estar selecionada");
		            }
		        }
		    }
		    butaoNaoSelecionadosObj = {
	            "content": "Não selecionados",
	            "type": "default",
	            "addEventListener":{
	                "event":"click",
	                "fn": function(){ 
	                    generateAction(true,mesclando,"Pelo menos umas serie não deve estar selecionada");
	                }
	            }
	        }
	        div = document.createElement("div");
	        div.className = classButtons;
	        div.appendChild(XtrButao(butaoSelecionadsObj)._);

	        if(hasDividerOnButtons){
			    divider = document.createElement("div");
			    divider.className = "divider";
		    	div.appendChild(divider);
		    }

	        div.appendChild(XtrButao(butaoNaoSelecionadosObj)._);

	        xtrTable.appendIn(linhaObj,colunaObj,div);
		}
		function make(evaluate){
			titulos(true);
			paginadores();
			conteudo();
			restante();
			selects();
			butoes();
			if(XtrGraficoUtil.isset(evaluate)){
				evalInconsistencias();
				evalPolados();
			}
		}
}