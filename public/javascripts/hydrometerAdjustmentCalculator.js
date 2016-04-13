'use strict';

$(document).ready(function () {
	hydrometerAdjustments.init();
});

var hydrometerAdjustments = (function () {
	var measuredGravity;
	var currentTemp;
	var	calTemp;

	function init() {
		measuredGravity = $('#measured-gravity');
		currentTemp = $('#current-temp');
		calTemp = $('#calibration-temp');

		$('.calculate').click(updateCalculator);
		measuredGravity.change((e) => updateCalculator(e)); // jshint ignore:line
		currentTemp.change((e) => updateCalculator(e)); // jshint ignore:line
		calTemp.change((e) => updateCalculator(e)); // jshint ignore:line
	}

	function updateCalculator(e) {
		e.preventDefault();

		if (validateInput()) {
			var actualGravity = calculateActualGravity();
			showResults(actualGravity);
		}
		else {
			window.alert('Gravity and current temperature must be filled out');
		}
	}

	function calculateActualGravity() {
		var mg = parseFloat(measuredGravity.val());
		var tr = parseFloat(currentTemp.val());
		var tc = calTemp !== '' ? parseFloat(calTemp.val()) : 20.0;

		tr = toFahrenheit(tr);
		tc = toFahrenheit(tc);

		var gravity = mg * ((1.00130346 - 0.000134722124 * tr + 0.00000204052596 * tr * tr - 0.00000000232820948 * tr * tr * tr) / (1.00130346 - 0.000134722124 * tc + 0.00000204052596 * tc * tc - 0.00000000232820948 * tc * tc * tc)); // jshint ignore:line
		gravity = Math.round(gravity * 1000)/1000;

		var actualGravity = { name: 'Actual Gravity: ', value: gravity };
		
		return [actualGravity];
	}

	function showResults(calculations) {
		var calculator = $('#calculator');
		$('.results').remove();

		calculations.forEach(function(element) {
			$('<span class="results">' + element.name + '</span>').appendTo(calculator); // jshint ignore:line
			$('<b class="results results-st">' + element.value + '</b>').appendTo(calculator); // jshint ignore:line
		});
	}

	function validateInput() {
		var gravity = measuredGravity.val() !== '';
		var temp = currentTemp.val() !== '';

		return gravity && temp;
	}

	function toFahrenheit(celsiusTemp) {
		return celsiusTemp*9/5 + 32;
	}

	return {
		init: init
	};
})();
