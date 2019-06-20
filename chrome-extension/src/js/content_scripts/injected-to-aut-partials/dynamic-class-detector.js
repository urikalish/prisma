import DomObserver from './../dom-observer';

/**
 * This code listens detects the dynamic classes/elements added on the fly
 */
export default function() {
  'use strict';

  // console.log('PRISM::DYNAMIC DOM DETECTOR WORKING');

  const SPY_ELEMENT_DYNAMIC_CLASSES_TAG = 'data-prism-dynamic-class';
  let $body = document.body;
  let detectedDynamicClasses = new Set();

  let domObserver = new DomObserver({
    rootElement: document.documentElement,
    callback: (mutation) => {
      if (mutation.attributeName === 'class') {
        addClassAsDynamic(...getDynamicClasses(mutation.attributeOldValue, mutation.target.getAttribute('class')));
      } else if (!!mutation.addedNodes) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            node.setAttribute('data-prism-dynamic-element', 'true');
          }
        });
      }
    },
    config: {attributes: true, attributeOldValue: true},
  });

  domObserver.observe();

  const addClassAsDynamic = function(...classes) {
    if (classes.length === 0) {
      return;
    }

    classes.forEach((className) => {
      if (!className || className.length === 0) {
        // return;
      } else {
        detectedDynamicClasses.add(className);
      }
    });

    const sorted = [...detectedDynamicClasses].sort((a, b) => b.length - a.length);
    const classesString = sorted.join(' ');

    $body.setAttribute(SPY_ELEMENT_DYNAMIC_CLASSES_TAG, classesString);

    detectedDynamicClasses = new Set(sorted);
  };

  const getDynamicClasses = function(classesBefore, classesAfter) {
    const arrA = !classesBefore ? [] : classesBefore.split(/\s+/);
    const arrB = !classesAfter ? [] : classesAfter.split(/\s+/);

    let dynamicClasses;

    if (arrA.length >= arrB.length) {
      dynamicClasses = arrA.filter((className) => !arrB.includes(className));
    } else {
      dynamicClasses = arrB.filter((className) => !arrA.includes(className));
    }

    return dynamicClasses;
  };
};
