  

$(document).ready(function() { 
    
    $(document).keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13') {
           if( $product != null )
            $product.find(".product_pass").click()
             
        }
    });

    $("*").on("hidden.bs.modal", "#productoExterno", function (e) 
   {
        e.stopImmediatePropagation()
        e.stopPropagation()
        e.preventDefault()
        $('#frmAgregarProductoExternoLista')[0].reset()
    }) 

    $("*").on("click",".click" , function(e)
    {
        e.stopImmediatePropagation()
        e.stopPropagation()
        e.preventDefault()
        
        var $this = $(e.currentTarget)
 
        let actions =  $this.data("actions") 


        window[actions.fn]( $this , actions )
      
    })
    $("*").on("keyup",".keyup", debounce( function(e)
    {
        e.stopImmediatePropagation() 
        e.preventDefault()
        e.stopPropagation()

        var $this = $(e.currentTarget)
        let actions =  $this.data("actions")  

        window[actions.fn]( $this , actions )
    },500))
  

    $("*").on("focus",".focus" , function(e)
    {
        e.stopImmediatePropagation() 
        e.preventDefault()
        e.stopPropagation()

        $(this).focus()
    })
    $("*").on("change",".change" , (e) =>
    {
        e.stopImmediatePropagation()  
        e.stopPropagation()

        var $this = $(e.currentTarget)
        let actions =  $this.data("actions")   

        window[actions.fn]( $this , actions )
    })

    $('*').on('keyup','#icon_prefix',function(e) {
      e.stopImmediatePropagation()
      e.stopPropagation()
      e.preventDefault()
      
      $this = $(this)
     // delay(function() { 
          obtenerProductoVenta($this.val())
     // }, 500, this)
    })

    $("*").on("submit","form", function(e)
    {   
        e.stopImmediatePropagation()
        e.preventDefault()
        e.stopPropagation() 
        
        var formData = new FormData( $(this) [0] )
        window[$(this).data("fn")]( $(this) ,  formData ) 
    })

    $("*").on("click",".inputSelect", function(e)
    {   
        e.stopImmediatePropagation()
        e.preventDefault()
        e.stopPropagation() 
        
        $(this).select()

        $product = $(this).parents(".product")
    })
  })
  
  $.fn.serializeFormJSON = function () 
    {
        var o = {}
        var a = this.serializeArray()
        $.each(a, function () 
        {
            if (o[this.name]) 
            {
                if (!o[this.name].push) 
                {
                    o[this.name] = [o[this.name]]
                }
                o[this.name].push(this.value || '')
            } 
            else 
            {
                o[this.name] = this.value || ''
            }
        })
        return o
  }