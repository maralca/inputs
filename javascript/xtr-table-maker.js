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

	    var paginacaoScript;
    ///////////////
    //CONSTRUCAO //
    ///////////////

    	xtrTable = new XtrTable(tableId);

    	paginacaoScript = {};

	    splits = ['Qtd de','Qtd'];

	    rotulos = compositeData.rotulos; 
	    series = compositeData.series;

	    organize();

	    mesclando = XtrGraficoUtil.isset(mesclando) ? mesclando : false;

	    tableName = mesclando ? "Mesclando" : "Criando";

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

	    styleTableName = {
	    	"opacity": ".65",
	    	"text-align": "center"
	    };
	    styleColumn = {};
	    styleColumnPaginador = {};
	    styleColumnGroupButtons = {};
	    styleColumnTitleRotulo = {}; 
	    styleColumnTitleSerie = {
	    	"text-align": "right"
	    };
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

                rotulo1 = rotulos[alvo];
                rotulo2 = rotulos[alvo-1];
                
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
            if(series.length > 0)
                rotulos.splice(alvo,0,novoPonto.x); 

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
	            rotulo = rotulos[alvo];

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

	        objStyle = {
	        	["data-"+acao+"Ativa"]: clicado,
	        	"style": {
	        		"background": cor,
	        		"color": cor
	        	}
	        };

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
	       var selectedCompositeData

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
		            compositeDataHandler.override(selectedCompositeData)
		            xtrTab.mostrarAtivarChamar('tab_exibir', function(){                      
		                generateWithLoading(compositeDataHandler.current());
		            });
		        }
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

	        var msgerro,msg;

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
	        console.log(colunasRef.length,colunas.length);
	        for(colunaIndex = 0; colunas.length > colunaIndex && alguma; colunaIndex++){
	            coluna = colunas[colunaIndex];
	            removeColumnIndex = coluna.getAttribute("data-colunaIndex");
	            if(removeColumnIndexes.indexOf(removeColumnIndex) < 0){
	            	removeColumnIndexes.push(removeColumnIndex);
	            }
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

	                dados.splice(removeColumnIndex,1); 
	                formatados.splice(removeColumnIndex,1); 
	            };
	            rotulo = rotulos.splice(removeColumnIndex,1);
	            console.info("=>","(",indexSeeker+1,")",rotulo);
	        };
	        if(!mesclar){
	            selectTema = document.getElementById("input_"+xtrTable.getId()+"_tema");
	            compositeData.tema = selectTema.value;
	        }

	        selectTipo = document.getElementById("input_"+xtrTable.getId()+"_tipo");

	        msgerro = "";

	        compositeData.tipo = selectTipo.value;
	        if(rotulos.length < 1){

	        	msg = isActive ? "deve estar selecionado" : "não deve estar selecionado";
	        	msg = "Pelo menos um ponto " + msg;
	        	console.log(msg);

				msgerro += msg;
				msgerro += "\n";
	    	}
	        if(series.length < 1){

	        	msg = isActive ? "deve estar selecionada" : "não deve estar selecionada";
	        	msg = "Pelo menos uma serie " + msg;
	        	console.log(msg);

				msgerro += msg;
				msgerro += "\n";
	        }
	        if("markersonly" == compositeData.tipo && series.length < 2){

	        	msg = "Grafico de Disperão deve ter pelo menos duas series selecionadas";
	        	console.log(msg);

				msgerro += msg;
				msgerro += "\n";       		
	       	}
	       	if("bubles" == compositeData.tipo && series.length < 2){

	       		msg = "Grafico de Bolhas deve ter pelo menos duas series selecionadas";
	       		console.log(msg);

	       		msgerro += msg;
	       		msgerro += "\n";       		
	       	}
	       	if(["lines","stackedlines"].indexOf(compositeData.tipo) >= 0 && rotulos.length < 2){
	       		msg = "Grafico de Linhas deve ter pelo menos dois pontos selecionados";
	       		console.log(msg);

	       		msgerro += msg;
	       		msgerro += "\n";
	       	}
	        if(compositeData.tipo == ""){

	        	msg = "Algum tipo deve ser selecionado";
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
		    	"class": classTableName,
		    	"style": styleTableName,
		    	"data-colunaTitulo": true,
		    	"data-linhaTitulo": true
		    };
		    xtrTable.appendIn(linhaObj,colunaObj,tableName);

		    for(rotuloIndex = 0; rotulos.length > rotuloIndex; rotuloIndex++){
				div = document.createElement("div");
				div.setAttribute("class",classGroupButtons);

		        rotulo = rotulos[rotuloIndex];

		        selectButtonObj = {
		            "content": rotulo,
		            "color": "default",
		            "class": classRotulo,
		            "data-clicado":false,
		            "data-target-colunaIndex":rotuloIndex,
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
		        extrapolateButtonObj = {
				    "content": "e",
				    "data-ponto-extrapolacao": rotuloIndex,                               
				    "data-clicado":false,
				    "color": "vermelho",
				    "class": classExtrapolate,
				    "onclick":function(){ 
				        extrapolateAction(this);
				    }
			    };
			    interpolateButtonObj = {
		            "content": "i",
		            "data-ponto-interpolacao": rotuloIndex+1,
		            "data-clicado": false,
		            "color": "azul",
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
		        	div = XtrButao(selectButtonObj);
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
		            "color": "default",
		            "class": classSerie,
		            "data-clicado":false,
		            "data-target-linhaIndex":serieIndex,
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
		        }

		        xtrTable.appendIn(linhaObj,colunaObj,XtrButao(butaoObj));
		    };    
		}
		function tooltips(){
			var xtrTooltip;

			xtrTooltip = new XtrTooltip("table_tooltip","baixo");
			xtrTooltip.addTrigger("[data-ponto-extrapolacao]",{
				content: "Extrapolar"
			});
			xtrTooltip.addTrigger("[data-ponto-interpolacao]",{
				content: "Interpolar"
			});
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
	        	"style": styleSelects,
	        	"colspan": 222,
	        	"type": "th"
	        };
	        dojoTipoAtual = SuperModule().getDojoObject(compositeDataOnCurrentChart.tipo,"tipos"); 
	        dojoTemaAtual = SuperModule().getDojoObject(compositeDataOnCurrentChart.tema,"temas"); 
		    if(mesclando){		    	
	            dojoFusoes = SuperModule().getDojo("fusoes");
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
	        
		    tipo = XtrGraficoUtil.isset(dojoTipoAtual) ? dojoTipoAtual.ativo : false;
		    tipo = tipo ? dojoTipoAtual.variavel : "";

		    tema = XtrGraficoUtil.isset(dojoTemaAtual) ? dojoTemaAtual.variavel : "";

		    selectTipostObj = {
	            "source": dojoTipos,
	            "value": tipo,
	            "search": true,
	            "data-id": "tipo&tema",
	            "property": {
	            	"content": "traducao.portuguesBr",
	           	 	"value": "variavel"
	           	},
	           	"circulo":{
	           		"source": ICONES_TIPOS,
	           		"on": "variavel"
	           	},
	            "title": "Tipo de Grafico"
	        };
	        selectTemasObj = {	        	
	        	"source": dojoTemas,
	        	"value": tema,
	            "search": true,
	            "data-id": "tipo&tema",
	            "property": {
	            	"content": "alias",
	           	 	"value": "variavel"
	           	},
	           	"circulo":{
	           		"source": ICONES_TEMAS,
	           		"on": "variavel",	           		
	           		"tag": "svg"
	           	},
	            "title": "Tema de Grafico"
		    };
		    selectTipo = XtrDivSelect(xtrTable.getId()+"_tipo",selectTipostObj);
		    selectTema = XtrDivSelect(xtrTable.getId()+"_tema",selectTemasObj);

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
		        "color": "inverse",
		        "onclick": function(){ 
		            generateAction(false,mesclando);
		        }
		    }
		    butaoNaoSelecionadosObj = {
	            "content": "Não selecionados",
	            "color": "default",
	            "onclick":function(){ 
                    generateAction(true,mesclando);
	            }
	        }
	        div = document.createElement("div");
	        div.className = classButtons;
	        div.appendChild(XtrButao(butaoSelecionadsObj));

	        if(hasDividerOnButtons){
			    divider = document.createElement("div");
			    divider.className = "divider";
		    	div.appendChild(divider);
		    }

	        div.appendChild(XtrButao(butaoNaoSelecionadosObj));

	        xtrTable.appendIn(linhaObj,colunaObj,div);
		}
		function make(evaluate){
			titulos(true);
			paginadores();
			conteudo();
			tooltips();
			restante();
			selects();
			butoes();
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