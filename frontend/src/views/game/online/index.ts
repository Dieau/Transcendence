import Konva from 'konva'
import type { Socket } from 'socket.io-client'
import { router } from '../../../router/index'

export interface PongPlayer {
  socketId: string
  isReady: boolean
  position?: number
  score: number
}

export interface Paddle {
  x: number
  y: number
  width: number
  height: number
  speed: number
}

export interface PongData {
  isPaused: boolean
  isHardMode: boolean
  playerA?: PongPlayer
  playerB?: PongPlayer
  paddleA: Paddle
  paddleB: Paddle
  ball: {
    position: {
      x: number
      y: number
    }
    velocity: {
      x: number
      y: number
    }
    speed: number
    radius: number
  }
  stageHeight: number
  stageWidth: number
  showBall: boolean
}

export interface PongPlayer {
  socketId: string
  position?: number
  score: number
}

export class Pong {

  public width = 800
  public height = 600

  private pongData: PongData
  
  private stage: Konva.Stage
  private paddleA: Konva.Group
  private paddleB: Konva.Group
  private ball: Konva.Group
  private scoreLayer: Konva.Layer
  private victoryScreenLayer!: Konva.Layer
  private victoryScreenDisplayed: boolean = false
  private animationFrameId?: number
  private gameRunning: boolean = false
  private keysPressed: { [key: string]: boolean } = {}
  private paddleLayer: Konva.Layer
  private startGameLayer!: Konva.Layer
  private gameStarted: boolean = false
  private ballXDirection!: number
  private ballYDirection!: number
  private showBall: boolean
  private ballShapeNode?: Konva.Circle
  private paddleSpeed!: number
  private pauseScreenLayer!: Konva.Layer
  private gameIsPaused: boolean
  private touchStartPosition: number | null = null
  
  constructor(private socket: Socket, pongData: PongData) {

    this.pongData = JSON.parse(JSON.stringify(pongData))

    this.stage = this.generateStage()
    this.paddleLayer = new Konva.Layer
    this.stage.add(this.paddleLayer)
    this.paddleA = this.generatePaddle(`Left`, `#ff9a00`)
    this.paddleB = this.generatePaddle(`Right`, `#9a198a`)
    this.showBall = false
    this.gameIsPaused = false
    this.touchStartPosition = null

    socket.on(`updatePongData`, (pongData: PongData) => {
      if (pongData.playerB && pongData.playerA) {
        if (socket.id === this.pongData.playerA?.socketId && pongData.paddleB?.y)
        {
          this.paddleB.y(pongData.paddleB?.y)
        }
        if (socket.id === this.pongData.playerB?.socketId && pongData.paddleA?.y)
        {
          this.paddleA.y(pongData.paddleA?.y)
        }

        this.updateBallPosition()
        this.ballXDirection = pongData.ball.velocity.x
        this.ballYDirection = pongData.ball.velocity.y

        this.paddleSpeed = pongData.paddleA.speed

        this.pongData = pongData
      }
    })

    if (!pongData.playerA) {
      this.pongData.playerA = {
        socketId: '',
        isReady: false,
        score: 0
      }
    }
  
    if (!pongData.playerB) {
      this.pongData.playerB = {
        socketId: '',
        isReady: false,
        score: 0
      }
    }

    socket.on(`setCountdown`, ({ amount, serverTime }) => {
      const countdownText = new Konva.Text({
        x: this.width / 2 - 20,
        y: this.height / 2 + 30,
        text: ``,
        fontSize: 100,
        fontFamily: `BaseRetroWave`,
        fill: `black`,
        shadowColor: `rgba(255, 154, 0, 0.9)`,
        shadowBlur: 10,
        align: 'center'
      })
    
      this.paddleLayer.add(countdownText)

    const updateCountdown = () => {
        const currentTime = Date.now()
        const timeRemaining = Math.max(0, serverTime + amount * 1000 - currentTime)

        if (timeRemaining > 0) {
            countdownText.text(Math.ceil(timeRemaining / 1000).toString())
            this.stage.batchDraw()
            requestAnimationFrame(updateCountdown)
        } else {
            countdownText.text('')
            this.paddleLayer.draw()
            countdownText.destroy()
            this.startGame()
        }
    }

    updateCountdown()
    })

    socket.on(`gameIsPaused`, (pongData: PongData) => {
      this.gameIsPaused = true
      this.displayPauseScreen()
      this.pongData = pongData
    })

    socket.on(`gameIsUnpaused`, (pongData: PongData) => {
      this.gameIsPaused = false
      this.pauseScreenLayer.hide()
      this.pongData = pongData
      this.ball.show()
      this.scoreLayer.show()
    })

    socket.on(`updateScore`, (pongData: PongData) => {
        const scoreText = `${pongData.playerA?.score ?? 0} : ${pongData.playerB?.score ?? 0}`
        const text = new Konva.Text({
          x: this.width / 2,
          y: 10,
          text: scoreText,
          fontSize: 30,
          fontFamily: `BaseRetroWave`,
          fill: `black`,
          shadowColor: `rgba(255, 154, 0, 0.9)`,
          shadowBlur: 10,
        })
    
        text.offsetX(text.width() / 2)
        this.scoreLayer.destroyChildren()
        this.scoreLayer.add(text)
        this.scoreLayer.batchDraw()
    
        this.scoreLayer.cache()

        this.pongData = pongData
    })

    socket.on('victory', (player) => {
      this.gameRunning = false
      this.displayVictoryScreen(player)
      this.updateScoreText()
    })

    socket.on('gameOverDisconnect', (pongData: PongData) => {
      this.pongData = pongData
      if (!this.gameRunning) return
      this.gameRunning = false
      this.displayDisconnectScreen()
    })
    
    window.addEventListener(`keydown`, this.handleKeyDown.bind(this))
    window.addEventListener(`keyup`, this.handleKeyUp.bind(this))

    this.ball = this.generateBall()

    this.paddleLayer.add(this.paddleA)
    this.paddleLayer.add(this.paddleB)

    const gameLayer = new Konva.Layer()
    gameLayer.add(this.ball)
    this.stage.add(gameLayer)
    this.pongData.showBall = false
    if (this.showBall)
      gameLayer.draw()

    this.scoreLayer = new Konva.Layer()
    this.stage.add(this.scoreLayer)
    this.scoreLayer.hide()
    this.updateScoreText()

    this.generatePauseScreenLayer()

    this.generateVictoryScreenLayer()

  }

