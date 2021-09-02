<template>
    <div style="width: 100%" v-if="options.length>0">
    <a-row   v-for="(item,index) in options " :key="index" style="width:100%;display: flex">
        <div style="float: left;display: flex; width: 100%" >
            <a-col style="width: 100%">
                <a-checkbox-group  style="width:100%;height: 100%;">
                    <a-row  style="width: 100%;height: 100%;display: flex">
                        <a-col :span="24" style="padding: 5px;width: 100%;border-style: solid;border-width: 1px;border-color: #8080801f;">
                            <div style="margin-left: 8px;">
                                <a-checkbox :value="item.value" >{{item.label}}</a-checkbox>
                            </div>
                            <div style="margin-top: 10px; margin-left: 8px;" v-if="item.authority.length>0">
                                <a-checkbox-group  :options="item.authority"/>
                            </div>
                        </a-col>
                    </a-row>
                </a-checkbox-group>
            </a-col>
        </div>
        <authority-view :options="item.children"></authority-view>
    </a-row>
    </div>
</template>

<script>
// import {request, METHOD} from '@/utils/request'
// import {info} from '@/utils/notificationUtil'

const defaultCheckedList = [];
export default {
    name: 'AuthorityView',
    i18n: require('./i18n'),
    props: {
        options: {
            type: Array ,
            default: null
        },
    },
    data () {
        return {
            checkedList: defaultCheckedList,
        }
    },
    created() {

    },
    methods: {

    }
}
</script>

<style lang="less" scoped>
    @import "index";
</style>
