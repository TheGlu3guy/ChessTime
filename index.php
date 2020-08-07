<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>ChessTime</title>
    <link rel="stylesheet" href="index.css" type="text/css"/>
    <script src="chess.js"></script>
</head>
<body>
    <h1>Chess Time Boys !</h1>
    <div class="container">
        <table id="plateau">
            <tbody>
                <?php for($i=0 ; $i<8 ; $i++){
                    echo("<tr>");
                    for($j=0 ; $j<8 ; $j++){
                        if(($j+$i)%2==0){
                            echo("<td class='not_active black hide'>");
                        }else {
                            echo("<td class='not_active white hide'>");
                        }
                        echo("<img class='hide'></td>");
                    }
                    echo("</tr>");
                } ?>
            </tbody>
        </table>
    <div>
</body>
</html>