$(function () {

    let grille = $("#grille");
    let btn = $("#new_game_btn");
    let again_btn = $("#try_again_btn");
    let dim_input = $("#dimension");
    let tiles = [];
    let pos=[];
    let moveScore = 0;
    let score = 0;
    let moves = 0;
    let win = false;
    let play = true;
    let width;
    let font;

    // prevents arrow keys from scrolling the page
    window.addEventListener("keydown", function (e) {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);


    init();

    btn.click(function () {
        restart();
    });
    again_btn.click(function () {
        restart();
    });

    $("body").keyup(function (e) {
        if(play){
            if (e.keyCode == 37) {
                if (lateral()) {
                    slideLeft();
                    if(!move()) gameLost();
                }
            }
            else if (e.keyCode == 38) {
                if (vertical()) {
                    slideUp();
                    if(!move()) gameLost();
                }
            }
            else if (e.keyCode == 39) {
                if (lateral()) {
                    slideRight();
                    if(!move()) gameLost();
                }
            }
            else if (e.keyCode == 40) {
                if (vertical()) {
                    slideDown();
                    if(!move()) gameLost();
                }
            }
        }
    });

    //slides the tiles left row by row
    function slideLeft() {
        var bol = false;
        for (let j = 0; j < tiles.length; j++) {
            let row = tiles[j];
            let m = 0; //merging point 
            for (let i = 1; i < row.length; i++) {
                //if current cell is not a zero
                if (row[i] != 0) {
                    //while the cell on the left is a zero
                    //move current cell to the left
                    var mer= false;
                    var tile= get_id(j,i);
                    while (row[i - 1] == 0) {
                        row[i - 1] = row[i];
                        row[i] = 0;
                        bol = true;
                        i--;
                    }
                    //if we are at a merging point
                    if (i - 1 == m) {
                        //if a merge is possible
                        if (row[i] == row[i - 1]) {
                            row[i - 1] += row[i];
                            row[i] = 0;
                            var num = row[i-1];
                            moveScore += num;
                            scoreAnimation(moveScore);
                            bol = true;
                            mer = true;                            
                            i--;
                        }
                        m++; //increase merging point regardless
                    }
                    moveTile(j,i,tile);
                    if(mer) setTimeout(merge,105,j,i,num,tile);
                    else set_id(j,i,tile);
                }
            }
        }
        updateGame(bol); //bol is true if a cell has moved
    }

    //slides the tiles right row by row
    function slideRight() {
        var bol = false;
        for (let j = 0; j < tiles.length; j++) {
            let row = tiles[j];
            let m = row.length - 1; //merging point
            for (let i = row.length - 2; i >= 0; i--) {
                //if current cell is not a zero
                if (row[i] != 0) {
                    var mer= false;
                    var tile= get_id(j,i);
                    //while the cell on the right is a zero
                    //move current cell to the right
                    while (row[i + 1] == 0) {
                        row[i + 1] = row[i];
                        row[i] = 0;
                        i++;
                        bol = true;
                    }
                    //if we are at a merging point 
                    if (i + 1 == m) {
                        //merge if possible
                        if (row[i] == row[i + 1]) {
                            row[i + 1] += row[i];
                            row[i] = 0;
                            var num =row[i+1];
                            moveScore += num;
                            scoreAnimation(moveScore);
                            bol = true;
                            mer=true;
                            i++;
                        }
                        m--; //decrease merging point regardless
                    }
                    moveTile(j,i,tile);
                    if(mer) setTimeout(merge,105,j,i,num,tile);
                    else set_id(j,i,tile);
                }
            }
        }
        updateGame(bol);
    }

    //slides the tiles down culumn by column
    function slideDown() {
        var bol = false;
        for (let j = 0; j < tiles.length; j++) {
            var m = tiles.length - 1; //merging point
            for (let i = tiles.length - 2; i >= 0; i--) {
                //if we have a cell that is not a zero
                if (tiles[i][j] != 0) {
                    var mer=false;
                    var tile= get_id(i,j);
                    //while we are in bound and there is a zero below 
                    //the current cell we move the cell down
                    while (i + 1 < tiles.length && tiles[i + 1][j] == 0) {
                        tiles[i + 1][j] = tiles[i][j];
                        tiles[i][j] = 0;
                        bol = true;
                        i++;
                    }
                    //if we are at a merging point
                    if (i + 1 == m) {
                       //if cell above has the same value as current cell merge
                        if (tiles[i][j] == tiles[i + 1][j]) {
                            tiles[i + 1][j] += tiles[i][j];
                            tiles[i][j] = 0;
                            var num =tiles[i+1][j];
                            moveScore += num;
                            bol = true;
                            mer=true;
                            scoreAnimation(moveScore);
                            i++;
                        }
                        m--; //decrease merging point regardless
                    }
                    moveTile(i,j,tile);
                    if(mer) setTimeout(merge,105,i,j,num,tile);
                    else set_id(i,j,tile);
                
                }
            }
        }
        updateGame(bol);
    }

    //slides the tiles up culumn by column
    function slideUp() {
        var bol = false;
        for (let j = 0; j < tiles.length; j++) {
            var m = 0; //merging point
            for (let i = 1; i <tiles.length; i++) {
                //if we have a cell that is not a zero
                if (tiles[i][j] != 0) {
                    var mer= false;
                    var tile= get_id(i,j);
                    //while we are in bound and there is a zero below 
                    //the current cell we move the cell down
                    while (i - 1 >=0 && tiles[i - 1][j] == 0) {
                        tiles[i - 1][j] = tiles[i][j];
                        tiles[i][j] = 0;
                        bol = true;
                        i--;
                    }
                    //if we are at a merging point
                    if (i - 1 == m) {
                       //if cell above has the same value as current cell merge
                        if (tiles[i][j] == tiles[i - 1][j]) {
                            tiles[i - 1][j] += tiles[i][j];
                            tiles[i][j] = 0;
                            var num = tiles[i-1][j];
                            moveScore += num;
                            bol = true;
                            mer=true;
                            scoreAnimation(moveScore);
                            i--;
                        }
                        m++; //decrease merging point regardless
                    }
                    moveTile(i,j,tile);
                    if(mer) setTimeout(merge,105,i,j,num,tile);
                    else set_id(i,j,tile);
                }
            }
        }
        updateGame(bol);
    }

    //returns if there is a move to be made
    function move() {
        return lateral() || vertical();
    }

    //returns if a lateral move is possible
    function lateral() {
        for (var i = 0; i < tiles.length; i++) {
            for (var j = 0; j < tiles.length; j++) {
                if (tiles[i][j] != 0) {
                    if (j - 1 >= 0 && tiles[i][j] == tiles[i][j - 1] ||
                        j - 1 >= 0 && tiles[i][j - 1] == 0 ||
                        j + 1 < tiles.length && tiles[i][j + 1] == 0 ||
                        j + 1 < tiles.length && tiles[i][j] == tiles[i][j + 1]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    //returns if a vertical move is possible
    function vertical() {
        for (var j = 0; j < tiles.length; j++) {
            for (var i = 0; i < tiles.length; i++) {
                if (tiles[i][j] != 0) {
                    if (i - 1 >= 0 && tiles[i][j] == tiles[i - 1][j] ||
                        i - 1 >= 0 && tiles[i - 1][j] == 0 ||
                        i + 1 < tiles.length && tiles[i + 1][j] == 0 ||
                        i + 1 < tiles.length && tiles[i][j] == tiles[i + 1][j]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    //returns a cell given its indices i and j
    function get_id(i, j) {
        return $("#" + "" + i + "-" + j);
    }
    //sets new id given indices and a tile
    function set_id(i,j,tile){
        tile.attr("id", "" + i + "-" + j);
    }

    //Method to create grid with given size N
    function init() {
        var n = parseInt(dim_input.val(), 10); //set n as the input value
        if( !validate_dim(n)) return;
        grille.empty();
        $('div.tile').remove();
        tiles = new Array(n);

        for (var i = 0; i < n; i++) {
            tiles[i] = new Array(n).fill(0);
            for (var j = 0; j < n; j++) {
                //this part creates grid cells and displays them as nxn grid
                let cell = $('<div></div>');
                cell.attr("id", "" + n + "-" + n); 
                cell.attr("class", "cell");
                grille.append(cell);
                grille.css('grid-template-columns', 'repeat(' + n + ', 1fr)');
                grille.css('grid-template-rows', 'repeat(' + n + ', 1fr)');

                //adding styles for different grid sizes
                if (n <= 5) {
                    font=48;
                    grille.css('gap', 16 + "px");
                    grille.css('width', '500px');
                    grille.css('height', '500px');
                }
                else if (n >= 12) {
                    font=24;
                    grille.css('gap', 8 + "px");
                    grille.css('width', '600px');
                    grille.css('height', '600px');
                }
                else {
                    font=32;
                    grille.css('width', '550px');
                    grille.css('height', '550px');
                    grille.css('gap', 16 + "px");
                }
                cell.css('line-height', cell.height() + "px");
            }
        }
        $('#grille_container').css({ 'width': grille.width(), 
                                     'height': grille.height() });

        width=get_id(n,n).width();
        createPos(n);
        randomTiles(2);
    }

    //creates the positions' array
    function createPos(n){
        for(let i=0; i<n;i++){
            if(n < 12) pos[i]= i*width-1 +(i+1)*16;
            if(n >= 12) pos[i]= i*width+7 +(i+1)*8;
        }
        console.log("tab:",pos);
    }

    // updates cell number given a cell and a number
    function createTile(i,j, num) {
        if (num > 0) {
            let tile = $('<div></div>');
            set_id(i,j,tile); 
            set_tile(i,j,num,tile);
        }
    }

    //sets the tile number and position
    function set_tile(i,j,num,tile){
        tile.text(""+num);
        tiles[i][j]=num;
        if (num > 2048) {
            tile.attr("class", "tile c4096");
        }
        else {
            tile.attr("class", "tile c" + num);
        }
        tile.css({'--x': pos[i]+'px'});
        tile.css({'--y': pos[j]+'px'});
        tile.css('font-size', font + "px");
        tile.css('line-height', width + "px");
        tile.css({ 'width': width, 
        'height': width });
        $('#grille_container').append(tile);
    

        if(num==2048 && !win){
            play=false;
            win= true; 
            setTimeout(gameWon,1000);  
        }
    }

    //moves tile to a new position 
    function moveTile(i,j,tile){
        tile.css({'--x': pos[i]+'px'});
        tile.css({'--y': pos[j]+'px'});
    }

    //merges tiles together and removes one of them
    function merge(i,j,num,tile){
        tile.remove();
        set_tile(i,j,num,get_id(i,j));
        zoom(get_id(i,j));
    }

    //animation to zoom tile when merged
    function zoom(tile) {
        tile.css({ "animation": "zoom 0.2s" });
    }

    //creates n random cells given an n
    function randomTiles(n) {
        var bol = true;
        for (var k = 0; k < n; k++) {
            var r = Math.random() < 0.6 ? 2 : 4;
            while (bol) {
                //randomly choosing i and j  
                var i = Math.floor(Math.random() * tiles.length);
                var j = Math.floor(Math.random() * tiles.length);
                if (tiles[i][j] == 0) {
                    createTile(i,j,r);
                    bol = false;
                }
            }
            bol = true;
        }
    }

    //adds a move
    function addMove() {
        moves += 1;
        $('#moves').text(moves);
    }

    //adds score 
    function addScore() {
        score += moveScore;
        moveScore = 0;
        $('#score').text(score);
    }

    //creats a score animation of the number of points created by a move
    function scoreAnimation(num) {
        $('#score_animation').css('color', '#4b3f1181')
        if (num != 0) {
            $('#score_animation').text('+' + num)
        }
        $('#score_animation').addClass('evaporate');
        setTimeout(() => {
            $('#score_animation').removeClass('evaporate')
            $('#score_animation').css('color', '#00000000')
        }, 500);
    }

    //update game after a move
    function updateGame(bol) {
        if (bol) {
            addMove();
            addScore();
            randomTiles(1);
        }
    }
    
    //return if given number is in range of input
    function validate_dim(val) {
        var min = dim_input.attr('min');
        var max = dim_input.attr('max');
        if (val >= min && val <= max) {
            return true;
        }
    }

    // shows game over 
    function gameOver() {
        $('.tile').css({
            'opacity': '0.5',
            'z-index': '-1'
        })
        grille.css({
            'opacity': '0.5',
            'z-index': '-1'
        });
        $('#result_div').css({
            'display': 'flex',
            'top': grille.height() / 18 + '%'
        });
        $('#result_title').text('Game over!');
        $('#result_title').css({
            'font-size': '4em',
            'color': '#776e65'
        })
    }

    //show game won
    function gameWon() {
        $('.tile').css({
            'opacity': '0.5',
            'z-index': '-1'
        })
        $('#grille_container').css({
            'background-color': '#ebc634',
            'opacity': '0.8'
        })
        $('#result_div').css({
            'display': 'flex',
            'top': grille.height() / 18 + '%'
        });
        grille.css({
            'opacity': '0.7',
            'z-index': '-1'
        });

        $('#result_title').text('You win!');
        $('#result_title').css({
            'color': 'white',
            'font-size': '4em'
        })

    }

    //game lost
    function gameLost(){
        play=false;
        setTimeout(gameOver,1000);
    }

    //creates a new game
    function restart() {
        score = 0;
        $('#score').text(score);
        moves = 0;
        $('#moves').text(moves);

        $('#result_div').css('display', 'none');
        grille.css('opacity', '1');
        $('#grille_container').css('background-color', 'transparent');
        $('#grille_container').css('opacity', '1');

        play=true;
        win= false;
        init();
    }

});