  get IsMyPaddle() {
    const socketId = this.socket.id
    if (socketId === this.pongData.playerA?.socketId)
      return true
    else if (socketId === this.pongData.playerB?.socketId)
      return true
    return false
  }

  get myPaddle() {
    const socketId = this.socket.id
    if (socketId === this.pongData.playerA?.socketId)
      return this.paddleA
    if (socketId === this.pongData.playerB?.socketId)
      return this.paddleB
  }

  /* ---------------------------------------- Loop ---------------------------------------- */    

  touchMoveHandler = (event: TouchEvent) => {
    this.handleTouchMove(event, this.myPaddle!)
  }

  gameLoop() {
    if (!this.gameRunning || this.victoryScreenDisplayed || !this.gameStarted) return

    if (this.keysPressed[`ArrowUp`] && this.myPaddle)
      this.movePaddle(this.myPaddle, 1)
    if (this.keysPressed[`ArrowDown`] && this.myPaddle) {
      this.movePaddle(this.myPaddle, -1)
    }

    window.addEventListener('touchstart', this.handleTouchStart.bind(this))
    window.addEventListener('touchmove', this.touchMoveHandler)
    window.addEventListener('touchend', this.handleTouchEnd.bind(this))

    if (this.keysPressed[`p`] && this.myPaddle) {
      if (!this.gameIsPaused) this.socket.emit(`pauseGameRequest`)
    }
    if (this.keysPressed[`r`] && this.myPaddle)
      if (this.gameIsPaused) this.unpauseGameSignal()
  
    this.drawBall()
    this.drawPaddles()
  
    this.animationFrameId = requestAnimationFrame(() => this.gameLoop())
  }

  updateStage() {
    this.stage.batchDraw()
  }

  drawPaddles() {
    this.paddleLayer.batchDraw()
  }

  /* ---------------------------------------- Initialization ---------------------------------------- */

