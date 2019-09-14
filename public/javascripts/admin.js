//f.masakhane@gmail.com

/*
history.pushState(null, null, document.URL);
window.addEventListener('popstate', function () 
{
    history.pushState(null, null, document.URL);
});
*/
var audio = new Audio('public/recursos/alert.mp3');

$(document).ajaxSuccess(function( event, xhr, settings ) 
{   
    ocultarLoadingFull()
    if( isJson(xhr.responseText) )
    {
        response = JSON.parse( xhr.responseText ); 
        //console.log("xhr" , response )
        if( response.error )
        {
            //alert(response.error)
            //agregarModalTokenError("modal-token" , response.message)
        }
    }
})

$.ajaxSetup
({  
    data: 
    {
        token: localStorage.getItem('token') ,
        idusuario: localStorage.getItem('idusuario') ,
        idpunto: localStorage.getItem('idpunto')  
    }
}) 
document.onkeydown = function(evt) 
{
    evt = evt || window.event;
    var isEscape = false;
    if ("key" in evt) 
    {
        isEscape = (evt.key == "Escape" || evt.key == "Esc");
    } 
    else 
    {
        isEscape = (evt.keyCode == 27);
    }
    if (isEscape) 
    {
        let valor = 0;
        if( $(".panel-leteral-derecho").is(":visible") ) 
            cerrarPanelLateralDerecho()
    }
}

$(document).ready( () =>
{   
    $('#nav-icon4').click(function()
    {
        $(this).toggleClass('open')
        if( _globals.ocultoMenu == 1 )
        {
            ocultarIzquierdo()
            _globals.ocultoMenu = 2
        }
        else
        {
            mostrarIzquierdo()
            _globals.ocultoMenu = 1
        }
    })
 
    setInterval(function()
    { 
       ViewNotifications() 
    },15000)
    
    $(".bloqueDerecho").mCustomScrollbar({ theme:"my-theme"})
    
    //$('.bloqueIzquierdo').blurjs({source: 'body',radius: 10,overlay: 'rgba(255, 255, 255, .1)',cache: false,offset: {x: 0,y: 0} })
    
    init() 

    $("*").on("submit","form", function(e)
    {   
        e.stopImmediatePropagation()
        e.preventDefault()
        e.stopPropagation()
        
        $(this).find("input[name='token']").remove();
        $(this).find("input[name='idusuario']").remove();
        $(this).find("input[name='idpunto']").remove();


        $('<input>').attr({type: 'hidden', name: 'token',value: localStorage.getItem('token')}).appendTo($(this));
        $('<input>').attr({type: 'hidden', name: 'idusuario',value: localStorage.getItem('idusuario')}).appendTo($(this));
        $('<input>').attr({type: 'hidden', name: 'idpunto',value: localStorage.getItem('idpunto')}).appendTo($(this));

        var formData = new FormData( $(this) [0] );

        
        window[$(this).data("fn")]( $(this) ,  formData )
        
    })

    $("*").on("click",".click" , function(e)
    {
        e.stopImmediatePropagation()
        e.stopPropagation()
        
        var $this = $(e.currentTarget)
 
        let actions =  $this.data("actions") 

        window[actions.fn]( $this , actions )
      
    })

    $("*").on("focus",".focus" , function(e)
    {
        e.stopImmediatePropagation()
        e.stopPropagation()
        
        var $this = $(e.currentTarget)

        let actions =  $this.data("actionsfocus") 

        window[actions.fn]( $this , actions )
      
    })

    $("*").on("mouseleave",".mouseleave" , function(e)
    {
        e.stopImmediatePropagation()
        e.stopPropagation()
        
        var $this = $(e.currentTarget)

        let actions =  $this.data("actionsmouseleave") 

        window[actions.fn]( $this , actions )
      
    })

    $("*").on("blur",".blur" , function(e)
    {
        e.stopImmediatePropagation()
        e.stopPropagation()
        
        var $this = $(e.currentTarget)

        let actions =  $this.data("actionsblur") 

        window[actions.fn]( $this , actions )
      
    })

    $("*").on("click","#mas" , function(e)
    {
        e.stopImmediatePropagation()
        e.preventDefault()
        e.stopPropagation()

        var child = $('#tblData tbody').children().length;

    }) 

    $("*").on("keyup",".keyup", debounce( function(e)
    {
        e.stopImmediatePropagation() 
        e.preventDefault()
        e.stopPropagation()

        var $this = $(e.currentTarget)
        let actions =  $this.data("actions")  

        window[actions.fn]( $this , actions )
    },400))

    $("*").on("change",".change" , (e) =>
    {
        e.stopImmediatePropagation()  
        e.stopPropagation()

        var $this = $(e.currentTarget)
        let actions =  $this.data("actions")  

        window[actions.fn]( $this , actions )
    })

    $("*").on("focus",".selection" , (e) =>
    {
        e.stopImmediatePropagation()
        e.preventDefault()
        e.stopPropagation()

        $(e.currentTarget).select()
    })
    
}) 
