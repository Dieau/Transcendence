import { Socket, Server } from 'socket.io'
import { GamesService } from './games/games.service'
export type primitive = string | number | boolean | undefined | null
export type DeepReadonly<T> = T extends primitive ? T : DeepReadonlyObject<T>
export type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>
}

export interface PongPlayer {
  socketId: string
  isReady: boolean
  askHardMode: boolean
  position?: number
  score: number
  playerId: string
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
  gameDone: boolean
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

export class PongSession {
  private server: Server
  private _pongData: PongData = {
    isPaused: false,
    isHardMode: false,
    ball: {
      position: {
        x: 800 / 2,
        y: 600 / 2,
      },
      velocity: {
        x: 0,
        y: 0,
      },
      speed: 5,
      radius: 8,
    },
    stageWidth: 800,
    stageHeight: 600,
    paddleA: {
      x: 15,
      y: 250,
      height: 100,
      width: 15,
      speed: 15,
    },
    paddleB: {
      x: 800 - 15 * 2,
      y: 250,
      height: 100,
      width: 15,
      speed: 15,
    },
    showBall: false,
    gameDone: false,
  }

  constructor(
    readonly roomId: string,
    socket: Socket,
    server: Server,
    private readonly gameService: GamesService,
  ) {
    this.server = server
    this.playerJoin(socket)
  }

  /*------------  SETTER ------------*/

  public playerJoin({ id }: Socket): boolean {
    const playerData: PongPlayer = {
      socketId: id,
      isReady: false,
      askHardMode: false,
      score: 0,
      playerId: undefined,
    }
    if (this._pongData.playerA === undefined)
      this._pongData.playerA = playerData
    else if (this._pongData.playerB === undefined)
      this._pongData.playerB = playerData
    else return false
    return true
  }

  public playerLeave({ id }: Socket): boolean {
    if (this.socketIdIsPlayerA(id)) this._pongData.playerA = undefined
    else if (this.socketIdIsPlayerB(id)) this._pongData.playerB = undefined
    else return false
    return true
  }

  public setPlayerId({ id }: Socket, sentPlayerId: string): boolean {
    if (this.findMyPlayerWitSocketId(id).playerId === sentPlayerId)
      return false;
    this.findMyPlayerWitSocketId(id).playerId = sentPlayerId
    return true;
  }

  public async setGameFinishedNormally(): Promise<void> {
    this._pongData.gameDone = true
    try {
      const { playerA, playerB } = this._pongData
      await this.gameService.endGameOnSuccess(
        this.roomId,
        playerA.score,
        playerB.score,
        playerA.playerId,
        playerB.playerId,
      )
    } catch (error) {
      console.error(error)
    }
  }

  public async setGameFinishedAbrubtly(): Promise<void> {
    this._pongData.gameDone = true
    try {
      await this.gameService.endGameOnFailure(this.roomId)
    } catch (error) {
      console.error(error)
    }
  }

  public setGamePause(): void {
    this._pongData.isPaused = true
  }

  public setGameUnpause(): void {
    this._pongData.isPaused = false
  }

  public enableShowBall(): void {
    this._pongData.showBall = true
  }

  public disableShowBall(): void {
    this._pongData.showBall = false
  }

  public incrementPlayerScore(socketId: string): boolean {
    const playerId = socketId
    if (this.socketIdIsPlayerA(playerId)) {
      this._pongData.playerA.score += 1
      return true
    } else if (this.socketIdIsPlayerB(playerId)) {
      this._pongData.playerB.score += 1
      return true
    }
  }

  public startHardMode() {
    this._pongData.isHardMode = true
    this._pongData.paddleA.speed = 30
    this._pongData.paddleB.speed = 30
    this._pongData.ball.speed = 15
  }

  public setPlayerPosition(socket: Socket, newY: number) {
    if (this.findMyPlayerWitSocketId(socket.id) === this._pongData.playerA)
      this._pongData.paddleA.y = newY
    if (this.findMyPlayerWitSocketId(socket.id) === this._pongData.playerB)
      this._pongData.paddleB.y = newY
    return
  }