    generateStartGameLayer(): void {
    this.startGameLayer = new Konva.Layer()
    this.startGameLayer.opacity(0.8)
    this.stage.add(this.startGameLayer)

    const leftPaddleColor = `#ff9a00`
    const rightPaddleColor = `#9a198a`

    const backgroundRect = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
      fill: `black`,
    })
    this.startGameLayer.add(backgroundRect)

    const welcomeTextGradient = {
      start: { x: -this.width / 2, y: 0 },
      end: { x: this.width / 2, y: 0 },
      colorStops: [0, leftPaddleColor, 1, rightPaddleColor],
    }

    const welcomeText = new Konva.Text({
      x: this.width / 2,
      y: this.height / 2 - 150,
      text: `WELCOME TO PONG`,
      fontSize: 80,
      fontFamily: `BaseRetroWave`,
      fillLinearGradientStartPoint: welcomeTextGradient.start,
      fillLinearGradientEndPoint: welcomeTextGradient.end,
      fillLinearGradientColorStops: welcomeTextGradient.colorStops,
      shadowColor: `rgba(255, 154, 0, 0.9)`,
      shadowBlur: 10,
    })

    welcomeText.offsetX(welcomeText.width() / 2)
    this.startGameLayer.add(welcomeText)

    const victoryTextGradient = {
      start: { x: -this.width / 2, y: 0 },
      end: { x: this.width / 2, y: 0 },
      colorStops: [0, `#ff9a00`, 1, `#9a198a`],
    }

    const asciiIconTextLeft = new Konva.Text({
      x: this.width / 2,
      y: this.height / 2 - 250,
      text: `🏆 COMPETITIVE 🏆`,
      fontSize: 60,
      fontFamily: `BaseRetroWave`,
      fillLinearGradientStartPoint: victoryTextGradient.start,
      fillLinearGradientEndPoint: victoryTextGradient.end,
      fillLinearGradientColorStops: victoryTextGradient.colorStops,
      shadowBlur: 10,
    })
    asciiIconTextLeft.offsetX(asciiIconTextLeft.width() / 2)
    this.startGameLayer.add(asciiIconTextLeft)

    const buttonGradient = {
      start: { x: -150 / 2, y: 0 },
      end: { x: 150 / 2, y: 0 },
      colorStops: [0, leftPaddleColor, 1, rightPaddleColor],
    }

    const buttonWidth = 150
    const buttonHeight = 40
    const buttonX = (this.width - buttonWidth) / 2
    const buttonY = this.height / 2 - 20

    const startButtonRect = new Konva.Rect({
        x: buttonX,
        y: buttonY,
        width: buttonWidth,
        height: buttonHeight,
        fillLinearGradientStartPoint: buttonGradient.start,
        fillLinearGradientEndPoint: buttonGradient.end,
        fillLinearGradientColorStops: buttonGradient.colorStops,
        cornerRadius: 5,
        listening: true,
        shadowColor: `rgba(255, 154, 0, 0.9)`,
        shadowBlur: 10,
        strokeWidth: 2,
    })

    const startButtonText = new Konva.Text({
        x: buttonX + buttonWidth / 2,
        y: buttonY + buttonHeight / 2,
        text: `START GAME`,
        fontSize: 20,
        fontFamily: `BaseRetroWave`,
        color: `white`,
        fill: `white`,
        align: `center`,
        verticalAlign: `middle`,
        listening: false,
    })

    startButtonText.offsetX(startButtonText.width() / 2)
    startButtonText.offsetY(startButtonText.height() / 2)

    this.startGameLayer.add(startButtonRect)
    this.startGameLayer.add(startButtonText)

    window.addEventListener('touchstart', (event) => this.handleStartButtonTouch(event, startButtonRect))

    startButtonRect.on(`mouseover`, () => {
      document.body.style.cursor = `pointer`
      startButtonRect.stroke(`rgba(255, 0, 255, 0.8)`)
      this.startGameLayer.batchDraw()
  })

  startButtonRect.on(`mouseout`, () => {
      document.body.style.cursor = `default`
      startButtonRect.stroke(``)
  })

    startButtonRect.on(`click`, this.setPlayerReady.bind(this))

    const hardButtonWidth = 150
    const hardButtonHeight = 40
    const hardButtonX = (this.width - buttonWidth) / 2
    const hardButtonY = this.height - 100

    const hardButtonRect = new Konva.Rect({
      x: hardButtonX,
      y: hardButtonY,
      width: hardButtonWidth,
      height: hardButtonHeight,
      fillLinearGradientStartPoint: buttonGradient.start,
      fillLinearGradientEndPoint: buttonGradient.end,
      fillLinearGradientColorStops: buttonGradient.colorStops,
      cornerRadius: 5,
      listening: true,
      shadowColor: `rgba(255, 154, 0, 0.9)`,
      shadowBlur: 10,
      strokeWidth: 2,
  })

    const hardButtonText = new Konva.Text({
        x: hardButtonX + hardButtonWidth / 2,
        y: hardButtonY + hardButtonHeight / 2,
        text: `HARD MODE`,
        fontSize: 20,
        fontFamily: `BaseRetroWave`,
        color: `white`,
        fill: `white`,
        align: `center`,
        verticalAlign: `middle`,
        listening: false,
    })

    const hardButtonTooltipText = new Konva.Text({
      x: hardButtonX - 30,
      y: hardButtonY + hardButtonHeight / 2 + 45,
      text: `IF YOUR ENNEMY AGREES, THE GAME WILL BE SPED UP!`,
      fontSize: 12,
      fontFamily: `BaseRetroWave`,
      color: `white`,
      fill: `white`,
      align: `center`,
      verticalAlign: `middle`,
      listening: false,
  })

  const startButtonTooltipText = new Konva.Text({
    x: buttonX + 30,
    y: buttonY + buttonHeight / 2 + 45,
    text: `Move: ↑ arrowUp ↓ arrowDown

    PAUSE:「 P 」`,
    fontSize: 12,
    fontFamily: `BaseRetroWave`,
    color: `white`,
    fill: `white`,
    align: `center`,
    verticalAlign: `middle`,
    listening: false,
})

    hardButtonText.offsetX(hardButtonText.width() / 2)
    hardButtonText.offsetY(hardButtonText.height() / 2)
    hardButtonTooltipText.offsetX(hardButtonText.width() / 2)
    hardButtonTooltipText.offsetY(hardButtonText.height() / 2)
    startButtonTooltipText.offsetX(hardButtonText.width() / 2)
    startButtonTooltipText.offsetY(hardButtonText.height() / 2)

    this.startGameLayer.add(hardButtonRect)
    this.startGameLayer.add(hardButtonText)
    this.startGameLayer.add(hardButtonTooltipText)
    this.startGameLayer.add(startButtonTooltipText)


    hardButtonRect.on(`mouseover`, () => {
      document.body.style.cursor = `pointer`
      hardButtonRect.stroke(`rgba(255, 0, 255, 0.8)`)
      this.startGameLayer.batchDraw()
  })

  hardButtonRect.on(`mouseout`, () => {
      document.body.style.cursor = `default`
      hardButtonRect.stroke(``)
  })

  hardButtonRect.on(`click`, () => {
    hardButtonRect.fill(`rgba(0, 0, 0, 0.3)`)
    this.startGameLayer.batchDraw()
    this.setHardMode()
  })

    const ball = new Konva.Circle({
      x: this.width / 2,
      y: this.height / 2 + 130,
      radius: 20,
      fill: `rgba(0, 101, 255, 0.9)`,
      shadowColor: `rgba(0, 101, 255, 0.9)`,
      shadowBlur: 25,
      shadowOpacity: 1,
    })
  
    this.startGameLayer.add(ball)
  
    const amplitude = 350
    const period = 4000
    const centerX = this.width / 2
  
    const anim = new Konva.Animation((frame) => {
      ball.x(
        amplitude * Math.sin(((frame?.time ?? 0) * 2 * Math.PI) / period) + centerX
      )
    }, this.startGameLayer)
  
    anim.start()

    this.startGameLayer.batchDraw()
  }

    private ballColor = `#0065FF`
    private ballBorderColor = `black`

    generateBall(): Konva.Group {
      const group = new Konva.Group()
      const newBall = new Konva.Circle({
        x: this.pongData.ball.position.x,
        y: this.pongData.ball.position.y,
        radius: this.pongData.ball.radius,
        fill: this.ballColor,
        shadowColor: `rgba(0, 101, 255, 0.9)`,
        shadowBlur: 5,
        stroke: this.ballBorderColor,
        strokeWidth: 2,
        name: 'ball-shape',
        visible: false,
      })
    
      group.add(newBall)
    
      this.ballShapeNode = newBall
    
      return group
    }

    generatePaddle(side: `Left` | `Right`, color: string): Konva.Group {
      const paddleWidth = 15
      const paddleHeight = 100
      const stageHeight = this.height
    
      const paddleX = side === `Left` ? paddleWidth : this.width - paddleWidth * 2
      const paddleY = (stageHeight) / 2 - paddleHeight / 2
    
      const paddle = new Konva.Rect({
        x: 0,
        y: 0,
        width: paddleWidth,
        height: paddleHeight,
        fill: color,
        stroke: `black`,
        strokeWidth: 2,
        shadowColor: color,
        shadowBlur: 10,
        shadowOpacity: 1
      })
    
      const paddleGroup = new Konva.Group({
        x: paddleX,
        y: paddleY,
      })
    
      paddleGroup.add(paddle)
    
      return paddleGroup
    }

    setPlayerReady() {
      this.socket.emit(`setPlayerReady`)
    }

    setHardMode() {
      this.socket.emit(`setHardMode`)
    }

    startGame() {
      if (!this.gameStarted) {
        this.ballShapeNode?.visible(true)
        this.showBall = true
        this.startGameLayer.hide()
        this.scoreLayer.show()
        this.gameStarted = true
        this.gameRunning = true
        this.gameLoop()
      }
    }

      generateStage(): Konva.Stage {
        const container = document.getElementById(`konvaRef`)
        if (!container) {
            throw new Error(`Container 'konvaRef' not found.`)
        }

        const screenWidth = window.innerWidth
        const screenHeight = window.innerHeight
        const scale = Math.min((screenWidth - 20) / 800, (screenHeight - 50) / 600)

        const stage = new Konva.Stage({
            container: `konvaRef`,
            width: 800,
            height: 600,
        })

        stage.scale({ x: scale, y: scale })
        stage.container().style.transformOrigin = 'top left'

        stage.width(800 * scale)
        stage.height(600 * scale)

        const backgroundLayer = new Konva.Layer()
        const backgroundRect = new Konva.Rect({
          x: 0,
          y: 0,
          width: this.width,
          height: this.height,
          fillLinearGradientStartPoint: { x: 0, y: 0 },
          fillLinearGradientEndPoint: { x: this.width, y: 0 },
          fillLinearGradientColorStops: [0.28, `rgba(140, 20, 90, 1)`, 1, `rgba(210, 100, 0, 1)`],
          stroke: `black`,
        })
        const imageObj = new Image()
        imageObj.onload = function() {
          backgroundRect.fillPatternImage(imageObj)
        }

        backgroundLayer.add(backgroundRect)
        stage.add(backgroundLayer)

        const scoreLayer = new Konva.Layer()
        stage.add(scoreLayer)

        this.stage = stage
        this.generateStartGameLayer()

        return stage
      }

