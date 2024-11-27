// import express from "express"
import { WebSocketServer,WebSocket } from 'ws'
import { Pubsub } from './Pubsubmanager';
const serverA:WebSocketServer = new WebSocketServer({port:3000})

serverA.on('connection', function connection(ws) {
  ws.on('error', console.error);
  // console.log(serverA.clients)
  ws.on('message', function message(data:any, isBinary:any) {
    Pubsub.getInstance().usersubscribe(data.toString(),ws)   
  })

  ws.on('close',(data)=>{
    Pubsub.getInstance().unsubscribe("car",ws)   
  
  })
  // make a custom event to unsubscribe from a ticker
})

// const serverB:WebSocketServer = new WebSocketServer({port:3001})

// serverB.on('connection', function connection(ws) {
//   ws.on('error', console.error);
//   // console.log(serverB.clients)
//   ws.on('message', function message(data:any, isBinary:any) {
//     Pubsub.getInstance().usersubscribe(data.toString(),ws)   
//   })
//   ws.on('close',(data)=>{
//     Pubsub.getInstance().unsubscribe("car",ws)   
  
//   })  
// })
