<?php
require 'config.php';

if (isset($_GET["token"])) {
    $token = $_GET["token"];

    $stmt = $pdo->prepare("UPDATE waitlist SET confirmed = TRUE WHERE token = ?");
    $stmt->execute([$token]);
    $baseUrl = $_SERVER['REQUEST_SCHEME'] . "://" . $_SERVER['HTTP_HOST'];

    if ($stmt->rowCount() > 0) {
        header("Location: $baseUrl#verified");
        exit();
    } else {
        $stmt = $pdo->prepare("SELECT confirmed FROM waitlist WHERE token = ?");
        $stmt->execute([$token]);
        $user = $stmt->fetch();

        if ($user && $user['confirmed']) {
            header("Location: $baseUrl#verified");
            exit();
        }


        header("Location: $baseUrl#error");
        exit();
    }
}