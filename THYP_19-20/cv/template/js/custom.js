/* JS Document */

/******************************

[Table of Contents]

1. Vars and Inits
2. Set Header
3. Init Menu
4. Init Loaders
5. Init Slider

******************************/


	/* 

	1. Vars and Inits

	*/

	var header = $('.header');
	var menu = $('.menu');
	var burger = $('.hamburger');
	var menuActive = false;
	var ctrl = new ScrollMagic.Controller();

	setHeader();

$(document).ready(function()
{
	"use strict";

	$(window).on('resize', function()
	{
		setHeader();

		if(window.innerWidth > 1280)
		{
			if(menuActive)
			{
				closeMenu();
			}
		}
		setTimeout(function()
		{
			jQuery(".main_content_scroll").mCustomScrollbar("update");
		}, 375);
	});

	$(document).on('scroll', function()
	{
		setHeader();
	});

	initMenu(); 
	initSlider();

});

	/* 

	2. Set Header

	*/

	function setHeader()
	{
		if($(window).scrollTop() > 91)
		{
			header.addClass('scrolled');
		}
		else
		{
			header.removeClass('scrolled');
		}
	}

	/* 

	3. Init Menu

	*/

	function initMenu()
	{
		if($('.hamburger').length && $('.menu').length)
		{
			var hamb = $('.hamburger');

			hamb.on('click', function()
			{
				if(!menuActive)
				{
					openMenu();
				}
				else
				{
					closeMenu();
				}
			});
		}
	}

	function openMenu()
	{
		menu.addClass('active');
		menuActive = true;
	}

	function closeMenu()
	{
		menu.removeClass('active');
		menuActive = false;
	}

	/* 

	4. Init Loaders

	*/

	function initLoaders()
	{
		if($('.loader').length)
		{
			var loaders = $('.loader');

			loaders.each(function()
			{
				var loader = this;
				var endValue = $(loader).data('perc');

				var loaderScene = new ScrollMagic.Scene({
		    		triggerElement: this,
		    		triggerHook: 'onEnter',
		    		reverse:false
		    	})
		    	.on('start', function()
		    	{
		    		var bar = new ProgressBar.Circle(loader,
					{
						color: '#8583e1',
						// This has to be the same size as the maximum width to
						// prevent clipping
						strokeWidth: 1,
						trailWidth: 20,
						trailColor: '#e5e6e8',
						easing: 'easeInOut',
						duration: 1400,
						text:
						{
							autoStyleContainer: false
						},
						from:{ color: '#8583e1', width: 1 },
						to: { color: '#8583e1', width: 1 },
						// Set default step function for all animate calls
						step: function(state, circle)
						{
							circle.path.setAttribute('stroke', state.color);
							circle.path.setAttribute('stroke-width', state.width);

							var value = Math.round(circle.value() * 100);
							if (value === 0)
							{
								circle.setText('0%');
							}
							else
							{
								circle.setText(value + "%");
							}
						}
					});
					bar.text.style.fontFamily = '"Montserrat", sans-serif';
					bar.text.style.fontSize = '44px';
					bar.text.style.fontWeight = '700';
					bar.text.style.color = "#100f3a";


					bar.animate(endValue);  // Number from 0.0 to 1.0
		    	})
			    .addTo(ctrl);
			});
		}
	}
	
	/* 

	4. Init Progress Bars

	*/

	function initProgressBars()
	{
		if($('.skill_bars').length)
		{
			var eles = $('.skill_bars');
			var gradNum = 0;

			eles.each(function(i)
			{
				var ele = $(this);
				var elePerc = ele.data('perc');
	    		var eleName = '#'+ele.data('name');
	    		var eleColorStart = ele.data('color-start');
	    		var eleColorEnd = ele.data('color-end');
	    		var eleGradient = 'url(#gradient' + gradNum.toString() +')';
	    		let linearGradient = '<defs><linearGradient id="gradient' + gradNum + '" x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse"><stop offset="20%" stop-color="'+ eleColorStart +'"/><stop offset="50%" stop-color="'+ eleColorEnd+'"/></linearGradient></defs>';
	    		
	    		var statsScene = new ScrollMagic.Scene({
		    		triggerElement: this,
		    		triggerHook: 'onEnter',
		    		reverse:false
		    	})
		    	.on('start', function()
		    	{
		    		var pbar = new ProgressBar.Line(eleName, 
		    		{
		    			strokeWidth: 1,
						easing: 'easeInOut',
						duration: 1400,
						color: '#8583e1',
						trailColor: '#ffffff',
						trailWidth: 1,
						svgStyle: {width: '100%', height: '100%'},
						text: {
							style: {
								position: 'absolute',
								right: '0',
								top: '-20px',
								padding: 0,
								margin: 0,
								transform: null
								},
								autoStyleContainer: false
						},
						step: (state, bar) => {
						bar.setText(Math.round(bar.value() * 100) + ' %');
						}
		    		});
		    		pbar.animate(elePerc);
					pbar.svg.insertAdjacentHTML('afterBegin', linearGradient);
		    	})
		    	.addTo(ctrl);
		    	gradNum++;
			});
		}	
	}

	/* 

	5. Initialize Milestones

	*/

	function initMilestones()
	{
		if($('.milestone_counter').length)
		{
			var milestoneItems = $('.milestone_counter');

	    	milestoneItems.each(function(i)
	    	{
	    		var ele = $(this);
	    		var endValue = ele.data('end-value');
	    		var eleValue = ele.text();

	    		/* Use data-sign-before and data-sign-after to add signs
	    		infront or behind the counter number (+, k, etc) */
	    		var signBefore = "";
	    		var signAfter = "";

	    		if(ele.attr('data-sign-before'))
	    		{
	    			signBefore = ele.attr('data-sign-before');
	    		}

	    		if(ele.attr('data-sign-after'))
	    		{
	    			signAfter = ele.attr('data-sign-after');
	    		}

	    		var milestoneScene = new ScrollMagic.Scene({
		    		triggerElement: this,
		    		triggerHook: 'onEnter',
		    		reverse:false
		    	})
		    	.on('start', function()
		    	{
		    		var counter = {value:eleValue};
		    		var counterTween = TweenMax.to(counter, 4,
		    		{
		    			value: endValue,
		    			roundProps:"value", 
						ease: Circ.easeOut, 
						onUpdate:function()
						{
							document.getElementsByClassName('milestone_counter')[i].innerHTML = signBefore + counter.value + signAfter;
						}
		    		});
		    	})
			    .addTo(ctrl);
	    	});
		}
	}
	
	/* 

	5. Init Slider

	*/

	function initSlider()
	{
		if($('.test_slider').length)
		{
			var slider = $('.test_slider');
			slider.owlCarousel(
			{
				items: 3,
				autoplay:false,
				loop:true,
				nav:false,
				dots:true,
				smartSpeed:600,
				margin:30,
				responsive:
				{
					0:{items:1},
					900:{items:2},
					1199:{items:1},
					1440:{items:2},
					1680:{items:3}
				}
			});
		}
	}