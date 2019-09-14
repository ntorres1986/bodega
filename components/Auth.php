<?php
    use Firebase\JWT\JWT;
    class Auth
    {
        private static $secret_key = 'Sdw1s9x8@Genesis';
        private static $encrypt = ['HS256'];
        private static $aud = null;

        public function __construct(){}
        
        public static function SignIn($data)
        {
            $time = time();
            
            $token = array(
                'exp' => $time +( 3600 * 10), //3600 Es en segundos 
                //'iat' => $time,
                //'exp' => $time--,
                'aud' => self::Aud(),
                'data' => $data
            );

            return JWT::encode($token, self::$secret_key);
        }
        
        public static function Check($token)
        {
            if(empty($token))
            {
                throw new Exception("Codigo de usuario invalido por favor vuelva a iniciar sesión.");
            }
            
            $decode = JWT::decode(
                $token,
                self::$secret_key,
                self::$encrypt
            );
            
            if($decode->aud !== self::Aud())
            {
                throw new Exception("Usuario no indentifacado en el sistem por favor vuelva a iniciar sesión.");
            }

            return true;
        }
        
        public static function GetData($token)
        {
            return JWT::decode(
                $token,
                self::$secret_key,
                self::$encrypt
            )->data;
        }
        
        private static function Aud()
        {
            $aud = '';
            
            if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
                $aud = $_SERVER['HTTP_CLIENT_IP'];
            } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
                $aud = $_SERVER['HTTP_X_FORWARDED_FOR'];
            } else {
                $aud = $_SERVER['REMOTE_ADDR'];
            }
            
            $aud .= @$_SERVER['HTTP_USER_AGENT'];
            $aud .= gethostname();
            
            return sha1($aud);
        }
    }
?>
