var listProductos = new Array()
var listClientes = new Array()

var breadcrumb = {
    "menu" : "",
    "submenu" : ""
}

function manageError(error)
{
    console.log( 'manageError', error )
    console.log( 'status', error.status )
    if( error.status == 401 )
    { 

        alertify.prompt("","Su sesión ha expirado. Ingrese su contraseña para ingresar nuevamente.", "",
        function(evt, value )
        {
            
            $.ajax
            ({
                url:  '',
                type: 'post',
                data: { "controller" : "Login" , "action" : "sigIn", "userPassword": value, "userName": localStorage.getItem('userName')},
                dataType : 'json'
            }).done( (data ) =>
            {
                console.log("data", data)
                if( data.status && data.token)
                {
                    localStorage.removeItem('token')            
                    localStorage.setItem('token', data.token)
                    localStorage.setItem('idusuario', data.idusuario)
                    localStorage.setItem('idpunto', data.idpunto)
                    
                    alertify.success('Iniciado correctamente')
                    setTimeout( () => {
                        location.reload()
                    },2000)
                }
                else
                {
                    alert("Error ", data.msg)
                }
               
            })
            .fail( ( error ) =>
            {
                console.log("error" , error)
                manageError(error)
            })
        },
        function()
        {
            alertify.error('Cancel');
        })
    }
}
function init()
{
    //getDashboard()
    getMenu()
}
function getMenu()
{
    let idusuario =  localStorage.getItem('idusuario')
    $.ajax
    ({
        url:  '',
        type: 'post',
        data: { "controller" : "Menu", "action" : "getMenu", "idusuario" : idusuario},
        dataType : 'json'
    }).done( (menus ) =>
    {
        _menus = menus
        setMenuInDom( _menus )
    })
    .fail( ( error ) =>
    {
        console.log("error" , error)
        manageError(error)
    })
}
function getDashboard()
{
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: { "controller" : "Dashboard" , "action" : "index"},
            dataType : 'json',
        }).done( (response) =>
        {
            $(".body-response").html( response.html )
            graficaVentasPorClientes()
            graficaVentasPorProductos()
            graficaVentasPorTiempo()
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })
}
function setMenuInDom(menus)
{
    let htmlMenu =  ``
    for( let key in menus )
    {
        htmlMenu +=`<div class="site-menu-item click"
                         data-id=${menus[key].id}
                         data-actions='{ "fn":"getSubMenuOrContent", "id":"${menus[key].id}" , "type" : "POST" , "controller":"${menus[key].controller}" , "action":"${menus[key].action}" , "dataType":"${menus[key].dataType}" ,  "response":"body-response" }' >
                        <div class="site-menu-img"><center><img src="public/images/${menus[key].icon}" style="width: 36px; height: 36px;"></center></div>
                        <div class="site-menu-text">${menus[key].texto}</div>
                    </div>`
    }
    $(".contenidoMenu").html(htmlMenu)
    $(".contenidoMenu").mCustomScrollbar({ theme:"my-theme"})

}
function showModalSearchInvoice()
{
    
    $(".panel-buscar-factura").animate
    ({
        right : 0
    },300,function()
    {
        $("#searchInvoiceCreditNote").focus()
    })
}
function mostrarModalAgregarProductoVenta()
{
    let alturaPagina = $('body').height()
    let alturaSiteNavBar = $('.site-navbar').height()
    

    $("#buscarProducto").focus()

    let panelRow1 = $(".panel-buscar-producto-row").eq(0).height()
    let panelRow2 = $(".panel-buscar-producto-row").eq(1).height()

    let alturaElemento = alturaPagina - ( alturaSiteNavBar + panelRow1 + panelRow2 + 62 )

    $('.result-producto-venta').css({height: alturaElemento + "px"})

    $(".panel-buscar-producto").animate
    ({
        right : 0
    },
    {
      easing: 'easeInSine'
    })
}
function mostrarModalAgregarProductoFabricar()
{
    let alturaPagina = $('body').height()
    let alturaSiteNavBar = $('.site-navbar').height()
    

    $("#buscarProducto").focus()

    let panelRow1 = $(".panel-buscar-producto-row").eq(0).height()
    let panelRow2 = $(".panel-buscar-producto-row").eq(1).height()

    let alturaElemento = alturaPagina - ( alturaSiteNavBar + panelRow1 + panelRow2 + 62 )

    $('.result-producto-venta').css({height: alturaElemento + "px"})

    $(".panel-buscar-producto").animate
    ({
        right : 0
    },
    {
      easing: 'easeInSine'
    })
}
function mostrarModalBuscarProductoOrdenCompra()
{
    let alturaPagina = $('body').height()
    let alturaSiteNavBar = $('.site-navbar').height()

    $("#buscarProductoOrdenCompra").focus()

    let panelRow1 = $(".panel-buscar-producto-row").eq(0).height()
    let panelRow2 = $(".panel-buscar-producto-row").eq(1).height()

    let alturaElemento = alturaPagina - ( alturaSiteNavBar + panelRow1 + panelRow2 + 62 )

    $('.result-producto').css({height: alturaElemento + "px"})

    $(".panel-buscar-producto").animate
    ({
        right : 0
    },
    {
      easing: 'easeInSine'
    })
}
function panelProductosNotaDebito()
{
    let alturaPagina = $('body').height()
    let alturaSiteNavBar = $('.site-navbar').height()

    $("#buscarProducto").focus()

    let panelRow1 = $(".panel-buscar-producto-row").eq(0).height()
    let panelRow2 = $(".panel-buscar-producto-row").eq(1).height()

    let alturaElemento = alturaPagina - ( alturaSiteNavBar + panelRow1 + panelRow2 + 62 )

    $('.result-producto-venta').css({height: alturaElemento + "px"})

    $(".panel-buscar-producto").animate
    ({
        right : 0
    },
    {
      easing: 'easeInSine'
    })
}
function cerrarPanelLateralDerecho()
{
    $(".panel-leteral-derecho").animate
    ({
        right : "-30%"
    },
    {
      easing: 'easeOutSine'
    })
} 
function getSubMenuOrContent( $this , actions )
{
    listProductos = new Array()
    listClientes = new Array()

    $(".notificationContenido").fadeOut()
    //$(".ketchup-error").hide()

    idMenu = $this.data("id")

    if( _menus != null )
    {
        
        var menu = _menus.find(function (obj) { return Number(obj.id) === idMenu })

        breadcrumb.menu = menu.texto

        if(  typeof(menu.submenu) != 'undefined' && menu.submenu.length > 0 )
        {
           let subs = `<div class='content_submenu'><ul>`
           for(let k in menu.submenu )
           {
                subs +=`<li class='submenu click'
                            data-actions='{ "fn":"getContentSubMenu", "id":"${menu.submenu[k].id}" , "type" : "POST" , "controller":"${menu.submenu[k].controller}" , "action":"${menu.submenu[k].action}" , "dataType":"${menu.submenu[k].datatype}" ,  "response":"body-response" }' >
                            <div class="site-submenu-img"><img src="public/images/${menu.submenu[k].icon}" style="width: 48px; height: 48px;"></i></div>
                            <div class="site-submenu-text">${menu.submenu[k].texto}</div>
                        </li>`
           }
           subs += `</ul></div>`


           $(".body-response").html(subs)
           
           TweenMax.staggerFrom(".content_submenu", 1, { x :  50 ,opacity:0,  delay:0.1, ease:Back.easeOut}, 0.1)
           TweenMax.staggerFrom(".content_submenu li", 1, { x : 50 , opacity:0, delay:0.1, ease:Back.easeOut, force3D:true}, 0.1)
        }
        else
        {
            getContentMenu( menu , actions )
        }
    }
}
function cambiarConfiguracion($this, actions)
{
    let $checkbox = $this.find("input")
    
    $.ajax
    ({
        url:  "",
        type: "post",
        data:  {"controller" : "General" , "action" : "cambiarConfiguracion" , "id" : actions.id , "key" : actions.key , value : $checkbox.is(":checked") },
        dataType: 'json'
    }).done( ( response ) =>
    {
        if( !$checkbox.is(":checked") )
            $(".facturacionElectronica").hide()
        else
            $(".facturacionElectronica").show()

    })
    .fail( ( error ) =>
    {
        console.log("error" , error)
        manageError(error)
    })
}
function cerrarSesion( $this , data )
{ 

    $.ajax
    ({
        url:  "",
        type: "post",
        data:  {"controller" : "Login" , "action" : "cerrarSesion" },
        dataType : "json"
    }).done( ( response ) =>
    {
        if( response.status )
        {
            localStorage.clear()
            $('body').addClass('logout')
            setTimeout(function()
            {
                _reload()
            }, 500)
        }
    })
    .fail( ( error ) =>
    {
        console.log("error" , error)
        manageError(error)
    })
}
function calcularFilaNomina($this, data)
{
    console.log("data", data)

    if( !isNaN ($this.val()) )
    {
        $(`#input-${data.tipo}-${data.id}`).val( parseInt($this.val()) )


        console.log('selector', `#fila-${data.idusuario}-${data.tipo}`)

        let $fila = $(`#fila-${data.idusuario}-${data.tipo}`)
    
        let hora = $fila.find(".hora").html()
        let horas = $fila.find(".horas").html()

        console.log("Hora", hora)
        console.log("Horas", horas)

        

        let total = $(".totalGeneral")
        let subtotal = $(".subtotalGeneral")
        let ded_iss_pen = $(".ded-iss-pen")
        let ded_iss_sal = $(".ded-iss-sal")

        let suma = 0
        $fila.find("input").each(function(key, value)
        {
            
            if( !isNaN( parseInt($(this).val()) ) )
                suma +=  parseInt($(this).val())
        })

        let strTotal = suma * parseInt(horas.replace(",",""))


        $fila.find(".hora").html(suma)
        $fila.find(".total-row").html(numberFormat(strTotal))

        let sumaTemp = 0
        $(".total-row").each( function() 
        {
            if( !isNaN( parseInt($(this).html().replace(",","")) )  )
            sumaTemp +=  parseInt($(this).html().replace(",",""))
        })

        subtotal.html(numberFormat(sumaTemp))
        ded_iss_pen = parseInt( ded_iss_pen.html().replace(",","") )
        ded_iss_sal = parseInt( ded_iss_sal.html().replace(",","") )
        total.html( numberFormat(sumaTemp - ded_iss_pen - ded_iss_sal) )
    }
}
function moveCursorToEnd(input) {
    var originalValue = input.val();
    input.val('');
    input.blur().focus().val(originalValue);
}
function mostrarSave($this, data)
{
    let html = `<form action="" method="post" data-fn="sendForm"   data-response='modal-hora' data-datatype="json" data-callback="" autocomplete="off" >
                    <div class="form-group">
                        <label for="horas">Ingrese el número de horas</label>
                        <input type="number" id="hora" value='${$this.val()}' name="hora" class="form-control keyup" data-actions='{ "fn":"calcularFilaNomina", "idusuario":"${data.idusuario}", "id":"${data.id}", "tipo":"${data.tipo}",  "dia":"${data.dia}" }' > 
                    </div> 
                    
                    <button type="submit" class="btn btn-primary waves-effect waves-light waves-round">Actualizar</button>
                    <input type='hidden' name='action' value='actualizarHora' />
                    <input type='hidden' name='controller' value='Nomina' />
                    <input type='hidden' name='id' value='${data.id}' />
                    <input type='hidden' name='tipo' value='${data.tipo}' />
                </form>`
    addModal
    ({
        id : `modal-hora`,
        class : `modal-simple modal-50`,
        response : `modal-hora`,
        close : true,
        title: "",
        body : `${html}`,
        buttonClose : true ,
        buttonAction : false ,
        buttonActionText : ``,
        modalType : ``,
        backdrop : true
    })
    
    $(".modal-body").mCustomScrollbar({ theme:"my-theme"})
}
function enviarDias($this,  data)
{
    $.ajax
    ({
        url:  '',
        type: 'post',
        data: { "controller" : "Nomina" , "action" : "actualizarHora" , "tipo": data.tipo, "dia" : data.dia,"id": data.id, "hora": $this.parent().find("input").val() },
        dataType : "json"
    }).done( ( response ) =>
    {
    })
    .fail( ( error ) =>
    {
        console.log("error" , error)
        manageError(error)
    })
}
function cerrarMiModal($this, actions )
{
    $("#miModal").fadeOut(()=>{
        $(this).find("#miModal-body").html("")
    })
}
function getContent( $this , actions )
{
    $(".notificationContenido").fadeOut()
    //$(".ketchup-error").hide()

    $(".page-title").html("")
    $(".breadcrumb-item1").html("")
    $(".breadcrumb-item2").hide(0)

    $.ajax
    ({
        url:  '',
        type: 'post',
        data: { "controller" : actions.controller , "action" : actions.action , "datos" : actions },
        dataType : actions.dataType
    }).done( ( response ) =>
    {  
        
        if( actions.dataType == "json")
        {
            if( actions.modal )
            {
                addModal
                ({
                    id : `modal`,
                    class : `modal-simple modal-${actions.modalWidth}`,
                    close : true,
                    title: actions.title,
                    body : `${response.html}`,
                    buttonClose : true ,
                    buttonAction : false ,
                    buttonActionText : ``,
                    modalType : ``,
                    backdrop : actions.backdrop
                })
                
                $(".modal-body").mCustomScrollbar({ theme:"my-theme"})
                initPlugins()
                
            }
            else 
            {
               $(`.${actions.response}` ).html( response.html )
               initPlugins()
             
               
            }
 
               
            if( response.paginate == true )
            {
                if( typeof response.fn !== 'undefined')
                {
                    window[response.fn]() 
                }
            }
        }
        else
        { 
            if( actions.modal )
            {
                addModal
                ({
                    id : `modal`,
                    class : `modal-simple modal-${actions.modalWidth}`,
                    close : true,
                    title: actions.title,
                    body : `${response}`,
                    buttonClose : true ,
                    buttonAction : false ,
                    buttonActionText : ``,
                    modalType : ``,
                    backdrop : actions.backdrop
                })
                
                $(".modal-body").mCustomScrollbar({ theme:"my-theme"})
                initPlugins()
            }
            else
            {
                
                $(`.${actions.response}` ).html( response )
                initPlugins()
                calcularTotalVenta();
                calcularTotalOrdenCompra()

            }
           
        }
        initPlugins()
        
    })
    .fail( ( error ) =>
    { 
        console.log("error" , error)
        manageError(error)
    })
}
function mostrarDetalleNomina($this, actions)
{
    $("#miModal").fadeIn()
    $.ajax
    ({
        url:  '',
        type: 'post',
        data: { "controller" : "Nomina" , "action" : "detalleNomina", "id": actions.id },
        dataType : "json"
    }).done( ( response ) =>
    { 
        $(`#miModal-body`).html( response.html ) 
        $('.collapse').collapse('hide')
       
        initPlugins() 
    })
    .fail( ( error ) =>
    {
        console.log("error" , error)
        manageError(error)
    })
}
function home()
{
    $(".body-response").html("")
}
function getContentMenu( menu , actions )
{
    $(".notificationContenido").fadeOut()
    listProductos = new Array()
    listClientes = new Array()
    //$(".ketchup-error").hide()

    $(".page-title").html( breadcrumb.menu )
    //document.title = breadcrumb.menu
    $(".breadcrumb-item1").html( breadcrumb.menu )
    $(".breadcrumb-item2").hide(0)
    // window[dataResponse.fn]()
    $.ajax
    ({
        url:  '',
        type: 'post',
        data: { "controller" : actions.controller , "action" : actions.action },
        dataType : actions.dataType
    }).done( ( response ) =>
    {
        if( actions.dataType == "json")
        {
            $(`.${actions.response}` ).html( response.html )

            //ocultarIzquierdo()
            if( response.paginate == true )
            {
                if( typeof response.fn !== 'undefined')
                {
                    window[response.fn]()
                }
            }
        }
        else
        {
            $(`.${actions.response}` ).html( response )
            //ocultarIzquierdo()
        }

        initPlugins()
    })
    .fail( ( error ) =>
    {
        console.log("error" , error)
        manageError(error)
    })
} 
function ocultarIzquierdo()
{
     if( _globals.ocultoMenu == 1 )
     {
        $(".bloqueIzquierdo").toggleClass('oculto').animate({"width" : "100px"})
        _globals.ocultoMenu = 2
     }
}
function mostrarIzquierdo()
{
    if( _globals.ocultoMenu == 2 )
    {
        $(".bloqueIzquierdo").toggleClass('oculto').animate({"width" : "200px"})
        _globals.ocultoMenu = 1
    }
}
function getContentSubMenu( $this , actions )
{
    breadcrumb.submenu = $this.html()
    $(".page-title").html( breadcrumb.submenu )
    //document.title = breadcrumb.submenu;

    $(".breadcrumb-item1").html( breadcrumb.menu )
    $(".breadcrumb-item2").html( breadcrumb.submenu ).show()
 

    $.ajax
    ({
        url:  '',
        type: 'post',
        data: { "controller" : actions.controller , "action" : actions.action },
        dataType : actions.dataType
    }).done( ( response ) =>
    { 
        ocultarSubMenu() 

        if( actions.dataType == "json")
        {
            $(`.${actions.response}` ).html( response.html )
            if( response.paginate == true )
            {
                if( typeof response.fn !== 'undefined')
                {
                    window[response.fn]()
                }
            }
        }
        else
        {
            
            $(`.${actions.response}` ).html( response )
            
            $('.content').richText();
          
            var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));

            elems.forEach(function(elem) {
                var switchery = new Switchery(elem, { color: '#7c8bc7', jackColor: '#9decff' });
            });
            //ocultarIzquierdo()
        }
            

        initPlugins()
    })
    .fail( ( error ) =>
    {
        console.log("error" , error)
        manageError(error)
    })
} 
function obtenerProductos($this , actions)
{
    if( $this.val().trim().length > 0 )
    {
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: { "controller" : actions.controller , "action" : actions.action , 'listProductos': listProductos, 'nombreProducto' : $this.val().trim() , 'listaPrecio' : $("#listaprecio").val() },
            dataType : actions.dataType
        }).done( ( response ) =>
        {
            $('.result-producto').html( response )
            $('.result-producto').mCustomScrollbar
            ({
                theme:"my-theme"
            })
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })
    }
}   
function obtenerClientes($this , actions)
{
    
    if( $this.val().trim().length > 0 )
    {
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: { "controller" : actions.controller , "action" : actions.action , 'listClientes': listClientes, 'nombreCliente' : $this.val().trim()  },
            dataType : actions.dataType
        }).done( ( response ) =>
        {
            $('.result-cliente').html( response )
            $('.result-cliente').mCustomScrollbar
            ({
                theme:"my-theme"
            })
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })
    }
}  
function toggleFiltro($this, actions )
{
    let heightForm = $('.filtro-parent').find('form').height()

    if( $( ".filtro" ).height() < 10 )
    {
        $( ".filtro" ).animate({
            height : heightForm, 
            opacity: 1
        })
    }
    else
    {
        $( ".filtro" ).animate({
            height : 0, 
            opacity: 0
        })
    }
}
function agregarProductoVenta($this , actions)
{
    let ivaPercent = obtenerIvaPorId(actions.ivas, actions.iva_id)
    let parts = ivaPercent.toString().split(" ")
    ivaPercent = parts[0]

    let indice = $('.recibe-producto-venta tbody tr').length + 1
    let iva = ( ( 1 * actions.precio ) * ivaPercent ) / 100
    let total =( 1 * actions.precio ) + iva

    let selectOptionIva = `<select name="ivas[]" class="iva select2-simple change" data-actions='{"fn":"calcularTotalVenta"}'>`
    if( actions.ivas.length > 0 )
    {
        let selected = "";
        actions.ivas.forEach(element =>
        {

            if( Number(element.id) == Number(actions.iva_id) )
                selected = "selected=selected";

            selectOptionIva += `<option value='${element.id}' ${selected}>${element.value}</option>`
        });
        selectOptionIva += "</select>";
    }

    $('.recibe-producto-venta tbody').append(`<tr>
                                <input type="hidden" name="idproductos[]" value='${actions.idproducto}' />
                                <input type="hidden" name="costos[]" value='${actions.costo}' />
                                <input type="hidden" name="tipos[]" value='${actions.tipo}' />
                                <td class="text-center">${indice}</td>
                                <td class="text-center"><i class="icon ion-md-trash click" data-actions='{"fn":"eliminarProductoVenta","idproducto":"${actions.idproducto}"}' style="font-size:24px"></i></td>
                                <td class="text-left">${actions.nombre}</td>
                                <td class="text-right" >
                                    <input type="text" data-actions='{"fn":"calcularTotalVenta"}' style="width:100px; float:right; padding-right:25px" name="cantidades[]" class="form-control keyup text-right cantidad" data-min=1  data-value=1 data-max=${actions.cantidad}  data-validate="validate(required,number,min(1),max(${actions.cantidad}))" />
                                </td>
                                <td class="text-right" >
                                    <input type="text" data-actions='{"fn":"calcularTotalVenta"}' style="width:100px; float:right; padding-right:25px" name="precios[]"   class="form-control keyup text-right precio validar numero requerido" data-min=1 value=${actions.precio} data-validate="validate(required,number,min(1),max(${actions.precio}))" />
                                </td>
                                <td class="text-right" >
                                    ${selectOptionIva}
                                </td>
                                <td class="text-right" >
                                    <textarea name="obs[]" class="form-control"></textarea>
                                </td>
                                <td class="text-right" >
                                  <label class='subtotal-item' style="font-size:16px;line-height: 1.8;" >${total}</label>
                                </td>
                                
                            </tr>`)
    $(".select2-simple").select2({width: '100%' })
    $this.parents("tr").remove()


    listProductos.push( actions.idproducto )

    calcularTotalVenta(null,null)
    $(".btn-guardar-venta").removeAttr("disabled")
    $("#observaciones").removeAttr("disabled")
    $("#descuento_id").removeAttr("disabled")
    $('.erase-input').tooltip();
}
function agregarProductoProduccion($this , actions)
{
    let indice = $('.recibe-producto-produccion tbody tr').length + 1
    
    $('.recibe-producto-produccion tbody').append(`<tr>
                                <input type="hidden" name="idproductos[]" value='${actions.idproducto}' />
                                <td class="text-center">${indice}</td>
                                <td class="text-center"><i class="icon ion-md-trash click" data-actions='{"fn":"eliminarProductoProduccion","idproducto":"${actions.idproducto}"}' style="font-size:24px"></i></td>
                                <td class="text-left">${actions.nombre}</td>
                                <td class="text-right" >
                                    <input type="text" style="width:100px; float:right; padding-right:25px" name="cantidades[]" class="form-control cantidad text-right" data-value=1 data-max=${actions.cantidad}  data-validate="validate(required,number,min(1))" />
                                </td>
                                <td class="text-center">
                                  <i class='icon pe-config click mostrarPanelSacarProducto' data-actions='{"fn":"mostrarPanelSacarProducto","idproducto":"${actions.idproducto}"}' style='font-size:24px;'></i>
                                  <div class='panelSacarProducto'>
                                    <div class='row'> 
                                        <div class="col-md-12 text-left">
                                            <i class="icon pe-close click" data-actions='{"fn":"ocultarPanelSacarProducto"}'  aria-hidden="true" style="font-size:32px;"></i>
                                        </div>
                                    </div> 
                                    <div class='row rowContenido'> 
                                        <div class="col-md-12 contenido"></div>
                                    </div>
                                  </div>
                                </td>
                                
                            </tr>`)
    $this.parents("tr").remove()
 
    listProductos.push( actions.idproducto )
}
function sacarDeBodegas($this, actions)
{
    if( $this.is(":checked") )
    {
        $(".btn-guardar-produccion").attr("disabled","disabled")
        $(".sacarDeBodegas").val("1")
        $this.parents(".contenido").find(".editable,.editableHidden").removeAttr("disabled")
    }
    else
    {
        $(".sacarDeBodegas").val("")
        $this.parents(".contenido").find(".editable,.editableHidden").attr("disabled","disabled")
        $this.parents(".contenido").find(".editable").val("")
        $(".btn-guardar-produccion").removeAttr("disabled")
    }
}
function ocultarPanelSacarProducto($this, actions)
{
    
    let ocultarPanel = true
    if( $(".sacarDeBodegas").is(":checked"))
    {
        $(".cantidadPermitida").each(function()
        {
                let valores = $(this).data('valores')
                let sumaEscrito = 0
                $(".infoBodegas").find(`.inputEscrito${valores.idproducto}`).each(function()
                {
                    if( Number($(this).val()) > 0 )
                    {
                        sumaEscrito += Number($(this).val())
                    }
                })
                if( sumaEscrito > 0 )
                {
                    let texto = ''
                        
                    if( sumaEscrito > Number(valores.permitido) )
                        texto = `El total a sacar del producto <b>${valores.nombre}</b> no puede ser mayor a <b>${valores.permitido}</b> usted ha ingresado <b>${sumaEscrito}</b>`

                    if( texto.length > 0 )
                    {                    
                        toastr.options = _toast_options_abajo
                        toastr.error(texto)
                        ocultarPanel = false
                    }
                }
        })
    }
    
    if( ocultarPanel )
    {
        $this.parents(".panelSacarProducto").addClass('animated fadeOutRight').one("animationend oAnimationEnd mozAnimationEnd webkitAnimationEnd", function() 
        {
            $(this).removeClass('animated fadeOutRight').css({display:'none'})
        })
        $(".btn-guardar-produccion").removeAttr("disabled")
    }
}
function habilitarCampoSacar($this, actions)
{
    $this.parent("td").find("input").each(function()
    {
         if( $this.val() > 0 )
         {
            let acciones = $(this).data("actions");
            $(this).attr("name" , acciones.name )
         }
         else
         {
            $(this).removeAttr("name")
         }
    }) 
    restarDeInventarioGeneral(actions.idproducto)
}
function restarDeInventarioGeneral(idproducto)
{  
    let valores =  $(`.inputEscritoInvGral${idproducto}`).data('valores')

    
    let valorEscrito = 0
    $(`.inputEscrito${idproducto}`).each((index, element) => 
    {
        valorEscrito += Number($(element).val())
    })

    $(`.inputEscritoInvGral${idproducto}`).val( valores.cantidad - valorEscrito )
}
function calcularMargenes($this, actions)
{
    calcularMargen( $("#precio"), { response: "margenPrecioPublico"} )
}
function calcularMargen($this, actions)
{
    let error = false

    let costo = parseFloat( $("#costo").val() )
    if( !isNaN(costo) && !isNaN( parseFloat( $this.val()) ) )
    {
        if( costo > 0 )
        {
            let ganancia = parseFloat( $this.val()) - costo
            let utilidad = parseFloat(ganancia / costo * 100).toFixed(0)
            
            $(`#${actions.response}`).html( `${utilidad}%`)
            
        }
        else 
         error = true
    }
    else 
        error = true

    if( error )
    {
        $(`#${actions.response}`).html(`0%`)
    }
}
function mostrarPanelSacarProducto($this, actions)
{
    let solicitado = $this.data("solicitado")
    let cantidad = $this.parents("tr").find(".cantidad").val()

    $this.attr("data-solicitado", cantidad )

    if( cantidad == 0 ||typeof cantidad === 'undefined' )
    {
        toastr.options = 
        {
            "closeButton": false,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-bottom-full-width",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "slideUp",
            "showMethod": "slideDown",
            "progressBar": true,
        }
        toastr.error('Debe ingresar una cantidad antes de sacar productos de las bodegas?')
    }
    else
    {
        let ajax = false
        if( typeof solicitado === 'undefined' ) 
            ajax = true
        else if( solicitado != cantidad )
            ajax = true

        if( ajax )
        {        
            $.ajax
            ({
                url:  '',
                type: 'post',
                data: {'controller': 'Produccion', 'action': 'obtenerHtmlProductoBedegaDisponible' , 'idproducto': actions.idproducto, 'cantidadSolicitada' :  cantidad },        
            }).done( ( response ) =>
            { 
                $this.siblings(".panelSacarProducto").find(".contenido").html(response)
                $this.siblings(".panelSacarProducto").css({display:'block'}).addClass('animated fadeInRight').one("animationend oAnimationEnd mozAnimationEnd webkitAnimationEnd", function() 
                {
                    $(this).removeClass('animated fadeInRight')
                })
                $(".btn-guardar-produccion").attr("disabled","disabled")

                $('.infoBodegas').mCustomScrollbar
                ({
                    theme:"my-theme"
                })
            })
            .fail( ( error ) =>
            {
                console.log("error" , error)
                manageError(error)
            })
        }
        else
        {
            $this.siblings(".panelSacarProducto").css({display:'block'}).addClass('animated fadeInRight').one("animationend oAnimationEnd mozAnimationEnd webkitAnimationEnd", function() 
            {
                $(this).removeClass('animated fadeInRight')
            })
            $(".btn-guardar-produccion").attr("disabled","disabled")

        }
    }
    
}
function agregarProductoCotizacion($this , actions)
{
    let indice = $('.recibe-producto-cotizacion tbody tr').length + 1

    let total = actions.precio
    
    $('.recibe-producto-cotizacion tbody').append(`<tr>
                                <input type="hidden" name="idproductos[]" value='${actions.idproducto}' />
                                <input type="hidden" name="costos[]" value='${actions.costo}' />
                                <td class="text-center">${indice}</td>
                                <td class="text-center"><i class="icon ion-md-trash click" data-actions='{"fn":"eliminarProductoCotizacion","idproducto":"${actions.idproducto}"}' style="font-size:24px"></i></td>
                                <td class="text-left">${actions.nombre}</td>
                                <td class="text-right" >
                                    <input type="text" data-actions='{"fn":"calcularTotalCotizacion"}' style="width:100px; float:right; padding-right:25px" name="cantidades[]" class="form-control keyup text-right cantidad" data-min=1 value=1 data-value=1 data-max=${actions.cantidad}  data-validate="validate(required,number,min(1))" />
                                </td>
                                <td class="text-right" >
                                    <input type="text" data-actions='{"fn":"calcularTotalCotizacion"}' style="width:100px; float:right; padding-right:25px" name="precios[]"   class="form-control keyup text-right precio validar numero requerido" data-min=1 value=${actions.precio} data-validate="validate(required,number,min(1))" />
                                </td>
                                <td class="text-right" >
                                  <label class='subtotal-item' style="font-size:16px;line-height: 1.8;" >${numberFormatFE(total)}</label>
                                </td>
                                
                            </tr>`)
    $(".select2-simple").select2({width: '100%' })
    $this.parents("tr").remove()
 
    listProductos.push( actions.idproducto )

    $(".btn-guardar-cotizacion").removeAttr("disabled")
    $("#observaciones").removeAttr("disabled")
    $("#descuento_id").removeAttr("disabled")

    calcularTotalCotizacion(null,null)
    
}
function agregarProductoListaPrecio($this , actions)
{
    let indice = $('.recibe-producto-lista-precio tbody tr').length + 1

    $('.recibe-producto-lista-precio tbody').append(`<tr>
                                <input type="hidden" name="idproductos[]" value='${actions.idproducto}' />
                                <td class="text-center">${indice}</td>
                                <td class="text-center"><i class="icon ion-md-trash click" data-actions='{"fn":"eliminarProductoListaPrecio","idproducto":"${actions.idproducto}"}' style="font-size:24px"></i></td>
                                <td class="text-left">${actions.nombre}</td>
                                <td class="text-right" >
                                    <input type="text" style="width:100px; float:right; padding-right:25px" name="precios[]"   class="form-control text-right" value=${actions.precio} data-validate="validate(required,number,min(1))" />
                                </td>
                            </tr>`)
    $this.parents("tr").remove()
 
    listProductos.push( actions.idproducto )
}
function agregarProductoCodigoCliente($this , actions)
{
    let indice = $('.recibe-producto-codigo-cliente tbody tr').length + 1

    $('.recibe-producto-codigo-cliente tbody').append(`<tr>
                                <input type="hidden" name="idproductos[]" value='${actions.idproducto}' />
                                <td class="text-center">${indice}</td>
                                <td class="text-center"><i class="icon ion-md-trash click" data-actions='{"fn":"eliminarProductoCodigoCliente","idproducto":"${actions.idproducto}"}' style="font-size:24px"></i></td>
                                <td class="text-left">${actions.nombre}</td>
                                <td class="text-right" >
                                    <input type="text" style="width:100px; float:right; padding-right:25px" name="codigos[]"   class="form-control text-right" data-validate="validate(required)" />
                                </td>
                            </tr>`)
    $this.parents("tr").remove()
 
    listProductos.push( actions.idproducto )
}
function agregarClienteListaPrecio($this , actions)
{
    let indice = $('.recibe-cliente-lista-precio tbody tr').length + 1

    $('.recibe-cliente-lista-precio tbody').append(`<tr>
                                <input type="hidden" name="idclientes[]" value='${actions.idcliente}' />
                                <td class="text-center">${indice}</td>
                                <td class="text-center"><i class="icon ion-md-trash click" data-actions='{"fn":"eliminarClienteListaPrecio","idcliente":"${actions.idcliente}"}' style="font-size:24px"></i></td>
                                <td class="text-left">${actions.cliente}</td>
                            </tr>`)
    $this.parents("tr").remove()
 
    listClientes.push( actions.idcliente )
}
function obtenerIvaPorId(ivas,id)
{
   for( let i = 0 ; i < ivas.length ; i++ )
   {

       if( ivas[i].id == id )
       {
           
          return ivas[i].value
          break
       }
   }
}
function agregarProductoNotaDebito($this , actions)
{
    let ivaPercent = obtenerIvaPorId(actions.ivas, actions.iva_id)
    let parts = ivaPercent.toString().split(" ")
    ivaPercent = Number(parts[0])

    let indice = $('.recibe-producto-nota-debito tbody tr').length + 1

    let iva = 0;
    if( ivaPercent > 0 )
      iva = actions.precio * ivaPercent  / 100

    let total = Number(actions.precio) + Number(iva)
 

    _notaDebito.totalAumentoPorProducto += total
    _notaDebito.totalFactura += total

    
    let selectOptionIva = `<select name="ivas[]" class="iva select2-simple change" data-actions='{"fn":"calcularTotalNotaDebito"}'>`
    if( actions.ivas.length > 0 )
    {
        let selected = "";
        actions.ivas.forEach(element =>
        {
            if( Number(element.id) == Number(actions.iva_id) )
                selected = "selected=selected";

            selectOptionIva += `<option value='${element.id}' ${selected}>${element.value} %</option>`
        });
        selectOptionIva += "</select>";
    }

    $('.recibe-producto-nota-debito tbody').append(`<tr class='product-agregado'>
                                <input type="hidden" name="idproductos[]" value='${actions.idproducto}' />
                                <input type="hidden" name="costos[]" value='${actions.costo}' />
                                <td class="text-center">${indice}</td>
                                <td class="text-center"><i class="icon ion-md-trash click" data-actions='{"fn":"eliminarProductoNotaDebito","idproducto":${actions.idproducto},"total":${total} }' style="font-size:24px"></i></td>
                                <td class="text-left">${actions.nombre}</td>
                                <td class="text-right" >
                                    <input type="text" data-actions='{"fn":"calcularTotalNotaDebito"}' style="width:100px; float:right; padding-right:25px" name="cantidades[]" class="form-control keyup text-right cantidad" data-min=1 value=1 data-value=1 data-max=${actions.cantidad}  data-validate='validate(number,min(1),max(${actions.cantidad}))' />
                                </td>
                                <td class="text-right" >
                                    <input type="text" data-actions='{"fn":"calcularTotalNotaDebito"}' style="width:100px; float:right; padding-right:25px" name="precios[]"   class="form-control keyup text-right precio" data-min=1 value=${actions.precio} data-value=${actions.precio} data-max=${actions.precio} data-validate='validate(number,min(1))' />
                                </td>
                                <td class="text-right" >
                                    ${selectOptionIva}
                                </td>
                                <td>${numberFormatFE(actions.iva_value)}</td>
                                <td>${numberFormatFE(actions.precio)}</td>
                                <td class="text-right" >
                                  <label class='subtotal-item' style="font-size:20px;color:#000;line-height: 1.4;" >${numberFormatFE(total)}</label>
                                </td>
                                
                            </tr>`)
    $(".select2-simple").select2({width: '100%' })
    $this.parents("tr").remove()
 
    listProductos.push( actions.idproducto )

    //$('.subtotal-invoice').html( formatFe(totalInvoiceWithoutIva) )
    //$('.iva-invoice').html( formatFe(totalInvoiceIva) )
    $('.total-invoice').html( numberFormatFE(_notaDebito.totalFactura ))
    $('.aumento').html( numberFormatFE(_notaDebito.totalAumentoPorProducto ))
 
    //calcularTotalNotaDebito(null,null)

    $(".btn-save").removeAttr("disabled")
    $('.erase-input').tooltip();
}
function eliminarProductoVenta($this, actions)
{
    $this.parents('tr').remove()
    
    if ( $('.recibe-producto-venta tbody tr').length == 0 )
    {
        $(".btn-guardar-venta").attr("disabled" , 'disabled' )
        $("#observaciones").attr("disabled" , 'disabled' ).val("")
        $('#descuento_id').val('1').trigger('change')
        $("#descuento_id").attr("disabled" , 'disabled' )
    }
    for( var i = 0 ; i < listProductos.length  ; i++ )
    {
        if (listProductos[i] == actions.idproducto )
        {
            listProductos.splice(i, 1)
        }
    }
    $(".recibe-producto-venta tbody tr").each((index , elem)  =>
    {
        $(elem).find("td:eq(0)").html(index+1)
    })

    calcularTotalVenta(null , null )
}
function eliminarProductoProduccion($this, actions)
{
    $this.parents('tr').remove() 
    for( var i = 0 ; i < listProductos.length  ; i++ )
    {
        if (listProductos[i] == actions.idproducto )
        {
            listProductos.splice(i, 1)
        }
    }
    $(".recibe-producto-produccion tbody tr").each((index , elem)  =>
    {
        $(elem).find("td:eq(0)").html(index+1)
    })

}
function eliminarProductoCotizacion($this, actions)
{
    $this.parents('tr').remove()
    
    if ( $('.recibe-producto-cotizacion tbody tr').length == 0 )
    {
        $(".btn-guardar-cotizacion").attr("disabled" , 'disabled' )
        $("#observaciones").attr("disabled" , 'disabled' ).val("")
        $('#descuento_id').val('1').trigger('change')
        $("#descuento_id").attr("disabled" , 'disabled' )
    }
    
    for( var i = 0 ; i < listProductos.length  ; i++ )
    {
        if (listProductos[i] == actions.idproducto )
        {
            listProductos.splice(i, 1)
        }
    }
    $(".recibe-producto-venta tbody tr").each((index , elem)  =>
    {
        $(elem).find("td:eq(0)").html(index+1)
    })

    calcularTotalVenta(null , null )
}
function eliminarProductoOrdenCompra($this, actions)
{
    $this.parents('tr').remove()
    
    if ( $('.recibe-producto-orden tbody tr').length == 0 )
    {
        $(".btn-guardar-orden-compra").attr("disabled" , 'disabled' )
    }
    
    for( var i = 0 ; i < listProductos.length  ; i++ )
    {
        if (listProductos[i] == actions.idproducto )
        {
            listProductos.splice(i, 1)
        }
    }
    $(".recibe-producto-orden tbody tr").each((index , elem)  =>
    {
        $(elem).find("td:eq(0)").html(index+1)
    })

    calcularTotalOrdenCompra(null , null )
}
function calcularFecha($this, actions)
{
    let fecha = new Date()
    let dias = parseInt($this.val())

    fecha.setDate(fecha.getDate() + dias);
    let mes = fecha.getMonth() + 1
    if( mes < 10 )
      mes = "0"+mes 

    let dia = fecha.getDate()
    if( dia < 10 )
      dia = "0"+dia
      
    $("#fechaPagoFactura").val(fecha.getFullYear() +"-"+mes+"-"+dia )
}
function eliminarProductoOrdenCompraPermanente($this, actions)
{
    alertify.confirm('', 'Esta seguro de eliminar este producto de la compra de forma permanente?', () =>
    { 
        
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: { "controller" : "Compra" , "action" : "eliminarProductoOrdenCompra", "idproducto" : actions.idproducto , "idcompra" : actions.idcompra },
            dataType : 'json'
        }).done( (response ) =>
        {
            if( response.status )
            {
              $this.parents("tr").remove()
              calcularTotalOrdenCompra(null,null)
            }
            else
            {
                toastr.options = _toast_options_abajo
                toastr.error(`No se puede eliminar <b>${response.cantidad_compra}</b> por ya se han vendido algunos productos actualmente hay <b>${response.cantidad_punto}</b>`)
            }

            
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })

    },() => {} )
}
function eliminarClienteListaPrecioPermanente($this, actions)
{
    alertify.confirm('', 'Esta seguro de eliminar este cliente de la lista?', () =>
    { 
        
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: { "controller" : "Configuracion" , "action" : "eliminarClienteListaPrecio", "idcliente" : actions.idcliente , "idlista" : actions.idlista },
            dataType : 'json'
        }).done( (response ) =>
        {
            if( response.status )
            {
              $this.parents("tr").remove() 
              if( typeof table !== 'undefined' )
                table.ajax.reload(null, false )
            }  
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })

    },() => {} )
}
function eliminarProductoListaPrecioPermanente($this, actions)
{
    alertify.confirm('', 'Esta seguro de eliminar este prpoducto de la lista?', () =>
    { 
        
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: { "controller" : "Configuracion" , "action" : "eliminarProductosListaPrecio", "idproducto" : actions.idproducto , "idlista" : actions.idlista },
            dataType : 'json'
        }).done( (response ) =>
        {
            if( response.status )
            {
              $this.parents("tr").remove() 
              if( typeof table !== 'undefined' )
                table.ajax.reload(null, false )
            }  
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })

    },() => {} )
}
function eliminarProductoCreacionPermanente($this, actions)
{
    alertify.confirm('', 'Esta seguro de eliminar este producto de forma permanente?', () =>
    { 
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: { "controller" : "Inventario" , "action" : "eliminarProductoCreacion", "id" : actions.id , "idcompra" : actions.idcompra },
            dataType : 'json'
        }).done( (response ) =>
        {
            if( response.status )
            {
              $this.parents("tr").remove()
              calcularTotalOrdenCompra(null,null)
            }
            else
            {
                toastr.options = _toast_options_abajo
                toastr.error(`No se puede eliminar <b>${response.cantidad_compra}</b> por ya se han vendido algunos productos actualmente hay <b>${response.cantidad_punto}</b>`)
            }

            
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })

    },() => {} )
}
function eliminarProductoNotaDebitoPermanente($this, actions)
{
    alertify.confirm('', 'Esta seguro de eliminar este producto de forma permanente?', () =>
    { 
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: { "controller" : "NotaDebito" , "action" : "eliminarProductoPermanente", "id" : actions.id , "idnota" : actions.idnota, "idproducto" : actions.idproducto },
            dataType : 'json'
        }).done( (response ) =>
        {
            
            if( response.status )
            {
              $this.parents("tr").remove()
              for( var i = 0 ; i < listProductos.length  ; i++ )
              {
                    if (listProductos[i] == actions.idproducto )
                    {
                        listProductos.splice(i, 1)
                    }
              }
              $(".recibe-producto-nota-debito tbody tr").each((index , elem)  =>
              {
                    $(elem).find("td:eq(0)").html(index+1)
              })
              _notaDebito.totalAumentoPorProducto -= actions.total
              _notaDebito.totalFactura -= actions.total

              $('.total-invoice').html( formatFe(_notaDebito.totalFactura ))
              $('.aumento').html( formatFe(_notaDebito.totalAumentoPorProducto + _notaDebito.valorAumentado ))
            }
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })

    },() => {} )
}
function eliminarNumeracionReciboCaja($this, actions)
{
    alertify.confirm('', 'Esta seguro de eliminar esta numeración?', () =>
    { 
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: { "controller" : "Recibo" , "action" : "eliminarNumeracionReciboCaja", "idnumeracion" : actions.idnumeracion  },
            dataType : 'json'
        }).done( (response ) =>
        { 
              $this.parents("tr").remove()  
            
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })

    },() => {} )
}
function eliminarNumeracionEgreso($this, actions)
{
    alertify.confirm('', 'Esta seguro de eliminar esta numeración?', () =>
    { 
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: { "controller" : "Egreso" , "action" : "eliminarNumeracionEgreso", "idnumeracion" : actions.idnumeracion  },
            dataType : 'json'
        }).done( (response ) =>
        { 
              $this.parents("tr").remove()  
            
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })

    },() => {} )
}
function eliminarProductoNotaDebito($this, actions)
{
    $this.parents('tr').remove()
    /*
    if ( $('#tabla >tbody >tr').length == 0 )
    {
        $(".btn-save").attr("disabled" , 'disabled' )
    }
    */
    for( var i = 0 ; i < listProductos.length  ; i++ )
    {
        if (listProductos[i] == actions.idproducto )
        {
            listProductos.splice(i, 1)
        }
    }
    $(".recibe-producto-nota-debito tbody tr").each((index , elem)  =>
    {
        $(elem).find("td:eq(0)").html(index+1)
    })
    _notaDebito.totalAumentoPorProducto -= actions.total
    _notaDebito.totalFactura -= actions.total

    $('.total-invoice').html( formatFe(_notaDebito.totalFactura ))
    $('.aumento').html( formatFe(_notaDebito.totalAumentoPorProducto + _notaDebito.valorAumentado ))

    
}
function eliminarProductoNotaCredito($this, actions)
{
    $this.parents('tr').remove()

    $(".recibe-producto-nota-credito tbody tr").each((index , elem)  =>
    {
        $(elem).find("td:eq(0)").html(index+1)
    })
    calculateTotalCreditNote(null,null)
}
function eraseInput($this , actions)
{
    let value = $this.siblings('input').data("max")
    $this.siblings('input').val( value )
}
function ocultarSubMenu()
{
  if( $(".content_submenu").is(":visible"))
  {
      TweenMax.staggerTo(".content_submenu li", 1, { x : 50 , opacity:0, delay:0.1, ease:Back.easeOut, force3D:true}, 0.1)
      TweenMax.staggerTo(".content_submenu", 1, { x :  50 ,opacity:0,  delay:0.1, ease:Back.easeOut}, 0.1)
      setTimeout(function()
      {
           $('.content_submenu').css({'display':'none'})
      },500)
  }

}
function initPlugins()
{
    initChosen()
    initSelect2()
    initDatePicker()
    initDateTimePicker()

    $("form").validationEngine({ scroll: false });
    
    $('.dropify').dropify({
        messages: {
            'default': 'Arrastra y suelta un archivo aquí o da un click',
            'replace': 'Arrastra y suelta o click para reemplazar',
            'remove':  'Eliminar',
            'error':   'Ooops, Ocurrio un error.'
        }
    });

    $('[data-fancybox="gallery"]').fancybox({ })
 
}
function initDatePicker()
{
    if( $(".k-input").length <= 0 )
    {
        $(".date").kendoDatePicker
        ({
            format: "yyyy-MM-dd"
        })
    }
}
function initDateTimePicker()
{
    if( $(".k-input").length <= 0 )
    {
        $(".datetime").kendoDateTimePicker
        ({
            format: "yyyy-MM-dd HH:mm:ss"
        })
    }
}
function initChosen()
{
    $(".chosen").chosen({disable_search_threshold: 10})
}
function initSelect2()
{   
    $('.select2-ajax').each(function(){

        $this = $(this)
        
        $this.select2
        ({
            
            width: '100%',
            ajax:
            {
                url: '',
                dataType: 'json',
                type: 'post',
                data: function (params)
                {
                    var query =
                    {
                        'controller': $this.data('controller') ,
                        'action': $this.data('action') ,
                        'nombreCliente':params.term
                    }
                    return query
                }
            }
        })
    })
    $(".select2-simple").select2({width: '100%' })
}
function calcularTotalVenta($this, actions)
{
    let totalVentaSinIva = 0
    let totalIvaVenta = 0

    $(".recibe-producto-venta > tbody > tr").each((index , elem)  =>
    {
        let cantidad = Number($(elem).find(".cantidad").val())
        let precio = Number($(elem).find(".precio").val())
        let parts = $(elem).find(".iva option:selected").text().split(" ")
        let iva = Number(parts[0]) 

        let ivaValue = ( ( cantidad * precio ) * iva ) / 100
        let total =( cantidad * precio ) + ivaValue 

        $(elem).find('.subtotal-item').html( formatFe(total) )

        totalVentaSinIva += Number(cantidad) * Number(precio)

        totalIvaVenta += ivaValue

    })
    let porcentajeDescuento = $('#descuento_id').val() - 1

    let descuento = totalVentaSinIva * porcentajeDescuento / 100

    $('.subtotal-invoice').html( formatFe(totalVentaSinIva) )
    $('.subtotal-descuento').html( formatFe(descuento) )
    $('.iva-invoice').html( formatFe(totalIvaVenta) )
    $('.total-invoice').html( formatFe(totalVentaSinIva + totalIvaVenta - descuento ))
}
function calcularTotalCotizacion($this, actions)
{
    let totalCotizacionSinIva = 0

    $(".recibe-producto-cotizacion tbody tr").each((index , elem)  =>
    {
        let cantidad = Number($(elem).find(".cantidad").val())
        let precio = Number($(elem).find(".precio").val())
        $(elem).find('.subtotal-item').html( formatFe(cantidad * precio) )
        totalCotizacionSinIva += Number(cantidad) * Number(precio) 
    })

    let porcentajeDescuento = $('#descuento_id').val() - 1
    let descuento = totalCotizacionSinIva * porcentajeDescuento / 100

    $('.subtotal-cotizacion').html( formatFe(totalCotizacionSinIva) )
    $('.descuento').html( formatFe(descuento) )
    $('.total-cotizacion').html( formatFe(totalCotizacionSinIva - descuento ))
}
function changeDescuentoVenta($this, actions)
{
    $(".texto_descuento").html( $('option:selected',$this).text()  )
    calcularTotalVenta(null,null)
}
function changeDescuentoCotizacion($this, actions)
{
    $(".texto_descuento").html( $('option:selected',$this).text()  )
    calcularTotalCotizacion(null,null)
}
function calcularTotalNotaDebito($this, actions)
{
    let totalInvoiceWithoutIva = 0
    let totalInvoiceIva = 0

    $(".recibe-producto-nota-debito > tbody > tr").each((index , elem)  =>
    {
        let cantidad = Number($(elem).find(".cantidad").val())
        let precio = Number($(elem).find(".precio").val())
        let parts = $(elem).find(".iva option:selected").text().split(" ")
        let iva = Number(parts[0])
       
        let ivaValue = ( ( cantidad * precio ) * iva ) / 100
        let total =( cantidad * precio ) + ivaValue


        $(elem).find('.subtotal-item').html( formatFe(total) )

        totalInvoiceWithoutIva += Number(cantidad) * Number(precio)

        totalInvoiceIva += ivaValue

    })
     
    let totalFac = totalInvoiceWithoutIva + totalInvoiceIva
    
    _notaDebito.totalAumentoPorProducto -= ( totalFac )
    $(".aumento").html( formatFe(_notaDebito.totalAumentoPorProducto + _notaDebito.valorAumentado ) )


    $('.subtotal-invoice').html( formatFe(totalInvoiceWithoutIva) )
    $('.iva-invoice').html( formatFe(totalInvoiceIva) )
    $('.total-invoice').html( formatFe(totalInvoiceWithoutIva + totalInvoiceIva))
}
function calculateTotalCreditNote($this, actions)
{
    let totalInvoiceWithoutIva = 0
    let totalInvoiceIva = 0
    let totalDescuento = 0

    $(".recibe-producto-nota-credito > tbody > tr").each((index , elem)  =>
    {
        let cantidad = Number($(elem).find(".cantidad").val())
        let precio = Number($(elem).find(".precio").val())

        let parts = $(elem).find(".iva option:selected").text().split(" ")
        let iva = Number(parts[0])

        let ivaValueOption = Number($(elem).find(".iva option:selected").val())

        let ivaValue = ( ( cantidad * precio ) * iva ) / 100
        let total =( cantidad * precio ) + ivaValue

        totalDescuento += total

        $(elem).find('.subtotal-item').html( formatFe(total) )

        totalInvoiceWithoutIva += Number(cantidad) * Number(precio)

        totalInvoiceIva += ivaValue

        if( cantidad != Number($(elem).find(".cantidad").data("value")) )
            $(elem).find(".cantidad").addClass("edited")
        else
            $(elem).find(".cantidad").removeClass("edited")


        if( precio != Number($(elem).find(".precio").data("value")) )
            $(elem).find(".precio").addClass("edited")
        else
            $(elem).find(".precio").removeClass("edited")


        if( ivaValueOption != Number($(elem).find(".iva").data("value")) )
            $(elem).find(".iva").siblings(".select2").find(".select2-selection").addClass("edited")
        else
            $(elem).find(".iva").siblings(".select2").find(".select2-selection").removeClass("edited")

    })
    $(".descuento").html( formatFe(totalDescuento) )

    //$('.subtotal-invoice').html( formatFe(totalInvoiceWithoutIva) )
    //$('.iva-invoice').html( formatFe(totalInvoiceIva) )
    //$('.total-invoice').html( formatFe(  (totalInvoiceWithoutIva + totalInvoiceIva) - descuento ) )
}
function formatFe(value)
{
    return numeral(value).format('$0,0.00')
}
function abrirModalNuevoCliente($this, actions)
{
    $.ajax
    ({
        url:  '',
        type: 'post',
        data: { 'controller' : 'Cliente' , 'action' : 'crearClienteExterno' } 
    }).done( ( response ) =>
    {
        addModal
        ({
            id : `modalNuevoCliente`,
            class : `modal-simple modal-center`,
            close : true,
            title: `Crear cliente`,
            body : response,
            buttonClose : true ,
            buttonAction : false ,
            buttonActionText : ``,
            modalType : `modal-default`
        })
        initPlugins()
    })
   
}
function abrirModalNuevoProveedor($this, actions)
{
    $.ajax
    ({
        url:  '',
        type: 'post',
        data: { 'controller' : 'Proveedor' , 'action' : 'crearProveedor' } 
    }).done( ( response ) =>
    {
        addModal
        ({
            id : `modalNuevoProveedor`,
            class : `modal-simple modal-center`,
            close : true,
            title: `Crear proveedor`,
            body : response,
            buttonClose : true ,
            buttonAction : false ,
            buttonActionText : ``,
            modalType : `modal-default`
        })
        initPlugins()
    })
   
}
function ponerClienteEnLista( $form , response )
{
    var newOption = new Option( response.text , response.id , false, false);
    $('#cliente').append(newOption).val(response.id).trigger('change');
    $("#modalNuevoCliente").modal("hide")
}
function ponerProveedorEnLista( $form , response )
{
    var newOption = new Option( response.text , response.id , false, false);
    $('#proveedor').append(newOption).val(response.id).trigger('change');
    $("#modalNuevoProveedor").modal("hide")
}
function addModal(options)
{
   $(`#${options.id}`).remove()
   let close = ``
   let title = ``
   let buttonClose = ``
   let buttonAction = ``

   if( typeof options.response === 'undefined')
   options.response = ''


   if( options.close )
        close = `<button type="button" class="close" data-dismiss="modal" aria-label="Close">
                   <span aria-hidden="true">×</span>
                 </button>`

    if( options.title )
        title = `<h4 class="modal-title">${options.title}</h4>`

    if( options.buttonClose )
        buttonClose = `<button type="button" class="btn btn-default btn-pure waves-effect waves-light waves-round" data-dismiss="modal">Cerrar</button>`

    if( options.buttonAction )
        buttonAction = `<button type="button" class="btn btn-primary waves-effect waves-light waves-round">${options.buttonActionText}</button>`


   let modal = `<div class="modal fade ${options.modalType}" id="${options.id}" role="dialog" tabindex="-1" aria-hidden="true" style="display: none;">
                    <div class="modal-dialog ${options.class} ">
                        <div class="modal-content">
                        <div class="modal-header">
                            ${close}
                            ${title}
                        </div>
                        <div class="modal-body ${options.response}">
                            ${options.body}
                        </div>
                        </div>
                    </div>
                </div>`

    $('body').append(modal)
    if( typeof options.backdrop === 'undefined' )
        options.backdrop = true

    $(`#${options.id}`).modal({backdrop: 'static' })
    
    $(`#${options.id}`).on('shown.bs.modal', function () 
    {   
        if( $(`#${options.id} .k-input`).length <= 0 ) 
        {
            $(`#${options.id} .date`).kendoDatePicker
            ({
                format: "yyyy-MM-dd"
            })
        }
        if( $("#hora").is(":visible") )
        {
            moveCursorToEnd($('#hora'))
            $("#hora").select()
        }

        
    })
}
function sendForm( $form, formData )
{
    if( $form.data('paginar') )
    {
        window[$form.data('callback')]( $form , $form.serializeFormJSON()  )
    }
    else
    {   
        $.ajax
        ({
            url:  '',
            type: 'post',
            processData: false,
            contentType: false,
            data: formData,
            dataType : $form.data("datatype"),
            beforeSend: function(objeto)
            {  
                let data = $form.serializeFormJSON()
                //console.log("$form.serializeFormJSON()" , $form.serializeFormJSON())

                let errores = 0
                $form.find('input.validar').each( (index, element) => 
                {
                    errores += ValidarCampos( $(element), false) 
                })
                if( errores > 0 )
                    return false

                mostrarLoadingFull()
                    
                if( typeof data.validar != 'undefined' )
                {
                    if( data.validar == 'true' )
                    {
                        data.action = data.actionvalidar
                        
                        $.ajax
                        ({
                            url:  '', 
                            type: 'post', 
                            data: data, 
                            dataType : 'json'
                        }).done( ( response ) =>
                        { 
                            if( response.status )
                            {
                                $("#validar").val('false')
                                $form.submit()
                            }
                            else 
                            {
                                alertify.confirm('', response.message, () =>
                                { 
                                    $("#validar").val('false')
                                    $form.submit()

                                },() => {} )
                            }
                        })
                        return false
                    }
                }
                if( typeof $form.data('beforecallback') !== 'undefined' )
                {
                   return window[$form.data('beforecallback')]( $form , $form.serializeFormJSON()  )
                }
                
            }
        })
        .done( ( response ) =>
        {   
            if( $form.data("datatype") == 'json')
            {
                if( response.status == false )
                {
                    toastr.options = _toast_options_arriba_derecha
                    toastr.error(response.message)

                    //console.log( "response",response )
                    if( response.nextNumber )
                    {
                        $("#numeroFactura").html(response.nextNumber)
                        $("#hiddenFactura").val(response.nextNumber)
                        $("#hiddenFacturaId").val(response.idrango)
                    }
                }
                else
                {
                    if( typeof $form.data("response") != "undefined" )
                    {
                        if( $form.data("response").length > 0 && typeof response.closeModal === 'undefined' )
                            $(`.${$form.data("response")}`).html( response.message )
                        else if( response.closeModal !== 'undefined' )
                            if( response.closeModal )
                              $("#modal").modal("hide")
                    }
                    if( typeof $form.data('callback') != "undefined")
                        if( $form.data('callback').length > 0 )
                            window[$form.data('callback')]( $form , response )
                }
            }
            else
            {
                if( typeof $form.data("response") !== 'undefined' )
                    $(`.${$form.data("response")}`).html( response )
                else
                    $(".body-response").html( response )
            }
            if( typeof table !== 'undefined' )
                table.ajax.reload(null, false )

            initSelect2()
        })
        .fail( ( error ) =>
        {
            ocultarLoadingFull()
            manageError(error)
        })
    }
}
function validarTopeNotaCredito($form, data)
{
    /*
    let totalNota = Number(_notaCredito.totalSeleccionadoNotaCredito) + Number(_notaCredito.valorDescontado)

    if( totalNota > 0 )
    {
        if(totalNota <= _notaCredito.permitidoCredito )
        {
            return true       
        }
        else
        {
            toastr.options = _toast_options_abajo
            toastr.error("No se puede registrar la nota crédito porque valor seleccionado supera el valor máximo permitido")
            return false
        }
    }
    */
   return true
}
function verificarEnvioDocumento($this, response)
{
    //  if( response.enviar == true )
    //      socket.emit('generarDocumento' , { id : response.id , token : localStorage.getItem('token') ,  tipo : response.tipo  });
}
function inicializarFirma($this, actions) 
{ 
    socket.emit('inicializarFirma' , { idnomina : actions.idnomina , idusuario : actions.idusuario });

}
function guardarFirma($this, actions)
{ 
    $(`.img-firma${actions.idusuario}${actions.idnomina}`).attr("src",`public/firmas/images/firma_${actions.idusuario}${actions.idnomina}.png`)


    mostrarLoadingFull()
  
    $.ajax
    ({
        url:  '',
        type: 'post',
        data: { "controller" : "Nomina" , "action" : "actualizarFirma", 'idusuario' : actions.idusuario, "idnomina": actions.idnomina },
        dataType : "json"
    }).done( ( response ) =>
    {
        ocultarLoadingFull()
        console.log( response )
    })
    .fail( ( error ) =>
    {
        console.log("error" , error)
        manageError(error)
    })

    toastr.options =
    {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "slideDown",
        "hideMethod": "fadeOut"
    }
    toastr.success("Firma guardada exitosamente", "mensaje")
}
function imprimirNomina($this, actions)
{
    
    $.ajax
    ({
        url:  actions.url,
        type: 'post',
        data: { 'idnomina' : actions.idnomina } 
    }).done( ( response ) =>
    {
        visualizarPdf( response )
    })
}
function imprimirNominaSemanal($this, actions)
{
    mostrarLoadingFull()
    $.ajax
    ({
        url:  actions.url,
        type: 'post',
        data: { 'idnomina' : actions.idnomina } 
    }).done( ( response ) =>
    {
        visualizarPdf( response )
        
    })
}
function imprimirDesprendibles($this, actions)
{
    mostrarLoadingFull()
    $.ajax
    ({
        url:  actions.url,
        type: 'post',
        data: { 'idnomina' : actions.idnomina } 
    }).done( ( response ) =>
    {
        visualizarPdf( response )
        ocultarLoadingFull()
    })
}
function imprimirFactura($this, actions)
{
    mostrarLoadingFull()
    $.ajax
    ({
        url:  actions.url,
        type: 'post',
        data: { 'idventa' : actions.idventa } 
    }).done( ( response ) =>
    {
        visualizarPdf( response )
        ocultarLoadingFull()
    })
}
function imprimirTermica($this, actions)
{
    mostrarLoadingFull()

    let ip = "192.168.0.20"
    if( actions.impresora == 2 )
        ip = "192.168.0.21"

    $.ajax
    ({
        url:  "http://192.168.0.101:4000/print",
        type: 'post',
        data: { 'idventa' : actions.idventa, "ip": ip } 
    }).done( ( response ) =>
    {
        ocultarLoadingFull()
    })
}
function imprimirNotaCredito($this, actions)
{
   
    mostrarLoadingFull()
    $.ajax
    ({
        url:  actions.url,
        type: 'post',
        data: { 'idnota' : actions.idnota } 
    }).done( ( response ) =>
    {
        visualizarPdf( response )
        ocultarLoadingFull()
    })
}
function imprimirNotaDebito($this, actions)
{
    mostrarLoadingFull() 
    $.ajax
    ({
        url:  actions.url,
        type: 'post',
        data: { 'idnota' : actions.idnota } 
    }).done( ( response ) =>
    {
        visualizarPdf( response )
        ocultarLoadingFull()
    })
}
function imprimirReciboCaja($this, actions)
{
 
    mostrarLoadingFull()
    $.ajax
    ({
        url:  actions.url,
        type: 'post',
        data: { 'idrecibo' : actions.idrecibo } 
    }).done( ( response ) =>
    {
        visualizarPdf( response )
        ocultarLoadingFull()
    })
}
function imprimirCotizacion($this, actions)
{
    mostrarLoadingFull()
    $.ajax
    ({
        url:  actions.url,
        type: 'post',
        data: { 'idcotizacion' : actions.idcotizacion } 
    }).done( ( response ) =>
    {
        visualizarPdf( response )
        ocultarLoadingFull()
    })
}
function imprimirComprobanteEgreso($this, actions)
{
    mostrarLoadingFull()
    $.ajax
    ({
        url:  actions.url,
        type: 'post',
        data: { 'idegreso' : actions.idegreso } 
    }).done( ( response ) =>
    {
        visualizarPdf( response )
        mostrarLoadingFull()
    })
}
function visualizarPdf( fileName )
{
    let height = $('body').height() - 200
    let html = `<iframe src='documentos/${fileName.trim()}'  id='iframe' style='width:100%; height:${height}px; padding:0 ; margin:0p;' frameborder='0'></iframe>`
    addModal
    ({
        id : `modalDetalleVenta`,
        class : `modal-simple modal-60`,
        close : true,
        title: ``,
        body : html,
        buttonClose : true ,
        buttonAction : false ,
        buttonActionText : ``,
        modalType : ``
    })
    ocultarLoadingFull()

}
function mostrarLoadingFull()
{
    //$("#loadingFull").fadeIn()
    if( $("#loader-wrapper").is(":hidden"))
    $("#loader-wrapper").fadeIn()
}
function ocultarLoadingFull()
{
   // $("#loadingFull").fadeOut()
    $("#loader-wrapper").fadeOut()
}
function calcularDescuentoNotaCredito($this , actions)
{ 
    
    _notaCredito.valorDescontado =  Number($this.val())
    $(".descuento").html( formatFe(_notaCredito.totalDescontoPorProducto + _notaCredito.valorDescontado  ) )
    // else
    // {
    //     _notaCredito.valorDescontado = Number(_notaCredito.totalFactura * $this.val() / 100)
    //     $(".descuento").html( formatFe(_notaCredito.totalDescontoPorProducto + _notaCredito.valorDescontado  ) )
    // }
}
function calcularDescuentoNotaDebito($this , actions)
{
    
    if(  Number($(".tipo_aumento").val()) == 1 )
    {   
        _notaDebito.valorAumentado = numberFormatFE( $this.val() )
        $(".aumento").html( formatFe(_notaDebito.totalAumentoPorProducto + _notaDebito.valorAumentado  ) )
    }
    else
    {
        _notaDebito.valorAumentado = _notaDebito.totalFactura * $this.val() / 100 
        $(".aumento").html( formatFe(_notaDebito.totalAumentoPorProducto + _notaDebito.valorAumentado ) )
    }
}
function obtenerFacturas($this , actions)
{
    if( $this.val().trim().length > 0 )
    {
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: { "controller" : actions.controller , "action" : actions.action , 'numeroFactura' : $this.val().trim() },
            dataType : actions.dataType
        }).done( ( response ) =>
        {
            $('.result-factura').html( response )
            $('.result-factura').mCustomScrollbar
            ({
                theme:"my-theme"
            })
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })
    }
}
function seleccionarFacturaNotaDebito($this, actions)
{
    $.ajax
    ({
        url:  '',
        type: 'post',
        data: { "controller" : "NotaDebito" , "action" : "obtenerFacturaNotaDebito" , 'numeroFactura' : actions.factura },
        dataType : actions.dataType
    }).done( ( response ) =>
    {
        listProductos = response.ids
        $(".recibe-producto-nota-debito > tbody").html( response.products )
        initSelect2()

        _notaDebito.totalFactura = response.totalInvoice
        _notaDebito.numeroFactura = actions.factura

        $("#idventa").val( actions.idventa )

        $(".conceptCredit").removeAttr("disabled")
        $(".tipo_aumento").removeAttr("disabled")
        $('#observaciones').removeAttr("disabled");

        $(".btnEnviarNotaDebito").removeAttr("disabled")

        $(".total-invoice").html( formatFe(_notaDebito.totalFactura) )
        $(".totalFacturaAnterior").html( formatFe(_notaDebito.totalFactura) )

        $('#conceptCredit').val('1').trigger('change');
        $('#tipoDescuento').removeAttr("disabled");

        $("#valor").val("")
        $("#fecha").val("")

        $("#agregarProductos").show() 

        $(".factura").val(_notaDebito.numeroFactura)

        cerrarPanelLateralDerecho()
    })
    .fail( ( error ) =>
    {
        console.log("error" , error)
        manageError(error)
    })
    
}
function seleccionarFacturaNotaCredito($this , actions)
{   
    $.ajax
    ({
        url:  '',
        type: 'post',
        data: { "controller" : "NotaCredito" , "action" : "obtenerFacturaNotaCredito" , 'numeroFactura' : actions.factura },
        dataType : actions.dataType
    }).done( ( response ) =>
    {
        $(".recibe-producto-nota-credito > tbody").html( response.products )
        
        initSelect2()

        $(".subtotal-invoice").html( formatFe(response.subTotal) )
        $(".texto_descuento").html( response.porcentajeDescuento + ' %' )
        $(".subtotal-descuento").html( formatFe(response.valorDescuento) )
        $(".iva-invoice").html( formatFe(response.ivaValor) )
        $(".total-invoice").html( formatFe(response.totalInvoice) )
        $("#idventa").val( actions.idventa )

        console.log( response )

        
        _notaCredito.totalFactura = response.totalInvoice
        _notaCredito.totalDescontoPorProducto = response.totalInvoice
        _notaCredito.numeroFactura = actions.factura
        _notaCredito.totalNotaCredito = response.totalNotaCredito
        

        if( _notaCredito.totalNotaCredito > 0 )
        {
            $(".infoTotalNotasRealizadas").css({display:"block"}).html( `La factura seleccionada tiene nota(s) crédito por valor de ${formatFe(_notaCredito.totalNotaCredito)}. <br>El valor máximo permitido es ${numberFormatFE(response.totalInvoice)}`).addClass('animated bounceInDown').one("animationend oAnimationEnd mozAnimationEnd webkitAnimationEnd", function() 
            {
                $(this).removeClass('animated bounceOutDown')
            })
        }
        else if( $(".infoTotalNotasRealizadas").is(":visible") )
        {
            $(".infoTotalNotasRealizadas").css({display:"block"}).addClass('animated bounceOutUp').one("animationend oAnimationEnd mozAnimationEnd webkitAnimationEnd", function() 
            {
                $(this).removeClass('animated bounceOutUp').css({display:"none"})
            })
        }
    

        //$('#conceptCredit').val('1').trigger('change');
        $('#tipoDescuento').removeAttr("disabled");
        $('#observaciones').removeAttr("disabled");
        $('#observaciones').removeAttr("disabled");
        $('#valor').removeAttr("disabled");

        $("#valor").val("")
        $("#fecha").val("")

        $(".factura").val(actions.factura)
 

        cerrarPanelLateralDerecho()
    })
    .fail( ( error ) =>
    {
        console.log("error" , error)
        manageError(error)
    })
}
function seleccionarItemNotaCredito($this, actions)
{
    let cantidad = $this.parents("tr").find(".cantidad").val()
    let precio = $this.parents("tr").find(".precio").val()
    let parts = $this.parents("tr").find(".iva option:selected").text().split(" ")
    let iva = Number(parts[0])

    if( $this.is(":checked") )
    {
        $this.parents("tr").find(".cantidad,.precio,.iva,.idproductos,.costos").removeAttr("disabled")
        _notaCredito.totalSeleccionadoNotaCredito += (cantidad*precio) + ((cantidad*precio) * iva / 100)
    }
    else
    {
        $this.parents("tr").find(".cantidad,.precio,.iva,.idproductos,.costos").attr("disabled","disabled")
        _notaCredito.totalSeleccionadoNotaCredito -= (cantidad*precio) + ((cantidad*precio) * iva / 100)
    }
}
function resetearInputCreditNote($this , actions)
{
    let value = $this.siblings('input').data("value")
    $this.siblings('input').val( value )
    calculateTotalCreditNote( null , null )
}
function tipoValorNotaDebito($this , actions )
{
    let texto = ""

    if( $this.val() == 1 )
    {
        texto = "Valor del descuento"
        $(".valor").val("")
        $(".valor").removeAttr("disabled")
        $(".valor").attr("placeholder",texto)
    }
    else if ( $this.val() == 2 )
    {
        texto = "Porcentaje de descuento"
        $(".valor").val("")
        $(".valor").removeAttr("disabled")
        $(".valor").attr("placeholder",texto)
    }
    else
    {
        $(".valor").prop("disabled",true)
        $(".valor").val("")
    }
    _notaDebito.valorAumentado = 0 
    $(".aumento").html( formatFe(_notaDebito.totalAumentoPorProducto ) ) 
}
function changeVentaTipo($this , actions )
{
    $(".fecha").removeAttr("readonly")
    //$("#fechaPagoFactura").removeAttr("disabled")

    //var date = $("#fechaPagoFactura").kendoDatePicker().data("kendoDatePicker");
    //date.enable();
    //$("#fechaPagoFactura").parent().find("label").removeClass("lbDisabled").addClass("lbError")
}
function tipoDescuentoNotaCredito($this , actions )
{
    let texto = ""

    if( $this.val() == 1 )
        texto = "Valor del descuento"
    else if ( $this.val() == 2 )
        text = "Porcentaje de descuento"
    else
        $(".valor").prop("disabled",true)

   
    if( $this.val() == 1 ||  $this.val() == 2 )
    {
        $(".valor").val("")
        $(".valor").removeAttr("disabled")
        $(".valor").attr("placeholder",texto)
    }
    _notaCredito.valorDescontado = 0 
    $(".descuento").html( formatFe(_notaCredito.totalDescontoPorProducto ) ) 
}
function changeInva($this , actions )
{
}
function detalleDocumento($this, actions)
{
   $.ajax
   ({
       url:  '',
       type: 'post',
       data: { "controller" : "Documents" , "action" : "detalleDocumento" , "id" : actions.row.id , "tipo" : actions.row.tipo },
       dataType : actions.dataType
   }).done( ( response ) =>
   {
        let tipo = ''
        if( actions.row.tipo == 1 )
          tipo = 'venta'
        if( actions.row.tipo == 2 )
          tipo = 'nota crédito'
        if( actions.row.tipo == 3 )
            tipo = 'nota débito'
        addModal
        ({
            id : `modalDetalleVenta`,
            class : `modal-simple modal-lg`,
            close : true,
            title: `Detalle de la ${tipo}`,
            body : `${response.message}`,
            buttonClose : true ,
            buttonAction : false ,
            buttonActionText : ``,
            modalType : ``
        })
   })
}
function enviarDocumento($this , actions)
{
    
    if( typeof socket !== 'undefined' ) 
    {
        $this.hide()
        $this.siblings(".cssload-container").show()
        socket.emit('generarDocumento' , { id : actions.row.id , nroDocumento: actions.row.numero , token : localStorage.getItem('token') ,  tipo : actions.row.tipo  });
    }
    else 
    {
        console.log("No se puede enviar el documento")
    }

}
function consultarDocumentoDIAN($this , actions)
{
   $this.hide()
   $this.siblings(".cssload-container").show()
   socket.emit('ConsultarDocumentoDIAN' , { "tipo" : actions.row.tipo ,
                                            "documento" : actions.row.numero ,
                                            'id' : actions.row.id });
}
function detalleVenta($this, actions)
{
   $.ajax
   ({
       url:  '',
       type: 'post',
       data: { "controller" : "Factura" , "action" : "detalleVenta" , "idventa" : actions.idventa }
   }).done( ( response ) =>
   { 
        addModal
        ({
            id : `modalDetalleVenta`,
            class : `modal-simple modal-90`,
            close : true,
            title: `Detalle de la factura`,
            body : `${response}`,
            buttonClose : true ,
            buttonAction : false ,
            buttonActionText : ``,
            modalType : ``
        })
   })
}
function detalleOrden($this, actions)
{
   $.ajax
   ({
       url:  '',
       type: 'post',
       data: { "controller" : "Factura" , "action" : "detalleOrden" , "id" : actions.id }
   }).done( ( response ) =>
   { 
        addModal
        ({
            id : `modalDetalleOrden`,
            class : `modal-simple modal-90`,
            close : true,
            title: `Detalle de la factura`,
            body : `${response}`,
            buttonClose : true ,
            buttonAction : false ,
            buttonActionText : ``,
            modalType : ``
        })
   })
}
function abonoVenta($this, actions)
{
    $.ajax
    ({
        url:  '',
        type: 'post',
        data: { "controller" : "Factura" , "action" : "abonoVenta" , "idventa" : actions.idventa }
    }).done( ( response ) =>
    { 
         addModal
         ({
             id : `modalDetalleVenta`,
             class : `modal-simple modal-center`,
             close : true,
             title: `Abono factura`,
             body : `${response}`,
             buttonClose : true ,
             buttonAction : false ,
             buttonActionText : ``,
             modalType : ``
         })
    })
}
function detalleCompra($this, actions)
{
   $.ajax
   ({
       url:  '',
       type: 'post',
       data: { "controller" : "Compra" , "action" : "detalleCompra" , "idcompra" : actions.idcompra }
   }).done( ( response ) =>
   { 
        addModal
        ({
            id : `modalDetalleCompra`,
            class : `modal-simple modal-90`,
            close : true,
            title: `Detalle de la compra`,
            body : `${response}`,
            buttonClose : true ,
            buttonAction : false ,
            buttonActionText : ``,
            modalType : ``
        })
   })
}
function agregarProductoOrden($this , actions)
{
    let ivaPercent = obtenerIvaPorId(actions.ivas, actions.iva_id)
    let parts = ivaPercent.toString().split(" ")
    ivaPercent = parts[0]
    let indice = $('.recibe-producto-orden tbody tr').length + 1
    
    let iva = ( ( 1 * actions.precio ) * ivaPercent ) / 100
    let total = ( 1 * actions.precio ) + iva
   
    let selectOptionIva = `<select name="ivas[]" class="iva select2-simple change" data-actions='{"fn":"calcularTotalOrdenCompra"}'>`
    if( actions.ivas.length > 0 )
    {
        let selected = "";
        actions.ivas.forEach(element =>
        {
            if( Number(element.id) == Number(actions.iva_id) )
                selected = "selected=selected";

            selectOptionIva += `<option value='${element.id}' ${selected}>${element.value}</option>`
        });
        selectOptionIva += "</select>";
    }

    $('.recibe-producto-orden tbody').append(`<tr>
                                <input type="hidden" name="idproductos[]" value='${actions.idproducto}' />
                                <td class="text-center">${indice}</td>
                                <td class="text-center"><i class="icon ion-md-trash click" data-actions='{"fn":"eliminarProductoOrdenCompra","idproducto":"${actions.idproducto}"}' style="font-size:24px"></i></td>
                                <td class="text-left">${actions.nombre}</td>
                                <td class="text-right" >
                                    <input type="text" data-actions='{"fn":"calcularTotalOrdenCompra"}' style="width:100px; float:right; padding-right:25px" name="cantidades[]" class="form-control keyup text-right cantidad" data-min=1  data-value=1 data-max=${actions.cantidad} data-validate='validate(number,min(1))' />
                                </td>
                                <td class="text-right" >
                                    <input type="text" data-actions='{"fn":"calcularTotalOrdenCompra"}' style="width:100px; float:right; padding-right:25px" name="costos[]"   class="form-control keyup text-right costo" data-min=1 value=${actions.costo} data-value=${actions.costo}  data-validate='validate(number,min(1))' />
                                </td>
                                <td class="text-right" >
                                    <input type="text" data-actions='{"fn":"calcularTotalOrdenCompra"}' style="width:100px; float:right; padding-right:25px" name="precios[]"   class="form-control keyup text-right precio" data-min=1 value=${actions.precio} data-value=${actions.precio}  data-validate='validate(number,min(1))' />
                                </td>
                                <td class="text-right" >
                                    ${selectOptionIva}
                                </td>
                                <td class="text-right" >
                                    ${numberFormatFE(iva)}
                                </td>
                                <td>
                                    <textarea class='form-control' name='observaciones[]'></textarea>
                                </td>
                                <td class="text-right" >
                                  <label class='subtotal-item' style="font-weight:bold;" >${numberFormatFE(total)}</label>
                                </td>
                                
                            </tr>`)
    $(".select2-simple").select2({width: '100%' })
    $this.parents("tr").remove()
 
    $(".btn-guardar-orden-compra").removeAttr("disabled")

    listProductos.push( actions.idproducto )

    calcularTotalOrdenCompra(null,null)


    $(".btn-save").removeAttr("disabled")
    $('.erase-input').tooltip();
}
function calcularTotalOrdenCompra($this, actions)
{
    let totalOrdenSinIva = 0
    let totalIvaOrden = 0

    $(".recibe-producto-orden > tbody > tr").each((index , elem)  =>
    {
        let cantidad = Number($(elem).find(".cantidad").val())
        let precio = Number($(elem).find(".costo").val())
        let parts = $(elem).find(".iva option:selected").text().split(" ")
        let iva = Number(parts[0])

        let total =( cantidad * precio )
        let ivaValue = ( ( cantidad * precio ) * iva ) / 100

        totalOrdenSinIva += total
        totalIvaOrden+= ivaValue

        $(elem).find('.subtotal-item').html( formatFe(total) )
    })
    $('.subtotal-orden').html( numberFormatFE(totalOrdenSinIva) )
    $('.iva-orden').html( numberFormatFE(totalIvaOrden) )
    $('.total-orden').html( numberFormatFE(totalOrdenSinIva+totalIvaOrden) )

}
function abonoCompra($this, actions)
{
    $.ajax
    ({
        url:  '',
        type: 'post',
        data: { "controller" : "Compra" , "action" : "abonoCompra" , "idcompra" : actions.idcompra }
    }).done( ( response ) =>
    { 
         addModal
         ({
             id : `modalDetalleAbonoCompra`,
             class : `modal-simple modal-center`,
             close : true,
             title: `Abono proveedor`,
             body : `${response}`,
             buttonClose : true ,
             buttonAction : false ,
             buttonActionText : ``,
             modalType : ``
         })
         initPlugins()
    })
}
function mostrarModalCrearProducto()
{
    let alturaPagina = $('body').height()
    let alturaSiteNavBar = $('.site-navbar').height()

    $("#buscarProducto").focus()

    let panelRow1 = $(".panel-buscar-producto-row").eq(0).height()
    let panelRow2 = $(".panel-buscar-producto-row").eq(1).height()

    let alturaElemento = alturaPagina - ( alturaSiteNavBar + panelRow1 + panelRow2 + 62 )

    $('.result-producto').css({height: alturaElemento + "px"})

    $(".panel-buscar-producto").animate
    ({
        right : 0
    },
    {
      easing: 'easeInSine'
    })
}
function agregarProductoCreacion($this , actions)
{
    let indice = $('.recibe-producto-crear tbody tr').length + 1
    
    $('.recibe-producto-crear tbody').append(`<tr>
                                <input type="hidden" name="idproductos[]" value='${actions.idproducto}' />
                                <input type="hidden" name="costos[]" value='${actions.costo}' />
                                <td class="text-center">${indice}</td>
                                <td class="text-left">${actions.nombre}</td>
                                <td class="text-right">${numberFormatFE(actions.costo)}</td>
                                <td class="text-right" >
                                    <input type="text" style="width:100px; float:right; padding-right:25px" name="cantidades[]" class="form-control text-right validar numero requerido" data-min=1 value=1 data-value=1 data-max=${actions.cantidad} />
                                </td>
                                <td class="text-center"><i class="icon ion-md-trash click" data-actions='{"fn":"eliminarProductoCreacion","idproducto":"${actions.idproducto}"}' style="font-size:24px"></i></td>
                            </tr>`)
    $this.parents("tr").remove()
    listProductos.push( actions.idproducto )

    $(".btn-save").removeAttr("disabled")
}
function eliminarProductoCreacion($this, actions)
{
    $this.parents('tr').remove()
    /*
    if ( $('#tabla >tbody >tr').length == 0 )
    {
        $(".btn-save").attr("disabled" , 'disabled' )
    }
    */
    for( var i = 0 ; i < listProductos.length  ; i++ )
    {
        if (listProductos[i] == actions.idproducto )
        {
            listProductos.splice(i, 1)
        }
    }
    $(".recibe-producto-crear tbody tr").each((index , elem)  =>
    {
        $(elem).find("td:eq(0)").html(index+1)
    }) 
}
function eliminarNomina($this, actions)
{
    alertify.confirm('', 'Esta seguro de eliminar la nomina?', () =>
    { 
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: { "controller" : "Nomina" , "action" : "eliminarNomina", "id" : actions.id },
            dataType : 'json'
        }).done( (response ) =>
        {
            if( response.status )
              $this.parents("tr").remove()
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })

    },() => {} )

}
function eliminarOrden($this, actions)
{
    alertify.confirm('', 'Esta seguro de eliminar la orden?', () =>
    { 
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: { "controller" : "Factura" , "action" : "eliminarOrden", "id" : actions.id },
            dataType : 'json'
        }).done( (response ) =>
        {
            if( response.status )
              $this.parents("tr").remove()
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })

    },() => {} )

}
function eliminarEgreso($this, actions)
{
    alertify.confirm('', 'Esta seguro de eliminar el egreso?', () =>
    { 
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: { "controller" : "Egreso" , "action" : "eliminarEgreso", "idegreso" : actions.idegreso },
            dataType : 'json'
        }).done( (response ) =>
        {
            if( response.status )
              $this.parents("tr").remove()
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })

    },() => {} )

}
function eliminarUsuario($this, actions)
{
    alertify.confirm('', 'Esta seguro de eliminar este trabajador?', () =>
    { 
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: { "controller" : "Usuario" , "action" : "eliminarUsuario", "idtrabajador" : actions.idtrabajador },
            dataType : 'json'
        }).done( (response ) =>
        {
            if( response.status )
              $this.parents("tr").remove()
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })

    },() => {} )

}
function eliminarBanco($this, actions)
{
    alertify.confirm('', 'Esta seguro de eliminar esta banco?', () =>
    { 
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: { "controller" : "Banco" , "action" : "eliminarBanco", "idbanco" : actions.id },
            dataType : 'json'
        }).done( (response ) =>
        {
            if( response.status )
              $this.parents("tr").remove()
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })

    },() => {} )

}
function eliminarRecibo($this, actions)
{
    alertify.confirm('', 'Esta seguro de eliminar este recibo de caja?', () =>
    { 
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: { "controller" : "Recibo" , "action" : "eliminarRecibo", "idrecibo" : actions.id },
            dataType : 'json'
        }).done( (response ) =>
        {
            if( response.status )
              $this.parents("tr").remove()
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })

    },() => {} )

}
function formularioAgregarProducto($this, actions)
{
    $.ajax
    ({
        url:  '',
        type: 'post',
        data: { "controller" : "Bodega" , "action" : "formularioAgregarProducto" , "idbodega" : actions.row.id , "bodega" : actions.row.nombre }
    }).done( ( response ) =>
    { 
        addModal
        ({
            id : `modal`,
            class : `modal-simple modal-90`,
            close : true,
            title: ``,
            body : `${response}`,
            buttonClose : true ,
            buttonAction : false ,
            buttonActionText : ``,
            modalType : ``
        }) 
    })
}
function agregarProductoBodega($this , actions)
{
    
    let indice = $('.recibe-producto-bodega tbody tr').length + 1

    $('.recibe-producto-bodega tbody').append(`<tr>
                                <input type="hidden" name="idproductos[]" value='${actions.idproducto}' />
                                <td class="text-center">${indice}</td>
                                <td class="text-center"><i class="icon ion-md-trash click" data-actions='{"fn":"eliminarProductoVenta","idproducto":"${actions.idproducto}"}' style="font-size:24px"></i></td>
                                <td class="text-left">${actions.nombre}</td>
                                <td class="text-right" >
                                    <input type="text"style="width:100px; float:right; padding-right:25px" name="cantidades[]" class="form-control keyup text-right cantidad" data-validate='validate(number,min(0))'  />
                                </td>
                            </tr>`)
    $this.parents("tr").remove()
 
}
function eliminarProductoBodega($this, actions)
{
    alertify.confirm('', 'Esta seguro de eliminar el producto de la bodega?', () =>
    { 
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: { "controller" : "Bodega" , "action" : "eliminarProductoBodega", "id" : actions.id },
            dataType : 'json'
        }).done( (response ) =>
        {
            if( response.status )
              $this.parents("tr").remove()
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })

    },() => {} )

}
function eliminarBodega($this, actions)
{
    alertify.confirm('', 'Esta seguro de eliminar esta bodega?', () =>
    { 
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: { "controller" : "Bodega" , "action" : "eliminarBodega", "id" : actions.id },
            dataType : 'json'
        }).done( (response ) =>
        {
            if( response.status )
              $this.parents("tr").remove()
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })

    },() => {} )

}
function eliminarProducto($this, actions)
{
    alertify.confirm('', 'Esta seguro de eliminar este producto?', () =>
    { 
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: { "controller" : "Inventario" , "action" : "eliminarProducto", "idproducto" : actions.idproducto , "idbodega" : actions.idbodega },
            dataType : 'json'
        }).done( (response ) =>
        { 
            if( response.status )
              $this.parents("tr").remove()
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })

    },() => {} )

}
function eliminarMarcaProducto($this, actions)
{
    alertify.confirm('', 'Esta seguro de eliminar esta marca?', () =>
    { 
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: { "controller" : "Configuracion" , "action" : "eliminarMarca", "idmarca" : actions.idmarca },
            dataType : 'json'
        }).done( (response ) =>
        { 
            if( response.status )
              $this.parents("tr").remove()
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })

    },() => {} )

}
function eliminarMarcas($this, actions)
{
    alertify.confirm('', 'Esta seguro de eliminar esta marca?', () =>
    { 
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: { "controller" : "Web" , "action" : "eliminarMarcas", "idmarca" : actions.idmarca },
            dataType : 'json'
        }).done( (response ) =>
        { 
            if( response.status )
              $this.parents("tr").remove()
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })

    },() => {} )

}
function eliminarPromociones($this, actions)
{
    alertify.confirm('', 'Esta seguro de eliminar esta promoción?', () =>
    { 
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: { "controller" : "Web" , "action" : "eliminarPromociones", "idpromocion" : actions.idpromocion },
            dataType : 'json'
        }).done( (response ) =>
        { 
            if( response.status )
              $this.parents("tr").remove()
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })

    },() => {} )

}
function imprimirReporteVentasExcel()
{
    $.ajax
    ({
        type: 'post',
        url:  "excel/ventasPorCliente.php" ,
        data: {},
        success: function(data)
        { 
            window.open("excel/"+data);                                                   
        } 
    })
}
function exportarInventarioExcel()
{
    mostrarLoadingFull()
    $.ajax
    ({
        type: 'post',
        url:  "excel/inventario.php" ,
        data: {},
        success: function(data)
        { 
            ocultarLoadingFull()
            window.open("excel/"+data.trim());                                                   
        } 
    })
}
function eliminarProveedor($this, actions)
{
    alertify.confirm('', 'Esta seguro de eliminar este proveedor?', () =>
    { 
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: { "controller" : "Proveedor" , "action" : "eliminarProveedor", "idproveedor" : actions.idproveedor },
            dataType : 'json'
        }).done( (response ) =>
        {   
            if( response.status )
              $this.parents("tr").remove()
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })

    },() => {} )

}
function eliminarCotizacion($this, actions)
{
    alertify.confirm('', 'Esta seguro de eliminar esta cotización?', () =>
    { 
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: { "controller" : "Factura" , "action" : "eliminarCotizacion", "idcotizacion" : actions.idcotizacion },
            dataType : 'json'
        }).done( (response ) =>
        {   
            if( response.status )
              $this.parents("tr").remove()
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })

    },() => {} )

}
function eliminarCliente($this, actions)
{
    alertify.confirm('', 'Esta seguro de eliminar este cliente?', () =>
    { 
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: { "controller" : "Cliente" , "action" : "eliminarCliente", "idcliente" : actions.idcliente},
            dataType : 'json'
        }).done( (response ) =>
        {   
            if( response.status )
              $this.parents("tr").remove()
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })

    },() => {} )

}
function eliminarResolucion($this, actions)
{
    alertify.confirm('', 'Esta seguro de eliminar este resolución?', () =>
    { 
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: { "controller" : "Factura" , "action" : "eliminarResolucion", "id" : actions.id},
            dataType : 'json'
        }).done( (response ) =>
        {   
            if( response.status )
              $this.parents("tr").remove()
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })

    },() => {} )

}
function ViewNotifications()
{ 
    $.ajax
    ({
        type: 'POST',
        url:  '',
        data: { 'controller' : 'Notificacion' , 'action' : 'verNotificaciones' } , 
        dataType : 'json',
    }).done( ( data ) =>
    {
        if( data.cantidad > 0 )
        { 
            $(".contadorNotificaciones").
            show().
            html( data.cantidad ).
            removeClass( (data.cantidad >= 100) ? 'radio50' : 'radio30' ).
            addClass( (data.cantidad >= 100) ? 'radio30' : 'radio50' )
            $("#bell" ).addClass('bell_animation');

            $(".listaNotificaciones").html( data.html )
            //audio.play();
        }
        else
        { 
            $("#bell" ).removeClass('bell_animation');
        }  
    })
    .fail( ( error ) =>
    {
        console.log("error" , error)
        manageError(error)
    })
} 
function verDetalleNotificacion()
{ 
    if($(".notificationContenido").is(":hidden"))
    {
      $(".notificationContenido").css({display:'block'})
      TweenMax.staggerFrom(".notificationContenido", 1, { y:  50 ,opacity:0,  delay:0.1, ease:Back.easeOut}, 0.1)
      TweenMax.staggerFrom(".listaNotificaciones li", 1, { y:  50 ,opacity:0,  delay:0.1, ease:Back.easeOut}, 0.1)
    }
    else
    {
        $(".notificationContenido").fadeOut()
    }
}
function obtenerCiudadesCliente($this, actions)
{
    if( $this.val() >= 1 )
    {
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: { "controller" : "Cliente" , "action" : "obtenerCiudadesCliente" , "cliente_id" : $this.val() },
        }).done( (ciudades) =>
        {   
            $("#ciudad").html( ciudades )
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })
    }
}
function obtenerCiudades($this, actions)
{
    if( $this.val() >= 1 )
    {
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: { "controller" : "Cliente" , "action" : "obtenerCiudades" , "departamento_id" : $this.val() },
        }).done( (ciudades) =>
        {   
            $("#ciudad").html( ciudades )
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })
    }
    
}
function obtenerListaPrecio($this, actions)
{
    if( $this.val() >= 1 )
    {
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: { "controller" : "Factura" , "action" : "obtenerListaPrecio" , "cliente_id" : $this.val() },
        }).done( (precios) =>
        {   
            $("#listaprecio").html( precios )
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })
    }
    if( $this.val() >= 1 )
    {
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: { "controller" : "Cliente" , "action" : "obtenerCiudadesCliente" , "cliente_id" : $this.val() },
        }).done( (ciudades) =>
        {   
            $("#ciudad_id").html( ciudades )
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })
    }
}
function obtenerSucursales($this, actions)
{
    if( $this.val() >= 1 )
    {
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: { "controller" : "Banco" , "action" : "obtenerSucursales" , "banco_id" : $this.val() },
        }).done( (sucursales) =>
        {   
            $("#sucursal").html( sucursales )
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })
    }
}
function obtenerPermisosUsuario($this, actions)
{
    $.ajax
    ({
        url:  '',
        type: 'post',
        data: { "controller" : "Usuario" , "action" : "obtenerPermisosUsuario" , "usuario_id" : $this.val() },
    }).done( (data) =>
    {   
        $("#respuestaAccesos").html( data )
    })
    .fail( ( error ) =>
    {
        console.log("error" , error)
        manageError(error)
    })
}
function actualizarMenuPermiso($this , actions)
{
    var index = $this.data('index') 
    $(".chAccess"+index).prop("checked", $this.is(":checked") )

    var status = false

    if( $this.is(":checked") )
    {
        status = true
    }

    dataForm = $this.parents(".content_access").find("form").serializeFormJSON() 
    dataForm.status = status 
    dataForm.menu_id = $this.val()
    dataForm.controller = "Usuario"
    dataForm.action = "actualizarMenuPermisoUsuario"
    
    $.ajax
    ({
        url:  '',
        type: 'post',
        data: dataForm,
        dataType: 'json'
    }).done( (data) =>
    {   
    })
}
function actualizarSubMenuPermiso($this, actions)
{
    var status = false
    if( $this.is(":checked") )
    {
        status = true
    }

    console.log("status", status)
    console.log("value", $this.val() )
    console.log("idusuario", actions.idusuario)
    
    $.ajax
    ({
        url:  '',
        type: 'post',
        data: { 'controller': 'Usuario', 'action' : 'actualizarSubMenuPermiso', 'submenu_id' : $this.val(), 'usuario_id' : actions.idusuario, 'status' : status },
        dataType: 'json'
    }).done( (data) =>
    {   
    })   
}
function mostrarModalAgregarListaPrecio()
{
    $("#buscarProducto").focus()

    $(".panel-buscar-producto").animate
    ({
        right : 0
    },
    {
      easing: 'easeInSine'
    })
}
function mostrarModalAgregarClienteLista()
{
    
    $("#buscarCliente").focus()
    
    $(".panel-buscar-cliente").animate
    ({
        right : 0
    },
    {
      easing: 'easeInSine'
    })
}
function mostrarModalAgregarCodigoCliente()
{
    let alturaPagina = $('body').height()
    let alturaSiteNavBar = $('.site-navbar').height()
    

    $("#buscarProducto").focus()

    let panelRow1 = $(".panel-buscar-producto-row").eq(0).height()
    let panelRow2 = $(".panel-buscar-producto-row").eq(1).height()

    let alturaElemento = alturaPagina - ( alturaSiteNavBar + panelRow1 + panelRow2 + 62 )

    //$('.result-producto-lista-precio').css({height: alturaElemento + "px"})

    $(".panel-buscar-producto").animate
    ({
        right : 0
    },
    {
      easing: 'easeInSine'
    })
}
function editarListaPrecio( $this , actions )
{
    $.ajax
    ({
        url:  '',
        type: 'post',
        data: {'controller': 'Configuracion', 'action': 'editarListaPrecio' , 'idlista': actions.idlista},
        dataType : 'json'
    }).done( ( response ) =>
    {
        listProductos = response.listProductos
        listClientes = response.listClientes

        console.log("listProductos", listProductos)
        console.log("listClientes", listClientes)

        $(".body-response").html(response.html)
        initSelect2()
    })
    .fail( ( error ) =>
    {
        console.log("error" , error)
        manageError(error)
    })
}
function editarProducto( $this , actions )
{
    $.ajax
    ({
        url:  '',
        type: 'post',
        data: {'controller': 'Inventario', 'action': 'editarProducto' , 'idproducto': actions.idproducto},
        dataType : 'json'
    }).done( ( response ) =>
    {
        listProductos = response.ids
        $(".body-response").html(response.html)
        initSelect2()
    })
    .fail( ( error ) =>
    {
        console.log("error" , error)
        manageError(error)
    })
}
function eliminarListaPrecio( $this , actions )
{
    alertify.confirm('', 'Esta seguro de eliminar esta lista de precios?', () =>
    { 
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: {'controller': 'Configuracion', 'action': 'eliminarListaPrecio' , 'idlista': actions.idlista},
            dataType : 'json'
        }).done( ( response ) =>
        {
            $this.parents("tr").remove()
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })
    },() => {} )
}
function eliminarProductoListaPrecio($this, actions)
{
    $this.parents('tr').remove()
  

    for( var i = 0 ; i < listProductos.length  ; i++ )
    {
        if (listProductos[i] == actions.idproducto )
        {
            listProductos.splice(i, 1)
        }
    }
    $(".recibe-producto-lista-precio tbody tr").each((index , elem)  =>
    {
        $(elem).find("td:eq(0)").html(index+1)
    })

}
function eliminarCodigoCliente( $this , actions )
{
    alertify.confirm('', 'Esta seguro de eliminar este item?', () =>
    { 
        $.ajax
        ({
            url:  '',
            type: 'post',
            data: {'controller': 'Configuracion', 'action': 'eliminarCodigoCliente' , 'id': actions.id},
            dataType : 'json'
        }).done( ( response ) =>
        {
            $this.parents("tr").remove()
        })
        .fail( ( error ) =>
        {
            console.log("error" , error)
            manageError(error)
        })
    },() => {} )
}
function eliminarProductoCodigoCliente($this, actions)
{
    $this.parents('tr').remove()

    for( var i = 0 ; i < listProductos.length  ; i++ )
    {
        if (listProductos[i] == actions.idproducto )
        {
            listProductos.splice(i, 1)
        }
    }
    $(".recibe-producto-codigo-cliente tbody tr").each((index , elem)  =>
    {
        $(elem).find("td:eq(0)").html(index+1)
    })
    

}
function eliminarClienteListaPrecio($this, actions)
{
    $this.parents('tr').remove()

    for( var i = 0 ; i < listClientes.length  ; i++ )
    {
        if (listClientes[i] == actions.idcliente )
        {
            listClientes.splice(i, 1)
        }
    }
    $(".recibe-cliente-lista-precio tbody tr").each((index , elem)  =>
    {
        $(elem).find("td:eq(0)").html(index+1)
    })
    

}
function mostrarOcultarConcepto($this, actions)
{
    if( $("#l2").is(":hidden") )
    {
        $("#concepto_text").removeAttr("disabled")
        $("#concepto_list").attr("disabled","disabled")
        $("#l1").hide()
        $("#l2").show()
    }
    else
    {
        $("#concepto_list").removeAttr("disabled")
        $("#concepto_text").attr("disabled","disabled")
        $("#l1").show()
        $("#l2").hide()
    }
}
function mostrarOcultarContacto($this, actions)
{
    if( $("#l2").is(":hidden") )
    {
        $("#label").html("Contacto ocasional")
        $("#contacto_text").removeAttr("disabled")
        $("#proveedor_list").attr("disabled","disabled")
        $("#l1").hide()
        $("#l2").show()
    }
    else
    {
        $("#label").html("Proveedor")
        $("#contacto_text").attr("disabled","disabled") 
        $("#proveedor_list").removeAttr("disabled")
        $("#l1").show()
        $("#l2").hide()
    }
}
function graficoVentasPorMarcas($form, response)
{
    
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("ventasPorMarcas", am4charts.XYChart);

    

    chart.data = response.data

    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "name";
    categoryAxis.renderer.grid.template.location = 0;


    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inside = true;
    valueAxis.renderer.labels.template.disabled = true;
    valueAxis.min = 0;

    // Create series
    function createSeries(field, name) {
    
    // Set up series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.name = name;
    series.dataFields.valueY = field;
    series.dataFields.categoryX = "name";
    series.sequencedInterpolation = true;
    
    // Make it stacked
    series.stacked = true;
    
    // Configure columns
    series.columns.template.width = am4core.percent(60);
    series.columns.template.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}";
    
    // Add label
    var labelBullet = series.bullets.push(new am4charts.LabelBullet());
    labelBullet.label.text = "{valueY}";
    labelBullet.locationY = 0.5;
    
    return series;
}

