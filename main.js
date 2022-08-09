import $ from "jquery";



const app = {
  gameDisplay: [{ width: 680, height: 400 }],

  blockCount: 18,
  blockStartPos: [{ xAxis: 10, yAxis: 10 }],
  blockDimension: [{ width: 100, height: 20 }],
  blockGap: [{ side: 10, bottom: 10 }],
  nextBlockPosition: { xAxis: 0, yAxis: 0 },
  blocks: [],


  barSpeed: [{ leftSpeed: 30, rightSpeed: 30 }],
  barDimensions: [{ width: 150, height: 20 }],
  barCurrentPos: [{ xAxis: 0, yAxis: 0 }],

  ballCurrentPos: [{ xAxis: 0, yAxis: 0 }],
  ballDiameter: [30],
  ballDirection: {
    xDirection: 1,
    yDirection: -1
  },

  scoreTracker: 0,

  timer: { milliseconds: 0, seconds: 0, minute: 0 },
  timeConvert: { milliseconds: 0, seconds: 0, minute: 0 }

}




/// CREATE BAR AND BALL COORDINATES IN RELATION TO GAME DISPLAY

const barStartXPosition = () => {
  const widthDifferenceOfBarAndDisplay = app.gameDisplay[0].width - app.barDimensions[0].width
  const barXAxisCoordinate = widthDifferenceOfBarAndDisplay / 2
  app.barCurrentPos[0].xAxis = barXAxisCoordinate
}

const barStartYPosition = () => {
  const heightDifferenceOfBarAndDisplay = app.gameDisplay[0].height - app.barDimensions[0].height
  const barYAxisCoordinate = heightDifferenceOfBarAndDisplay - app.blockStartPos[0].yAxis
  app.barCurrentPos[0].yAxis = barYAxisCoordinate
}

const ballStartXPosition = () => {
  const gameDisplayMidpoint = app.gameDisplay[0].width / 2
  const ballXAxisCoordinate = gameDisplayMidpoint - app.ballDiameter / 2
  app.ballCurrentPos[0].xAxis = ballXAxisCoordinate
}

const ballStartYPosition = () => {
  const ballYAxisCoordinate = app.barCurrentPos[0].yAxis - app.ballDiameter
  app.ballCurrentPos[0].yAxis = ballYAxisCoordinate
}

const setBarAndBallCoordinates = () => {
  barStartXPosition()
  barStartYPosition()

  ballStartXPosition()
  ballStartYPosition()
}




/// CREATE GAME DISPLAY
const setGameDisplay = () => {

  $('#game-display').css({
    width: app.gameDisplay[0].width + 'px',
    height: app.gameDisplay[0].height + 'px',
  })
}




/// GENERATE BLOCKS DATA DYNAMICALLY

class Block {
  constructor(xAxis, yAxis) {
    this.topLeft = [xAxis, yAxis]
    this.topRight = [xAxis + app.blockDimension[0].width, yAxis]
    this.btmLeft = [xAxis, yAxis + app.blockDimension[0].height]
    this.btmRight = [xAxis + app.blockDimension[0].width, yAxis + app.blockDimension[0].height]

  }
}


const createBlockInstances = () => {
  // create data coordinates for all the blocks and store in app
  for (let i = 0; i < app.blockCount; i++) {
    const block = new Block(
      app.blockStartPos[0].xAxis + app.nextBlockPosition.xAxis,
      app.blockStartPos[0].yAxis + app.nextBlockPosition.yAxis)

    app.nextBlockPosition.xAxis += (app.blockDimension[0].width + app.blockGap[0].side)
    if ((app.blockStartPos[0].xAxis + app.blockDimension[0].width + app.nextBlockPosition.xAxis) > app.gameDisplay[0].width) {
      app.nextBlockPosition.xAxis = 0
      app.nextBlockPosition.yAxis += 30
    }
    app.blocks.push(block)
  }
}




/// DRAW BLOCKS, BAR, BALL AND SCORE

const red = Math.floor(Math.random() * 256)
const blue = Math.floor(Math.random() * 256)
const green = Math.floor(Math.random() * 256)
const colorcode = `rgb(${red}, ${blue}, ${green})`


const drawBlocks = () => {
  //take block coordinates from app and display
  for (const block of app.blocks) {
    const $block = $('<div>').addClass('block')
    $block.css({
      width: app.blockDimension[0].width + 'px',
      height: app.blockDimension[0].height + 'px',
      left: block.topLeft[0] + 'px',
      top: block.topLeft[1] + 'px'
    })
    $block.css('background-color', colorcode)
    $('#game-display').append($block)
  }
}


const drawUserBar = () => {

  const $user = $('<div>').addClass('player')
  $user.css({
    width: app.barDimensions[0].width + 'px',
    height: app.barDimensions[0].height + 'px',
    left: app.barCurrentPos[0].xAxis + 'px',
    top: app.barCurrentPos[0].yAxis + 'px'
  })
  $('#game-display').append($user)
}


