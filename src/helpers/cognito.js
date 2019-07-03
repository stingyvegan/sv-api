export default {
  getRoles: (userData) => {
    const groups = userData['cognito:groups'] || [];
    const groupsWithBasic = ['basic', ...groups];
    return groupsWithBasic;
  },
};
