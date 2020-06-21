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
		var api_url = "https://bel.belzona.com/assets/xml/productdocsjson.aspx?prod=";
		$.getJSON( api_url + prod, function(data) {
			var int_doc = 1;
			var docs = [];
			/* loop through the documents */
			$.each(data, function(key,val){
				if(val.iso_code == iso && val.formulation_number){
					docs.push("<div class=\"elementor-accordion-item\"><div id=\"elementor-tab-title-1331\" class=\"elementor-tab-title elementor-active\" data-tab=\"" + int_doc + "\" role=\"tab\" aria-controls=\"elementor-tab-content-1331\"><span class=\"elementor-accordion-icon elementor-accordion-icon-left\" aria-hidden=\"true\"><span class=\"elementor-accordion-icon-closed\"><i class=\"fas fa-plus\"></i></span><span class=\"elementor-accordion-icon-opened\"><i class=\"fas fa-minus\"></i></span></span><a class=\"elementor-accordion-title elementor-active\" href=\"\">FN" + val.formulation_number + "</a></div><div id=\"elementor-tab-content-1331\" class=\"elementor-tab-content elementor-clearfix elementor-active\" data-tab=\"" + int_doc + "\" role=\"tabpanel\" aria-labelledby=\"elementor-tab-title-1331\" style=\"display: block;\">");
					if(val.IF){
		            	docs.push("<a href=\"" + val.IF + "\">Instructions for Use</a><br>");
		            }
		            if(val.PSS){
		            	docs.push("<a href=\"" + val.PSS + "\">Product Specification Sheet</a><br>");
		            }
		            if(val.CR){
		            	docs.push("<a href=\"" + val.CR + "\">Chemical Resistant Chart</a><br>");
		            }
		            docs.push("</div></div>");
		            int_doc = int_doc + 1;
				}
			});
			$("#docs-downloads").html(docs.join("")); 
		});
	}
	/* function to load documents accordion */

} );