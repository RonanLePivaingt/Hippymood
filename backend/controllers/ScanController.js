const config = require('config');
const globby = require('globby');
const mm = require('music-metadata');
const pLimit = require('p-limit');
const dbConfig = require('../dbConfig.js');
const knex = require('knex')(dbConfig);

// Global variables used around
let artists = [];
let genres = [];
let albums = [];
let songs = [];

/**
 * Scan the music directory to create or update the database
 * @param {req} Express request
 * @param {res} Express response
 * @param {isCli} Boolean to change behavior if launched from CLI
 */
function ScanMusic(req, res, isCli = false) {
  console.log("Starting music scan");

  const musicPath = config.get('music.path') + "/**/*.mp3";

  globby([musicPath], { stats: true })
    .then(files => getMetadata(files))
    .then(filesMeta => checkMetadata(filesMeta))
    .then(filesToUpsert => songsUpsert(filesToUpsert))
    .then(result => {
      console.log(result);

      process.exit();
    })
  ;
};

module.exports.ScanMusic = ScanMusic;

/**
 * Create an array of files paths with audio metadata
 *
 * @param {files} Array of files paths
 * @returns {Array.<{path: String, metadata: Object}>} Array of objects containing files path and metadata
 */
function getMetadata(files) {
  return new Promise(async (resolve, reject) => {
    const concurrency = config.get('music.scanConcurrency');
    const limit = pLimit(concurrency ? concurrency : 4);

    console.log(files.length, 'mp3 files found');

    const promises = [];
    for (let i = 0; i < files.length; i++) {
      promises.push(
        limit(() => mm.parseFile(files[i].path, { native: true }))
      );
    }

    const metadata = await Promise.all(promises);

    const filesMeta = [];
    for (let j = 0; j < files.length; j++) {
      metadata[j].youtube = youtubeUrlFromMetadata(metadata[j]);

      filesMeta.push(
        {
          path: files[j].path,
          birthtime: files[j].stats.birthtime,
          metadata: metadata[j]
        }
      );
    }

    if (filesMeta.length) {
      resolve(filesMeta);
    } else {
      reject("No mp3 files found");
    }
  });
}

/**
 * Create an array of files with enough metadata to be added to the database
 *
 * @param {Array.<{path: String, metadata: Object}>} Array of objects containing files path and metadata
 * @returns {Array.<{path: String, metadata: Object}>} Array of objects containing files path and metadata
 */
function checkMetadata(filesMeta) {
  return new Promise((resolve, reject) => {
    const filesToUpsert = [];

    for (let n = 0; n < filesMeta.length; n++) {
      if (filesMeta[n].metadata.common.artist &&
          filesMeta[n].metadata.common.title &&
          filesMeta[n].metadata.common.genre &&
          filesMeta[n].metadata.common.genre[0])
        filesToUpsert.push(filesMeta[n]);
    }

    if (filesToUpsert.length) {
      console.log(filesToUpsert.length, "songs with enough metadata");
      resolve(filesToUpsert);
    } else {
      reject("No files to upsert");
    }
  });
}


/**
 * Check if the song is already in database and insert it if not
 *
 * @param {Array.<{path: String, metadata: Object, birthtime: Date}>} Array of objects containing files path, metadata and birthtime
 * @returns String telling music scan is finished
 */
function songsUpsert(filesToUpsert) {
  return new Promise(async (resolve, reject) => {
    const songsToInsert = [];
    const genreRelationsToInsert = [];
    global.artists = await knex('artists');
    global.albums = await knex('albums');
    global.genres = await knex('genres');
    global.songs = await knex
      .select('songs.*', 'genres_relations.id as genre_id')
      .from('songs')
      .leftJoin('genres_relations', 'songs.id', 'genres_relations.id_song');

    for (let p = 0; p < filesToUpsert.length; p++) {
      const artistId = await getIdFromTable('artists', filesToUpsert[p].metadata.common.artist);
      const albumId = await getIdFromTable('albums', filesToUpsert[p].metadata.common.album);
      const genreId = await getIdFromTable('genres', filesToUpsert[p].metadata.common.genre[0]);
      // Removing prefix from path and encoding special characters
      const songPath = encodeURIComponent(
        filesToUpsert[p].path.slice(
          config.get('music.path').length + 1
        )
      );


      // Check if the song is a duplicate
      const songExist = global.songs.find(
        song => {
          if (song.name === filesToUpsert[p].metadata.common.title &&
              song.id_artist === artistId &&
              song.genre_id === genreId) {

              if (song.album === undefined) {
                return true;
              } else if (song.id_album === albumId) {
                return true;
              }
          }
          return false;
        });

      if ( !songExist ) {
        songsToInsert.push( {
          name: filesToUpsert[p].metadata.common.title,
          path: songPath,
          youtube: filesToUpsert[p].metadata.youtube ? filesToUpsert[p].metadata.youtube : null,
          created_at: filesToUpsert[p].birthtime,
          id_album: albumId ? albumId : null,
          id_artist : artistId
        } );
        genreRelationsToInsert.push( genreId );
      }
    }

    const insertedSongs = await knex('songs')
      .insert(songsToInsert)
      .returning('id');

    const genreRelations = [];
    for (let k = 0; k < insertedSongs.length; k++) {
      genreRelations.push({
        id: genreRelationsToInsert[k],
        id_song: insertedSongs[k]
      });
    }

    const nbInsertedSongs = insertedSongs.length ? insertedSongs.length : 0;
    console.log(filesToUpsert.length - nbInsertedSongs, 'songs already in database', nbInsertedSongs, 'songs inserted in database');

    const res = await knex('genres_relations').insert(genreRelations);

    resolve("Music scan finished");
  });
}

/**
 * Search if the ID is in memory, and if not create it before sending back the ID
 *
 * @param {table: String} Table name and global variable name
 * @param {name: String} Name searched in the
 * @returns {id: Integer} Record ID
 */
async function getIdFromTable(table, name) {
  return new Promise(async (resolve, reject) => {
    const row = global[table].find(row => row.name === name);

    if (row) {
      resolve(row.id);
    } else {
      const res = await knex(table).insert({ name }).returning('id');

      // Updating global table object
      global[table].push({
        id: res[0],
        name: name
      });

      resolve(res[0]);
    }
  });
}

/**
 * Extract the Youtube url from metadata
 *
 * @param {metadata: Object} object containing metadata
 * @returns {youtubeUrl: String} Youtube url or false
 */
function youtubeUrlFromMetadata( metadata ) {
  if (  metadata
        && metadata.native
        && metadata.format
        && metadata.format.tagTypes
  ) {
    const nativeTags = metadata.native[
      metadata.format.tagTypes[0]
    ];

    if (nativeTags) {
      const youtubeTag = nativeTags.find(tag => tag.id === 'WOAF');

      if (youtubeTag)
        return youtubeTag.value;
    }
  }

  return false;
}

require('make-runnable/custom')({ printOutputFrame: false });
