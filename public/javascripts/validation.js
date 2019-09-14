
function ValidarCampos( $this , escrito)
{
    error = 0
    msg = ""

    if ( $this.hasClass('validar') )
    { 
        $name = "";
        
        /*
        var attr = $this.attr('name')

        if (typeof attr !== typeof undefined && attr !== false) 
        {
            $name = $this.attr("name").replace("[","")
            $name = "." + $name.replace("]","") 
        }
        */

        $val = $this.val().replace("$" , "")
        $val = $val.replace("," , "")


        if( $this.hasClass('texto') )
        {
            msg += validarTexto($this)
        }
        else if( $this.hasClass('password') )
        { 
        }
        else if( $this.hasClass('numero') )
        {
            msg = validarNumero($this) 
        }
        else if( $this.hasClass('decimal') )
        {
            msg = validarDecimal($this)
        }
        else if( $this.hasClass('correo') )
        {
            if( $val != "" )
            {
                var expresion = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
                if( !expresion.test( $val) )
                {
                    msg += "<li>* No es una correo valido</li>"
                }
            }
            else if( $this.hasClass('requerido') )
            {
                msg += "<li>*  Este campo es requerido</li>"
            }
        }
        else if( $this.hasClass('hora') )
        {
            if( $val != "" )
            {
                var expresion =/^([0-9]{2})\:([0-9]{2})$/
                if( !expresion.test( $val) )
                {
                    msg += "<li>* La hora no es valida</li>"
                }
            }
            else if( $this.hasClass('requerido') )
            {
                msg += "<li>*  Este campo es requerido</li>"
            }
        }
        else if( $this.hasClass('fecha') )
        {
            if( $val != "" )
            {
                var expresion =/^\d{4}-\d{1,2}-\d{1,2}$/ 
                if( !expresion.test( $val) )
                {
                    msg += "<li>* La fecha no es valida</li>"
                }
            }
            else if( $this.hasClass('requerido') )
            {
                msg += "<li>*  Este campo es requerido</li>"
            } 
        }
        else if( $this.hasClass('fechahora') )
        {
            if( $val != "" )
            {
                var expresion =/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/ 
                if( !expresion.test( $val) )
                {
                    msg += "<li>* La fecha no es valida</li>"
                }
            }
            else if( $this.hasClass('requerido') )
            {
                msg += "<li>*  Este campo es requerido</li>"
            } 
        }
        else if ( $this.hasClass('checkbox') )
        {
            msg += validarCheckbox($this)
        }
        else if ( $this.hasClass('radio') )
        {
            msg += validarRadio($this)
        }
        else if ( $this.hasClass('select') )
        {
            msg += validarSelect($this)
        } 

        //$this.parent().siblings('.ketchup-error-container.' + $name ).remove() 

        
        
        if( msg != "" )
        {
            error = 1
            

            var position = $this.position()
            //if( opts.messageType == 'absolute' && !$this.hasClass('error') )
                MostrarMensajeAbsolute( msg , position.left , position.top , $this.parent() , $this )
           // if( opts.messageType == 'inline' && !$this.hasClass('error') )
               // MostrarMensajeInLine( $this, msg)

            $this.addClass('error')
            
            //if( opts.icon == true )
                //  MostrarIconoErrorAnimado( $this )

            return error
        }
        else
        {
            console.log("Escrioto ", escrito )
            if( escrito )
                EliminarErrores($this)
            else if( $this.hasClass("error"))
            {
                EliminarErrores($this)
                
            } 
        }

    }
    return error
}
function EliminarErrores($this)
{
    $this.removeClass("error")

    let position = $this.siblings('.ti-face-sad' ).position()
    
    $this.parent().find('.container-message').html("")
    $this.parent().find('.ketchup-error-container').remove()

    /*TweenMax.to( $this.siblings('.ti-face-sad' ) , .5, { x : "50px" , opacity:0, delay:0.1, ease:Back.easeOut  }, 0.5)
    setTimeout(function()
    {
        resetearSadSmile($this.siblings('.ti-face-sad'))
    },500)*/
    /*
    if( $this.siblings('.ti-face-smile').css("opacity") == 0 )
    {
        TweenMax.to( $this.siblings('.ti-face-smile' ) , .5, { x : "-50px" , opacity:1, delay:0.1, ease:Back.easeOut}, 0.1) 
    }
    */

}
function resetearSadSmile($element)
{
    let position = JSON.parse( $element.attr("data-position") ); 
    $element.css({"left" : position.left }) 
}
function MostrarIconoErrorAnimado($this)
{
    if( $this.siblings('.ti-face-smile').css("opacity") == 1 )
    {
        TweenMax.to( $this.siblings('.ti-face-smile') , .5, { x : "50px" , opacity:0, delay:0.1, ease:Back.easeOut}, 0.1) 
        setTimeout(function()
        {
            resetearSadSmile($this.siblings('.ti-face-smile'))
        },500)
    }
    

    if( $this.siblings('.ti-face-sad' ).css("opacity") == 0 )
    {
        TweenMax.to( $this.siblings('.ti-face-sad' ) , .5, { x : "-50px" , opacity:1, delay:0.1, ease:Back.easeOut  }, 0.5)
    }

}
function MostrarMensajeInLine($this, msg)
{
    $this.siblings('.container-message').html( msg )

}
function MostrarMensajeAbsolute( msg  , left , top , $padre , $this )
{
    $name = "";
        
    var attr = $this.attr('name')

    if (typeof attr !== typeof undefined && attr !== false) 
    {
        $name = $this.attr("name").replace("[","")
        $name = $name.replace("]","")
    }
    
    $div = $('<div class="ketchup-error-container '+$name+'" style="left: '+left+'px; display: block"><ol>'+msg+'</ol><span></span></div>')
    $padre.append($div)

    $div.css({"top" : top - ($div.height() / 2 + 20 ) , 'left' : $this.position().left + 10 /*+ ( $this.width() / 2 )*/  })
}
function OcultarMensajeAbsolute($padre, $this)
{
    $this.parent().find('.container-message').html("")
    console.log("Longitud " , $padre.find(".ketchup-error-container").length )
    $padre.find(".ketchup-error-container").remove()
}
function validarTexto($this)
{
    let msg = ""
    $val = $this.val().replace("$" , "")
    $val = $val.replace("," , "")

    if( $val != "" )
    {
        if ( typeof $this.data('minlength') !== 'undefined' && typeof $this.data('maxlength') !== 'undefined'  )
        {
                if( $val.length < $this.data('minlength') || $val.length > $this.data('maxlength') )
                {
                    if(  typeof $this.data('msg') === 'undefined' )
                    msg += "<li>* La cantidad de caracteres debe estar entre " + $this.data('minlength') + " y " + $this.data('maxlength') + "</li>"
                    else
                    msg += $this.data('msg')
                }

        }
        else if ( typeof $this.data('minlength') !== 'undefined'  )
        {
                if( $val.length < $this.data('minlength'))
                {
                    if(  typeof $this.data('msg') === 'undefined' )
                    msg += "<li>* La cantidad de caracteres debe ser mayor a " + $this.data('minlength') + "</li>"
                    else
                    msg += $this.data('msg')
                }
        }
        else if ( typeof $this.data('maxlength') !== 'undefined' )
        {
                if( $val.length > $this.data('maxlength'))
                {
                    if(  typeof $this.data('msg') === 'undefined' )
                    msg += "<li>* La cantidad de caracteres debe ser menor a " + $this.data('maxlength') + "</li>"
                    else
                    msg += $this.data('msg')
                }
        }
    }
    else if( $this.hasClass('requerido') )
    {
        msg += "<li>*  Este campo es requerido</li>"
    }
    return msg
}
function validarNumero($this)
{
    let msg = ""
    $val = $this.val().replace("$" , "")
    $val = $val.replace("," , "")

    if( $val != "" )
    {
        var expresion = /^[0-9]+$/
        if( !expresion.test( $val) )
        {
            msg += "<li>* El numero no es valido</li>"
        }
        if ( typeof $this.data('min') !== 'undefined'  && typeof $this.data('max') !== 'undefined' )
        {
            if( $val < $this.data('min') || $val > $this.data('max') )
            {
                if(  typeof $this.data('msg') === 'undefined' )
                    msg += "<li>* El valor ingresado debe estar entre " + $this.data('min') + " y " + $this.data('max') + "</li>"
                else
                    msg += $this.data('msg')
            }
        }
        else if ( typeof $this.data('min') !== 'undefined' )
        {
            if( $val < $this.data('min'))
            {
                if(  typeof $this.data('msg') === 'undefined' )
                    msg += "<li>* El valor ingresado debe ser mayor a " + $this.data('min') + "</li>"
                else
                    msg += $this.data('msg')
            }
        }
        else if ( typeof $this.data('max') !== 'undefined' )
        {
            if( $val > $this.data('max'))
            {
                if(  typeof $this.data('msg') === 'undefined' )
                    msg += "<li>* El valor ingresado debe ser menor a " + $this.data('max') + "</li>"
                else
                    msg += $this.data('msg')
            }
        }
    }
    else if( $this.hasClass('requerido') )
    {
        msg += "<li>*  Este campo es requerido</li>"
    }

    return msg
}
function validarDecimal($this)
{
    let msg = ""
    $val = $this.val().replace("$" , "")
    $val = $val.replace("," , "")
    if( $val != "" )
    {
        var expresion = /^[0-9]+([.][0-9]+)?$/
        if( !expresion.test( $val) )
        {
            msg += "<li>* El numero no es valido</li>"
        }
        if ( typeof $this.data('min') !== 'undefined'  && typeof $this.data('max') !== 'undefined' )
        {
            if( $val < $this.data('min') || $val > $this.data('max') )
            {
                msg += "<li>* El valor ingresado debe estar entre " + $this.data('min') + " y " + $this.data('max') + "</li>"
            }
        }
        else if ( typeof $this.data('min') !== 'undefined' )
        {
                if( $val < $this.data('min'))
                {
                    msg += "<li>* El valor ingresado debe ser mayor a " + $this.data('min') + "</li>"
                }
        }
        else if ( typeof $this.data('max') !== 'undefined' )
        {
            if( $val > $this.data('max'))
                {
                    msg += "<li>* El valor ingresado debe ser menor a " + $this.data('max') + "</li>"
                }
        }
    }
    else if( $this.hasClass('requerido') )
    {
        msg += "<li>*  Este campo es requerido</li>"
    }
    return msg
}
function validarCheckbox($this)
{
    let msg = ""
    if( $('input[name="'+$this.attr("name")+'"]').is(':checked') )
    {

    }
    else
    {
        msg += "<li>* Se debe seleccionar por lo menos una opcion</li>"
    }
    return msg
}
function validarRadio($this)
{
    let msg = ""
    if( $('input[name="'+$this.attr("name")+'"]').is(':checked') )
    {

    }
    else
    {
        msg += "<li>* Se debe seleccionar por lo menos una opcion</li>"
    }
    return msg
}
function validarSelect($this)
{
    let msg = ""
    if(  $this.val() == "" || $this.val() == null || $this.val() == 'undefined' )
    {
        msg += "<li>* Se debe seleccionar una opcion</li>"
    }
    return msg
} 
