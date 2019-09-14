<?php
class Util
{
    public function __construct(){}

    public static function cleanInput($input)
    {
        $search = array(
        '@<script[^>]*?>.*?</script>@si',   // Elimina javascript
        '@<[\/\!]*?[^<>]*?>@si',            // Elimina las etiquetas HTML
        '@<style[^>]*?>.*?</style>@siU',    // Elimina las etiquetas de estilo
        '@<![\s\S]*?--[ \t\n\r]*>@'         // Elimina los comentarios multi-línea
        );

        $output = preg_replace($search, '', $input);
        return $output;
    }
    public static function redondear( $strValue ) 
    {
        $accion = false; //0 = Mantener, 1 = Incrementar

        if (strpos($strValue, '.') !== false) 
        {
            $parts = explode(".", $strValue);
            $arrayOfDigits  = array_map('intval', str_split($parts[1]));

            if( !empty($arrayOfDigits[2]) )
            {
                if( $arrayOfDigits[2] == 5 ) 
                {
                    if( $arrayOfDigits[3] % 2 == 0 ) 
                    {
                        $accion = false;
                    } 
                    else 
                    {
                        $accion = true;
                    }
                } 
                else if ( $arrayOfDigits[2] >= 0 && $arrayOfDigits[2] <= 4 ) 
                {
                    $accion = false;
                } 
                else 
                {
                    $accion = true;
                }
            }
            
        }
        if( $accion ) 
        {
            $arrayOfDigits[1]++;
        } 
        $strValue = "$parts[0].$arrayOfDigits[0]$arrayOfDigits[1]";

        return number_format( $strValue, 2, ".", "") ;
    }
	public static function getAlert( $title = "", $msg, $class , $close = false )
	{
            $buttonClose = "";
            if( $close )
            $buttonClose = "<button type='button' class='close' data-dismiss='alert' aria-label='Close'>
                                <span aria-hidden='true'>×</span>
                            </button>";

            $htmlTitle = "";
            if( !empty($title) )
            {
                $htmlTitle = "<strong>$title</strong><br>";
            }
            $icon = "";
            if( $class == 'alert-primary')
              $icon = '<i class="icon md-check" style="font-size:24px;margin-top: -5px;" aria-hidden="true"></i>';

			return "<div class='alert alert-icon $class alert-dismissible' role='alert'>
                        $buttonClose
                        $icon
						$htmlTitle
						$msg
                    </div>"; 
	}
    public static function rootFe()
    {
        return $_SERVER["DOCUMENT_ROOT"]."/genesis/public/fe/";
    }
    public static function rootCertificate()
    {
        return $_SERVER["DOCUMENT_ROOT"]."/genesis/public/fe/certificado/";
    }
    public static function rootSigner()
    {
        return $_SERVER["DOCUMENT_ROOT"]."/genesis/public/fe/firmador/";
    }
    public static function Clean($input)
    {
        if (is_array($input))
        {
            foreach($input as $var=>$val)
            {
                $output[$var] = self::Clean($val);
            }
        }
        else
        {
            if (get_magic_quotes_gpc())
            {
                $input = stripslashes($input);
            }
            $output  = self::cleanInput($input);
        }
        return $output;
    }
    public static function getSelectOption($data,$name,$value,$default,$multiple,$id,$class,$disabled='',$fn='',$validate='',$controller="")
    {
        $select = "";
        if( !empty($id ) )
            $id = "id='$id'";
        if( !empty($class ) )
            $class = "class='$class'";

        $select = "<select $validate name='$name' $id  $class data-actions='{ \"fn\":\"$fn\" }'  data-value='$value' data-controller='$controller' data-action='{ \"fn\":\"$fn\" }' $multiple $disabled  >";

        if( !empty( $default ) )
          $select.= "<option value='' >$default</option>";

        foreach ($data as $row)
        {
            if( !empty($value) )
            {
                if($value == $row->id)
                  $select.="<option value=$row->id selected >$row->value</option>";
                else
                  $select.="<option value=$row->id>$row->value</option>";
            }
            else
                $select.="<option value=$row->id>$row->value</option>";
        }
        $select.="</select>";

        return $select;
    }
    public static function selectOption( $params )
    {   
          $multiple = "";
          if( !empty( $params['multiple'] ) )
            $multiple = "multiple='multiple'";

          $select=""; 
          $select="<select name='$params[name]' id='$params[id]'  class='$params[class] form-control' $multiple >";  
           
          if( !empty( $params['default'] ) )
            $select.="<option value='' >$params[default]</option>"; 
          
            
        foreach ($params['results'] as $result ) 
        { 
            	//$result[1] = utf8_encode($result[1]); 
            if( strlen($params['value']) > 0 )
            {
                  if( $params['value'] == $result[0])
				            $select.="<option value='$result[0]' selected >$result[1]</option>"; 
                  else
                    $select.="<option value='$result[0]'  >$result[1]</option>";  
            }
            else
            {
				          $select.="<option value='$result[0]'  >$result[1]</option>";  
            }
        }       
	    $select.="</select>";

		return $select;
	}
    public static function formatNumberFE( $value )
    {
       return "$ ".number_format( round($value) , 2, '.', ',');
    }
    public static function formatNumberFEClear( $value )
    {
       return number_format( round($value) , 2, '.', ',');
    }
    public static function formatNumberFEClearSinDecimal( $value )
    {
       return number_format( round($value) , 0, '.', ',');
    }
    public static function EntradaSalida($obj, $db)
    { 
            
        $insert=$db->prepare( "INSERT INTO entrada_salida VALUES(NULL,current_timestamp,:entrada,:salida,:cliente_id,:factura,:notacredito,:notadebito,:venta,:dto,:departamento_id,:ciudad_id,:costo,:observaciones,:producto_id,:bodega_id,:usuario_id,:registro_id,:tipo_registro)");
        //$insert->bindValue('fecha',$obj->fecha);
        $insert->bindValue('entrada',$obj->entrada);
        $insert->bindValue('salida',$obj->salida);
        $insert->bindValue('cliente_id',$obj->cliente_id);
        $insert->bindValue('factura',$obj->factura);
        $insert->bindValue('notacredito',$obj->notacredito);
        $insert->bindValue('notadebito',$obj->notadebito);
        $insert->bindValue('venta',$obj->venta);
        $insert->bindValue('dto',$obj->dto);
        $insert->bindValue('departamento_id',$obj->departamento_id);
        $insert->bindValue('ciudad_id',$obj->ciudad_id);
        $insert->bindValue('costo',$obj->costo);
        $insert->bindValue('observaciones',$obj->observaciones);
        $insert->bindValue('producto_id',$obj->producto_id);
        $insert->bindValue('bodega_id',$obj->bodega_id);
        $insert->bindValue('usuario_id',$obj->usuario_id);
        $insert->bindValue('registro_id',$obj->registro_id);
        $insert->bindValue('tipo_registro',$obj->tipo_registro);

        //var_dump($insert);
        $insert->execute();
        
    }
    public static function nombreMes($numeroMes)
    {
        switch ($numeroMes) {
            case '1':
                return "ENERO";
            break;
            
            case '2':
                return "FEBRERO";
            break;

            case '3':
                return "MARZO";
            break;

            case '4':
                return "ABRIL";
            break;

            case '5':
                return "MAYO";
            break;

            case '6':
                return "JUNIO";
            break;

            case '7':
                return "JULIO";
            break;

            case '8':
                return "AGOSTO";
            break;

            case '9':
                return "SEPTIEMBRE";
            break;

            case '10':
                return "OCTUBRE";
            break;

            case '11':
                return "NOVIEMBRE";
            break;

            case '12':
                return "DICIEMBRE";
            break;

            case '1':
                return "ENERO";
            break;

            case '1':
                return "ENERO";
            break;
        }

    }
    public static function obtenerAuxTransporte($valorAuxilio,$dias)
    {
         if( $valorAuxilio >  0 )
         {
             $vrDia = $valorAuxilio / 30;
             $valor = $vrDia * $dias;
         }
         else
            $valor = 0;
            
         return $valor;
         
    }
    public static function obtenerSalud($salario,$dias,$porcentajeSalud)
    {
         
         $impuesto = ($porcentajeSalud + 100) / 100;
         $vrBase = $salario / $impuesto;
         $vr = $salario - $vrBase;
         $vrDia = $vr / 30;

         $salud = $vrDia * $dias;
         
         return $salud;
         
    }
    public static  function obtenerPension($salario,$dias,$porcentajePension)
    {
         $impuesto = ($porcentajePension + 100) / 100;
         $vrBase = $salario / $impuesto;
         $vr = $salario - $vrBase;
         $vrDia = $vr / 30;
         
         $pension = $vrDia * $dias;
         
         return $pension;
         
    }
    public static function obtenerFondoEmpleado($salario,$dias,$porcentajeFondo,$salarioMinino)
    {
         if( $salarioMinino > 0 )
         {
           if( $salario / $salarioMinino >= 4 )
           {
               $impuesto = ($porcentajeFondo + 100) / 100;
               $vrBase = $salario / $impuesto;
               $vr = $salario - $vrBase;
               $vrDia = $vr / 30;
               
               $fondo = $vrDia * $dias;
           }
           else
           {
              $fondo = 0;
           }
         }
         else
           $fondo = 0;
  
         return $fondo;
    }
}
?>
