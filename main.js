import $ from "jquery";


/*==========================================
STORE DATA IN STATE
========================================== */

const app = {
  gameDisplay: { width: 670, height: 400 },

  blockCount: 18,
  blockStartPos: { xAxis: 10, yAxis: 10 },
  blockDimension: { width: 100, height: 20 },
  blockGap: { side: 10, bottom: 10 },
  nextBlockPosition: { xAxis: 0, yAxis: 0 },
  blocks: [],


  barSpeed: { leftSpeed: 40, rightSpeed: 40 },
  barDimensions: { width: 150, height: 20 },
  barCurrentPos: { xAxis: 0, yAxis: 0 },
  barMode: { easy: 150, normal: 120, hard: 100 },

  ballCurrentPos: { xAxis: 0, yAxis: 0 },
  ballDiameter: 30,
  ballDirection: {
    x: 1,
    y: -1
  },
  ballSpeed: 1,

  scoreTracker: 0,

  timer: { milliseconds: 0, seconds: 10, minute: 0 },
  timeConvert: { milliseconds: 0, seconds: 0, minute: 0 },
  timeAdd: 10,

  gameMode: "",
  gameSwitch: false,
  homeDisplaySwitch: true,
  gameDisplaySwitch: false,
  endGameDisplaySwitch: false,

}




/*==========================================
SET UP GAME DISPLAY AND CREATE DATA
========================================== */

// CREATE GAME DISPLAY

const setGameDisplay = () => $('#game-display').css({
  width: app.gameDisplay.width + 'px',
  height: app.gameDisplay.height + 'px',
})


// CREATE BAR AND BALL COORDINATES IN RELATION TO GAME DISPLAY

const barStartXPosition = () => {
  const widthDifference = app.gameDisplay.width - app.barDimensions.width
  app.barCurrentPos.xAxis = widthDifference / 2
}

const barStartYPosition = () => {
  const heightDifference = app.gameDisplay.height - app.barDimensions.height
  app.barCurrentPos.yAxis = heightDifference - app.blockGap.bottom
}

const ballStartXPosition = () => {
  const gameDisplayMidpoint = app.gameDisplay.width / 2
  app.ballCurrentPos.xAxis = gameDisplayMidpoint - app.ballDiameter / 2
}

const ballStartYPosition = () => {
  app.ballCurrentPos.yAxis = app.barCurrentPos.yAxis - app.ballDiameter
}

const setBarAndBallCoordinates = () => {
  barStartXPosition()
  barStartYPosition()

  ballStartXPosition()
  ballStartYPosition()
}


// CREATE BLOCKS DATA

class Block {
  constructor(xAxis, yAxis) {
    this.topLeft = [xAxis, yAxis]
    this.topRight = [xAxis + app.blockDimension.width, yAxis]
    this.btmLeft = [xAxis, yAxis + app.blockDimension.height]
    this.btmRight = [xAxis + app.blockDimension.width, yAxis + app.blockDimension.height]
  }
}

const pushBlocksNextRow = () => {

  if ((app.blockStartPos.xAxis + app.nextBlockPosition.xAxis +
    app.blockDimension.width + app.blockGap.side) > app.gameDisplay.width) {

    app.nextBlockPosition.xAxis = 0
    app.nextBlockPosition.yAxis += (app.blockDimension.height + app.blockGap.bottom)
  }
}

const createBlock = () => {
  const block = new Block(
    app.blockStartPos.xAxis + app.nextBlockPosition.xAxis,
    app.blockStartPos.yAxis + app.nextBlockPosition.yAxis)

  app.nextBlockPosition.xAxis += (app.blockDimension.width + app.blockGap.side)
  pushBlocksNextRow()
  app.blocks.push(block)

}

const createBlockInstances = () => {

  // For game reset purpose
  app.nextBlockPosition.yAxis = 0
  app.blocks = []
  // Create data coordinates for all the blocks and store in app
  for (let i = 0; i < app.blockCount; i++) {
    createBlock()
  }
}




/*==========================================
DRAW BLOCKS, BAR, BALL AND SCORE
========================================== */

const drawBlocks = () => {

  //take block coordinates from app and display
  for (const block of app.blocks) {
    const $block = $('<div>').addClass('block')
    $block.css({
      width: app.blockDimension.width + 'px',
      height: app.blockDimension.height + 'px',
      left: block.topLeft[0] + 'px',
      top: block.topLeft[1] + 'px'
    })
    $block.css('background-color', '#F17633')
    $('#game-display').append($block)
  }
}

