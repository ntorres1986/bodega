history.pushState(null, null, document.URL);
window.addEventListener('popstate', function () 
{
    history.pushState(null, null, document.URL);
});
$(document).ready(function()
{ 
   //$("form").validadorFormulario({ messageType : 'inline' , icon : true })
   
   $("*").on("submit","form",function(evt)
   {
      window[$(this).data("fn")]( $(this).serializeFormJSON() , $(this).attr("method") ,  $(this).attr("action") )
      
      evt.preventDefault()
      evt.stopPropagation()
      evt.stopImmediatePropagation() 
   });
});