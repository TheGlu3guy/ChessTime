<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>ChessTime</title>
    <link rel="stylesheet" href="index.css" type="text/css"/>
    <script src="chess.js"></script>
</head>
<body>
    <div class="container">
        <table id="plateau">
            <tbody>
                <?php for($i=0 ; $i<8 ; $i++){
                    echo("<tr>");
                    for($j=0 ; $j<8 ; $j++){
                        if(($j+$i)%2==0){
                            echo("<td class='black'>");
                        }else {
                            echo("<td class='white'>");
                        }
                        echo("<img></td>");
                    }
                    echo("</tr>");
                } ?>
            </tbody>
        </table>
    <div>
</body>
</html>