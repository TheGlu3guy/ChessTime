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
    <div id="container">
        <table id="plateau">
            <tbody>
                <?php for($i=0 ; $i<8 ; $i++){
                    echo("<tr>");
                    for($j=0 ; $j<8 ; $j++){
                        if(($j+$i)%2==1){
                            echo("<td class='not_active black hide'>");
                        }else {
                            echo("<td class='not_active white hide'>");
                        }
                        echo("<img class='hide'  draggable='true' ondragstart='event.dataTransfer.setData(\"text/plain\",null)'></td>");
                    }
                    echo("</tr>");
                } ?>
            </tbody>
        </table>
        <div id="choix_piece">
            <div class="center">
                <img class="2" src="img/cavalier_blanc.png"><img class="3" src="img/fou_blanc.png"><img class="1" src="img/tour_blanc.png"><img class="4" src="img/reine_blanc.png">
            </div>
        </div>
    </div>

    <h2 id="state_of_game"></h2>
</body>
</html>