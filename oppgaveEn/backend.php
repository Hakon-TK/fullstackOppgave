<?php
header('Content-Type: application/json');
ob_start();

// Database connection using environment variables
$host = getenv('DB_HOST') ?: 'localhost';
$user = getenv('DB_USER') ?: 'root';
$pass = getenv('DB_PASS') ?: '';
$dbname = getenv('DB_NAME') ?: 'Registrering';

$mysqli = new mysqli($host, $user, $pass, $dbname);

if ($mysqli->connect_error) {
    error_log("Database connection failed: " . $mysqli->connect_error);
    echo json_encode(['success' => false, 'message' => 'En intern feil oppstod.']);
    exit;
}

// Predefined set of valid phone numbers
$validPhoneNumbers = [
    '91234567', '93456789', '94455678', '94567890', '95512345',
    '96543210', '97456789', '98455678', '99412345', '99876543'
];

// Validate Content-Type
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_SERVER['CONTENT_TYPE'] !== 'application/json') {
    echo json_encode(['success' => false, 'message' => 'Ugyldig Content-Type.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $firstName = $input['firstName'] ?? '';
    $lastName = $input['lastName'] ?? '';
    $email = $input['email'] ?? '';
    $phone = $input['phone'] ?? '';
    $birthDate = $input['birthDate'] ?? '';

    // Input validation
    if (!$firstName || !$lastName || !$phone || !$birthDate) {
        echo json_encode(['success' => false, 'message' => 'Alle obligatoriske felter må fylles ut.']);
        exit;
    }

    if (!preg_match('/^[49][0-9]{7}$/', $phone) || !in_array($phone, $validPhoneNumbers)) {
        echo json_encode(['success' => false, 'message' => 'Ugyldig eller ikke-tillatt telefonnummer.']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL) && !empty($email)) {
        echo json_encode(['success' => false, 'message' => 'Ugyldig e-postadresse.']);
        exit;
    }

    $birthDateObj = DateTime::createFromFormat('Y-m-d', $birthDate);
    if (!$birthDateObj || $birthDateObj->diff(new DateTime('now'))->y < 16) {
        echo json_encode(['success' => false, 'message' => 'Fødselsdato må være gyldig, og brukeren må være over 16 år.']);
        exit;
    }

    // Use prepared statements to prevent SQL injection
    $stmt = $mysqli->prepare("INSERT INTO users (firstName, lastName, email, phone, birthDate) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $firstName, $lastName, $email, $phone, $birthDate);

    if ($stmt->execute()) {
        $lastId = $mysqli->insert_id;
        $result = $mysqli->query("SELECT * FROM users WHERE id = $lastId");
        $newData = $result->fetch_assoc();
        echo json_encode(['success' => true, 'data' => $newData]);
    } else {
        error_log("Database insert failed: " . $mysqli->error);
        echo json_encode(['success' => false, 'message' => 'Kunne ikke lagre data i databasen.']);
    }
    $stmt->close();

} else {
    $latestResult = $mysqli->query("SELECT * FROM users ORDER BY id DESC LIMIT 1");
    $latestData = $latestResult->fetch_assoc();

    $allDataResult = $mysqli->query("SELECT * FROM users ORDER BY id DESC");
    $data = [];

    while ($row = $allDataResult->fetch_assoc()) {
        $data[] = $row;
    }

    echo json_encode(['success' => true, 'latest' => $latestData, 'data' => $data]);
}

ob_end_flush();
$mysqli->close();