const drawBall = () => {

  const $ball = $('<div>').addClass('ball')
  $ball.css({
    width: app.ballDiameter[0] + 'px',
    height: app.ballDiameter[0] + 'px',
    left: app.ballCurrentPos[0].xAxis + 'px',
    top: app.ballCurrentPos[0].yAxis + 'px'
  })
  $('#game-display').append($ball)
}


const drawScore = () => {
  const $score = $('<span>').text(app.scoreTracker).attr('id', 'score')
  $('#score-display').append($score)
}



/// BALL MOVEMENT

const changeDirection = () => {

  if (app.ballDirection.xDirection === 1 && app.ballDirection.yDirection === -1) {
    app.ballDirection.yDirection = 1
  } else if (app.ballDirection.xDirection === 1 && app.ballDirection.yDirection === 1) {
    app.ballDirection.xDirection = -1
  } else if (app.ballDirection.xDirection === -1 && app.ballDirection.yDirection === 1) {
    app.ballDirection.yDirection = -1
  } else if (app.ballDirection.xDirection === -1 && app.ballDirection.yDirection === -1) {
    app.ballDirection.xDirection = 1
  }
}


const bounceOffWalls = () => {

  if (app.ballCurrentPos[0].xAxis + app.ballDiameter[0] >= app.gameDisplay[0].width ||
    app.ballCurrentPos[0].yAxis <= 0 ||
    app.ballCurrentPos[0].xAxis <= 0
  ) {
    changeDirection()
  }
}


const hitBarBounceLeft = () => {

  if (app.ballCurrentPos[0].yAxis + app.ballDiameter[0] === app.barCurrentPos[0].yAxis &&
    app.ballCurrentPos[0].xAxis >= app.barCurrentPos[0].xAxis - app.ballDiameter[0] / 2 &&
    app.ballCurrentPos[0].xAxis <= app.barCurrentPos[0].xAxis + app.barDimensions[0].width / 2) {
    app.ballDirection.xDirection = -1
    app.ballDirection.yDirection = -1
  }
}


const hitBarBounceRight = () => {

  if (app.ballCurrentPos[0].yAxis + app.ballDiameter[0] === app.barCurrentPos[0].yAxis &&
    app.ballCurrentPos[0].xAxis > app.barCurrentPos[0].xAxis + app.barDimensions[0].width / 2 &&
    app.ballCurrentPos[0].xAxis + app.ballDiameter[0] <= app.barCurrentPos[0].xAxis + app.barDimensions[0].width + app.ballDiameter[0] / 2) {
    app.ballDirection.xDirection = 1
    app.ballDirection.yDirection = -1
  }
}


const removeBlocksAndUpdateScore = (item) => {
  app.blocks.splice(item, 1)
  app.scoreTracker++
}

const bounceOffBlocks = () => {
  for (let i = 0; i < app.blocks.length; i++) {
    if (
      (app.ballCurrentPos[0].xAxis + (app.ballDiameter[0] / 2)) > app.blocks[i].btmLeft[0] &&
      (app.ballCurrentPos[0].xAxis + (app.ballDiameter[0] / 2)) < app.blocks[i].btmRight[0] &&
      (app.ballCurrentPos[0].yAxis + (app.ballDiameter[0] / 2)) > app.blocks[i].topLeft[1] &&
      (app.ballCurrentPos[0].yAxis + (app.ballDiameter[0] / 2)) < app.blocks[i].btmRight[1]
    ) {
      removeBlocksAndUpdateScore(i)
      changeDirection()
    }
  }
}


const ballGameOver = () => {

  if (app.ballCurrentPos[0].yAxis + app.ballDiameter[0] > app.gameDisplay[0].height) {
    clearInterval(ballTimer)
    clearInterval(stopClock)
    app.scoreTracker = "Game Over"
  }

  ///////////////
}


const ballTouch = () => {
  bounceOffWalls()
  hitBarBounceLeft()
  hitBarBounceRight()
  bounceOffBlocks()
  ballGameOver()
}


const moveBall = () => {
  app.ballCurrentPos[0].xAxis += app.ballDirection.xDirection
  app.ballCurrentPos[0].yAxis += app.ballDirection.yDirection

  ballTouch()
  render()
}


///// STOP CLOCK

const convertMilliseconds = () => {
  if (app.timer.milliseconds >= 100) {
    app.timeConvert.milliseconds = app.timer.milliseconds / 10
  } else {
    app.timeConvert.milliseconds = app.timer.milliseconds
  }
  if (app.timer.milliseconds === 0) {
    app.timeConvert.milliseconds = '0' + '0'
  }
}

