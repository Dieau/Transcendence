import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
} from '@nestjs/websockets'
import { Socket, Server } from 'socket.io'
import { PongSession } from './pongSession'
import { GamesService } from './games/games.service'

export type primitive = string | number | boolean | undefined | null
export type DeepReadonly<T> = T extends primitive ? T : DeepReadonlyObject<T>
export type DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>
}

@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly gameService: GamesService) {}
  @WebSocketServer()
  server: Server

  private pongSessions: Map<string, PongSession> = new Map()

  // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
  handleConnection(@ConnectedSocket() socket: Socket) {
    //
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    const { roomId } = socket.data
    if (roomId === undefined) return
    const pongSession = this.pongSessions.get(roomId)
    if (pongSession) {
      pongSession.playerLeave(socket)
      if (pongSession.gameIsEmpty) this.pongSessions.delete(roomId)
      socket.leave(roomId)
      socket.data.roomId = undefined
      pongSession.gameOverDisconnect()
      this.server.to(roomId).emit(`updatePongData`, pongSession.pongData)
    }
  }

  @SubscribeMessage(`changedPage`)
  userChangedPageDisconnect(socket: Socket) {
    const { roomId } = socket.data
    if (roomId === undefined) return
    const pongSession = this.pongSessions.get(roomId)
    if (pongSession) {
      pongSession.playerLeave(socket)
      if (pongSession.gameIsEmpty) this.pongSessions.delete(roomId)
      socket.leave(roomId)
      socket.data.roomID = undefined
      if (!pongSession.pongData.gameDone) pongSession.gameOverDisconnect()
      this.server.to(roomId).emit(`updatePongData`, pongSession.pongData)
    }
    this.server.to(roomId).emit(`opponentLeft`)
  }

  /*------------  GAME ACTIONS ------------*/

  @SubscribeMessage(`setPlayerPosition`)
  setPlayerPosition(socket: Socket, position: number) {
    const { roomId } = socket.data
    const pongSession = this.pongSessions.get(roomId)
    pongSession.setPlayerPosition(socket, position)
    this.server.to(roomId).emit(`updatePongData`, pongSession.pongData)
  }

  @SubscribeMessage(`pauseGameRequest`)
  pauseGame(socket: Socket) {
    const { roomId } = socket.data
    const pongSession = this.pongSessions.get(roomId)
    if (!pongSession.pongData.playerA || !pongSession.pongData.playerB) return
    if (this.isInCountdown) return
    pongSession.setGamePause()
    pongSession.stopGameLoop()
    if (pongSession)
      this.server.to(roomId).emit(`gameIsPaused`, pongSession.pongData)
  }

  @SubscribeMessage(`unpauseGameRequest`)
  unpauseGame(socket: Socket) {
    const { roomId } = socket.data
    const pongSession = this.pongSessions.get(roomId)
    if (!pongSession.pongData.playerA || !pongSession.pongData.playerB) return
    this.countdownUnpause(pongSession, 3, socket)
    pongSession.setGameUnpause()
    if (pongSession)
      this.server.to(roomId).emit(`gameIsUnpaused`, pongSession.pongData)
  }

  @SubscribeMessage(`setHardMode`)
  setHardMode(socket: Socket) {
    const { roomId } = socket.data
    const pongSession = this.pongSessions.get(roomId)
    if (!pongSession.pongData.playerA || !pongSession.pongData.playerB) return
    pongSession.setHardMode(socket)
    this.server.to(roomId).emit(`updatePongData`, pongSession.pongData)
    if (pongSession) {
      if (
        pongSession.pongData.playerA.askHardMode &&
        !pongSession.pongData.playerB.askHardMode
      )
        this.server.to(roomId).emit(`playerAskHardMode`, `Player A`)
      else if (
        pongSession.pongData.playerB.askHardMode &&
        !pongSession.pongData.playerB.askHardMode
      )
        this.server.to(roomId).emit(`playerAskHardMode`, `Player B`)
    }
    if (pongSession.allPlayersAskHardMode) pongSession.startHardMode()
  }

  @SubscribeMessage(`setPlayerReady`)
  setPlayerReady(socket: Socket) {
    const { roomId } = socket.data
    const pongSession = this.pongSessions.get(roomId)
    if (!pongSession.pongData.playerA || !pongSession.pongData.playerB) {
      return
    }
    pongSession.setPlayerReady(socket)
    this.server.to(roomId).emit(`updatePongData`, pongSession.pongData)
    if (pongSession) {
      if (
        pongSession.pongData.playerA.isReady &&
        !pongSession.pongData.playerB.isReady
      )
        this.server.to(roomId).emit(`playerReady`, `Player A`)
      else if (
        pongSession.pongData.playerB.isReady &&
        !pongSession.pongData.playerB.isReady
      )
        this.server.to(roomId).emit(`playerReady`, `Player B`)
    }
    if (pongSession.allPlayersReady) {
      this.countdownGameReady(pongSession, 3, socket)
    }
  }

  @SubscribeMessage(`switchPaused`)
  switchPaused(socket: Socket) {
    const { roomId } = socket.data
    const pongSession = this.pongSessions.get(roomId)
    pongSession.switchPaused(socket)
    this.server.to(roomId).emit(`updatePongData`, pongSession.pongData)
  }

  /*------------  GAME ACTIONS UTILS ------------*/

  countdownGameReady(pongSession: PongSession, amount = 3, socket: Socket) {
    const serverTime = Date.now()
    if (amount === 0) {
      this.server
        .to(pongSession.roomId)
        .emit(`setCountdown`, { amount: 0, serverTime })
      this.server
        .to(pongSession.roomId)
        .emit(`updatePongData`, pongSession.pongData)
      if (!pongSession.gameIsFull) {
        //this.prisma.game.delete bogue
        pongSession.gameOverDisconnect()
        return
      }
      pongSession.enableShowBall()
      pongSession.resetBall()
      this.startGameLoop(this.server, socket)
    } else {
      this.server
        .to(pongSession.roomId)
        .emit(`setCountdown`, { amount, serverTime })
      setTimeout(
        () => this.countdownGameReady(pongSession, --amount, socket),
        1000,
      )
    }
  }

  private isInCountdown: boolean
  countdownUnpause(pongSession: PongSession, amount = 3, socket: Socket) {
    this.isInCountdown = true
    const serverTime = Date.now()
    if (amount === 0) {
      this.server
        .to(pongSession.roomId)
        .emit(`setCountdown`, { amount: 0, serverTime })
      this.resumeGameLoop(this.server, socket)
    } else {
      this.server
        .to(pongSession.roomId)
        .emit(`setCountdown`, { amount, serverTime })
      setTimeout(
        () => this.countdownUnpause(pongSession, --amount, socket),
        1000,
      )
    }
  }

  startGameLoop(server: Server, socket: Socket) {
    const { roomId } = socket.data
    const pongSession = this.pongSessions.get(roomId)
    if (pongSession.gameLoopRunning) return
    pongSession.startGameLoop()
  }

  resumeGameLoop(server: Server, socket: Socket) {
    this.isInCountdown = false
    const { roomId } = socket.data
    const pongSession = this.pongSessions.get(roomId)
    if (pongSession.gameLoopRunning) return
    pongSession.resumeGameLoop()
  }

  /*------------  JOIN AND LEAVE ------------*/

  @SubscribeMessage(`joinRoom`)
  joinRoom(socket: Socket, roomId: string) {
    const joinSessionSuccess = (pongSession: PongSession) => {
      if (pongSession.pongData.gameDone) {
        joinSessionError(`THE GAME IS ALREADY FINISHED! TRY ANOTHER ONE.`)
        return
      }
      socket.join(pongSession.roomId)
      socket.data.roomId = pongSession.roomId
      socket.emit(`joinRoomSuccess`, pongSession.pongData)
      socket.to(roomId).emit(`updatePongData`, pongSession.pongData)
    }

    const joinSessionError = (message: string, pongSession?: PongSession) => {
      socket.emit(`joinRoomError`, { message }, pongSession)
      socket.emit(`joinRoomErrorDone`)
    }

    if (this.pongSessions.has(roomId)) {
      const session = this.pongSessions.get(roomId)
      if (session.gameIsFull) {
        joinSessionError(`ROOM IS FULL! TRY ANOTHER ONE.`, session)
        return
      }
      if (session.playerJoin(socket)) joinSessionSuccess(session)
      else joinSessionSuccess(session)
    } else {
      const pongSession = new PongSession(
        roomId,
        socket,
        this.server,
        this.gameService,
      )
      this.pongSessions.set(roomId, pongSession)
      joinSessionSuccess(pongSession)
    }
  }

  @SubscribeMessage(`setPlayerId`)
  setPlayerId(socket: Socket, playerId: string) {
    const { roomId } = socket.data
    const pongSession = this.pongSessions.get(roomId)
    pongSession.setPlayerId(socket, playerId)
  }

  @SubscribeMessage(`leaveRoom`)
  leaveRoom(socket: Socket) {
    const leaveSessionSuccess = (pongSession: PongSession) => {
      socket.leave(pongSession.roomId)
      socket.data.roomId = undefined
      socket.emit(`leaveRoomSuccess`)

      if (pongSession.gameIsEmpty) {
        this.pongSessions.delete(pongSession.roomId)
      } else {
        this.server.to(roomId).emit(`updatePongData`, pongSession.pongData)
      }
    }

    const leaveSessionError = (message: string) => {
      socket.emit(`leaveRoomError`, { message })
    }

    const { roomId } = socket.data
    if (roomId === undefined) {
      leaveSessionError(`RoomId is undefined`)
    }
    if (!this.pongSessions.has(roomId)) {
      leaveSessionError(`PongSession does not exist`)
    }
    const pongSession = this.pongSessions.get(roomId)
    if (pongSession) {
      this.server.to(roomId).emit(`opponentLeft`)
      pongSession.playerLeave(socket)
      if (pongSession.gameIsEmpty) {
        this.pongSessions.delete(roomId)
      }
      leaveSessionSuccess(pongSession)
    }
  }
}
