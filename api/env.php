<?php
function loadEnv($file = '.env')
{
    if (!file_exists($file)) {
        throw new Exception("Environment file not found: $file");
    }

    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        $_ENV[trim($name)] = trim($value);
        putenv("$name=$value");
    }
}