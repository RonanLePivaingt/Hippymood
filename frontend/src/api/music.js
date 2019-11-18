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

}
