define(["mousetrap", "mousetrapdict","angular"], function (Mousetrap) {
	angular.module("timer.hotkeys", [])
	.value("keys", {
		"a"   : "add.game",
		"g g" : "go.games.all",
		"g a" : "go.games.active",
		"g f" : "go.games.finished",
		"g d" : "go.games.dropped",
		"g h" : "go.games.hold",
		"g w" : "go.games.wish",
		"h"   : "prev.category",
		"j"   : "prev.item",
		"k"   : "next.item",
		"l"   : "next.category",
		"s"   : "game.toggle",
		"m a" : "game.mark.active",
		"m f" : "game.mark.finished",
		"m d" : "game.mark.dropped",
		"m h" : "game.mark.hold",
		"m w" : "game.mark.wish",
		"d g" : "delete.game",
		"d s" : "delete.session",
		"r"   : "rename"
	})
	.run(function (Hotkeys, keys) {
		Hotkeys.bind(keys);
	})
	.factory("Hotkeys", function ($rootScope) {
		var S = {
			bind: function (keys) {
				Mousetrap.bind(S.transform(keys));
			},
			broadcast: function (name) {
				return !name ? undefined : function (e) {
					$rootScope.$broadcast(name, e);
				};
			},
			transform: function (keys) {
				return Object.keys(keys).reduce(function (out, key) {
					out[key] = S.broadcast(keys[key]);
					return out;
				}, {});
			}
		};
		return S;
	})
	.directive("focusOn", function () {
		return function (scope, el, attr) {
			scope.$on(attr.focusOn, function (event, e) {
				e.preventDefault();
				el[0].focus();
			});
		};
	})
	.directive("tabItems", function (Util) {
		return function (scope, el) {
			el = el[0];

			var l = function () {return ch.length},
				i = function () {return [].indexOf.call(ch, document.activeElement)},
				ch = el.children;

			scope.$on("prev.item", function () {
				Util.raf(function () {
					if (!l()) return;
					((i() === -1 || i() === 0) ? ch[l() - 1] : ch[i() - 1]).focus();
				});
			});

			scope.$on("next.item", function () {
				Util.raf(function () {
					if (!l()) return;
					((i() === -1 || i() === l() - 1) ? ch[0] : ch[i() + 1]).focus();
				});
			});
		};
	});
});