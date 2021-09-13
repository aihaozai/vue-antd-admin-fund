<template>
  <div>
    <a-card
      :bordered="false"
      title=""
    >
      <div slot="extra">
        <a-input placeholder="账号" v-model="query['accountLike']" style="margin-left: 10px; width: 272px;" />
        <a-input placeholder="用户名" v-model="query['usernameLike']" style="margin-left: 10px; width: 272px;" />
        <a-button type="primary" icon="search" style="margin-left: 10px; width: 40px;" @click="page()" :loading="loading"></a-button>
      </div>
      <a-list size="large" :pagination="true" :data-source="list" :bordered="false" :loading="loading" >
        <a-list-item  slot="renderItem" key="item.id" slot-scope="item">
          <a-list-item-meta
            description="账号"
          >
            <a-avatar slot="avatar" size="large" shape="square" :src="item.avatar"/>
            <a slot="title">{{item.account}}</a>
          </a-list-item-meta>
          <div class="list-content">
            <div class="list-content-item">
              <span>用户名</span>
              <p>{{item.username}}</p>
            </div>
            <div class="list-content-item">
              <span>账号状态</span>
              <p><a-tag :color="item['accountNonExpired']? 'green' : 'red'">
                {{ item['accountNonExpired']?'正常':'过期' }}
              </a-tag></p>
            </div>
            <div class="list-content-item">
              <span>锁定状态</span>
              <p><a-tag :color="item['accountNonLocked']? 'green' : 'red'">
                {{ item['accountNonLocked']?'正常':'锁定' }}
              </a-tag></p>
            </div>
            <div class="list-content-item">
              <span>证书状态</span>
              <p><a-tag :color="item['credentialsNonExpired']? 'green' : 'red'">
                {{ item['credentialsNonExpired']?'正常':'过期' }}
              </a-tag></p>
            </div>
            <div class="list-content-item">
              <span>操作</span>
              <p><a  @click="showAuthority(item.id)" style="margin-right: 8px">
                角色权限
              </a></p>
            </div>
          </div>
        </a-list-item>
      </a-list>
    </a-card>

    <a-drawer
            :title="$t('rolePermission')"
            placement="right"
            :closable="false"
            :width="360"
            :visible="authorityVisible"
            @close="authorityVisible = false"

    >
      <role-authority v-if="authorityVisible" ref="roleAuthority" :userId="userId"></role-authority>
    </a-drawer>
  </div>
</template>

<script>
import {request, METHOD} from '@/utils/request'
import RoleAuthority from '@/pages/system/user/RoleAuthority'

export default {
  name: 'UserList',
  components: {RoleAuthority},
  i18n: require('./i18n'),
  data() {
    return {
      list: [],
      pagination: {
        onChange: page => {
          this.current = page;
          this.page(page);
        },
        hideOnSinglePage:true,
        showQuickJumper: true,
        pageSize: 0,
        total: 0,
        current: 1,
      },
      loading: true,
      query: {},
      authorityVisible: false,
      userId: null,
    }
  },
  created() {
    this.page();
  },
  methods: {
    page(){
      let param = {'current':this.pagination.current, 'size':10};
      Object.assign(param, this.query)
      this.loading = true;
      request( process.env.VUE_APP_API_BASE_URL_AUTH + '/user/page', METHOD.GET, param).then(res => {
        const data = res.data;
        if(data&&data.success){
          this.list = data.data['records'];
          this.pagination.pageSize = data.data['size'];
          this.pagination.total = data.data['total'];
          this.loading = false;
        }
      }).catch(this.loading = false)
    },
    showAuthority(key){
      this.userId = key;
      this.authorityVisible = true;
    },
  }
}
</script>

<style lang="less" scoped>
  .list-content-item{
    color: @text-color-second;
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    margin-left: 40px;
    span{
      line-height: 20px;
    }
    p{
      margin: 4px 0 0;
      line-height: 22px;
    }
  }
</style>
