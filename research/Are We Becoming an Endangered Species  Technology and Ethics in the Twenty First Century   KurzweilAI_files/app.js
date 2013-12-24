$ = jQuery;

/**
 *	Stuff to run on document ready
 */
jQuery(document).ready(function($) {

	/**
	 * Open all external links in a new tab/window
	 **/
	$('a[rel~=external]').click(function(){
		window.open(this.href,'','');
		return false;
	});
	

	/**
	 * Home slideshow
	 */
	if ($('#home-slideshow ul').length) {
		$('#home-slideshow ul').eq(0).cycle({
			fx: 'fade',
			//easeOut: 'easeout',
			//fx: 'uncover',
			//fx: 'scrollLeft',
			next:'#s-next',
			prev:'#s-prev',
			//height:250,//291,
			speed: 1000,
			timeout: 5000,
			pause: 0,
			/*pager: '#latest-photos-nav',*/
			sync: 1
		});
		$('#s-stop').click(function(){
			if (!$(this).hasClass('stopped')) {
				$('#home-slideshow ul').eq(0).cycle('pause');
				$(this).addClass('stopped');
			} else {
				$('#home-slideshow ul').eq(0).cycle('resume');
				$(this).removeClass('stopped');
			}
			return false;
		});
	}
	
	/**
	 * Latest videos scroller
	 */
	if ($('#latest-videos').length) {
		setVidScrollerHeight();
		$('div.scrollable').scrollable({ 
			size: 3
		});
		$('#latest-videos .scrollable dt a').each(function(){
			$(this).append('<span></span>');
		});
	}

	/**
	 * IE fixes
	 */
	//if (!$.browser.msie) {
		$('#submenu a span, #submenu strong span').before('<em></em>');
		if (!$.browser.msie) {
			$("#submenu a em, #submenu strong em").css("opacity","0");
		} else {
			$("#submenu a em, #submenu strong em").hide();
		}
		// on mouse over
		$("#submenu a, #submenu strong").hover(function () {
			// animate opacity to full
			var originalBG = $(this).css("background-image");
			$(this).find('em').css('background-image',originalBG);
			if (!$.browser.msie) {
				$(this).find('em').stop().animate({	opacity: 1}, 'slow');
			} else {
				$(this).find('em').stop().show();
			}
		},
		// on mouse out
		function () {
			// animate opacity to nill
			if (!$.browser.msie) {
				$(this).find('em').stop().animate({	opacity: 0}, 'fast');
			} else {
				$(this).find('em').stop().hide();
			}
		});
	//}


	/**
	 *	Adds class "last", where needed
	 */
	$('#col-1 .post:last, #col-2 .post:last, body.category #content .post:last, body.archive #content .post:last, body.search #content .post:last').addClass('last');

	/**
	 * Adds 'last' class to the posts before date tag in Events section
	 */
	if ($('h4.date').length) {
		$('h4.date').each(function(){
			var prevp = $(this).prev();
			if (prevp.hasClass('post')) prevp.addClass('last')
		});
	}

	/**
	 *	Adds/removes "hover" class to "Stay Tuned" links in the footer
	 */
	$('.stay-tuned ul li a')
		.mouseover(function(){
			$(this).parent().addClass('hover');
		})
		.mouseout(function(){
			$(this).parent().removeClass('hover');
		});

	/**
	 *	Stuff needed by Ramona overlay
	 */
	if ($(".chat").length > 0){
		$(".chat a").overlay({
			onBeforeLoad: function() {
				$('.wrap').append('<iframe width="945" height="830" frameborder="0" scrolling="no" marginwidth="0" marginheight="0" id="frame" name="frame" allowtransparency="true" />');
				$('#frame').attr('src', this.getTrigger().attr("href"));
				//$('#chat-box').attr('overlay', 'none');
			},
			close: '.wrap .close',
			onClose: function() {
				$('#frame').remove();
			},
			finish: {
				top: 'center',
				left: 'center',
				absolute: false
			},
			expose: {
				color: '#000000',
				opacity: 0.8,
				closeSpeed: 600
			},
			speed:'fast'
		});
		$.frameReady(function(){
			// $("<div>I am a div element</div>").prependTo("body");
			}, "top.frame",
			{ load: [
				{type:"stylesheet", src:"../stylesheets/chat.css"}
			] }
		);
	}

	/**
	 * Prepends a span needed in .photos section
	 */
	$("#content .page-id-77886 .post-body ul li a").prepend("<span class='zoom'></span>");

	/**
	 * Adds 'wider' class to descriptions of wide videos (in Video section)
	 */
	if ($('#content .video object').length) {
		$('#content .video object').each(function(){
			if ($(this).width() > 450) $(this).closest('.video').next().addClass('wider');
		});
	}

	/**
	 * Adds onclick='window.open()' to related links in the sidebar
	 **/
	$('#sidebar div.related-content a').click(function(){
		window.open(this.href,'','');
		return false;
	});

	/**
	 * BLOG comment form submit handler
	 **/
	if ($('#commentform').length) {
		/**
		* jQuery Validation plugin setup
		**/
		$.validator.addMethod(
			"notequal",
			function(value, element, param) {
				return this.optional(element) || value != param;
			},
			"This field value is incorrect."
		);
		$('#commentform').validate({
			rules: {
				email: {
					required: true,
					email: true,
					'notequal': 'email address'
				},
				author: {
					required: true,
					'notequal': 'your name'
				},
				comment: {
					required: true,
					'notequal': 'Type your comment here...'
				}
			}
		});
	}
	
	
	

});

