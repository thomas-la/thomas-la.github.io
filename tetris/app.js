document.addEventListener('DOMContentLoaded', () => {
    const width = 10
    const height = 20    
    const grid = document.querySelector('.grid')
    for (let i = 0; i < width*height; i++) {
        grid.append(document.createElement('div'))
    }
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const spanScore = document.querySelector('#score')
    const startButton = document.querySelector('#start-button')

    // https://strategywiki.org/wiki/File:Tetris_rotation_super.png
    const iTetro = [
        [  // rotation 0
            [0,0,0,0],
            [1,1,1,1],
            [0,0,0,0],
            [0,0,0,0],
        ],
        [  // rotation 1
            [0,0,1,0],
            [0,0,1,0],
            [0,0,1,0],
            [0,0,1,0],
        ],
        [  // rotation 2
            [0,0,0,0],
            [0,0,0,0],
            [1,1,1,1],
            [0,0,0,0],
        ],
        [  // rotation 3
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0],
        ],
    ]
    const jTetro = [
        [  // rotation 0
            [1,0,0],
            [1,1,1],
            [0,0,0],
        ],
        [  // rotation 1
            [0,1,1],
            [0,1,0],
            [0,1,0],
        ],
        [  // rotation 2
            [0,0,0],
            [1,1,1],
            [0,0,1],
        ],
        [  // rotation 3
            [0,1,0],
            [0,1,0],
            [1,1,0],
        ],
    ]
    const lTetro = [
        [  // rotation 0
            [0,0,1],
            [1,1,1],
            [0,0,0],
        ],
        [  // rotation 1
            [0,1,0],
            [0,1,0],
            [0,1,1],
        ],
        [  // rotation 2
            [0,0,0],
            [1,1,1],
            [1,0,0],
        ],
        [  // rotation 3
            [1,1,0],
            [0,1,0],
            [0,1,0],
        ],
    ]
    const oTetro = [
        [  // rotation 0
            [0,1,1,0],
            [0,1,1,0],
            [0,0,0,0],
        ],
        [  // rotation 1
            [0,1,1,0],
            [0,1,1,0],
            [0,0,0,0],
        ],
        [  // rotation 2
            [0,1,1,0],
            [0,1,1,0],
            [0,0,0,0],
        ],
        [  // rotation 3
            [0,1,1,0],
            [0,1,1,0],
            [0,0,0,0],
        ],
    ]
    const sTetro = [
        [  // rotation 0
            [0,1,1],
            [1,1,0],
            [0,0,0],
        ],
        [  // rotation 1
            [0,1,0],
            [0,1,1],
            [0,0,1],
        ],
        [  // rotation 2
            [0,0,0],
            [0,1,1],
            [1,1,0],
        ],
        [  // rotation 3
            [1,0,0],
            [1,1,0],
            [0,1,0],
        ],
    ]
    const tTetro = [
        [  // rotation 0
            [0,1,0],
            [1,1,1],
            [0,0,0],
        ],
        [  // rotation 1
            [0,1,0],
            [0,1,1],
            [0,1,0],
        ],
        [  // rotation 2
            [0,0,0],
            [1,1,1],
            [0,1,0],
        ],
        [  // rotation 3
            [0,1,0],
            [1,1,0],
            [0,1,0],
        ],
    ]
    const zTetro = [
        [  // rotation 0
            [1,1,0],
            [0,1,1],
            [0,0,0],
        ],
        [  // rotation 1
            [0,0,1],
            [0,1,1],
            [0,1,0],
        ],
        [  // rotation 2
            [0,0,0],
            [1,1,0],
            [0,1,1],
        ],
        [  // rotation 3
            [0,1,0],
            [1,1,0],
            [1,0,0],
        ],
    ]
    const tetros = [iTetro, jTetro, lTetro, oTetro, sTetro, tTetro, zTetro]

    function draw(x, y, tetromino) {
        for (let i = 0; i < tetromino.length; i++) {
            for (let j = 0; j < tetromino[0].length; j++) {
                if (tetromino[i][j] == 1) {
                    squares[(y+i)*width + x+j].classList.add('tetromino')
                }
            }
        }
    }

    function undraw(x, y, tetromino) {
        for (let i = 0; i < tetromino.length; i++) {
            for (let j = 0; j < tetromino[0].length; j++) {
                if (tetromino[i][j] == 1) {
                    squares[(y+i)*width + x+j].classList.remove('tetromino')
                }
            }
        }
    }

    function isSquareColliding(x, y) {
        if (x < 0 || x >= width || y < 0 || y >= height) return true
        return squares[y*width+x].classList.contains('tetromino')
    }

    function isTetrominoColliding(x, y, tetromino) {
        for (let i = 0; i < tetromino.length; i++) {
            for (let j = 0; j < tetromino[0].length; j++) {
                if (tetromino[i][j] == 1) {
                    if (isSquareColliding(x+j, y+i)) return true
                }
            }
        }

        return false;
        
    }

    function tick() {
        moveDown()
    }

    function moveLeft() {
        undraw(x, y, tetros[t][r])
        x--
        if (isTetrominoColliding(x, y, tetros[t][r])) x++
        draw(x, y, tetros[t][r])
    }

    function moveRight() {
        undraw(x, y, tetros[t][r])
        x++
        if (isTetrominoColliding(x, y, tetros[t][r])) x--
        draw(x, y, tetros[t][r])
    }

    function moveDown() {
        undraw(x, y, tetros[t][r])
        y++
        if (isTetrominoColliding(x, y, tetros[t][r])) {
            y--;
            draw(x, y, tetros[t][r])
            // next tetromino
            x = 0
            y = 0
            r = 0
            t = (t+1) % tetros.length
            if (isTetrominoColliding(x, y, tetros[t][r])) {
                // game over
                alert('Game over!')
                clearInterval(timer);
                return
            }
        }
        draw(x, y, tetros[t][r])
    }

    document.addEventListener('keypress', e => {
        if (e.key === 'w') {
            // place down
        }
        if (e.key === 'a') {
            moveLeft()
        }
        if (e.key === 's') {
            moveDown()
        }
        if (e.key === 'd') {
            moveRight()
        }
        if (e.key === 'q') {
            // rotate left
        }
        if (e.key === 'e') {
            // rotate right
        }
    })

    let timer = setInterval(tick, 500)
    let x = 0
    let y = 0
    let r = 0
    let t = 5

    draw(x, y, tetros[t][r])

})