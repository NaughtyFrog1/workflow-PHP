<?php

function conectarDB(): mysqli {
  $db = mysqli_connect(
    'localhost', 
    'user', 
    'password',
    'database'
  );

  if (!$db) {
    echo 'Error en la conexión a la base de datos';
    exit;
  }

  return $db;
}