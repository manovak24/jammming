import React from 'react';
import './Playlist.css';
import TrackList from '../TrackList/TrackList';

class Playlist extends React.Component {
	constructor(props) {
		super(props);
		this.handleNameChange = this.handleNameChange.bind(this);
		this.save = this.save.bind(this);
	}

	handleNameChange(event) {
		this.props.onNameChange(event.target.value);
	}
	
	save() {
		this.props.onSave();
	}

	render() {
		return (
			<div className="Playlist">
				<input 
				defaultValue={'New Playlist'} 
				onChange={this.handleNameChange}
				onKeyPress={event => {
					if (event.key === "Enter") {
						this.save();
					}
				}} />
				<TrackList tracks={this.props.playlistTracks}
					onRemove={this.props.onRemove}
					isRemoval={true} />
				<button className="Playlist-save" onClick={this.save}>SAVE TO SPOTIFY</button>
			</div>
		)
	}
}

export default Playlist;