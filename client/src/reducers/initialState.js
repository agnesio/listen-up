export default {
  concerts: [],
  auth: {
    loggedIn : false,
    token: ''
  },
  concertPaging: 1,
  userSongPaging: 1,
  user: {
    artists: [],
    hipster: null,
    genreMatrix: [],
    genreCount: 0,
    loadingMessage: '',
    email: '',
    submitted: false,
    submitting: false,
    betaOpen: false,
  },
  loading: false,
};
