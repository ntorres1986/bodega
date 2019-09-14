<div style="width: 100%; float:left;">
    <div class="col-sm-10 offset-sm-2 mt-1">      
        <form data-fn='consultarUltimasVentas' autocomplete="off" >
            <div class="form-row">
                <div class="form-group col-md-3">
                    <label for="fecha">Fecha</label>
                    <input type="text" name="fecha" class="form-control date" id="fecha" >
                </div>
                <div class="form-group col-md-3">
                    <label for="codigo">Codigo</label>
                    <input type="text" name="codigo" class="form-control" id="codigo">
                </div>
                <div class="form-group col-md-3">
                    <label for="cliente">Cliente</label>
                    <?php echo $cliente; ?>
                </div>

                <div class="form-group col-md-3">
                    <button type="submit" style="margin-top:30px;" class="btn btn-primary">Consultar</button>
                </div>
            </div>  
            <input type="hidden" name="accion" value="consultarUltimasVentas" />
            
        </form>
    </div>
</div>
<div class="col-sm-12 mt-2" id="responseUltimasVentas"></div>
