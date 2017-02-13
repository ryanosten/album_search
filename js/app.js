(function(window, $){
	//after receiving the response from API request, generate list of movies
	function albumResults(response){
		console.log(response);
		//store an array of all albums in response
		var albums_arr = response.albums.items;
		var albumsHTML = '';

		//loop through the albums array to generate html for results
		$.each(albums_arr, function(index, album){
			albumsHTML += `<li><div id=${album.id} class="album-wrap">`;
			//if album has no images/art display placeholder icon
			if(album.images.length === 0){
				albumsHTML +='<i class="material-icons poster-placeholder">crop_original</i>'
			} else {

			//else show album art
			albumsHTML += '<img class="album-art" src="' + album.images[0].url + '">';
		}
			//display album name and artist
			albumsHTML += '</div><span class="album-title">' + album.name + '</span>';
			albumsHTML += '<span class="album-artist">' + album.artists[0].name + '</span></li>';
		})

		//if albums array is empty, display 'no albums' html
		if (albums_arr.length === 0){
			albumsHTML += '<li class="no-albums"><i class="material-icons icon-help">help_outline</i>No albums found that match: ' 
			albumsHTML += $('#search').val() + '</li>'
		}

		//insert the albmusHTML into DOM
		$('#albums').html(albumsHTML);
	};

	//on submission of form, generate AJAX GET request
	$('form').on('submit', function(e){
		e.preventDefault();

		//if search occurs on detail page, we want to hide detail page and show albums page
		$('.detail-page').hide();
		$('#albums').show();

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

	//album description page callback function
	function albumDetail(album){
		
		//hide albums page
		$('#albums').hide();

		//css change to main-content container
		$('.main-content').css({
			'width': '100%',
			'max-width': "3000px"
		});

		console.log(album);

		//variable to store year from release_datel property
		var album_year = album.release_date.substring(0, 4);
		var tracklistHTML = ''
		
		//insert album name into .detail-name element, year and spotify link to album name
		$('.detail-name').text(`${album.name} (${album_year})`).parent().attr('href', `${album.external_urls.spotify}`);
		//insert album artist name to .detail-artist
		$('.detail-artist').text(album.artists[0].name);

		//loop through album tracks and generate list of tracks to insert into html
		$.each(album.tracks.items, function(index, track){
			tracklistHTML += `<li class="track">${track.track_number}. ${track.name}</li>`
		})

		//insert tracklist into HTML
		$('.track-list').html(tracklistHTML)
		//insert album image into DOM
		$('.detail-image-container img').attr('src', `${album.images[0].url}`)

		//show details page
		$('.detail-page').show();
		
	}


	//click handler to fire detail page and ajax GET request for album detail
	$('ul').on('click', '.album-wrap', function(){
		
		//get spotifyIDof element clicked
		var spotifyID = $(this).attr('id');

		//endpoint for AJAX GET request
		var httpsURL = `https://api.spotify.com/v1/albums/${spotifyID}`;

		//create an ajax request to the OMDB API
		$.getJSON(httpsURL, albumDetail);
		
	})

	//click handler for #back-to-search button
	$('#back-to-search').on('click', function(){
		//put .main-content back to original value
		$('.main-content').css({
			'width': '90%',
			'max-width': "1250px"
			});

		//hide detail page
		$('.detail-page').hide();
		//show albums page
		$('#albums').show();
	})
})(window, jQuery);



