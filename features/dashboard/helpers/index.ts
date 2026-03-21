const DEFAULT_USER_NAME = "Level Up User";

export const getStoredUserName = () => {
  if (typeof window === "undefined") {
    return DEFAULT_USER_NAME;
  }

  return window.localStorage.getItem("level_up_user_name") || DEFAULT_USER_NAME;
};