  public setPlayerReady(socket: Socket) {
    this.findMyPlayerWitSocketId(socket.id).isReady = true
  }

  public setPlayersNotReady() {
    this._pongData.playerA.isReady = false
    this._pongData.playerB.isReady = false
  }

  public setHardMode(socket: Socket) {
    this.findMyPlayerWitSocketId(socket.id).askHardMode = true
  }

  public switchPaused(socket: Socket) {
    this.findMyPlayerWitSocketId(socket.id)
    this._pongData.isPaused = !this._pongData.isPaused
  }

  public resetBall() {
    if (this._pongData.isHardMode === true) this._pongData.ball.speed = 15
    else if (this._pongData.isHardMode === false) this._pongData.ball.speed = 8
    this._pongData.ball.position.x = this._pongData.stageWidth / 2
    this._pongData.ball.position.y = this._pongData.stageHeight / 2
    const { velocity } = this._pongData.ball
    const minAngle = Math.PI / 6
    const maxAngle = (5 * Math.PI) / 6
    let randomAngle = Math.random() * (maxAngle - minAngle) + minAngle
    const avoidAngles = [Math.PI / 2, (3 * Math.PI) / 2]
    while (avoidAngles.some((angle) => Math.abs(randomAngle - angle) < 0.1)) {
      randomAngle = Math.random() * (maxAngle - minAngle) + minAngle
    }
    if (Math.random() < 0.5) {
      velocity.x = Math.sin(randomAngle)
      velocity.y = Math.cos(randomAngle)
    } else {
      velocity.x = -Math.sin(randomAngle)
      velocity.y = -Math.cos(randomAngle)
    }
  }

  /*------------  GETTER ------------*/

  get gameIsEmpty(): Readonly<boolean> {
    return !this._pongData.playerA && !this._pongData.playerB
  }

  get gameIsFull(): Readonly<boolean> {
    if (this._pongData.playerA && this._pongData.playerB) return true
  }

  get pongData(): DeepReadonly<PongData> {
    return this._pongData
  }

  get allPlayersReady(): Readonly<boolean> {
    const { playerA, playerB } = this._pongData
    return playerA.isReady === true && playerB.isReady === true
  }

  get allPlayersAskHardMode(): Readonly<boolean> {
    const { playerA, playerB } = this._pongData
    return playerA.askHardMode === true && playerB.askHardMode === true
  }

  /*------------  GAME LOGIC ------------*/

  private gameLoopInterval: NodeJS.Timeout | null = null
  public gameLoopRunning: boolean
  private ballStateBeforePause: {
    position: {
      x: number
      y: number
    }
    velocity: {
      x: number
      y: number
    }
  }

  public startGameLoop(): void {
    if (this.gameLoopInterval || this._pongData.isPaused) {
      return
    }

    this.setPlayersNotReady()

    const GAME_LOOP_INTERVAL = 1000 / 60 // Environ 60 FPS
    this.ballStateBeforePause = { ...this._pongData.ball } //hors de la boucle??
    this.gameLoopInterval = setInterval(() => {
      this.gameLoopRunning = true
      this.moveBall()
      this.collisionCheck()
      this.server.to(this.roomId).emit(`updatePongData`, this.pongData)
      if (!this.gameLoopRunning) this.stopGameLoop()
    }, GAME_LOOP_INTERVAL)
  }

