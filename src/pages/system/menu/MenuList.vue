<template xmlns:v-auth="http://www.w3.org/1999/xhtml">
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <div :class="advanced ? null: 'fold'">
          <a-row >
            <a-col :md="8" :sm="24" >
              <a-form-item
                 :label="$t('name')"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input placeholder="请输入"  v-model="query['nameLIke']"  />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px;">
          <a-button type="primary" @click="page()">查询</a-button>
          <a-button style="margin-left: 8px" @click="reset()">重置</a-button>
          <a @click="toggleAdvanced" style="margin-left: 8px">
            {{advanced ? '收起' : '展开'}}
            <a-icon :type="advanced ? 'up' : 'down'" />
          </a>
        </span>
      </a-form>
    </div>
    <div>
      <a-space class="operator">
        <a-button @click="addNew" type="primary" v-auth:permission="`menu:add`">新增</a-button>
      </a-space>
      <div>
        <a-skeleton :loading="loading" active >
        <standard-table
                :columns="columns"
                :dataSource="dataSource"
                :selectedRows.sync="selectedRows"
                @clear="onClear"
                @change="onChange"
                @selectedRowChange="onSelectChange"
        >
          <div slot="icon" slot-scope="{text}">
            <a-icon style="font-size: large" :type="text" />
          </div>
          <div slot="action" slot-scope="{text, record}">
            <a  @click="showAuthority(record.key)" style="margin-right: 8px">
              <a-icon type="api" />操作权限
            </a>
            <a @click="editRecord(record)" style="margin-right: 8px" v-auth:permission="`menu:edit`">
              <a-icon type="edit"/>编辑
            </a>
            <a-popconfirm placement="topRight" ok-text="Yes" cancel-text="No"  v-auth:permission="`menu:del`" @confirm="deleteRecord(record.key)" >
              <template slot="title">
                <p>{{ $t('deleteMenu') }}</p>
              </template>
              <a >
                <a-icon type="delete" />删除
              </a>
            </a-popconfirm>
          </div>
          <template slot="statusTitle">
            <a-icon @click.native="onStatusTitleClick" type="info-circle" />
          </template>
        </standard-table>
        </a-skeleton>
      </div>
    </div>
      <a-modal
              v-model="modalVisible"
              :title="menuTitle"
              centered
              :maskClosable="false"
              @cancel="() => closeModel()"
              @ok="() => onSubmit()"
              :confirm-loading="confirmLoading"
      >
      <add-menu v-if="modalVisible" ref="addMenu" :record="record"></add-menu>
    </a-modal>
    <div>
      <a-drawer
              :title="$t('operationAuthority')"
              placement="right"
              :closable="false"
              :width="360"
              :visible="authorityVisible"
              @close="authorityVisible = false"

      >
        <menu-authority v-if="authorityVisible" ref="menuAuthority" :menuId="menuId"></menu-authority>
      </a-drawer>
    </div>
  </a-card>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
import AddMenu from '@/pages/system/menu/AddMenu'
import MenuAuthority from '@/pages/system/menu/MenuAuthority'
import {request, METHOD} from '@/utils/request'
import {successful} from '@/utils/notificationUtil'

const columns = [
  {
    title: '菜单名称',
    dataIndex: 'name'
  },
  {
    title: '菜单路径',
    dataIndex: 'path'
  },
  {
    title: '菜单部件',
    dataIndex: 'component'
  },
  {
    title: '菜单图标',
    dataIndex: 'icon',
    align: 'center',
    scopedSlots: { customRender: 'icon' }
  },
  {
    title: '排序',
    dataIndex: 'sort',
    sorter: true
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'QueryList',
  components: {StandardTable, AddMenu, MenuAuthority},
  i18n: require('./i18n'),
  data () {
    return {
      advanced: true,
      columns: columns,
      dataSource: [],
      selectedRows: [],
      modalVisible: false,
      record: null,
      loading: true,
      confirmLoading: false,
      query: {},
      authorityVisible: false,
      menuId: null,
      menuTitle: null
    }
  },
  authorize: {

  },
  created() {
   this.page();
  },
  methods: {
    page() {
      let param = {'current':1, 'size':10};
      Object.assign(param, this.query)
      request(process.env.VUE_APP_API_BASE_URL_AUTH + '/menu/treePage', METHOD.GET, param).then(res => {
        this.loading = false;
        if(res.data.data){
          this.dataSource = res.data.data['records'];
        }
      }).catch(this.loading = false)
    },
    reset(){
      this.query = {};
      this.page();
    },
    editRecord(record) {
      this.record = record;
      this.modalVisible = true;
      this.menuTitle = this.$i18n.t('editMenu')
    },
    deleteRecord(key) {
      request(process.env.VUE_APP_API_BASE_URL_AUTH + '/menu/delete/'+key, METHOD.DELETE).then(res => {
        const data = res.data;
        if(data&&data.success){
          successful('删除成功')
          this.page();
        }
      })
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    remove () {
      this.dataSource = this.dataSource.filter(item => this.selectedRows.findIndex(row => row.key === item.key) === -1)
      this.selectedRows = []
    },
    onClear() {
      this.$message.info('您清空了勾选的所有行')
    },
    onStatusTitleClick() {
      this.$message.info('你点击了状态栏表头')
    },
    onChange() {
      this.$message.info('表格状态改变了')
    },
    onSelectChange() {
      this.$message.info('选中行改变了')
    },
    addNew () {
      this.record = null;
      this.modalVisible = true;
      this.menuTitle = this.$i18n.t('addMenu')
    },
    onSelect(selectedKeys, info) {
      console.log('selected', selectedKeys, info);
    },
    onSubmit(){
      this.confirmLoading = true;
      this.$refs.addMenu.onSubmit(param=>{
        if(param&&!param.id){
          request(process.env.VUE_APP_API_BASE_URL_AUTH + '/menu/add', METHOD.POST, param).then(res => {
            const data = res.data;
            if(data&&data.success){
              this.confirmLoading = this.modalVisible = false;
              successful('添加成功')
            }
          })
        }else{
          request(process.env.VUE_APP_API_BASE_URL_AUTH + '/menu/edit', METHOD.PUT, param).then(res => {
            const data = res.data;
            if(data&&data.success){
              this.confirmLoading = this.modalVisible = false;
              successful('编辑成功')
            }
          })
        }
      })
    },
    closeModel(){
      this.$refs.addMenu.resetForm();
      this.modalVisible = false;
    },
    showAuthority(key){
      this.menuId = key;
      this.authorityVisible = true;
    },
  }
}
</script>

<style lang="less" scoped>
  .search{
    margin-bottom: 54px;
  }
  .fold{
    width: calc(100% - 216px);
    display: inline-block
  }
  .operator{
    margin-bottom: 18px;
  }
  @media screen and (max-width: 900px) {
    .fold {
      width: 100%;
    }
  }
</style>
