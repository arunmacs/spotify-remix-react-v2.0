import {Component} from 'react'
import Player from '../Player'
import LoaderView from '../LoaderView'
// import SongItem from '../SongItem'
// import MusicPlayer from '../MusicPlayer'
// import AlbumDisplayInfo from '../AlbumDisplayInfo'
// import BackNavigation from '../BackNavigation'
import './index.css'

class EditorPickPlaylist extends Component {
  state = {
    musicList: [],
    displayInfo: {},
    // playingSong: {},
    isLoading: true,
    // pause: false,
  }

  componentDidMount() {
    this.getSpecificItem()
  }

  getAccessToken = () => {
    const token = localStorage.getItem('pa_token', '')
    return token
  }

  sessionTimedOut = () => {
    const {history} = this.props
    // const token = this.getAccessToken()
    localStorage.removeItem('pa_token')

    history.replace('/login')
  }

  getSpecificItem = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const token = this.getAccessToken()
    const specificItemApiUrl = `https://api.spotify.com/v1/users/spotify/playlists/${id}`

    const specificItemOptions = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }

    const response = await fetch(specificItemApiUrl, specificItemOptions)

    if (response.ok === true) {
      const data = await response.json()
      //   console.log(data, 'data')

      const updatedPlaylistInfo = {
        collaborative: data.collaborative,
        description: data.description,
        externalUrls: data.external_urls,
        href: data.href,
        id: data.id,
        images: data.images,
        name: data.name,
        owner: data.owner,
        primaryColor: data.primary_color,
        public: data.public,
        snapshotId: data.snapshot_id,
        // tracks: data.tracks,
        type: data.type,
        uri: data.uri,
      }

      console.log(data, 'DataNull')

      const updatedTracksData = data.tracks.items.map(item => ({
        album: item.track.album,
        artists: item.track.artists,
        availableMarkets: item.track.available_markets,
        discNumber: item.track.disc_number,
        durationMs: item.track.duration_ms,
        episode: item.track.episode,
        explicit: item.track.explicit,
        externalIds: item.track.external_ids,
        externalUrls: item.track.external_urls,
        href: item.track.href,
        id: item.track.id,
        isLocal: item.track.is_local,
        name: item.track.name,
        popularity: item.track.popularity,
        previewUrl: item.track.preview_url,
        track: item.track.track,
        trackNumber: item.track.track_number,
        type: item.track.type,
        uri: item.track.uri,
      }))

      //   console.log(updatedTracksData)

      this.setState({
        musicList: updatedTracksData,
        displayInfo: updatedPlaylistInfo,
        // playingSong: updatedTracksData[0],
        isLoading: false,
      })
    } else {
      this.sessionTimedOut()
    }
  }

  render() {
    const {isLoading, displayInfo, musicList} = this.state
    // console.log(displayInfo, ' editPlay')

    return (
      <div>
        {isLoading ? (
          <LoaderView />
        ) : (
          <Player
            displayInfo={displayInfo}
            musicList={musicList}
            // playingSong={playingSong}
          />
        )}
      </div>
    )
  }
}

export default EditorPickPlaylist
