import {createStore, combineReducers} from 'redux'
import tokenReducer from './reducer';

const rootReducer = combineReducers({
    token: tokenReducer
})

const configureStore=()=>{
    return createStore(rootReducer);
}

export default configureStore;