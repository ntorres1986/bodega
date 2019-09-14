var socket = null
try
{
    
    socket = io('http://localhost:4000', 
    {
        transports: [ 'websocket', 'polling' ]
    })

    socket.on('error', (error) =>
    {
    }).on('connect_error', (error) =>
    {
        // socket.disconnect();
    })

    socket.on('errorFE', (data) => 
    {
        addModal
        ({
            id : `errorFE`,
            class : `modal-simple modal-center modal-danger`,
            close : true,
            title: 'Documento duplicado',
            body : `<br />${data.message}`,
            buttonClose : true ,
            buttonAction : false ,
            buttonActionText : ``,
            modalType : ``
        })
        console.log( data )
        $(`.cssload-container${data.nroDocumento}`).
        parents('.parentPlay').
        html(`<center><i class='icon fa-window-close' style='color:red; font-size: 32px;'></i></center>`)
    })
    
    socket.on('inicializacionConfirmada', (data) =>
    { 
      if( data.status )
      {
        $(`.success-firma${data.idusuario}${data.idnomina}`).hide() 
        $(`.success-firma${data.idusuario}${data.idnomina}`).show() 
        $(`.guardar-firma${data.idusuario}${data.idnomina}`).fadeIn(3000) 
      }
      else  
      {
        $(`.success-firma${data.idusuario}${data.idnomina}`).hide()
        $(`.guardar-firma${data.idusuario}${data.idnomina}`).fadeOut(3000)
        $(`.error-firma${data.idusuario}${data.idnomina}`).show()
      }
      
    })

    socket.on('EnviarMensaje', (data) =>
    {
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
        if( data.type == 'success' )
          toastr.success(data.message, data.titulo)
        if( data.type == 'info' )
          toastr.info(data.message, data.titulo)
    })

    socket.on('MostrarRespuestaConsultaDocumento' , (data) =>
    {
        let colorClass = 'modal-success' 
        let body = '' 
        let description = 'Error '
        let response = data.response
        description = response.description 
 
        if( data.status )
        {
          body = `<table class='table'>
                      <tr><td>Mensaje</td><td>${ response.message }</td></tr>  
                  </table> `
        }
        else
        {
              body = `<table class='table'>
                      <tr><td>Mensaje</td><td>${ response.message }</td></tr>  
                  </table>
                  ${response.errores}`
            
              colorClass = 'modal-danger'  
        }

        $(`.cssload-container-search${response.documento}`).hide()
        $(`.cssload-container-search${response.documento}`).siblings('.icon').show()

        addModal
        ({
            id : `modalDetalleFactura`,
            class : `modal-simple modal-center ${colorClass}`,
            close : true,
            title: description,
            body : `<br />${body}`,
            buttonClose : true ,
            buttonAction : false ,
            buttonActionText : ``,
            modalType : ``
        })
    })

    socket.on('DocumentoEnviado', (data) =>
    {
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
        if( data.type == 'success')
          toastr.success(data.message, data.titulo)
        if( data.type == 'warning')
          toastr.warning(data.message, data.titulo)
        if( data.type == 'error')
            toastr.error(data.message, data.titulo)

        $(`.cssload-container${data.nroDocumento}`).parents('tr').find('.ion-ios-information-circle-outline').addClass('click').css({color:'black'})
        $(`.cssload-container${data.nroDocumento}`).
        parents('.parentPlay').
        html(`<center>
                <span class="work-status">
                  <span class="badge badge-lg badge-success">Enviada</span>
                </span>
              </center>`)
        $(`.cssload-container-search${data.nroDocumento}`).parents('tr').find('.parentEnvioCliente').html(`<i class="icon ion-ios-checkmark-circle-outline" aria-hidden="true" style="font-size:32px;color:#4caf50;"></i>`)
    })

    socket.on('detalleVenta', (data) =>
    {
        if (localStorage.getItem("infiniteScrollEnabled") === null) {
          storedSales = new Array()
        } else {
          storedSales = JSON.parse(localStorage.getItem("sales"))
        } 

        let message = `<table>
                          <tr>
                            <td>Cliente</td>
                            <td><h4>${data.cliente}</h4></td>
                          </tr>
                          <tr>
                            <td>Trabajador</td>
                            <td><h4>${data.trabajador}</h4></td>
                          </tr> 
                          <tr>
                            <td>Total</td>
                            <td><h4>${ numeral(data.total).format('$0,0.00') }</h4></td>
                          </tr> 
                          <tr>
                            <td>Efectivo</td>
                            <td><h4>${ numeral(data.efectivo).format('$0,0.00') }</h4></td>
                          </tr> 
                          <tr>
                            <td>Cambio</td>
                            <td><h4>${ numeral(data.cambio).format('$0,0.00') }</h4></td>
                          </tr> 
                       </table>`

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
          toastr.success(message, data.titulo) 
    })
} 
catch (error)
{
    console.log("erro try" , error)
}
