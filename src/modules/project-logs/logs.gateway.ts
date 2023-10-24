import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LogMessage } from '../../types/log';
import { Inject } from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service';
import { ENV } from '../../config/env';
import { LogsService } from './logs.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class LogsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(ProjectsService.token) private readonly projects: ProjectsService,
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
    const { projectKey, ...rest } = data;

    // save log in database
    const log = await this.logs.create(projectKey, {
      timestamp: new Date(),
      ...rest,
    });

    // send log to socket
    this.server.emit(projectKey, {
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
  private getProjectKey(client: Socket): string {
    return client.handshake.auth.projectkey || client.handshake.headers.projectkey;
  }

  private checkToken(client: Socket) {
    const token = this.getToken(client);
    if (!token) throw new Error('No token provided.');

    if (token !== ENV.SOCKET_TOKEN) {
      throw new Error('Invalid token.');
    }
  }
  private async checkProjectKey(client: Socket) {
    const projectKey = this.getProjectKey(client);
    if (!projectKey) throw new Error('No project key provided.');

    const project = await this.projects.get(projectKey);
    if (!project) {
      throw new Error('Project not found.');
    }
  }
}
