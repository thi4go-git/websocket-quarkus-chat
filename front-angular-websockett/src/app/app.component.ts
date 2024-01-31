import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  name: string = 'cavalo';
  connected: boolean = false;
  connectionStatus: string = 'Não Conectado.';
  chatContent: string[] = [];
  message: string = '';
  socket: WebSocket | undefined;

  ngOnInit(): void {
    this.connect();
  }

  connect() {
    if (!this.connected) {
      if (this.name) {
        this.socket = new WebSocket(`ws://localhost:8080/chat/${this.name}`);
        this.socket.onopen = () => {
          this.connectionStatus = 'Status: Conectado';
          this.connected = true;
          this.message = '';
          this.name = '';
          if (this.socket != undefined) {
            // this.socket.send(JSON.stringify({ type: 'join', name: this.name }));
            this.socket.send('Conectei!');
          }
          this.message = '';
        };
        this.socket.onmessage = (event) => {
          // const data = JSON.parse(event.data);
          const data = event.data;
          if (event.type === 'message') {
            // this.chatContent += `${data}\n`;
            this.chatContent.push(`${data}`);
          }
        };
      } else {
        alert('Informe o seu Nome para acessar o Chat!');
      }
    }
  }


  sendMessage() {
    if (this.connected) {
      const value = this.message;
      if (this.socket != undefined) {
        this.socket.send(JSON.stringify({ type: 'message', message: value }));
      }

      this.message = '';
    }
  }

  scrollToBottom() {
    const chatElement = document.getElementById('chat');
    if (chatElement) {
      chatElement.scrollTop = chatElement.scrollHeight;
    }
  }

}
