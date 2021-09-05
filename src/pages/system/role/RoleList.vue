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
                          v-decorator="['name',{ rules: [{ required: true, message: $t('input')+$t('name') }, { max: 32, message: $t('lengthMsg32'), trigger: 'blur' }] }]"
                          :placeholder="$t('name')"
                  >
                  </a-input>
                </a-form-item>
                <a-form-item>
                  <a-input
                          v-decorator="['code',{ rules: [{ required: true, message: $t('input')+$t('code') },{ max: 15, message: $t('lengthMsg15'), trigger: 'blur' }] }]"
                          :placeholder="$t('code')"
                  >
                  </a-input>
                </a-form-item>
              </a-form>
              <a slot="actions" @click="hidden = true">取消</a>
              <a slot="actions" @click="handleSubmit">新增</a>
            </a-card>
          </template>
          <template v-else>
            <a-card :hoverable="true" v-if="!item.edit">
              <a-card-meta style="margin: 15px 0px">
                <div style="margin-bottom: 3px" slot="title">{{item.name}}</div>
                <a-avatar class="card-avatar" slot="avatar" src="" type="user" size="large" />
                <div class="meta-content" slot="description">{{item.code}}</div>
              </a-card-meta>
              <a slot="actions" @click="edit(item)" >编辑</a>
              <a slot="actions" @click="showAuthority(item.id)" >授权</a>
            </a-card>
            <div v-if="item.edit">
              <a-card :hoverable="true">
                <a-form
                        :form="editForm"
                >
                  <a-form-item>
                    <a-input
                            v-decorator="['name',{ rules: [{ required: true, message: $t('input')+$t('name') }, { max: 32, message: $t('lengthMsg32'), trigger: 'blur' }] }]"
                            :placeholder="$t('name')"
                    >
                    </a-input>
                  </a-form-item>
                  <a-form-item>
                    <a-input
                            v-decorator="['code',{ rules: [{ required: true, message: $t('input')+$t('code') },{ max: 15, message: $t('lengthMsg15'), trigger: 'blur' }] }]"
                            :placeholder="$t('code')"
                    >
                    </a-input>
                  </a-form-item>
                </a-form>
                <a slot="actions" @click="closeEdit(item)">取消</a>
                <a slot="actions" @click="handleUpdate(item)">保存</a>
              </a-card>
            </div>
          </template>
        </a-list-item>
      </a-list>
    </a-skeleton>

    <a-drawer
            :title="$t('operationAuthority')"
            placement="right"
            :closable="false"
            :width="720"
            :visible="authorityVisible"
            @close="authorityVisible = false"
    >
      <authority-view :options="options" ref="authorityView"/>
      <div class="drawer-footer">
        <a-button style="margin-right: 8px" @click="authorityVisible = false">
          取消
        </a-button>
        <a-button type="primary" @click="authorityConfirm">
          确定
        </a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import {request, METHOD} from '@/utils/request'
import {info} from '@/utils/notificationUtil'
import AuthorityView from '@/pages/system/role/AuthorityView'
import {successful} from '@/utils/notificationUtil'

export default {
  name: 'RoleList',
  components: {AuthorityView},
  i18n: require('./i18n'),
  data () {
    return {
      dataSource: [],
      loading: false,
      query: {},
      hidden: true,
      editForm: null,
      authorityVisible: false,
      options: [],
      roleId: null,
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
      this.form = this.$form.createForm(this, { name: 'add' });
      this.hidden = false;
    },
    edit(item) {
      if(this.editForm!=null){
        info('请更新当前角色')
        return;
      }
      this.editForm = this.$form.createForm(this, { name: 'edit' });

      item.edit=true;
      this.$forceUpdate();
      this.$nextTick(()=>{
        this.editForm.setFieldsValue({
          name: item.name,
          code: item.code,
        });
      })
    },
    closeEdit(item) {
      item.edit=false;
      this.editForm = null;
      this.$forceUpdate();
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          request( process.env.VUE_APP_API_BASE_URL_AUTH + '/role/add', METHOD.POST, values).then(res => {
            const data = res.data;
            if(data&&data.success){
            this.page();
            }
          }).catch(this.hidden = !this.hidden)
        }
      });
    },
    handleUpdate(item) {
      this.editForm.validateFields((err, values) => {
        if (!err) {
          values.id = item.id;
          request( process.env.VUE_APP_API_BASE_URL_AUTH + '/role/edit', METHOD.PUT, values).then(res => {
            const data = res.data;
            if(data&&data.success){
              this.closeEdit(item);
              this.page();
            }
          })
        }
      });
    },
    showAuthority(id) {
      this.roleId = id;
      request( process.env.VUE_APP_API_BASE_URL_AUTH + '/menu/authorityTree', METHOD.GET).then(res => {
        const data = res.data;
        if(data&&data.success){
          this.options =data.data;
          this.authorityVisible = true

        }
      })
    },
    authorityConfirm() {
      let param = this.$refs.authorityView.getData();
      param.roleId = this.roleId
      request( process.env.VUE_APP_API_BASE_URL_AUTH + '/authorize/add', METHOD.POST,param).then(res => {
        const data = res.data;
        if(data&&data.success){
          this.authorityVisible = false
          successful('授权成功')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  @import "index";
</style>
