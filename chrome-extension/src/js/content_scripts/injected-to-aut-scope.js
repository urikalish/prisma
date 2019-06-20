import classDetector from './injected-to-aut-partials/dynamic-class-detector';
import eventsDetector from './injected-to-aut-partials/events-detector';

eventsDetector();
classDetector();

// console.log('detectors: ', !!classDetector, !!eventsDetector);
