<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta 
    name="description" 
    content=""
  >
  <title><?= $site_title ?></title>
  <link rel="stylesheet" href="<?= ROOT_DIR ?>build/css/main.min.css">
</head>
<body <?= ($site_id ? "id='{$site_id}'" : '') ?> >