import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useMemo } from 'react';

import { actions as userActions } from '../store/user/user.slice';
import { actions as usersActions } from '../store/users/users.slice';

const rootActions = {
  ...userActions,
  ...usersActions,
};

export const useActions = () => {
  const dispatch = useDispatch();

  return useMemo(() => bindActionCreators(rootActions, dispatch), [dispatch]);
};
