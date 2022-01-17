jQuery(function($) {
	
	$('.help-counter-btn').on('click', function(e) {
		var $this = $(this);
		
		$.ajax({
			url: BASE_URL + 'actions/increment_help_counter.php',
	        dataType:'json',
	        type: 'POST',
	    }).done(function(response) {
	        if (response.success) {
	        	$('.count').html(response.count);
	        }
	    });
	});
	
	
	var window_opts = 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,', window_size = "", url = '',	text = '';
	
	$('#video-2').on('click', '.tw', function(e) {
		
		e.preventDefault();
		window_size = "width=585,height=261";
		text = '🎬 Voici la nouvelle arme qui peut révolutionner la médecine de demain. Aidez les chercheurs @institutpasteur : partagez cette vidéo pour contribuer à la mise au point de traitements d’avenir ! #Immunotherapie #JYContribue\n' +
            'https://www.youtube.com/watch?v=HD65Uymx7Qw';
    	text = amperoctoplus(encodeURI(text));
    	url = 'https://twitter.com/intent/tweet?text=' + text;
		window.open(url, '', window_opts + window_size);
	})/*.on('click', '.fb', function(e) {
		e.preventDefault();
		
		window_size = "width=585,height=368";
    	url = "http://www.facebook.com/sharer.php?u=https://www.youtube.com/watch?v=uwWwid35PeU&t=11s";
    	
    	window.open(url, '', window_opts + window_size);
	})*/.on('click', '.mail', function(e) {
		
		e.preventDefault();
		/*var email = '',
	    	subject = 'Voici la nouvelle arme contre les maladies',
	    	emailBody = "Bonjour, \r\n\r\nLes chercheurs de l’Institut Pasteur ont besoin de nous pour créer les anticorps thérapeuthiques qui vont lutter contre les virus, les cancers, la polyarthrite rhumatoïde etc. \r\n\r\nPouvez-vous partager cette vidéo :\r\nhttps://soutenir.pasteur.fr/immunotherapie#video auprès de votre entourage ? Plus nous serons nombreux, plus nous pourrons accélérer la mise au point de traitements d’avenir pour la santé de tous.";
		*/
		var email = '',
	    	subject = 'Découvrez et partagez la vidéo des chercheurs de l’Institut Pasteur',
	    	emailBody = "Bonjour, \r\n\r\nVoici la nouvelle arme qui peut révolutionner la médecine de demain.\r\n\r\nAidez les chercheurs de l’Institut Pasteur : partagez cette vidéo pour contribuer à la mise au point de traitements d’avenir !\r\nhttps://soutenir.pasteur.fr/immunotherapie#video";
		
		emailBody = encodeURIComponent(emailBody);
		
	    window.location = 'mailto:' + email + '?subject=' + subject + '&body=' +   emailBody;
		
	});
	
	
	function amperoctoplus(s) 
	{
		s = s.replace(/&/g, '%26');
		s = s.replace(/#/g, '%23');
		s = s.replace(/\+/g, '%2B');
		s = s.replace(/@/g, '%40');
		s = s.replace(/:/g, '%3A');
		return s;
	}
	
	
});