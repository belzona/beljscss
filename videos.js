jQuery( function( $ ) {
  if($(".single-belzona_video").length)
  {
    $("#dwnbtn").click(function(){
      window.open($("#dwnbtn").attr("href"), "_self");
    });
  }
});
