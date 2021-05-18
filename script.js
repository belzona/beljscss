jQuery( function( $ ) {
/* breadcrumb */
	if($(".single-belzona_report").length || $(".single-testing_report").length || $(".single-approval").length || $(".single-system_leaflet").length){
		$("#menu-item-77").addClass("current-menu-ancestor current-menu-parent");
	}
	if($(".single-literature").length){
		$("#menu-item-615").addClass("current-menu-ancestor current-menu-parent");
	}
	if($(".single-product_information").length){
		$("#menu-item-95").addClass("current-menu-ancestor current-menu-parent");
	}
	/* languages for product documentation */
	if($(".single-product_information").length){
		var belapiurl = $("#belapiurl").text();
		var prod = $("#prod_number").val();
		$.getJSON( belapiurl + "?langs=all", function(data) {
			 var items = [];
			 items.push( "<option value=\"\">Language</option>" );
			 $.each( data, function( key, val ) {
				items.push( "<option class=\"wp-exclude-emoji\" value=\"" + val.iso_code + "\">" + val.iso_flags[0].em_flag + "&nbsp;&nbsp;" + val.doc_language + "</option>" );
			  });
			  /* load languages into select element */
			  $("#docs-lang-select").html(items.join( "" ));  
		});
		$("#docs-lang-select").change(function(){
			$.fn.get_docs($(this).val(), prod);
		});
	}
	/* languages for product documentation */

	/* function to load documents accordion */
	$.fn.get_docs = function(iso, prod)
	{
		$("#docs-downloads").html("Loading documents...");
		$(".elementor-widget-accordion").css("display", "block");
		var api_url = belapiurl + "?prod=" + prod + "&dlang=" + iso;
		$.getJSON( api_url, function(data) {
			var docprim = "";
			var docs = [];
			/* loop through the documents */
			$.each(data, function(key,val){
				if(val.iso_code == iso && val.formulation_number){
					if(val.is_primary == true){
						docprim = "primary-fn";
					} else { docprim = ""; }
					docs.push("<div id=\"" + docprim + "\" class=\"fn-box elementor-element elementor-widget elementor-widget-accordion\"><div class=\"elementor-widget-container\"><div class=\"elementor-accordion\"><div class=\"elementor-accordion-item\"><div class=\"elementor-tab-title " + docprim + "\"><a class=\"elementor-accordion-title fn-title\">FN" + val.formulation_number + "</a></div><div class=\"elementor-tab-content elementor-clearfix elementor-active elementor-widget-icon-list\" style=\"display: block;\"><ul clas=\"elementor-icon-list-items\">");
					if(val.PF){
						docs.push("<li class=\"elementor-icon-list-item\"><a target=\"_new\" href=\"" + val.PF[0].doc_url + "\" download=\"" + val.formulation_number + "-pf.pdf\"><span class=\"elementor-icon-list-icon\"><i aria-hidden=\"true\" class=\"fas fa-file-pdf\"></i></span><span class=\"elementor-icon-list-text\">Flyer</span></a><small>" + val.PF[0].doc_date + "</small></li>");
					}
					if(val.IF){
						docs.push("<li class=\"elementor-icon-list-item\"><a target=\"_new\" href=\"" + val.IF[0].doc_url + "\" download=\"" + val.formulation_number + "-ifu.pdf\"><span class=\"elementor-icon-list-icon\"><i aria-hidden=\"true\" class=\"fas fa-lightbulb\"></i></span><span class=\"elementor-icon-list-text\">IFU</span></a><small>" + val.IF[0].doc_date + "</small></li>");
					}
					if(val.PSS){
						docs.push("<li class=\"elementor-icon-list-item\"><a target=\"_new\" href=\"" + val.PSS[0].doc_url + "\" download=\"" + val.formulation_number + "-pss.pdf\"><span class=\"elementor-icon-list-icon\"><i aria-hidden=\"true\" class=\"fas fa-flask\"></i></span><span class=\"elementor-icon-list-text\">PSS</span></a><small>" + val.PSS[0].doc_date + "</small></li>");
					}
					if(val.CR){
						docs.push("<li class=\"elementor-icon-list-item\"><a target=\"_new\" href=\"" + val.CR[0].doc_url + "\" download=\"" + val.formulation_number + "-crc.pdf\"><span class=\"elementor-icon-list-icon\"><i aria-hidden=\"true\" class=\"fas fa-vial\"></i></span><span class=\"elementor-icon-list-text\">CRC</span></a><small>" + val.CR[0].doc_date + "</small></li>");
					}
					if(val.SD){
						$.each(val.SD, function(k,v){
							docs.push("<li class=\"elementor-icon-list-item\"><a target=\"_new\" href=\"" + v.doc_url + "\" download=\"" + val.formulation_number + "-sds.pdf\"><span class=\"elementor-icon-list-icon\"><i aria-hidden=\"true\" class=\"fas fa-exclamation-triangle\"></i></span><span class=\"elementor-icon-list-text\">" + v.doc_name + "</span></a><small>" + v.doc_date + "</small></li>");
						});
					}
					docs.push("</div></div></div></div></div></ul>");
				}
			});
			$("#docs-downloads").html(docs.join(""));
		});
		setTimeout(function(){ 
			$("#primary-fn").detach().prependTo("#docs-downloads"); 
		}, 1000);
		
	}
	/* function to load documents accordion */
	
	/* delete cookies function */
	$.fn.del_cookies = function () {
    		var cookies = document.cookie.split("; ");
    		for (var c = 0; c < cookies.length; c++) {
        		var d = window.location.hostname.split(".");
        		while (d.length > 0) {
            			var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
            			var p = location.pathname.split('/');
            			document.cookie = cookieBase + '/';
            			while (p.length > 0) {
                			document.cookie = cookieBase + p.join('/');
                			p.pop();
            			};
           			d.shift();
        		}
    		}
	}
	/* delete cookies function */
	/* call the delete cookies function */
	$("#log-out-button").click(function(){
		var m = confirm("Are you sure you want to logout?");
		if(m == true){
			$.fn.del_cookies();
			window.location.href = "https://el.belzona.com/";
		}
	});
} );
