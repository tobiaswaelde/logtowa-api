// import { Inject } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LogMessage } from '../../types/log';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class LogsGateway {
  @WebSocketServer()
  server: Server;

  constructor() {}

  async handleConnection(client: Socket) {
    try {
      // check token
      // check project key
    } catch (err) {
      client.disconnect(true);
    }
  }

  @SubscribeMessage('log')
  async receive(@MessageBody() data: LogMessage) {
    console.log('message received:', data);

    //TODO
  }
}
