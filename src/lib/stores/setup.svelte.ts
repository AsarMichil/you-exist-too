let transitionDirection = $state<'forward' | 'backward'>('forward');
let timeoutExpires = $state<number>(Date.now());
let forwardRoute = $state<string | null>(null);
let backwardRoute = $state<string | null>(null);
const TRANSITION_TIME = 1200;

export const setTransitionDirection = (direction: 'forward' | 'backward') => {
	transitionDirection = direction;
};

export const getTransitionDirection = () => {
	return transitionDirection;
};

export const setTransitionTimeout = () => {
	timeoutExpires = Date.now() + TRANSITION_TIME;
};

export const getCanTransition = () => {
	if (Date.now() > timeoutExpires) {
		return true;
	}
	return false;
};

export const getForwardRoute = () => {
	return forwardRoute;
};

export const getBackwardRoute = () => {
	return backwardRoute;
};

export const setForwardRoute = (route: string) => {
	forwardRoute = route;
};

export const setBackwardRoute = (route: string) => {
	backwardRoute = route;
};