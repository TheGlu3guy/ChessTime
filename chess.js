var state_of_game;
var last_cliked = null;
var plateau;
var plateau_de_jeu;
var couleur;
var tr;
var choix_piece;

var checker = null;
var highlight_checker = function (){
    if(plateau_de_jeu.couleur === 1){
        checker = plateau_de_jeu.get_checker(1);
        checker.push([plateau_de_jeu.roi_noir.la_case.x,plateau_de_jeu.roi_noir.la_case.y]);
    }else{
        checker = plateau_de_jeu.get_checker(0);
        checker.push([plateau_de_jeu.roi_blanc.la_case.x,plateau_de_jeu.roi_blanc.la_case.y]);
    }
    for(let i=0 ; i<checker.length ; i++){
        tr[checker[i][0]][checker[i][1]].classList.replace('white', 'light_red');
        tr[checker[i][0]][checker[i][1]].classList.replace('black', 'dark_red');
        tr[checker[i][0]][checker[i][1]].classList.replace('light_green', 'light_red');
        tr[checker[i][0]][checker[i][1]].classList.replace('dark_green', 'dark_red');
        tr[checker[i][0]][checker[i][1]].classList.replace('light_yellow', 'light_red');
        tr[checker[i][0]][checker[i][1]].classList.replace('dark_yellow', 'dark_red');
    }
}
var hide_checker = function (){
    if(checker !== null){
        for(let i=0 ; i<checker.length ; i++){
            tr[checker[i][0]][checker[i][1]].classList.replace('light_red', 'white');
            tr[checker[i][0]][checker[i][1]].classList.replace('dark_red', 'black');
        }
        checker = null;
    }
}

