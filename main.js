import $ from "jquery";



const app = {
  gameDisplay: [{ width: 670, height: 400 }],

  blockCount: 18,
  blockStartPos: [{ xAxis: 10, yAxis: 10 }],
  blockDimension: [{ width: 100, height: 20 }],
  blockGap: [{ side: 10, bottom: 10 }],
  nextBlockPosition: { xAxis: 0, yAxis: 0 },
  blocks: [],


  barSpeed: { leftSpeed: 30, rightSpeed: 30 },
  barDimensions: { width: 150, height: 20 },
  barCurrentPos: { xAxis: 0, yAxis: 0 },
  barMode: { easy: 150, normal: 120, hard: 100 },

  ballCurrentPos: [{ xAxis: 0, yAxis: 0 }],
  ballDiameter: [30],
  ballDirection: {
    xDirection: 1,
    yDirection: -1
  },

  scoreTracker: 0,

  timer: { milliseconds: 0, seconds: 0, minute: 2 },
  timeConvert: { milliseconds: 0, seconds: 0, minute: 0 },

  gameSwitch: false,

  homeDisplaySwitch: true,
  gameDisplaySwitch: false,
  endGameDisplaySwitch: false,

}


/// SWITCH PAGES
const selectArtboard = () => {

  if (app.homeDisplaySwitch === true) {
    $('#menu-con').show()
    $('#game-con').hide()
    $('#gameover-con').hide()
  }
  if (app.gameDisplaySwitch === true) {
    $('#menu-con').hide()
    $('#game-con').show()
    $('#gameover-con').hide()
  }
  if (app.endGameDisplaySwitch === true) {
    $('#menu-con').hide()
    $('#game-con').hide()
    $('#gameover-con').show()
  }

}



/// CREATE BAR AND BALL COORDINATES IN RELATION TO GAME DISPLAY



const barStartXPosition = () => {
  const widthDifferenceOfBarAndDisplay = app.gameDisplay[0].width - app.barDimensions.width
  const barXAxisCoordinate = widthDifferenceOfBarAndDisplay / 2
  app.barCurrentPos.xAxis = barXAxisCoordinate
}

const barStartYPosition = () => {
  const heightDifferenceOfBarAndDisplay = app.gameDisplay[0].height - app.barDimensions.height
  const barYAxisCoordinate = heightDifferenceOfBarAndDisplay - app.blockStartPos[0].yAxis
  app.barCurrentPos.yAxis = barYAxisCoordinate
}

const ballStartXPosition = () => {
  const gameDisplayMidpoint = app.gameDisplay[0].width / 2
  const ballXAxisCoordinate = gameDisplayMidpoint - app.ballDiameter / 2
  app.ballCurrentPos[0].xAxis = ballXAxisCoordinate
}

const ballStartYPosition = () => {
  const ballYAxisCoordinate = app.barCurrentPos.yAxis - app.ballDiameter
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
  // For game reset game purpose
  app.nextBlockPosition.yAxis = 0
  app.blocks = []
  // Create data coordinates for all the blocks and store in app
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
    width: app.ballDiameter[0] + 'px',
    height: app.ballDiameter[0] + 'px',
    left: app.ballCurrentPos[0].xAxis + 'px',
    top: app.ballCurrentPos[0].yAxis + 'px'
  })
  $('#game-display').append($ball)
}


const drawScore = () => {
  const $score = $('<p>').text(app.scoreTracker).addClass('score')
  $('.score-display').append($score)


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

  if (app.ballCurrentPos[0].yAxis + app.ballDiameter[0] === app.barCurrentPos.yAxis &&
    app.ballCurrentPos[0].xAxis >= app.barCurrentPos.xAxis - app.ballDiameter[0] / 2 &&
    app.ballCurrentPos[0].xAxis <= app.barCurrentPos.xAxis + app.barDimensions.width / 2) {
    app.ballDirection.xDirection = -1
    app.ballDirection.yDirection = -1
  }
}


