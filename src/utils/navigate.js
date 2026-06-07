let _navigate = null;

export const setNavigator = (navigate) => {
  _navigate = navigate;
};

export const navigateTo = (path) => {
  if (_navigate) {
    _navigate(path, { replace: true });
  }
};
