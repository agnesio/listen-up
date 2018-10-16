export default {
  concerts: {
    concerts: [],
    page: 1,
    noResults: false
  },
  player: {
    nowPlaying: '',
    playing: false
  },
  auth: {
    loggedIn : false,
    token: '',
    loading: false
  },
  user: {
    artists: [],
    hipster: null,
    genreMatrix: [],
    genreCount: 0,
    loadingMessage: '',
    email: '',
    pic: '',
    submitted: false,
    submitting: false,
    betaOpen: false,
    recentArtists: [],
    recentGenres: [],
  },
  location: {
    name: '',
    search: '',
    id: '',
    coords: [38.9127254, -77.0148525]
  },
  nav: {
    currPage: '',
    navOpen: false
  }
};
