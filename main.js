import $ from "jquery";



const app = {
  gameDisplay: [{ width: 680, height: 400 }],
  blockDimension: [{ width: 100, height: 20 }],

  barCurrentPos: [{ xAxis: 285, yAxis: 370 }],
  barSpeed: [{ leftSpeed: 30, rightSpeed: 30 }],
  barDimensions: [{ width: 100, height: 20 }],

  ballCurrentPos: [{ xAxis: 320, yAxis: 340 }],
  ballDiameter: [30],
  ballDirection: {
    xDirection: 1,
    yDirection: -1
  },

  scoreTracker: 0
}



class Block {
  constructor(xAxis, yAxis) {
    this.topLeft = [xAxis, yAxis]
    this.topRight = [xAxis + app.blockDimension[0].width, yAxis]
    this.btmLeft = [xAxis, yAxis + app.blockDimension[0].height]
    this.btmRight = [xAxis + app.blockDimension[0].width, yAxis + app.blockDimension[0].height]

  }
}



// Create aXis for blocks
const blocks = [
  new Block(10, 10),
  new Block(120, 10),
  new Block(230, 10),
  new Block(340, 10),
  new Block(450, 10),
  new Block(560, 10),
  new Block(10, 40),
  new Block(120, 40),
  new Block(230, 40),
  new Block(340, 40),
  new Block(450, 40),
  new Block(560, 40),
  new Block(10, 70),
  new Block(120, 70),
  new Block(230, 70),
  new Block(340, 70),
  new Block(450, 70),
  new Block(560, 70),
]



const red = Math.floor(Math.random() * 256)
const blue = Math.floor(Math.random() * 256)
const green = Math.floor(Math.random() * 256)
const colorcode = `rgb(${red}, ${blue}, ${green})`



const drawBlocks = () => {

  for (const block of blocks) {
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

const testball = new Block(100, 400)


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
  console.log("remove " + item)
  blocks.splice(item, 1)
  app.scoreTracker++
}

console.log(app.ballDiameter[0] / 2)

const bounceOffBlocks = () => {
  for (let i = 0; i < blocks.length; i++) {
    if (
      (app.ballCurrentPos[0].xAxis + (app.ballDiameter[0] / 2)) > blocks[i].btmLeft[0] &&
      (app.ballCurrentPos[0].xAxis + (app.ballDiameter[0] / 2)) < blocks[i].btmRight[0] &&
      (app.ballCurrentPos[0].yAxis + (app.ballDiameter[0] / 2)) > blocks[i].topLeft[1] &&
      (app.ballCurrentPos[0].yAxis + (app.ballDiameter[0] / 2)) < blocks[i].btmRight[1]



      //   app.ballCurrentPos[0].xAxis < blocks[i].btmRight[0]) &&
      // app.ballCurrentPos[0].yAxis > blocks[i].btmLeft[1] &&
      // (app.ballCurrentPos[0].yAxis + app.ballDiameter[0]) < blocks[i].topLeft[0]


      // app.ballCurrentPos[0].xAxis > blocks[i].btmLeft[0] &&
      // app.ballCurrentPos[0].xAxis < blocks[i].btmRight[0] &&
      // app.ballCurrentPos[0].yAxis > blocks[i].topLeft[0].yAxis &&
      // app.ballCurrentPos[0].yAxis < blocks[i].btmLeft[0].yAxis

    ) {
      removeBlocksAndUpdateScore(i)
      changeDirection()
    }
  }
}

console.log()

const gameOver = () => {

  if (app.ballCurrentPos[0].yAxis + app.ballDiameter[0] > app.gameDisplay[0].height) {
    clearInterval(ballTimer)
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

// let time = 0;

const moveBall = () => {
  app.ballCurrentPos[0].xAxis += app.ballDirection.xDirection
  app.ballCurrentPos[0].yAxis += app.ballDirection.yDirection

  ballTouch()
  render()
}

const ballTimer = setInterval(moveBall, 5)




const render = () => {
  $('#game-display').empty()
  $('#score').remove()
  // time++;
  // if (time === 1000) {
  //   clearInterval(ballTimer)
  // }
  drawBlocks()
  drawUserBar()
  drawBall()
  drawScore()
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

