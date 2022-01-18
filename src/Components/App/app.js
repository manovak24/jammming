import React from 'react';
import './app.css';
import SearchBar from '../../Components/SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'The Mix Tape',
      playlistTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }

    tracks.push(track);
    this.setState({ playlistTracks: tracks });
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id)
    this.setState({ playlistTracks: tracks });
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track=>track.uri);
    if (trackURIs && trackURIs.length) {
      Spotify.savePlaylist(this.state.playlistName, trackURIs).then(()=>{
        this.setState({
          playlistName: 'New Playlist',
          playlistTracks: []
        })
      });
    } else {
      alert("Playlist Empty");
    }  
  }

  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({ searchResults: searchResults })
    })
  }

  render() {
    return (
      <div>
        <h1>MUSIC<span className="highlight">for</span>YOU</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults}
              onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist} />
          </div>
        </div>
        
        <div className="footer">
            <a href="https://www.linkedin.com/in/mark-novak-56679949/" className="linkedin social" rel="noopener noreferrer" target="_blank">
                  <FontAwesomeIcon icon={faLinkedin} size="2x" />
            </a>
            <a href="https://manovak24.github.io/" rel="noopener noreferrer" target="_blank">
              <p>Mark Novak</p>
            </a>
            
            <a href="https://github.com/manovak24" className="github social" rel="noopener noreferrer" target="_blank">
                  <FontAwesomeIcon icon={faGithub} size="2x" />
            </a>
          </div>
      </div>
    )
  }
}

export default App;
