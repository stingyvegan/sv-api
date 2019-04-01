import RBAC from 'easy-rbac';

const options = {
  basic: {
    can: ['orders:get:my', 'orders:order:my', 'products:get:active'],
  },
  admin: {
    can: ['orders:get:active'],
    inherits: ['basic'],
  },
};

export default new RBAC(options);
