import Api, { execute } from './index';

export default {
	attend: (data) => execute(Api.post(`students/rfid`, data))
}