  public stopGameLoop(): void {
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval)
      this.gameLoopInterval = null
      this.gameLoopRunning = false
    }
  }

  public resumeGameLoop(): void {
    if (this._pongData.isPaused) return
    this._pongData.ball = {
      ...this._pongData.ball,
      ...this.ballStateBeforePause,
    }
    this.startGameLoop()
  }

  private moveBall(): void {
    const ballX =
      this._pongData.ball.position.x +
      this._pongData.ball.speed * this._pongData.ball.velocity.x
    const ballY =
      this._pongData.ball.position.y +
      this._pongData.ball.speed * this._pongData.ball.velocity.y
    this._pongData.ball.position.x = ballX
    this._pongData.ball.position.y = ballY
  }

  private collisionCheck(): void {
    const ballNextY =
      this._pongData.ball.position.y +
      this._pongData.ball.speed * this._pongData.ball.velocity.y

    if (
      ballNextY <= this._pongData.ball.radius ||
      ballNextY >= this._pongData.stageHeight - this._pongData.ball.radius
    ) {
      this._pongData.ball.velocity.y *= -1
    }

    const paddleLeftX = this._pongData.paddleA.x
    const paddleLeftY = this._pongData.paddleA.y
    const paddleRightX = this._pongData.paddleB.x
    const paddleRightY = this._pongData.paddleB.y
    const paddleWidth = this._pongData.paddleA.width
    const paddleHeight = this._pongData.paddleA.height
    const ballX = this._pongData.ball.position.x
    const ballY = this._pongData.ball.position.y

    if (
      ballX - this._pongData.ball.radius <= paddleLeftX + paddleWidth &&
      ballY >= paddleLeftY &&
      ballY <= paddleLeftY + paddleHeight
    ) {
      this._pongData.ball.position.x =
        paddleLeftX + paddleWidth + this._pongData.ball.radius
      this._pongData.ball.velocity.x *= -1
      this._pongData.ball.speed += 0.5
    }

    if (
      ballX + this._pongData.ball.radius >= paddleRightX &&
      ballY >= paddleRightY &&
      ballY <= paddleRightY + paddleHeight
    ) {
      this._pongData.ball.position.x = paddleRightX - this._pongData.ball.radius
      this._pongData.ball.velocity.x *= -1
      this._pongData.ball.speed += 0.5
    }

    if (
      this._pongData.ball.position.x - this._pongData.ball.radius <= 0 &&
      this._pongData.playerB
    ) {
      const playerBId = this._pongData.playerB.socketId
      this.incrementPlayerScore(playerBId)
      this.resetBall()
      this.updateScore()
    } else if (
      this._pongData.ball.position.x + this._pongData.ball.radius >=
        this._pongData.stageWidth &&
      this._pongData.playerA
    ) {
      const playerAId = this._pongData.playerA.socketId
      this.incrementPlayerScore(playerAId)
      this.resetBall()
      this.updateScore()
    }
  }

  public updateScore() {
    this.resetBall()
    this.server.to(this.roomId).emit(`updateScore`, this.pongData)
    if (this._pongData.playerA && this._pongData.playerA.score >= 11) {
      this.server.to(this.roomId).emit(`victory`, `playerA`)
      this.stopGameLoop()
      this.setPlayersNotReady()
      this.setGameFinishedNormally()
    } else if (this.pongData.playerB && this.pongData.playerB.score >= 11) {
      this.stopGameLoop()
      this.setPlayersNotReady()
      this.setGameFinishedNormally()
      this.server.to(this.roomId).emit(`victory`, `playerB`)
    }
  }

  public gameOverDisconnect(): void {
    if (this._pongData.playerA) {
      this.server.to(this.roomId).emit(`gameOverDisconnect`)
      this.stopGameLoop()
      this.setGameFinishedAbrubtly()
    } else if (this.pongData.playerB) {
      this.stopGameLoop()
      this.setGameFinishedAbrubtly()
      this.server.to(this.roomId).emit(`gameOverDisconnect`)
    }
  }

  /*------------  UTILS ------------*/

  private socketIdIsPlayerA(socketId: string): boolean {
    return this._pongData.playerA?.socketId === socketId
  }

  private socketIdIsPlayerB(socketId: string): boolean {
    return this._pongData.playerB?.socketId === socketId
  }

  private findMyPlayerWitSocketId(socketId: string) {
    if (this.socketIdIsPlayerA(socketId)) return this._pongData.playerA
    if (this.socketIdIsPlayerB(socketId)) return this._pongData.playerB
    throw new Error()
  }
}
