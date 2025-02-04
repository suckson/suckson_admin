<template>
  <div class="navbar">
    <div class="left-menu">
      <hamburger id="hamburger-container" :is-active="appStore.sidebar.opened" class="hamburger-container"
        @toggleClick="toggleSideBar" />
      <tags-view />
    </div>
    <div class="right-menu">
      <template v-if="appStore.device !== 'mobile'">
        <el-tooltip content="全屏显示" effect="dark" placement="bottom">
          <screenfull id="screenfull" class="right-menu-item hover-effect" />
        </el-tooltip>
        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
        <el-tooltip content="清除缓存" effect="dark" placement="bottom">
          <clear-cache id="clear-cache" class="right-menu-item hover-effect"/>
        </el-tooltip>
      </template>
      <div class="avatar-container">
        <el-dropdown @command="handleCommand" class="right-menu-item hover-effect" trigger="click">
          <div class="avatar-wrapper">
            <img :src="userStore.avatar" class="user-avatar" />
            <div class="user-nickname">{{ userStore.nickName }}</div>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <router-link to="/user/profile">
                <el-dropdown-item>个人中心</el-dropdown-item>
              </router-link>
              <el-dropdown-item divided command="logout">
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
import TagsView from './TagsView/index.vue'
import { ElMessageBox } from 'element-plus'
import Hamburger from '@/components/Hamburger'
import Screenfull from './Navbar/Screenfull'
import SizeSelect from './Navbar/SizeSelect'
import ClearCache from './Navbar/ClearCache'
import useAppStore from '@store/modules/app'
import useUserStore from '@store/modules/user'

const appStore = useAppStore()
const userStore = useUserStore()

function toggleSideBar() {
  appStore.toggleSideBar()
}

function handleCommand(command) {
  switch (command) {
    case "setLayout":
      setLayout();
      break;
    case "logout":
      logout();
      break;
    default:
      break;
  }
}

function logout() {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.logOut().then(() => {
      location.href = '/index';
    })
  }).catch(() => { });
}

const emits = defineEmits(['setLayout'])
function setLayout() {
  emits('setLayout');
}
</script>

<style lang='scss' scoped>
.navbar {
  height: 62px;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
  align-items: center;

  .left-menu {
    display: flex;
    width: 80%;
    align-items: center;
  }

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    margin-right: 12px;
    border-radius: 5px;
    padding: 0 12px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      
      .avatar-wrapper {
        position: relative;
        height: 50px;
        display: flex;
        align-items: center;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
        .user-nickname{
          font-size: 16px;
          margin-left: 10px;
          // max-width: 50px;
        }

        i {
          cursor: pointer;
          position: absolute;
          // right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
