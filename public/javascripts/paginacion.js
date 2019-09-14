function paginarInventario(  action , obj )
{   
    function format ( producto ) {
         

        ganancia = producto.precio - producto.costo
        margenPrecioPublico = parseFloat(ganancia  / producto.costo * 100).toFixed(0)

        
        return `<table cellpadding="5" class='table table-bordered table-hover' cellspacing="0" border="0" style="padding-left:50px; width:600px;">
                <tr>
                    <td rowspan='7'><img src='public/images-productos/${producto.imagen}' class='imagen-inventario' ></td>
                </tr>
                
                <tr> 
                    <td>Margen:</td>
                    <td colspan='3'>${margenPrecioPublico}%</td>
                </tr>
                <tr>
                    <td>Iva :</td>
                    <td colspan='3'>${producto.percent}%</td> 
                </tr>
                <tr>
                    <td>Marca:</td>
                    <td colspan='3'>${producto.marca}</td> 
                </tr> 
                
            </table>`;
    }
    table = $('.tabla-inventario').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        serverSide: true, 
        destroy: true, 
        ordering: true,
        columns: 
        [
            {"data": "id", "className": 'details-control'},
            {"data": "id"},
            {"data": "nombre"},
            {"data": "cantidad"},
            {"data": "stock"},
            {"data": "costo"},
            {"data": "precio"},
            {"data": "total_costo"},
            {"data": "total_precio"}
        ],      
        rowCallback: function (row, data) 
        {  
             if( Number(data.cantidad) <= Number(data.stock) )
                $(row).addClass('table-warning')
        },         
        columnDefs: 
        [            
            {
                targets:[0],
                render: function ( data, type, row, meta )
                {
                    return  ``
                }
            },
            {
                targets:[1],
                render: function ( data, type, row, meta )
                {
                    return  ` <div class='acciones'>
                                <i class="icon ion-md-create click"  data-actions='{ "fn": "getContent", "controller": "Inventario" ,"action": "editarProducto", "response":"body-response", "dataType":"json", "idproducto" : ${data} }' aria-hidden="true" style="font-size:24px"></i> 
                                <i class="icon ion-md-trash click"  data-actions='{ "fn":"eliminarProducto" , "dataType" : "json" , "idproducto" : ${data} }' aria-hidden="true" style="font-size:24px"></i>
                                <i class="icon wb-plus click"  data-actions='{ "fn": "getContent", "controller": "Inventario" ,"action": "agregarCantidadProducto", "response":"modal-body", "dataType":"html", "idproducto" : ${data} , "modal": true, "title": "Aumentar cantidad" }' aria-hidden="true" style="font-size:24px"></i>
                                <i class="icon wb-minus click"  data-actions='{ "fn": "getContent", "controller": "Inventario" ,"action": "restarCantidadProducto", "response":"modal-body", "dataType":"html", "idproducto" : ${data} , "modal": true , "title": "Disminuir cantidad" }' aria-hidden="true" style="font-size:24px"></i>
                              </div>`
                }
            },
            { 
                targets:[4,5,6,7,8],
                render: function ( data, type, row, meta ) 
                {
                    return  numberFormatFEClear(data)
                }
            }
        ],
        ajax:
        {
            "type": "POST",
            "url": "",
            "data": { "controller" : "Inventario" , "action" : "paginarInventario", "buscarProducto":$("#buscarProducto").val() },
            beforeSend: function (request) 
            {
            },
            error: function( error )
            {   
                console.log('error',error.responseText)
            },
            dataSrc: function (json) 
            {
                globals = 
                {
                        "total_costo" : json.total_costo , 
                        "total_precio" : json.total_precio 
                }  
                return json.data
            }
        }, 
        footerCallback: function (row, data, start, end, display) 
        {      
            var api = this.api()
            $(api.column(6).footer()).html( globals.total_costo )
            $(api.column(7).footer()).html( globals.total_precio )
            $(api.column(0).footer()).html( `<div class='descargar-excel click' data-actions='{"fn":"exportarInventarioExcel"}'  >
                                                        <div class='descargar-excel-text'>Descargar</div>
                                                    </div> 
                                                </td> ` )
        } 
    })

    $('.tabla-inventario tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row( tr );
 
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( format(row.data()) ).show();
            tr.addClass('shown');
        }
    } );
        
        // $( 'input', $('.filtro-parent') ).on('keyup change',function(e)
        // {
        //     e.stopImmediatePropagation()
        //     e.stopPropagation()
        //     if ( table.column(i).search() !== this.value ) 
        //         table.column(i).search( this.value ).draw()
        // })
    
        // $( 'select', $('.filtro-parent') ).on('change',function(e)
        // {
        //     if ( table.column(i).search() !== this.value ) 
        //         table.column(i).search( this.value ).draw()
        // })
} 
function paginarPorTerminar(  action , obj )
{   
    let objRequest = {
        'controller': 'Inventario',
        'action': 'paginarPorTerminar',
        'desde': '',
        'hasta': ''
    }
    /*
    if( typeof(obj.desde) !== "undefined" )
        objRequest.desde = obj.desde
    if( typeof(obj.hasta) !== "undefined" )
        objRequest.hasta = obj.hasta
        */

    
    table = $('.tabla-por-terminar').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        serverSide: true,
        destroy: true,
        columns: 
        [
            {"data": "nombre"},
            {"data": "cantidad"},
            {"data": "stock"}
        ],      
        rowCallback: function (row, data) 
        {  
             if( Number(data.cantidad) <= Number(data.stock) )
                $(row).addClass('table-warning')
        },            
        ajax:
        {
            "type": "POST",
            "url": "",
            "data": objRequest,
            beforeSend: function (request) 
            {
            },
            error: function( error )
            {   
                console.log('error',error.responseText)
            },
            dataSrc: function (json) 
            {
                return json.data
            }
        }
    })
    $('.tabla-por-terminar thead tr:eq(1) th').each( function (i) 
    {
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })
} 
function paginarMarcas(  action , obj )
{   
    table = $('.tabla-marcas').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        destroy: true,
        columns: 
        [
            {"data": "id" },
            {"data": "imagen" }
        ],            
        columnDefs: 
        [
            {
                targets:[0],
                render: function ( data, type, row, meta )
                {
                   return  `<i class="icon ion-md-trash click"  data-actions='{ "fn":"eliminarMarcas" , "dataType" : "html" , "idmarca" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },            
            { 
                targets:[1],
                render: function ( data, type, row, meta ) 
                {
                    return "<img style='width:80px;' src=https://ferregomezjp.com/ferregomezjp/marcas/"+data+" />";
                }
            } 
        ], 
        ajax:
        {
            "type": "POST",
            "url": "",
            "data": { "controller" : "Web" , "action" : "paginarMarcas"},
            beforeSend: function (request) 
            {
            },
            error: function( error )
            {   
                console.log('error',error.responseText)
            },
            dataSrc: function (json) 
            { 
                return json.data
            }
        } 
    })
    
    
} 
function paginarPromociones(  action , obj )
{   
    table = $('.tabla-promociones').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        destroy: true,
        columns: 
        [
            {"data": "id" },
            {"data": "fecha" },
            {"data": "titulo" },
            {"data": "imagen" }
        ],            
        columnDefs: 
        [
            {
                targets:[0],
                render: function ( data, type, row, meta )
                {
                   return  `<i class="icon ion-md-trash click"  data-actions='{ "fn":"eliminarPromociones" , "dataType" : "html" , "idpromocion" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },
            {
                targets:[3],
                render: function ( data, type, row, meta )
                {
                   if( data.length > 0 )
                       return `<a data-fancybox="gallery" href="../ferregomezjp/promociones/${data}">
                                    <img style="width:32px; height:32px; border:1px dashed silver;" src="../ferregomezjp/promociones/${data}">
                               </a>`
                   else
                    return  `<img src="public/fotos/vacio.jpg" style="width:32px; height:32px; border:1px dashed silver;" />`

                }
            }
        ], 
        ajax:
        {
            "type": "POST",
            "url": "",
            "data": { "controller" : "Web" , "action" : "paginarPromociones"},
            beforeSend: function (request) 
            {
            },
            error: function( error )
            {   
                console.log('error',error.responseText)
            },
            dataSrc: function (json) 
            { 
                return json.data
            }
        } 
    })
    
} 
function paginarInventarioBodega(  action , obj )
{    
    table = $('.tabla-inventario').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        destroy: true,
        columns: 
        [
            {"data": "id" },
            {"data": "id" },
            {"data": "bodega" },
            {"data": "nombre"},
            {"data": "cantidad"},
            {"data": "stock"},
            {"data": "costo"},
            {"data": "precio"},
            {"data": "total_costo"},
            {"data": "total_precio"}
        ],      
        rowCallback: function (row, data) 
        { 
             if( data.cantidad <= data.stock )
                $(row).addClass('table-warning')
        },            
        columnDefs: 
        [
            {
                targets:[0],
                render: function ( data, type, row, meta )
                {
                    let modalWidth = ''
                    if( row.tipo_producto == 2 )
                    modalWidth = 90
                    return  `<i class="icon ion-md-create click"  data-actions='{ "fn": "getContent", "controller": "Inventario" ,"action": "editarProducto", "response":"body-response", "dataType":"json", "idbodega": ${row.idbodega}, "idproducto" : ${data} }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },       
            {
                targets:[1],
                render: function ( data, type, row, meta )
                {
                   return  `<i class="icon ion-md-trash click"  data-actions='{ "fn":"eliminarProducto" , "dataType" : "json" , "idbodega": ${row.idbodega}, "idproducto" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },            
            { 
                targets:[6],
                render: function ( data, type, row, meta ) 
                {
                    return  data
                }
            },
            { 
                targets:[7],
                render: function ( data, type, row, meta ) 
                {
                    return  data
                }
            },
            { 
                targets:[8],
                render: function ( data, type, row, meta ) 
                {
                    return  data
                }
            },
            { 
                targets:[8],
                render: function ( data, type, row, meta ) 
                {
                    return  data
                }
            } 
        ], 
        ajax:
        {
            "type": "POST",
            "url": "",
            "data": { "controller" : "Inventario" , "action" : "paginarInventarioBodega"},
            beforeSend: function (request) 
            {
            },
            error: function( error )
            {   
                console.log('error',error.responseText)
            },
            dataSrc: function (json) 
            {
                globals = 
                {
                        "total_costo" : json.total_costo , 
                        "total_precio" : json.total_precio 
                }  
                return json.data
            }
        },
        footerCallback: function (row, data, start, end, display) 
        {      
            var api = this.api()
            $(api.column(7).footer()).html('$' + globals.total_costo )
            $(api.column(8).footer()).html('$' + globals.total_precio )
        }
    })
    $('.tabla-inventario thead tr:eq(1) th').each( function (i) 
    {
        
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })
} 
function paginarDocumentos()
{ 
    table = $('.table-documents').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        
        initComplete:function( settings, json)
        {
        },
        processing: false ,
        searching: false ,
        pageLength: 10,
        serverSide: true,
        ordering: false,
        destroy: true,
        columns:
        [
             {data: "id"},
             {data: "numero"},
             {data: "tipo"},
             {data: "enviada"},
             {data: "envio_cliente"},
             {data: "aceptacion"},
             {data: "id"}
        ],
        columnDefs:
        [
            {
              targets:[0],
              render: function ( data, type, row, meta )
              {
                 return  `<i class="icon ion-ios-search click"  data-actions='{ "fn":"detalleDocumento" , "dataType" : "json" , "row" : ${JSON.stringify(row) } }' aria-hidden="true" style="font-size:32px"></i>`
              }
            },
            {
              targets:[2],
              render: function ( data, type, row, meta )
              {
                 let texto = 'Factura'
                 if( data == 'debitNote' )
                    texto = 'Nota Débito'
                 if( data == 'creditNote' )
                    texto = 'Nota Crédito'
                 

                 return  texto
              }
            },
            {
              targets:[3],
              render: function ( data, type, row, meta )
              {
                
                if( data == 1 )
                {
                    return  `<center>
                                <span class="work-status">
                                    <span class="badge badge-lg badge-success">Enviada</span>
                                </span>
                            </center>`
                }
                else
                {
                    return `<span class='parentPlay'>
                                <center>
                                  <i class="icon ion-ios-play click" data-actions='{ "fn":"enviarDocumento" , "row" : ${JSON.stringify(row) } }' aria-hidden="true" style="font-size:32px"></i>
                                  <div class="cssload-container cssload-container${row.numero}" style="display:none;">
                                     <div class="cssload-speeding-wheel"></div>
                                  </div>
                                </center>
                            </span>`
                }
              }
            },
            {
              targets:[4],
              render: function ( data, type, row, meta )
              {
                if( data == 0 || data == null )
                    return `<span class='parentEnvioCliente'><i class="icon ion-ios-close-circle-outline" aria-hidden="true" style="font-size:32px"></i></span>`
                else
                    return `<span class='parentEnvioCliente'><i class="icon ion-ios-checkmark-circle-outline" aria-hidden="true" style="font-size:32px;color:#4caf50;"></i></span>`
              }
            },
            {
                targets:[5],
                render: function ( data, type, row, meta )
                {
                    if( data == 0 )
                        return `<i class="icon ion-ios-close-circle-outline" aria-hidden="true" style="font-size:32px"></i>`
                    else
                        return `<i class="icon ion-ios-checkmark-circle-outline" aria-hidden="true" style="font-size:32px;color:#4caf50;"></i>`
                }
              },
            {
              targets:[6],
              render: function ( data, type, row, meta )
              {
                 let clase = ''
                 let colorStyle = 'color:silver'

                 
                 if( Number(row.enviada) == 1 )
                 {
                    clase = 'click'
                    colorStyle = ''

                 }
                 return `<i class="icon ion-ios-information-circle-outline ${clase}" data-actions='{ "fn":"consultarDocumentoDIAN" , "row" : ${JSON.stringify(row) } }' aria-hidden="true" style="font-size:32px;${colorStyle}"></i>
                         <div class="cssload-container cssload-container-search${row.numero}" style="display:none;">
                            <div class="cssload-speeding-wheel"></div>
                         </div>`
              }
            }
        ],
        ajax:
        {
            type: "POST",
            url: "",
            data: { "controller" : "Documents" , "action" : "getPanelDocumentsData"},
            beforeSend: function (request)
            {

            },
            error: function( error )
            {
               $("#content").append( error.responseText )
            }
        }
    });
}
function paginarPagosFacturas(form, datos)
{ 
    $(".tabla-pagos-facturas").show()

    table = $('.tabla-pagos-facturas').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        initComplete:function( settings, json)
        {

        },
        initComplete:function( settings, json)
        {
        },
        processing: false ,
        searching: false ,
        pageLength: 10,
        serverSide: true,
        ordering: false, 
        destroy: true,
        columns: 
        [
           {data: "id"},
           {data: "id"},
           {data: "fecha"},
           {data: "cliente"},
           {data: "trabajador"},
           {data: "total"},
           {data: "abono"},
           {data: "debe"}
        ],  
        columnDefs: 
        [
            {
                targets:[0],
                render: function ( data, type, row, meta )
                {
                return  `<i class="icon ion-ios-search click"  data-actions='{ "fn":"detalleVenta" , "dataType" : "json" , "idventa" : ${data} }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },       
            {
                targets:[1],
                render: function ( data, type, row, meta )
                {
                   return  `<i class="icon md-money-box click"  data-actions='{ "fn":"abonoVenta" , "dataType" : "json" , "idventa" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },       
        ], 
        ajax:
        {
            type: "POST",
            url: "",
            data: {controller: 'Factura', action: 'paginarPagosFacturas' },
            beforeSend: function (request) 
            {
                //MostrarLoading();
            },
            error: function( error )
            {   
            console.log('error',error.responseText);
            }
        }
    });
}
function paginarOrdenCompra()
{   
    table = $('.table-orden-compra').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        drawCallback: function( settings ) {
            
        },
        // processing: false ,
        // searching: true ,
        // pageLength: 10,
        // serverSide: true,
        // ordering: true, 
        destroy: true,
        columns: 
        [
            {data: "id"},
            {data: "id"},
            {data: "id"},
            {data: "trabajador"},
            {data: "fecha"},
            {data: "factura"},
            {data: "proveedor"},
            {data: "tipo"}, 
            {data: "iva"},
            {data: "total"},
            {data: "id"}
        ],  
        columnDefs: 
        [ 
            {
                targets:[0],
                render: function ( data, type, row, meta )
                {
                return  `<i class="icon ion-md-create click"  data-actions='{ "fn":"getContent", "controller": "Compra", "action":"editarOrdenCompra", "response": "body-response", "dataType" : "html" , "idcompra" : ${data} }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },  
            {
                targets:[1],
                render: function ( data, type, row, meta )
                {
                return  `<i class="icon ion-ios-search click"  data-actions='{ "fn":"detalleCompra" , "dataType" : "json" , "idcompra" : ${data} }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },       
            {
                targets:[1],
                render: function ( data, type, row, meta )
                {
                   return  `<i class="icon md-money-box click"  data-actions='{ "fn":"abonoCompra" , "dataType" : "json" , "idcompra" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },       
            {
                targets:[8],
                render: function ( data, type, row, meta )
                {
                   return  numberFormat(data)
                }
            }, 
            {
                targets:[9],
                render: function ( data, type, row, meta )
                {
                   return  numberFormat( Number(row.total) )
                }
            },  
            {
                targets:[10],
                render: function ( data, type, row, meta )
                {
                    let total = Number(row.total)
                    if( Number(row.iva) > 0 )
                    {
                       total = ( Number(row.total) + Number(row.iva) )
                    }
                    return  numberFormat( total  )
                }
            },
        ], 
        ajax:
        {
            type: "POST",
            url: "",
            data: {controller: 'Compra', action: 'paginarOrdenCompra' },
            beforeSend: function (request) 
            {
                //MostrarLoading();
            },
            error: function( error )
            {   
                console.log('error',error.responseText);
            },
            dataSrc: function (json) 
            { 
                _globals.total = json.total
                _globals.total_iva = json.total_iva

                return json.data;
            }
        },
        footerCallback: function (row, data, start, end, display) 
        {      
          var api = this.api();  
          $(api.column(8).footer()).html( numberFormat( Number(_globals.total_iva)));
          $(api.column(9).footer()).html( numberFormat( Number(_globals.total)));
          $(api.column(10).footer()).html( numberFormat( Number(_globals.total) + Number(_globals.total_iva) ));
        }

    })
    $('.table-orden-compra thead tr:eq(1) th').each( function (i) 
    {
        
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })

       
}
function paginarReporteCompras()
{    
    table = $('.table-reporte-compra').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        drawCallback: function( settings ) {
            
        },
        // processing: false ,
        // searching: true ,
        // pageLength: 10,
        // serverSide: true,
        // ordering: true, 
        destroy: true,
        columns: 
        [
            {data: "id"},
            {data: "id"},
            {data: "id"},
            {data: "trabajador"},
            {data: "fecha"},
            {data: "factura"},
            {data: "proveedor"},
            {data: "tipo"}, 
            {data: "iva"},
            {data: "total"},
            {data: "id"}
        ],  
        columnDefs: 
        [ 
            {
                targets:[0],
                render: function ( data, type, row, meta )
                {
                return  `<i class="icon ion-md-create click"  data-actions='{ "fn":"getContent", "controller": "Compra", "action":"editarOrdenCompra", "response": "body-response", "dataType" : "html" , "idcompra" : ${data} }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },  
            {
                targets:[1],
                render: function ( data, type, row, meta )
                {
                return  `<i class="icon ion-ios-search click"  data-actions='{ "fn":"detalleCompra" , "dataType" : "json" , "idcompra" : ${data} }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },       
            {
                targets:[2],
                render: function ( data, type, row, meta )
                {
                   return  `<i class="icon md-money-box click"  data-actions='{ "fn":"abonoCompra" , "dataType" : "json" , "idcompra" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },       
            {
                targets:[8],
                render: function ( data, type, row, meta )
                {
                   return  numberFormat(data)
                }
            }, 
            {
                targets:[9],
                render: function ( data, type, row, meta )
                {
                   return  numberFormat( Number(row.total) )
                }
            },  
            {
                targets:[10],
                render: function ( data, type, row, meta )
                {
                    let total = Number(row.total)
                    if( Number(row.iva) > 0 )
                    {
                       total = ( Number(row.total) + Number(row.iva) )
                    }
                    return  numberFormat( total  )
                }
            },
        ], 
        ajax:
        {
            type: "POST",
            url: "",
            data: $("#reporteCompra").serializeFormJSON(),
            beforeSend: function (request) 
            {
                //MostrarLoading();
            },
            error: function( error )
            {   
                console.log('error',error.responseText);
            },
            dataSrc: function (json) 
            { 
                _globals.total = json.total
                _globals.total_iva = json.total_iva
                return json.data;
            }
        },
        footerCallback: function (row, data, start, end, display) 
        {      
          var api = this.api();  
          $(api.column(8).footer()).html( numberFormat( Number(_globals.total_iva)));
          $(api.column(9).footer()).html( numberFormat( Number(_globals.total)));
          $(api.column(10).footer()).html( numberFormat( Number(_globals.total) + Number(_globals.total_iva) ));
        }

    })
    $('.ttable-reporte-compra thead tr:eq(1) th').each( function (i) 
    {
        
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })

       
}
function paginarOrden()
{   
    table = $('.table-orden').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        drawCallback: function( settings ) {
            
        },
        // processing: false ,
        // searching: true ,
        // pageLength: 10,
        // serverSide: true,
        // ordering: true, 
        destroy: true,
        columns: 
        [
            {data: "id"},
            {data: "fecha"},
            {data: "cliente"}
        ],  
        columnDefs: 
        [     
            {
                targets:[0],
                render: function ( data, type, row, meta )
                {
                return  `<i class="icon ion-ios-search click"  data-actions='{ "fn":"detalleOrden" , "dataType" : "json" , "id" : ${data} }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },       
            {
                targets:[1],
                render: function ( data, type, row, meta )
                {
                   return  `<i class="icon ion-md-trash click"  data-actions='{ "fn":"eliminarOrden" , "dataType" : "json" , "id" : ${row.id} }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },       
        ], 
        ajax:
        {
            type: "POST",
            url: "",
            data: {controller: 'Factura', action: 'paginarOrden' },
            beforeSend: function (request) 
            {
                //MostrarLoading();
            },
            error: function( error )
            {   
                console.log('error',error.responseText);
            },
            dataSrc: function (json) 
            { 
                _globals.total = json.total
                return json.data;
            }
        },
        footerCallback: function (row, data, start, end, display) 
        {      
          var api = this.api();  
          $(api.column(0).footer()).html('$' + _globals.total);
        }

    })
    $('.table-orden thead tr:eq(1) th').each( function (i) 
    {
        
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })

       
}
function paginarPagosProveedores()
{   
    
    table = $('.table-pagos-proveedores').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        drawCallback: function( settings ) {
            
        },
        // processing: false ,
        // searching: true ,
        // pageLength: 10,
        // serverSide: true,
        // ordering: true, 
        destroy: true,
        columns: 
        [
           {data: "id"},
           {data: "id"},
           {data: "fecha"},
           {data: "factura"},
           {data: "numero"},
           {data: "proveedor"},
           {data: "trabajador"},
           {data: "plazo"},
           {data: "total"},
           
        ],  
        columnDefs: 
        [ 
            {
                targets:[0],
                render: function ( data, type, row, meta )
                {
                return  `<i class="icon ion-ios-search click"  data-actions='{ "fn":"detalleCompra" , "dataType" : "json" , "idcompra" : ${data} }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },       
            {
                targets:[1],
                render: function ( data, type, row, meta )
                {
                   return  `<i class="icon md-money-box click"  data-actions='{ "fn":"abonoCompra" , "dataType" : "json" , "idcompra" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },       
            {
                targets:[8],
                render: function ( data, type, row, meta )
                {
                   return  numberFormatFE(data)
                }
            }
        ], 
        ajax:
        {
            type: "POST",
            url: "",
            data: {controller: 'Compra', action: 'paginarPagosProveedores' },
            beforeSend: function (request) 
            {
                //MostrarLoading();
            },
            error: function( error )
            {   
                console.log('error',error.responseText);
            },
            dataSrc: function (json) 
            { 
                _globals.total = json.total
                return json.data;
            }
        },
        footerCallback: function (row, data, start, end, display) 
        {      
          var api = this.api();  
          if( _globals.total == null )
          _globals.total = 0
          $(api.column(0).footer()).html('$ ' + _globals.total);
        }

    })
    $('.table-orden-compra thead tr:eq(1) th').each( function (i) 
    {
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })

       
}
function paginarNomina()
{  
    table = $('.table-nomina').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        drawCallback: function( settings ) {
            
        },
        // processing: false ,
        // searching: true ,
        // pageLength: 10,
        // serverSide: true,
        // ordering: true, 
        destroy: true,
        columns: 
        [
           {data: "id"},
           {data: "id"},
           {data: "id"},
           {data: "id"},
           {data: "fecha_creacion"},
           {data: "inicio_periodo"},
           {data: "fin_periodo"},
           {data: "usuario"},
           {data: "observaciones"}
        ],  
        columnDefs: 
        [      
            {
                targets:[0],
                render: function ( data, type, row, meta )
                {
                    return  `<i class="icon ion-md-search click"  data-actions='{ "fn": "mostrarDetalleNomina", "modal": true, "modalWidth" : "90", "controller": "Nomina", "action": "detalleNomina", "dataType" : "json" , "response":"body-response", "id" : ${data} }' aria-hidden="true" style="font-size:24px"></i>`
                }
            }, 
            {
                targets:[1],
                render: function ( data, type, row, meta )
                {
                    return  `<i class="icon ion-md-create click"  data-actions='{ "fn": "getContent", "modal": true, "controller": "Nomina", "action": "editarNomina", "dataType" : "json" , "response":"modal-body",  "id" : ${data} }' aria-hidden="true" style="font-size:24px"></i>`
                    
                }
            },       
            {
                targets:[2],
                render: function ( data, type, row, meta )
                {
                   return  `<i class="icon ion-md-trash click"  data-actions='{ "fn":"eliminarNomina" , "dataType" : "json" , "id" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },
            {
                targets:[3],
                render: function ( data, type, row, meta )
                {
                    return  `<i class="icon ion-md-print click"  data-actions='{ "fn":"imprimirNominaSemanal" , "url" : "pdf/imprimirNominaSemanal.php" , "idnomina" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                }
            }  
        ], 
        ajax:
        {
            type: "POST",
            url: "",
            data: {controller: 'Nomina', action: 'paginarNomina' },
            beforeSend: function (request) 
            {
                //MostrarLoading();
            },
            error: function( error )
            {   
                console.log('error',error.responseText)
            },
            dataSrc: function (json) 
            { 
                return json.data
            }
        }

    })
    
    $('.table-nomina thead tr:eq(1) th').each( function (i) 
    {
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })
    

       
}
function paginarBodega()
{  
    table = $('.table-bodega').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        ordering: false, 
        drawCallback: function( settings ) {
            
        },
        // processing: false ,
        // searching: true ,
        // pageLength: 10,
        // serverSide: true,
        // ordering: true, 
        destroy: true,
        columns: 
        [
           {data: "id"},
           {data: "productos"},
           {data: "fecha"},
           {data: "nombre"},
           {data: "usuario"}
        ],  
        columnDefs: 
        [ 
                               
            {
                targets:[0],
                render: function ( data, type, row, meta )
                {
                   return  `<i class="icon ion-md-trash click"  data-actions='{ "fn":"eliminarBodega" , "dataType" : "json" , "id" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },
            {
                targets:[1],
                render: function ( data, type, row, meta )
                {
                return  `<h3><span class="badge badge-round badge-info" style='float: left;margin-top: -22px;margin-right: 4px;'>${data}</span></h3> `
                //<i class="icon pe-plus click"  data-actions='{ "fn":"formularioAgregarProducto" , "dataType" : "json" , "row" : ${JSON.stringify(row) } }' aria-hidden="true" style="font-size:24px"></i>
                }
            }       
        ], 
        ajax:
        {
            type: "POST",
            url: "",
            data: {controller: 'Bodega', action: 'paginarBodega' },
            beforeSend: function (request) 
            {
                //MostrarLoading();
            },
            error: function( error )
            {   
                console.log('error',error.responseText)
            },
            dataSrc: function (json) 
            { 
                return json.data
            }
        }

    })
    
    $('.table-bodega thead tr:eq(1) th').each( function (i) 
    {
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })
    

       
}
function paginarProductoBodega()
{
    table = $('.table-producto-bodega').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        processing: false ,
        ordering: false ,
        fixedHeader:
        {
            header: true,
            headerOffset: 0
        },
        drawCallback: function( settings ) {
            
        },
        // processing: false ,
        // searching: true ,
        // pageLength: 10,
        // serverSide: true,
        // ordering: true, 
        destroy: true,
        columns: 
        [
           {data: "id"},
           {data: "nombre"},
           {data: "cantidad"}
        ],  
        columnDefs: 
        [                     
            {
                targets:[0],
                render: function ( data, type, row, meta )
                {
                   return  `<i class="icon ion-md-trash click"  data-actions='{ "fn":"eliminarProductoBodega" , "dataType" : "json" , "id" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                }
            }       
        ], 
        ajax:
        {
            type: "POST",
            url: "",
            data: {controller: 'Bodega', action: 'paginarProductoBodega' },
            beforeSend: function (request) 
            {
                //MostrarLoading();
            },
            error: function( error )
            {   
                console.log('error',error.responseText)
            },
            dataSrc: function (json) 
            { 
                return json.data
            }
        }

    })
    
    $('.table-producto-bodega thead tr:eq(1) th').each( function (i) 
    {
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })
}
function paginarCotizacion()
{  
    table = $('.table-cotizacion').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        destroy: true,
        columns: 
        [
           {data: "id"},
           {data: "id"},
           {data: "id"},
           {data: "id"},
           {data: "numero"},
           {data: "fecha"},
           {data: "cliente"},
           {data: "trabajador"},
           {data: "descuento"},
           {data: "total"}
        ],
        columnDefs: 
        [   
            {
                targets:[0],
                render: function ( data, type, row, meta )
                {
                    return  `<i class="icon ion-md-print click"  data-actions='{ "fn":"imprimirCotizacion" , "url" : "pdf/imprimirCotizacion.php" , "idcotizacion" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },       
            {
                targets:[1],
                render: function ( data, type, row, meta )
                {
                return  `<i class="icon ion-ios-search click"  data-actions='{ "fn":"getContent" ,"controller":"Factura" ,"action":"detalleCotizacion", "dataType" : "json", "modalWidth":"90", "modal" : true , "idcotizacion" : ${data} }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },       
            {
                targets:[2],
                render: function ( data, type, row, meta )
                {
                   return  `<i class="icon ion-md-create click"  data-actions='{ "fn":"getContent", "controller":"Factura", "action":"editarCotizacion", "response":"body-response", "dataType" : "html" , "idcotizacion" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },
            {
                targets:[3],
                render: function ( data, type, row, meta )
                {
                   return  `<i class="icon  ion-md-trash click"  data-actions='{ "fn":"eliminarCotizacion","idcotizacion" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },      
            {
                targets:[8],
                render: function ( data, type, row, meta )
                {
                   return  `${data}%`
                }
            },       
            {
                targets:[9],
                className: "text-right",
                render: function ( data, type, row, meta )
                {
                   return  numberFormatFE(data)
                }
            }       
        ],
        ajax:
        {
            type: "POST",
            url: "",
            data: {controller: 'Factura', action: 'paginarCotizacion' },
            beforeSend: function (request) 
            {
                //MostrarLoading();
            },
            error: function( error )
            {   
                console.log('error',error.responseText);
            },
            dataSrc: function (json) 
            { 
                return json.data;
            }
        }
    })
    $('.table-cotizacion thead tr:eq(1) th').each( function (i) 
    { 
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })

       
}
function paginarProveedor()
{  
    table = $('.table-proveedor').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        drawCallback: function( settings ) {
            
        },
        // processing: false ,
        // searching: true ,
        // pageLength: 10,
        // serverSide: true,
        // ordering: true, 
        destroy: true,
        columns: 
        [
           {data: "id"},
           {data: "id"},
           {data: "fecha"},
           {data: "nombres"},
           {data: "documento"},
           {data: "telefono"},
           {data: "direccion"},
           {data: "ciudad"},
           {data: "cuenta"},
           {data: "banco"}
        ],
        columnDefs: 
        [ 
            {
                targets:[0],
                render: function ( data, type, row, meta )
                {
                    return  `<i class="icon ion-md-create click"  data-actions='{ "fn":"getContent" ,"controller" : "Proveedor", "action" : "editarProveedor", "dataType" : "json" , "idproveedor" : ${data } , "modal" : true , "backdrop" : true  }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },       
            {
                targets:[1],
                render: function ( data, type, row, meta )
                {
                   return  `<i class="icon  ion-md-trash click"  data-actions='{ "fn":"eliminarProveedor","idproveedor" : ${data } , "modal" : true , "backdrop" : true  }' aria-hidden="true" style="font-size:24px"></i>`
                }
            }      
        ],
        ajax:
        {
            type: "POST",
            url: "",
            data: {controller: 'Proveedor', action: 'paginarProveedor' },
            beforeSend: function (request) 
            {
                //MostrarLoading();
            },
            error: function( error )
            {   
                console.log('error',error.responseText);
            },
            dataSrc: function (json) 
            { 
                return json.data;
            }
        }
    })
    $('.table-proveedor thead tr:eq(1) th').each( function (i) 
    { 
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })

       
}
function paginarClientes()
{  
    table = $('.table-cliente').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        responsive: true,
        drawCallback: function( settings ) {
        },
        // processing: false ,
        // searching: true ,
        // pageLength: 10,
        // serverSide: true,
        // ordering: true, 
        destroy: true,
        columns: 
        [
           {data: "nombres"},
           {data: "correo"},
           {data: "tipo_documento"},
           {data: "documento"},
           {data: "tipo_persona"},
           {data: "regimen"},
           {data: "telefono"},
           {data: "direccion"}, 
           {data: "id"},
           {data: "id"}
        ],
        columnDefs: 
        [ 
            {
                targets:[3],
                render: function ( data, type, row, meta )
                {
                    return  `${data}-${row.dv} `
                }
            },    
            {
                targets:[8],
                render: function ( data, type, row, meta )
                {
                    return  `<i class="icon ion-md-create click"  data-actions='{ "fn":"getContent" ,"controller" : "Cliente", "action" : "editarCliente", "dataType" : "json" , "idcliente" : ${data } , "modal" : true , "backdrop" : true  }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },       
            {
                targets:[9],
                render: function ( data, type, row, meta )
                {
                   return  `<i class="icon  ion-md-trash click"  data-actions='{ "fn":"eliminarCliente","idcliente" : ${data } , "modal" : true , "backdrop" : true  }' aria-hidden="true" style="font-size:24px"></i>`
                }
            }     
        ],
        ajax:
        {
            type: "POST",
            url: "",
            data: {controller: 'Cliente', action: 'paginarCliente' },
            beforeSend: function (request) 
            {
                //MostrarLoading();
            },
            error: function( error )
            {   
                console.log('error',error.responseText);
            },
            dataSrc: function (json) 
            { 
                return json.data;
            }
        }
    })
    $('.table-cliente thead tr:eq(1) th').each( function (i) 
    { 
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })

       
}
function paginarUsuario()
{  
    table = $('.table-usuario').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        drawCallback: function( settings ) { 

            $('[data-fancybox="gallery"]').fancybox({ })
        },
        // processing: false ,
        // searching: true ,
         pageLength: 8,
        // serverSide: true,
        // ordering: true, 
        destroy: true,
        columns: 
        [
           {data: "id"},
           {data: "id"},
           {data: "codigo"},
           {data: "nombres"},
           {data: "apellidos"},
           {data: "tipo_documento"},
           {data: "documento"},
           {data: "salario"},
           {data: "imagen"}
        ],
        columnDefs: 
        [ 
            {
                targets:[0],
                render: function ( data, type, row, meta )
                {
                    return  `<i class="icon ion-md-create click"  data-actions='{ "fn":"getContent" ,"controller" : "Usuario", "action" : "editarUsuario", "dataType" : "json" , "idtrabajador" : ${data } , "modal" : true , "backdrop" : true  }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },       
            {
                targets:[1],
                render: function ( data, type, row, meta )
                {
                   return  `<i class="icon  ion-md-trash click"  data-actions='{ "fn":"eliminarUsuario","idtrabajador" : ${data } , "modal" : true , "backdrop" : true  }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },
            {
                targets:[7],
                render: function ( data, type, row, meta )
                {
                   return  numberFormatFE(data)
                }
            },
            {
                targets:[8],
                render: function ( data, type, row, meta )
                {
                   if( data.length > 0 )
                       return `<a data-fancybox="gallery" href="public/fotos/${data}">
                                    <img style="width:32px; height:32px; border:1px dashed silver;" src="public/fotos/${data}">
                               </a>`
                   else
                    return  `<img src="public/fotos/vacio.jpg" style="width:32px; height:32px; border:1px dashed silver;" />`

                }
            }            
        ],
        ajax:
        {
            type: "POST",
            url: "",
            data: {controller: 'Usuario', action: 'paginarUsuario' },
            beforeSend: function (request) 
            {
                //MostrarLoading();
            },
            error: function( error )
            {   
                console.log('error',error.responseText);
            },
            dataSrc: function (json) 
            { 
                return json.data;
            }
        }
    })
    $('.table-usuario thead tr:eq(1) th').each( function (i) 
    { 
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })

       
}
function paginarResolucion()
{  
    
    table = $('.table-resolucion').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        responsive: true,
        // processing: false ,
        // searching: true ,
        // pageLength: 10,
        // serverSide: true,
        // ordering: true, 
        destroy: true,
        columns: 
        [
           {data: "status"},
           {data: "fecha_resolucion"},
           {data: "numero_resolucion"},
           {data: "prefijo"},
           {data: "desde"},
           {data: "hasta"},
           {data: "contador"},
           {data: "fecha_inicio"},
           {data: "fecha_fin"},
           {data: "id"},
           {data: "id"}
        ],
        rowCallback: function (row, data) 
        { 
             if( data.vencimiento_fecha <= 30 || data.vencimiento_numero <= 500 )
                $(row).addClass('table-warning')
        },
        columnDefs: 
        [ 
            {
                targets:[0],
                render: function( data, type, row, meta)
                {
                    if( data == 1 )
                    {
                        return  `<center>
                                    <span class="work-status">
                                        <span class="badge badge-lg badge-success">Activo</span>
                                    </span>
                                </center>`
                    }
                    else
                    {
                        return  `<center>
                                    <span class="work-status">
                                        <span class="badge badge-lg badge-secondary">Inactivo</span>
                                    </span>
                                </center>`
                    }
                }
            }
            ,
            {
                targets:[9],
                render: function ( data, type, row, meta )
                {
                    return  `<i class="icon ion-md-create click"  data-actions='{ "fn":"getContent" ,"controller" : "Factura", "action" : "editarResolucion", "dataType" : "json" , "id" : ${data } , "modal" : true , "backdrop" : true  }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },       
            {
                targets:[10],
                render: function ( data, type, row, meta )
                {
                   return  `<i class="icon  ion-md-trash click"  data-actions='{ "fn":"eliminarResolucion","id" : ${data } , "modal" : true , "backdrop" : true  }' aria-hidden="true" style="font-size:24px"></i>`
                }
            }      
        ],
        ajax:
        {
            type: "POST",
            url: "",
            data: {controller: 'Factura', action: 'paginarResolucion' },
            beforeSend: function (request) 
            {
                //MostrarLoading();
            },
            error: function( error )
            {   
                console.log('error',error.responseText);
            },
            dataSrc: function (json) 
            { 
                return json.data;
            }
        }
    })
    $('.table-resolucion thead tr:eq(1) th').each( function (i) 
    { 
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })

       
}
function paginarListaPrecios()
{  
    table = $('.table-lista-precios').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        responsive: true,
        drawCallback: function( settings ) {
        },
        destroy: true,
        columns: 
        [
           {data: "fecha"},
           {data: "nombre"},
           {data: "productos"},
           {data: "clientes"},
           {data: "id"},
           {data: "id"}
        ],
        columnDefs: 
        [ 
            {
                targets:[2],
                render: function ( data, type, row, meta )
                {
                    return `<div class='miInfo click'  data-actions='{ "fn": "getContent" , "idlista" : ${row.id}, "modal": true, "controller": "Configuracion", "action": "verProductosListaPrecios", "dataType" : "html" ,"response":"modal-body"  }'>${data}</div>`
                }
            },       
            {
                targets:[3],
                render: function ( data, type, row, meta )
                {
                    return `<div class='miInfo click'  data-actions='{ "fn": "getContent" , "idlista" : ${row.id}, "modal": true, "controller": "Configuracion", "action": "verClientesListaPrecios", "dataType" : "html" ,"response":"modal-body"  }'>${data}</div>`

                }
            },  
            {
                targets:[4],
                render: function ( data, type, row, meta )
                {
                    return  `<i class="icon ion-md-create click"  data-actions='{ "fn": "editarListaPrecio" , "idlista" : ${data }  }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },       
            {
                targets:[5],
                render: function ( data, type, row, meta )
                {
                   return  `<i class="icon  ion-md-trash click"  data-actions='{ "fn":"eliminarListaPrecio", "idlista" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                }
            }      
        ],
        ajax:
        {
            type: "POST",
            url: "",
            data: {controller: 'Configuracion', action: 'paginarListaPrecios' },
            beforeSend: function (request) 
            {
                //MostrarLoading();
            },
            error: function( error )
            {   
                console.log('error',error.responseText);
            },
            dataSrc: function (json) 
            { 
                return json.data;
            }
        }
    })
    $('.table-lista-precios thead tr:eq(1) th').each( function (i) 
    { 
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })
}
function paginarBanco()
{   
    table = $('.table-banco').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        drawCallback: function( settings ) {
            
        },
        // processing: false ,
        // searching: true ,
        // pageLength: 10,
        // serverSide: true,
        // ordering: true, 
        destroy: true,
        columns: 
        [
           {data: "id"},
           {data: "id"},
           {data: "id"},
           {data: "id"},
           {data: "fecha"},
           {data: "banco"}
        ],  
        columnDefs: 
        [ 
            {
                targets:[0],
                render: function ( data, type, row, meta )
                {
                    return  `<i class="icon pe-plus click"  data-actions='{ "fn": "getContent", "modal": true, "controller": "Banco", "action": "agregarSucursal", "dataType" : "html" ,"modal" : "true", "response":"modal-body", "id" : ${data} }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },
            {
                targets:[1],
                render: function ( data, type, row, meta )
                {
                    return  `<i class="icon ion-md-search click"  data-actions='{ "fn": "getContent", "modal": true, "controller": "Banco", "action": "sucursalBanco", "dataType" : "html" ,"modal" : "true", "response":"modal-body", "id" : ${data} }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },       
            {
                targets:[2],
                render: function ( data, type, row, meta )
                {
                    return  `<i class="icon ion-md-create click"  data-actions='{ "fn": "getContent", "modal": true, "controller": "Banco", "action": "editarBanco", "modal" : "true" , "dataType" : "html" , "response":"modal-body",  "id" : ${data} }' aria-hidden="true" style="font-size:24px"></i>`
                    
                }
            },       
            {
                targets:[3],
                render: function ( data, type, row, meta )
                {
                   return  `<i class="icon ion-md-trash click"  data-actions='{ "fn":"eliminarBanco" , "dataType" : "json" , "id" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                }
            }
        ], 
        ajax:
        {
            type: "POST",
            url: "",
            data: {controller: 'Banco', action: 'paginarBanco' },
            beforeSend: function (request) 
            {
                //MostrarLoading();
            },
            error: function( error )
            {   
                console.log('error',error.responseText)
            },
            dataSrc: function (json) 
            { 
                return json.data
            }
        }

    })
    
    $('.table-banco thead tr:eq(1) th').each( function (i) 
    {
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })
    

       
}
function paginarDepartamento()
{   
    table = $('.table-departamento').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        destroy: true,
        columns: 
        [
           {data: "id"},
           {data: "id"},
           {data: "id"},
           {data: "cod_departamento"},
           {data: "departamento"}
        ],  
        columnDefs: 
        [ 
            {
                targets:[0],
                render: function ( data, type, row, meta )
                {
                    return  `<i class="icon pe-plus click"  data-actions='{ "fn": "getContent", "modal": true, "controller": "Departamento", "action": "agregarCiudad", "dataType" : "html" ,"modal" : "true", "response":"modal-body", "id" : ${data} }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },
            {
                targets:[1],
                render: function ( data, type, row, meta )
                {
                    return  `<i class="icon ion-md-search click"  data-actions='{ "fn": "getContent", "modal": true, "controller": "Departamento", "action": "ciudadDepartamento", "dataType" : "html" ,"modal" : "true", "response":"modal-body", "id" : ${data} }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },       
            {
                targets:[2],
                render: function ( data, type, row, meta )
                {
                    return  `<i class="icon ion-md-create click"  data-actions='{ "fn": "getContent", "modal": true, "controller": "Departamento", "action": "editarDepartamento", "modal" : "true" , "dataType" : "html" , "response":"modal-body",  "id" : ${data} }' aria-hidden="true" style="font-size:24px"></i>`
                    
                }
            }
        ], 
        ajax:
        {
            type: "POST",
            url: "",
            data: {controller: 'Departamento', action: 'paginarDepartamento' },
            error: function( error )
            {   
                console.log('error',error.responseText)
            }
        }

    })
    
    $('.table-departamento thead tr:eq(1) th').each( function (i) 
    {
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })
    

       
}
function paginarRecibo()
{  
    table = $('.table-recibo').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        drawCallback: function( settings ) {
            
        }, 
        // processing: false ,
        // searching: true ,
        // pageLength: 10,
        // serverSide: true,
        // ordering: true, 
        destroy: true,
        columns: 
        [
           {data: "id"},
           {data: "id"},
           {data: "numero"},
           {data: "fecha"},
           {data: "concepto"},
           {data: "banco"},
           {data: "sucursal"},
           {data: "total"},
           {data: "id"}
        ],  
        columnDefs: 
        [      
            {
                targets:[0],
                render: function ( data, type, row, meta )
                {
                    return  `<i class="icon ion-md-create click"  data-actions='{ "fn": "getContent", "modal": true, "controller": "Recibo", "action": "editarRecibo", "modal" : "true" , "dataType" : "html" , "response":"modal-body",  "id" : ${data} }' aria-hidden="true" style="font-size:24px"></i>`
                    
                }
            },       
            {
                targets:[1],
                render: function ( data, type, row, meta )
                {
                   return  `<i class="icon ion-md-trash click"  data-actions='{ "fn":"eliminarRecibo" , "dataType" : "json" , "id" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },
            {
                targets:[8],
                render: function ( data, type, row, meta )
                {
                   return  `<i class="icon ion-md-print click"  data-actions='{ "fn":"imprimirReciboCaja" , "url" : "pdf/imprimirReciboCaja.php" , "idrecibo" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                }
            }
        ], 
        ajax:
        {
            type: "POST",
            url: "",
            data: {controller: 'Recibo', action: 'paginarRecibo' },
            beforeSend: function (request) 
            {
                //MostrarLoading();
            },
            error: function( error )
            {   
                console.log('error',error.responseText)
            },
            dataSrc: function (json) 
            { 
                return json.data
            }
        }

    })
    
    $('.table-recibo thead tr:eq(1) th').each( function (i) 
    {
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })
    

       
}
function paginarCodigosCliente()
{  
    table = $('.table-lista-codigos').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        responsive: true,
        drawCallback: function( settings ) {
        },
        // processing: false ,
        // searching: true ,
        // pageLength: 10,
        // serverSide: true,
        // ordering: true, 
        destroy: true,
        columns: 
        [
           {data: "id"},
           {data: "cliente_id"},
           {data: "fecha"},
           {data: "cliente"},
           {data: "cantidad"},
           
        ],
        columnDefs: 
        [ 
            {
                targets:[0],
                render: function ( data, type, row, meta )
                {
                    return  `<i class="icon  ion-md-trash click"  data-actions='{ "fn":"eliminarCodigoCliente", "id" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },       
            {
                targets:[1],
                render: function ( data, type, row, meta )
                {
                   return  `<i class="icon  ion-ios-search click"  data-actions='{ "fn":"getContent","controller":"Configuracion","action":"detalleCodigoCliente", "modal":true,"response":"modal-body","id" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                }
            }      
        ],
        ajax:
        {
            type: "POST",
            url: "",
            data: {controller: 'Configuracion', action: 'paginarCodigosCliente' },
            beforeSend: function (request) 
            {
                //MostrarLoading();
            },
            error: function( error )
            {   
                console.log('error',error.responseText);
            },
            dataSrc: function (json) 
            { 
                return json.data;
            }
        }
    })
    $('.table-lista-codigo thead tr:eq(1) th').each( function (i) 
    { 
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })

       
}
function paginarReporteVentas( action , obj )
{  
    dataTable = $('.table-reporte-ventas').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        responsive: true,
        drawCallback: function( settings ) {
        }, 
        destroy: true,
      "columns": 
      [
           {"data": "id"},
           {"data": "fecha"},
           {"data": "trabajador"},
           {"data": "cliente"},
           {"data": "factura"},
           {"data": "tipo"},
           {"data": "total"} ,
           {"data": "id"} ,
           {"data": "id"} ,
           {"data": "id"} ,
           {"data": "id"} 
      ],  
      columnDefs: 
      [
        {
            targets:[0],
            render: function ( data, type, row, meta )
            { 
               return  `<i class="icon ion-md-create click"  data-actions='{ "fn":"getContent", "controller":"Factura", "action":"editarFactura", "response":"body-response", "dataType" : "html" , "idventa" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
            }
        },
          { 
            targets:[6],
            render: function ( data, type, row, meta ) 
            {
               return numberFormatFE(data)
            }
          },
          { 
            targets:[7],
            render: function ( data, type, row, meta ) 
            {
                return  `<i class="icon ion-md-print click"  data-actions='{ "fn":"imprimirTermica", "impresora":"1", "idventa" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
            }
          },
          { 
            targets:[8],
            render: function ( data, type, row, meta ) 
            {
                return  `<i class="icon ion-md-print click"  data-actions='{ "fn":"imprimirTermica", "impresora":"2", "idventa" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
            }
          },
          { 
            targets:[9],
            render: function ( data, type, row, meta ) 
            {
                return  `<i class="icon ion-md-print click"  data-actions='{ "fn":"imprimirFactura" , "url" : "pdf/imprimirFactura.php" , "idventa" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
            }
          },
          { 
            targets:[10],
            render: function ( data, type, row, meta ) 
            { 
               return  "<i class='link abrir-modal icon search' style='font-size:24px;' data-url='get.php' data-title='DETALLE VENTA' data-data='opcion=DetalleVenta&id="+data+"' ></i>";

            }
          } 
      ], 
      "ajax":
      {
        "type": "post", 
        "url": "",                    
        data: $("#reporteVenta").serializeFormJSON(),
        beforeSend: function (request) 
        { 
        },
        error: function( error )
        {   
           console.log('error',error);
        },
        dataSrc: function (json) 
        {  
          globals = 
          {
             "total" : json.total
          } 
          return json.data;

        } 
      }
      ,
      footerCallback: function (row, data, start, end, display) 
      {
      
        var api = this.api();
        $(api.column(5).footer()).html('<b>' + numberFormatFE(globals.total) + '</b>' ); 
      } 
    });
}
function paginarPagosPorBancos( action , obj )
{  
    dataTable = $('.table-pagos-por-bancos').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        responsive: true,
        drawCallback: function( settings ) {
        }, 
        destroy: true,
      "columns": 
      [
           {"data": "fecha"},
           {"data": "abono"},
           {"data": "factura"},
           {"data": "banco"},
           {"data": "registro"}
      ], 
      "ajax":
      {
        "type": "post", 
        "url": "",                    
        data: $("#frmPagosPorBancos").serializeFormJSON(),
        beforeSend: function (request) 
        { 
        },
        error: function( error )
        {   
           console.log('error',error);
        },
        dataSrc: function (json) 
        {  
          return json.data;

        } 
      }
    });
} 
function paginarEgreso()
{ 
    table = $('.table-egreso').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        destroy: true,
        columns: 
        [
           {data: "id"},
           {data: "id"},
           {data: "id"},
           {data: "fecha"},
           {data: "concepto"},
           {data: "valor"},
           {data: "observaciones"}
        ],
        columnDefs: 
        [ 
            
            {
                targets:[0],
                render: function ( data, type, row, meta )
                {
                    return  `<i class="icon ion-md-print click"  data-actions='{ "fn":"imprimirComprobanteEgreso" , "url" : "pdf/imprimirComprobanteEgreso.php" , "idegreso" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },       
            {
                targets:[1],
                render: function ( data, type, row, meta )
                {
                   return  `<i class="icon ion-md-create click"  data-actions='{ "fn":"getContent", "controller":"Egreso", "action":"editarEgreso", "response":"body-response", "dataType" : "html" , "modal" : "true", "idegreso" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },
            {
                targets:[2],
                render: function ( data, type, row, meta )
                {
                   return  `<i class="icon  ion-md-trash click"  data-actions='{ "fn":"eliminarEgreso","idegreso" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },       
            {
                targets:[5],
                className: "text-right",
                render: function ( data, type, row, meta )
                {
                   return  numberFormatFE(data)
                }
            }       
        ],
        ajax:
        {
            type: "POST",
            url: "",
            data: {controller: 'Egreso', action: 'paginarEgreso' },
            beforeSend: function (request) 
            {
                //MostrarLoading();
            },
            error: function( error )
            {   
                console.log('error',error.responseText);
            },
            dataSrc: function (json) 
            { 
                return json.data;
            }
        }
    })
    $('.table-egreso thead tr:eq(1) th').each( function (i) 
    { 
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })

       
}
function paginarFacturas()
{ 
    table = $('.table-factura').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        destroy: true,
        columns: 
        [
           {data: "id"},
           {data: "id"},
           {data: "id"},
           {data: "id"},
           {data: "fecha"},
           {data: "factura"},
           {data: "tipo"},
           {data: "cliente"},
           {data: "ciudad"},
           {data: "descuento"},
           {data: "observaciones"},
           {data: "id"}
        ],
        columnDefs: 
        [ 
            
            {
                targets:[0],
                render: function ( data, type, row, meta )
                {
                    return  `<i class="icon ion-md-print click"  data-actions='{ "fn":"imprimirFactura" , "url" : "pdf/imprimirFactura.php" , "idventa" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },       
            {
                targets:[1],
                render: function ( data, type, row, meta )
                {
                    return  `<i class="icon ion-md-print click"  data-actions='{ "fn":"imprimirTermica", "impresora" : "1",  "idventa" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },       
            {
                targets:[2],
                render: function ( data, type, row, meta )
                {
                    return  `<i class="icon ion-md-print click"  data-actions='{ "fn":"imprimirTermica", "impresora" : "2", "idventa" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },       
            {
                targets:[3],
                render: function ( data, type, row, meta )
                { 
                   return  `<i class="icon ion-md-create click"  data-actions='{ "fn":"getContent", "controller":"Factura", "action":"editarFactura", "response":"body-response", "dataType" : "html" , "idventa" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },       
            {
                targets:[11],
                className: "text-right",
                render: function ( data, type, row, meta )
                {
                   return  numberFormatFE(row.precio * row.cantidad)
                }
            }       
        ],
        ajax:
        {
            type: "POST",
            url: "",
            data: {controller: 'Factura', action: 'paginarFacturas' },
            beforeSend: function (request) 
            {
                //MostrarLoading();
            },
            error: function( error )
            {   
                console.log('error',error.responseText);
            },
            dataSrc: function (json) 
            { 
                return json.data;
            }
        }
    })
    $('.table-factura thead tr:eq(1) th').each( function (i) 
    { 
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })

       
}
function paginarNotaDebito()
{ 
    
    
    table = $('.table-nota-debito').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        destroy: true,
        columns: 
        [
           {data: "id"},
           {data: "id"},
           {data: "fecha"},
           {data: "factura"},
           {data: "concepto"},
           {data: "numero_nota_debito"},
           {data: "total"}
        ],
        columnDefs: 
        [   
            {
                targets:[0],
                render: function ( data, type, row, meta )
                {
                    return  `<i class="icon ion-md-print click"  data-actions='{ "fn":"imprimirNotaDebito" , "url" : "pdf/imprimirNotaDebito.php" , "idnota" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },       
            {
                targets:[1],
                render: function ( data, type, row, meta )
                {
                    
                   return  `<i class="icon ion-md-create click"  data-actions='{ "fn":"getContent", "controller":"NotaDebito", "action":"editarNotaDebito", "response":"body-response", "dataType" : "html" , "idnota" : ${data} }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },       
            {
                targets:[6],
                className: "text-right",
                render: function ( data, type, row, meta )
                {
                   return  numberFormatFE(data)
                }
            }       
        ],
        ajax:
        {
            type: "POST",
            url: "",
            data: {controller: 'NotaDebito', action: 'paginarNotaDebito' },
            beforeSend: function (request) 
            {
                //MostrarLoading();
            },
            error: function( error )
            {   
                console.log('error',error.responseText);
            },
            dataSrc: function (json) 
            { 
                return json.data;
            }
        }
    })
    $('.table-nota-debito thead tr:eq(1) th').each( function (i) 
    { 
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })

       
}
function paginarReporteStock()
{ 
    

    table = $('.table-reporte').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        destroy: true,
        columns: 
        [
           {data: "nombre"},
           {data: "suma_entrada"},
           {data: "suma_salida"},
           {data: "cantidad"}
        ],
        columnDefs: 
        [   
            {
                targets:[0],
                render: function ( data, type, row, meta )
                {
                    return  `<span class='hover click' data-actions='{ "fn": "paginarHistorial", "elemento":"producto", "idproducto" : ${row.id} }'>${data}</span>`
                }
            }
        ],
        ajax:
        {
            type: "POST",
            url: "",
            data: {controller: 'Reportes', action: 'paginarReporteStock' },
            beforeSend: function (request) 
            {
                //MostrarLoading();
            },
            error: function( error )
            {   
                console.log('error',error.responseText);
            },
            dataSrc: function (json) 
            { 
                return json.data;
            }
        }
    })
    $('.table-reporte thead tr:eq(1) th').each( function (i) 
    { 
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })

       
}
function paginarReporteValorStock()
{ 
    
    
    table = $('.table-reporte').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        destroy: true,
        columns: 
        [
           {data: "nombre"},
           {data: "cantidad"},
           {data: "costo"},
           {data: "total"}
        ],
        columnDefs: 
        [   
            {
                targets:[0],
                render: function ( data, type, row, meta )
                {
                    return  `<span class='hover click' data-actions='{ "fn": "paginarHistorial", "elemento":"producto", "idproducto" : ${row.id} }'>${data}</span>`
                }
            },
            {
                targets:[2],
                className: "text-right",
                render: function ( data, type, row, meta )
                {
                    return  numberFormatFE(data)
                }
            },
            {
                targets:[3],
                className: "text-right",
                render: function ( data, type, row, meta )
                {
                    return  numberFormatFE(data)
                }
            }
        ],
        ajax:
        {
            type: "POST",
            url: "",
            data: {controller: 'Reportes', action: 'paginarReporteValorStock' },
            beforeSend: function (request) 
            {
                //MostrarLoading();
            },
            error: function( error )
            {   
                console.log('error',error.responseText);
            },
            dataSrc: function (json) 
            { 
                console.log( json )
                _globals.total = json.total
                return json.data;
            }
        },
        footerCallback: function (row, data, start, end, display) 
        {      
            var api = this.api()
            $(api.column(3).footer()).html( `<b> ${numberFormatFE(_globals.total)} </b>` )
        }
    })
    $('.table-reporte thead tr:eq(1) th').each( function (i) 
    { 
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })

       
}
function paginarReporteVentasClientes()
{ 
    
    
    table = $('.table-reporte').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        destroy: true,
        columns: 
        [
           {data: "cliente"},
           {data: "total"}
        ],
        columnDefs: 
        [   
            {
                targets:[0],
                render: function ( data, type, row, meta )
                {
                    return  `<span class='hover click' data-actions='{ "fn": "paginarHistorial", "elemento":"cliente" , "idcliente" : ${row.id} }'>${data}</span>`
                }
            },
            {
                targets:[1],
                className: "text-right",
                render: function ( data, type, row, meta )
                {
                    return  numberFormatFE(data)
                }
            }
        ],
        ajax:
        {
            type: "POST",
            url: "",
            data: {controller: 'Reportes', action: 'paginarVentasPorCliente' },
            beforeSend: function (request) 
            {
                //MostrarLoading();
            },
            error: function( error )
            {   
                console.log('error',error.responseText);
            },
            dataSrc: function (json) 
            { 
                _globals.total = json.total
                return json.data;
            }
        },
        footerCallback: function (row, data, start, end, display) 
        {      
            var api = this.api()
            $(api.column(1).footer()).html( `<b> ${numberFormatFE(_globals.total)} </b>` )
        }
    })
    $('.table-reporte thead tr:eq(1) th').each( function (i) 
    { 
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })

       
}
function paginarReportePorCiudad()
{ 
    
    
    table = $('.table-reporte').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        destroy: true,
        columns: 
        [
           {data: "ciudad"},
           {data: "total"}
        ],
        columnDefs: 
        [   
            {
                targets:[0],
                render: function ( data, type, row, meta )
                {
                    return  `<span class='hover click' data-actions='{ "fn": "paginarHistorial", "elemento": "ciudad", "idciudad" : ${row.id} }'>${data}</span>`
                }
            },
            {
                targets:[1],
                className: "text-right",
                render: function ( data, type, row, meta )
                {
                    return  numberFormatFE(data)
                }
            }
        ],
        ajax:
        {
            type: "POST",
            url: "",
            data: {controller: 'Reportes', action: 'paginarVentasPorCiudad' },
            beforeSend: function (request) 
            {
                //MostrarLoading();
            },
            error: function( error )
            {   
                console.log('error',error.responseText);
            },
            dataSrc: function (json) 
            { 
                _globals.total = json.total
                return json.data;
            }
        },
        footerCallback: function (row, data, start, end, display) 
        {      
            var api = this.api()
            $(api.column(1).footer()).html( `<b> ${numberFormatFE(_globals.total)} </b>` )
        }
    })
    $('.table-reporte thead tr:eq(1) th').each( function (i) 
    { 
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })

       
}
function paginarReporteVentasPorConsumo()
{ 
    
    
    table = $('.table-reporte').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        destroy: true,
        columns: 
        [
           {data: "cliente"},
           {data: "total"}
        ],
        columnDefs: 
        [   
            {
                targets:[0],
                render: function ( data, type, row, meta )
                {
                    return  `<span class='hover click' data-actions='{ "fn": "paginarHistorial", "elemento": "cliente", "idcliente" : ${row.id} }'>${data}</span>`
                }
            },
            {
                targets:[1],
                className: "text-right",
                render: function ( data, type, row, meta )
                {
                    return  numberFormatFEClear(data)
                }
            }
        ],
        ajax:
        {
            type: "POST",
            url: "",
            data: {controller: 'Reportes', action: 'paginarVentasPorConsumo' },
            beforeSend: function (request) 
            {
                //MostrarLoading();
            },
            error: function( error )
            {   
                console.log('error',error.responseText);
            },
            dataSrc: function (json) 
            { 
                _globals.total = json.total
                return json.data;
            }
        },
        footerCallback: function (row, data, start, end, display) 
        {      
            var api = this.api()
            $(api.column(1).footer()).html( `<b> ${numberFormatFEClear(_globals.total)} </b>` )
        }
    })
    $('.table-reporte thead tr:eq(1) th').each( function (i) 
    { 
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })

       
}
function paginarReporteVentasPorProducto()
{ 
    
    
    table = $('.table-reporte').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        destroy: true,
        columns: 
        [
           {data: "producto"},
           {data: "total_salida"},
           {data: "total_venta"}
        ],
        columnDefs: 
        [   
            {
                targets:[1],
                className: "text-right",
                render: function ( data, type, row, meta )
                {
                    return  numberFormatFEClear(data)
                }
            },
            {
                targets:[2],
                className: "text-right",
                render: function ( data, type, row, meta )
                {
                    return  numberFormatFEClear(data)
                }
            }
        ],
        ajax:
        {
            type: "POST",
            url: "",
            data: {controller: 'Reportes', action: 'paginarVentasPorProducto' },
            beforeSend: function (request) 
            {
                //MostrarLoading();
            },
            error: function( error )
            {   
                console.log('error',error.responseText);
            },
            dataSrc: function (json) 
            { 
                _globals.total_salida = json.total_salida
                _globals.total_venta = json.total_venta
                return json.data;
            }
        },
        footerCallback: function (row, data, start, end, display) 
        {      
            var api = this.api()
            $(api.column(1).footer()).html( `<b> ${numberFormatFEClear(_globals.total_salida)} </b>` )
            $(api.column(2).footer()).html( `<b> ${numberFormatFEClear(_globals.total_venta)} </b>` )
        }
    })
    $('.table-reporte thead tr:eq(1) th').each( function (i) 
    { 
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })

       
}
function paginarHistorial($this , actions )
{ 
    

    if( actions.elemento == 'producto' )
        $("#idproducto").val( actions.idproducto )
    if( actions.elemento == 'cliente' )
        $("#idcliente").val( actions.idcliente )
    if( actions.elemento == 'ciudad' )
        $("#idciudad").val( actions.idciudad )


    mostrarLoadingFull()
    
    table = $('.table-historial').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        searching: true ,
        destroy: true,
        columns: 
        [
           {data: "fecha"},
           {data: "producto"},
           {data: "entrada"},
           {data: "salida"},
           {data: "cliente"},
           {data: "factura"},
           {data: "venta"},
           {data: "dto"},
           {data: "ciudad"},
           {data: "costo"},
           {data: "observaciones"}
        ],
        ajax:
        {
            type: "POST",
            url: "",
            data: $("#frmFilto").serializeFormJSON(),
            beforeSend: function (request) 
            {
                //MostrarLoading();
            },
            error: function( error )
            {   
                console.log('error',error.responseText);
            },
            dataSrc: function (json) 
            { 
                ocultarLoadingFull()
                $(".historial").click()
                return json.data;
            }
        }
    })
    $('.table-historial thead tr:eq(1) th').each( function (i) 
    { 
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            console.log( "value1 ", this.value )
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            console.log( "value2 ", this.value )
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })

       
}
function paginarNumeracionRecibo($this , actions )
{  
    mostrarLoadingFull()
    
    table = $('.table-numeracion-recibo').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        searching: true ,
        destroy: true,
        columns: 
        [
           {data: "id"},
           {data: "id"},
           {data: "estado"},
           {data: "desde"},
           {data: "hasta"},
           {data: "contador"}
        ],
        columnDefs: 
        [
            {
                targets:[0],
                render: function ( data, type, row, meta )
                {
                    let modalWidth = ''
                    if( row.tipo_producto == 2 )
                    modalWidth = 90
                    return  `<i class="icon ion-md-create click"  data-actions='{ "fn": "getContent", "controller": "Recibo", "action": "editarNumeracionReciboCaja", "dataType" : "json" , "modal": true, "response":"modal-body",  "idnumeracion" : ${data} }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },       
            {
                targets:[1],
                render: function ( data, type, row, meta )
                {
                   return  `<i class="icon ion-md-trash click"  data-actions='{ "fn":"eliminarNumeracionReciboCaja" , "dataType" : "json" , "idnumeracion" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },            
            {
                targets:[2],
                render: function ( data, type, row, meta )
                {
                    if( data == 1 )
                    {
                        return  `<span class="work-status">
                                    <span class="badge badge-lg badge-success">Activo</span>
                                </span>`
                    }
                    else
                    {
                        return  `<span class="work-status">
                                    <span class="badge badge-lg badge-secondary">Inactivo</span>
                                </span>`
                    }
                }
            }
        ],
        ajax:
        {
            type: "POST",
            url: "",
            data:{"controller":"Recibo","action":"paginarNumeracionRecibo"},
            beforeSend: function (request) 
            {
                //MostrarLoading();
            },
            error: function( error )
            {   
                console.log('error',error.responseText);
            },
            dataSrc: function (json) 
            { 
                ocultarLoadingFull()
                return json.data;
            }
        }
    })
    $('.table-numeracion-recibo thead tr:eq(1) th').each( function (i) 
    { 
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })

       
}
function paginarNumeracionEgreso($this , actions )
{  
    mostrarLoadingFull()
    
    table = $('.table-numeracion-egreso').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        searching: true ,
        destroy: true,
        columns: 
        [
           {data: "id"},
           {data: "id"},
           {data: "estado"},
           {data: "desde"},
           {data: "hasta"},
           {data: "contador"}
        ],
        columnDefs: 
        [
            {
                targets:[0],
                render: function ( data, type, row, meta )
                {
                    let modalWidth = ''
                    if( row.tipo_producto == 2 )
                    modalWidth = 90
                    return  `<i class="icon ion-md-create click"  data-actions='{ "fn": "getContent", "controller": "Egreso", "action": "editarNumeracionEgreso", "dataType" : "json" , "modal": true, "response":"modal-body",  "idnumeracion" : ${data} }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },       
            {
                targets:[1],
                render: function ( data, type, row, meta )
                {
                   return  `<i class="icon ion-md-trash click"  data-actions='{ "fn":"eliminarNumeracionEgreso" , "dataType" : "json" , "idnumeracion" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },            
            {
                targets:[2],
                render: function ( data, type, row, meta )
                {
                    if( data == 1 )
                    {
                        return  `<span class="work-status">
                                    <span class="badge badge-lg badge-success">Activo</span>
                                </span>`
                    }
                    else
                    {
                        return  `<span class="work-status">
                                    <span class="badge badge-lg badge-secondary">Inactivo</span>
                                </span>`
                    }
                }
            }
        ],
        ajax:
        {
            type: "POST",
            url: "",
            data:{"controller":"Egreso","action":"paginarNumeracionEgreso"},
            beforeSend: function (request) 
            {
                //MostrarLoading();
            },
            error: function( error )
            {   
                console.log('error',error.responseText);
            },
            dataSrc: function (json) 
            { 
                ocultarLoadingFull()
                return json.data;
            }
        }
    })
    $('.table-numeracion-egreso thead tr:eq(1) th').each( function (i) 
    { 
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })

       
}
function paginarConsultarProduccion()
{  
    table = $('.table-consultar-produccion').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        destroy: true,
        columns: 
        [
           {data: "id"},
           {data: "fecha"},
           {data: "codigo"}
        ],
        columnDefs: 
        [        
            {
                targets:[0],
                render: function ( data, type, row, meta )
                {
                   return  `<i class="icon ion-ios-search click"  data-actions='{ "fn":"getContent", "controller":"Produccion", "action":"verProductoProduccion", "response":"body-response", "dataType" : "html" , "modal" : "true", "idproduccion" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                }
            }       
        ],
        ajax:
        {
            type: "POST",
            url: "",
            data: {controller: 'Produccion', action: 'paginarConsultarProduccion' },
            beforeSend: function (request) 
            {
                //MostrarLoading();
            },
            error: function( error )
            {   
                console.log('error',error.responseText);
            },
            dataSrc: function (json) 
            { 
                return json.data;
            }
        }
    })
    $('.table-consultar-produccion thead tr:eq(1) th').each( function (i) 
    { 
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })

       
}
function paginarEntradaSalida(  action , obj )
{   
    table = $('.tabla-entrada-salida').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        destroy: true,
        columns: 
        [
            {"data": "fecha"},
            {"data": "nombre"},
            {"data": "entrada"},
            {"data": "salida"},
            {"data": "observaciones"},
            {"data": "usuario"}
        ],            
        ajax:
        {
            "type": "POST",
            "url": "",
            "data": $("#reporteEntradaSalida").serializeFormJSON(),
            beforeSend: function (request) 
            {
            },
            error: function( error )
            {   
                console.log('error',error.responseText)
            },
            dataSrc: function (json) 
            {
                return json.data
            }
        }
    })
    $('.tabla-entrada-salida thead tr:eq(1) th').each( function (i) 
    {
        
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })
}
function paginarReporteCantidad(  action , obj )
{   
    table = $('.tabla-reporte-cantidad').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        destroy: true,
        columns: 
        [
            {"data": "desde"},
            {"data": "hasta"},
            {"data": "nombre"},
            {"data": "cantidad"}
        ],            
        ajax:
        {
            "type": "POST",
            "url": "",
            "data": { "controller" : "Reportes" , "action" : "paginarReporteCantidad"},
            beforeSend: function (request) 
            {
            },
            error: function( error )
            {   
                console.log('error',error.responseText)
            },
            dataSrc: function (json) 
            {
                return json.data
            }
        }
    })
    $('.tabla-reporte-cantidad thead tr:eq(1) th').each( function (i) 
    {
        
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })
}
function paginarMarcasProducto(  action , obj )
{    
    table = $('.table-marcas').DataTable
    ({
        language:
        {
           "url": "public/material/datatables/Spanish.json"
        },
        orderCellsTop: true,
        serverSide: true,
        destroy: true,
        columns: 
        [
            {"data": "id" },
            {"data": "id" },
            {"data": "nombre" }
        ],            
        columnDefs: 
        [
            {
                targets:[0],
                render: function ( data, type, row, meta )
                {
                   return  `<i class="icon ion-md-create click"  data-actions='{ "fn": "getContent", "controller": "Configuracion" ,"action": "editarMarca","modal":true, "response":"body-response", "dataType":"html", "idmarca" : ${data} }' aria-hidden="true" style="font-size:24px"></i>`
                }
            },            
            { 
                targets:[1],
                render: function ( data, type, row, meta ) 
                {
                    return  `<i class="icon ion-md-trash click"  data-actions='{ "fn":"eliminarMarcaProducto" , "dataType" : "html" , "idmarca" : ${data } }' aria-hidden="true" style="font-size:24px"></i>`
                }
            } 
        ], 
        ajax:
        {
            "type": "POST",
            "url": "",
            "data": { "controller" : "Configuracion" , "action" : "paginarMarcas"},
            beforeSend: function (request) 
            {
            },
            error: function( error )
            {   
                console.log('error',error.responseText)
            },
            dataSrc: function (json) 
            { 
                return json.data
            }
        } 
    })
    $('.table-marcas thead tr:eq(1) th').each( function (i) 
    {
        $( 'input', this).on('keyup change',function(e)
        {
            e.stopImmediatePropagation()
            e.stopPropagation()
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    
        $( 'select', this).on('change',function(e)
        {
            if ( table.column(i).search() !== this.value ) 
                table.column(i).search( this.value ).draw()
        })
    })
    
}