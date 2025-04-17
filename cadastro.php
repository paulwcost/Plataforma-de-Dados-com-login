<?php
require 'vendor/autoload.php'; // carrega o MongoDB

use MongoDB\Client;

// Conexão com o MongoDB Atlas
$mongoClient = new Client("mongodb+srv://admin:<db_password>@cluster0.5n3vk1i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

// Substitua <db_password> pela sua senha real:
$uri = "mongodb+srv://admin:SUA_SENHA_REAL@cluster0.5n3vk1i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
$mongoClient = new Client($uri);

$database = $mongoClient->plataforma_conservacao;
$colecao = $database->usuarios;

// Dados do formulário
$nome = $_POST['nome'] ?? '';
$email = $_POST['email'] ?? '';
$usuario = $_POST['usuario'] ?? '';
$senha = $_POST['senha'] ?? '';
$confirmarSenha = $_POST['confirmar-senha'] ?? '';
$tipo = $_POST['tipo-usuario'] ?? 'visitante';

// Verifica se senhas coincidem
if ($senha !== $confirmarSenha) {
    echo "As senhas não coincidem.";
    exit;
}

// Criptografa a senha
$senhaHash = password_hash($senha, PASSWORD_DEFAULT);

// Cria o documento
$usuarioData = [
    "nome" => $nome,
    "email" => $email,
    "usuario" => $usuario,
    "senha" => $senhaHash,
    "tipo" => $tipo,
    "dataCadastro" => new MongoDB\BSON\UTCDateTime()
];

// Insere no MongoDB
$resultado = $colecao->insertOne($usuarioData);

// Redireciona para a página de sucesso
header("Location: sucesso.html");
exit;
?>
