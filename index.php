<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h3>say sorry to your jan 100x time</h3>
<form action="#" method="post">
        <input type="text" name="fname"> <br><br>
        <input type="submit" value="go"> 
    </form>

<?php  
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $fname = $_POST["fname"];
        for ($x = 0; $x <= 100; $x++) {
            echo $fname . ", " . $x . "<br>";
        }
    }
?>  
</body>
</html>
