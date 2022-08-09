import $ from "jquery";



const app = {
  gameDisplay: [{ width: 680, height: 400 }],

  blockCount: 18,
  blockStartPos: [{ xAxis: 10, yAxis: 10 }],
  blockDimension: [{ width: 100, height: 20 }],
  blockGap: [{ side: 10, bottom: 10 }],
  blocks: [],

  barCurrentPos: [{ xAxis: 285, yAxis: 370 }],
  barSpeed: [{ leftSpeed: 30, rightSpeed: 30 }],
  barDimensions: [{ width: 100, height: 20 }],

  ballCurrentPos: [{ xAxis: 320, yAxis: 340 }],
  ballDiameter: [30],
  ballDirection: {
    xDirection: 1,
    yDirection: -1
  },

  scoreTracker: 0,

  timer: { milliseconds: 0, seconds: 0, minute: 0 },
  timeConvert: { milliseconds: 0, seconds: 0, minute: 0 }

}


class Block {
  constructor(xAxis, yAxis) {
    this.topLeft = [xAxis, yAxis]
    this.topRight = [xAxis + app.blockDimension[0].width, yAxis]
    this.btmLeft = [xAxis, yAxis + app.blockDimension[0].height]
    this.btmRight = [xAxis + app.blockDimension[0].width, yAxis + app.blockDimension[0].height]

  }
}


let xAddon = 0
let yAddon = 0

for (let i = 0; i < app.blockCount; i++) {
  const block = new Block(app.blockStartPos[0].xAxis + xAddon, app.blockStartPos[0].yAxis + yAddon)
  xAddon += (app.blockDimension[0].width + app.blockGap[0].side)
  if ((app.blockStartPos[0].xAxis + app.blockDimension[0].width + xAddon) > app.gameDisplay[0].width) {
    xAddon = 0
    yAddon += 30
  }
  app.blocks.push(block)
}




const red = Math.floor(Math.random() * 256)
const blue = Math.floor(Math.random() * 256)
const green = Math.floor(Math.random() * 256)
const colorcode = `rgb(${red}, ${blue}, ${green})`



const drawBlocks = () => {

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




// const testball = new Block(100, 400)


const drawUserBar = () => {

  const $user = $('<div>').addClass('player')
  $user.css({ left: app.barCurrentPos[0].xAxis + 'px', top: app.barCurrentPos[0].yAxis + 'px' })
  $('#game-display').append($user)
}


const drawBall = () => {

  const $ball = $('<div>').addClass('ball')
  $ball.css({ left: app.ballCurrentPos[0].xAxis + 'px', top: app.ballCurrentPos[0].yAxis + 'px' })
  $('#game-display').append($ball)
}

const drawScore = () => {
  const $score = $('<span>').text(app.scoreTracker).attr('id', 'score')
  $('#score-display').append($score)
}





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



const gameOver = () => {

  if (app.ballCurrentPos[0].yAxis + app.ballDiameter[0] > app.gameDisplay[0].height) {
    clearInterval(ballTimer)
    clearInterval(stopClock)
    app.scoreTracker = "Game Over"
  }
}

const ballTouch = () => {
  bounceOffWalls()
  hitBarBounceLeft()
  hitBarBounceRight()
  bounceOffBlocks()
  gameOver()



}



const moveBall = () => {
  app.ballCurrentPos[0].xAxis += app.ballDirection.xDirection
  app.ballCurrentPos[0].yAxis += app.ballDirection.yDirection

  ballTouch()
  render()
}


///// STOPCLOCK

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

const convertMilliseconds = () => {
  if (app.timer.milliseconds >= 100) {
    app.timeConvert.milliseconds = app.timer.milliseconds / 10
  } else {
    app.timeConvert.milliseconds = app.timer.milliseconds
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


const countTime = () => {
  app.timer.milliseconds += 10
  if (app.timer.milliseconds === 1000) {
    app.timer.seconds++
    app.timer.milliseconds = 0
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





const moveBarLeft = () => {
  if (app.barCurrentPos[0].xAxis > 0) {
    app.barCurrentPos[0].xAxis -= app.barSpeed[0].leftSpeed
  }
}


const moveBarRight = () => {
  if (app.barCurrentPos[0].xAxis + app.barDimensions[0].width < app.gameDisplay[0].width) {
    app.barCurrentPos[0].xAxis += app.barSpeed[0].rightSpeed
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



const main = () => {

  $('body').on('keydown', moveUserBar)

  render()

}


main()





