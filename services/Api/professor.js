import Api, { execute } from './index';

export default {
	getClassDetails: (rfid) => execute(Api.get(`professors/${rfid}/currentClass`)),
	startAttendance: (rfid) => execute(Api.post('professors/rfid', { rfid }))
}