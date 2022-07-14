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

    const SPAWN_X = 3
    const SPAWN_Y = 0

    let linesCleared = 0
    let x, y, r, t

    function spawnTetro() {
        x = SPAWN_X
        y = SPAWN_Y
        r = 0
        t = Math.floor(Math.random() * tetros.length)
    }

    function set(x, y) {
        squares[y*width + x].classList.add('tetromino')
    }

    function unset(x, y) {
        squares[y*width + x].classList.remove('tetromino')
    }

    function isSet(x, y) {
        return squares[y*width+x].classList.contains('tetromino')
    }

    function isSquareColliding(x, y) {
        if (x < 0 || x >= width || y < 0 || y >= height) return true
        return isSet(x, y)
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
    
    function draw(x, y, tetromino) {
        for (let i = 0; i < tetromino.length; i++) {
            for (let j = 0; j < tetromino[0].length; j++) {
                if (tetromino[i][j] == 1) {
                    set(x+j, y+i)
                }
            }
        }
    }

    function undraw(x, y, tetromino) {
        for (let i = 0; i < tetromino.length; i++) {
            for (let j = 0; j < tetromino[0].length; j++) {
                if (tetromino[i][j] == 1) {
                    unset(x+j, y+i)
                }
            }
        }
    }

    function removeLineAndCollapse(line) {
        for (let i = line; i >= 0; i--) {
            for (let j = 0; j < width; j++) {
                if (i != 0 && isSet(j, i-1)) {
                    set(j, i)
                } else {
                    unset(j, i)
                }
            }
        }
    }

    function tick() {
        moveDown()
    }

    function tryMove(action) {
        undraw(x, y, tetros[t][r])
        let oldX = x
        let oldY = y
        let oldT = t
        let oldR = r
        action()
        if (isTetrominoColliding(x, y, tetros[t][r])) {
            x = oldX
            y = oldY
            t = oldT
            r = oldR
        }
        draw(x, y, tetros[t][r])
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
            // check if line completed
            for (let i = 0; i < tetros[t][r].length && i+y < height; i++) {
                let filled = true
                for (let j = 0; j < width; j++) {
                    filled &= isSet(j, y+i)
                }
                if (filled) {
                    // shift blocks down
                    removeLineAndCollapse(y+i)
                    linesCleared++
                    spanScore.textContent = linesCleared
                }
            }

            // next tetromino
            x = SPAWN_X
            y = SPAWN_Y
            r = 0
            t = Math.floor(Math.random() * tetros.length)
            if (isTetrominoColliding(x, y, tetros[t][r])) {
                // game over
                alert('Game over!')
                clearInterval(timer);
                return
            }
        }
        draw(x, y, tetros[t][r])
    }

    function rotateLeft() {
        undraw(x, y, tetros[t][r])
        r = (r+tetros[t].length-1) % tetros[t].length
        if (isTetrominoColliding(x, y, tetros[t][r])) r++
        draw(x, y, tetros[t][r])
    }

    function rotateRight() {
        undraw(x, y, tetros[t][r])
        r = (r+1) % tetros[t].length
        if (isTetrominoColliding(x, y, tetros[t][r])) r--
        draw(x, y, tetros[t][r])
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'w' || e.key === 'ArrowUp') {
            // place down TODO
        }
        if (e.key === 'a' || e.key === 'ArrowLeft') {
            moveLeft()
            tryMove(() => x--)
        }
        if (e.key === 's' || e.key === 'ArrowDown') {
            tryMove(() => y++)
        }
        if (e.key === 'd' || e.key === 'ArrowRight') {
            tryMove(() => x++)
        }
        if (e.key === 'q') {
            tryMove(() => r = (r+tetros[t].length-1) % tetros[t].length)
        }
        if (e.key === 'e') {
            tryMove(() => r = (r+1) % tetros[t].length)
        }
    })

    let timer = setInterval(tick, 500)
    spawnTetro()
    draw(x, y, tetros[t][r])

})

// TODO
// refactor move??? maybe keep move Down?
// next block
// prettify