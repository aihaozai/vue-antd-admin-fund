<template>
  <page-layout :avatar="currUser.avatar">
<!--    <div slot="headerContent">-->
<!--      <div class="title">{{welcome.timeFix[lang]}}，{{currUser.name}}，{{welcome.message[lang]}}</div>-->
<!--      <div>{{currUser.position[lang]}}</div>-->
<!--    </div>-->
<!--    <template slot="extra">-->
<!--      <head-info class="split-right" :title="$t('project')" content="56"/>-->
<!--      <head-info class="split-right" :title="$t('ranking')" content="8/24"/>-->
<!--      <head-info class="split-right" :title="$t('visit')" content="2,223"/>-->
<!--    </template>-->
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
                <a-list-item slot="renderItem" slot-scope="item">
                  <a slot="actions">{{$t('subscribeOpera')}}</a>
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
<!--          <a-card :loading="loading" :title="$t('dynamic')" :bordered="false">-->
<!--            <a-list>-->
<!--              <a-list-item :key="index" v-for="(item, index) in activities">-->
<!--                <a-list-item-meta>-->
<!--                  <a-avatar slot="avatar" :src="item.user.avatar" />-->
<!--                  <div slot="title" v-html="item.template" />-->
<!--                  <div slot="description">9小时前</div>-->
<!--                </a-list-item-meta>-->
<!--              </a-list-item>-->
<!--            </a-list>-->
<!--          </a-card>-->
        </a-col>

      </a-row>
    </template>
  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
import infiniteScroll from 'vue-infinite-scroll'
// import HeadInfo from '@/components/tool/HeadInfo'
// import Radar from '@/components/chart/Radar'
import {mapState} from 'vuex'
import {request, METHOD} from '@/utils/request'

export default {
  name: 'SubscribeFund',
  // components: {Radar, HeadInfo, PageLayout},
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
      fundListTotal: null,
      fundListTitle: ['name','cosd']
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
    request('http://localhost:7003/fund/fund/getSubscribeFund', METHOD.GET).then(res => {
        this.fundData = res.data.data;
        this.loading = false
      })
  },
  methods: {
    fetchData(callback) {
      request('http://localhost:7003/fund/fundDetail/page', METHOD.POST, {'size':this.dataCount*10, 'current':(this.dataCount+1)*10}).then(res => {
        callback(res);
      })
    },
    handleInfiniteOnLoad() {
      const data = this.fundList;
      this.fundListLoading = true;
      if (this.fundListTotal && data.total > 14) {
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
    format(item){
      if(item){
        return item + '%'
      }
      return item;
    }
  },
}
</script>

<style lang="less">
@import "index";
</style>
