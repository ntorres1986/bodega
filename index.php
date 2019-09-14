<?php 
 $ip = "localhost";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
 
    <!--Import Google Icon Font-->
    <link href="css/icon.css" rel="stylesheet">
    <link href="css/style.css?<?php echo microtime(true); ?>" rel="stylesheet">
    <link href="css/my-bootstrap.css" rel="stylesheet">
    <link href="css/font-awesome.min" rel="stylesheet">
      
    <link rel="stylesheet" href="public/material/global/css/bootstrap.min.css">
    <link rel="stylesheet" href="public/material/global/vendor/select2/select2.css">
    <link rel="stylesheet" href="public/stylesheets/animate.min.css" type="text/css" />     
 
    <link rel="stylesheet" href="public/material/malihu-custom-scrollbar/jquery.mCustomScrollbar.css">

    <link rel="stylesheet" href="public/material/kendoui/styles/kendo.common.min.css" type="text/css"  /> 
    <link rel="stylesheet" href="public/material/kendoui/styles/kendo.bootstrap-v4.min.css" type="text/css"  />
    
    <link rel="stylesheet" href="public/material/global/vendor/toastr/toastr.css">
 
    <link rel="stylesheet" href="public/plugins/validation-engine/css/validationEngine.jquery.css" type="text/css"/>

    <link rel='stylesheet' href='public/stylesheets/font-awesome.min.css'>
    <link rel="stylesheet" href="public/plugins/chosen/css/component-chosen.css" type="text/css"/>
    <link rel="stylesheet" href="public/material/global/vendor/alertify/alertify.css">

    <link rel="stylesheet" href="public/material/global/vendor/datatables.net-bs4/dataTables.bootstrap4.css">
    <link rel="stylesheet" href="public/material/global/vendor/datatables.net-fixedheader-bs4/dataTables.fixedheader.bootstrap4.css">
    <link rel="stylesheet" href="public/material/global/vendor/datatables.net-fixedcolumns-bs4/dataTables.fixedcolumns.bootstrap4.css">
    <link rel="stylesheet" href="public/material/global/vendor/datatables.net-rowgroup-bs4/dataTables.rowgroup.bootstrap4.css">
    <link rel="stylesheet" href="public/material/global/vendor/datatables.net-scroller-bs4/dataTables.scroller.bootstrap4.css">
    <link rel="stylesheet" href="public/material/global/vendor/datatables.net-select-bs4/dataTables.select.bootstrap4.css">
    <link rel="stylesheet" href="public/material/global/vendor/datatables.net-responsive-bs4/dataTables.responsive.bootstrap4.css">
    <link rel="stylesheet" href="public/material/global/vendor/datatables.net-buttons-bs4/dataTables.buttons.bootstrap4.css">


    <link rel="stylesheet" href="public/material/global/fonts/material-design/material-design.min.css">
    <link rel="stylesheet" href="public/material/global/fonts/font-awesome/font-awesome.css">


</head>
<body>  
    <div id='menu'>
        <ul>
          <li><a href="#" class="click"  data-actions='{ "fn":"getContent", "accion": "ventas"}' >Consultar productos</a></li>
        
        </ul>

    </div>
    <div id="infoTrabajador">Yerlin Cuesta Hurtado</div>
    <div id="contenido"></div> 
    <div id="loader-wrapper">
        <div id="loader"></div>
    </div>


  

    <!-- Modal -->
<div class="modal fade" id="modalValidarCodigo" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <form data-fn='validarCodigo' id="frmValidarCodigo" autocomplete="off">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Validar código</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">          
              <div class="form-group">
                  <label for="cantidad">Código</label>
                  <input type="text" class="form-control" name="codigo" id="codigo"  >
              </div>         
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
          <button type="submit" class="btn btn-primary" id="guardarCantidadPrecio">Aceptar</button>
          <input type="hidden" name="accion" value="validarCodigo" />
        </div>
      </div>
    </form>
  </div>
</div> 

    <script src="public/material/global/vendor/jquery/jquery.js"></script>
    <script src="public/material/global/vendor/jquery/jquery-ui.js"></script>
    <script src="public/javascripts/numeral.min.js?"></script>
    <script src="public/material/global/vendor/alertify/alertify.js"></script>

    <script src="public/material/kendoui/js/kendo.web.min.js" ></script> 
    <script src="public/material/kendoui/js/cultures/kendo.culture.es-CO.min.js" ></script> 
    <script src="public/material/global/vendor/select2/select2.js"></script>
    <script src="public/material/global/vendor/toastr/toastr.js"></script>
    <script src="js/md5.min.js?<?php echo microtime(true); ?>" ></script> 

    <script src="public/material/global/vendor/datatables.net/jquery.dataTables.js"></script>
    <script src="public/material/global/vendor/datatables.net-bs4/dataTables.bootstrap4.js"></script>
    <script src="public/material/global/vendor/datatables.net-fixedheader/dataTables.fixedHeader.js"></script>
    <script src="public/material/global/vendor/datatables.net-fixedcolumns/dataTables.fixedColumns.js"></script>
    <script src="public/material/global/vendor/datatables.net-rowgroup/dataTables.rowGroup.js"></script>
    <script src="public/material/global/vendor/datatables.net-scroller/dataTables.scroller.js"></script>
    <script src="public/material/global/vendor/datatables.net-responsive/dataTables.responsive.js"></script>
    <script src="public/material/global/vendor/datatables.net-responsive-bs4/responsive.bootstrap4.js"></script>
    <script src="public/material/global/vendor/datatables.net-buttons/dataTables.buttons.js"></script>
    <script src="public/material/global/vendor/datatables.net-buttons/buttons.html5.js"></script>
    <script src="public/material/global/vendor/datatables.net-buttons/buttons.flash.js"></script>
    <script src="public/material/global/vendor/datatables.net-buttons/buttons.print.js"></script>
    <script src="public/material/global/vendor/datatables.net-buttons/buttons.colVis.js"></script>
    <script src="public/material/global/vendor/datatables.net-buttons-bs4/buttons.bootstrap4.js"></script>

    <script src="public/plugins/validation-engine/js/languages/jquery.validationEngine-es.js" type="text/javascript" charset="utf-8"></script>
    <script src="public/plugins/validation-engine/js/jquery.validationEngine.js" type="text/javascript" charset="utf-8"></script>
   
    <script src="public/javascripts/bootstrap.min.js"></script>
    <script src="public/plugins/chosen/js/chosen.jquery.min.js"></script>
    <script src="public/material/malihu-custom-scrollbar/jquery.mCustomScrollbar.concat.min.js" ></script> 
    <script src="public/javascripts/socket.io.js?"></script> 
    <!--<script src="js/socket.js?<?php echo microtime(true); ?>" ></script> -->

    
    <script src="public/plugins/sweet-alert2/sweetalert2.min.js"></script>
    <link rel="stylesheet" href="public/plugins/sweet-alert2/sweetalert2.css">
 
    
    <script>
        kendo.culture("es-CO");
        kendo.culture().calendar.firstDay = 1 
    </script>

    <script src="js/functions.js?<?php echo microtime(true); ?>"></script>
    <script src="js/script.js?<?php echo microtime(true); ?>"></script>
  
</body>
</html>