const convertSeconds = () => {
  if (app.timer.seconds < 10) {
    app.timeConvert.secondsTimer = '0' + app.timer.seconds
  } else {
    app.timeConvert.secondsTimer = app.timer.seconds
  }
}

const convertMinute = () => {
  if (app.timer.minute < 10) {
    app.timeConvert.minute = '0' + app.timer.minute
  } else {
    app.timeConvert.minute = app.timer.minute
  }
}


const convertTime = () => {
  convertMilliseconds()
  convertSeconds()
  convertMinute()

}

const displayTimer = () => {
  convertTime()
  const $milliseconds = $('<h3>').text(`${app.timeConvert.minute} : ${app.timeConvert.secondsTimer} : ${app.timeConvert.milliseconds}`).addClass('timer')
  $milliseconds.insertAfter('#score-display')

}

const shiftCurrentBlocksDown = () => {
  // Go to app directly to update coodinates for the old blocks
  app.blocks.forEach((block) => {
    block.topLeft[1] += 30;
    block.topRight[1] += 30;
    block.btmLeft[1] += 30;
    block.btmRight[1] += 30;
  })
}

const createNewRows = () => {
  app.nextBlockPosition.xAxis = 0
  app.nextBlockPosition.yAxis = 0
  for (let i = 0; i < Math.floor(app.gameDisplay[0].width / (app.blockDimension[0].width + app.blockGap[0].side)); i++) {

    const newblock = new Block(
      app.blockStartPos[0].xAxis + app.nextBlockPosition.xAxis,
      app.blockStartPos[0].yAxis + app.nextBlockPosition.yAxis)

    app.nextBlockPosition.xAxis += (app.blockDimension[0].width + app.blockGap[0].side)
    if ((app.blockStartPos[0].xAxis + app.blockDimension[0].width + app.nextBlockPosition.xAxis) > app.gameDisplay[0].width) {
      app.nextBlockPosition.xAxis = 0
      app.nextBlockPosition.yAxis += 30
    }
    app.blocks.push(newblock)
  }
}

const blocksGameOver = () => {
  if (app.blocks.some((block) => block.btmLeft[1] > app.barCurrentPos[0].yAxis - app.ballDiameter[0])) {
    clearInterval(stopClock)
    clearInterval(ballTimer)
  }
}

const countTime = () => {
  app.timer.milliseconds += 10
  if (app.timer.milliseconds === 1000) {
    app.timer.seconds++
    app.timer.milliseconds = 0
    // Put shift blocks condition here because condition is reviewed every 1 sec
    if (app.timer.seconds % 30 === 0) {
      shiftCurrentBlocksDown()
      createNewRows()
      blocksGameOver()
      render()
    }
  }
  if (app.timer.seconds === 60) {
    app.timer.minute++
    app.timer.seconds = 0
  }
  if (app.timer.minute === 60) {
    clearInterval(stopClock)
  }
}


const runTime = () => {
  countTime()
  render()
}

const stopClock = setInterval(runTime, 10)
const ballTimer = setInterval(moveBall, 5)


const render = () => {
  $('#game-display').empty()
  $('#score').remove()
  drawBlocks()
  drawUserBar()
  drawBall()
  drawScore()

  $('.timer').remove()
  displayTimer()

}




/// MOVE USER BAR

const moveBarLeft = () => {
  if (app.barCurrentPos[0].xAxis >= app.barSpeed[0].leftSpeed) {
    app.barCurrentPos[0].xAxis -= app.barSpeed[0].leftSpeed
  }
  if (app.barCurrentPos[0].xAxis < app.barSpeed[0].leftSpeed && app.barCurrentPos[0].xAxis > 0) {
    app.barCurrentPos[0].xAxis -= app.barCurrentPos[0].xAxis
  }

}

const moveBarRight = () => {
  if (app.barCurrentPos[0].xAxis + app.barDimensions[0].width + app.barSpeed[0].rightSpeed <= app.gameDisplay[0].width) {
    app.barCurrentPos[0].xAxis += app.barSpeed[0].rightSpeed
  }
  if ((app.gameDisplay[0].width - (app.barCurrentPos[0].xAxis + app.barDimensions[0].width)) < app.barSpeed[0].rightSpeed &&
    app.barCurrentPos[0].xAxis < app.gameDisplay[0].width) {
    app.barCurrentPos[0].xAxis += (app.gameDisplay[0].width - (app.barCurrentPos[0].xAxis + app.barDimensions[0].width))
  }
}

const moveUserBar = (e) => {

  switch (e.which) {
    case 37:
      moveBarLeft()
      break;

    case 39:
      moveBarRight()
      break;
  }
  render()
}




/// MAIN SWTICH 

const main = () => {
  setBarAndBallCoordinates()
  setGameDisplay()
  createBlockInstances()
  $('body').on('keydown', moveUserBar)

  render()

}


main()




