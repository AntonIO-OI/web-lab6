<?php
$fileName = 'data.json'; // The path to your JSON file

header('Content-Type: application/json');

if (file_exists($fileName)) {
    echo file_get_contents($fileName);
} else {
    echo json_encode([]);
}
?>
