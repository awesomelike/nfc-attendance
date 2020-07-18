import actions from '../controllers/actions';
import '../services/smartCard';

export default (app) => {
  app.io.on('connection', (socket) => {
    console.log('Successfully connected');
    actions(socket);
  });
};
