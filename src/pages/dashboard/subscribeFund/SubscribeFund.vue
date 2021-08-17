<template>
  <page-layout :avatar="currUser.avatar">
    <template>
      <a-row style="margin: 0 -12px">
        <a-col style="padding: 0 12px" :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card  class="fund-list-max-height beauty-scroll"  style="margin-bottom: 24px" :bordered="false" :body-style="{padding: 0}">
            <a slot="extra">{{$t('fundList')}}</a>
            <div
              v-infinite-scroll="handleInfiniteOnLoad"
              :infinite-scroll-disabled="busy"
              :infinite-scroll-distance="10"
            >
              <a-list :data-source="fundList">
                <a-list-item slot="renderItem" slot-scope="item" style="margin-left: 10px">
                  <a slot="actions" @click="subscribe(item)">{{item['subscribeId'] ? $t('unSubscribeOpera'): $t('subscribeOpera')}}</a>
                  <a-list-item-meta :description="item['fundType']+item['fundCode']">
                    <a slot="title" >{{ item['fundName'] }}</a>
                    />
                  </a-list-item-meta>
                  <div style="margin-left: 50px">{{ format(item['oneN']) }}</div>
                  <div style="margin-left: 20px">{{ format(item['sixY']) }}</div>
                  <div style="margin-left: 20px">{{ format(item['threeY']) }}</div>
                  <div style="margin-left: 20px">{{ format(item['oneY']) }}</div>
                </a-list-item>
              </a-list>
            </div>
          </a-card>
        </a-col>
        <a-col style="padding: 0 12px" :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card class="project-list fund-list-max-height beauty-scroll" :loading="loading" style="margin-bottom: 24px;" :bordered="false"  :body-style="{padding: 0}">
            <a slot="extra">{{$t('progress')}}</a>
            <div>
              <a-card-grid :key="i" v-for="(item, i) in fundData">
                <a-card :bordered="false" :body-style="{padding: 0}">
                  <a-card-meta :description="item['fundCode']">
                    <div slot="title" class="card-title">
                      <a-icon type="fund" />
                      <span>{{item['fundName']}}</span>
                    </div>
                  </a-card-meta>
                  <div class="project-item">
                    <span class="datetime">{{item['companyName']}}</span>
                  </div>
                </a-card>
              </a-card-grid>
            </div>
          </a-card>
        </a-col>

      </a-row>
    </template>
  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
import infiniteScroll from 'vue-infinite-scroll'
import {mapState} from 'vuex'
import {request, METHOD} from '@/utils/request'

export default {
  name: 'SubscribeFund',
  directives: { infiniteScroll },
  components: {PageLayout},
  i18n: require('./i18n'),
  data () {
    return {
      fundData: [],
      loading: true,
      activities: [],
      teams: [],
      welcome: {
        timeFix: '',
        message: ''
      },
      fundListLoading: true,
      busy: false,
      fundList: [],
      dataCount: 0,
      fundListTotal: null
    }
  },
  computed: {
    ...mapState('account', {currUser: 'user'}),
    ...mapState('setting', ['lang'])
  },
  created() {
    request('/user/welcome', METHOD.GET).then(res => this.welcome = res.data)
    request('/work/activity', METHOD.GET).then(res => this.activities = res.data)
    request('/work/team', METHOD.GET).then(res => this.teams = res.data)
    this.subscribeList();
  },
  methods: {
    /**
     * 加载更多
     */
    handleInfiniteOnLoad() {
      const data = this.fundList;
      this.fundListLoading = true;
      if (this.fundListTotal && data.length >= this.fundListTotal) {
        this.busy = true;
        this.fundListLoading = false;
        return;
      }
      this.fetchData(res => {
        this.dataCount +=1;
        this.fundList = data.concat(res.data.data['records']);
        this.fundListTotal = data.concat(res.data.data['total']);
        this.fundListLoading = false;
      });
    },
    /**
     * 刷新数据回调
     * @param callback
     */
    fetchData(callback) {
      request( process.env.VUE_APP_API_BASE_URL_FUND + '/fundDetail/subscribePage', METHOD.GET, {'current':this.dataCount+1, 'size':10}).then(res => {
        callback(res);
      })
    },
    /**
     * 格式化
     * @param item
     */
    format(item){
      if(item){
        return item + '%'
      }
      return item;
    },
    /**
     * 订阅
     * @param item
     */
    subscribe(item){
      if(item['subscribeId']){
        request(process.env.VUE_APP_API_BASE_URL_FUND + '/fundSubscribe/unSubscribe?subscribeId='+item['subscribeId'], METHOD.DELETE).then(res => {
          const data = res.data;
          if(data&&data.success){
            this.$message.success(`已取消订阅`);
            this.subscribeList();
            this.fundList = [];
            this.dataCount =  0;
            this.fundListTotal = null;
            this.handleInfiniteOnLoad();
          }
        })
      }else{
        request(process.env.VUE_APP_API_BASE_URL_FUND + '/fundSubscribe/subscribe?fundCode='+item['fundCode'], METHOD.PUT).then(res => {
          const data = res.data;
          if(data&&data.success){
            this.$message.success(`订阅成功`);
            this.subscribeList();
            this.fundList = [];
            this.dataCount =  0;
            this.fundListTotal = null;
            this.handleInfiniteOnLoad();
          }
        })
      }
    },

    subscribeList(){
      this.loading = true
      request( process.env.VUE_APP_API_BASE_URL_FUND + '/fund/getSubscribeFund', METHOD.GET).then(res => {
        this.fundData = res.data.data;
        this.loading = false
      })
    }
  },
}
</script>

<style lang="less">
@import "index";
</style>
