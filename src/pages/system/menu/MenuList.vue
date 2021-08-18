<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <div :class="advanced ? null: 'fold'">
          <a-row >
            <a-col :md="8" :sm="24" >
              <a-form-item
                label="规则编号"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" >
              <a-form-item
                label="使用状态"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}"
              >
                <a-select placeholder="请选择">
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" >
              <a-form-item
                label="调用次数"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input-number style="width: 100%" placeholder="请输入" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="advanced">
            <a-col :md="8" :sm="24" >
              <a-form-item
                label="更新日期"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}"
              >
                <a-date-picker style="width: 100%" placeholder="请输入更新日期" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" >
              <a-form-item
                label="使用状态"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}"
              >
                <a-select placeholder="请选择">
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" >
              <a-form-item
                label="描述"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input placeholder="请输入" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px;">
          <a-button type="primary">查询</a-button>
          <a-button style="margin-left: 8px">重置</a-button>
          <a @click="toggleAdvanced" style="margin-left: 8px">
            {{advanced ? '收起' : '展开'}}
            <a-icon :type="advanced ? 'up' : 'down'" />
          </a>
        </span>
      </a-form>
    </div>
    <div>
      <a-space class="operator">
        <a-button @click="addNew" type="primary">新建</a-button>
        <a-button @click="addNew" type="danger">批量删除</a-button>
      </a-space>
      <div>
        <div  style="float: left;width: 12%;margin-right: 10px" >
          <a-tree show-line :default-expanded-keys="['0-0-0']" @select="onSelect">
            <a-icon slot="switcherIcon" type="down" />
            <a-tree-node key="0-0" title="parent 1">
              <a-tree-node key="0-0-0" title="parent 1-0">
                <a-tree-node key="0-0-0-0" title="leaf" />
                <a-tree-node key="0-0-0-1" title="leaf" />
                <a-tree-node key="0-0-0-2" title="leaf" />
              </a-tree-node>
              <a-tree-node key="0-0-1" title="parent 1-1">
                <a-tree-node key="0-0-1-0" title="leaf" />
              </a-tree-node>
              <a-tree-node key="0-0-2" title="parent 1-2">
                <a-tree-node key="0-0-2-0" title="leaf" />
                <a-tree-node key="0-0-2-1" title="leaf" />
              </a-tree-node>
            </a-tree-node>
          </a-tree>
        </div>
        <div style="float: left;width: 85%;">
         <standard-table
                 :columns="columns"
                 :dataSource="dataSource"
                 :selectedRows.sync="selectedRows"
                 @clear="onClear"
                 @change="onChange"
                 @selectedRowChange="onSelectChange"
         >
           <div slot="description" slot-scope="{text}">
             {{text}}
           </div>
           <div slot="action" slot-scope="{text, record}">
             <a style="margin-right: 8px">
               <a-icon type="plus"/>新增
             </a>
             <a style="margin-right: 8px">
               <a-icon type="edit"/>编辑
             </a>
             <a @click="deleteRecord(record.key)">
               <a-icon type="delete" />删除1
             </a>
             <a @click="deleteRecord(record.key)" v-auth="`delete`">
               <a-icon type="delete" />删除2
             </a>
             <router-link :to="`/list/query/detail/${record.key}`" >详情</router-link>
           </div>
           <template slot="statusTitle">
             <a-icon @click.native="onStatusTitleClick" type="info-circle" />
           </template>
         </standard-table>
        </div>
      </div>
    </div>
      <a-modal
              v-model="modalVisible"
              title="新增菜单"
              centered
              :maskClosable="false"
              @cancel="() => closeModel()"
              @ok="() => closeModel()"
      >
      <add-menu></add-menu>
    </a-modal>
  </a-card>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
import AddMenu from '@/pages/system/menu/AddMenu'
const columns = [
  {
    title: '规则编号',
    dataIndex: 'no'
  },
  {
    title: '描述',
    dataIndex: 'description',
    scopedSlots: { customRender: 'description' }
  },
  {
    title: '服务调用次数',
    dataIndex: 'callNo',
    sorter: true,
    customRender: (text) => text + ' 次'
  },
  {
    dataIndex: 'status',
    slots: {title: 'statusTitle'}
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    sorter: true
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]

const dataSource = []

for (let i = 0; i < 100; i++) {
  dataSource.push({
    key: i,
    no: 'NO ' + i,
    description: '这是一段描述',
    callNo: Math.floor(Math.random() * 1000),
    status: Math.floor(Math.random() * 10) % 4,
    updatedAt: '2018-07-26'
  })
}

export default {
  name: 'QueryList',
  components: {StandardTable,AddMenu},
  data () {
    return {
      advanced: true,
      columns: columns,
      dataSource: dataSource,
      selectedRows: [],
      modalVisible: false,
    }
  },
  authorize: {
    deleteRecord: 'delete'
  },
  methods: {
    deleteRecord(key) {
      this.dataSource = this.dataSource.filter(item => item.key !== key)
      this.selectedRows = this.selectedRows.filter(item => item.key !== key)
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
     this.modalVisible = true;
    },
    handleMenuClick (e) {
      if (e.key === 'delete') {
        this.remove()
      }
    },
    onSelect(selectedKeys, info) {
      console.log('selected', selectedKeys, info);
    },
    closeModel(){
      this.modalVisible = false;
    }
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
