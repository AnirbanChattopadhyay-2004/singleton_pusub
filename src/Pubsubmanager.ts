import { createClient, RedisClientType } from "redis";
import { WebSocket, WebSocketServer } from "ws";
export class Pubsub {
  private stocksmap: Map<string, WebSocket[]>;
  private static instance: Pubsub;
  private client: RedisClientType;
  private constructor() {
    this.stocksmap = new Map();
    this.client = createClient();
    this.client.connect();
  }
  static getInstance() {
    if (Pubsub.instance) {
      return Pubsub.instance;
    }
    Pubsub.instance = new Pubsub();
    return Pubsub.instance;
  }
  public usersubscribe(stock: string, wsclient: WebSocket) {
    if (this.stocksmap.has(stock)) {
      let mn = this.stocksmap.get(stock);
      if (!mn) {
        return;
      }
      mn.push(wsclient);
      this.stocksmap.set(stock, mn);
    } else {
      let a: WebSocket[] = [];
      a.push(wsclient);
      this.stocksmap.set(stock, a);
    }
    console.log(this.stocksmap.get(stock)?.length);
    if (this.stocksmap.get(stock)?.length === 1) {
      this.client.subscribe(stock, (message: string) => {
        // websocket logic here
        this.handlemessage(stock, message);
      });
    }
  }
  public unsubscribe(stock: string, wsclient: WebSocket) {
    // console.log('hi ' + this.stocksmap.get(stock)?.length)
    let a: any = this.stocksmap
      .get(stock)
      ?.filter((client) => client !== wsclient);
    this.stocksmap.set(stock, a);

    // console.log('bye ' + this.stocksmap.get(stock)?.length)
    if (a?.length == 0) this.client.unsubscribe(stock);
  }
  public handlemessage(stock: string, message: string) {
    let a = this.stocksmap.get(stock);
    if(!a){
        return;
    }
    console.log(a.length);
    a.forEach((wsclient: WebSocket) => {
      console.log("hi");
      wsclient.send(message);
    });
  }
}