const drawUserBar = () => {

  const $user = $('<div>').addClass('player')
  $user.css({
    width: app.barDimensions.width + 'px',
    height: app.barDimensions.height + 'px',
    left: app.barCurrentPos.xAxis + 'px',
    top: app.barCurrentPos.yAxis + 'px'
  })
  $('#game-display').append($user)
}

const drawBall = () => {

  const $ball = $('<div>').addClass('ball')
  $ball.css({
    width: app.ballDiameter + 'px',
    height: app.ballDiameter + 'px',
    left: app.ballCurrentPos.xAxis + 'px',
    top: app.ballCurrentPos.yAxis + 'px'
  })
  $('#game-display').append($ball)
}

const drawScore = () => {
  const $score = $('<p>').text(app.scoreTracker).addClass('score')
  $('.score-display').append($score)
}




/*==========================================
CONTROL BALL MOVEMENT AND OUTCOMES
========================================== */

const changeDirection = () => {

  app.ballDirection.x === app.ballSpeed && app.ballDirection.y === -app.ballSpeed ? app.ballDirection.y = app.ballSpeed :
    app.ballDirection.x === app.ballSpeed && app.ballDirection.y === app.ballSpeed ? app.ballDirection.x = -app.ballSpeed :
      app.ballDirection.x === -app.ballSpeed && app.ballDirection.y === app.ballSpeed ? app.ballDirection.y = -app.ballSpeed :
        app.ballDirection.x === -app.ballSpeed && app.ballDirection.y === -app.ballSpeed ? app.ballDirection.x = app.ballSpeed : null
}

const bounceOffWalls = () => {

  if (app.ballCurrentPos.xAxis + app.ballDiameter >= app.gameDisplay.width ||
    app.ballCurrentPos.yAxis <= 0 ||
    app.ballCurrentPos.xAxis <= 0
  ) {
    changeDirection()
  }
}

const bounceBallDiagonallyRight = () => {
  if (app.ballDirection.x === app.ballSpeed && app.ballDirection.y === app.ballSpeed) {
    app.ballDirection.x = app.ballSpeed
    app.ballDirection.y = -app.ballSpeed
  }
}

const bounceBallDiagonallyLeft = () => {
  if (app.ballDirection.x === -app.ballSpeed && app.ballDirection.y === app.ballSpeed) {
    app.ballDirection.x = -app.ballSpeed
    app.ballDirection.y = -app.ballSpeed
  }
}

const bounceOffBar = () => {

  if (app.ballCurrentPos.yAxis + app.ballDiameter === app.barCurrentPos.yAxis &&
    app.ballCurrentPos.xAxis >= app.barCurrentPos.xAxis - app.ballDiameter / 2 &&
    app.ballCurrentPos.xAxis + app.ballDiameter <= app.barCurrentPos.xAxis + app.barDimensions.width + app.ballDiameter / 2) {

    bounceBallDiagonallyRight()
    bounceBallDiagonallyLeft()
  }
}

const removeBlocksAndUpdateScore = (item) => {
  app.blocks.splice(item, 1)
  app.scoreTracker++
}

// Formula referenced from geeksforgeeks
const checkOverlap = (r, xC, yC, x1, y1, x2, y2) => {
  let xN = Math.max(x1, Math.min(xC, x2));
  let yN = Math.max(y1, Math.min(yC, y2));

  let dX = xN - xC;
  let dY = yN - yC;
  return (dX * dX + dY * dY) <= r * r;
}

const bounceOffBlocks = () => {
  for (let i = 0; i < app.blocks.length; i++) {
    if (checkOverlap(app.ballDiameter / 2,
      (app.ballCurrentPos.xAxis + app.ballDiameter / 2),
      (app.ballCurrentPos.yAxis + app.ballDiameter / 2),
      app.blocks[i].btmLeft[0], app.blocks[i].btmLeft[1],
      app.blocks[i].topRight[0], app.blocks[i].topRight[1])) {
      removeBlocksAndUpdateScore(i)
      changeDirection()
    }
  }
}

const ballGameOver = () => {

  if (app.ballCurrentPos.yAxis + app.ballDiameter > app.gameDisplay.height) {
    clearInterval(ballTimer)
    clearInterval(stopClock)
    proceedToEndGamePage()
  }
}


