document.addEventListener('DOMContentLoaded', () => {
    const width = 10
    const height = 20
    const scoreNode = document.querySelector('#score')
    const nextTetroNode = document.querySelector('#next-tetro')
    for (let i = 0; i < 4*2; i++) {
        nextTetroNode.append(document.createElement('div'))
    }
    const grid = document.querySelector('#grid')
    for (let i = 0; i < width*height; i++) {
        grid.append(document.createElement('div'))
    }
    let squares = Array.from(document.querySelectorAll('#grid div'))

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
    const tetrosCol = ['cyan', 'blue', 'orange', 'yellow', 'lime', 'magenta', 'red']

    const SPAWN_X = 3
    const SPAWN_Y = 0

    let linesCleared = 0
    let x, y, r, t
    let nextTetro = Math.floor(Math.random() * tetros.length)

    function spawnTetro() {
        x = SPAWN_X
        y = SPAWN_Y
        r = 0
        t = nextTetro
        nextTetro = Math.floor(Math.random() * tetros.length)
    }

    function set(x, y, color) {
        squares[y*width + x].classList.add('tetromino')
        squares[y*width + x].style.backgroundColor = color
    }

    function unset(x, y) {
        squares[y*width + x].classList.remove('tetromino')
        squares[y*width + x].style.backgroundColor = 'transparent'
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
                    set(x+j, y+i, tetrosCol[t])
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

    function updateNextTetro() {
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 4 && j < tetros[nextTetro][0][0].length; j++) {
                if (tetros[nextTetro][0][i][j] == 1) {
                    //set()
                } else {
                    //unset()
                }
            }
        }
    }

    function removeLineAndCollapse(line) {
        for (let i = line; i >= 0; i--) {
            for (let j = 0; j < width; j++) {
                if (i != 0 && isSet(j, i-1)) {
                    let color = squares[(i-1)*width + j].style.backgroundColor
                    set(j, i, color)
                } else {
                    unset(j, i)
                }
            }
        }
    }

    function tick() {
        moveDown()
    }

    function moveLeft() {
        undraw(x, y, tetros[t][r])
        if (!isTetrominoColliding(x-1, y, tetros[t][r])) {
            x--
        }
        draw(x, y, tetros[t][r])
    }

    function moveRight() {
        undraw(x, y, tetros[t][r])
        if (!isTetrominoColliding(x+1, y, tetros[t][r])) {
            x++
        }
        draw(x, y, tetros[t][r])
    }

    function placeTetro() {  // checks line completion, spawns next tetro
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
                scoreNode.textContent = linesCleared
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
            return false
        }
        return true
    }

    function moveDown() {
        undraw(x, y, tetros[t][r])
        if (!isTetrominoColliding(x, y+1, tetros[t][r])) {
            y++
        } else {
            if (!placeTetro()) return
        }
        draw(x, y, tetros[t][r])
    }

    function hardPlace() {
        undraw(x, y, tetros[t][r])
        while (!isTetrominoColliding(x, y+1, tetros[t][r])) {
            y++
        }
        if (!placeTetro()) return
        draw(x, y, tetros[t][r])
    }

    function rotateLeft() {
        undraw(x, y, tetros[t][r])
        r = (r+tetros[t].length-1) % tetros[t].length
        if (isTetrominoColliding(x, y, tetros[t][r])) {
            // wall kick - need to implement Super Rotation System
            // if (!isTetrominoColliding(x+1, y, tetros[t][r])) {
            //     x++
            // } else if (!isTetrominoColliding(x-1, y, tetros[t][r])) {
            //     x--
            // } else {
            //     r = (r+1) % tetros[t].length
            // }
            r = (r+1) % tetros[t].length
        }
        draw(x, y, tetros[t][r])
    }

    function rotateRight() {
        undraw(x, y, tetros[t][r])
        r = (r+1) % tetros[t].length
        if (isTetrominoColliding(x, y, tetros[t][r])) {
            // wall kick - need to implement Super Rotation System
            // if (!isTetrominoColliding(x+1, y, tetros[t][r])) {
            //     x++
            // } else if (!isTetrominoColliding(x-1, y, tetros[t][r])) {
            //     x--
            // } else {
            //     r = (r+tetros[t].length-1) % tetros[t].length
            // }
            r = (r+tetros[t].length-1) % tetros[t].length
        }
        draw(x, y, tetros[t][r])
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'w' || e.key === 'ArrowUp') {
            hardPlace()
        }
        if (e.key === 'a' || e.key === 'ArrowLeft') {
            moveLeft()
        }
        if (e.key === 's' || e.key === 'ArrowDown') {
            moveDown()
        }
        if (e.key === 'd' || e.key === 'ArrowRight') {
            moveRight()
        }
        if (e.key === 'q') {
            rotateLeft()
        }
        if (e.key === 'e') {
            rotateRight()
        }
    })

    let timer = setInterval(tick, 1000)
    spawnTetro()
    draw(x, y, tetros[t][r])

})

// TODO
// next block
// prettify
// wall kicks
// fall location visualiser
// game over
// speed up