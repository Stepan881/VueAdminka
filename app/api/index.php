<?php

$htmlFile = glob("../../*.html");

$responce = [];

foreach ($htmlFile as $file) {
  array_push($responce, basename($file));
  
}

echo json_encode($responce);