let playlists = [];
let currentPlaylistId = null;

// Load playlists from localStorage
function loadPlaylists() {
  const savedPlaylists = localStorage.getItem('playlists');
  if (savedPlaylists) {
    playlists = JSON.parse(savedPlaylists);
    displayPlaylists();
  }
}

// Save playlists to localStorage
function savePlaylists() {
  localStorage.setItem('playlists', JSON.stringify(playlists));
}

// Create a new playlist
function createPlaylist() {
  const playlistName = document.getElementById('playlistName').value;
  const playlistThumbnail = document.getElementById('playlistThumbnail').files[0];

  if (!playlistName || !playlistThumbnail) {
    alert("Ju lutem plotësoni të gjitha fushat.");
    return;
  }

  const playlist = {
    id: Date.now(),
    name: playlistName,
    thumbnail: URL.createObjectURL(playlistThumbnail),
    movies: []
  };

  playlists.push(playlist);
  savePlaylists();
  displayPlaylists();

  // Clear input fields
  document.getElementById('playlistName').value = '';
  document.getElementById('playlistThumbnail').value = '';
}

// Display playlists
function displayPlaylists() {
  const playlistListDiv = document.getElementById('playlistList');
  playlistListDiv.innerHTML = ''; // Clear previous playlist list

  playlists.forEach((playlist) => {
    const playlistCard = document.createElement('div');
    playlistCard.classList.add('playlist-card');
    playlistCard.innerHTML = `
      <img src="${playlist.thumbnail}" alt="${playlist.name}">
      <h3>${playlist.name}</h3>
      <button onclick="openPlaylist(${playlist.id})">
        <i class="fas fa-play-circle"></i> Hap Playlistën
      </button>
      <button onclick="deletePlaylist(${playlist.id})">
        <i class="fas fa-trash-alt"></i> Fshij
      </button>
    `;
    playlistListDiv.appendChild(playlistCard);
  });
}

// Open a playlist and display its movies
function openPlaylist(playlistId) {
  currentPlaylistId = playlistId;
  const playlist = playlists.find(pl => pl.id === playlistId);

  document.getElementById('playlistHeader').innerHTML = `
    <img src="${playlist.thumbnail}" alt="${playlist.name}" style="width: 100%; height: 169px; object-fit: cover;">
    <h3>${playlist.name}</h3>
  `;

  // Show movie upload section and the button to upload movies
  document.getElementById('movieUploadSection').style.display = 'block';
  
  // Display movies for the selected playlist
  displayMovies(playlistId);
}

// Exit a playlist and go back to the list
function exitPlaylist() {
  currentPlaylistId = null;
  document.getElementById('movieUploadSection').style.display = 'none';
  displayPlaylists(); // Go back to the list of playlists
}

// Upload a movie to a playlist
function uploadMovie() {
  const movieName = document.getElementById('movieName').value;
  const movieCategory = document.getElementById('movieCategory').value;
  const movieFile = document.getElementById('movieFile').files[0];
  const movieThumbnail = document.getElementById('movieThumbnail').files[0];

  if (!movieFile || !movieThumbnail || !movieName || !movieCategory) {
    alert("Ju lutem plotësoni të gjitha fushat.");
    return;
  }

  const playlist = playlists.find(pl => pl.id === currentPlaylistId);

  const movie = {
    name: movieName,
    category: movieCategory,
    videoFile: URL.createObjectURL(movieFile),
    thumbnail: URL.createObjectURL(movieThumbnail),
    published: false, // Tracks if the movie is published or not
    dateAdded: Date.now(), // Store date the movie was added
  };

  playlist.movies.push(movie);
  savePlaylists(); // Save the updated playlists to localStorage

  // Clear input fields
  document.getElementById('movieName').value = '';
  document.getElementById('movieCategory').value = '';
  document.getElementById('movieFile').value = '';
  document.getElementById('movieThumbnail').value = '';

  // Refresh the movie list
  displayMovies(currentPlaylistId);
}

// Display movies in the selected playlist
function displayMovies(playlistId) {
  const playlist = playlists.find(pl => pl.id === playlistId);
  const movieListDiv = document.getElementById('movieList');
  movieListDiv.innerHTML = ''; // Clear previous movie list

  playlist.movies.forEach((movie, index) => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    
    movieCard.innerHTML = `
      <img src="${movie.thumbnail}" alt="${movie.name}">
      <h4>${movie.name}</h4>
      <div class="movie-actions">
        ${!movie.published ? 
          `<button onclick="publishMovie(${playlistId}, ${index})"><i class="fas fa-upload"></i> Publiko</button>` : 
          '' }
      </div>
    `;

    movieCard.onclick = () => openFullscreenVideo(movie.videoFile);
    movieListDiv.appendChild(movieCard);
  });
}

// Publish a movie to the playlist
function publishMovie(playlistId, movieIndex) {
  const playlist = playlists.find(pl => pl.id === playlistId);
  const movie = playlist.movies[movieIndex];

  // Mark movie as published
  movie.published = true;
  savePlaylists(); // Save updated playlists to localStorage

  // Refresh movie list to reflect the change
  displayMovies(playlistId);
}

// Open video in fullscreen mode
function openFullscreenVideo(videoUrl) {
  const fullscreenVideoDiv = document.getElementById('fullscreenVideo');
  const videoElement = fullscreenVideoDiv.querySelector('video');
  videoElement.src = videoUrl;
  videoElement.play(); // Start playing the video
  fullscreenVideoDiv.style.display = 'flex';
}

// Close fullscreen video
function closeFullscreen() {
  const fullscreenVideoDiv = document.getElementById('fullscreenVideo');
  const videoElement = fullscreenVideoDiv.querySelector('video');
  videoElement.pause();
  videoElement.currentTime = 0;
  fullscreenVideoDiv.style.display = 'none';
}

// Delete a playlist
function deletePlaylist(playlistId) {
  playlists = playlists.filter(pl => pl.id !== playlistId);
  savePlaylists(); // Save updated playlists to localStorage
  displayPlaylists();
}

// Sort playlists by name
function sortPlaylistsByName() {
  playlists.sort((a, b) => a.name.localeCompare(b.name));
  savePlaylists(); // Save updated playlists to localStorage
  displayPlaylists();
}

// Sort playlists by date (newest first)
function sortPlaylistsByDate() {
  playlists.sort((a, b) => b.id - a.id); // Sorting by creation date
  savePlaylists(); // Save updated playlists to localStorage
  displayPlaylists();
}

// Sort movies by name
function sortMoviesByName() {
  const playlist = playlists.find(pl => pl.id === currentPlaylistId);
  playlist.movies.sort((a, b) => a.name.localeCompare(b.name));
  savePlaylists(); // Save updated playlists to localStorage
  displayMovies(currentPlaylistId);
}

// Sort movies by date added (newest first)
function sortMoviesByDate() {
  const playlist = playlists.find(pl => pl.id === currentPlaylistId);
  playlist.movies.sort((a, b) => b.dateAdded - a.dateAdded);
  savePlaylists(); // Save updated playlists to localStorage
  displayMovies(currentPlaylistId);
}

// Load playlists when the page is loaded
window.onload = function() {
  loadPlaylists();
};
