<?php
// cadastro.php

// Conexão com o banco de dados
// Altere as configurações conforme seu banco de dados
$host = "localhost";
$dbname = "plataforma_conservacao";
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Recebe os dados do formulário
        $nome = $_POST['nome'];
        $email = $_POST['email'];
        $usuario = $_POST['usuario'];
        $senha = $_POST['senha'];
        $confirmar_senha = $_POST['confirmar-senha'];
        $tipo_usuario = $_POST['tipo-usuario'];

        // Verifica se as senhas coincidem
        if ($senha !== $confirmar_senha) {
            echo "As senhas não coincidem. Tente novamente.";
            exit;
        }

        // Verifica se o e-mail ou usuário já existem no banco de dados
        $stmt = $conn->prepare("SELECT * FROM usuarios WHERE email = :email OR usuario = :usuario");
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':usuario', $usuario);
        $stmt->execute();
        $usuario_existente = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($usuario_existente) {
            echo "E-mail ou nome de usuário já registrados. Tente outro.";
            exit;
        }

        // Criptografa a senha
        $senha_cripto = password_hash($senha, PASSWORD_DEFAULT);

        // Insere o novo usuário no banco de dados
        $stmt = $conn->prepare("INSERT INTO usuarios (nome, email, usuario, senha, tipo_usuario) VALUES (:nome, :email, :usuario, :senha, :tipo_usuario)");
        $stmt->bindParam(':nome', $nome);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':usuario', $usuario);
        $stmt->bindParam(':senha', $senha_cripto);
        $stmt->bindParam(':tipo_usuario', $tipo_usuario);

        if ($stmt->execute()) {
            echo "Cadastro realizado com sucesso!";
            // Redireciona o usuário para a página de sucesso ou login
            header("Location: sucesso.html");
        } else {
            echo "Erro ao cadastrar. Tente novamente.";
        }
    }
} catch (PDOException $e) {
    echo "Erro: " . $e->getMessage();
}
?>
