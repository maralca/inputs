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

    	xtrTable = new XtrTable(tableId)

	    splits = ['Qtd de','Qtd'];

	    rotulos = compositeData.rotulos; 
	    series = compositeData.series;

	    mesclando = XtrGraficoUtil.isset(mesclando) ? mesclando : false;

	    tableName = mesclando ? "Novo Grafico" : "Adicionar Grafico";

	    classSerie = "fluid";
	    classRotulo = "";
	    classExtrapolate = "";
	    classInterpolate = "";
	    classPaginador = "flexbox justify-center xtrGrupoButoes dobro arredondado espacado";
	    classGroupButtons = "xtrGrupoButoes inline flexbox justify-center";
	    classSelects = "xtrGrupoButoes inline";
	    classButtons = "xtrGrupoButoes inline espacado flexbox justify-center";

	    widthColumn = 100/(chunkSize+1) + "%";
	    widthColumnTitle = 100/(chunkSize+1) + "%";

	    this.titulos=titulos;
	    this.paginadores=paginadores;
	    this.conteudo=conteudo;
	    this.restante=restante;
	    this.selects=selects;
	    this.butoes=butoes;

	    return this;

	/////////////////////
	//METODOS PROPRIOS //
	/////////////////////
		function extrapolateAction(tableId,context,compositeData){

        xtrAble.disable('pontosInterpolacao');

        var alvo = context.getAttribute("data-ponto-extrapolacao");
        var pontos = document.getElementById(tableId+"_pontosInterpolacao").value;
        var rotulos = compositeData.rotulos;

        for (var serieIndex = 0; serieIndex < compositeData.series.length; serieIndex++){
            var newPoint = XtrNumerico.extrapolate(compositeData,serieIndex,alvo,pontos);                    
            var valores = compositeData.series[serieIndex].dados; 

            var inconsistencia = valores[alvo];

            var auxRotulo = rotulos[alvo];
            function hasInObj(array,prop,needle){
                for (var index = 0; index < array.length; index++) {
                    var obj = array[index];
                    if(obj[prop] == needle)
                        return true;
                }
                return false;
            }
            var hasIncoSerie = hasInObj(compositeData.incosistencias,'serieIndex',serieIndex);
            var hasIncoRotulo = hasInObj(compositeData.incosistencias,'rotulo',auxRotulo);

            var incoAcumulada = hasIncoSerie && hasIncoRotulo;
            if(newPoint.y < 0 || incoAcumulada){
                newPoint.y = inconsistencia;
                compositeData.incosistencias.push({
                    serieIndex: serieIndex,
                    rotulo: newPoint.x,
                });
            }
            compositeData.series[serieIndex].dados.splice(alvo,0,Math.round(newPoint.y));
            compositeData.polados.push({type: 'extrapolacao', indexName: newPoint.x});
        };
        if(newPoint)
            compositeData.rotulos.splice(alvo,0,newPoint.x); 

        nowYouSeeMeMore(context,tableId);
	    }
	    function selectorAction(xtrTable,acao,context,classDefault){
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
	    function generateAction(xtrTable,isActive,mensage,mesclar){
	        var tds;
	       
	        var compilado = makeSelectedCompositeData(xtrTable,isActive,mesclar);
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
	    function makeSelectedCompositeData(xtrTable,isActive,mesclar){

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
	//////////////////////
	//METODOS DE CLASSE //
	//////////////////////
		function paginadores(){

		    linhaObj = {
		        index:0,
		        head:true
		    };
		    colunaObj = {
		    	index:0,
		    	"colspan": 100,
		    	type:"th"
		    };    

		    div = document.createElement("div");
		    div.className = classPaginador;
		    div.id = xtrTable.getId()+"_paginasTop";
		    xtrTable.appendIn(linhaObj,colunaObj,div);

		    linhaObj = {
		        index:series.length+5,
		        foot: true
		    };
		    colunaObj = {
		    	index:0,
		    	"colspan": 100,
		    	type:"th",
		        foot:true
		    };    

		    div = document.createElement("div");
		    div.className = classPaginador;
		    div.id = xtrTable.getId()+"_paginasBottom";
		    xtrTable.appendIn(linhaObj,colunaObj,div);   
		}
	    function titulos(){

		    linhaObj = {
		        index:1,
		        head:true
		    };
		    colunaObj = {
		    	index:0,
		    	type:"th"
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
		                    selectorAction(xtrTable,'coluna',context,classDefault); 
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
				            extrapolateAction(tableId,context,compositeData); 
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
		                    interpolateAction(tableId,context,compositeData); 
		                }
		            }
		        };

		        div.appendChild(XtrButao(extrapolateButtonObj)._);
		        div.appendChild(XtrButao(selectButtonObj)._);
		        div.appendChild(XtrButao(interpolateButtonObj)._);
		        
		        colunaObj = {
		            index:rotuloIndex+1,
		            type:"th",
		            "data-colunaIndex": rotuloIndex,
		            "width": widthColumnTitle,
		            "data-linhaIndex": 0,
		            "data-colunaAtiva": true,
		            "data-linhaAtiva": true
		        };

		        xtrTable.appendIn(linhaObj,colunaObj,div);
			};

			colunaObj = {
				"index":0,
				"type": "th",
				"width": widthColumnTitle
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
		                	selectorAction(xtrTable,'linha',context,classDefault);
		                }
		            }
		        }

		        xtrTable.appendIn(linhaObj,colunaObj,XtrButao(butaoObj)._);
		    };    
		}
		function conteudo(){
		    colunaObj = {
		        index:0,
		        type:"th"
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
	        	index: series.length + 3,
	        	foot: true
	        };
	        colunaObj = {
	        	index: 0,
	        	colspan: 999,
	        	type: "th"
	        };
	        
		    selectTipostObj = {
	        	"value": compositeData.tipo,
	            "optionContent": dojoTipos,
	            "optionPropContent": "traducao.portuguesBr",
	            "optionPropValue": "variavel",
	            "id": xtrTable.getId()+"_selectTipo"
	        };
	        selectTemasObj = {
	        	"value": compositeData.tema,
		        "optionContent": dojoTemas,
		        "optionPropContent": "alias",
		        "optionPropValue": "variavel",
		        "id": xtrTable.getId()+"_selectTema"
		    };
		    if(mesclando){
		    	console.log(compositeDataOnCurrentChart);
		    	dojoTipoAtual = SuperModule().getDojoObject(compositeDataOnCurrentChart.tipo,"tipos"); 
	            dojoFusoes = SuperModule().getDojo("fusoes");
	            dojoTipos = dojoTipos.filter(function(value){
	                var dojoFusoes,dojoFusao;
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
				"colspan": 999,
				"type": "th"
			}

			butaoSelecionadsObj = {
		        "content": "Selecionados",
		        "type": "inverse",
	            "style": {
	            	width: "50%"
	            },
		        "addEventListener":{
		            "event":"click",
		            fn: function(){ 
		                generateAction(xtrTable,false,mesclando,"Pelo menos uma serie deve estar selecionada");
		            }
		        }
		    }
		    butaoNaoSelecionadosObj = {
	            "content": "Não selecionados",
	            "type": "default",
	            "style": {
	            	"width": "50%"
	            },
	            "addEventListener":{
	                "event":"click",
	                "fn": function(){ 
	                    generateAction(xtrTable,true,mesclando,"Pelo menos umas serie não deve estar selecionada");
	                }
	            }
	        }
	        div = document.createElement("div");
	        div.className = classButtons;
	        div.appendChild(XtrButao(butaoSelecionadsObj)._);
	        div.appendChild(XtrButao(butaoNaoSelecionadosObj)._);

	        xtrTable.appendIn(linhaObj,colunaObj,div);
		}
}