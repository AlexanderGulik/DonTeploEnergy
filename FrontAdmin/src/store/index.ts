import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { reducer as userReducer } from './user/user.slice';
import { reducer as usersReducer } from './users/users.slice';

export interface RootSliceI {
  user: ReturnType<typeof userReducer>;
  users: ReturnType<typeof usersReducer>;
}

const rootReducer = combineReducers({
  user: userReducer,
  users: usersReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
