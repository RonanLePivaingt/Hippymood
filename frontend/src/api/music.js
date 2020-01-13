import axios from 'axios'

export default {
  getMoods() {
    return axios.get("/api/moods");
  },
  getMood( moodId ) {
    return axios.post(
      "/api/mood",
      { moodId }
    );
  },
  getWhatsNew( page ) {
    return axios.get( `/api/whatsNew/${page}` );
  },
}