var onFocus = false;
var precedent_target = null;
var show_case = function (target){
    var x = target.parentNode.sectionRowIndex;
    var y = target.cellIndex;
    if(target.classList.contains('black')){
        target.classList.replace("not_active","active_black");
    }else{
        target.classList.replace("not_active","active_white");
    }
    var cases_reachable = [];
    if(couleur === 0){
        cases_reachable = plateau_de_jeu.cases_reachable(7-x,7-y);
    }else{
        cases_reachable = plateau_de_jeu.cases_reachable(x,y);
    }
    for(let i=0 ; i<cases_reachable.length ; i++){
        tr[cases_reachable[i].x][cases_reachable[i].y].classList.replace('black','dark_green');
        tr[cases_reachable[i].x][cases_reachable[i].y].classList.replace('white','light_green');
        tr[cases_reachable[i].x][cases_reachable[i].y].classList.add('dropzone');
    }
    return cases_reachable;
}
var hide_case = function (target) {
    target.classList.replace("active_black","not_active");
    target.classList.replace("active_white","not_active");
    var x = target.parentNode.sectionRowIndex;
    var y = target.cellIndex;

    var cases_reachable = [];
    if(couleur === 0){
        cases_reachable = plateau_de_jeu.cases_reachable(7-x,7-y);
    }else{
        cases_reachable = plateau_de_jeu.cases_reachable(x,y);
    }
    if(cases_reachable !== null) {
        for (let i = 0; i < cases_reachable.length; i++) {
            tr[cases_reachable[i].x][cases_reachable[i].y].classList.replace('dark_green', 'black');
            tr[cases_reachable[i].x][cases_reachable[i].y].classList.replace('light_green', 'white');
            tr[cases_reachable[i].x][cases_reachable[i].y].classList.remove('dropzone');
        }
    }
}
var move_piece = function(tr_depart,tr_arrive){
    var x_start = tr_depart.parentNode.sectionRowIndex;
    var y_start = tr_depart.cellIndex;
    var x_final = tr_arrive.parentNode.sectionRowIndex;
    var y_final = tr_arrive.cellIndex;
    var return_code;

    if(couleur === 0){
        if(((x_final===7 && plateau_de_jeu.tab_cases[7-x_final][7-x_final].piece.couleur===0)
            || (x_final===0 && plateau_de_jeu.tab_cases[7-x_final][7-x_final].piece.couleur===1))
            && plateau_de_jeu.tab_cases[7-x_start][7-y_start].piece.code === 0){
            choose_piece(tr_depart,tr_arrive,7-x_start,7-y_start,7-x_final,7-y_final);
            return false;
        }
        return_code = plateau_de_jeu.bouger_Piece(7-x_start, 7-y_start, 7-x_final, 7-y_final);
    }else {
        if((x_start===7 && plateau_de_jeu.tab_cases[x_start][y_start].piece.couleur===0)
            || (x_final===0 && plateau_de_jeu.tab_cases[x_start][y_start].piece.couleur===0)
            && plateau_de_jeu.tab_cases[7-x_start][7-y_start].piece.code === 0){
            choose_piece(tr_depart,tr_arrive,x_start,y_start,x_final,y_final);
            return false;
        }
        return_code = plateau_de_jeu.bouger_Piece(x_start, y_start, x_final, y_final);
    }
    if(return_code>=0){
        hide_checker();
        tr_arrive.removeChild(tr_arrive.lastElementChild);
        tr_arrive.appendChild(tr_depart.lastElementChild);
        tr_depart.innerHTML= "<img class='hide'  draggable='true' ondragstart='event.dataTransfer.setData(\"text/plain\",null)'>";
        if(return_code === 2 || return_code === 3){
            highlight_checker();
        }
        if(plateau_de_jeu.jeu_fini===1){
            state_of_game.innerText = "Échec et mat";
        }else if(plateau_de_jeu.jeu_fini ===2){
            state_of_game.innerText = "Égalité";
        }
    }else if(return_code === -2){
        state_of_game.innerText = "C'est pas ton tour !";
    }
}
var choose_piece = function (tr_depart,tr_arrive, x_start, y_start, x_final, y_final){
    tr_arrive.appendChild(choix_piece);
    var new_plateau = plateau.cloneNode(true);
    document.getElementById("container").replaceChild(new_plateau, plateau);
    choix_piece = document.getElementById("choix_piece");

    choix_piece.addEventListener('click', function (e){
        if(e.target.nodeName === "IMG"){
            document.getElementById("container").replaceChild(plateau, new_plateau);
            choix_piece = document.getElementById("choix_piece");
            choix_piece.parentNode.removeChild(choix_piece);

            tr_depart.lastElementChild.src = e.target.src;
            var return_code = plateau_de_jeu.bouger_Piece(x_start, y_start, x_final, y_final, parseInt(e.target.classList[0]));

            if(return_code>=0){
                hide_checker();
                tr_arrive.removeChild(tr_arrive.lastElementChild);
                tr_arrive.appendChild(tr_depart.lastElementChild);
                tr_depart.innerHTML= "<img class='hide'  draggable='true' ondragstart='event.dataTransfer.setData(\"text/plain\",null)'>";
                if(return_code === 2 || return_code === 3){
                    highlight_checker();
                }
                if(plateau_de_jeu.jeu_fini===1){
                    state_of_game.innerText = "Échec et mat";
                }else if(plateau_de_jeu.jeu_fini ===2){
                    state_of_game.innerText = "Égalité";
                }
            }else if(return_code === -2){
                state_of_game.innerText = "C'est pas ton tour !";
            }else{
                console.log("erreur");
            }
        }
    });
}
var click_plateau = function (e){
    var target;
    if(e.target.nodeName === 'IMG'){
        target = e.target.parentNode;
    }else if(e.target.nodeName === 'TD'){
        target = e.target;
    }else{
        console.log("error target not recongnized");
        return false;
    }

    if(precedent_target === null){
        precedent_target = target;
        show_case(target);
        onFocus = true;
    }else if(precedent_target !== target){
        if(target.classList.contains("dropzone")){
            hide_case(precedent_target);
            move_piece(precedent_target,target);
            precedent_target = null;
        }else{
            hide_case(precedent_target);
            show_case(target);
            precedent_target = target;
            onFocus = true;
        }
    }else if(precedent_target === target){
        if(onFocus){
            hide_case(target);
            onFocus = false;
        }else{
            show_case(target);
            onFocus = true;
        }
    }else{
        onFocus = true;
    }
}
var drag_event_setup = function(){
    //:: DRAGEVENTS ::
    var x_drag;
    var y_drag;
    var dragged;
    var dragged_parent;
    var cases_reachable;
    plateau.addEventListener("drag", function( e ) {
    }, false);
    plateau.addEventListener("dragstart", function( e ) {
        dragged = e.target;
        dragged_parent = e.target.parentNode;
        if(dragged.nodeName !== "IMG" || dragged.src === ""){
            e.preventDefault();
            return false;
        }
        x_drag = dragged.parentNode.parentNode.sectionRowIndex;
        y_drag = dragged.parentNode.cellIndex;
        if(precedent_target !== null){
            hide_case(precedent_target);
        }
        cases_reachable = show_case(dragged.parentNode);
    }, false);
    plateau.addEventListener("dragend", function( e ) {
        hide_case(dragged_parent);
        for (let i = 0; i < cases_reachable.length; i++) {
            tr[cases_reachable[i].x][cases_reachable[i].y].classList.replace('dark_green', 'black');
            tr[cases_reachable[i].x][cases_reachable[i].y].classList.replace('light_green', 'white');
            tr[cases_reachable[i].x][cases_reachable[i].y].classList.remove('dropzone');
        }
    }, false);
    plateau.addEventListener("dragover", function( e ) {
        e.preventDefault();
        var target;
        if(e.target.tagName === 'IMG'){
            target = e.target.parentNode;
        }else if(e.target.tagName === 'TD'){
            target = e.target;
        }else{
            console.log("error target dragenter not valid");
            return false;
        }
        if (target.classList.contains("dropzone")) {
            target.classList.replace('dark_green', 'dark_yellow');
            target.classList.replace('light_green', 'light_yellow');
        }
    }, false);
    plateau.addEventListener("dragenter", function( e ) {
        var target;
        if(e.target.tagName === 'IMG'){
            target = e.target.parentNode;
        }else if(e.target.tagName === 'TD'){
            target = e.target;
        }else{
            console.log("error target dragenter not valid");
            return false;
        }
        if (target.classList.contains("dropzone")) {
            target.classList.replace('dark_green', 'dark_yellow');
            target.classList.replace('light_green', 'light_yellow');
        }
    }, false);
    plateau.addEventListener("dragleave", function( e ) {
        var target;
        if(e.target.tagName === 'IMG'){
            target = e.target.parentNode;
        }else if(e.target.tagName === 'TD'){
            target = e.target;
        }else{
            console.log("error target dragenter not valid");
            return false;
        }
        if (target.classList.contains("dropzone")) {
            target.classList.replace('dark_yellow', 'dark_green');
            target.classList.replace('light_yellow', 'light_green');
        }
    }, false);
    plateau.addEventListener("drop", function( e ) {
        e.preventDefault();
        var target;
        if(e.target.tagName === 'IMG'){
            target = e.target.parentNode;
        }else if(e.target.tagName === 'TD'){
            target = e.target;
        }else{
            console.log("error target dragenter not valid");
            return false;
        }
        if (target.classList.contains("dropzone")) {
            move_piece(dragged_parent,target)

            target.classList.replace('dark_yellow', 'dark_green');
            target.classList.replace('light_yellow', 'light_green');
        }
    }, false);
}
window.onload = function (){
    choix_piece = document.getElementById("choix_piece");
    choix_piece.parentNode.removeChild(choix_piece);
    state_of_game = document.getElementById("state_of_game");
    plateau_de_jeu = new Plateau();
    plateau_de_jeu.init();
    couleur = 1;

    plateau = document.getElementById("plateau");
    var tbody = plateau.lastElementChild.children;

    tr = [];
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
    plateau.addEventListener('click',(e) => this.click_plateau(e), false);

    this.drag_event_setup();
}
function Plateau(){
    this.last_checker=[];
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
        this.roi_noir = new Roi(1, this.tab_cases[7][3]);
        this.tab_cases[7][3].piece = this.roi_noir;
        this.tab_cases[7][4].piece = new Reine(1, this.tab_cases[7][4]);
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
    /* x,y : position de la pièce à déplacer
    * a,b : position où déplacer la pièce
    *  -3 = pas de pièce à bouger
    * -2 = pas le tour de la personne
    * -1 = move demandé impossible pour la piece
    *  0 = move made
    *  1 = move made and killed a piece
    *  2 = move made and check
    *  3 = move made and check and killed a piece*/
    this.bouger_Piece = function (x, y, a, b, piece_code){
        if(x<0 || x>=8 || y<0 || y>=8 || a<0 || a>=8 || b<0 || b>=8){
            console.log("out of bound");
            return false;
        }
        var return_code = -1;
        if(this.tab_cases[x][y].piece !== null){ // y'a t'il une piece à déplacer ?
            if(this.tab_cases[x][y].piece.couleur === this.couleur){//est-ce au tour de la piece de bouger ?
                var cases = this.tab_cases[x][y].piece.cases_visitables;//quels coups lui sont autorisé
                for(let i=0 ; i<cases.length ; i++){
                    if(cases[i] === this.tab_cases[a][b]){//c'est bon la cases est valable
                        if(this.tab_cases[a][b].piece === null){//personne à manger, déplacement simple
                            return_code = 0;
                        }else{//quelqu'un va se faire manger
                            return_code = 1;
                        }
                        if(((a===7 && this.couleur===0) || (a===0 && this.couleur===1)) && this.tab_cases[x][y].piece.code===0){
                            console.log("promotion");
                            if(piece_code === 1){//Tour
                                this.tab_cases[x][y].piece = new Tour(this.couleur,this.tab_cases[x][y]);
                            }else if(piece_code ===2){//Cavalier
                                this.tab_cases[x][y].piece = new Cavalier(this.couleur,this.tab_cases[x][y]);
                            }else if(piece_code===3){//Fou
                                this.tab_cases[x][y].piece = new Fou(this.couleur,this.tab_cases[x][y]);
                            }else if(piece_code===4){//Reine
                                this.tab_cases[x][y].piece = new Reine(this.couleur,this.tab_cases[x][y]);
                            }
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
                            if(return_code === 1){//quelqu'un a été mangé et on a mis l'ennemi en echec
                                return_code = 3;
                            }else{//juste mise en echec de l'ennemi
                                return_code = 2;
                            }
                        }else{
                            this.plateau_en_echec = false;
                        }
                        this.nouveau_coup();
                    }
                }
            }else{
                //pas ton tour
                return_code = -2;
            }
        }else{
            //pas de pièce à bouger sur la case de départ
            return_code = -3;
        }
        return return_code;
    }
    this.nouveau_coup= function (){
        var pas_de_coup_dispo = true;
        for(let i=0 ; i<8 ; i++){
            for(let j=0 ; j<8 ; j++){
                if(this.tab_cases[i][j].piece !== null){
                    if(this.tab_cases[i][j].piece.couleur === this.couleur){
                        var cases_visitables = this.tab_cases[i][j].piece.cases_reachable(this.tab_cases);
                        for(let k=0 ; k<cases_visitables.length ; k++){
                            var old_piece = cases_visitables[k].piece;
                            cases_visitables[k].piece = this.tab_cases[i][j].piece
                            //added
                            cases_visitables[k].piece.la_case = cases_visitables[k];
                            this.tab_cases[i][j].piece = null;
                            if(this.estEnEchec()){
                                this.tab_cases[i][j].piece = cases_visitables[k].piece;
                                cases_visitables[k].piece = old_piece;
                                //added
                                this.tab_cases[i][j].piece.la_case = this.tab_cases[i][j];
                                cases_visitables.splice(k, 1);
                                k--;
                            }else{
                                this.tab_cases[i][j].piece = cases_visitables[k].piece;
                                cases_visitables[k].piece = old_piece;
                                //added
                                this.tab_cases[i][j].piece.la_case = this.tab_cases[i][j];
                            }
                        }
                        this.tab_cases[i][j].piece.cases_visitables = cases_visitables;
                        if(cases_visitables.length>0){
                            pas_de_coup_dispo = false;
                        }
                    }else{
                        this.tab_cases[i][j].piece.cases_visitables = [];
                    }
                }
            }
        }
        if(pas_de_coup_dispo){
            if(this.plateau_en_echec){
                this.jeu_fini = 1;
            }else{
                console.log("pat");
                this.jeu_fini = 2;
            }
        }
    }
    this.check_roque = function () {
        if (!this.plateau_en_echec) {
            if (this.couleur === 0) {
                if (!this.roi_blanc.hasMoved) {
                    for (let i = 0; i < this.roi_blanc.cases_visitables; i++) {
                        if (this.tab_cases[0][2] === this.roi_blanc.cases_visitables[i]) {
                            if (this.tab_cases[0][0].piece !== null) {
                                if (this.tab_cases[0][0].piece.code === 1 && !this.tab_cases[0][0].piece.hasMoved) {
                                    if (this.tab_cases[0][1].piece === null && this.tab_cases[0][2].piece === null) {
                                        this.roi_blanc.cases_visitables.push(this.tab_cases[0][1]);
                                    }
                                }
                            }
                        }
                        if (this.tab_cases[0][4] === this.roi_blanc.cases_visitables[i]) {
                            if (this.tab_cases[0][7].piece !== null) {
                                if (this.tab_cases[0][7].piece.code === 1 && !this.tab_cases[0][7].piece.hasMoved) {
                                    if (this.tab_cases[0][6].piece === null && this.tab_cases[0][5].piece === null && this.tab_cases[0][4].piece === null) {
                                        this.roi_blanc.cases_visitables.push(this.tab_cases[0][5]);
                                    }
                                }
                            }
                        }
                    }
                }
            }else if (this.couleur === 1) {
                if (!this.roi_noir.hasMoved) {
                    for (let i = 0; i < this.roi_noir.cases_visitables; i++) {
                        if (this.tab_cases[7][2] === this.roi_noir.cases_visitables[i]) {
                            if (this.tab_cases[7][0].piece !== null) {
                                if (this.tab_cases[7][0].piece.code === 1 && !this.tab_cases[7][0].piece.hasMoved) {
                                    if (this.tab_cases[7][1].piece === null && this.tab_cases[7][2].piece === null) {
                                        this.roi_noir.cases_visitables.push(this.tab_cases[7][1]);
                                    }
                                }
                            }
                        }
                        if (this.tab_cases[7][4] === this.roi_noir.cases_visitables[i]) {
                            if (this.tab_cases[7][7].piece !== null) {
                                if (this.tab_cases[7][7].piece.code === 1 && !this.tab_cases[7][7].piece.hasMoved) {
                                    if (this.tab_cases[7][6].piece === null && this.tab_cases[7][5].piece === null && this.tab_cases[7][4].piece === null) {
                                        this.roi_noir.cases_visitables.push(this.tab_cases[7][5]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    this.estEnEchec = function (){
        return this.get_checker(this.couleur).length > 0;
    }
    this.get_checker = function (couleur){
        var checkers = [];
        for(let i=0 ; i<8 ; i++){
            for(let j=0 ; j<8 ; j++){
                if(this.tab_cases[i][j].piece !== null){
                    if(this.tab_cases[i][j].piece.couleur !== this.couleur){
                        var cases_reachable = this.tab_cases[i][j].piece.cases_reachable(this.tab_cases);
                        for(let k=0 ; k<cases_reachable.length ; k++){
                            if(couleur === 0){
                                if(cases_reachable[k] === this.roi_blanc.la_case){
                                    checkers.push([i,j]);
                                }
                            }else{
                                if(cases_reachable[k] === this.roi_noir.la_case){
                                    checkers.push([i,j]);
                                }
                            }
                        }
                    }
                }
            }
        }
        return checkers;
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
                    break;
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
                    break;
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
                    break;
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
                    break;
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
                    break;
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
                    break;
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
                    break;
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
                    break;
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
                    break;
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
                    break;
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
                    break;
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
                    break;
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
                    break;
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
                    break;
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
                    break;
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
                    break;
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
            if(x-1>=0){
                if(tab_cases[x-1][y].piece===null){
                    cases_reachable.push(tab_cases[x-1][y]);
                    if(!this.hasMoved){
                        if(x-2>=0){
                            if(tab_cases[x-2][y].piece === null){
                                cases_reachable.push(tab_cases[x-2][y]);
                            }
                        }
                    }
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
            if(x+1<8){
                if(tab_cases[x+1][y].piece===null){
                    cases_reachable.push(tab_cases[x+1][y]);
                    if(!this.hasMoved){
                        if(x+2<8){
                            if(tab_cases[x+2][y].piece === null){
                                cases_reachable.push(tab_cases[x+2][y]);
                            }
                        }
                    }
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