const hitBarBounceRight = () => {

  if (app.ballCurrentPos[0].yAxis + app.ballDiameter[0] === app.barCurrentPos.yAxis &&
    app.ballCurrentPos[0].xAxis > app.barCurrentPos.xAxis + app.barDimensions.width / 2 &&
    app.ballCurrentPos[0].xAxis + app.ballDiameter[0] <= app.barCurrentPos.xAxis + app.barDimensions.width + app.ballDiameter[0] / 2) {
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
    proceedToEndGamePage()
  }
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

// CONVERT TIME
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


// DISPLAY TIME
const displayTimer = () => {
  convertTime()
  const $time = $('<h2>').text(`${app.timeConvert.minute} : ${app.timeConvert.secondsTimer} : ${app.timeConvert.milliseconds}`).addClass('timer')
  $('#time-border').append($time)
}

// STOP TIME
const stopTimerOnceZero = () => {
  if (app.timer.minute === 0 && app.timer.seconds === 0 && app.timer.milliseconds === 0) {
    clearInterval(stopClock)
    clearInterval(moveBall)
    proceedToEndGamePage()
  }
}

const blocksGameOver = () => {
  if (app.blocks.some((block) => block.btmLeft[1] > app.barCurrentPos.yAxis - app.ballDiameter[0])) {
    clearInterval(stopClock)
    clearInterval(ballTimer)
    proceedToEndGamePage()
  }
}


// PROCDUCE NEW BLOCKS AND SHRINK BAR EVERY TIME INTERVAL

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


const shrinkBar = () => {
  if (app.barDimensions.width > 50) {
    app.barDimensions.width -= 2
  }
}



// CALCULATE TIME

const runTime = () => {
  stopTimerOnceZero()

  if (app.timer.minute > 0 && app.timer.seconds === 0 && app.timer.milliseconds === 0) {
    app.timer.minute--
    app.timer.seconds = 60
  }

  if (app.timer.seconds > 0 && app.timer.milliseconds === 0) {
    app.timer.seconds--
    app.timer.milliseconds = 1000
    // Put shift blocks condition here because condition is reviewed every 1 sec
    if (app.timer.seconds % 3 === 0) {
      shiftCurrentBlocksDown()
      createNewRows()
      blocksGameOver()
      render()
    }
    if (app.timer.seconds % 2 === 0) {
      shrinkBar()
    }

  }
  if (app.timer.milliseconds > 0) { // important condition to determine the start and stop of timer
    app.timer.milliseconds -= 10
  }

  render()
}

///// INTERVAL SEGMENT WITH SWITCH

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








const render = () => {
  $('#game-display').empty()
  $('.score').remove()
  drawBlocks()
  drawUserBar()
  drawBall()
  drawScore()
  selectArtboard()

  $('.timer').remove()
  displayTimer()

}




/// START GAME
const startGame = (e) => {
  switch (e.which) {
    case 32: // spacebar
      e.preventDefault()
      app.gameSwitch = true;
      break;
  }
  render()
}



/// MOVE USER BAR

const moveBarLeft = () => {
  if (app.barCurrentPos.xAxis >= app.barSpeed.leftSpeed) {
    app.barCurrentPos.xAxis -= app.barSpeed.leftSpeed
  }
  if (app.barCurrentPos.xAxis < app.barSpeed.leftSpeed && app.barCurrentPos.xAxis > 0) {
    app.barCurrentPos.xAxis -= app.barCurrentPos.xAxis
  }


}

const moveBarRight = () => {
  if (app.barCurrentPos.xAxis + app.barDimensions.width + app.barSpeed.rightSpeed <= app.gameDisplay[0].width) {
    app.barCurrentPos.xAxis += app.barSpeed.rightSpeed
  }
  if ((app.gameDisplay[0].width - (app.barCurrentPos.xAxis + app.barDimensions.width)) < app.barSpeed.rightSpeed &&
    app.barCurrentPos.xAxis < app.gameDisplay[0].width) {
    app.barCurrentPos.xAxis += (app.gameDisplay[0].width - (app.barCurrentPos.xAxis + app.barDimensions.width))
  }
}

const moveUserBar = (e) => {
  switch (e.which) {
    case 37: // left arrow
      e.preventDefault()
      moveBarLeft()
      break;

    case 39: // right arrow
      e.preventDefault()
      moveBarRight()
      break;
  }

  render()
}




const proceedToGamePage = () => {
  app.homeDisplaySwitch = false
  app.gameDisplaySwitch = true
  app.endGameDisplaySwitch = false

  app.scoreTracker = 0
  app.timer.milliseconds = 0
  app.timer.seconds = 0
  app.timer.minute = 2
  app.gameSwitch = false

  setBarAndBallCoordinates()
  setGameDisplay()
  createBlockInstances()


  app.ballDirection.xDirection = 1
  app.ballDirection.yDirection = -1
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

const proceedToEndGamePage = () => {
  app.gameDisplaySwitch = false
  app.endGameDisplaySwitch = true
  app.homeDisplaySwitch = false
  render()
}

const proceedToHomePage = () => {
  app.endGameDisplaySwitch = false
  app.homeDisplaySwitch = true
  app.gameDisplaySwitch = false
  render()
}


const easyMode = () => {
  app.barDimensions.width = app.barMode.easy
  proceedToGamePage()

}

const normalMode = () => {
  app.barDimensions.width = app.barMode.normal
  proceedToGamePage()
}

const hardMode = () => {
  app.barDimensions.width = app.barMode.hard
  proceedToGamePage()

}

const reset = () => {
  app.ballDirection.xDirection = 1
  app.ballDirection.yDirection = -1
  proceedToGamePage()
  render()

}

/// MAIN SWTICH 

const main = () => {


  $('body').on('keydown', startGame)
  $('body').on('keydown', moveUserBar)

  $('#easy').on('click', easyMode)
  $('#normal').on('click', normalMode)
  $('#hard').on('click', hardMode)

  $('#home').on('click', proceedToHomePage) //reset stuff
  $('#try-again').on('click', reset) // reset stuff


  render()

}



main()




// const countTime = () => {
//   app.timer.milliseconds += 10
//   if (app.timer.milliseconds === 1000) {
//     app.timer.seconds++
//     app.timer.milliseconds = 0
//     // Put shift blocks condition here because condition is reviewed every 1 sec
//     if (app.timer.seconds % 30 === 0) {
//       shiftCurrentBlocksDown()
//       createNewRows()
//       blocksGameOver()
//       render()
//     }
//   }
//   if (app.timer.seconds === 60) {
//     app.timer.minute++
//     app.timer.seconds = 0
//   }
//   if (app.timer.minute === 60) {
//     clearInterval(stopClock)
//   }
// }


// const checkStartTime = () => {
//   if (app.timeSwitch === true && app.timer.minute > 0 && app.timer.seconds >= 0 && app.timer.milliseconds >= 10) { //2.15.120 min or  2.00.990
//     app.timeSwitch = false
//   }

//   if (app.timeSwitch === true && app.timer.minute > 0 && app.timer.milliseconds === 0) {
//     if (app.timer.seconds > 0) { // 2.15.00 min
//       app.timer.seconds--
//     }
//     if (app.timer.seconds === 0) { // 2.00.00 min
//       app.timer.minute--
//       app.timer.seconds += 59
//     }
//     app.timer.milliseconds += 1000
//     app.timeSwitch = false
//   }

//   if (app.timeSwitch === true && app.timer.minute > 0 && app.timer.seconds > 0 && app.timer.milliseconds === 0) { // 2.15.00 min
//     app.timer.seconds--
//     app.timer.milliseconds += 1000
//     app.timeSwitch = false
//   }
//   if (app.timeSwitch === true && app.timer.minute > 0 && app.timer.seconds === 0 && app.timer.milliseconds === 0) { // 2.00.00 min
//     app.timer.minute--
//     app.timer.seconds += 59
//     app.timer.milliseconds += 1000
//     app.timeSwitch = false
//   }
//   if (app.timeSwitch === true && app.timer.minute === 0 && app.timer.seconds > 0 && app.timer.milliseconds >= 10) { // 0.45.450
//     app.timeSwitch = false
//   }
//   if (app.timeSwitch === true && app.timer.minute === 0 && app.timer.seconds > 0 && app.timer.milliseconds === 0) {// 0.45.0
//     app.timer.seconds--
//     app.timer.milliseconds += 1000
//     app.timeSwitch = false
//   }
// }