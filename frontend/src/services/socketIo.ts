import {  Manager } from "socket.io-client"
import { getHeadersWs } from "./header"

const manager = new Manager({ extraHeaders: getHeadersWs() })

export const refreshSocket = () => {
  socket.disconnect()
  manager.opts.extraHeaders =  getHeadersWs()
  socket.connect()
}

export const socket = manager.socket(`/`) 