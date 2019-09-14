<?php
    class Sync
    {
        public function __construct(){}

        public static function guardarJson( $llave, $strJsonSync, $tipo = 0, $status = 0, $status_gilber = 0 )
        {
            $db=Db::getConnect();
            
            $strJsonSync = str_replace(array("'"), '"', $strJsonSync);
            $strJsonSync = str_replace(array("\n"), " ", $strJsonSync);
            
            $query = "INSERT INTO query_sync VALUES(NULL, :llave, :query, current_timestamp, :status, :status_gilber,'','','$tipo')";
            $insert=$db->prepare($query);
			$insert->bindValue('llave',$llave);
			$insert->bindValue('query',$strJsonSync);
			$insert->bindValue('status',$status);
			$insert->bindValue('status_gilber',$status_gilber);
            $insert->execute(); 
        }
        public static function sincronizar( $tipo, $data)
        {
            switch ($tipo) 
            {
                case 'venta':
                 SyncFn::guardarVenta($data);
                break;
            
            }
        }
    }
?>