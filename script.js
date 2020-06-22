jQuery( function( $ ) {
/* breadcrumb */
	if($(".single-belzona_report").length || $(".single-testing_report").length || $(".single-approval").length){
		$("#menu-item-77").addClass("current-menu-ancestor current-menu-parent");
	}
	if($(".single-literature").length){
		$("#menu-item-615").addClass("current-menu-ancestor current-menu-parent");
	}
/* icons for search results */
	if($(".search").length || $(".archive").length){
		if($(".type-belzona_report").length){
			$(".type-belzona_report").each(function(index){
				var thelnk = $(this).find("a").attr("href");
				$('<a>',{
				    class: 'elementor-post__thumbnail__link no-lightbox',
				    href: thelnk,
				    html: '<div class=\"icon_type\"><i aria-hidden=\"true\" class=\"fas fa-chart-bar\"></i></div>'
				}).prependTo($(this));
			});
		}
		if($(".type-approval").length){
			$(".type-approval").each(function(index){
				var thelnk = $(this).find("a").attr("href");
				$('<a>',{
				    class: 'elementor-post__thumbnail__link no-lightbox',
				    href: thelnk,
				    html: '<div><i aria-hidden=\"true\" class=\"fas fa-thumbs-up\"></i></div>'
				}).prependTo($(this));
			});
		}
		if($(".type-testing_report").length){
			$(".type-testing_report").each(function(index){
				var thelnk = $(this).find("a").attr("href");
				$('<a>',{
				    class: 'elementor-post__thumbnail__link no-lightbox',
				    href: thelnk,
				    html: '<div><i aria-hidden=\"true\" class=\"fas fa-list-alt\"></i></div>'
				}).prependTo($(this));
			});
		}
		if($(".type-technical_mailing").length){
			$(".type-technical_mailing").each(function(index){
				var thelnk = $(this).find("a").attr("href");
				$('<a>',{
				    class: 'elementor-post__thumbnail__link no-lightbox',
				    href: thelnk,
				    html: '<div><i aria-hidden=\"true\" class=\"fas fa-paper-plane\"></i></div>'
				}).prependTo($(this));
			});
		}
	}
	/* languages for product documentation */
	if($(".single-product_information").length){
		var prod = $("#prod_number").val();
	    $.getJSON( "https://bel.belzona.com/assets/xml/productdocsjson.aspx?langs=all", function(data) {
	     	var items = [];
	     	items.push( "<option value=\"\">Language</option>" );
	     	$.each( data, function( key, val ) {
	        	items.push( "<option value=\"" + val.iso_code + "\">" + val.doc_language + "</option>" );
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
		$(".elementor-widget-accordion").css("display", "block");
		var api_url = "https://bel.belzona.com/assets/xml/productdocsjson.aspx?prod=";
		$.getJSON( api_url + prod, function(data) {
			var docprim = "";
			var docs = [];
			/* loop through the documents */
			$.each(data, function(key,val){
				if(val.iso_code == iso && val.formulation_number){
					if(val.is_primary == true){
						docprim = "primary-fn";
					} else { docprim = ""; }
					docs.push("<div class=\"fn-box elementor-element elementor-widget elementor-widget-accordion\"><div class=\"elementor-widget-container\"><div class=\"elementor-accordion\"><div class=\"elementor-accordion-item\"><div class=\"elementor-tab-title " + docprim + "\"><a class=\"elementor-accordion-title fn-title\">FN" + val.formulation_number + "</a></div><div class=\"elementor-tab-content elementor-clearfix elementor-active elementor-widget-icon-list\" style=\"display: block;\"><ul clas=\"elementor-icon-list-items\">");
					if(val.IF){
		            	docs.push("<li class=\"elementor-icon-list-item\"><a href=\"" + val.IF + "\"><span class=\"elementor-icon-list-icon\"><i aria-hidden=\"true\" class=\"fas fa-download\"></i></span><span class=\"elementor-icon-list-text\">IFU</span></a></li>");
		            }
		            if(val.PSS){
		            	docs.push("<li class=\"elementor-icon-list-item\"><a href=\"" + val.PSS + "\"><span class=\"elementor-icon-list-icon\"><i aria-hidden=\"true\" class=\"fas fa-download\"></i></span><span class=\"elementor-icon-list-text\">PSS</span></a></li>");
		            }
		            if(val.CR){
		            	docs.push("<li class=\"elementor-icon-list-item\"><a href=\"" + val.CR + "\"><span class=\"elementor-icon-list-icon\"><i aria-hidden=\"true\" class=\"fas fa-download\"></i></span><span class=\"elementor-icon-list-text\">CRC</span></a></li>");
		            }
		            if(val.SD){
		            	$.each(val.SD, function(k,v){
		                	docs.push("<li class=\"elementor-icon-list-item\"><a href=\"" + v.doc_url + "\"><span class=\"elementor-icon-list-icon\"><i aria-hidden=\"true\" class=\"fas fa-exclamation-triangle\"></i></span><span class=\"elementor-icon-list-text\">" + v.doc_name + "</span></a></li>");
		            	});
		            }
		            docs.push("</div></div></div></div></div></ul>");
				}
			});
			$("#docs-downloads").html(docs.join(""));
			$("div.fn-box").sort(function (a,b){
				var fnboxes = $(a).find("a.fn-title").text() > $(b).find("a.fn-title").text();
				$("#docs-downloads").html("fnboxes");
			});
		});
	}
	/* function to load documents accordion */

} );