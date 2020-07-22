import { EventEmitter } from 'events';

export class MediaSession {
  constructor (song, mood) {
    this.emitter = new EventEmitter()

    if ('mediaSession' in navigator) {
      this.setMetadata(song, mood)
      this.setActions()
    }
  }

  setSong (song, mood) {
    if ('mediaSession' in navigator) {
      this.setMetadata(song, mood)
    }
  }

  setMetadata (song, mood) {
    const songMeta = {
      title: song.song,
      artist: song.artist,
      artwork: [
        { src: `/tmp/thumbnails/${encodeURIComponent(mood.name)}-512x512.png`,   sizes: '512x512',   type: 'image/png' },
      ],
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
