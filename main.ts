import * as readline from 'readline';
import { rejects } from 'assert';

const read = readline.createInterface({
    input:  process.stdin,
    output: process.stdout
});

enum Player {
    x = "X",
    y = "Y"
};

export class Game {
    turn = Player.x;

    board = [
        null, null, null,
        null, null, null,
        null, null, null
    ];

    showBoard() {
        this.board.forEach( (itr, i) => {
            
            process.stdout.write( (itr? itr : " ") + " | ");
            if ((i+1)%3 == 0) { process.stdout.write("\n-------------\n") }
        });
    }

    isBoardFull(): boolean {
        for (let itr of this.board) {
            if (itr == null)
                return false;
        }
        return true;
    }

    checkWin(player: Player): boolean {
        let rows = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8]
        ];
        let columns = [
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8]
        ];
        let diagonals = [
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let itr of rows) {
            if ( this.board[ itr[0] ] == player &&
                 this.board[ itr[1] ] == player &&
                 this.board[ itr[2] ] == player
               ) { return true}
            }
            
        for (let itr of columns) {
            if ( this.board[ itr[0] ] == player &&
                 this.board[ itr[1] ] == player &&
                 this.board[ itr[2] ] == player
               ) { return true}       
            }

        for (let itr of diagonals) {
            if ( this.board[ itr[0] ] == player &&
                 this.board[ itr[1] ] == player &&
                 this.board[ itr[2] ] == player
               ) { return true}
            }
        // else
        return false;        
    }

    async runTick(): Promise<Player> { 
        for await (const answer of read) {
            console.clear();

            if (this.isBoardFull() == false) {
                if (answer.length != 2) {
                    console.log("invalid answer\n");
                    game.showBoard();
                    continue;
                }

                let point: [number, number] = [+answer[0], +answer[1]];         
                this.update(this.turn, point);    
                this.showBoard();

                if (game.checkWin(Player.x))
                    return Player.x
    
                else if ( game.checkWin(Player.y))
                    return Player.y
                
                    else if ( !game.checkWin(Player.x) && 
                              !game.checkWin(Player.y) &&  
                              this.isBoardFull()  
                            )
                    throw "Draw"
            } 
        }
    }

    update(player: Player, point: [number, number]) {  
        if ( this.board[ (point[1] * 3) + point[0] ] == null) {
        
            this.board[ (point[1] * 3) + point[0] ] = player;

            if (player == Player.x)
                this.turn = Player.y;
            else
                this.turn = Player.x;
        }
    }
}


let game = new Game();
game.showBoard();

game.runTick().then( winner => {

    console.log(`Player ${winner} won`);

}).catch( reason => {
    console.log(reason);
})

