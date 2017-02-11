//after receiving the response from API request, generate list of movies

function albumResults(response){
	console.log(response);
	var albums_arr = response.albums.items;
	var albumsHTML = '';
	$.each(albums_arr, function(index, album){
		albumsHTML += `<li><div id=${album.id} class="album-wrap">`;
		if(album.images.length === 0){
			albumsHTML +='<i class="material-icons poster-placeholder">crop_original</i>'
		} else {

		albumsHTML += '<img class="album-art" src="' + album.images[0].url + '">';
	}
		albumsHTML += '</div><span class="album-title">' + album.name + '</span>';
		albumsHTML += '<span class="album-artist">' + album.artists[0].name + '</span></li>';
	})

	if (albums_arr.length === 0){
		albumsHTML += '<li class="no-albums"><i class="material-icons icon-help">help_outline</i>No albums found that match: ' 
		albumsHTML += $('#search').val() + '</li>'
	}

	$('#albums').html(albumsHTML);
};

//on submission of form, prevent default behavior and generate AJAX GET request
$('form').on('submit', function(e){
	e.preventDefault();

	//get the value for the title and year search inputs
	var search_value = $('#search').val();

	//data for query string
	var search_data = {
		"q": search_value,
		"type": "album"
	}

	//endpoint for AJAX GET request
	var httpsURL = 'https://api.spotify.com/v1/search';

	//create an ajax request to the OMDB API
	$.getJSON(httpsURL, search_data, albumResults);
})

//album description page


function albumDetail(album){
	console.log(album);
	$('.main-content').css('max-width': '100%');
	$('.detail-name').text(album.name);
	$('.detail-artist').text(album.artists[0].name);

	var tracklistHTML = ''
	$.each(album.tracks.items, function(index, track){
		tracklistHTML += `<li class="track">${track.track_number}. ${track.name}</li>`
	})

	$('.track-list').html(tracklistHTML)
	$('.detail-image-container img').attr('src', `${album.images[0].url}`)
}



$('ul').on('click', '.album-wrap', function(){
	$('#albums').hide();
	
	//get spotifyIDof element clicked
	var spotifyID = $(this).attr('id');

	//endpoint for AJAX GET request
	var httpsURL = `https://api.spotify.com/v1/albums/${spotifyID}`;

	//create an ajax request to the OMDB API
	$.getJSON(httpsURL, albumDetail);

	$('.detail-page').show();
	
})

$('#back-to-search').on('click', function(){
	$('.main-content').css('max-width': '90%');
	$('.detail-name').empty();
	$('.detail-artist').empty();
	$('.track').html('');
	$('.detail-image-container img').attr('src', '');
	$('.detail-page').hide();
	$('#albums').show();
})



