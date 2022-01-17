jQuery(function($) {
	
	
	var $pop = $('#set-prenom-popup');
	var $jeValideButton = $('#anticorps').find('.btn.je-valide');
	var $form = $('.form-paint').find('form');
	function pasteImage($this) {
        var canvas = document.getElementById('bcPaintCanvas'),
            dataURL = canvas.toDataURL();

        $.ajax({
            url: BASE_URL + 'actions/save_drawing.php',
            dataType:'json',
            data: {img: dataURL, nom: PRENOM},
            type: 'POST',
        }).done(function(response) {
            if (response.success) {
                $('.text-end').removeClass('active');
                $this.hide();
                $('#bcPaint-palette,#bcPaint-bottom').hide();
                $('.btn.je-fais-un-don').show();

                $.fn.bcPaint.clearCanvas();

                // $('#slider .owl-stage' ).prepend('<div class="owl-item active"><div class="item"><div class="img"><img src="' + BASE_URL + response.image + '"/></div><p>'+response.nom+'</p></div></div>');
                // console.log(1);
                $OWL.trigger('add.owl.carousel', ['<div class="item"><div class="img"><img src="' + BASE_URL + response.image + '"/></div><p>'+response.nom+'</p></div>', 0]);
                $OWL.trigger('to.owl.carousel', [0, 0]);
                /*$OWL = $('.slider').owlCarousel({
                    responsive: {
                        0: {
                            items: 1
                        },
                        768: {
                            items: 5
                        }
                    }
                });*/
            }
        });
	}


	$('#anticorps').on('click', '.btn.je-valide', function(e) {
		var $this = $(this);
		e.preventDefault();
		if (PRENOM == '') {
			$pop.addClass('show');
			$('html, body').animate({
				'scrollTop': $pop.offset().top - $('#header-top').height()
			},100);
            $jeValideButton.hide();
		} else {
            pasteImage($this);
		}
		
		
	}).on('click', '.btn.set-prenom', function(e) {
		
		e.preventDefault();
		var nom = $form.find('.nom').val();
		
		if (nom) {
			$.ajax({
				url: BASE_URL + 'actions/set_prenom.php',
		        dataType:'json',
		        data: {nom: nom},
		        type: 'POST',
		    }).done(function(response) {
		        if (response.success) {
                    $('.text-end').removeClass('active');
		        	$pop.removeClass('show');
		        	PRENOM = nom;
                    pasteImage($jeValideButton);
		        }
		    });
		}
		
	}).on('click', '.skip-prenom', function(e) {
		e.preventDefault();
		PRENOM = 'Anonyme';
        pasteImage($jeValideButton);
		$pop.removeClass('show');
	});
	
});