<template>

  <div style="height: 100%">


    <div style="height: 64px;background-color: #495060;">
      <span class="name">文件管理系统</span>
      <div style="float: right;margin-top: 16px">
        <user style="float: right;"/>
      </div>
    </div>
    <Layout style="height: 100%" class="main">
      <Sider hide-trigger collapsible :width="210" :collapsed-width="64" v-model="collapsed" style="overflow: auto">
        <side-menu accordion :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage"
                   :menu-list="menuList">
          <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
          <!--<div class="logo-con">-->
          <!--<img v-show="!collapsed" :src="maxLogo" key="max-logo"/>-->
          <!--<img v-show="collapsed" :src="minLogo" key="min-logo"/>-->
          <!--</div>-->
        </side-menu>
      </Sider>
      <Layout>
        <Header class="header-con">
          <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
            <!--<user/>-->
          </header-bar>
        </Header>
        <Content>
          <Layout>
            <!--<div class="tag-nav-wrapper">-->
            <!--<tags-nav :value="$route" @input="handleClick" :list="tagNavList" @on-close="handleCloseTag"/>-->
            <!--</div>-->
            <Content class="content-wrapper" style="height: 100%">
              <keep-alive :include="cacheList">
                <router-view/>
              </keep-alive>
            </Content>
          </Layout>
        </Content>
        <Footer style="text-align: center">
          <p>&copy; 2018 <a href="http://store.wo.com.cn/" target="_blank">xxxx有限公司</a></p>
        </Footer>
      </Layout>
    </Layout>
  </div>
</template>
<script>
  import SideMenu from './components/side-menu'
  import HeaderBar from './components/header-bar'
  import TagsNav from './components/tags-nav'
  import User from './components/user'
  import {mapActions, mapGetters, mapMutations} from 'vuex'
  import {getNextName} from '@/libs/util'
  import './main.less'
  import VueEvent from '@/libs/vueEvent.js'

  export default {
    name: 'Main',
    components: {
      SideMenu,
      HeaderBar,
      TagsNav,
      User
    },
    data() {
      return {
        collapsed: false,
      }
    },
    computed: {
      ...mapGetters(['tabFlag', 'superMsg', 'simpleMsg']),
      tagNavList() {
        return this.$store.state.app.tagNavList
      },
      tagRouter() {
        return this.$store.state.app.tagRouter
      },
      userAvator() {
        return this.$store.state.user.avatorImgPath
      },
      cacheList() {
        return this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []
      },
      menuList() {
        return this.$store.getters.menuList
      }
    },
    methods: {
      ...mapMutations([
        'setBreadCrumb',
        'setTagNavList',
        'addTag',
        'setTabFlag'
      ]),
      ...mapActions([
        'handleLogin'
      ]),
      changeTab(n) {
        this.setTabFlag(n);
        let name = n == 0 ? 'home_index' : n == 1 ? 'home_mms' : 'home_sms';
        setTimeout(() => {
          this.$router.push({name: name});
        }, 100);
      },
      turnToPage(name) {
        this.$router.push({name: name})
        VueEvent.$emit('on-open-page', name)
      },
      handleCollapsedChange(state) {
        this.collapsed = state
      },
      handleCloseTag(res, type, name) {
        const nextName = getNextName(this.tagNavList, name)
        this.setTagNavList(res)
        if (type === 'all') this.turnToPage('home')
        else if (this.$route.name === name) this.$router.push({name: nextName})
      },
      handleClick(item) {
        this.turnToPage(item.name)
      },
      goToSms() {
        window.open("https://saas.wostore.cn/sms/login");
      }
    },
    watch: {
      '$route'(newRoute) {
        this.setBreadCrumb(newRoute.matched)
//        this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
      }
    },
    mounted() {
      /**
       * @description 初始化设置面包屑导航和标签导航
       */
//      this.setTagNavList()
//      this.addTag(this.$store.state.app.homeRoute)
      this.setBreadCrumb(this.$route.matched)
    }
  }
</script>

<style scoped lang="less">
  .outer {
    float: left;
    margin-left: 36px;
    margin-top: 16px;
  }

  label {
    font-size: 14px;
    font-weight: bold;
    padding: 4px;
  }

  .top-bar {
    float: right;
    margin-right: 32px;

    a {
      display: inline-block;
      height: 64px;
      line-height: 64px;
      font-size: 16px;
      color: lightgray;
      margin-right: 32px;
    }

    a:hover, .active {
      color: #2D8CF0;
    }
  }

  .name {
    color: white;
    letter-spacing: 8px;
    width: 320px;
    height: 64px;
    line-height: 64px;
    margin-left: 24px;
    display: inline-block;
    font-size: 16px;
  }
</style>
