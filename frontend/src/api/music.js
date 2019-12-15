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
  search( value ) {
    return axios.get(`/api/search/${value}`);
  }
}
