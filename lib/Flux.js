import _ from 'lodash';

import Action from './Action';
import Store from './Store';
import creatable from './util/creatable';

/**
 * Given a `route` (express-like route format, eg. /users/:userId),
 * returns a function which attemps to match a given string.
 * This function returns null if the given string doesn't match.
 * Otherwise this function returns an Object mapping the name of each part found
 * to its value.
 * @param {Routable} routable Instance of the Routable class or derived (usually Action or Store)
 * @return {Function} Matcher function
 * @example
 *
 * const userMatcher = createMatcher('/users/:userId');
 * userMatcher('/users/4') // => { userId: '4' }
 * userMatcher('/test/42') // => null
 */
function createMatcher({ keys, re }) {
  function matchPath(path) {
    const m = re.exec(path);
    return m === null ? null : _(keys)
      .map(({ name }, i) => [name, m[i + 1]])
      .fromPairs()
    .value();
  }
  return matchPath;
}

/**
 * Error thrown by Flux#dispatchAction
 * @class
 * @extends Error
 */
class ActionNotFoundError extends Error {
  /**
   * Contructs a new ActionNotFoundError.
   * @constructor
   * @param {String} path Path of the requested action
   */
  constructor(path) {
    super(`Action not found (path=${path})`);
  }
}

/**
 * Error throw by Flux#fetchStore, Flux#observeStore, and Flux#readStoreFromState
 * @class
 * @extends Error
 */
class StoreNotFoundError extends Error {
  /**
   * Contructs a new StoreNotFoundError.
   * @constructor
   * @param {String} path Path of the requested store
   */
  constructor(path) {
    super(`Store not found (path=${path})`);
  }
}

/**
 * Find the first pair of {@link Routable} and given path's query which route path matches one of the
 * {@link Routable} matcher in the collection.
 * @param {String} path Route path
 * @param {Array<Array<Function|Routable>>} collection List containing pairs of matchers and their related
 *                                          {@link Routable}s.
 * @return {Array<Routable|Object>} The pair containing the {@link Routable} and its query if the given path matches
 *                                  one of the {@link Routable} matcher, null otherwise.
 */
function findInMatchers(path, collection) {
  return _(collection)
    .map(([matcher, routable]) => [routable, matcher(path)])
  .find(([, query]) => query !== null);
}

/**
 * Represent a Flux
 * A flux is a hub for {@Store}s and {@Action}s it allow them to comunicate.
 */
@creatable
class Flux {
  static ActionNotFoundError = ActionNotFoundError;
  static StoreNotFoundError = StoreNotFoundError;

  /**
   * Constructs a new Flux.
   * @constructor
   * @param {{ actions: Array<Action>, stores: Array<Store> }} config Configuration object
   * @param {Array<Action>} config.actions Initial actions
   * @param {Array<Store>} config.stores Initial stores
   */
  constructor({ actions = [], stores = [] } = {}) {
    this.actions = [];
    this.stores = [];
    actions.map((action) => this.action(action));
    stores.map((store) => this.store(store));
  }

  /**
   * Loads each stores of the Flux with the data from the provided Flux state
   * @param {Array<Object>} state Flux's stores states
   * @return {Flux} Flux instance
   */
  loadState(state) {
    this.stores.forEach(([, store], k) => store.loadState(state[k]));
    return this;
  }

  /**
   * Generates an array with each Flux's stores states.
   * @return {Array<Object>} [description]
   */
  dumpState() {
    return this.stores.map(([, store]) => store.dumpState());
  }

  /**
   * Adds a new Action in the FLux.
   * @param {Action} action Action to add
   * @return {Action} Added action
   */
  addAction(action) {
    this.actions.push([createMatcher(action), action]);
    return action;
  }

  /**
   * Find an action given a route.
   * @param {String} needle Route of the action to find
   * @return {Action} First Action matching the route
   */
  findAction(needle) {
    return _(this.actions)
      .filter(([, { route }]) => route === needle)
      .map(([, action]) => action)
    .first();
  }

  /**
   * Given a path, find a corresponding action.
   * @throws ActionNotFoundError
   * @param {String} path Path of the action
   * @return {Action} Action corresponding to the path
   */
  matchAction(path) {
    const first = findInMatchers(path, this.actions);
    if(!first) {
      throw new ActionNotFoundError(path);
    }
    return first;
  }

  /**
   * Dispatch an action with parameters.
   * @param {String} path Path of the action to dispatch
   * @param {...*} param Parameters to dispatch with the action
   * @return {Promise} Promise returned by the action handler
   */
  async dispatchAction(path, ...params) {
    const [action, query] = this.matchAction(path);
    return await action.dispatch(query, ...params);
  }

  /**
   * Find or create an action dependending the type of the parameter
   * - If the parameter is an {@link Action}, the action is added to the flux.
   * - If the parameter is a string, the action is searched and returned if found.
   * @throws ActionNotFoundError
   * @param {String|Action} a Action to find or create
   * @return {Action} Action found or created
   */
  action(a) {
    if(a instanceof Action) {
      return this.addAction(a);
    }
    return this.findAction(a);
  }

  /**
   * Adds a new Store in the FLux.
   * @param {Store} store Store to add
   * @return {Store} Added store
   */
  addStore(store) {
    this.stores.push([createMatcher(store), store]);
    return store;
  }

  /**
   * Find a store given a route.
   * @param {String} needle Route of the store to find
   * @return {Store} First Store matching the route
   */
  findStore(needle) {
    return _(this.stores)
      .filter(([, { route }]) => route === needle)
      .map(([, store]) => store)
    .first();
  }

  /**
   * Given a path, find a corresponding store.
   * @throws StoreNotFoundError
   * @param {String} path Path of the store
   * @return {Store} Store corresponding to the path
   */
  matchStore(path) {
    const first = findInMatchers(path, this.stores);
    if(!first) {
      throw new StoreNotFoundError(path);
    }
    return first;
  }

  /**
   * Fetch the content of a store given his path.
   * @param {*} binding TODO: To implement after signature change.
   * @return {Promise<State>} {@link State} of the store
   */
  async fetchStore(...binding) {
    const [path] = binding;
    const [store, query] = this.matchStore(path);
    return await store.fetch(query);
  }

  /**
   * Synchronously read the current state of the store.
   * @param {*} binding TODO: To implement after signature change.
   * @return {State} Current {@link State} of the {@link Store}
   */
  readStoreFromState(...binding) {
    const [path] = binding;
    const [store, query] = this.matchStore(path);
    return store.readFromState(query);
  }

  /**
   * Find or create an store dependending the type of the parameter
   * - If the parameter is an {@link Store}, the store is added to the flux.
   * - If the parameter is a String, the store is searched and returned if found.
   * @throws StoreNotFoundError
   * @param {String|Store} s Store to find or create
   * @return {Store} Store found or created
   */
  store(s) {
    if(s instanceof Store) {
      return this.addStore(s);
    }
    return this.findStore(s);
  }
}

export default Flux;
