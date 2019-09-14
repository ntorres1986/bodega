<?php
  require_once 'connection.php';
  require_once 'components/Util.php';
  extract($_REQUEST);

  if(!empty($accion)) 
  {
      switch( $accion )
      {
          case 'ventas':
            $db=Db::getConnect();
            if( empty($idcliente) )
            $idcliente = NULL;

            $sql=$db->query("SELECT id , upper(concat(nombres,' ',apellidos)) as `value` FROM cliente WHERE status = true");
            $clienteList = $sql->fetchAll(PDO::FETCH_OBJ);
            $cliente = Util::getSelectOption($clienteList,"idcliente",$idcliente,"","","idcliente","select2-simple change","","cambiarCliente");

            require_once 'views/ventas.php';
          break;

          case 'ultimasVentas':
            $db=Db::getConnect();
            $sql=$db->query("SELECT id , upper(concat(nombres,' ',apellidos)) as `value` FROM cliente");
            $clienteList = $sql->fetchAll(PDO::FETCH_OBJ);
            $cliente = Util::getSelectOption($clienteList,"idcliente","","Seleccione","","idcliente","select2-simple change","","");
            require_once 'views/ultimasVentas.php';
          break; 

          case 'obtenerPedidos':
              extract($_REQUEST);
              $connection=Db::getConnect();
              $condicion = "";
              if( !empty($fecha) )
              { 
                $condicion.=" AND date(venta.fecha) = '$fecha'";
              }

              if( !empty($codigo) )
              { 
                $condicion.=" AND usuario.codigo = '$codigo' ";
              }

              if( !empty($idcliente) )
              {

                $condicion .= " AND cliente.id = $idcliente ";
              }

              $query = "SELECT 
                           orden.id,
                           concat(cliente.nombres,' ',cliente.apellidos) AS cliente,
                           0 as total
                        FROM orden
                          INNER JOIN cliente ON cliente.id = cliente_id
                        WHERE orden.status = true";  
                  
              $data = $connection->query($query);  
              $results = $data->fetchAll(PDO::FETCH_OBJ);  
              if( count($results) > 0 )
              {
                foreach ($results as $key => $orden) 
                {
                
                  $query = "SELECT 
                                SUM(cantidad * precio) AS total 
                            FROM producto_orden                            
                            WHERE orden_id = $orden->id"; 
                  $data = $connection->query($query);  
                  $po = $data->fetch(PDO::FETCH_OBJ);
                  $orden->total = $po->total;
                  $results[$key] = $orden;
                  
                }
              }
          
              echo json_encode(array('status' => true, 'data' => $results ));     
          break; 

          case 'consultarUltimasVentas':

              extract($_REQUEST);
              $connection=Db::getConnect();
              $condicion = "";
              if( !empty($fecha) )
              { 
                $condicion.=" AND date(venta.fecha) = '$fecha'";
              }

              if( !empty($codigo) )
              { 
                $condicion.=" AND usuario.codigo = '$codigo' ";
              }

              if( !empty($idcliente) )
              {
 
                $condicion .= " AND cliente.id = $idcliente ";
              }

              $query = "SELECT 
                          venta.id ,
                          venta.fecha ,  
                          upper(concat( usuario.nombres,' ',usuario.apellidos)) trabajador ,
                          IFNULL(  concat( upper(cliente.nombres),' ',upper(cliente.apellidos)) , '') cliente ,
                          SUM(producto_venta.cantidad * producto_venta.precio) AS total ,
                          cliente.id cliente_id ,
                          cliente.nombres ,
                          cliente.apellidos ,
                          cliente.documento , 
                          cliente.telefono ,
                          cliente.direccion
                          FROM venta
                          INNER JOIN producto_venta ON venta_id = venta.id
                          INNER JOIN usuario ON usuario_id = usuario.id 
                          INNER JOIN producto ON producto_venta.producto_id = producto.id 
                          INNER JOIN tipo_venta ON tipo_venta_id = tipo_venta.id 
                          LEFT JOIN cliente ON cliente_id = cliente.id 
                        WHERE 1 $condicion
                        GROUP BY venta.id
                        ORDER BY venta.id DESC
                        LIMIT 120";  
                  
              $data = $connection->query($query);  
              $results = $data->fetchAll(PDO::FETCH_ASSOC); 

              
              echo json_encode(array('status' => true, 'data' => $results ));       
          break;

          case 'cotizaciones':
            require_once 'views/ventas.php';
          break;

          case 'pedidos':
              $db=Db::getConnect();
              $sql=$db->query("SELECT id , upper(concat(nombres,' ',apellidos)) as `value` FROM cliente");
              $clienteList = $sql->fetchAll(PDO::FETCH_OBJ);
              $cliente = Util::getSelectOption($clienteList,"idcliente","","Seleccione","","idcliente","chosen change","","");
              require_once 'views/pedidos.php';
          break;

          case 'paginarPedidos':
              try
              {
                $db=Db::getConnect();

                $start = $_POST['start'];
                $length = $_POST['length'];
                $draw = $_POST['draw'];

                $query = "SELECT
                            orden.id,
                            upper(concat(nombres,' ',apellidos)) as cliente,
                            sum(cantidad * precio) as total
                          FROM orden  
                          INNER JOIN cliente ON cliente.id = cliente_id
                          INNER JOIN producto_orden ON orden.id = orden_id
                          WHERE orden.status = true";
                $data = $db->query( $query );
                $results = $data->fetchAll(PDO::FETCH_OBJ);
                $recordsTotal = count($results);

                $query.= " LIMIT $start, $length";

                $data=$db->query( $query );
                $results = $data->fetchAll(PDO::FETCH_BOTH);

                

                $json_data = array
                (
                    "draw"            => intval( $draw ), 
                    "recordsTotal"    => intval( $recordsTotal ), 
                    "recordsFiltered" => intval( $recordsTotal ), 
                    "data"            => $results 
                ); 
                echo json_encode($json_data);    
              }
              catch(Exception $e)
              {
                echo $e;
                  echo json_encode($e);    
              }
          break;

          case 'obtenerProductoPedido':
              extract($_REQUEST);
              $connection=Db::getConnect();

              $query = "SELECT * FROM orden WHERE id = $idpedido";
              $data = $connection->query($query);  
              $orden = $data->fetch(PDO::FETCH_OBJ);

              $query = "SELECT id FROM cliente WHERE codigo = '$orden->codigo_cliente'";
              $data = $connection->query($query);  
              $cliente = $data->fetch(PDO::FETCH_OBJ);
              
              $query = "SELECT
                          producto.id , 
                          producto.imagen,
                          producto.nombre , 
                          producto_punto.costo , 
                          producto_orden.precio ,
                          1 as tipo,
                          producto_orden.precio as precioEscrito,
                          producto_punto.precio_minimo ,
                          producto_orden.cantidad,
                          producto_orden.cantidad as cantidadEscrita
                      FROM producto_orden 
                      INNER JOIN producto ON producto.id = producto_orden.producto_id
                      INNER JOIN producto_punto ON producto_punto.producto_id = producto.id
                      WHERE 
                        orden_id =$idpedido";
              $data = $connection->query($query);  
              $productos = $data->fetchAll(PDO::FETCH_OBJ);


              $query ="SELECT 
                        id , concat( nombres , ' ' , apellidos ) nombre  
                      FROM 
                        usuario 
                      WHERE  codigo = '$codigo' AND usuario.status = true
                      LIMIT 1";     

              $data = $connection->query($query);  
              $trabajador = $data->fetch(PDO::FETCH_OBJ);
              
              
              if( !empty( $trabajador ) )             
                $arr = array('status' => true, 'idcliente'=> $cliente->id, 'productos' => $productos, 'trabajador' => $trabajador->nombre , "codigo" => $codigo,  "idtrabajador" => $trabajador->id );             
              else
                $arr = array('status' => false); 

              echo json_encode( $arr );
          break;

          case 'obtenerProductoVenta':
            $connection=Db::getConnect();
            $condicion = "";
            $implode = "";
            if( !empty( $listProductos ) ) 
            {                   
                $listProductos = json_decode($listProductos,true);
  
                $listProductos = array_column($listProductos, 'id');

                if( !empty($listProductos) )
                {
                    $listProductos = implode(",", $listProductos );
                    $implode = " AND producto.id NOT IN ( $listProductos ) ";
                }
            }  
            if( !empty($producto) ) 
              $condicion = " AND ( ( producto.nombre LIKE '%$producto%' ) OR ( producto.codigo LIKE '%$producto%') )";
 
 
            $query = "SELECT
                        producto.id , 
                        producto.imagen,
                        producto.nombre , 
                        producto_punto.costo , 
                        producto_punto.precio ,
                        producto_punto.precio_minimo ,
                        producto_punto.cantidad 
                      FROM producto 
                      INNER JOIN producto_punto ON producto.id = producto_id
                      WHERE 
                        producto_punto.estado = 1 AND 
                        producto_punto.cantidad >= 0 AND tipo_producto > 0 $implode $condicion
                      ORDER BY producto.nombre ASC
                      LIMIT 20";
            $data = $connection->query($query);  
            $results = $data->fetchAll(PDO::FETCH_OBJ); 


           
            $arr = array('status' => true , 'productos' => $results  );  
            echo json_encode($arr); 
          break;

          case "validarCodigo":
              $db=Db::getConnect(); 
 
              $query ="SELECT 
                        id , concat( nombres , ' ' , apellidos ) nombre  
                      FROM 
                        usuario 
                      WHERE  codigo = '$codigo' AND usuario.status = true
                      LIMIT 1";     

              $data = $db->query($query);  
              $result = $data->fetch(PDO::FETCH_OBJ); 
              

              if( !empty( $result ) )             
                $arr = array('status' => true, 'trabajador' => $result->nombre , "codigo" => $codigo,  "idtrabajador" => $result->id );             
              else
                $arr = array('status' => false  ); 

              echo json_encode( $arr );
          break;

          case 'formularioNuevoCliente':
          break;
      }
  }
  function consultarPedidos()
  {
    $query = "SELECT
                  upper(concat(nombres,' ',apellidos)) as cliente,
                  sum(cantidad * precio) as total
              FROM orden  
              INNER JOIN cliente ON cliente.id = cliente_id
              INNER JOIN producto_orden ON orden.id = orden_id
              WHERE status = true";
              
  }
  function obtenerVentaHtml()
  {
      
  }
?>