const ballTouch = () => {
  bounceOffWalls()
  bounceOffBar()
  bounceOffBlocks()
  ballGameOver()
}

const moveBall = () => {
  app.ballCurrentPos.xAxis += app.ballDirection.x
  app.ballCurrentPos.yAxis += app.ballDirection.y

  ballTouch()
  render()
}




/*==========================================
CONVERT TIME DATA AND DISPLAY TIMER
========================================== */

const convertMilliseconds = () => {
  if (app.timer.milliseconds >= 100) {
    app.timeConvert.milliseconds = app.timer.milliseconds / 10
  } else {
    app.timeConvert.milliseconds = app.timer.milliseconds
  }

  if (app.timer.milliseconds === 1000 || app.timer.milliseconds === 0) {
    app.timeConvert.milliseconds = '00'
  }
}

const convertSeconds = () => {
  if (app.timer.seconds < 10) {
    app.timeConvert.secondsTimer = '0' + app.timer.seconds
  } else {
    app.timeConvert.secondsTimer = app.timer.seconds
  }

  if (app.timer.seconds === 60) {
    app.timeConvert.secondsTimer = '00'
  }
}

const convertMinute = () => {
  app.timer.minute < 10 ? app.timeConvert.minute = '0' + app.timer.minute :
    app.timeConvert.minute = app.timer.minute
}

const drawTimer = () => {
  convertMilliseconds()
  convertSeconds()
  convertMinute()
  const $time = $('<h2>').text(`${app.timeConvert.minute} : ${app.timeConvert.secondsTimer} : ${app.timeConvert.milliseconds}`).addClass('timer')
  $('#time-border').append($time)
}


const shrinkBar = () => app.barDimensions.width > 50 ? app.barDimensions.width -= 2 : null

const addTimeAndRow = () => {
  shiftCurrentBlocksDown()
  createNewRow()
  blocksGameOver()
  app.timer.seconds = app.timeAdd
  render()
}

const shiftCurrentBlocksDown = () => {
  // Update coodinates for the old blocks at app directly
  app.blocks.forEach((block) => {
    block.topLeft[1] += 30;
    block.topRight[1] += 30;
    block.btmLeft[1] += 30;
    block.btmRight[1] += 30;
  })
}

const createNewRow = () => {
  // Reset the axis
  app.nextBlockPosition.xAxis = 0
  app.nextBlockPosition.yAxis = 0

  for (let i = 0; i < Math.floor(app.gameDisplay.width / (app.blockDimension.width + app.blockGap.side)); i++) {
    createBlock()
  }
}

const blocksGameOver = () => {
  if (app.blocks.some((block) => block.btmLeft[1] > app.barCurrentPos.yAxis - app.ballDiameter)) {
    clearInterval(stopClock)
    clearInterval(ballTimer)
    proceedToEndGamePage()
  }
}


const runTime = () => {
  // Convert min to sec
  if (app.timer.minute > 0 && app.timer.seconds === 0 && app.timer.milliseconds === 0) {
    app.timer.minute--
    app.timer.seconds = 60
  }

  // Convert sec to milliseconds
  if (app.timer.seconds > 0 && app.timer.milliseconds === 0) {
    app.timer.seconds--
    app.timer.milliseconds = 1000
    //Insert condition here so that it is reviewed by the sec
    if (app.timer.seconds % 2 === 0) {
      shrinkBar()
    }
  }

  // Check if time or milliseconds is more than 0 to control sequence of running timer 
  if (app.timer.milliseconds > 0) {
    app.timer.milliseconds -= 10
  }

  if (app.timer.minute === 0 && app.timer.seconds === 0 && app.timer.milliseconds === 0) {
    addTimeAndRow()
  }

  render()
}




/*==========================================
CENTRALISED SWITCH FOR BALL AND TIMER
========================================== */

let stopClock = setInterval(() => {
  if (app.gameSwitch === true) {
    runTime()
  }
}, 10)

let ballTimer = setInterval(() => {
  if (app.gameSwitch === true) {
    moveBall()
  }
}, 5)




/*==========================================
DISPLAY DRAWINGS
========================================== */
const render = () => {
  $('#game-display').empty()
  $('.score').remove()
  $('.timer').remove()

  drawBlocks()
  drawUserBar()
  drawBall()
  drawScore()
  switchArtboard()
  drawTimer()
}





/*==========================================
GAME CONTROLS
========================================== */

