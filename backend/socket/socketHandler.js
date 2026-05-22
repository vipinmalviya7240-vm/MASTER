export default function socketHandler(io) {
  const rooms = new Map(); // Keep track of active users per room

  io.on('connection', (socket) => {
    console.log(`🔌 Interactive socket client connected: ${socket.id}`);

    // Join collaborative study room
    socket.on('join_room', ({ roomId, username }) => {
      socket.join(roomId);
      socket.username = username || 'Anonymous Learner';
      socket.currentRoomId = roomId;

      // Update room users map
      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
      }
      rooms.get(roomId).add(username);

      console.log(`👤 User '${username}' joined collaborative room: ${roomId}`);

      // Broadcast active user lists to the room
      io.to(roomId).emit('room_users', Array.from(rooms.get(roomId)));
      
      // Notify other room users
      socket.to(roomId).emit('notification', {
        type: 'info',
        message: `${username} joined the study session.`
      });
    });

    // Real-time peer message exchange inside rooms
    socket.on('send_message', ({ roomId, message, username }) => {
      io.to(roomId).emit('new_message', {
        sender: username || 'Anonymous Learner',
        text: message,
        timestamp: new Date().toLocaleTimeString()
      });
    });

    // Whiteboard drawing coordinate sync
    socket.on('draw_coords', ({ roomId, prevX, prevY, currX, currY, color, width }) => {
      // Broadcast coordinates to other users in the room to paint
      socket.to(roomId).emit('peer_draw', {
        prevX, prevY, currX, currY, color, width
      });
    });

    // Global achievements broadcasting trigger
    socket.on('achievement_unlocked', ({ username, badgeName }) => {
      io.emit('global_achievement', {
        message: `🔥 Dynamic accomplishment! ${username} unlocked the '${badgeName}' Master Badge!`
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 Socket client disconnected: ${socket.id}`);
      
      if (socket.currentRoomId && socket.username) {
        const roomId = socket.currentRoomId;
        if (rooms.has(roomId)) {
          rooms.get(roomId).delete(socket.username);
          if (rooms.get(roomId).size === 0) {
            rooms.delete(roomId);
          } else {
            io.to(roomId).emit('room_users', Array.from(rooms.get(roomId)));
          }
        }

        socket.to(roomId).emit('notification', {
          type: 'info',
          message: `${socket.username} left the study session.`
        });
      }
    });

  });
}
