import smartcard from 'smartcard';
// import { EventEmitter } from '../events/Event';
import emitter from '../events/native-event';
import axios from 'axios';

const { Devices } = smartcard;
const devices = new Devices();

require('dotenv').config();
const { BASE_URL } = process.env;

devices.on('device-activated', (event) => {
  const { device } = event;
  // console.log(device.name);
  device.on('card-inserted', (event) => {
    const { card } = event;
    card
      .issueCommand('FFCA000000')
      .then(() => {
      }).catch((error) => {
        console.error(error);
      });

    card.on('response-received', async (event) => {
      const ID = event.response.getDataOnly();
      console.log(ID);
      emitter.emit('cardReceived', ID);
    });
  });
});
