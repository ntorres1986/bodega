var ip = "localhost"
var listProductos = new Array()
var cliente; 
var codigoVenta = null
var $product = null
var ventaActual = null
_total = 0
_efectivo = 0
_cambio = 0
var _idusuario, _nombreUsuario

var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
var dataBase = null

//startDB()


function pantallaCompleta() {

    if( $("#pantallaCompleta").html() == "Pantalla completa")
    {
      launchFullScreen(document.documentElement);
      $("#pantallaCompleta").html("Salir")
      setTimeout(() => {
        ajustarAltura()
      }, 1000);
    }
    else 
    {
      cancelFullscreen()
      setTimeout(() => {
        ajustarAltura()
      }, 1000);
      $("#pantallaCompleta").html("Pantalla completa")
    }
    
}
function launchFullScreen(element) {
  if(element.requestFullScreen) {
    element.requestFullScreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  }
}
function cancelFullscreen() {
  if(document.cancelFullScreen) {
    document.cancelFullScreen();
  } else if(document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if(document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen();
  }



}
function getContent( $this , actions )
{  
    _total = 0
    _efectivo = 0
    _cambio = 0
    listProductos = new Array()
    codigoVenta = null

  
    if( typeof actions.dataType == 'undefined' )
    actions.dataType = 'html'


    if( actions.accion == "ventasS" && typeof actions.codigo === 'undefined' )  
    { 
      $('#modalValidarCodigo').modal('show')    
    }
    else
    { 
      mostrarLoadingFull()
      $.ajax({
          url:  'get.php',
          type: 'post',
          data: { "accion" : actions.accion },
          dataType: actions.dataType
      }).done( ( response ) => {

          if( response.paginate == true )
          {
            $('#contenido').html( response.html ) 
              if( typeof response.fn !== 'undefined')
              {
                  window[response.fn]() 
                  $("select").chosen({disable_search_threshold: 10})
              }
          }
          else
          {
              $('#contenido').html( response ) 
              if( actions.accion == "ventasS" )
              { 
                $("#codigoVenta").val( md5( new Date() )  )
                $("#idusuario").val( actions.idusuario )
                $("#buscarProducto").val("").focus()

              }
          }
          $(".date").kendoDatePicker
          ({
              format: "yyyy-MM-dd"
          })
          
          if( $("#right_client").is(":visible") )
          ajustarAltura()

          $("select").chosen({disable_search_threshold: 10})
          //$("select").select2({width: '100%' })

          ocultarLoadingFull() 
  
          $('#modalErrorVenta').modal()
          $('#modalNuevoCliente').modal()
          $("#modalProductoExterno").modal()   
          
      })
      .fail( ( error ) => {
          console.log("error" , error)
      })
    }   
   
}
function ajustarAltura()
{
    let menu = $("#menu").height()
    let right_header = $("#right_header").height()
    let right_header_triangulo = $("#right_header-triangulo").height()
    let right_client = $("#right_client").height()

    let right_summary = $("#right_summary").height()
    let right_cancel_sale = $("#right_cancel_sale").height()
 
    let sumaAltura = Number(menu) + Number(right_header) + Number(right_header_triangulo) + Number(right_client) + Number(right_summary) + Number(right_cancel_sale)
    let altura = Number( $(window).height() ) - ( sumaAltura + 36 )

    $("#invoice__content").css({
      height : altura
    }) 
    
    let left_search = $("#left-search").height()
    sumaAltura = Number(menu) + Number(left_search) 
    altura = Number( $(window).height() ) - ( sumaAltura + 36 )
    $("#left-products").css({
      "max-height" : altura + 25
    })
}
function obtenerProductoVenta( $this, actions ) {
 
    $.ajax({
        url:  'get.php',
        type: 'post',
        data: { "accion" : 'obtenerProductoVenta', 'producto': $this.val(), 'listProductos': JSON.stringify(listProductos) },
        dataType:'json'
    }).done( ( response ) => {

        let html = ``
        response.productos.forEach(function(producto) {

          
            let productoStr = {
              'id': producto.id,
              'nombre': producto.nombre,
              'cantidad': producto.cantidad,
              'precio': producto.precio,
              'precio_minimo': producto.precio_minimo,
              'imagen': producto.imagen
            }

            let disabled = ""
            let agotado = ""
            let pass = `<div class="product_pass click" data-actions='{ "fn":"agregarProductoVenta", "producto": ${JSON.stringify(productoStr)} }' }' >
                            <h4>${producto.cantidad}</h4>
                        </div>`
            
            html += `<div class="product">  
                        ${agotado}           
                        <div class="product_content_image click" data-actions='{ "fn":"mostrarImagenProducto",  "producto": ${JSON.stringify(productoStr)} }'  >
                            <div class="product_image">
                                <img src="images/${producto.imagen}" class="imgVenta" />
                            </div>
                        </div>
                        <div class="product_name">${producto.nombre}</div>
                        <div class="data_product">
                          
                        </div>
                        ${pass}
                    </div> 
           `
        })
        $('#left-products').html( html ) 
    })
    .fail( ( error ) => {
        console.log("error" , error)
    })
} 
function agregarProductoALista( producto, db )
{ 
  $product = null
  $("#right_content").append( `<div class="item animated fadeInLeft faster">
                                  <div class='item_name'>${producto.nombre}</div>
                                  <div class='item_quantity'>
                                    <input type="number" name='cantidad[]' class='form-control keyup inputSelect inputCantidad' value="${producto.cantidadEscrita}" data-id=${producto.id} data-actions='{ "fn":"actualizarTotal"}'/>
                                  </div>
                                  <div class='item_quantity'>
                                    <input type="number" name='precio[]' data-prompt-position="bottomLeft"  class='form-control keyup inputSelect inputPrecio validate[required,custom[integer],min[${producto.precio}]]' value="${producto.precioEscrito}" data-id=${producto.id} data-actions='{ "fn":"actualizarTotal"}' />
                                  </div>
                                  <div class='item_remove click' data-actions='{ "fn":"eliminarProductoVenta", "id": ${producto.id}}'>
                                    <i class="material-icons" style="font-size: 48px">delete</i>
                                  </div>
 
                                  <input type='hidden' name='idproducto[]' value=${producto.id} />
                                  <input type='hidden' name='costos[]' value=${producto.id} />
                                  <input type='hidden' name='nombres_producto[]' value='${producto.nombre}' />
                                  <input type='hidden' name='tipos[]' value=${producto.tipo} />
                                </div>`) 
    if( $(".i_trash").hasClass("i_disabled") )
    {
        $(".i_trash").addClass("i_enabled").removeClass("i_disabled")
        $("#right_cancel_sale").addClass("enabled").removeClass("disabled")
        $("#sale").removeClass("disabled").addClass("enabled")
    }

    $("form").validationEngine({
      addFailureCssClassToField: "restaltar"
    })

    // if( db )
    // addProductoDB( producto )
}
function actualizarCantidadProducto($this, actions)
{ 
  if( $this.val() > 0 && !isNaN($this.val()) )
  {
    for(let i = 0; i < listProductos.length; i++ )
    {
        if( listProductos[i].id == actions.id )
        {
           listProductos[i].cantidadEscrita = $this.val()
        }
    }
  }
}
function actualizarPrecioProducto($this, actions)
{ 
  if( $this.val() > 0 && !isNaN($this.val()) )
  {
    for(let i = 0; i < listProductos.length; i++ )
    {
        if( listProductos[i].id == actions.id )
        {
           listProductos[i].precioEscrito = $this.val()
        }
    }
  }
}
function agregarProductoVenta($this, actions ) 
{  
  
  let producto = actions.producto

  let encontrado = false
  for (let index = 0; index < listProductos.length; index++)
  {
    const p = listProductos[index]
    if( p.id == producto.id )
    {      
      encontrado = true
      break
    }
    
  }
  if( !encontrado )
  {
      let error = false

      let number = Math.floor(Math.random() * (10000 - 1)) + 1;

      let cantidadEscrita = parseFloat( $this.parents('.product').find('.cantidad').val() )
      let precioEscrito = parseFloat( $this.parents('.product').find('.precio').val() )
      
      
                              
      $('#right_content').animate
      ({
          scrollTop: $(".item").length * 80
      }, 1000);
      
    
      producto.tipo = 1 
      if( cantidadEscrita > parseInt(producto.cantidad) || cantidadEscrita <= 0 || isNaN(cantidadEscrita) ) 
      {
          error = true
          $("#errorText").html('La cantiadad ingresada no es valida')
          $('#modalErrorVenta').modal('open'); 

          $this.parents('.product').find('.cantidad').effect( "shake" )

      }
      if( precioEscrito <= 0  || isNaN(precioEscrito) )
      {
          error = true
          $("#errorText").html('El precio  ingresado no es valido')
          $('#modalErrorVenta').modal('open') 
          $this.parents('.product').find('.precio').effect( "shake" )
      } 
  
   
      if( !error )
      {

        $("#buscarProducto").focus()
        
        producto.cantidadEscrita = cantidadEscrita
        producto.precioEscrito = precioEscrito
        listProductos.push( producto )

        agregarProductoALista(producto, true)
          
        $this.parents('.product').addClass("animated zoomOut")
        setTimeout(() => 
        {
            $this.parents('.product').remove()
        }, 500)

        let total =  obtenerTotal()
        $("#sale_total").html(numeral( total  ).format('$0,0.0') ) 
      }  
  }
}
function obtenerTotal()
{
  total = 0;
  $("#right_content .item").each( function() {
     let cantidad = $(this).find(".inputCantidad").val()
     let precio = $(this).find(".inputPrecio").val() 

     total += cantidad * precio
  }) 

  return total
}
function actualizarTotal($this, actions)
{  
   let producto = null
   for( var i = 0 ; i < listProductos.length  ; i++ )
   {
       if (listProductos[i].id == $this.data("id") )
       {
           producto = listProductos[i]
           break
       }
   }
   if( producto != null )
   {
      if( $this.hasClass("inputCantidad") )
        producto.cantidadEscrita = $this.val()
      else
        producto.precioEscrito = $this.val()

        updateProduct( producto )
   } 

  let total =  obtenerTotal()
  $("#sale_total").html(numeral( total  ).format('$0,0.0') )
}
function eliminarProductoVenta($this, actions)
{ 
    $this.parents('.item').removeClass("fadeInLeft").addClass("fadeOutRight")

    setTimeout(() => {
      $this.parents('.item').remove()
      let total =  obtenerTotal()
      $("#sale_total").html(numeral( total  ).format('$0,0.0') )


    
    }, 500);
     
    for( var i = 0 ; i < listProductos.length  ; i++ )
    {
        if (listProductos[i].id == actions.id )
        {
            listProductos.splice(i, 1)
        }
    } 

    if( listProductos.length <= 0 )
    {
       $(".i_trash").addClass("i_disabled").removeClass("i_enabled")
       $("#right_cancel_sale").addClass("disabled").removeClass("enabled")
       $("#sale").removeClass("enabled").addClass("disabled")
    }
    $("#buscarProducto").focus()
}
function finalizarVenta()
{
  if( $("#sale").hasClass("enabled"))
  {
    $("#efectivo").val("")
    $("#cambio").html("")

    let total =  obtenerTotal()
    $("#total").html( numeral( total  ).format('$0,0.0') )
    $('#modalVenta').modal(/*{backdrop: false }*/)
  }
}
function cancelarVenta($this, actions)
{
  if( $this.hasClass("i_enabled"))
  {
    alertify.confirm('', 'Esta seguro de cancelar la venta?', () =>
    { 
      listProductos = new Array()
      $("#right_content").empty()

      let total =  obtenerTotal()
      $("#sale_total").html(numeral( total  ).format('$0,0.0') )
      $("#contenido").html("")
      $("#infoTrabajador").html("").hide(0).removeClass("animated bounceInLeft faster")
        
    },() => {} )
  }   
}
function calcularCambio($this, actions)
{
  let total =  obtenerTotal()
  let cambio =  $this.val() - total

  _total = total
  _efectivo = $this.val()
  _cambio = cambio
 
  $("#cambio").html( numeral( cambio  ).format('$0,0.0') )
}
function guardarVenta($form, formData ) 
{
    let pass = false
    let total = obtenerTotal()
    let efectivo = parseInt( $("#efectivo").val() )

    $("#totalFactura").val( total )
 
    if( efectivo >= total )
    {
       pass = true
    }
    else
    {
       $("#efectivo").addClass("outlineAnimate").effect( "shake" )
       pass = false
    }

    if( pass )
    {
      mostrarLoadingFull()
      $.ajax
      ({
          url:  'set.php',
          type: 'post',
          data: $form.serialize(),
          dataType: 'json'
      }).done( ( response ) => 
      {
        ocultarLoadingFull()
        if( response.status ) 
        {
          imprimirVenta(null, {
             ip: '192.168.0.20',
             id: response.id
          })
          $('#frmAgregarProductoExternoLista')[0].reset() 
          $('#frmGuardarVenta')[0].reset()

          let total = obtenerTotal()

          deleteVenta( null, {
            "ventaId": ventaActual
          })
          deleteProductoVenta( ventaActual )

          ventaActual = null
 
          socket.emit('detalleVenta' , 
          { 
            total: _total, 
            efectivo: _efectivo,  
            cambio : _cambio,
            cliente: response.cliente,
            trabajador: $("#infoTrabajador").html()
          })

          $("#infoTrabajador").html("").hide(0).removeClass("animated bounceInLeft faster")

          listProductos = new Array()
          codigoVenta = null
          $('#contenido').html(`
                <div class="col-sm-12 row" > 
                <div style="margin-top: 200px" class="col col-sm-3 offset-md-4 click" data-actions='{"fn": "imprimirVenta",  "ip": "192.168.0.21", "id": ${response.id}}'>
                    <div class="text-center">
                      <p><i class="material-icons" style="font-size:48px;">print</i></p>
                      <p class="light center">Imprimir</p>
                    </div>
                </div>
              </div>`)

              $(".modal-backdrop").remove()

              
        } 
        else 
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
              "timeOut": "15000",
              "extendedTimeOut": "1000",
              "showEasing": "swing",
              "hideEasing": "linear",
              "showMethod": "fadeIn",
              "hideMethod": "slideUp",
              "showMethod": "slideDown",
              "progressBar": true,
          }
          toastr.error('Error en las cantidades ingresadas <br>' + response.strInfo)
        }

      })
      .fail( ( error ) => 
      {
          console.log("error" , error)
          ocultarLoadingFull()
      })
    }
} 
function consultarUltimasVentas($form, formData ) 
{
    mostrarLoadingFull()
    $.ajax
    ({
        url:  'get.php',
        type: 'post',
        data: $form.serialize(),
        dataType: 'json'
    }).done( ( response ) => 
    { 
      ocultarLoadingFull()

      if( response.status ) 
      {
        let tblVentas = `<table class='table'>
                      <thead>
                        <tr>
                          <th>Fecha</th>
                          <th>Trabajador</th>
                          <th>Cliente</th>
                          <th>Total</th> 
                          <th>Impresora</th>
                        </tr>
                      </thead>`
      
                      
         for (let i = 0; i < response.data.length; i++)
         {  
           let venta = response.data[i]
 

           tblVentas += `<tr>
                          <td>${venta.fecha}</td>
                          <td>${venta.trabajador}</td>
                          <td>${venta.cliente}</td>
                          <td>${venta.total}</td>
                          <td><i class="fa fa-print click" data-actions='{"fn": "imprimirVenta", "ip": "192.168.0.21",  "id": ${venta.id} }' style="font-size: 32px;" aria-hidden="true"></i></td>
                        </tr>`
         }
         tblVentas += `</table>`
        
         $('#responseUltimasVentas').html( tblVentas ) 
 
      }  

    })
    .fail( ( error ) => 
    {
        console.log("error" , error)
        ocultarLoadingFull()
    })
} 
function crearCliente($this, actions)
{
  $('#modalNuevoCliente').modal('open')
}
function guardarCliente($form, actions)
{
    mostrarLoadingFull()
    $.ajax
    ({
        url:  'set.php',
        type: 'post',
        data: $form.serialize(),
        dataType: 'json'
    }).done( ( response ) => 
    {
      ocultarLoadingFull()
      var newOption = new Option( response.text , response.id , false, false);
      $('#idcliente').append(newOption).val(response.id).trigger('change');
      $("#modalNuevoCliente").modal('close'); 
      

    })
    .fail( ( error ) => 
    {
        console.log("error" , error)
    })
}
function limpiarInput($this, actions)
{
    $("#buscarProducto").val("").focus()
}
function imprimirVenta($form, actions)
{
  mostrarLoadingFull()
  $.ajax
  ({
      url:  "http://192.168.0.101:4000/print",
      type: 'post',
      data: 
      { 
        'idventa' : actions.id,
        'ip' : actions.ip
      } 
  }).done( ( response ) =>
  {
      ocultarLoadingFull()
  })
  .fail( ( error ) => {
    console.log("error" , error)
    ocultarLoadingFull()
})
}
function mostrarLoadingFull()
{
    if( $("#loader-wrapper").is(":hidden"))
    $("#loader-wrapper").fadeIn()
}
function ocultarLoadingFull()
{
    $("#loader-wrapper").fadeOut()
}
function agregarProductoExterno($this, actions)
{
  $("#productoExterno").modal('show'); 
} 
function agregarProductoExternoLista($form, actions)
{  
   let nuevoProducto = $form.serializeFormJSON()


   nuevoProducto.id = IDGenerator()
   nuevoProducto.cantidad = parseInt( nuevoProducto.cantidad )
   nuevoProducto.precio = parseFloat( nuevoProducto.precio ) 
   nuevoProducto.tipo = 2
   nuevoProducto.imagen = 'default.png'
   nuevoProducto.cantidadEscrita = parseInt(nuevoProducto.cantidad)
   nuevoProducto.precioEscrito = parseFloat(nuevoProducto.precio)
   
   agregarProductoALista(nuevoProducto, true)
   listProductos.push( nuevoProducto )

   $("#productoExterno").modal('hide')
 
} 
function validarCodigo($form, formData ) 
{
    mostrarLoadingFull()
    $.ajax
    ({
        url:  'get.php',
        type: 'post',
        data: $form.serialize(),
        dataType: 'json'
    }).done( ( response ) => 
    {   
       ocultarLoadingFull()
       if( response.status )
       { 
       
         $("#modalValidarCodigo").modal('hide')
         $('#frmValidarCodigo')[0].reset() 

         _idusuario = response.idtrabajador
         _nombreUsuario = response.trabajador

         getContent( null, {
           "accion": "ventas",
           "codigo": response.codigo,
           "idusuario": response.idtrabajador,
         })
         
      
         $("#infoTrabajador").html(response.trabajador).show(0).addClass("animated bounceInLeft faster")
       }
    })
    .fail( ( error ) => 
    {
        console.log("error" , error)
        ocultarLoadingFull()
    })
} 
function cambiarCliente($this, val) {

  console.log( $('option:selected',$this).text()   )
  console.log( $this.val()   )
  updateSale($this.val(), $('option:selected',$this).text() )
}
function IDGenerator() 
{	 
  this.length = 8;
  this.timestamp = +new Date;
  
  var _getRandomInt = function( min, max ) 
  {
   return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
  }

  var ts = this.timestamp.toString();
  var parts = ts.split( "" ).reverse();
  var id = "";
  
  for( var i = 0; i < this.length; ++i ) 
  {
    var index = _getRandomInt( 0, parts.length - 1 );
    id += parts[index];	 
  }
    
    return id;
}     
function viewPendingSales() {
                
  var active = dataBase.result;
  var data = active.transaction(["ventas"], "readonly");
  var object = data.objectStore("ventas");
  
  var elements = [];
  
  object.openCursor().onsuccess = function (e) {
      
      var result = e.target.result      
      if (result === null) {
          return
      }  
      elements.push(result.value);
      result.continue() 
  }
  
  data.oncomplete = function() {
      
      var outerHTML = `<table class="table table-bordered" style="font-size:12px">
                        <thead>
                          <tr>
                            <th>Trabajador</th>
                            <th>Cliente</th>
                            <th>Fecha</th>
                            <th></th>
                            <th></th>
                          </tr>
                        </thead>`
      //console.log( 'elements', elements.length )
      

      for (var key in elements) 
      {           
          elements[key].fecha = elements[key].fecha.toFormat();
          outerHTML += `<tr> 
                            <td  class="align-middle">${elements[key]._nombreUsuario}</td> 
                            <td  class="align-middle">${elements[key].cliente}</td>
                            <td  class="align-middle">${elements[key].fecha}</td>
                            <td  class="align-middle">
                                <button class="btn click" data-actions='{ "fn":"obtenerVentaPorCodigo", "ventaId": "${elements[key].ventaId}" }'><i class="fa fa-retweet"></i> Recuperar</button> 
                            </td>
                            <td  class="align-middle">  
                                <button class="btn click"  data-actions='{ "fn":"deleteVenta", "ventaId": "${elements[key].ventaId}" }'><i class="fa fa-trash"></i> Eliminar</button> 
                            </td>
                        </tr>`                      
      }

      outerHTML += "</tablet>"

      if( elements.length > 0 )
      {  
        Swal.fire({
          title: `Tienes <span style="color:red; margin-left:5px; margin-right:5px;"> ${elements.length}</span> venta(s) pendiente`,
          animation: false,
          confirmButtonText: 'Cerrar',
          width: 1000,
          html: outerHTML,
          customClass: {
            popup: 'animated tada'
          }
        })
      } 
      elements = [] 
  }
  
}  
function updateSale(idcliente, cliente) {
                
  var db = dataBase.result
  var transaction = db.transaction(["ventas"], "readwrite");
  var store = transaction.objectStore("ventas");

  var req = store.openCursor()
  req.onerror = function(event) {
    console.log("case if have an error")
  }

  req.onsuccess = function(event) {
      var cursor = event.target.result;
      if(cursor) {

        console.log( "cursor", cursor )

          if( cursor.value.ventaId == ventaActual ) {
              var venta = {
                id: cursor.value.id,
                fecha: cursor.value.fecha,
                cliente: cliente,
                idcliente: idcliente ,
                ventaId: ventaActual
              }
             
              var res = cursor.update(venta);
              res.onsuccess = function(e){
                  console.log("update success!!");
              }
              res.onerror = function(e){
                  console.log("update failed!!");
              }
          } 
          cursor.continue()
      }
      else{
          console.log("fin mise a jour");
      }
  }
  
} 
function updateProduct(producto) {
         
  var db = dataBase.result
  var transaction = db.transaction(["productos"], "readwrite");
  var store = transaction.objectStore("productos");

  var req = store.openCursor()
  req.onerror = function(event) {
    console.log("case if have an error")
  }

  req.onsuccess = function(event) {
      var cursor = event.target.result;
      if(cursor) { 

          if( cursor.value.id == producto.id && cursor.value.venta == ventaActual ) {
               
              producto.idRegistro = cursor.value.idRegistro
             
              var res = cursor.update(producto);
              res.onsuccess = function(e){
                  console.log("update success!!");
              }
              res.onerror = function(e){
                  console.log("update failed!!");
              }
          } 
          cursor.continue()
      }
      else{
          console.log("fin mise a jour");
      }
  }
  
}
function obtenerVentaPorCodigo($this, actions) {
                 
  Swal.close("confirm")

  let ventaId = actions.ventaId
  var active = dataBase.result;
  var data = active.transaction(["ventas"], "readonly");
  var object = data.objectStore("ventas");
  var index = object.index("by_ventaId");
  
  var request = index.get(String(ventaId));
  
  request.onsuccess = function () {
      
      var result = request.result;
      
      if (result !== undefined) {  
          ventaActual = result.ventaId
          $("#idcliente select").val( result.idcliente )
          obtenerProductoPorCodigoVenta( result )
      }
  } 
}
function obtenerProductoPorCodigoVenta(venta) {
                 
  var active = dataBase.result;
  var data = active.transaction(["productos"], "readonly");
  var object = data.objectStore("productos");
  var index = object.index("by_venta");
 
  index.openCursor().onsuccess = function (e) 
  {                    
    var result = e.target.result     
    if (result === null) 
    {
        return
    }  
    if( result.value.venta == venta.ventaId )
      listProductos.push( result.value )  

    result.continue()
  }
  data.oncomplete = function() { 
     
    _total = 0
    _efectivo = 0
    _cambio = 0
    codigoVenta = null 
    
    mostrarLoadingFull()
    $.ajax({
        url:  'get.php',
        type: 'post',
        data: { "accion" : "ventas" }
    }).done( ( response ) => {

        $('#contenido').html( response )  
        
        for (var key in listProductos)
        {  
          agregarProductoALista( listProductos[key], false )
          let total =  obtenerTotal()
          $("#sale_total").html(numeral( total  ).format('$0,0.0') )
          $("#infoTrabajador").html(venta._nombreUsuario).show(0).addClass("animated bounceInLeft faster")

        } 

        $(".date").kendoDatePicker
        ({
            format: "yyyy-MM-dd"
        })
 

        $("#codigoVenta").val( md5( new Date() )  )
        $("#idusuario").val( venta.idusuario )
  
        $("#buscarProducto").val("").focus()

        
        if( $("#right_client").is(":visible") )
          ajustarAltura()

        $("select").chosen({disable_search_threshold: 10})
      
        ocultarLoadingFull() 

        $('#modalErrorVenta').modal()
        $('#modalNuevoCliente').modal()
        $("#modalProductoExterno").modal()   
        
    })
    .fail( ( error ) => {
        console.log("error" , error)
    }) 
}  
   
}
function deleteVenta($this, actions) {

  if( $this != null) 
    $this.parents('tr').remove()
  ventaId = actions.ventaId

  var db = dataBase.result;
  var transaction = db.transaction(['ventas'], 'readwrite');
  var objectStore = transaction.objectStore('ventas');

  objectStore.openCursor().onsuccess = function(event) {
    var cursor = event.target.result;
    if(cursor) {
      if(cursor.value.ventaId === ventaId) {
        var request = cursor.delete();
        request.onsuccess = function() {
          console.log('Deleted venta.');
        }
      }  
      cursor.continue();        
    } else {
      console.log('Entries displayed.');         
    }
  }

  deleteProductoVenta(ventaId)
} 
function deleteProductoVenta(ventaId) {
  
  var db = dataBase.result;
  var transaction = db.transaction(['productos'], 'readwrite');
  var objectStore = transaction.objectStore('productos');

  objectStore.openCursor().onsuccess = function(event) {
    var cursor = event.target.result;
    if(cursor) {
      if(cursor.value.venta === ventaId) {
        var request = cursor.delete();
        request.onsuccess = function() {
          console.log('Deleted producuto venta.');
        }
      }  
      cursor.continue();        
    } else {
      console.log('Entries pv displayed.');         
    }
  }
} 
function twoDigits(d) {
  if(0 <= d && d < 10) return "0" + d.toString();
  if(-10 < d && d < 0) return "-0" + (-1*d).toString();
  return d.toString();
}
Date.prototype.toFormat = function() {
  return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
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
function confirmarPedido($this, actions)
{
  alertify.prompt("","Ingrese su código para confirmar el pedido", "", function(evt, value )
  {
    $.ajax
    ({
        url:  'get.php',
        type: 'post',
        data: { "idpedido" : actions.idpedido , "codigo": value, "accion" : "obtenerProductoPedido" },
        dataType : 'json'
    }).done( (data ) =>
    {
        console.log("data", data)
        listProductos = new Array()
        if( data.status )
        {
          mostrarLoadingFull()
          $.ajax({
              url:  'get.php',
              type: 'post',
              data: { "accion" : "ventas", "idcliente": data.idcliente }
          }).done( ( response ) => 
          {
              $('#contenido').html( response ) 

              data.productos.forEach(producto => 
              {
                listProductos.push( producto )  
              })
              for (var key in listProductos)
              {  
                agregarProductoALista( listProductos[key], false )
              } 
              let total =  obtenerTotal()
              $("#sale_total").html(numeral( total  ).format('$0,0') )
              $("#infoTrabajador").html(data.trabajador).show(0).addClass("animated bounceInLeft faster")

              $("#codigoVenta").val( md5( new Date() )  )
              $("#idusuario").val(data.idtrabajador)

              $("#buscarProducto").val("").focus()      
              if( $("#right_client").is(":visible") )
                ajustarAltura()

              $("select").chosen({disable_search_threshold: 10})
            
              ocultarLoadingFull() 

              $('#modalErrorVenta').modal()
              $('#modalNuevoCliente').modal()
              $("#modalProductoExterno").modal()
          })
          .fail( ( error ) => {
              console.log("error" , error)
          })
        }
    })
    .fail( ( error ) =>
    {
        console.log("error" , error)
    })
  },
  function(){
    alertify.error('Cancel')
  })
  
}
function paginarPedidos(  action , obj )
{   
    
    table = $('.tabla-pedidos').DataTable
    ({
        language:
        {
           "url": "../public/material/datatables/Spanish.json"
        },
        serverSide: true,
        destroy: true,
        columns: 
        [
            {"data": "id"},
            {"data": "id"},
            {"data": "id"},
            {"data": "cliente"},
            {"data": "total"}
        ],      
        rowCallback: function (row, data) 
        {  
            //  if( true )
            //     $(row).addClass('table-warning')
        },     
        columnDefs: 
        [
            {
                targets:[0],
                render: function ( data, type, row, meta )
                {
                   return  `<i class="icon md-search click"  data-actions='{ "fn":"eliminarPromociones" , "dataType" : "html" , "idpromocion" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },
            {
                targets:[1],
                render: function ( data, type, row, meta )
                {
                   return  `<i class="icon icon md-check-circle click"  data-actions='{ "fn":"confirmarPedido" , "dataType" : "html" , "idpedido" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                   
                }
            },
            {
                targets:[2],
                render: function ( data, type, row, meta )
                {
                   return  `<i class="icon icon md-delete click"  data-actions='{ "fn":"eliminarPromociones" , "dataType" : "html" , "idpromocion" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                   
                }
            },
            {
                targets:[4],
                render: function ( data, type, row, meta )
                {
                   return  numeral( data  ).format('$0,0')
                   
                }
            }
        ],        
        ajax:
        {
            type: "POST",
            url: "get.php",
            data: {"accion": "paginarPedidos"},
            beforeSend: function (request) 
            {
            },
            error: function( error )
            {   
                console.log('error',error)
            },
            dataSrc: function (json) 
            { 
                return json.data
            }
        }
    })
    
} 



