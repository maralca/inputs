function TableMaker(xtrTable,compositeData,chunkSize,mesclando){
    var splits;

    var series,serie;
    var serieNome;
    var serieIndex;

    var rotulos,rotulo;
    var rotuloIndex;

    var valores,valor;
    var valorIndex;

    var div;

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

	titulos();
	paginadores();
	conteudo();
	restante();
	selects();
	butoes();
	
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
	                generateAction(xtrTable,false,"ao menos uma serie não deve estar selecionada",mesclando);
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
                    generateAction(xtrTable,true,"ao menos uma serie deve estar selecionada",mesclando);
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