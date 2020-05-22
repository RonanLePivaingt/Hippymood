import { EventEmitter } from 'events';

export class MediaSession {
  constructor (song) {
    this.emitter = new EventEmitter()

    if ('mediaSession' in navigator) {
      this.setMetadata(song)
      this.setActions()
    }
  }

  setSong (song) {
    if ('mediaSession' in navigator) {
      this.setMetadata(song)
    }
  }

  setMetadata (song) {
    const songMeta = {
      title: song.song,
      artist: song.artist,
    }

    if (song.album) {
      songMeta.album = song.album
    }

    navigator.mediaSession.metadata = new MediaMetadata(songMeta);
  }

  setActions () {
      navigator.mediaSession.setActionHandler('play', () => {
        this.emitter.emit('play')
      });
      navigator.mediaSession.setActionHandler('pause', () => {
        this.emitter.emit('pause')
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        this.emitter.emit('playNext')
      });
  }
}

export default MediaSession
