<?php
// login.php

// Dados de exemplo para login (em um sistema real, você deveria conectar a um banco de dados)
$usuarios = [
    ['email' => 'usuario@exemplo.com', 'senha' => 'senha123']
];

// Verificar se os dados foram enviados via POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Receber os dados do formulário
    $email = $_POST['email'];
    $senha = $_POST['senha'];

    // Verificar se as credenciais estão corretas
    $usuario_valido = false;
    foreach ($usuarios as $usuario) {
        if ($usuario['email'] == $email && $usuario['senha'] == $senha) {
            $usuario_valido = true;
            break;
        }
    }

    // Retornar resposta em formato JSON
    if ($usuario_valido) {
        echo json_encode(['sucesso' => true]);
    } else {
        echo json_encode(['sucesso' => false]);
    }
}
?>
