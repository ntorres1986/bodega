var socket = null
try
{ 
    socket = io('http://localhost:4000', 
    {
        transports: [ 'websocket', 'polling' ]
    })

    socket.on('error', (error) =>
    {
        console.log("error ", error)

    }).on('connect_error', (error) =>
    {
        console.log("error ", error)
        // socket.disconnect();
    })

    socket.on('nuevaOrdenDeCompraParaPos', (data) =>
    { 
        $(".fa-bell").addClass('bell_animation')
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
        toastr.success("Nueva orden de compra", "Orden de compra") 
      
    })
 
 
} 
catch (error)
{
    console.log("erro try" , error)
}
