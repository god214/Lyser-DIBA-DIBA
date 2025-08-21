<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Méthode non autorisée']);
    exit;
}

$expected_password = "diba2025";

$raw_input = file_get_contents("php://input");
$data = json_decode($raw_input, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Données JSON invalides']);
    exit;
}

if (!isset($data['password']) || $data['password'] !== $expected_password) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Mot de passe incorrect']);
    exit;
}

if (!isset($data['annonces']) || !is_array($data['annonces'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Structure de données invalide']);
    exit;
}

foreach ($data['annonces'] as $a) {
    if (empty(trim($a['titre'])) || empty(trim($a['message'])) || !strtotime($a['date'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Annonce invalide']);
        exit;
    }
}

$file_path = __DIR__ . '/annonces.json';
if (file_exists($file_path)) {
    copy($file_path, __DIR__ . '/annonces_backup_' . date('Y-m-d_His') . '.json');
}

$result = file_put_contents($file_path, json_encode(['annonces' => $data['annonces']], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

if ($result === false) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Erreur écriture fichier']);
    exit;
}

echo json_encode(['success' => true, 'message' => 'Annonces mises à jour avec succès']);