const startGame = (e) => {
  switch (e.which) {
    case 32: // Spacebar
      e.preventDefault()
      app.gameSwitch = true;
      break;
  }
  render()
}


const moveBarLeft = () => {
  if (app.barCurrentPos.xAxis >= app.barSpeed.leftSpeed) {
    app.barCurrentPos.xAxis -= app.barSpeed.leftSpeed
  }
  if (app.barCurrentPos.xAxis < app.barSpeed.leftSpeed && app.barCurrentPos.xAxis > 0) {
    app.barCurrentPos.xAxis -= app.barCurrentPos.xAxis
  }
}

const moveBarRight = () => {
  if (app.barCurrentPos.xAxis + app.barDimensions.width + app.barSpeed.rightSpeed <= app.gameDisplay.width) {
    app.barCurrentPos.xAxis += app.barSpeed.rightSpeed
  }
  if ((app.gameDisplay.width - (app.barCurrentPos.xAxis + app.barDimensions.width)) < app.barSpeed.rightSpeed &&
    app.barCurrentPos.xAxis < app.gameDisplay.width) {
    app.barCurrentPos.xAxis += (app.gameDisplay.width - (app.barCurrentPos.xAxis + app.barDimensions.width))
  }
}

const moveUserBar = (e) => {
  switch (e.which) {
    case 37: // Left arrow
      e.preventDefault()
      moveBarLeft()
      break;

    case 39: // Right arrow
      e.preventDefault()
      moveBarRight()
      break;
  }
  render()
}




/*==========================================
SWTICH PAGES
========================================== */

const switchArtboard = () => {
  app.homeDisplaySwitch === true ? $('#home-con').show() : $('#home-con').hide()
  app.gameDisplaySwitch === true ? $('#game-con').show() : $('#game-con').hide()
  app.endGameDisplaySwitch === true ? $('#gameover-con').show() : $('#gameover-con').hide()
}

const proceedToHomePage = () => {
  app.endGameDisplaySwitch = false
  app.homeDisplaySwitch = true
  app.gameDisplaySwitch = false
  render()
}

const proceedToEndGamePage = () => {
  app.gameDisplaySwitch = false
  app.endGameDisplaySwitch = true
  app.homeDisplaySwitch = false
  render()
}

const proceedToGamePage = () => {
  app.homeDisplaySwitch = false
  app.gameDisplaySwitch = true
  app.endGameDisplaySwitch = false

  app.scoreTracker = 0
  app.timer.milliseconds = 0
  app.timer.seconds = app.timeAdd
  app.timer.minute = 0
  app.gameSwitch = false

  if (app.gameMode === 'E') {
    app.barDimensions.width = app.barMode.easy
  } else if (app.gameMode === 'N') {
    app.barDimensions.width = app.barMode.normal
  } else if (app.gameMode === 'H') {
    app.barDimensions.width = app.barMode.hard
  }

  setGameDisplay()
  setBarAndBallCoordinates()
  createBlockInstances()

  app.ballDirection.x = app.ballSpeed
  app.ballDirection.y = -app.ballSpeed
  clearInterval(stopClock)
  clearInterval(ballTimer)

  stopClock = setInterval(() => {
    if (app.gameSwitch === true) {
      runTime()
    }
  }, 10)

  ballTimer = setInterval(() => {
    if (app.gameSwitch === true) {
      moveBall()
    }
  }, 5)

  render()
}




/*==========================================
SELECT MODE
========================================== */
const easyMode = () => {
  app.gameMode = 'E'
  app.barDimensions.width = app.barMode.easy
  app.ballSpeed = 1
  proceedToGamePage()
}


const normalMode = () => {
  app.gameMode = 'N'
  app.barDimensions.width = app.barMode.normal
  app.ballSpeed = 1.5
  proceedToGamePage()
}


const hardMode = () => {
  app.gameMode = 'H'
  app.barDimensions.width = app.barMode.hard
  app.ballSpeed = 1.8
  proceedToGamePage()
}




/*==========================================
MAIN EVENTS
========================================== */

const main = () => {

  $('body').on('keydown', startGame)
  $('body').on('keydown', moveUserBar)

  $('#easy').on('click', easyMode)
  $('#normal').on('click', normalMode)
  $('#hard').on('click', hardMode)

  $('#home').on('click', proceedToHomePage)
  $('#try-again').on('click', proceedToGamePage)


  render()
}



main()



