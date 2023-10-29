import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LogMessage } from '../../types/log';
import { Inject } from '@nestjs/common';
import { AppsService } from '../apps/apps.service';
import { ENV } from '../../config/env';
import { LogsService } from './logs.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class LogsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(AppsService.token) private readonly apps: AppsService,
    @Inject(LogsService.token) private readonly logs: LogsService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      this.checkToken(client);
      await this.checkProjectKey(client);
    } catch (err) {
      client.disconnect(true);
    }
  }

  @SubscribeMessage('log')
  async receive(@MessageBody() data: LogMessage) {
    const { appKey, ...rest } = data;

    // save log in database
    const log = await this.logs.create(appKey, {
      timestamp: new Date(),
      ...rest,
    });

    // send log to socket
    this.server.emit(appKey, {
      id: log.id,
      timestamp: log.timestamp,
      level: log.level,
      scope: log.scope,
      message: log.message,
      meta: log.meta,
    });
  }

  private getToken(client: Socket): string {
    return client.handshake.auth.token || client.handshake.headers.token;
  }
  private getAppKey(client: Socket): string {
    return client.handshake.auth.appkey || client.handshake.headers.appkey;
  }

  private checkToken(client: Socket) {
    const token = this.getToken(client);
    if (!token) throw new Error('No token provided.');

    if (token !== ENV.SOCKET_TOKEN) {
      throw new Error('Invalid token.');
    }
  }
  private async checkProjectKey(client: Socket) {
    const appKey = this.getAppKey(client);
    if (!appKey) throw new Error('No app key provided.');

    const app = await this.apps.get(appKey);
    if (!app) {
      throw new Error('App not found.');
    }
  }
}
