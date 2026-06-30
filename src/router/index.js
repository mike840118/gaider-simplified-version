import { createRouter, createWebHashHistory } from 'vue-router'
import DashboardView from '../views/dashboard/DashboardView.vue'
import AnalysisListView from '../views/AnalysisListView.vue'
import LocationView from '../views/location/LocationView.vue' // 新增
import DataManageView from '../views/dataManage/DataManageView.vue' // 新增
import UserManageView from '../views/UserManageView.vue' // 新增
const router = createRouter({
 history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'dashboard', component: DashboardView },
    { path: '/analysisList', name: 'analysisList', component: AnalysisListView },
    { path: '/location', name: 'location', component: LocationView },     // 新增定位資訊
    { path: '/data', name: 'data', component: DataManageView },         // 新增數據管理
    { path: '/users', name: 'users', component: UserManageView }         // 新增用戶管理
  ]
})

export default router