<template>
  <div class="card-list">
    <a-skeleton :loading="loading" active >
      <a-list
        :grid="{gutter: 24, lg: 3, md: 2, sm: 1, xs: 1}"
        :dataSource="dataSource"
      >
        <a-list-item slot="renderItem" slot-scope="item">
          <template v-if="item.add">
            <a-button class="new-btn" type="dashed" @click="add" v-if="hidden">
              <a-icon type="plus" />新增角色
            </a-button>
            <a-card :hoverable="true" v-if="!hidden">
              <a-form
                      :form="form"
                      @submit="handleSubmit"
              >
                <a-form-item>
                  <a-input
                          v-decorator="['userName',{ rules: [{ required: true, message: 'Please input your username!' }] },]"
                          placeholder="Username"
                  >
                    <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
                  </a-input>
                </a-form-item>
                <a-form-item>
                  <a-input
                          v-decorator="['password',{ rules: [{ required: true, message: 'Please input your Password!' }] },]"
                          type="password"
                          placeholder="Password"
                  >
                    <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
                  </a-input>
                </a-form-item>
              </a-form>
              <a slot="actions"  @click="handleSubmit">新增</a>
              <a slot="actions" @click="hidden = true">取消</a>
            </a-card>
          </template>
          <template v-else>
            <a-card :hoverable="true">
              <a-card-meta style="margin: 15px 0px">
                <div style="margin-bottom: 3px" slot="title">{{item.name}}</div>
                <a-avatar class="card-avatar" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png" size="large" />
                <div class="meta-content" slot="description">{{item.content}}</div>
              </a-card-meta>
              <a slot="actions">操作一</a>
              <a slot="actions">操作一</a>
            </a-card>
          </template>
        </a-list-item>
      </a-list>
    </a-skeleton>
  </div>
</template>

<script>
import {request, METHOD} from '@/utils/request'
export default {
  name: 'CardList',
  data () {
    return {
      dataSource: [],
      loading: false,
      query: {},
      hidden: true
    }
  },
  created() {
    this.page();
  },
  methods: {
    page() {
      this.loading = true;
      let param = {'current':0, 'size':999};
      Object.assign(param, this.query)
      this.dataSource = [];
      this.dataSource.push({add: true});

      request( process.env.VUE_APP_API_BASE_URL_AUTH + '/role/page', METHOD.GET, param).then(res => {
        const data = res.data;
        if(data&&data.success){
          this.dataSource = this.dataSource.concat(data.data['records']);
          this.loading = false;
        }
      }).catch(this.loading = false)
    },
    add() {
      this.form = this.$form.createForm(this, { name: 'normal_login' });
      this.hidden = false;
    },

    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    },
  }
}
</script>

<style lang="less" scoped>
  .card-avatar {
    width: 48px;
    height: 48px;
    border-radius: 48px;
  }
  .new-btn{
    border-radius: 2px;
    width: 100%;
    height: 226px;
  }
  .meta-content{
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    height: 64px;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

</style>
