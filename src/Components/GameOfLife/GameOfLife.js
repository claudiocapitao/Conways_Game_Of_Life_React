import React, { useState, useEffect, useRef } from "react";
import styles from './GameOfLife.module.css';
import ImagesAndArrays from '../Images/ImagesAndArrays.js';
import Chart from '../Chart/Chart.js';
import { Row, Col } from 'react-simple-flex-grid';
import "react-simple-flex-grid/lib/main.css";
import Description from '../Description/Description.js';

const GameOfLife = () => {
    const canvasRef = useRef(null)

    const canvasSquaresBoard = useRef([]); // array containing all square objects needed for canvas
    const gameOfLifeBoard = useRef([]); // array with 0 or 1 that represent an dead or alive square - used to process calculations faster

    class Square {
        constructor(x, y, w, h, color) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            this.color = color;
        }

        draw(context) {
            context.beginPath();
            context.rect(this.x, this.y, this.w, this.h);
            context.fillStyle = this.color;
            context.strokeStyle = "#FFFFFF";
            context.fill();
            context.stroke();
        }

        update(context) {
            context.clearRect(this.x, this.y, this.w, this.h)
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        canvas.width = 800;
        canvas.height = 500;

        canvas.style.background = "#f7f3f0";

        var numberOfCellsPerRow = canvas.width / 10; //each square has a side of 10px
        var numberOfCellsPerColumn = canvas.height / 10;

        for (var i = 0; i < numberOfCellsPerColumn; i++) {
            canvasSquaresBoard.current[i] = [];
            gameOfLifeBoard.current[i] = [];
            for (var j = 0; j < numberOfCellsPerRow; j++) {
                var mySquare = new Square(j * 10, i * 10, 10, 10, "#f7f3f0");
                canvasSquaresBoard.current[i][j] = mySquare;
                gameOfLifeBoard.current[i][j] = 0;
                canvasSquaresBoard.current[i][j].draw(context);
            }
        }
    }, [])

    const updateAndDrawSquare = (i, j, color, context) => {
        canvasSquaresBoard.current[i][j].color = color;
        canvasSquaresBoard.current[i][j].update(context);
        canvasSquaresBoard.current[i][j].draw(context);
    }

    const changeSquare = (event) => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        var rect = canvas.getBoundingClientRect();
        const xMouse = event.clientX - rect.left;
        const yMouse = event.clientY - rect.top;

        let j = parseInt(xMouse / 10);
        let i = parseInt(yMouse / 10);

        if (gameOfLifeBoard.current[i][j] == 0) {
            updateAndDrawSquare(i, j, "#777777", context);
            gameOfLifeBoard.current[i][j] = 1;
        } else if (gameOfLifeBoard.current[i][j] == 1) {
            updateAndDrawSquare(i, j, "#f7f3f0", context);
            gameOfLifeBoard.current[i][j] = 0;
        }
    }


    const countNeighbours = (i, j, boardArray) => {
        let iLen = boardArray.length;
        let jLen = boardArray[i].length;

        let counter = 0;

        //topLeftPosition
        if (boardArray[(iLen + (i - 1)) % iLen][(jLen + (j - 1)) % jLen] == 1) { counter++ };
        //topMiddlePosition
        if (boardArray[(iLen + (i - 1)) % iLen][j] == 1) { counter++ };
        //topRightPosition
        if (boardArray[(iLen + (i - 1)) % iLen][(jLen + (j + 1)) % jLen] == 1) { counter++ };

        //LeftMiddlePosition
        if (boardArray[i][(jLen + (j - 1)) % jLen] == 1) { counter++ };
        //RightMiddlePosition
        if (boardArray[i][(jLen + (j + 1)) % jLen] == 1) { counter++ };

        //bottomLeftPosition
        if (boardArray[(iLen + (i + 1)) % iLen][(jLen + (j - 1)) % jLen] == 1) { counter++ };
        //bottomMiddlePosition
        if (boardArray[(iLen + (i + 1)) % iLen][j] == 1) { counter++ };
        //bottomRightPosition
        if (boardArray[(iLen + (i + 1)) % iLen][(jLen + (j + 1)) % jLen] == 1) { counter++ };

        return counter
    }

    const applyRulesAndConvertCell = (i, j, numberOfNeighbours, boardArray) => {
        if (boardArray[i][j] == 1) {
            if (numberOfNeighbours < 2) {
                return 0;
            } else if (numberOfNeighbours == 2 || numberOfNeighbours == 3) {
                return 1;
            } else if (numberOfNeighbours > 3) {
                return 0;
            }
        } else if (boardArray[i][j] == 0) {
            if (numberOfNeighbours == 3) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    const numberOfAlive = useRef(0);
    const numberOfGenerations = useRef(0);
    const [data, setData] = useState([]);

    const gameOfLife = (boardArray) => {
        let newGameOfLifeBoard = []
        let numberOfAliveThisCycle = 0;
        for (let i = 0; i < boardArray.length; i++) {
            newGameOfLifeBoard[i] = [];
            for (let j = 0; j < boardArray[0].length; j++) {
                const numberOfNeighbours = countNeighbours(i, j, boardArray);
                const changedValue = applyRulesAndConvertCell(i, j, numberOfNeighbours, boardArray);
                newGameOfLifeBoard[i][j] = changedValue;
                if (changedValue == 1) { numberOfAliveThisCycle++ }
            }
        }
        gameOfLifeBoard.current = newGameOfLifeBoard;

        numberOfAlive.current = numberOfAliveThisCycle;
        numberOfGenerations.current++;

        const myData = {
            numberOfGenerations: numberOfGenerations.current,
            numberOfAlive: numberOfAlive.current
        }
        setData((preData) => { return [...preData, myData] })
    }

    const squaresBoardNotRunning = (boardArray) => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        for (let i = 0; i < boardArray.length; i++) {
            for (let j = 0; j < boardArray[0].length; j++) {
                if (boardArray[i][j] == 0) {
                    updateAndDrawSquare(i, j, "#f7f3f0", context);
                } else if (boardArray[i][j] == 1) {
                    updateAndDrawSquare(i, j, "#777777", context);
                }
            }
        }
    }

    function squaresBoardWhileRunning(boardArray, oldArray) {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        for (let i = 0; i < boardArray.length; i++) {
            for (let j = 0; j < boardArray[0].length; j++) {
                if (boardArray[i][j] == 0) {
                    //oldArray[i][j].color = "#f7f3f0";
                    oldArray[i][j].update(context);
                } else if (boardArray[i][j] == 1) {
                    updateAndDrawSquare(i, j, "#777777", context);
                }
            }
        }
    }

    const boardState = useRef(false) // true for running and false for pause
    const startGameOfLife = () => {
        function nextGen() {
            gameOfLife(gameOfLifeBoard.current);
            squaresBoardWhileRunning(gameOfLifeBoard.current, canvasSquaresBoard.current);
            if (boardState.current) {
                startGameOfLife()
            } else {
                squaresBoardNotRunning(gameOfLifeBoard.current);
            }
        }
        setTimeout(nextGen, 50);
    }

    const stopGameOfLife = () => {
        boardState.current = false;
    }

    const refreshCanvas = () => {
        stopGameOfLife();
        numberOfGenerations.current = 0;
        numberOfAlive.current = 0;
        setData([]);

        for (let i = 0; i < gameOfLifeBoard.current.length; i++) {
            for (let j = 0; j < gameOfLifeBoard.current[0].length; j++) {
                gameOfLifeBoard.current[i][j] = 0;
            }
        }
        squaresBoardNotRunning(gameOfLifeBoard.current);
    }

    const loadExample = (exampleArray) => {
        refreshCanvas();

        let iMiddle = parseInt(gameOfLifeBoard.current.length / 2);
        let jMiddle = parseInt(gameOfLifeBoard.current[0].length / 2);

        for (let i = 0; i < exampleArray.length; i++) {
            gameOfLifeBoard.current[iMiddle + exampleArray[i][0]][jMiddle + exampleArray[i][1]] = 1;
        }

        squaresBoardNotRunning(gameOfLifeBoard.current);
    }

    const [hideNumberOfAliveSquares, setHideNumberOfAliveSquares] = useState(false);
    const [hideExamples, setHideExamples] = useState(false);
    const [hideOptions, setHideOptions] = useState(false);

    const moveToAfterClickExample = useRef(null)
    const executeMoveToAfterClickExample = () => moveToAfterClickExample.current.scrollIntoView()



    return (
        <div>
            <h2 className={styles.h2}
                ref={moveToAfterClickExample}>
                Conway's Game Of Life
            </h2>

            <canvas className={styles.canvas}
                ref={canvasRef}
                onClick={e => changeSquare(e)
                }>
            </canvas >

            <div className={styles.divButton}>
                <button className={styles.button}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        boardState.current = true;
                        startGameOfLife();
                    }}>
                    Start
                </button>

                <button className={styles.button}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        stopGameOfLife()
                    }}>
                    Stop
                </button>

                <button className={styles.button}
                    style={{ cursor: "pointer" }}
                    onClick={refreshCanvas}
                >Refresh
                </button>
            </div>

            <p className={styles.p}>
                Number of generations: {numberOfGenerations.current}
            </p>


            <div>
                <h2 className={styles.h2}
                    style={{ cursor: "pointer" }}
                    type='button' onClick={() => {
                        setHideNumberOfAliveSquares(!hideNumberOfAliveSquares);
                        console.log(hideNumberOfAliveSquares)
                    }}                >
                    Number of squares alive
                    </h2>
            </div>

            <div hidden={hideNumberOfAliveSquares}>
                <Chart data={data}></Chart>
            </div>


            <div>
                <h2 className={styles.h2}
                    style={{ cursor: "pointer" }}
                    type='button'
                    onClick={() => {
                        setHideExamples(!hideExamples);
                        console.log(hideExamples)
                    }}>
                    Examples
                </h2>
            </div>

            <div hidden={hideExamples}>
                <div className={styles.canvas}>
                    <Row gutter={10}>
                        {
                            ImagesAndArrays.map((imageAndArray) => {
                                return (
                                    <Col className={styles.divButton}
                                        key={imageAndArray.example}
                                        xs={{ span: 6 }}
                                        sm={{ span: 4 }}
                                        md={{ span: 3 }}>
                                        <img src={imageAndArray.exampleImage}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => {
                                                executeMoveToAfterClickExample();
                                                loadExample(imageAndArray.exampleArray);
                                                boardState.current = true;
                                                startGameOfLife();
                                            }}
                                            width="200px">
                                        </img>

                                        <br></br>

                                        <button className={styles.buttonExamples}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => loadExample(imageAndArray.exampleArray)}>
                                            {imageAndArray.example}
                                        </button>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </div>
            </div>

            <Description></Description>

        </div >

    )
}

export default GameOfLife


