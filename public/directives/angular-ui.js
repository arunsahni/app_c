/**
* AngularUI - The companion suite for AngularJS
* @version v0.4.0 - 2013-02-15
* @link http://angular-ui.github.com
* @license MIT License, http://www.opensource.org/licenses/MIT
*/
angular.module("ui.config", []).value("ui.config", {}), angular.module("ui.filters", ["ui.config"]), angular.module("ui.directives", ["ui.config"]), angular.module("ui", ["ui.filters", "ui.directives", "ui.config"]), angular.module("ui.directives").directive("uiAnimate", ["ui.config", "$timeout", function(e, t) {
	var n = {};
	return angular.isString(e.animate) ? n["class"] = e.animate : e.animate && (n = e.animate), {
		restrict: "A",
		link: function(e, r, i) {
			var s = {};
			i.uiAnimate && (s = e.$eval(i.uiAnimate), angular.isString(s) && (s = {
				"class": s
			})), s = angular.extend({
				"class": "ui-animate"
			}, n, s), r.addClass(s["class"]), t(function() {
				r.removeClass(s["class"])
			}, 20, !1)
		}
	}
}]), angular.module("ui.directives").directive("uiCalendar", ["ui.config", "$parse", function(e, t) {
	return e.uiCalendar = e.uiCalendar || {}, {
		require: "ngModel",
		restrict: "A",
		link: function(t, n, r, i) {
			function a() {
				t.calendar = n.html("");
				var i = t.calendar.fullCalendar("getView");
				i && (i = i.name);
				var o, u = {
					defaultView: i,
					eventSources: s
				};
				r.uiCalendar ? o = t.$eval(r.uiCalendar) : o = {}, angular.extend(u, e.uiCalendar, o), t.calendar.fullCalendar(u)
			}
			var s = t.$eval(r.ngModel),
				o = 0,
				u = function() {
					var e = t.$eval(r.equalsTracker);
					return o = 0, angular.forEach(s, function(e, t) {
						angular.isArray(e) && (o += e.length)
					}), angular.isNumber(e) ? o + s.length + e : o + s.length
				};
			a(), t.$watch(u, function(e, t) {
				a()
			})
		}
	}
}]), angular.module("ui.directives").directive("uiCodemirror", ["ui.config", "$timeout", function(e, t) {
	"use strict";
	var n = ["cursorActivity", "viewportChange", "gutterClick", "focus", "blur", "scroll", "update"];
	return {
		restrict: "A",
		require: "ngModel",
		link: function(r, i, s, o) {
			var u, a, f, l, c;
			if (i[0].type !== "textarea") throw new Error("uiCodemirror3 can only be applied to a textarea element");
			u = e.codemirror || {}, a = angular.extend({}, u, r.$eval(s.uiCodemirror)), f = function(e) {
				return function(t, n) {
					var i = t.getValue();
					i !== o.$viewValue && (o.$setViewValue(i), r.$apply()), typeof e == "function" && e(t, n)
				}
			}, l = function() {
				c = CodeMirror.fromTextArea(i[0], a), c.on("change", f(a.onChange));
				for (var e = 0, u = n.length, l; e < u; ++e) {
					l = a["on" + n[e].charAt(0).toUpperCase() + n[e].slice(1)];
					if (l === void 0) continue;
					if (typeof l != "function") continue;
					c.on(n[e], l)
				}
				o.$formatters.push(function(e) {
					if (angular.isUndefined(e) || e === null) return "";
					if (angular.isObject(e) || angular.isArray(e)) throw new Error("ui-codemirror cannot use an object or an array as a model");
					return e
				}), o.$render = function() {
					c.setValue(o.$viewValue)
				}, s.uiRefresh && r.$watch(s.uiRefresh, function(e, n) {
					e !== n && t(c.refresh)
				})
			}, t(l)
		}
	}
}]), angular.module("ui.directives").directive("uiCurrency", ["ui.config", "currencyFilter", function(e, t) {
	var n = {
		pos: "ui-currency-pos",
		neg: "ui-currency-neg",
		zero: "ui-currency-zero"
	};
	return e.currency && angular.extend(n, e.currency), {
		restrict: "EAC",
		require: "ngModel",
		link: function(e, r, i, s) {
			var o, u, a;
			o = angular.extend({}, n, e.$eval(i.uiCurrency)), u = function(e) {
				var n;
				return n = e * 1, r.toggleClass(o.pos, n > 0), r.toggleClass(o.neg, n < 0), r.toggleClass(o.zero, n === 0), e === "" ? r.text("") : r.text(t(n, o.symbol)), !0
			}, s.$render = function() {
				a = s.$viewValue, r.val(a), u(a)
			}
		}
	}
}]), angular.module("ui.directives").directive("uiDate", ["ui.config", function(e) {
	"use strict";
	var t;
	return t = {}, angular.isObject(e.date) && angular.extend(t, e.date), {
		require: "?ngModel",
		link: function(t, n, r, i) {
			var s = function() {
					return angular.extend({}, e.date, t.$eval(r.uiDate))
				},
				o = function() {
					var e = s();
					if (i) {
						var r = function() {
							t.$apply(function() {
								var e = n.datepicker("getDate");
								n.datepicker("setDate", n.val()), i.$setViewValue(e), n.blur()
							})
						};
						if (e.onSelect) {
							var o = e.onSelect;
							e.onSelect = function(e, n) {
								r(), t.$apply(function() {
									o(e, n)
								})
							}
						} else e.onSelect = r;
						n.bind("change", r), i.$render = function() {
							var e = i.$viewValue;
							if (angular.isDefined(e) && e !== null && !angular.isDate(e)) throw new Error("ng-Model value must be a Date object - currently it is a " + typeof e + " - use ui-date-format to convert it from a string");
							n.datepicker("setDate", e)
						}
					}
					n.datepicker("destroy"), n.datepicker(e), i && i.$render()
				};
			t.$watch(s, o, !0)
		}
	}
}]).directive("uiDateFormat", ["ui.config", function(e) {
	var t = {
		require: "ngModel",
		link: function(t, n, r, i) {
			var s = r.uiDateFormat || e.dateFormat;
			s ? (i.$formatters.push(function(e) {
				if (angular.isString(e)) return $.datepicker.parseDate(s, e)
			}), i.$parsers.push(function(e) {
				if (e) return $.datepicker.formatDate(s, e)
			})) : (i.$formatters.push(function(e) {
				if (angular.isString(e)) return new Date(e)
			}), i.$parsers.push(function(e) {
				if (e) return e.toISOString()
			}))
		}
	};
	return t
}]), angular.module("ui.directives").directive("uiEvent", ["$parse", function(e) {
	return function(t, n, r) {
		var i = t.$eval(r.uiEvent);
		angular.forEach(i, function(r, i) {
			var s = e(r);
			n.bind(i, function(e) {
				var n = Array.prototype.slice.call(arguments);
				n = n.splice(1), t.$apply(function() {
					s(t, {
						$event: e,
						$params: n
					})
				})
			})
		})
	}
}]), angular.module("ui.directives").directive("uiIf", [function() {
	return {
		transclude: "element",
		priority: 1e3,
		terminal: !0,
		restrict: "A",
		compile: function(e, t, n) {
			return function(e, t, r) {
				var i, s;
				e.$watch(r.uiIf, function(r) {
					i && (i.remove(), i = undefined), s && (s.$destroy(), s = undefined), r && (s = e.$new(), n(s, function(e) {
						i = e, t.after(e)
					}))
				})
			}
		}
	}
}]), angular.module("ui.directives").directive("uiJq", ["ui.config", "$timeout", function(t, n) {
	return {
		restrict: "A",
		compile: function(r, i) {
			if (!angular.isFunction(r[i.uiJq])) throw new Error('ui-jq: The "' + i.uiJq + '" function does not exist');
			var s = t.jq && t.jq[i.uiJq];
			return function(t, r, i) {
				function u() {
					n(function() {
						r[i.uiJq].apply(r, o)
					}, 0, !1)
				}
				var o = [];
				i.uiOptions ? (o = t.$eval("[" + i.uiOptions + "]"), angular.isObject(s) && angular.isObject(o[0]) && (o[0] = angular.extend({}, s, o[0]))) : s && (o = [s]), i.ngModel && r.is("select,input,textarea") && r.on("change", function() {
					r.trigger("input")
				}), i.uiRefresh && t.$watch(i.uiRefresh, function(e) {
					u()
				}), u()
			}
		}
	}
}]), angular.module("ui.directives").factory("keypressHelper", ["$parse", function(t) {
	var n = {
			8: "backspace",
			9: "tab",
			13: "enter",
			27: "esc",
			32: "space",
			33: "pageup",
			34: "pagedown",
			35: "end",
			36: "home",
			37: "left",
			38: "up",
			39: "right",
			40: "down",
			45: "insert",
			46: "delete"
		},
		r = function(e) {
			return e.charAt(0).toUpperCase() + e.slice(1)
		};
	return function(e, i, s, o) {
		var u, a = [];
		u = i.$eval(o["ui" + r(e)]), angular.forEach(u, function(e, n) {
			var r, i;
			i = t(e), angular.forEach(n.split(" "), function(e) {
				r = {
					expression: i,
					keys: {}
				}, angular.forEach(e.split("-"), function(e) {
					r.keys[e] = !0
				}), a.push(r)
			})
		}), s.bind(e, function(t) {
			var r = t.metaKey || t.altKey,
				s = t.ctrlKey,
				o = t.shiftKey,
				u = t.keyCode;
			e === "keypress" && !o && u >= 97 && u <= 122 && (u -= 32), angular.forEach(a, function(e) {
				var u = e.keys[n[t.keyCode]] || e.keys[t.keyCode.toString()] || !1,
					a = e.keys.alt || !1,
					f = e.keys.ctrl || !1,
					l = e.keys.shift || !1;
				u && a == r && f == s && l == o && i.$apply(function() {
					e.expression(i, {
						$event: t
					})
				})
			})
		})
	}
}]), angular.module("ui.directives").directive("uiKeydown", ["keypressHelper", function(e) {
	return {
		link: function(t, n, r) {
			e("keydown", t, n, r)
		}
	}
}]), angular.module("ui.directives").directive("uiKeypress", ["keypressHelper", function(e) {
	return {
		link: function(t, n, r) {
			e("keypress", t, n, r)
		}
	}
}]), angular.module("ui.directives").directive("uiKeyup", ["keypressHelper", function(e) {
	return {
		link: function(t, n, r) {
			e("keyup", t, n, r)
		}
	}
}]),
function() {
	function t(e, t, n, r) {
		angular.forEach(t.split(" "), function(t) {
			var i = {
				type: "map-" + t
			};
			google.maps.event.addListener(n, t, function(t) {
				r.triggerHandler(angular.extend({}, i, t)), e.$$phase || e.$apply()
			})
		})
	}

	function n(n, r) {
		e.directive(n, [function() {
			return {
				restrict: "A",
				link: function(e, i, s) {
					e.$watch(s[n], function(n) {
						t(e, r, n, i)
					})
				}
			}
		}])
	}
	var e = angular.module("ui.directives");
	e.directive("uiMap", ["ui.config", "$parse", function(e, n) {
		var r = "bounds_changed center_changed click dblclick drag dragend dragstart heading_changed idle maptypeid_changed mousemove mouseout mouseover projection_changed resize rightclick tilesloaded tilt_changed zoom_changed",
			i = e.map || {};
		return {
			restrict: "A",
			link: function(e, s, o) {
				var u = angular.extend({}, i, e.$eval(o.uiOptions)),
					a = new google.maps.Map(s[0], u),
					f = n(o.uiMap);
				f.assign(e, a), t(e, r, a, s)
			}
		}
	}]), e.directive("uiMapInfoWindow", ["ui.config", "$parse", "$compile", function(e, n, r) {
		var i = "closeclick content_change domready position_changed zindex_changed",
			s = e.mapInfoWindow || {};
		return {
			link: function(e, o, u) {
				var a = angular.extend({}, s, e.$eval(u.uiOptions));
				a.content = o[0];
				var f = n(u.uiMapInfoWindow),
					l = f(e);
				l || (l = new google.maps.InfoWindow(a), f.assign(e, l)), t(e, i, l, o), o.replaceWith("<div></div>");
				var c = l.open;
				l.open = function(n, i, s, u, a, f) {
					r(o.contents())(e), c.call(l, n, i, s, u, a, f)
				}
			}
		}
	}]), n("uiMapMarker", "animation_changed click clickable_changed cursor_changed dblclick drag dragend draggable_changed dragstart flat_changed icon_changed mousedown mouseout mouseover mouseup position_changed rightclick shadow_changed shape_changed title_changed visible_changed zindex_changed"), n("uiMapPolyline", "click dblclick mousedown mousemove mouseout mouseover mouseup rightclick"), n("uiMapPolygon", "click dblclick mousedown mousemove mouseout mouseover mouseup rightclick"), n("uiMapRectangle", "bounds_changed click dblclick mousedown mousemove mouseout mouseover mouseup rightclick"), n("uiMapCircle", "center_changed click dblclick mousedown mousemove mouseout mouseover mouseup radius_changed rightclick"), n("uiMapGroundOverlay", "click dblclick")
}(), angular.module("ui.directives").directive("uiMask", [function() {
	return {
		require: "ngModel",
		link: function(e, t, n, r) {
			r.$render = function() {
				var i = r.$viewValue || "";
				t.val(i), t.mask(e.$eval(n.uiMask))
			}, r.$parsers.push(function(e) {
				var n = t.isMaskValid() || angular.isUndefined(t.isMaskValid()) && t.val().length > 0;
				return r.$setValidity("mask", n), n ? e : undefined
			}), t.bind("keyup", function() {
				e.$apply(function() {
					r.$setViewValue(t.mask())
				})
			})
		}
	}
}]), angular.module("ui.directives").directive("uiReset", ["ui.config", function(e) {
	var t = null;
	return e.reset !== undefined && (t = e.reset), {
		require: "ngModel",
		link: function(e, n, r, i) {
			var s;
			s = angular.element('<a class="ui-reset" />'), n.wrap('<span class="ui-resetwrap" />').after(s), s.bind("click", function(n) {
				n.preventDefault(), e.$apply(function() {
					r.uiReset ? i.$setViewValue(e.$eval(r.uiReset)) : i.$setViewValue(t), i.$render()
				})
			})
		}
	}
}]), angular.module("ui.directives").directive("uiRoute", ["$location", "$parse", function(e, t) {
	return {
		restrict: "AC",
		compile: function(n, r) {
			var i;
			if (r.uiRoute) i = "uiRoute";
			else if (r.ngHref) i = "ngHref";
			else {
				if (!r.href) throw new Error("uiRoute missing a route or href property on " + n[0]);
				i = "href"
			}
			return function(n, r, s) {
				function a(t) {
					(hash = t.indexOf("#")) > -1 && (t = t.substr(hash + 1)), u = function() {
						o(n, e.path().indexOf(t) > -1)
					}, u()
				}

				function f(t) {
					(hash = t.indexOf("#")) > -1 && (t = t.substr(hash + 1)), u = function() {
						var i = new RegExp("^" + t + "$", ["i"]);
						o(n, i.test(e.path()))
					}, u()
				}
				var o = t(s.ngModel || s.routeModel || "$uiRoute").assign,
					u = angular.noop;
				switch (i) {
					case "uiRoute":
						s.uiRoute ? f(s.uiRoute) : s.$observe("uiRoute", f);
						break;
					case "ngHref":
						s.ngHref ? a(s.ngHref) : s.$observe("ngHref", a);
						break;
					case "href":
						a(s.href)
				}
				n.$on("$routeChangeSuccess", function() {
					u()
				})
			}
		}
	}
}]), angular.module("ui.directives").directive("uiScrollfix", ["$window", function(e) {
	"use strict";
	return {
		link: function(t, n, r) {
			var i = n.offset().top;
			r.uiScrollfix ? r.uiScrollfix.charAt(0) === "-" ? r.uiScrollfix = i - r.uiScrollfix.substr(1) : r.uiScrollfix.charAt(0) === "+" && (r.uiScrollfix = i + parseFloat(r.uiScrollfix.substr(1))) : r.uiScrollfix = i, angular.element(e).on("scroll.ui-scrollfix", function() {
				var t;
				if (angular.isDefined(e.pageYOffset)) t = e.pageYOffset;
				else {
					var i = document.compatMode && document.compatMode !== "BackCompat" ? document.documentElement : document.body;
					t = i.scrollTop
				}!n.hasClass("ui-scrollfix") && t > r.uiScrollfix ? n.addClass("ui-scrollfix") : n.hasClass("ui-scrollfix") && t < r.uiScrollfix && n.removeClass("ui-scrollfix")
			})
		}
	}
}]), angular.module("ui.directives").directive("uiSelect2", ["ui.config", "$timeout", function(e, t) {
	var n = {};
	return e.select2 && angular.extend(n, e.select2), {
		require: "?ngModel",
		compile: function(e, r) {
			var i, s, o, u = e.is("select"),
				a = r.multiple !== undefined;
			return e.is("select") && (s = e.find("option[ng-repeat], option[data-ng-repeat]"), s.length && (o = s.attr("ng-repeat") || s.attr("data-ng-repeat"), i = jQuery.trim(o.split("|")[0]).split(" ").pop())),
				function(e, r, s, o) {
					var f = angular.extend({}, n, e.$eval(s.uiSelect2));
					u ? (delete f.multiple, delete f.initSelection) : a && (f.multiple = !0);
					if (o) {
						o.$render = function() {
							u ? r.select2("val", o.$modelValue) : a ? o.$modelValue ? angular.isArray(o.$modelValue) ? r.select2("data", o.$modelValue) : r.select2("val", o.$modelValue) : r.select2("data", []) : angular.isObject(o.$modelValue) ? r.select2("data", o.$modelValue) : r.select2("val", o.$modelValue)
						}, i && e.$watch(i, function(e, n, i) {
							if (!e) return;
							t(function() {
								r.select2("val", o.$viewValue), r.trigger("change")
							})
						});
						if (!u) {
							r.bind("change", function() {
								e.$apply(function() {
									o.$setViewValue(r.select2("data"))
								})
							});
							if (f.initSelection) {
								var l = f.initSelection;
								f.initSelection = function(e, t) {
									l(e, function(e) {
										o.$setViewValue(e), t(e)
									})
								}
							}
						}
					}
					s.$observe("disabled", function(e) {
						r.select2(e && "disable" || "enable")
					}), s.ngMultiple && e.$watch(s.ngMultiple, function(e) {
						r.select2(f)
					}), r.val(e.$eval(s.ngModel)), t(function() {
						r.select2(f), !f.initSelection && !u && o.$setViewValue(r.select2("data"))
					})
				}
		}
	}
}]), angular.module("ui.directives").directive("uiShow", [function() {
	return function(e, t, n) {
		e.$watch(n.uiShow, function(e, n) {
			e ? t.addClass("ui-show") : t.removeClass("ui-show")
		})
	}
}]).directive("uiHide", [function() {
	return function(e, t, n) {
		e.$watch(n.uiHide, function(e, n) {
			e ? t.addClass("ui-hide") : t.removeClass("ui-hide")
		})
	}
}]).directive("uiToggle", [function() {
	return function(e, t, n) {
		e.$watch(n.uiToggle, function(e, n) {
			e ? t.removeClass("ui-hide").addClass("ui-show") : t.removeClass("ui-show").addClass("ui-hide")
		})
	}
}]), angular.module("ui.directives").directive("uiSortable", ["ui.config", function(e) {
	return {
		require: "?ngModel",
		link: function(t, n, r, i) {
			var s, o, u, a, f, l, c, h, p;
			f = angular.extend({}, e.sortable, t.$eval(r.uiSortable)), i && (i.$render = function() {
				n.sortable("refresh")
			}, u = function(e, t) {
				t.item.sortable = {
					index: t.item.index()
				}
			}, a = function(e, t) {
				t.item.sortable.resort = i
			}, s = function(e, t) {
				t.item.sortable.relocate = !0, i.$modelValue.splice(t.item.index(), 0, t.item.sortable.moved)
			}, o = function(e, t) {
				i.$modelValue.length === 1 ? t.item.sortable.moved = i.$modelValue.splice(0, 1)[0] : t.item.sortable.moved = i.$modelValue.splice(t.item.sortable.index, 1)[0]
			}, onStop = function(e, n) {
				if (n.item.sortable.resort && !n.item.sortable.relocate) {
					var r, i;
					i = n.item.sortable.index, r = n.item.index(), i < r && r--, n.item.sortable.resort.$modelValue.splice(r, 0, n.item.sortable.resort.$modelValue.splice(i, 1)[0])
				}(n.item.sortable.resort || n.item.sortable.relocate) && t.$apply()
			}, h = f.start, f.start = function(e, t) {
				u(e, t), typeof h == "function" && h(e, t)
			}, _stop = f.stop, f.stop = function(e, t) {
				onStop(e, t), typeof _stop == "function" && _stop(e, t)
			}, p = f.update, f.update = function(e, t) {
				a(e, t), typeof p == "function" && p(e, t)
			}, l = f.receive, f.receive = function(e, t) {
				s(e, t), typeof l == "function" && l(e, t)
			}, c = f.remove, f.remove = function(e, t) {
				o(e, t), typeof c == "function" && c(e, t)
			}), n.sortable(f)
		}
	}
}]), angular.module("ui.directives").directive("uiTinymce", ["ui.config", function(e) {
	return e.tinymce = e.tinymce || {}, {
		require: "ngModel",
		link: function(t, n, r, i) {
			var s, o = {
				onchange_callback: function(e) {
					e.isDirty() && (e.save(), i.$setViewValue(n.val()), t.$$phase || t.$apply())
				},
				handle_event_callback: function(e) {
					return this.isDirty() && (this.save(), i.$setViewValue(n.val()), t.$$phase || t.$apply()), !0
				},
				setup: function(e) {
					e.onSetContent.add(function(e, r) {
						e.isDirty() && (e.save(), i.$setViewValue(n.val()), t.$$phase || t.$apply())
					})
				}
			};
			r.uiTinymce ? s = t.$eval(r.uiTinymce) : s = {}, angular.extend(o, e.tinymce, s), setTimeout(function() {
				n.tinymce(o)
			})
		}
	}
}]), angular.module("ui.directives").directive("uiValidate", function() {
	return {
		restrict: "A",
		require: "ngModel",
		link: function(e, t, n, r) {
			var i, s, o = {},
				u = e.$eval(n.uiValidate);
			if (!u) return;
			angular.isString(u) && (u = {
				validator: u
			}), angular.forEach(u, function(t, n) {
				i = function(i) {
					return e.$eval(t, {
						$value: i
					}) ? (r.$setValidity(n, !0), i) : (r.$setValidity(n, !1), undefined)
				}, o[n] = i, r.$formatters.push(i), r.$parsers.push(i)
			}), n.uiValidateWatch && (s = e.$eval(n.uiValidateWatch), angular.isString(s) ? e.$watch(s, function() {
				angular.forEach(o, function(e, t) {
					e(r.$modelValue)
				})
			}) : angular.forEach(s, function(t, n) {
				e.$watch(t, function() {
					o[n](r.$modelValue)
				})
			}))
		}
	}
}), angular.module("ui.filters").filter("format", function() {
	return function(e, t) {
		if (!e) return e;
		var n = e.toString(),
			r;
		return t === undefined ? n : !angular.isArray(t) && !angular.isObject(t) ? n.split("$0").join(t) : (r = angular.isArray(t) && "$" || ":", angular.forEach(t, function(e, t) {
			n = n.split(r + t).join(e)
		}), n)
	}
}), angular.module("ui.filters").filter("highlight", function() {
	return function(e, t, n) {
		return t || angular.isNumber(t) ? (e = e.toString(), t = t.toString(), n ? e.split(t).join('<span class="ui-match">' + t + "</span>") : e.replace(new RegExp(t, "gi"), '<span class="ui-match">$&</span>')) : e
	}
}), angular.module("ui.filters").filter("inflector", function() {
	function e(e) {
		return e.replace(/^([a-z])|\s+([a-z])/g, function(e) {
			return e.toUpperCase()
		})
	}

	function t(e, t) {
		return e.replace(/[A-Z]/g, function(e) {
			return t + e
		})
	}
	var n = {
		humanize: function(n) {
			return e(t(n, " ").split("_").join(" "))
		},
		underscore: function(e) {
			return e.substr(0, 1).toLowerCase() + t(e.substr(1), "_").toLowerCase().split(" ").join("_")
		},
		variable: function(t) {
			return t = t.substr(0, 1).toLowerCase() + e(t.split("_").join(" ")).substr(1).split(" ").join(""), t
		}
	};
	return function(e, t, r) {
		return t !== !1 && angular.isString(e) ? (t = t || "humanize", n[t](e)) : e
	}
}), angular.module("ui.filters").filter("unique", function() {
	return function(e, t) {
		if (t === !1) return e;
		if ((t || angular.isUndefined(t)) && angular.isArray(e)) {
			var n = {},
				r = [],
				i = function(e) {
					return angular.isObject(e) && angular.isString(t) ? e[t] : e
				};
			angular.forEach(e, function(e) {
				var t, n = !1;
				for (var s = 0; s < r.length; s++)
					if (angular.equals(i(r[s]), i(e))) {
						n = !0;
						break
					}
				n || r.push(e)
			}), e = r
		}
		return e
	}
});