export default class SelectorGenerator {

	constructor(options) {
		this.default_options = {
			selectors: ['id', 'attribute:data-aid', 'class', 'tag', 'nthchild']
		};
		this.options = {};
		this.setOptions(this.default_options);
		if (options) {
			this.setOptions(options);
		}
	}

	setOptions(options) {
		let key, results, val;
		options = options || {};
		results = [];
		for (key in options) {
			val = options[key];
			if (this.default_options.hasOwnProperty(key)) {
				results.push(this.options[key] = val);
			} else {
				results.push(void 0);
			}
		}
		return results;
	};

	isElement(element) {
		return !!((element != null ? element.nodeType : void 0) === 1);
	};

	getParents(element) {
		let current_element, result;
		result = [];
		if (this.isElement(element)) {
			current_element = element;
			while (this.isElement(current_element)) {
				result.push(current_element);
				current_element = current_element.parentNode;
			}
		}
		return result;
	};

	getTagSelector(element) {
		return this.sanitizeItem(element.tagName.toLowerCase());
	};

	sanitizeItem(item) {
		let characters;
		characters = (item.split('')).map(function (character) {
			if (character === ':') {
				return "\\" + (':'.charCodeAt(0).toString(16).toUpperCase()) + " ";
			} else if (/[ !"#$%&'()*+,.\/;<=>?@\[\\\]^`{|}~]/.test(character)) {
				return "\\" + character;
			} else {
				return escape(character).replace(/\%/g, '\\');
			}
		});
		return characters.join('');
	};

	getIdSelector(element) {
		let id, sanitized_id;
		id = element.getAttribute('id');
		if ((id != null) && (id !== '') && !(/\s/.exec(id)) && !(/^\d/.exec(id))) {
			sanitized_id = "#" + (this.sanitizeItem(id));
			if (element.ownerDocument.querySelectorAll(sanitized_id).length === 1) {
				return sanitized_id;
			}
		}
		return null;
	};

	getClassSelectors(element) {
		let class_string, item, result;
		result = [];
		class_string = element.getAttribute('class');
		if (class_string != null) {
			class_string = class_string.replace(/\s+/g, ' ');
			class_string = class_string.replace(/^\s|\s$/g, '');
			if (class_string !== '') {
				result = (function () {
					let k, len, ref, results;
					ref = class_string.split(/\s+/);
					results = [];
					for (k = 0, len = ref.length; k < len; k++) {
						item = ref[k];
						results.push("." + (this.sanitizeItem(item)));
					}
					return results;
				}).call(this);
			}
		}
		return result;
	};

	// getAttributeSelectors(element) {
	//     let attribute, blacklist, k, len, ref, ref1, result;
	//     result = [];
	//     blacklist = ['id', 'class'];
	//     ref = element.attributes;
	//     for (k = 0, len = ref.length; k < len; k++) {
	//         attribute = ref[k];
	//         if (ref1 = attribute.nodeName, indexOf.call(blacklist, ref1) < 0) {
	//             result.push("[" + attribute.nodeName + "=" + attribute.nodeValue + "]");
	//         }
	//     }
	//     return result;
	// };

	getAttributeSelectors(element, name) {
		let attribute, blacklist, k, len, ref, ref1, result;
		result = [];
		ref = element.attributes;
		for (k = 0, len = ref.length; k < len; k++) {
			if (ref[k].name === name) {
				result.push("[" + ref[k].name + "='" + ref[k].value + "']");
				if (ref[k].value.indexOf(' ') > -1) {
					console.log('>>>> Hey, there is a space in data-aid: ' + ref[k].value);
				}
			}
		}
		return result;
	};


	getNthChildSelector(element) {
		let counter, k, len, parent_element, sibling, siblings;
		parent_element = element.parentNode;
		if (parent_element != null) {
			counter = 0;
			siblings = parent_element.childNodes;
			for (k = 0, len = siblings.length; k < len; k++) {
				sibling = siblings[k];
				if (this.isElement(sibling)) {
					counter++;
					if (sibling === element) {
						return ":nth-child(" + counter + ")";
					}
				}
			}
		}
		return null;
	};

	testSelector(element, selector) {
		let is_unique, result;
		is_unique = false;
		if ((selector != null) && selector !== '') {
			result = element.ownerDocument.querySelectorAll(selector);
			if (result.length === 1 && result[0] === element) {
				is_unique = true;
			}
		}
		return is_unique;
	};

	getAllSelectors(element) {
		let result;
		result = {
			t: null,
			i: null,
			c: null,
			a: null,
			n: null
		};
		if ([].indexOf.call(this.options.selectors, 'tag') >= 0) {
			result.t = this.getTagSelector(element);
		}
		if ([].indexOf.call(this.options.selectors, 'id') >= 0) {
			result.i = this.getIdSelector(element);
		}
		if ([].indexOf.call(this.options.selectors, 'class') >= 0) {
			result.c = this.getClassSelectors(element);
		}
		// if ([].indexOf.call(this.options.selectors, 'attribute') >= 0) {
		//     result.a = this.getAttributeSelectors(element);
		// }
		let attrName = this.fetchAttributeName();
		if (attrName) {
			result.a = this.getAttributeSelectors(element, attrName);
		}
		if ([].indexOf.call(this.options.selectors, 'nthchild') >= 0) {
			result.n = this.getNthChildSelector(element);
		}
		return result;
	};

	fetchAttributeName() {
		let result = '';
		for (let s = 0; s < this.options.selectors.length; s++) {
			if (this.options.selectors[s].startsWith("attribute")) {
				let parts = this.options.selectors[s].split(':');
				if (parts !== null && parts.length == 2) {
					result = parts[1];
					break;
				}
			}
		}
		return result;
	}


	testUniqueness(element, selector) {
		let found_elements, parent;
		parent = element.parentNode;
		found_elements = parent.querySelectorAll(selector);
		return found_elements.length === 1 && found_elements[0] === element;
	};

	testCombinations(element, items, tag) {
		let item, k, l, len, len1, ref, ref1;
		ref = this.getCombinations(items);
		for (k = 0, len = ref.length; k < len; k++) {
			item = ref[k];
			if (this.testUniqueness(element, item)) {
				return item;
			}
		}
		if (tag != null) {
			ref1 = items.map(function (item) {
				return tag + item;
			});
			for (l = 0, len1 = ref1.length; l < len1; l++) {
				item = ref1[l];
				if (this.testUniqueness(element, item)) {
					return item;
				}
			}
		}
		return null;
	};

	getUniqueSelector(element) {
		let found_selector, k, len, ref, selector_type, selectors;
		selectors = this.getAllSelectors(element);
		ref = this.options.selectors;
		for (k = 0, len = ref.length; k < len; k++) {
			selector_type = ref[k];
			if (selector_type.startsWith('attribute')) {
				if ((selectors.a != null) && selectors.a.length !== 0) {
					found_selector = this.testCombinations(element, selectors.a, selectors.t);
					if (found_selector) {
						return found_selector;
					}
				}
			} else {
				switch (selector_type) {
					case 'id':
						if (selectors.i != null) {
							return selectors.i;
						}
						break;
					case 'tag':
						if (selectors.t != null) {
							if (this.testUniqueness(element, selectors.t)) {
								return selectors.t;
							}
						}
						break;
					case 'class':
						if ((selectors.c != null) && selectors.c.length !== 0) {
							found_selector = this.testCombinations(element, selectors.c, selectors.t);
							if (found_selector) {
								return found_selector;
							}
						}
						break;
				// case 'attribute':
				//     if ((selectors.a != null) && selectors.a.length !== 0) {
				//         found_selector = this.testCombinations(element, selectors.a, selectors.t);
				//         if (found_selector) {
				//             return found_selector;
				//         }
				//     }
				//     break;
					case 'nthchild':
						if (selectors.n != null) {
							return selectors.n;
						}
				}
			}
		}
		return '*';
	};

	getSelector(element) {
		let MINIMAL_SELECTOR_CHAIN_LENGTH = 5;
		let all_selectors, item, k, l, len, len1, parents, result, selector, selectors;
		all_selectors = [];
		parents = this.getParents(element);
		for (k = 0, len = parents.length; k < len; k++) {
			item = parents[k];
			selector = this.getUniqueSelector(item);
			if (selector != null) {
				all_selectors.push(selector);
			}
		}
		selectors = [];
		for (l = 0, len1 = all_selectors.length; l < len1; l++) {
			item = all_selectors[l];
			selectors.unshift(item);
			result = selectors.join(' > ');
			if (this.testSelector(element, result)) {
				if (selectors.length == MINIMAL_SELECTOR_CHAIN_LENGTH || selectors.length == all_selectors.length) {
					return result;
				}
			}
		}
		return null;
	};

	getCombinations(items) {
		let i, j, k, l, ref, ref1, result;
		if (items == null) {
			items = [];
		}
		result = [
			[]
		];
		for (i = k = 0, ref = items.length - 1; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
			for (j = l = 0, ref1 = result.length - 1; 0 <= ref1 ? l <= ref1 : l >= ref1; j = 0 <= ref1 ? ++l : --l) {
				result.push(result[j].concat(items[i]));
			}
		}
		result.shift();
		result = result.sort(function (a, b) {
			return a.length - b.length;
		});
		result = result.map(function (item) {
			return item.join('');
		});
		return result;
	};
}