/**
 *	Stuff to run on window load
 */

$(window).load(function(){
	thumbnailize(); //Process images wherever necessary
	if ($('#latest-videos').length) setVidScrollerHeight(); //Set home page scroller
	$('a[rel^="prettyPhoto"]').attr('title','');
	$('a[rel^="prettyPhoto"]').prettyPhoto({
		animation_speed: 'normal',
		padding: 40,
		opacity: 0.8,
		show_title: false,
		deeplinking: false,
		allowresize: true,
		counter_separator_label: '/',
		theme: 'light_rounded',
		overlay_gallery: false,
		keyboard_shortcuts: false,
		ie6_fallback: false
	});
});


/**************************************************************************
	Helper functions
**************************************************************************/

/**
*	Invokes print page dialog
*/
function printPage() {
	window.print();
}

/**
 *	Sets height of the Home page videos scroller
 **/
function setVidScrollerHeight() {
	var latest_videos_maxheight = 0;
	$('#latest-videos li').each(function(){
		th = $(this).height();
		if (th > latest_videos_maxheight) latest_videos_maxheight = th;
	});
	$('#home-slideshow .videos-scroller .scrollable').height(latest_videos_maxheight + 'px');
}

/**
 * Adds lightboxes to images
 * @return -
 */
function thumbnailize(){
	var imgs = $('img.expando, body.single #content img, body.page #content img');
	if (imgs.length > 0){
		for (i=0;i<imgs.length;i++) {
			var img = imgs.get(i);
			var imghtmlw = $(img).width();
			if (img.src.indexOf('icon_arrow_4.png') == -1) {
				var jpg,gif,png,bmp = false;
				// set displayed image width
				//if ($(img).parent().hasClass('wp-caption')) $(img).parent().width(width);
				// add a link to display the image in lightbox -- IF NEEDED
				var imgalign = '';
				if ($(img).hasClass('alignleft')) {
					imgalign = 'alignleft';
				} else if ($(img).hasClass('alignright')) {
					imgalign = 'alignright';
				} else if ($(img).hasClass('aligncenter')) {
					imgalign = 'aligncenter';
				}
				if ($(img).parent().get(0).tagName == "A"){
					jpg = ( $(img).parent().attr('href').toLowerCase().indexOf('.jpg') == $(img).parent().attr('href').length - 4 || $(img).parent().attr('href').indexOf('.jpeg') == $(img).parent().attr('href').length - 5 ) ? true : false;
					gif = ($(img).parent().attr('href').toLowerCase().indexOf('.gif') == $(img).parent().attr('href').length - 4) ? true : false;
					png = ($(img).parent().attr('href').toLowerCase().indexOf('.png') == $(img).parent().attr('href').length - 4) ? true : false;
					bmp = ($(img).parent().attr('href').toLowerCase().indexOf('.bmp') == $(img).parent().attr('href').length - 4) ? true : false;
					if (jpg || gif || png || bmp) {
						$(img).parent("a:not([rel^=prettyPhoto])").attr('rel','prettyPhoto');
						$(img).parent("a").addClass('expando-wrapper');
						$(img).parent("a").addClass(imgalign);
						$(img).removeClass(imgalign);
					}
				} else if (!$('body.single').length && !$('body.page').length) { // Don't add any <a> on single pages
					$(img).wrap("<a href='#' rel='prettyPhoto' class='expando-wrapper " + imgalign + "'></a>");
					$(img).parent("a[rel^='prettyPhoto']").attr('href',img.src);
				}
				$(img).parent('a[rel^="prettyPhoto"],a[rel^="prettyPhoto"]').prepend('<span class="enlarge" style="width:' + ( imghtmlw + 2 ) + 'px"><strong>[+]</strong></span>'); //+2px because of img borders
			}
		}

	};
}