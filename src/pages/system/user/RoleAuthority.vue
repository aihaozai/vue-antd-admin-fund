<template>
    <a-list
            :dataSource="authorityData"
            :loading="loading"
    >
        <a-list-item slot="renderItem" slot-scope="item">
            <template v-if="permission.hasOwnProperty(item.id)">
                <a-tag color="green" style="padding: 0;width: 100%" @click="del(item.id)">
                <a-card :hoverable="true" >
                    <a-card-meta >
                      <div style="margin-bottom: 3px" slot="title">{{item.name}}</div>
                      <div class="meta-content" slot="description">{{item.code}}</div>
                    </a-card-meta>
                </a-card>
                </a-tag>
            </template>
            <template v-else>
                <a-card :hoverable="true" @click="add(item.id)">
                    <a-card-meta >
                        <div style="margin-bottom: 3px" slot="title">{{item.name}}</div>
                        <div class="meta-content" slot="description">{{item.code}}</div>
                    </a-card-meta>
                </a-card>
            </template>
        </a-list-item>
    </a-list>
</template>

<script>
import {request, METHOD} from '@/utils/request'
import {successful} from '@/utils/notificationUtil'

export default {
  name: 'RoleAuthority',
  components: {},
  props: {
      userId: {
          type: String,
          default: null
      },
   },
  data() {
      return {
          loading: false,
          hidden: true,
          authorityData: [],
          permission: {}
      };
  },
  created() {
    this.page();
  },
  methods: {
      page() {
          this.loading = true;
          let param = {'current':0, 'size':999};
          this.authorityData = [];

          request( process.env.VUE_APP_API_BASE_URL_AUTH + '/role/page', METHOD.GET, param).then(res => {
              const data = res.data;
              if(data&&data.success){
                  this.authorityData = this.authorityData.concat(data.data['records']);
                  this.loading = false;
              }
          }).catch(this.loading = false);
          this.rolePermission();
      },
      rolePermission() {
          let param = {'userId': this.userId};
          request( process.env.VUE_APP_API_BASE_URL_AUTH + '/rolePermission/list', METHOD.GET, param).then(res => {
              const data = res.data;
              if(data&&data.success){
                  this.permission = data.data;
                  for (let o of data.data){
                      this.permission[o.roleId] = o;
                  }
              }
          })
      },
      add(id) {
          request( process.env.VUE_APP_API_BASE_URL_AUTH + '/rolePermission/add', METHOD.POST, {'userId': this.userId, 'roleId': id}).then(res => {
              const data = res.data;
              if(data&&data.success){
                  successful('授权成功')
                  this.rolePermission();
              }
          })
      },
      del(id) {
          console.log(this.permission[id])
          request( process.env.VUE_APP_API_BASE_URL_AUTH + '/rolePermission/delete/'+this.permission[id].id, METHOD.DELETE).then(res => {
              const data = res.data;
              if(data&&data.success){
                  successful('取消授权成功')
                  this.rolePermission();
              }
          })
      }
  },
  mounted(){

  },
  computed: {
  },
}
</script>
<style  lang="less" scoped>
    .new-btn{
        border-radius: 2px;
        width: 100%;
        height: 142px;
    }
    .meta-content{
        position: relative;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
    }
    .ant-list-item{
        display: block;
    }
</style>
