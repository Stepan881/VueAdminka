<?php

$file = "../../temp_dgerg35434gf34g3.html";

if (file_exists($file)) {
  unlink($file);
} else {
  header("HTTP/1.0 400 Bad Request");
}