import emitter from '../events/native-event';
import Professor from '../services/Api/professor';

export default async (socket) => {
  socket.on('getDetails', () => {
    emitter.on('cardReceived', async (rfid) => {
      console.log('event');
      try {
        const classDetails = await Professor.getClassDetails(rfid);
        socket.emit('classDetails', classDetails);
        emitter.removeAllListeners('cardReceived');
      } catch(error) {
        socket.emit('notFound', 'Professor not found or no classes right now!');
      }
    });  
  });
  
  socket.on('startAttendance', () => {
    emitter.on('cardReceived', async (rfid) => {
      console.log('event');
      try {
        const classDetails = await Professor.getClassDetails(rfid);
        socket.emit('classDetails', classDetails);
        emitter.removeAllListeners('cardReceived');
      } catch(error) {
        socket.emit('notFound', 'Professor not found or no classes right now!');
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('Disconnect');
    emitter.removeAllListeners('cardReceived');
  });
};
