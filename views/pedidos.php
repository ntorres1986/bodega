<?php
    $html = "<div style='width: 100%; float:left;'>    
        <div class='col-sm-10 offset-sm-3 mt-1'>
            <h4>Pedidos</h4>
            <form data-fn='consultarPedidos' autocomplete='off' >
                <div class='form-row'>
                    <div class='form-group col-md-3'>
                        <label for='fecha'>Fecha</label>
                        <input type='text' name='fecha' class='form-control date' id='fecha' >
                    </div>
                    <div class='form-group col-md-3'>
                        <label for='cliente'>Cliente</label>
                        $cliente
                    </div>
                    <div class='form-group col-md-3'>
                        <button type='submit' style='margin-top:30px;' class='btn btn-primary'>Consultar</button>
                    </div>
                </div>  
                <input type='hidden' name='accion' value='consultarPedidos' />
            </form>
        </div>
    </div>

    <table class='table tabla-pedidos data-table' style='background: white;'>
        <thead>
            <tr>
            <th>Ver productos</th>
            <th>Confirmar</th>
            <th>Cancelar</th>
            <th>Cliente</th>
            <th>Total</th>
            </tr>
            
        </thead>
        <tbody></tbody>
        <tfoot>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </tfoot>
    </table>";

echo json_encode(array("status" => true , "paginate" => true , "fn" => "paginarPedidos", "html" => $html ));
