import Api, { execute } from './index';

export default {
	finishAttendance: (id, data) => execute(Api.post(`classItems/${id}`, data))
}