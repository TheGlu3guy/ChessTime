var last_cliked = null;
var plateau;

window.onload = function (){
    var plateau_de_jeu = new Plateau();
    plateau_de_jeu.init();
    var couleur = 0;

    plateau = document.getElementById("plateau");
    var tbody = plateau.lastElementChild.children;

    var tr = [];
    for(let i=0 ; i<8 ; i++){
        tr.push([]);
        for(let j=0 ; j<8 ; j++){
            if(couleur===0){
                tr[i].push(tbody[7-i].children[7-j]);
            }else{
                tr[i].push(tbody[i].children[j]);
            }
            setTimeout(() => { tr[i][j].classList.replace('hide','show'); }, ((i*8)+j)*25 );
        }
    }

    for (let i=0 ; i<8 ;  i++){
        for (let j=0 ; j<8 ;  j++){
            if(plateau_de_jeu.tab_cases[i][j].piece !== null){
                let image = "";
                if(plateau_de_jeu.tab_cases[i][j].piece.code === 0){// pion
                    image = "img/pion";
                }else if(plateau_de_jeu.tab_cases[i][j].piece.code === 1){// tour
                    image = "img/tour";
                }if(plateau_de_jeu.tab_cases[i][j].piece.code === 2){// cavalier
                    image = "img/cavalier";
                }else if(plateau_de_jeu.tab_cases[i][j].piece.code === 3){// fou
                    image = "img/fou";
                }if(plateau_de_jeu.tab_cases[i][j].piece.code === 4){// reine
                    image = "img/reine";
                }else if(plateau_de_jeu.tab_cases[i][j].piece.code === 5){// roi
                    image = "img/roi";
                }

                if(plateau_de_jeu.tab_cases[i][j].piece.couleur === 0){
                    tr[i][j].lastElementChild.src = image+"_blanc.png";
                }else{
                    tr[i][j].lastElementChild.src = image+"_noir.png";
                }
                setTimeout(() => { tr[i][j].lastElementChild.classList.replace('hide','show'); }, ((i*8)+j+64)*25 );
            }
        }
    }
    for(let i=0 ; i<8 ; i++){
        for(let j=0 ; j<8 ; j++){
            tr[i][j].addEventListener('click', function () {
                if(this.state === null || this.state === 0){
                    tr[i][j].classList.replace("not_active","active");
                    this.state = 1;
                }else{
                    tr[i][j].classList.replace("active","not_active");
                    this.state = 0;
                }
                console.log("test");
            });
        }
    }
}
function Plateau(){
    this.tab_cases = [];
    this.roi_blanc = null;
    this.roi_noir = null;
    this.couleur = 0;//0 = blanc, les blanc débutent toujours.
    this.jeu_fini = 0;//0 : jeu non finis, 1 : jeu finis echec et mat, 2 : jeu finis égalité
    this.init = function (){

        //creation du tableau de cases
        for(let i=0 ; i<8 ; i++){
            this.tab_cases.push([]);
            for(let j=0 ; j<8 ; j++){
                this.tab_cases[i].push(new Case(i,j));
            }
        }
        //assignation des pièces blanches aux cases correspondantes
        this.tab_cases[0][0].piece = new Tour(0, this.tab_cases[0][0]);
        this.tab_cases[0][1].piece = new Cavalier(0, this.tab_cases[0][1]);
        this.tab_cases[0][2].piece = new Fou(0, this.tab_cases[0][2]);
        this.roi_blanc = new Roi(0, this.tab_cases[0][3]);
        this.tab_cases[0][3].piece = this.roi_blanc;
        this.tab_cases[0][4].piece = new Reine(0, this.tab_cases[0][4]);
        this.tab_cases[0][5].piece = new Fou(0, this.tab_cases[0][5]);
        this.tab_cases[0][6].piece = new Cavalier(0, this.tab_cases[0][6]);
        this.tab_cases[0][7].piece = new Tour(0, this.tab_cases[0][7]);
        for(let i=0 ; i<8 ; i++){
            this.tab_cases[1][i].piece = new Pion(0, this.tab_cases[1][i]);
        }

        //assignation des pièces noires aux cases correspondantes
        this.tab_cases[7][0].piece = new Tour(1, this.tab_cases[7][0]);
        this.tab_cases[7][1].piece = new Cavalier(1, this.tab_cases[7][1]);
        this.tab_cases[7][2].piece = new Fou(1, this.tab_cases[7][2]);
        this.roi_noir = new Roi(1, this.tab_cases[7][4]);
        this.tab_cases[7][4].piece = this.roi_noir;
        this.tab_cases[7][3].piece = new Reine(1, this.tab_cases[7][3]);
        this.tab_cases[7][5].piece = new Fou(1, this.tab_cases[7][5]);
        this.tab_cases[7][6].piece = new Cavalier(1, this.tab_cases[7][6]);
        this.tab_cases[7][7].piece = new Tour(1, this.tab_cases[7][7]);
        for(let i=0 ; i<8 ; i++){
            this.tab_cases[6][i].piece = new Pion(1, this.tab_cases[6][i]);
        }

        this.nouveau_coup();
    }
    this.dessiner_plateau = function (){
        var dessin = "";
        for(let i=0 ; i<8 ; i++){
            dessin = dessin + "|---|---|---|---|---|---|---|---|\n|";
            for(let j=0 ; j<8 ; j++){
                if(this.tab_cases[i][j].piece != null){
                    dessin = dessin + this.tab_cases[i][j].piece.toStr + "|";
                }else{
                    dessin = dessin + "   |";
                }
            }
            dessin = dessin + "\n";
        }
        dessin = dessin + "|---|---|---|---|---|---|---|---|\n";
        console.log(dessin);
    }
    this.cases_reachable = function (x,y){
        if(this.tab_cases[x][y].piece != null){
            return this.tab_cases[x][y].piece.cases_visitables;
        }
        return [];
    }
    /*-1 = move impossible
    *  0 = move made
    *  1 = move made and killed a piece
    *  2 = move made and check
    *  3 = move made and check and killed a piece*/
    this.bouger_Piece = function (x, y, a, b){
        var return_code = -1;
        if(this.tab_cases[x][y].piece !== null){
            if(this.tab_cases[x][y].piece.couleur === this.couleur){
                var cases = this.tab_cases[x][y].piece.cases_visitables;
                for(let i=0 ; i<cases.length ; i++){
                    if(cases[i] === this.tab_cases[a][b]){
                        //c'est bon la cases est valable
                        if(this.tab_cases[a][b].piece === null){
                            return_code = 0;
                        }else{
                            return_code = 1;
                        }
                        this.tab_cases[a][b].piece = this.tab_cases[x][y].piece;
                        this.tab_cases[x][y].piece = null;
                        this.tab_cases[a][b].piece.la_case = this.tab_cases[a][b];
                        this.tab_cases[a][b].piece.hasMoved = true;
                        if(this.couleur === 0){
                            this.couleur = 1;
                        }else{
                            this.couleur = 0;
                        }
                        if(this.estEnEchec()){
                            this.plateau_en_echec = true;
                            if(return_code === 1){
                                return_code = 3;
                            }else{
                                return_code = 2;
                            }
                        }else{
                            this.plateau_en_echec = false;
                        }
                        this.nouveau_coup();
                    }
                }
            }
        }
        return return_code;
    }
    this.nouveau_coup= function (){
        var pas_de_coup_dispo = true;
        for(let i=0 ; i<8 ; i++){
            for(let j=0 ; j<8 ; j++){
                if(this.tab_cases[i][j].piece !== null){
                    var cases_visitables = this.tab_cases[i][j].piece.cases_reachable(this.tab_cases);
                    for(let k=0 ; k<cases_visitables.length ; k++){
                        var old_piece = cases_visitables[k].piece;
                        cases_visitables[k].piece = this.tab_cases[i][j].piece
                        this.tab_cases[i][j].piece = null;
                        if(this.estEnEchec()){
                            this.tab_cases[i][j].piece = cases_visitables[k].piece;
                            cases_visitables[k].piece = old_piece;
                            cases_visitables.splice(k, 1);
                            k--;
                        }else{
                            this.tab_cases[i][j].piece = cases_visitables[k].piece;
                            cases_visitables[k].piece = old_piece;
                        }
                    }
                    this.tab_cases[i][j].piece.cases_visitables = cases_visitables;
                    if(cases_visitables.length>0){
                        pas_de_coup_dispo = false;
                    }
                }
            }
        }
        if(pas_de_coup_dispo){
            if(this.plateau_en_echec){
                this.jeu_fini = 1;
            }else{
                this.jeu_fini = 2;
            }
        }
    }
    this.estEnEchec = function (){
        for(let i=0 ; i<8 ; i++){
            for(let j=0 ; j<8 ; j++){
                if(this.tab_cases[i][j].piece !== null){
                    if(this.tab_cases[i][j].piece.couleur !== this.couleur){
                        console.log(this.tab_cases[i][j].piece.couleur);
                        var cases_reachable = this.tab_cases[i][j].piece.cases_reachable(this.tab_cases);
                        for(let k=0 ; k<cases_reachable.length ; k++){
                            if(this.couleur === 0){
                                if(cases_reachable[k] === this.roi_blanc.la_case){
                                    return true;
                                }
                            }else{
                                if(cases_reachable[k] === this.roi_noir.la_case){
                                    return true;
                                }
                            }

                        }
                    }
                }
            }
        }
        return false;
    }
}
function Tour(couleur, la_case){
    this.code = 1;//0:pion, 1:tour, 2:cavalier, 3:fou, 4:reine, 5:roi
    this.couleur=couleur;
    this.la_case=la_case;
    this.toStr = "To"+couleur;
    this.hasMoved = false;
    this.cases_visitables = -1;
    this.cases_reachable = function (tab_cases){
        var cases_reachable = [];
        var x = this.la_case.x;
        var y = this.la_case.y;
        for(let i=1 ; x-i>=0 ; i++){
            if(tab_cases[x-i][y].piece == null){
                cases_reachable.push(tab_cases[x-i][y]);
            }else{
                if(tab_cases[x-i][y].piece.couleur !== this.couleur){
                    cases_reachable.push(tab_cases[x-i][y]);
                }else {
                    break;
                }
            }
        }
        for(let i=1 ; x+i<8 ; i++){
            if(tab_cases[x+i][y].piece == null){
                cases_reachable.push(tab_cases[x+i][y]);
            }else{
                if(tab_cases[x+i][y].piece.couleur !== this.couleur){
                    cases_reachable.push(tab_cases[x+i][y]);
                }else {
                    break;
                }
            }
        }
        for(let i=1 ; y-i>=0 ; i++){
            if(tab_cases[x][y-i].piece == null){
                cases_reachable.push(tab_cases[x][y-i]);
            }else{
                if(tab_cases[x][y-i].piece.couleur !== this.couleur){
                    cases_reachable.push(tab_cases[x][y-i]);
                }else {
                    break;
                }
            }
        }
        for(let i=1 ; y+i<8 ; i++){
            if(tab_cases[x][y+i].piece == null){
                cases_reachable.push(tab_cases[x][y+i]);
            }else{
                if(tab_cases[x][y+i].piece.couleur !== this.couleur){
                    cases_reachable.push(tab_cases[x][y+i]);
                }else {
                    break;
                }
            }
        }
        return cases_reachable;
    }
}
function Cavalier(couleur, la_case){
    this.code = 2;//0:pion, 1:tour, 2:cavalier, 3:fou, 4:reine, 5:roi
    this.couleur=couleur;
    this.la_case=la_case;
    this.toStr = "Ca"+couleur;
    this.hasMoved = false;
    this.cases_visitables = -1;
    this.cases_reachable = function (tab_cases) {
        var cases_reachable = [];
        var x = this.la_case.x;
        var y = this.la_case.y;

        if(x-2>=0 && y-1>=0){
            if (tab_cases[x - 2][y - 1].piece == null) {
                cases_reachable.push(tab_cases[x - 2][y - 1]);
            } else if (tab_cases[x - 2][y - 1].piece.couleur !== this.couleur) {
                cases_reachable.push(tab_cases[x - 2][y - 1]);
            }
        }
        if(x-2>=0 && y+1<8) {
            if (tab_cases[x - 2][y + 1].piece == null) {
                cases_reachable.push(tab_cases[x - 2][y + 1]);
            } else if (tab_cases[x - 2][y + 1].piece.couleur !== this.couleur) {
                cases_reachable.push(tab_cases[x - 2][y + 1]);
            }
        }
        if(x+2<8 && y-1>=0) {
            if (tab_cases[x + 2][y - 1].piece == null) {
                cases_reachable.push(tab_cases[x + 2][y - 1]);
            } else if (tab_cases[x + 2][y - 1].piece.couleur !== this.couleur) {
                cases_reachable.push(tab_cases[x + 2][y - 1]);
            }
        }
        if(x+2<8 && y+1<8) {
            if (tab_cases[x + 2][y + 1].piece == null) {
                cases_reachable.push(tab_cases[x + 2][y + 1]);
            } else if (tab_cases[x + 2][y + 1].piece.couleur !== this.couleur) {
                cases_reachable.push(tab_cases[x + 2][y + 1]);
            }
        }
        if(x+1<8 && y+2<8) {
            if (tab_cases[x + 1][y + 2].piece == null) {
                cases_reachable.push(tab_cases[x + 1][y + 2]);
            } else if (tab_cases[x + 1][y + 2].piece.couleur !== this.couleur) {
                cases_reachable.push(tab_cases[x + 1][y + 2]);
            }
        }
        if(x-1>=0 && y+2<8) {
            if (tab_cases[x - 1][y + 2].piece == null) {
                cases_reachable.push(tab_cases[x - 1][y + 2]);
            } else if (tab_cases[x - 1][y + 2].piece.couleur !== this.couleur) {
                cases_reachable.push(tab_cases[x - 1][y + 2]);
            }
        }
        if(x+1<8 && y-2>=0) {
            if (tab_cases[x + 1][y - 2].piece == null) {
                cases_reachable.push(tab_cases[x + 1][y - 2]);
            } else if (tab_cases[x + 1][y - 2].piece.couleur !== this.couleur) {
                cases_reachable.push(tab_cases[x + 1][y - 2]);
            }
        }
        if(x-1>=0 && y-2>=0) {
            if (tab_cases[x - 1][y - 2].piece == null) {
                cases_reachable.push(tab_cases[x - 1][y - 2]);
            } else if (tab_cases[x - 1][y - 2].piece.couleur !== this.couleur) {
                cases_reachable.push(tab_cases[x - 1][y - 2]);
            }
        }
        return cases_reachable;
    }
}
function Fou(couleur, la_case){
    this.code = 3;//0:pion, 1:tour, 2:cavalier, 3:fou, 4:reine, 5:roi
    this.couleur=couleur;
    this.la_case=la_case;
    this.toStr = "Fo"+couleur;
    this.hasMoved = false;
    this.cases_visitables = -1;
    this.cases_reachable = function (tab_cases) {
        var cases_reachable = [];
        var x = this.la_case.x;
        var y = this.la_case.y;

        for(let i=1 ; x-i>=0 && y-i>=0 ; i++){
            if(tab_cases[x-i][y-i].piece == null){
                cases_reachable.push(tab_cases[x-i][y-i]);
            }else{
                if(tab_cases[x-i][y-i].piece.couleur !== this.couleur){
                    cases_reachable.push(tab_cases[x-i][y-i]);
                }else {
                    break;
                }
            }
        }
        for(let i=1 ; x+i<8 && y+i<8 ; i++){
            if(tab_cases[x+i][y+i].piece == null){
                cases_reachable.push(tab_cases[x+i][y+i]);
            }else{
                if(tab_cases[x+i][y+i].piece.couleur !== this.couleur){
                    cases_reachable.push(tab_cases[x+i][y+i]);
                }else {
                    break;
                }
            }
        }
        for(let i=1 ; x+i<8 && y-i>=0 ; i++){
            if(tab_cases[x+i][y-i].piece == null){
                cases_reachable.push(tab_cases[x+i][y-i]);
            }else{
                if(tab_cases[x+i][y-i].piece.couleur !== this.couleur){
                    cases_reachable.push(tab_cases[x+i][y-i]);
                }else {
                    break;
                }
            }
        }
        for(let i=1 ; x-i>=0 && y+i<8 ; i++){
            if(tab_cases[x-i][y+i].piece == null){
                cases_reachable.push(tab_cases[x-i][y+i]);
            }else{
                if(tab_cases[x-i][y+i].piece.couleur !== this.couleur){
                    cases_reachable.push(tab_cases[x-i][y+i]);
                }else {
                    break;
                }
            }
        }

        return cases_reachable;
    }
}
function Reine(couleur, la_case){
    this.code = 4;//0:pion, 1:tour, 2:cavalier, 3:fou, 4:reine, 5:roi
    this.couleur=couleur;
    this.la_case=la_case;
    this.toStr = "Re"+couleur;
    this.hasMoved = false;
    this.cases_visitables = -1;
    this.cases_reachable = function (tab_cases) {
        var cases_reachable = [];
        var x = this.la_case.x;
        var y = this.la_case.y;

        for(let i=1 ; x-i>=0 && y-i>=0 ; i++){
            if(tab_cases[x-i][y-i].piece == null){
                cases_reachable.push(tab_cases[x-i][y-i]);
            }else{
                if(tab_cases[x-i][y-i].piece.couleur !== this.couleur){
                    cases_reachable.push(tab_cases[x-i][y-i]);
                }else {
                    break;
                }
            }
        }
        for(let i=1 ; x+i<8 && y+i<8 ; i++){
            if(tab_cases[x+i][y+i].piece == null){
                cases_reachable.push(tab_cases[x+i][y+i]);
            }else{
                if(tab_cases[x+i][y+i].piece.couleur !== this.couleur){
                    cases_reachable.push(tab_cases[x+i][y+i]);
                }else {
                    break;
                }
            }
        }
        for(let i=1 ; x+i<8 && y-i>=0 ; i++){
            if(tab_cases[x+i][y-i].piece == null){
                cases_reachable.push(tab_cases[x+i][y-i]);
            }else{
                if(tab_cases[x+i][y-i].piece.couleur !== this.couleur){
                    cases_reachable.push(tab_cases[x+i][y-i]);
                }else {
                    break;
                }
            }
        }
        for(let i=1 ; x-i>=0 && y+i<8 ; i++){
            if(tab_cases[x-i][y+i].piece == null){
                cases_reachable.push(tab_cases[x-i][y+i]);
            }else{
                if(tab_cases[x-i][y+i].piece.couleur !== this.couleur){
                    cases_reachable.push(tab_cases[x-i][y+i]);
                }else {
                    break;
                }
            }
        }
        for(let i=1 ; x-i>=0 ; i++){
            if(tab_cases[x-i][y].piece == null){
                cases_reachable.push(tab_cases[x-i][y]);
            }else{
                if(tab_cases[x-i][y].piece.couleur !== this.couleur){
                    cases_reachable.push(tab_cases[x-i][y]);
                }else {
                    break;
                }
            }
        }
        for(let i=1 ; x+i<8 ; i++){
            if(tab_cases[x+i][y].piece == null){
                cases_reachable.push(tab_cases[x+i][y]);
            }else{
                if(tab_cases[x+i][y].piece.couleur !== this.couleur){
                    cases_reachable.push(tab_cases[x+i][y]);
                }else {
                    break;
                }
            }
        }
        for(let i=1 ; y-i>=0 ; i++){
            if(tab_cases[x][y-i].piece == null){
                cases_reachable.push(tab_cases[x][y-i]);
            }else{
                if(tab_cases[x][y-i].piece.couleur !== this.couleur){
                    cases_reachable.push(tab_cases[x][y-i]);
                }else {
                    break;
                }
            }
        }
        for(let i=1 ; y+i<8 ; i++){
            if(tab_cases[x][y+i].piece == null){
                cases_reachable.push(tab_cases[x][y+i]);
            }else{
                if(tab_cases[x][y+i].piece.couleur !== this.couleur){
                    cases_reachable.push(tab_cases[x][y+i]);
                }else {
                    break;
                }
            }
        }

        return cases_reachable;
    }
}
function Roi(couleur, la_case){
    this.code = 5;//0:pion, 1:tour, 2:cavalier, 3:fou, 4:reine, 5:roi
    this.couleur=couleur;
    this.la_case=la_case;
    this.toStr = "Ro"+couleur;
    this.hasMoved = false;
    this.cases_visitables = -1;
    this.cases_reachable = function (tab_cases) {
        var cases_reachable = [];
        var x = this.la_case.x;
        var y = this.la_case.y;

        if(x-1>=0 && y-1>=0){
            if (tab_cases[x - 1][y - 1].piece == null) {
                cases_reachable.push(tab_cases[x - 1][y - 1]);
            } else if (tab_cases[x - 1][y - 1].piece.couleur !== this.couleur) {
                cases_reachable.push(tab_cases[x - 1][y - 1]);
            }
        }
        if(x-1>=0 && y+1<8) {
            if (tab_cases[x - 1][y + 1].piece == null) {
                cases_reachable.push(tab_cases[x - 1][y + 1]);
            } else if (tab_cases[x - 1][y + 1].piece.couleur !== this.couleur) {
                cases_reachable.push(tab_cases[x - 1][y + 1]);
            }
        }
        if(x+1<8 && y-1>=0) {
            if (tab_cases[x + 1][y - 1].piece == null) {
                cases_reachable.push(tab_cases[x + 1][y - 1]);
            } else if (tab_cases[x + 1][y - 1].piece.couleur !== this.couleur) {
                cases_reachable.push(tab_cases[x + 1][y - 1]);
            }
        }
        if(x+1<8 && y+1<8) {
            if (tab_cases[x + 1][y + 1].piece == null) {
                cases_reachable.push(tab_cases[x + 1][y + 1]);
            } else if (tab_cases[x + 1][y + 1].piece.couleur !== this.couleur) {
                cases_reachable.push(tab_cases[x + 1][y + 1]);
            }
        }
        if(x+1<8) {
            if (tab_cases[x + 1][y].piece == null) {
                cases_reachable.push(tab_cases[x + 1][y]);
            } else if (tab_cases[x + 1][y].piece.couleur !== this.couleur) {
                cases_reachable.push(tab_cases[x + 1][y]);
            }
        }
        if(x-1>=0) {
            if (tab_cases[x - 1][y].piece == null) {
                cases_reachable.push(tab_cases[x - 1][y]);
            } else if (tab_cases[x - 1][y].piece.couleur !== this.couleur) {
                cases_reachable.push(tab_cases[x - 1][y]);
            }
        }
        if(y-1>=0) {
            if (tab_cases[x][y - 1].piece == null) {
                cases_reachable.push(tab_cases[x][y - 1]);
            } else if (tab_cases[x][y - 1].piece.couleur !== this.couleur) {
                cases_reachable.push(tab_cases[x][y - 1]);
            }
        }
        if(y+1<8) {
            if (tab_cases[x][y+1].piece == null) {
                cases_reachable.push(tab_cases[x][y+1]);
            } else if (tab_cases[x][y+1].piece.couleur !== this.couleur) {
                cases_reachable.push(tab_cases[x][y+1]);
            }
        }

        return cases_reachable;
    }
}
function Pion(couleur, la_case){
    this.code = 0;//0:pion, 1:tour, 2:cavalier, 3:fou, 4:reine, 5:roi
    this.couleur=couleur;
    this.la_case=la_case;
    this.toStr = "Pi"+couleur;
    this.hasMoved = false;
    this.cases_visitables = -1;
    this.cases_reachable = function (tab_cases) {
        var cases_reachable = [];
        var x = this.la_case.x;
        var y = this.la_case.y;
        if(this.couleur === 1){
            if(!this.hasMoved){
                if(x-2>=0){
                    if(tab_cases[x-2][y].piece === null){
                        cases_reachable.push(tab_cases[x-2][y]);
                    }
                }
            }
            if(x-1>=0){
                if(tab_cases[x-1][y].piece===null){
                    cases_reachable.push(tab_cases[x-1][y]);
                }
            }

            if(x-1>=0 && y+1<8){
                if(tab_cases[x-1][y+1].piece !== null) {
                    if (tab_cases[x - 1][y + 1].piece.couleur !== this.couleur) {
                        cases_reachable.push(tab_cases[x - 1][y + 1]);
                    }
                }
            }if(x-1>=0 && y-1>=0){
                if(tab_cases[x-1][y-1].piece !== null) {
                    if (tab_cases[x - 1][y - 1].piece.couleur !== this.couleur) {
                        cases_reachable.push(tab_cases[x - 1][y - 1]);
                    }
                }
            }
        }
        if(this.couleur === 0){
            if(!this.hasMoved){
                if(x+2<8){
                    if(tab_cases[x+2][y].piece === null){
                        cases_reachable.push(tab_cases[x+2][y]);
                    }
                }
            }
            if(x+1<8){
                if(tab_cases[x+1][y].piece===null){
                    cases_reachable.push(tab_cases[x+1][y]);
                }
            }

            if(x+1<8 && y+1<8){
                if(tab_cases[x+1][y+1].piece !== null) {
                    if (tab_cases[x + 1][y + 1].piece.couleur !== this.couleur) {
                        cases_reachable.push(tab_cases[x + 1][y + 1]);
                    }
                }
            }if(x+1<8 && y-1>=0){
                if(tab_cases[x+1][y-1].piece !== null){
                    if (tab_cases[x + 1][y - 1].piece.couleur !== this.couleur) {
                        cases_reachable.push(tab_cases[x + 1][y - 1]);
                    }
                }
            }
        }


        return cases_reachable;
    }
}
var verify_case = function (x, y, couleur, tab_cases){
    if(x>=0 && x<8 && y>=0 && y<8){
        //on est dans le plateau
        if(tab_cases[x][y].piece === null){
            return true;
        }else if(tab_cases[x][y].piece.couleur !== couleur) {
            return true;
        }
    }
    return false;
}
function Case(x, y){
    this.x=x;
    this.y=y;
    this.piece = null;
    this.toStr = function (){
        var str = ""+x+" | "+y+" : ";
        if(this.piece != null){
            str = str + this.piece.toStr;
        }
        return str;
    }
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}