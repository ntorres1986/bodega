var table;
var _notaDebito = 
{
    totalFactura : 0 ,
    totalAumentoPorProducto : 0 ,
    valorAumentado : 0,
    numeroFactura : ''
}
var _notaCredito = 
{
    totalFactura : 0 ,
    totalDescontoPorProducto : 0 ,
    valorDescontado : 0,
    numeroFactura : '',
    totalNotaCredito : 0 ,
    permitidoCredito : 0 ,
    totalSeleccionadoNotaCredito : 0
}
var _globals =
{
    total : 0 ,
    total_iva : 0 ,
    total_salida : 0,
    total_venta : 0,
    ocultoMenu : 1
}
var _menus = null
var _toast_options_abajo = 
{
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-bottom-center",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "300",
    "timeOut": "15000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "slideUp",
    "showMethod": "slideDown",
    "progressBar": true,
}
var _toast_options_arriba_derecha = 
{
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "10000", 
    "hideDuration": "300",
    "timeOut": "10000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "slideUp",
    "showMethod": "slideDown",
    "progressBar": true,
}