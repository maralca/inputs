function XtrButao(kwargs){
	var cor;
	var conteudo;
	var onclick;
	var onchange;
	var onmouseover;
	var onmouseout;
	var className;

	var property,innerProperty;
	var value,innerValue;

	var excecoes;

	excecoes = [];

	if(!XtrGraficoUtil.isobj(kwargs)){
		kwargs = {
			conteudo: kwargs
		};
	}

	cor = kwargs.color || kwargs.cor || "default";
	excecoes.push("color","cor");

	conteudo = kwargs.content || kwargs.conteudo;
	excecoes.push("conteudo","content");

	onclick = kwargs.onclick || kwargs.click;
	excecoes.push("onclick","click");

	onchange = kwargs.onchange || kwargs.change;
	excecoes.push("onchange","change");

	onmouseover = kwargs.onmouseover || kwargs.hover || kwargs.mouseover;
	excecoes.push("onmouseover","hover","mouseover");

	onmouseout = kwargs.onmouseout || kwargs.mouseout;
	excecoes.push("onmouseout","mouseout");

	className = kwargs["class"] || kwargs.className || "";
	excecoes.push("class","className");

	style = kwargs.style || {};
	excecoes.push("style");

	butao = document.createElement("div");
	butao.setAttribute("class","xtr butao "+cor+" "+className);

	butao.innerHTML = conteudo;

	XtrGraficoUtil.setAttributes(butao,kwargs,excecoes);
	XtrGraficoUtil.setStyle(butao,style);
	XtrGraficoUtil.setListener(butao,onclick,"click");
	XtrGraficoUtil.setListener(butao,onchange,"change");
	XtrGraficoUtil.setListener(butao,onmouseover,"mouseover");
	XtrGraficoUtil.setListener(butao,onmouseout,"mouseout");

	XtrButao.desativar = desativar;
	XtrButao.ativar = ativar;
	XtrButao.mudarCor = mudarCor;

	butao.ativar = autoAtivar;
	butao.desativar = autoDesativar;
	butao.mudarCor = autoMudarCor;
	butao.cor = cor;

	butao.corDefault = cor;	
	butao.classDefault = butao.className;

	return butao;

	function desativar(butao){
		XtrGraficoUtil.removeClass(butao,"ativo");

		XtrGraficoUtil.removeClass(butao,"ativa");
	}
	function ativar(butao){
		desativar(butao);
		butao.className += " ativo";
	}
	function mudarCor(butao,novaCor){
		XtrGraficoUtil.removeClass(butao,butao.cor);
		XtrGraficoUtil.addClass(butao,novaCor);

		butao.cor = novaCor;
	}
	function autoAtivar(){
		ativar(this);
	}
	function autoDesativar(){
		desativar(this);
	}
	function autoMudarCor(novaCor){
		
		XtrGraficoUtil.removeClass(this,this.cor);
		XtrGraficoUtil.addClass(this,novaCor);

		this.cor = novaCor;
	}
}