/* ---------------------------------------- Scores ---------------------------------------- */

  updateScoreText() {
    const scoreText = `${this.pongData.playerA?.score} : ${this.pongData.playerB?.score}`
    const text = new Konva.Text({
      x: this.width / 2,
      y: 10,
      text: scoreText,
      fontSize: 30,
      fontFamily: `BaseRetroWave`,
      fill: `black`,
      shadowColor: `rgba(255, 154, 0, 0.9)`,
      shadowBlur: 10,
    })

    text.offsetX(text.width() / 2)
    this.scoreLayer.destroyChildren()
    this.scoreLayer.add(text)
    this.scoreLayer.batchDraw()

  }

    unpauseGameSignal(): void {
      this.socket.emit(`unpauseGameRequest`)
    }

    generatePauseScreenLayer(): void {
      this.pauseScreenLayer = new Konva.Layer()
      this.stage.add(this.pauseScreenLayer)
    }

    displayPauseScreen(): void {
      this.ball.hide()
      this.scoreLayer.hide()
      const darkeningRect = new Konva.Rect({
        x: 0,
        y: 0,
        width: this.width,
        height: this.height,
        fill: `black`,
        opacity: 0.8,
      })
      this.pauseScreenLayer.add(darkeningRect)

      this.pauseScreenLayer.show()
      this.pauseScreenLayer.moveToTop()

      const pauseTextGradient = {
        start: { x: -this.width / 2, y: 0 },
        end: { x: this.width / 2, y: 0 },
        colorStops: [0, `#ff9a00`, 1, `#9a198a`],
      }

      const gameOverText = `GAME PAUSED`
      const letterSpace = 45
      const letters: Konva.Text[] = []

      for (let i = 0; i < gameOverText.length; i++) {
        const letter = new Konva.Text({
          x: this.width / 2 - (gameOverText.length * letterSpace) / 2 + i * letterSpace,
          y: -80,
          text: gameOverText[i],
          fontSize: 80,
          fontFamily: `BaseRetroWave`,
          fillLinearGradientStartPoint: pauseTextGradient.start,
          fillLinearGradientEndPoint: pauseTextGradient.end,
          fillLinearGradientColorStops: pauseTextGradient.colorStops,
          shadowBlur: 10,
        })

        letters.push(letter)
        this.pauseScreenLayer.add(letter)
      }

      this.pauseScreenLayer.batchDraw()

      const animationDuration = 2
      const animationDelay = 0.1

      letters.forEach((letter, index) => {
        const targetY = this.height / 4
        const tween = new Konva.Tween({
          node: letter,
          y: targetY,
          duration: animationDuration,
          easing: Konva.Easings.BounceEaseOut,
          delay: index * animationDelay,
          onFinish: () => {
            if (index === letters.length - 1) {
              tween.reverse()
              tween.play()
            }
          },
        })

        tween.play()
      })

      const pauseText = new Konva.Text({
        x: this.width / 2,
        y: this.height / 2,
        text: `PRESS 「 R 」TO RESUME GAME`,
        fontSize: 30,
        fontFamily: `BaseRetroWave`,
        fillLinearGradientStartPoint: pauseTextGradient.start,
        fillLinearGradientEndPoint: pauseTextGradient.end,
        fillLinearGradientColorStops: pauseTextGradient.colorStops,
        shadowColor: `rgba(255, 154, 0, 0.9)`,
        shadowBlur: 10,
      })
  
      pauseText.offsetX(pauseText.width() / 2)
      this.pauseScreenLayer.add(pauseText)

    }

    generateVictoryScreenLayer(): void {
      this.victoryScreenLayer = new Konva.Layer()
      this.stage.add(this.victoryScreenLayer)
    }

    displayDisconnectScreen() {
      this.gameRunning = false
    
      this.ball.hide()
      this.scoreLayer.hide()
      const darkeningRect = new Konva.Rect({
        x: 0,
        y: 0,
        width: this.width,
        height: this.height,
        fill: `black`,
        opacity: 0.8,
      })
      this.victoryScreenLayer.add(darkeningRect)
      this.victoryScreenLayer.show()
      this.victoryScreenLayer.moveToTop()
      const rectWidth = this.width / 2
      const rectHeight = this.height / 2
      const rectX = (this.width - rectWidth) / 2
      const rectY = (this.height - rectHeight) / 2
    
      const rect = new Konva.Rect({
        x: rectX,
        y: rectY,
        width: rectWidth,
        height: rectHeight,
        cornerRadius: 10,
      })
    
      this.victoryScreenLayer.add(rect)
    
      const victoryTextGradient = {
        start: { x: -this.width / 2, y: 0 },
        end: { x: this.width / 2, y: 0 },
        colorStops: [0, `#ff9a00`, 1, `#9a198a`],
      }

      const text = new Konva.Text({
        x: this.width / 2,
        y: this.height / 2 - 60,
        text: `YOU WIN!`,
        fontSize: 40,
        fontFamily: `BaseRetroWave`,
        fillLinearGradientStartPoint: victoryTextGradient.start,
        fillLinearGradientEndPoint: victoryTextGradient.end,
        fillLinearGradientColorStops: victoryTextGradient.colorStops,
        shadowBlur: 10,
      })
    
      text.offsetX(text.width() / 2)
    
      this.victoryScreenLayer.add(text)

      const gameOverText = `GAME OVER`
      const letterSpace = 45
      const letters: Konva.Text[] = []

      for (let i = 0; i < gameOverText.length; i++) {
        const letter = new Konva.Text({
          x: this.width / 2 - (gameOverText.length * letterSpace) / 2 + i * letterSpace,
          y: -80,
          text: gameOverText[i],
          fontSize: 80,
          fontFamily: `BaseRetroWave`,
          fillLinearGradientStartPoint: victoryTextGradient.start,
          fillLinearGradientEndPoint: victoryTextGradient.end,
          fillLinearGradientColorStops: victoryTextGradient.colorStops,
          shadowBlur: 10,
        })

        letters.push(letter)
        this.victoryScreenLayer.add(letter)
      }

      this.victoryScreenLayer.batchDraw()

      const animationDuration = 2
      const animationDelay = 0.1

      letters.forEach((letter, index) => {
        const targetY = this.height / 4
        const tween = new Konva.Tween({
          node: letter,
          y: targetY,
          duration: animationDuration,
          easing: Konva.Easings.BounceEaseOut,
          delay: index * animationDelay,
          onFinish: () => {
            if (index === letters.length - 1) {
              tween.reverse()
              tween.play()
            }
          },
        })

        tween.play()
      })

      const confettiCount = 200
      const confettiColors = [`#ff9a00`, `#9a198a`, `#ff00f1`, `#fc8741`]

      for (let i = 0; i < confettiCount; i++) {
        const confettiSize = Math.random() * 20 + 30
        const confetti = new Konva.Rect({
          x: this.width / 2,
          y: this.height / 2,
          width: confettiSize,
          height: confettiSize,
          fill: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        })
    
        this.victoryScreenLayer.add(confetti)
    
        const angle = Math.random() * Math.PI * 2
        const power = 150 + Math.random() * 200
    
        confetti.zIndex(-10)
    
        const animation = new Konva.Tween({
          node: confetti,
          x: confetti.x() + Math.cos(angle) * power,
          y: confetti.y() + Math.sin(angle) * power,
          rotation: Math.random() * 360 * 5,
          opacity: 0,
          duration: 2.5,
          onFinish: () => {
            confetti.destroy()
            this.victoryScreenLayer.batchDraw()
          },
        })
    
        animation.play()
      }

      const disconnectText = new Konva.Text({
        x: this.width / 2,
        y: this.height / 2,
        text: `YOUR OPPONENT DISCONNECTED, YOU WIN BY FORFEIT!`,
        fontSize: 20,
        fontFamily: `BaseRetroWave`,
        fill: `black`,
        shadowColor: `rgba(255, 170, 0, 0.9)`,
        shadowBlur: 10,
      })
    
      disconnectText.offsetX(disconnectText.width() / 2)
    
      this.victoryScreenLayer.add(disconnectText)
    
      const buttonWidth = 150
      const buttonHeight = 40
      const buttonX = (this.width - buttonWidth) / 2
      const buttonY = this.height / 2 + 60

      const buttonGradient = {
        start: { x: -150 / 2, y: 0 },
        end: { x: 150 / 2, y: 0 },
        colorStops: [0, `#ff9a00`, 1, `#9a198a`],
      }
      const buttonRect = new Konva.Rect({
        x: buttonX,
        y: buttonY,
        width: buttonWidth,
        height: buttonHeight,
        fillLinearGradientStartPoint: buttonGradient.start,
        fillLinearGradientEndPoint: buttonGradient.end,
        fillLinearGradientColorStops: buttonGradient.colorStops,
        cornerRadius: 5,
        listening: true,
        shadowColor: `rgba(255, 154, 0, 0.9)`,
        shadowBlur: 10,
        strokeWidth: 2,
    })
    
      const buttonText = new Konva.Text({
        x: buttonX + buttonWidth / 2,
        y: buttonY + buttonHeight / 2,
        text: `HOME`,
        fontSize: 20,
        fontFamily: `BaseRetroWave`,
        fill: `white`,
        align: `center`,
        verticalAlign: `middle`,
        listening: false,
      })

        buttonText.offsetX(buttonText.width() / 2)
        buttonText.offsetY(buttonText.height() / 2)

        this.victoryScreenLayer.add(buttonRect)
        this.victoryScreenLayer.add(buttonText)

        const tooltipText = new Konva.Text({
        x: buttonX + buttonWidth / 2 - 115,
        y: buttonY + buttonHeight / 2 + 70,
        text: `JOIN MATCHMAKING AND FIND A NEW OPPONENT!`,
        fontSize: 14,
        fontFamily: `BaseRetroWave`,
        fill: `white`,
        align: `center`,
        verticalAlign: `middle`,
        listening: false,
      })

        tooltipText.offsetX(buttonText.width() / 2)
        tooltipText.offsetY(buttonText.height() / 2)

        this.victoryScreenLayer.add(tooltipText)
      
      buttonRect.on(`mouseover`, () => {
        document.body.style.cursor = `pointer`
        buttonRect.stroke(`rgba(255, 0, 255, 0.8)`)
        this.startGameLayer.batchDraw()
      })
    
      buttonRect.on(`mouseout`, () => {
        document.body.style.cursor = `default`
        buttonRect.stroke(``)
      })

      buttonRect.on(`click`, async () => {
        await router.push('/app/home')
        router.go(0)
      })
    
      this.victoryScreenLayer.add(buttonRect)
    
      this.victoryScreenLayer.batchDraw()
    }

    displayVictoryScreen(winner: `playerA` | `playerB`) {
      this.gameRunning = false
    
      this.ball.hide()
      this.scoreLayer.hide()
    
      const darkeningRect = new Konva.Rect({
        x: 0,
        y: 0,
        width: this.width,
        height: this.height,
        fill: `black`,
        opacity: 0.8,
      })
      this.victoryScreenLayer.add(darkeningRect)

      this.victoryScreenLayer.show()
      this.victoryScreenLayer.moveToTop()
    
      const rectWidth = this.width / 2
      const rectHeight = this.height / 2
      const rectX = (this.width - rectWidth) / 2
      const rectY = (this.height - rectHeight) / 2
    
      const rect = new Konva.Rect({
        x: rectX,
        y: rectY,
        width: rectWidth,
        height: rectHeight,
        cornerRadius: 10,
      })
    
      this.victoryScreenLayer.add(rect)
    
      const victoryTextGradient = {
        start: { x: -this.width / 2, y: 0 },
        end: { x: this.width / 2, y: 0 },
        colorStops: [0, `#ff9a00`, 1, `#9a198a`],
      }

      const text = new Konva.Text({
        x: this.width / 2,
        y: this.height / 2 - 60,
        text: `PLAYER ${winner === `playerA` ? `A` : `B`} WINS!`,
        fontSize: 40,
        fontFamily: `BaseRetroWave`,
        fillLinearGradientStartPoint: victoryTextGradient.start,
        fillLinearGradientEndPoint: victoryTextGradient.end,
        fillLinearGradientColorStops: victoryTextGradient.colorStops,
        shadowBlur: 10,
      })
    
      text.offsetX(text.width() / 2)
    
      this.victoryScreenLayer.add(text)

      const gameOverText = `GAME OVER`
      const letterSpace = 45
      const letters: Konva.Text[] = []

      for (let i = 0; i < gameOverText.length; i++) {
        const letter = new Konva.Text({
          x: this.width / 2 - (gameOverText.length * letterSpace) / 2 + i * letterSpace,
          y: -80,
          text: gameOverText[i],
          fontSize: 80,
          fontFamily: `BaseRetroWave`,
          fillLinearGradientStartPoint: victoryTextGradient.start,
          fillLinearGradientEndPoint: victoryTextGradient.end,
          fillLinearGradientColorStops: victoryTextGradient.colorStops,
          shadowBlur: 10,
        })

        letters.push(letter)
        this.victoryScreenLayer.add(letter)
      }

      this.victoryScreenLayer.batchDraw()

      const animationDuration = 2
      const animationDelay = 0.1

      letters.forEach((letter, index) => {
        const targetY = this.height / 4
        const tween = new Konva.Tween({
          node: letter,
          y: targetY,
          duration: animationDuration,
          easing: Konva.Easings.BounceEaseOut,
          delay: index * animationDelay,
          onFinish: () => {
            if (index === letters.length - 1) {
              tween.reverse()
              tween.play()
            }
          },
        })

        tween.play()
      })

      const confettiCount = 200
      const confettiColors = [`#ff9a00`, `#9a198a`, `#ff00f1`, `#fc8741`]

      for (let i = 0; i < confettiCount; i++) {
        const confettiSize = Math.random() * 20 + 30
        const confetti = new Konva.Rect({
          x: this.width / 2,
          y: this.height / 2,
          width: confettiSize,
          height: confettiSize,
          fill: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        })
    
        this.victoryScreenLayer.add(confetti)
    
        const angle = Math.random() * Math.PI * 2
        const power = 150 + Math.random() * 200
    
        confetti.zIndex(-10)
    
        const animation = new Konva.Tween({
          node: confetti,
          x: confetti.x() + Math.cos(angle) * power,
          y: confetti.y() + Math.sin(angle) * power,
          rotation: Math.random() * 360 * 5,
          opacity: 0,
          duration: 2.5,
          onFinish: () => {
            confetti.destroy()
            this.victoryScreenLayer.batchDraw()
          },
        })
    
        animation.play()
      }

      const scoreText = new Konva.Text({
        x: this.width / 2,
        y: this.height / 2,
        text: `${this.pongData.playerA?.score} : ${this.pongData.playerB?.score}`,
        fontSize: 30,
        fontFamily: `BaseRetroWave`,
        fill: `black`,
        shadowColor: `rgba(255, 154, 0, 0.9)`,
        shadowBlur: 10,
      })
    
      scoreText.offsetX(scoreText.width() / 2)
    
      this.victoryScreenLayer.add(scoreText)
    
      const buttonWidth = 150
      const buttonHeight = 40
      const buttonX = (this.width - buttonWidth) / 2
      const buttonY = this.height / 2 + 60

      const buttonGradient = {
        start: { x: -150 / 2, y: 0 },
        end: { x: 150 / 2, y: 0 },
        colorStops: [0, `#ff9a00`, 1, `#9a198a`],
      }
      const buttonRect = new Konva.Rect({
        x: buttonX,
        y: buttonY,
        width: buttonWidth,
        height: buttonHeight,
        fillLinearGradientStartPoint: buttonGradient.start,
        fillLinearGradientEndPoint: buttonGradient.end,
        fillLinearGradientColorStops: buttonGradient.colorStops,
        cornerRadius: 5,
        listening: true,
        shadowColor: `rgba(255, 154, 0, 0.9)`,
        shadowBlur: 10,
        strokeWidth: 2,
    })
    
      const buttonText = new Konva.Text({
        x: buttonX + buttonWidth / 2,
        y: buttonY + buttonHeight / 2,
        text: `HOME`,
        fontSize: 20,
        fontFamily: `BaseRetroWave`,
        fill: `white`,
        align: `center`,
        verticalAlign: `middle`,
        listening: false,
      })

        buttonText.offsetX(buttonText.width() / 2)
        buttonText.offsetY(buttonText.height() / 2)

        this.victoryScreenLayer.add(buttonRect)
        this.victoryScreenLayer.add(buttonText)

        const tooltipText = new Konva.Text({
        x: buttonX + buttonWidth / 2 - 115,
        y: buttonY + buttonHeight / 2 + 70,
        text: `JOIN MATCHMAKING AND FIND A NEW OPPONENT!`,
        fontSize: 14,
        fontFamily: `BaseRetroWave`,
        fill: `white`,
        align: `center`,
        verticalAlign: `middle`,
        listening: false,
      })

        tooltipText.offsetX(buttonText.width() / 2)
        tooltipText.offsetY(buttonText.height() / 2)

        this.victoryScreenLayer.add(tooltipText)
      
      buttonRect.on(`mouseover`, () => {
        document.body.style.cursor = `pointer`
        buttonRect.stroke(`rgba(255, 0, 255, 0.8)`)
        this.startGameLayer.batchDraw()
      })
    
      buttonRect.on(`mouseout`, () => {
        document.body.style.cursor = `default`
        buttonRect.stroke(``)
      })

      buttonRect.on(`click`, async () => {
        await router.push('/app/home')
        router.go(0)
      })
    
      this.victoryScreenLayer.add(buttonRect)
    
      this.victoryScreenLayer.batchDraw()
    }
    
    resetScore() {
      this.pongData.playerA!.score = 0
      this.pongData.playerB!.score = 0
      this.updateScoreText()
      this.scoreLayer.draw()
    }

    resetVictoryScreen() {
      this.victoryScreenLayer.destroyChildren()
      this.victoryScreenLayer.hide()
    }

  /* ---------------------------------------- Collisions ---------------------------------------- */

  goalScored() {
    this.gameRunning = false
    this.gameRunning = true
  }

  /* ---------------------------------------- Ball Movement ---------------------------------------- */
    
  drawBall() {
    if (this.showBall) this.updateStage()
  }

  updateBallPosition() {
    this.ball.x((this.pongData.ball.position.x) - 400)
    this.ball.y((this.pongData.ball.position.y) - 300)
  }

