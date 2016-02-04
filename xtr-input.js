function XtrAble(){
	var ables;

	ables = {};

	function disable(id,hide){
		var element;

		element = document.getElementById(id);

		if(element == null){
			console.warn("XtrAble",disable,"didn't find any element with id:",id);
			return;
		}
		if(XtrGraficoUtil.isset(hide) ? hide : false){
			element.style.setProperty("display","none","important");
		}
		element.setAttribute("disabled",true);

		ables[id] = false;
	}

	function enable(id,show){
		var element;

		element = document.getElementById(id);

		if(element == null){
			console.warn("XtrAble",enable,"didn't find any element with id:",id);
			return;
		}
		if(XtrGraficoUtil.isset(show) ? show : false){
			element.style.setProperty("display","block","important");
			console.log(element);
		}

		element.removeAttribute("disabled");
		
		ables[id] = true;
	}

	function isEnable(id){
		return XtrGraficoUtil.isset(ables[id]) ? ables[id] : true;
	}

	function click(){
        document.getElementById(id).click();
	}

	this.enable = enable;
	this.disable = disable;
	this.isEnable = isEnable;
	this.click = click;

	return this;
}