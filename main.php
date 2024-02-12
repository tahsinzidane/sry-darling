<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>sry darling</title>
    <link rel="stylesheet" href="main-style.css">
</head>
<body>
    <div class="hero">
        <p>say sorry to your jan </p>
        <div class="container">
            <form action="#" method="post">
                <input type="text" name="fname" placeholder="type here"> <br><br>
                <input type="number" name="num" placeholder="number of lines"> <br><br>
                <input type="submit" value="generate"> 
                </form>
            
       
            <div class="txt-aria">
                    <textarea id="#" name="#" rows="15" cols="70">
                     <?php  
                    if ($_SERVER["REQUEST_METHOD"] == "POST") {
                        $fname = $_POST["fname"];
                        for ($x = 0; $x <= $_POST["num"]; $x++) {
                            echo $fname . ", ";
                        }
                    }
                    ?>  
                </textarea>
            </div>
        </div>
        <img class="cpl" src="imgs/cpl-in-love.png">
    </div>
</body>
</html>