/* ---------------------------------------- KeyHandlers ---------------------------------------- */

      movePaddleUp(paddle: Konva.Group): void {
        const paddleY = paddle.y() - this.paddleSpeed

        if (paddleY > -3) {
          paddle.y(paddleY)
        }
      }
      
      movePaddleDown(paddle: Konva.Group): void {
        const paddleY = paddle.y() + this.paddleSpeed
        const paddleHeight = paddle.height()
        const stageHeight = this.height
        
        if (paddleY < ((stageHeight) - paddleHeight) - 100) {
            paddle.y(paddleY)
        }
      }
    
      handleKeyDown(event: KeyboardEvent): void {
        this.keysPressed[event.key] = true
      }

      handleKeyUp(event: KeyboardEvent): void {
        this.keysPressed[event.key] = false
      }

      /* ---------------------------------------- Sockets ---------------------------------------- */
      
      private _playerASocketId?: string
      private _playerBSocketId?: string

      movePaddle(paddle: Konva.Group, direction: number): void {
        if (direction > 0)
          this.movePaddleUp(paddle)
        else
          this.movePaddleDown(paddle)
        const newY = paddle.y()
        this.socket.emit(`setPlayerPosition`, newY)
      }

      setPaddlePosition(socketId: string, position: number): void {
      if (socketId === this._playerASocketId)
        this.movePaddle(this.paddleA, position)
      else if (socketId === this._playerBSocketId)
        this.movePaddle(this.paddleB, position)
    }

    handleTouchStart(event: TouchEvent): void {
      const touchY = event.touches[0].clientY
      this.touchStartPosition = touchY
    }

    handleTouchMove(event: TouchEvent, paddle: Konva.Group): void {
      if (this.touchStartPosition !== null && event.touches && event.touches.length > 0) {
        const touchY = event.touches[0].clientY
        const deltaY = touchY - this.touchStartPosition
        if (deltaY > 0) {
          this.movePaddle(paddle, -1)
        } else if (deltaY < 0) {
          this.movePaddle(paddle, 1)
        }
        this.touchStartPosition = touchY
      }
    }

    handleTouchEnd(event: TouchEvent): void {
      this.touchStartPosition = null
    }

    handleStartButtonTouch(event: TouchEvent, buttonRect: Konva.Rect): void {
      const touchX = event.touches[0].clientX
      const touchY = event.touches[0].clientY
      const startButtonWidth = 150
      const startButtonHeight = 40
      const buttonX = (this.stage.width() - startButtonWidth) / 2
      const buttonY = this.stage.height() / 2 + 20
      if (
        touchX >= buttonX &&
        touchX <= buttonX + startButtonWidth &&
        touchY >= buttonY &&
        touchY <= buttonY + startButtonHeight
      ) {
        buttonRect.fire('click')
    }
  }

  handleAgainButtonTouch(event: TouchEvent, buttonRect: Konva.Rect): void {
    const touchX = event.touches[0].clientX
    const touchY = event.touches[0].clientY
    const againButtonWidth = 150
    const againButtonHeight = 40
    const againButtonX = (this.stage.width() - againButtonWidth) / 2
    const againButtonY = this.stage.height() / 2 + 100
    if (
      touchX >= againButtonX &&
      touchX <= againButtonX + againButtonWidth &&
      touchY >= againButtonY &&
      touchY <= againButtonY + againButtonHeight
    ) {
      buttonRect.fire('click')
    }
  }
}