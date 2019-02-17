import RBAC from 'easy-rbac';

const options = {
  basic: {
    can: ['orders:get:my', 'products:get:active'],
  },
  admin: {
    can: [],
    inherits: ['basic'],
  },
};

export default new RBAC(options);
