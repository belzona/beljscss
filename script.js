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
	    $.getJSON( "https://bel.belzona.com/assets/xml/productdocsjson.aspx?langs=all", function(data) {
	     	var items = [];
	     	items.push( "<option value=\"\">Language</option>" );
	     	$.each( data, function( key, val ) {
	        	items.push( "<option value=\"" + val.iso_code + "\">" + val.doc_language + "</option>" );
	      	});
	      	/* load languages into select element */
	      	$("#docs-lang-select").html(items.join( "" ));  
	    });
	}
} );