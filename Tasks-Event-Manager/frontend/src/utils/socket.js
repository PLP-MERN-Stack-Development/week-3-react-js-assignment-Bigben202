import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000'; // Adjust if needed

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ['websocket'],
}); 