/*global define */
define(['when'], function (when) {
	'use strict';

	return function (todo) {
		return when(todo).then(function (todo) {

			todo.text = todo.text && todo.text.trim() || '';
			todo.complete = !!todo.complete;

			return todo;
		});
	};
});
