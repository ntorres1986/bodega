<?php
    date_default_timezone_set('America/Bogota'); 
    require_once '../connection.php';
    require_once '../components/Util.php';
    require_once '../components/Sync.php';
    extract($_REQUEST);

    if(!empty($accion)) 
    {
        switch( $accion )
        {
            case 'crearCliente':
                $db=Db::getConnect();
                $insert=$db->prepare('INSERT INTO cliente VALUES(NULL,:nombres,:apellidos,:correo,:documento,:telefono,:direccion,current_timestamp,true,:tipo_documento_id,:tipo_persona_id,:regimen_id,1)');
                $insert->bindValue('nombres',$nombres);
                $insert->bindValue('apellidos',$apellidos);
                $insert->bindValue('correo',$correo);
                $insert->bindValue('documento',$cedula);
                $insert->bindValue('telefono',NULL);
                $insert->bindValue('direccion',NULL);
                $insert->bindValue('tipo_documento_id',3);
                $insert->bindValue('tipo_persona_id',2);
                $insert->bindValue('regimen_id',2);
                $insert->execute();
                $idcliente = Db::getConnect()->lastInsertId();

                $query = "INSERT INTO cliente_ciudad VALUES(NULL,$idcliente,1)";
                $db->query($query);

                echo json_encode( array("status" => true ,'text' => $nombres." ".$apellidos , "id" => $idcliente  , "message" => "El cliente fue exitosamente") );

            break;

            case 'guardarVenta':
                $tipoQuery = "";
                $connection=Db::getConnect();
                try 
                {
                    Db::getConnect()->beginTransaction();
                    $repeat = false; 

                    if( !empty($codigoVenta) )
                    { 
                        $codigoVenta = $codigoVenta; 
                        $query = "SELECT * FROM venta WHERE codigo_Venta = '$codigoVenta'";
                        $data = $connection->query($query);
                        $results = $data->fetch(PDO::FETCH_BOTH); 
                        if( !empty($results['id']) ) 
                        {
                            $repeat = true;
                            echo json_encode( array('status' => false , 'id' => $results['id'] ,  'strInfo' => 'Ya registró la venta.' ) ); 
                            exit();
                        }
                    } 
                    $tipoventa = 1;  
                    
                    if( !empty($tipoventa) and !empty($idproducto) and !empty($cantidad) and !empty($tipos) )
                    { 
                        $passed = false;
                        $errores = 0;
                        $strInfo = "";

                        foreach ($idproducto as $i => $idp) 
                        {
                            if(!empty($tipos[$i]) and !empty($cantidad[$i]) )
                            { 

                                $cant = $cantidad[$i]; 
                                $tipo = $tipos[$i];
                                if( $tipo == 1 )
                                { 
                                    $query = "SELECT cantidad,nombre FROM producto_punto 
                                            INNER JOIN producto ON producto.id = producto_id
                                            WHERE producto_id = $idp";
                                        
                                    $data = $connection->query($query);      
                                    $producto = $data->fetch(PDO::FETCH_OBJ); 

                                    if( $cant > $producto->cantidad )
                                    {
                                        $errores++;
                                        $strInfo .= $producto->nombre."     Disponible : ".$producto->cantidad."<br />";
                                    }
                                }
                            }
                        }
                        if( $errores <= 0 )
                        $passed = true;
                        
                        if(  $passed == true )
                        {  
                            
                            if( !empty($bolsas) ) 
                            $bolsas = $bolsas; 

                            $tipoventa = $tipoventa;  

                            if( empty($bolsas )) 
                            $bolsas = 0;  
                                
                            $limite_date = NULL;
                            if( !empty($fecha) && !empty($hora) )
                            {
                                $fecha = $fecha;
                                $hora = $hora;

                                $limite_date = "'".$fecha." ".$hora."'"; 
                            } 
                            
                            $idcliente = $idcliente;  

                            $hayCliente = false;
                            if( !empty($idcliente) )
                            {
                                if( $idcliente > 1 )
                                {
                                    $query = "SELECT id , contador  FROM fe_rangos_factura WHERE status = true";
                                    $data = $connection->query($query);  
                                    $numeroFactura = $data->fetch(PDO::FETCH_OBJ ); 

                                    $factura = $numeroFactura->contador;
                                    $idrango = $numeroFactura->id;
                                    $hayCliente = true;
                                }
                            }
                            if( !$hayCliente )
                            {
                                $factura = NULL;
                                $idrango = NULL;
                            }

                            $factura = NULL;
                            
                            $date = date('Y-m-d');
                            $time = date('H:i:s');

                            $precio_bolsas = 0;

                            $tipoQuery = $idcliente;
                        
                            
                            $idrango = 1;
                            $concepto = '';
                            $observaciones = '';
                            $tipo_factura = 1;
                            $descuento_id = 1;
                            $numero_orden = NULL;

                            if( empty($efectivo) )
                            $efectivo = 0;

                            $sql=$connection->query("SELECT * FROM cliente WHERE id = $idcliente ");
                            $cliente = $sql->fetch(PDO::FETCH_OBJ);

                            $insert=$connection->prepare("INSERT INTO venta VALUES(NULL,:codigoVenta, :numero_orden, :fecha, :update_at, :factura , :limite , :tipoventa , 1 , :idusuario , :idcliente , :idciudad,  false , :estado , :bolsas , :valor_bolsas , :enviada , NULL , NULL , NULL, :idrango, NULL, NULL, NULL, NULL , $descuento_id , :concepto_descuento, :observaciones, :tipo_factura, :efectivo )");
                            $insert->bindValue('codigoVenta',$codigoVenta);
                            $insert->bindValue('numero_orden',$numero_orden);
                            $insert->bindValue('fecha',$date.' '.$time);
                            $insert->bindValue('update_at',$date.' '.$time);
                            $insert->bindValue('factura',$factura);
                            $insert->bindValue('limite',$limite_date);
                            $insert->bindValue('tipoventa',$tipoventa);
                            $insert->bindValue('idusuario',$idusuario);
                            $insert->bindValue('idcliente',$idcliente);
                            $insert->bindValue('idciudad',1);
                            $insert->bindValue('estado',1);
                            $insert->bindValue('idrango',$idrango);
                            $insert->bindValue('bolsas',0);
                            $insert->bindValue('valor_bolsas',0);
                            $insert->bindValue('enviada',0);
                            $insert->bindValue('concepto_descuento',$concepto);
                            $insert->bindValue('observaciones',$observaciones);
                            $insert->bindValue('tipo_factura',$tipo_factura);
                            $insert->bindValue('efectivo',$efectivo);
                            $insert->execute();
                            $id = Db::getConnect()->lastInsertId();
                            
                            $ventaArray = [
                                "venta" => array(
                                                "id"   => $id,
                                                "codigo_venta" => $codigoVenta ,
                                                "numero_orden" => NULL ,
                                                "fecha" => $date ,
                                                "time" => $time ,
                                                "idvendedor" => $idusuario,
                                                "factura" => $factura ,
                                                "limite" => $limite_date ,
                                                "tipo_venta_id" => $tipoventa,
                                                "punto_id" => 1 ,
                                                "usuario_id" => 1 ,
                                                "cliente_id" => $idcliente , 
                                                "cliente_codigo" => $cliente->codigo ,
                                                "ciudad_id" => 1 ,
                                                "estado" => 1 ,
                                                "bolsas" => $bolsas ,
                                                "vr_bolsas" => $precio_bolsas ,
                                                "checked" => 0 ,
                                                "enviada" => 0,
                                                "descuento_id" => 0,
                                                "observaciones" => 0,
                                                "idrango" => $idrango,
                                                "efectivo" => $efectivo,
                                                "concepto" => null,
                                                "cliente" => $cliente->nombres.' '.$cliente->apellidos,
                                                "total" => 0
                                                ),
                                "productoVenta" => array()
                            ]; 
                            
                            $sumT = 0;
                            foreach ($idproducto as $i => $idp) 
                            {
                                $sumatotal = 0;
                                if(!empty($tipos[$i]) and !empty($cantidad[$i]) and !empty($precio[$i]) and !empty($idproducto[$i])  )
                                { 

                                    $cant = $cantidad[$i];
                                    $pre = $precio[$i];
                                    $pre = str_replace(array(',', '$'), "", $pre);
                                    $total = $cant * $pre;
                                    $sumatotal += $total; 
                                    $tipo = $tipos[$i];
                                    $nombre = $nombres_producto[$i];

                                    $sumT += $cant * $pre;
                                        
                                    if( empty($costos[$i]) )
                                        $cost = 0;
                                    else 
                                        $cost = $costos[$i]; 
                                

                                    if( $tipo == 1 )
                                    {
                                        $query = "SELECT * FROM producto WHERE id = $idp";
                                        $data = $connection->query($query);  
                                        $producto = $data->fetch(PDO::FETCH_OBJ);

                                        $query = "SELECT producto_punto.iva_id,percent 
                                                FROM fe_iva 
                                                INNER JOIN producto_punto ON iva_id = fe_iva.id
                                                WHERE producto_id = $idp";
                                        $data = $connection->query($query);  
                                        $iva = $data->fetch(PDO::FETCH_OBJ );
                                        
                                        $ivaValue = ($pre * $iva->percent) / 100 ;

                                        $query = "UPDATE producto_punto SET cantidad = cantidad - $cant WHERE producto_id = $idp";
                                        $connection->query($query); 
                                      
                                        $query = "INSERT INTO producto_venta VALUES(null,$idp,$cant,$pre,$cost,$ivaValue,$iva->iva_id,$id,'')";
                                        $connection->query($query); 
                                       
                                        $arrayProductoVenta = array('idproducto' => intval($idp) ,
                                                                    'precio' => intval($pre),
                                                                    'codigo' => $producto->codigo ,
                                                                    'cantidad'  => intval($cant),
                                                                    'costo'  => intval($cost) ,
                                                                    'ivaId' => intval($iva->iva_id) ,
                                                                    'ivaValue' => intval($ivaValue) ,
                                                                    'observacion' => '' ,
                                                                    'tipo' => 1 );
                                        array_push($ventaArray['productoVenta'],
                                         $arrayProductoVenta );

                                        $obj  = (object) array
                                        (
                                            "fecha" => $date,
                                            "entrada" => 0 ,  
                                            "salida" => $cant , 
                                            "cliente_id" => $idcliente , 
                                            "factura" => $factura , 
                                            "notacredito" => '' , 
                                            "notadebito" => '' , 
                                            "venta" => $cant * $pre , 
                                            "dto" => NULL , 
                                            "departamento_id" => 1, 
                                            "ciudad_id" => 1 , 
                                            "costo" => $cost , 
                                            "observaciones" => '' , 
                                            "producto_id" => $idp ,
                                            "bodega_id" => NULL ,
                                            "usuario_id" => $idusuario, 
                                            "registro_id" => $id,
                                            "tipo_registro" => 1
                                        ); 
                                        Util::EntradaSalida($obj, $connection);
                                       
                                    }
                                    else
                                    {
                                        $query = "INSERT INTO venta_anexo VALUES(null,$id,'$nombre',$cant,$pre)";
                                        $connection->query($query); 
                                        
                                        $arrayProductoVenta = array('idproducto' => NULL ,
                                                                    'precio' => $pre ,
                                                                    'cantidad'  => $cant ,
                                                                    'costo'  => NULL ,
                                                                    'ivaId' => NULL ,
                                                                    'ivaValue' => NULL ,
                                                                    'observacion' => '' ,
                                                                    'nombre' => $nombre , 
                                                                    'tipo' => 2 );
                                        array_push($ventaArray['productoVenta'], $arrayProductoVenta );
                                    }  
                                }  
                            }     
                            if( count($ventaArray['productoVenta']) > 0 )
                            {
                                $ventaArray["venta"]["total"] = $sumT;
                                $strJsonSync = json_encode($ventaArray);
                                Sync::guardarJson('venta',$strJsonSync,$tipoQuery);
                            } 
                        
                            Db::getConnect()->commit();

                            $query = "SELECT upper(concat(nombres,' ',apellidos)) as nombres  FROM cliente WHERE id = $idcliente";
                            $data = $connection->query($query);  
                            $cliente = $data->fetch(PDO::FETCH_OBJ); 

                            echo json_encode( array('status' => true , 'cliente' => $cliente->nombres, 'msg' => 'Venta registrada exitosamente', 'passed' => true , 'id' => $id , 'repeat' => false ) );                                  
                        }
                        else
                            echo json_encode( array('status' => false , 'strInfo' => $strInfo,  'passed' => false , 'list_validation' => null , 'repeat' => false ) ); 
                    } 
                    
                }
                catch(PDOException $e) 
                { 
                    Db::getConnect()->rollBack();
                    echo json_encode( array('status' => $e ) );  
                }  
            break;
        }
    }
?>
