import emitter from '../events/native-event';
import Professor from '../services/Api/professor';
import Student from '../services/Api/student';
import ClassItem from '../services/Api/classItem';
import store from '../store';

export default async (socket) => {
  socket.on('getDetails', () => {
    emitter.on('cardReceived', async (rfid) => {
      console.log('Received professor card');
      try {
        const classData = await Professor.getClassDetails(rfid);
        console.log('API data received');
        socket.emit('classDetails', classData);
        
        store.set('rfid', rfid);
        store.set('class', classData);
        
        console.log('stats', store.getStats());
        emitter.removeAllListeners('cardReceived');
      } catch(error) {
        console.log(error);
        socket.emit('dataError', 'Professor not found or no classes right now!');
        emitter.removeAllListeners('cardReceived');
      }
    });  
  });
  
  socket.on('startAttendance', async () => {
    try {
      // const rfid = store.get('rfid');
      // console.log('store rfid', store.get('rfid'));
      // if (!rfid) throw new Error('RFID not found');
      // const classRecords = await Professor.startAttendance(rfid);
      // socket.emit('classRecords', classRecords);
      // console.log(classRecords);
      console.log('startAttendance');
      emitter.removeAllListeners('cardReceived');
      emitter.on('cardReceived', (studentRfid) => {
        console.log('Received student card');

        socket.emit('attended', studentRfid);
        // const classData = store.get('class');
        // if (!classData) {
        //   emitter.removeAllListeners('cardReceived');
        //   throw new Error('No class going on');
        // }
        // Student.attend({
        //   rfid: studentRfid,
        //   classItemId: classData.classItem.id,
        //   sectionId: classData.sectionId,
        //   sectionNumber: classData.sectionNumber,
        //   courseName: classData.courseName,
        //   week: classData.classItem.week,
        //   date: classData.classItem.plannedDate
        // })
        //   .then(() => socket.emit('studentAttended', student))
        //   .catch(() => { throw new Error('Student card error!') });
      });
    } catch(error) {
      console.log(error.message);
      socket.emit('dataError', error.message);
    }
  });

  socket.on('finishAttendance', (classData) => {
    try {
      // const rfid = store.get('rfid');
      // if (!rfid) throw new Error('There is no professor with this RFID'); 
      
      // const classData = store.get('class');
      // if (!classData) throw new Error('There is no class going on');

      ClassItem.finishAttendance(classData.classItem.id, { rfid })
        .then(() => {
          socket.emit('classFinished');
          store.flushAll();
          emitter.removeAllListeners('cardReceived');
        })
        .catch((error) => { throw new Error(error); });
    } catch(error) {
      console.log(error.message);
      socket.emit('dataError', error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('Disconnect');
    // store.flushAll();
    emitter.removeAllListeners('cardReceived');
  });
};
