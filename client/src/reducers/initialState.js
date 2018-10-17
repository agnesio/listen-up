import moment from 'moment';
export default {
  concerts: {
    concerts: [],
    page: 1,
    noResults: false,
    startDate: moment(),
    endDate: moment().add(1, 'months')
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
    recentArtists: [],
    recentGenres: [],
    addedSongs: [],
    formEmail: '',
    feedback: '',
    mailingList: [],
    feedbackList: []
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
