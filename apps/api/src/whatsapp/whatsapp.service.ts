import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';

@Injectable()
export class WhatsappService implements OnModuleInit {
  private readonly logger = new Logger(WhatsappService.name);
  private client!: Client;
  private isReady = false;

  async onModuleInit() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });

    this.client.on('qr', (qr) => {
      this.logger.log('Escaneie o QR code abaixo com o WhatsApp:');
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      this.isReady = true;
      this.logger.log('WhatsApp conectado com sucesso!');
    });

    this.client.on('disconnected', () => {
      this.isReady = false;
      this.logger.warn('WhatsApp desconectado.');
    });

    await this.client.initialize();
  }

  async sendMessage(phoneNumber: string, message: string): Promise<void> {
    if (!this.isReady) {
      this.logger.warn('WhatsApp ainda não está pronto, mensagem não enviada.');
      return;
    }

    const chatId = `${phoneNumber.replace(/\D/g, '')}@c.us`;
    await this.client.sendMessage(chatId, message);
  }
}
