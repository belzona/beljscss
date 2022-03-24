jQuery( function( $ ) {
  if($(".single-belzona_video").length)
  {
    $("#dwnvid").click(function(){
      window.open($("#dwnvid").attr("href"), "_self");
    });
  }
});
