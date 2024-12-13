<?php
// Konfigurasjon for database
$host = "localhost";
$username = "root";
$password = "";
$dbname = "coffeeShop";

// Opprett forbindelse til databasen
$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Tilkobling mislyktes: " . $conn->connect_error);
}

// Klasse for å håndtere drikker
class Drink {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function create($name, $price) {
        // Validering av inputdata før lagring
        if (empty($name) || $price <= 0) {
            return "Ugyldig informasjon for drikk.";
        }
        $stmt = $this->conn->prepare("INSERT INTO drinks (name, price) VALUES (?, ?)");
        $stmt->bind_param("sd", $name, $price);
        return $stmt->execute() ? "Drikk lagt til." : "Feil ved lagring av drikk.";
    }

    public function getAll() {
        // Henter alle drikker fra databasen
        $result = $this->conn->query("SELECT * FROM drinks");
        return $result->fetch_all(MYSQLI_ASSOC);
    }
}

// Klasse for å håndtere tillegg
class AddOn {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function create($name, $price) {
        if (empty($name)) {
            return "Ugyldig informasjon for tillegg.";
        }
        $stmt = $this->conn->prepare("INSERT INTO addOns (name, price) VALUES (?, ?)");
        $stmt->bind_param("sd", $name, $price);
        return $stmt->execute() ? "Tillegg lagt til." : "Feil ved lagring av tillegg.";
    }

    public function getAll() {
        // Henter alle tillegg fra databasen
        $result = $this->conn->query("SELECT * FROM addOns");
        return $result->fetch_all(MYSQLI_ASSOC);
    }
}

// Klasse for å håndtere bestillinger
class Order {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function create($details, $totalPrice) {
        // Validering av inputdata før lagring
        if (empty($details) || $totalPrice <= 0) {
            return "Ugyldig informasjon for bestilling.";
        }
        $stmt = $this->conn->prepare("INSERT INTO orders (details, totalPrice) VALUES (?, ?)");
        $stmt->bind_param("sd", $details, $totalPrice);
        return $stmt->execute() ? "Bestilling opprettet." : "Feil ved oppretting av bestilling.";
    }

    public function delete($id) {
        // Sletting av bestilling basert på ID
        $stmt = $this->conn->prepare("DELETE FROM orders WHERE id = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute() ? "Bestilling slettet." : "Feil ved sletting av bestilling.";
    }

    public function getAll() {
        // Henter alle bestillinger sortert etter opprettelsesdato
        $result = $this->conn->query("SELECT * FROM orders ORDER BY createdAt DESC");
        return $result->fetch_all(MYSQLI_ASSOC);
    }
}

// Håndtering av POST-forespørsler
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'];

    if ($action === 'createDrink') {
        $drink = new Drink($conn);
        echo $drink->create($_POST['name'], $_POST['price']);
    } elseif ($action === 'createAddOn') {
        $addOn = new AddOn($conn);
        echo $addOn->create($_POST['name'], $_POST['price']);
    } elseif ($action === 'createOrder') {
        $order = new Order($conn);
        echo $order->create($_POST['details'], $_POST['totalPrice']);
    } elseif ($action === 'deleteOrder') {
        $order = new Order($conn);
        echo $order->delete($_POST['id']);
    }
}

// Håndtering av GET-forespørsler
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = $_GET['action'];

    if ($action === 'getDrinks') {
        $drink = new Drink($conn);
        echo json_encode($drink->getAll());
    } elseif ($action === 'getAddOns') {
        $addOn = new AddOn($conn);
        echo json_encode($addOn->getAll());
    } elseif ($action === 'getOrders') {
        $order = new Order($conn);
        echo json_encode($order->getAll());
    }
}
?>
