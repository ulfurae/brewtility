'use strict';

$(document).ready(function () {
	primingCalculator.init();
});

var primingCalculator = (function () {
	var orGravityField;
	var fiGravityField;

	function init() {
		orGravityField = $('#originalGravityField');
		fiGravityField = $('#finalGravityField');
		$('.calculate').click(updateCalculator);
		orGravityField.change((e) => updateCalculator(e)); // jshint ignore:line
		fiGravityField.change((e) => updateCalculator(e)); // jshint ignore:line
	}

	function updateCalculator(e) {
		e.preventDefault();

		if (validateInput()) {
			var amounts = calculatePrimingSugar();
			showResults(amounts);
		}
		else {
			window.alert('Check out input fields.');
		}
	}

	function calculatePrimingSugar() {
		var OG = parseFloat(orGravityField.val());
		var FG = parseFloat(fiGravityField.val());

		var abv = (76.08 * (OG-FG) / (1.775-OG)) * (FG / 0.794);
		abv = Math.round(abv * 100)/100;

		var abvString = abv.toString() + '%'; 

		var ABV = { name: 'Alchohol By Volume: ', value: abvString };
		
		return [ABV];
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
		var OG = orGravityField.val() !== '';
		var FG = fiGravityField.val() !== '';

		return OG && FG;
	}

	return {
		init: init
	};
})();
