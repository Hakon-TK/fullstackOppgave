<?php
header('Content-Type: application/json');
$host = 'localhost';
$user = 'root';
$password = '';
$dbname = 'OppgaveEn';

$conn = new mysqli($host, $user, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(['success' => false,'error'=> "Kunne ikke koble til databasen"]));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $firstName = $_POST['firstName'];
    $lastName = $_POST['lastName'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $birthday = $_POST['birthday'];
}

if (!preg_match('/^[49]\d{7}$/', $telefon)) {
    echo json_encode(['success'=> false,'error'=> 'Ugyldig telefonnummer']);
    exit;
}

$sql = "INSERT INTO Brukerdata (fornavn, etternavn, epost, telefon, fodselsdato) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssss", $firstName, $lastName, $email, $phone, $birthday);

if ($stmt->execute()) {
    $result = $conn->query("SELECT fornavn, etternavn, epost, telefon, fodselsdato FROM Brukerdata ORDER BY opprettet DESC");
    $records = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode(['success' => true, 'records' => $records]);
} else {
    echo json_encode(['success' => false, 'error' => 'Kunne ikke lagre data']);
}
?>