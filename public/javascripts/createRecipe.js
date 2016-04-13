'use strict';
$(document).ready(function() {
	recipeCreator.init();
});

var recipeCreator = (function () {
	var hopForm;
	var fermentableForm;

	var hopLine;
	var fermentableLine;

	function init() {
		hopForm = $('.hop-form');
		fermentableForm = $('.fermentable-form');

		hopLine = $('.hop');
		fermentableLine = $('.fermentable');

		$('.add-fermentable').click(addFermentableHandler);
		$('.add-hop').click(addHopHandler);
		$('.remove-fermentable').click(removeFermentableHandler);
		$('.remove-hop').click(removeHopHandler);
	}

	function addFermentableHandler () {
		//$('<hr></hr>')
		var newLine = fermentableLine.clone();
		clearInputs(newLine);	
		newLine.appendTo(fermentableForm);
	}

	function addHopHandler () {
		var newLine = hopLine.clone();
		$('<hr class="form-separator">').prependTo(newLine);
		clearInputs(newLine);	
		newLine.appendTo(hopForm);
	}

	function removeFermentableHandler () {	
		if (fermentableForm.children().length === 1) {
			return;
		} 
		fermentableForm.children().last().remove();
	}

	function removeHopHandler () {
		if (hopForm.children().length === 1) {
			return;
		}
		hopForm.children().last().remove();
	}

	function clearInputs(parentDiv) {
		var inputs = parentDiv.find('input');
		inputs.each(function () {
			$(this).val('');
		});
	}

	return {
		init : init
	};
})();