<template>
    <a-list
            :dataSource="authorityData"
            :loading="loading"
    >
        <a-list-item slot="renderItem" slot-scope="item">
            <template v-if="item.add">
                <a-button class="new-btn" type="dashed" @click="add" v-if="hidden">
                    <a-icon type="plus" />{{$t('add')}}
                </a-button>
                    <a-card :hoverable="true" v-if="!hidden">
                        <a-form
                                :form="form"
                                @submit="handleSubmit"
                        >
                          <a-form-item>
                            <a-input
                                    v-decorator="['name',{ rules: [{ required: true, message: $t('input')+$t('authorityName') }, { max: 32, message: $t('lengthMsg32'), trigger: 'blur' }] }]"
                                    :placeholder="$t('authorityName')"
                            >
                            </a-input>
                          </a-form-item>
                          <a-form-item>
                            <a-input
                                    v-decorator="['code',{ rules: [{ required: true, message: $t('input')+$t('authorityCode') },{ max: 15, message: $t('lengthMsg15'), trigger: 'blur' }] }]"
                                    :placeholder="$t('authorityCode')"
                            >
                            </a-input>
                          </a-form-item>
                        </a-form>
                        <a slot="actions" @click="hidden = true">{{$t('cancel')}}</a>
                        <a slot="actions" @click="handleSubmit">{{$t('add')}}</a>
                    </a-card>
            </template>
            <template v-else>
                <!--目的动态渲染-->
                <div v-if="render"></div>
                <a-card :hoverable="true" v-if="!item.edit">
                    <a-card-meta >
                      <div style="margin-bottom: 3px" slot="title">{{item.name}}</div>
                      <div class="meta-content" slot="description">{{item.code}}</div>
                    </a-card-meta>
                    <a slot="actions" @click="edit(item)" >{{$t('edit')}}</a>
                    <a slot="actions" @click="del(item.id)" >{{$t('delete')}}</a>
                </a-card>
                <div v-if="!editHidden&&item.edit">
                    <a-card :hoverable="true" >
                        <a-form
                                :form="editForm"
                        >
                            <a-form-item>
                                <a-input
                                        v-decorator="['name',{ rules: [{ required: true, message: $t('input')+$t('authorityName') }, { max: 32, message: $t('lengthMsg32'), trigger: 'blur' }] }]"
                                        :placeholder="$t('authorityName')"
                                >
                                </a-input>
                            </a-form-item>
                            <a-form-item>
                                <a-input
                                        v-decorator="['code',{ rules: [{ required: true, message: $t('input')+$t('authorityCode') },{ max: 15, message: $t('lengthMsg15'), trigger: 'blur' }] }]"
                                        :placeholder="$t('authorityCode')"
                                >
                                </a-input>
                            </a-form-item>
                        </a-form>
                        <a slot="actions" @click="closeEdit(item)">{{$t('cancel')}}</a>
                        <a slot="actions" @click="handleUpdate(item)">{{$t('ok')}}</a>
                    </a-card>
                </div>
            </template>
        </a-list-item>
    </a-list>
</template>

<script>
import {request, METHOD} from '@/utils/request'
import {successful} from '@/utils/notificationUtil'
export default {
  name: 'AddMenu',
  components: {},
  i18n: require('./i18n'),
  props: {
      menuId: {
          type: String,
          default: null
      },
   },
  data() {
      return {
          loading: false,
          hidden: true,
          editHidden: true,
          authorityData: [],
          editForm: null,
          render: false,
      };
  },
  created() {
    this.page();
  },
  methods: {
      page() {
          this.loading = true;
          let param = {'menuId': this.menuId};
          this.authorityData = [];
          this.authorityData.push({add: true});

          request( process.env.VUE_APP_API_BASE_URL_AUTH + '/authority/list', METHOD.GET, param).then(res => {
              const data = res.data;
              if(data&&data.success){
                  this.authorityData = this.authorityData.concat(data.data);
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
             // info('请更新当前角色')
              return;
          }
          this.editForm = this.$form.createForm(this, { name: 'edit' });
          item.edit = true;
          this.editHidden = false;
          this.$forceUpdate();

          this.$nextTick(()=>{
              this.editForm.setFieldsValue({
                  name: item.name,
                  code: item.code,
              });
              this.render = !this.render;
          })

      },
      del(key) {
          this.$confirm({
              title: this.$i18n.t('deleteAuthority'),
              okText: this.$i18n.t('ok'),
              okType: 'danger',
              cancelText: this.$i18n.t('cancel'),
              onOk() {
                  request(process.env.VUE_APP_API_BASE_URL_AUTH + '/authority/delete/'+key, METHOD.DELETE).then(res => {
                      const data = res.data;
                      if(data&&data.success){
                          successful('删除成功')
                          this.page();
                      }
                  })
              },
          });
      },
      closeEdit(item) {
          item.edit=false;
          this.editHidden = true;
          this.editForm = null;
          this.$forceUpdate();
      },
      handleSubmit(e) {
          e.preventDefault();
          this.form.validateFields((err, values) => {
              if (!err) {
                  values.menuId = this.menuId;
                  request( process.env.VUE_APP_API_BASE_URL_AUTH + '/authority/add', METHOD.POST, values).then(res => {
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
                  values.menuId = this.menuId;
                  request( process.env.VUE_APP_API_BASE_URL_AUTH + '/authority/edit', METHOD.PUT, values).then(res => {
                      const data = res.data;
                      if(data&&data.success){
                          this.closeEdit(item);
                          this.page();
                      }
                  })
              }
          });
      },
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
