var last_cliked = null;
window.onload = function (){
    console.log("test");
    var plateau = document.getElementById("plateau");
    tbody = plateau.lastElementChild.children;

    var tab_cases = [];
    var tr = [];
    for($i=0 ; $i<8 ; $i++){
        tab_cases.push([]);
        tr.push([]);
        for($j=0 ; $j<8 ; $j++){
            let the_cases = new Case($i, $j, tbody[$i].children[$j]);
            tab_cases[$i].push(the_cases);
            the_cases.tr.addEventListener("click", function (e){
                the_cases.click(e.clientX,e.clientY);
                if(last_cliked!=null){
                    last_cliked.isFocus = false;
                    last_cliked.tr.lastElementChild.style.backgroundColor = "transparent";
                }
                last_cliked = the_cases;
            });

            tr[$i].push(tbody[$i].children[$j]);
        }
    }

    for ($j=0 ; $j<8 ;  $j++){
        tab_cases[1][$j].piece = new Pion();
        tab_cases[1][$j].tr.lastElementChild.src = "img/pion_blanc.png";
    }

}

function Case(x, y, tr){
    this.tr = tr;
    this.x=x;
    this.y=y;
    this.piece = null;
    this.isFocus = false;
    this.click = function (clientX, clientY){
        console.log("click on "+this.x+" "+this.y);
        if(this.isFocus){
            if (this.piece != null) {
                this.tr.lastElementChild.style.position = "absolute";
                this.tr.lastElementChild.style.left = (clientX - 30) + "px";
                this.tr.lastElementChild.style.top = (clientY - 30) + "px";
                window.addEventListener('mousemove', e => {
                    this.tr.lastElementChild.style.left = (e.clientX - 30) + "px";
                    this.tr.lastElementChild.style.top = (e.clientY - 30) + "px";
                });
                window.addEventListener('click', e => {

                });
            }
        }else{
            this.tr.lastElementChild.style.backgroundColor = "gray";
        }
        this.isFocus = !this.isFocus;
    };
}

function Pion(){
    this.couleur = 1;
}