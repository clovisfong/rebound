# Rebound

<br> 

![Rebound_gamedemo](https://user-images.githubusercontent.com/108875592/184468450-749760fd-43db-44c6-b911-baca5d5ced04.gif)

## Introduction


Rebound is a single player game whereby the player controls a bar in an attempt to rebound a moving ball and destroy blocks.

There are three modes of game difficulty - Easy, Normal and Hard mode. Each comes with different bar length and ball speed.  

For every 2 seconds interval, the user bar shrinks in width.  
For every 10 seconds interval, a new row is produced.  
 
<br> 

The mission is to rebound the ball up repeatedly and destroy as many blocks to achieve the highest score possible.

<br>

## Game Controls

- Click buttons for navigation
- Press spacebar to start the game
- Press or hold left arrow to move user bar left
- Press or hold right arrow to move user bar right

<br> 

## Deployment
https://rebound-clovisfong.vercel.app/ 

<br>

## Brief

This is a demo game created for project purposes. It utilises the fundamentals of css, html, javascript and jquery to develop this game within a one week time frame.

<br>

## Further Development and Improvement

Future possible areas of improvement include:    

- Background music 
- Fix font in vercel
- Responsive web design 
- Instruction menu pop up
- Animation effects on game elements
- Alignment of blocks to game display
- Local storage to keep track of scores

<br>

## Timeframe

1 week

<br>

## Technology Applied

- Javascript 
- jQuery
- HTML
- CSS
- Github
- Vite

<br>

## Backend Controls

The structure of this game is coded with the aim to allow varying visual preference, game conditions and possibilities of future expansion. Any changes to the game elements under the data object will be reflected dynamically on display after saving. 

<img width="436" alt="image" src="https://user-images.githubusercontent.com/108875592/184471569-1b7619bd-30cf-40dd-9d86-887bec806564.png">

<br> 

## Key Learning Points

### Javascript

<br>

To generate a record of the block coordinates, a **class** is created to populate the coordinates of each block upon receiving the left and top positions.

<pre>
class Block {
  constructor(xAxis, yAxis) {
    this.topLeft = [xAxis, yAxis]
    this.topRight = [xAxis + app.blockDimension.width, yAxis]
    this.btmLeft = [xAxis, yAxis + app.blockDimension.height]
    this.btmRight = [xAxis + app.blockDimension.width, yAxis + app.blockDimension.height]
  }
}
</pre>

<br><br>

To create multiple blocks coordinates, **for loop** is utilized to create multiple class instances (blocks) to be pushed into an empty array. Using the top and left positions of the first block, the remaining blocks can be created dynamically. 

<pre>
const createBlockInstances = () => {

  // For game reset purpose
  app.nextBlockPosition.yAxis = 0
  app.blocks = []
  
  // Create data coordinates for all the blocks and store in state
  for (let i = 0; i < app.blockCount; i++) {
    createBlock()
  }
}
</pre>

<pre>
const createBlock = () => {
  const block = new Block(
    app.blockStartPos.xAxis + app.nextBlockPosition.xAxis,
    app.blockStartPos.yAxis + app.nextBlockPosition.yAxis)

  app.nextBlockPosition.xAxis += (app.blockDimension.width + app.blockGap.side)
  pushBlocksNextRow()
  app.blocks.push(block)
}
</pre>

<br><br>
  
To count for the collision of blocks, the following codes check for any area of the ball that overlaps the block area. 

Overlapping area formula is referenced from: [geeksforgeeks](https://www.geeksforgeeks.org/check-if-any-point-overlaps-the-given-circle-and-rectangle/)

<pre>
const checkOverlap = (r, xC, yC, x1, y1, x2, y2) => {
  let xN = Math.max(x1, Math.min(xC, x2));
  let yN = Math.max(y1, Math.min(yC, y2));

  let dX = xN - xC;
  let dY = yN - yC;
  return (dX * dX + dY * dY) <= r * r;
}
</pre>

<br><br>

To move the ball and countdown the timer, **setIntervals** were used to run the functions repeatedly. A condition is included to start the setIntervals when an event is triggered. 

<pre>
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
</pre>

<br><br>

To utilize keyboard buttons for the game, **e.which** property is used to recognised an event when a particular key is pressed.  

The jquery hotkeys used in these games are:  

- ‘32’ for spacebar to start the game 
- ‘37’ for left arrow to move userbar left
- ‘39’ for right arrow to move userbar right

<pre>
const startGame = (e) => {
  switch (e.which) {
    case 32:
      e.preventDefault()
      app.gameSwitch = true;
      break;
  }
  render()
}
</pre>


<br>

### CSS

The design of this game requires the code to track the movements and positions of the elements (bar, ball and blocks). Hence, **absolute** position was applied to enable the use of **left** and **top** properties to align every element.  

<br> 

**Flexbox** is used to align contents while **margin** is used to align container.

<pre>
.artboard {
  width: 800px;
  height: 600px;
  background-color: #fffbf0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto
}
</pre>

<br><br>

Text aligning the timer to center will cause the timer to vibrate as it runs. To fix this, a flex container is created to contain the timer. The width of the timer is also adjusted to give the text sufficient space.

<img width="185" alt="image" src="https://user-images.githubusercontent.com/108875592/184472953-5cf092ae-9ed8-48bf-81ce-b1af77bcdbdc.png">

<pre>
#time-border {
  background-color: whitesmoke;
  border: 4px solid #294c74;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  display: flex;
  justify-content: center;
  height: 40px;
  width: 200px;
}

.timer {
  letter-spacing: 3px;
  height: 30px;
  width: 160px;
  padding: 5px 0 0 30px;
  margin: 0 auto;
}
</pre>

<br>


## Key Takeaways

- Plan and wireframe the game logic thoroughly before working on the codes
- Clean up and group the codes in proper flow while writing the codes

<br>

## Reflection

Overall, able to problem solve and apply key concepts of Javascript without much reference to online resources while developing the game. Still require more practice to read and structure codes efficiently.

<br>

