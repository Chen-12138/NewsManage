import { createStore, combineReducers } from 'redux'
import { CollapsedReducer } from './reducers/CollapsedReducer'
import { LoadingReducer } from './reducers/LoadingReducer'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
    key: 'chen',
    storage,
    blacklist: ['LoadingReducer'] // navigation will not be persisted
}

const reducer = combineReducers({
    CollapsedReducer,
    LoadingReducer
})

const persistedReducer = persistReducer(persistConfig, reducer)

const store = createStore(persistedReducer);

const persistor = persistStore(store);

export {
    store,
    persistor
}

/*
    这个是redux，并没有用react-redux
    // 发布
    store.dispatch()

    // 订阅
    store.subsribe()
*/