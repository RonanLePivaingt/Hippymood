import axios from 'axios'

export default {
  getMoods() {
    return axios.get("/api/moods");
  },
  getMood( moodId, cancelToken ) {
    return axios.post(
      "/api/mood",
      { moodId },
      { cancelToken }
    );
  },
  search( value, cancelToken ) {
    return axios.get(
      `/api/search/${value}`,
      { cancelToken }
    );
  },
  getWhatsNew( page ) {
    return axios.get( `/api/whatsNew/${page}` );
  },
  postPlayedSong( songId ) {
    return axios.post( `/api/playedSong/${songId}` );
  },
  resetMoodSession( moodId ) {
    return axios.post( `/api/resetMoodSession/${moodId}` );
  },
}