//createSeries("Uyustoll", "Uyustoll");
createSeries(response.marca, response.marca);

// Legend
chart.legend = new am4charts.Legend();
    
}
function graficaVentasPorTiempo()
{
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("ventasPorTiempo", am4charts.XYChart);

    var data = [];

    chart.data = [{
    "year": "2014",
    "income": 23.5,
    "expenses": 21.1,
    "lineColor": chart.colors.next()
    }, {
    "year": "2015",
    "income": 26.2,
    "expenses": 30.5
    }, {
    "year": "2016",
    "income": 30.1,
    "expenses": 34.9
    }, {
    "year": "2017",
    "income": 20.5,
    "expenses": 23.1
    }, {
    "year": "2018",
    "income": 30.6,
    "expenses": 28.2,
    "lineColor": chart.colors.next()
    }, {
    "year": "2019",
    "income": 34.1,
    "expenses": 31.9
    }, {
    "year": "2020",
    "income": 34.1,
    "expenses": 31.9
    }, {
    "year": "2021",
    "income": 34.1,
    "expenses": 31.9,
    "lineColor": chart.colors.next()
    }, {
    "year": "2022",
    "income": 34.1,
    "expenses": 31.9
    }, {
    "year": "2023",
    "income": 34.1,
    "expenses": 31.9
    }, {
    "year": "2024",
    "income": 34.1,
    "expenses": 31.9
    }];

    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.ticks.template.disabled = true;
    categoryAxis.renderer.line.opacity = 0;
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.minGridDistance = 40;
    categoryAxis.dataFields.category = "year";
    categoryAxis.startLocation = 0.4;
    categoryAxis.endLocation = 0.6;


    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.line.opacity = 0;
    valueAxis.renderer.ticks.template.disabled = true;
    valueAxis.min = 0;

    var lineSeries = chart.series.push(new am4charts.LineSeries());
    lineSeries.dataFields.categoryX = "year";
    lineSeries.dataFields.valueY = "income";
    lineSeries.tooltipText = "income: {valueY.value}";
    lineSeries.fillOpacity = 0.5;
    lineSeries.strokeWidth = 3;
    lineSeries.propertyFields.stroke = "lineColor";
    lineSeries.propertyFields.fill = "lineColor";

    var bullet = lineSeries.bullets.push(new am4charts.CircleBullet());
    bullet.circle.radius = 6;
    bullet.circle.fill = am4core.color("#fff");
    bullet.circle.strokeWidth = 3;

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "panX";
    chart.cursor.lineX.opacity = 0;
    chart.cursor.lineY.opacity = 0;

    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.parent = chart.bottomAxesContainer;
}
function obtenerGraficoPorVentas( $form, data )
{ 
  
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("chartdiv", am4charts.XYChart3D);

    // Add data
    chart.data = data

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "trabajador";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.renderer.labels.template.hideOversized = false;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.tooltip.label.rotation = 270;
    categoryAxis.tooltip.label.horizontalCenter = "right";
    categoryAxis.tooltip.label.verticalCenter = "middle";

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Countries";
    valueAxis.title.fontWeight = "bold";

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries3D());
    series.dataFields.valueY = "total";
    series.dataFields.categoryX = "trabajador";
    series.name = "Total";
    series.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = .8;

    var columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    columnTemplate.stroke = am4core.color("#FFFFFF");

    columnTemplate.adapter.add("fill", function(fill, target) {
    return chart.colors.getIndex(target.dataItem.index);
    })

    columnTemplate.adapter.add("stroke", function(stroke, target) {
    return chart.colors.getIndex(target.dataItem.index);
    })

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.strokeOpacity = 0;
    chart.cursor.lineY.strokeOpacity = 0;
}
var debounce = function (func, wait, immediate) {
    var timeout
    return function() {
        var context = this, args = arguments
        var later = function() {
                timeout = null
                if (!immediate) func.apply(context, args)
        }
        var callNow = immediate && !timeout
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) func.apply(context, args)
    }
}