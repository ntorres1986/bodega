
  <div id="container"> 
    <div id="left"> 
        <div id="left-search">
                <!-- Actual search box -->
                <div class="form-group has-search">
                    <span class="fa fa-search form-control-feedback"></span>
                    <input type="text" class="form-control input keyup" id="buscarProducto" placeholder="Buscar producto" data-actions='{ "fn":"obtenerProductoVenta" }' autocomplete="off">
                    <div class="form-control-right">
                    </div>
                </div>
                <div id="borrar_input" class="click" data-actions='{ "fn":"limpiarInput"}'>
                  <i class="fa fa-eraser" style="font-size:32px;" aria-hidden="true"></i>
                </div>
                
            </div>
            <div id="left-products"> 
            </div>
        </div>
      
  </div>



 

<!-- Modal -->
<div class="modal fade" id="productoExterno" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <form data-fn='agregarProductoExternoLista' id="frmAgregarProductoExternoLista" autocomplete="off">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          
              <div class="form-group">
                  <label for="cantidad">Nombre</label>
                  <input type="text" class="form-control" name="nombre" >
              </div>
              <div class="form-group">
                  <label for="cantidad">Cantidad</label>
                  <input type="text" class="form-control" name="cantidad" >
              </div>
              <div class="form-group">
                  <label for="precio">Precio</label>
                  <input type="text" class="form-control" name="precio" >
              </div> 
        
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
          <button type="submit" class="btn btn-primary" id="guardarCantidadPrecio">Guardar</button>
        </div>
      </div>
    </form>
  </div>
</div>


