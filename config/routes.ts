export default [
  {
    path: '/user',
    layout: false,
    routes: [{ name: '登录', path: '/user/login', component: './User/Login' }],
  },
  {
    path: '/vm-manage',
    name: '设备管理',
    icon: 'ContainerOutlined',
    component: './vm-manage',
  },
  {
    path: '/deploy',
    name: 'deploy',
    icon: 'smile',
    component: './deploy',
  },
  {
    path: '/',
    redirect: '/deploy',
  },
  {
    component: './404',
  },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', name: '二级管理页', component: './Admin' },
    ],
  },
  { name: '查询表格', icon: 'table', path: '/list', component: './TableList' },
  { path: '*', layout: false, component: './404' },
];
