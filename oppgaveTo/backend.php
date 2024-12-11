<?php
// Database Configuration
$host = "localhost";
$username = "root";
$password = "";
$dbname = "coffeeShop";

// Establish database connection
$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Drink Class
class Drink {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function create($name, $price) {
        if (empty($name) || $price <= 0) {
            return "Invalid drink data.";
        }
        $stmt = $this->conn->prepare("INSERT INTO drinks (name, price) VALUES (?, ?)");
        $stmt->bind_param("sd", $name, $price);
        return $stmt->execute() ? "Drink added successfully." : "Error adding drink.";
    }

    public function getAll() {
        $result = $this->conn->query("SELECT * FROM drinks");
        return $result->fetch_all(MYSQLI_ASSOC);
    }
}

// AddOn Class
class AddOn {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function create($name, $price) {
        if (empty($name)) {
            return "Invalid add-on data.";
        }
        $stmt = $this->conn->prepare("INSERT INTO addOns (name, price) VALUES (?, ?)");
        $stmt->bind_param("sd", $name, $price);
        return $stmt->execute() ? "Add-on added successfully." : "Error adding add-on.";
    }

    public function getAll() {
        $result = $this->conn->query("SELECT * FROM addOns");
        return $result->fetch_all(MYSQLI_ASSOC);
    }
}

// Order Class
class Order {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function create($details, $totalPrice) {
        if (empty($details) || $totalPrice <= 0) {
            return "Invalid order data.";
        }
        $stmt = $this->conn->prepare("INSERT INTO orders (details, totalPrice) VALUES (?, ?)");
        $stmt->bind_param("sd", $details, $totalPrice);
        return $stmt->execute() ? "Order placed successfully." : "Error placing order.";
    }

    public function delete($id) {
        $stmt = $this->conn->prepare("DELETE FROM orders WHERE id = ?");
        $stmt->bind_param("i", $id);
        return $stmt->execute() ? "Order deleted successfully." : "Error deleting order.";
    }

    public function getAll() {
        $result = $this->conn->query("SELECT * FROM orders ORDER BY createdAt DESC");
        return $result->fetch_all(MYSQLI_ASSOC);
    }
}

// API Example Usage
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