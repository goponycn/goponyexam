<template>
    <div class="app-container">
        <el-row :gutter="24">
            <el-col :span="24">
                <p style="font-family:'隶书';font-size: 38px;text-align: center;line-height: 300px;color: #80827f;">
                    欢迎使用小马在线考试通用系统
                </p>
            </el-col>
        </el-row>
        <el-row :gutter="24">
            <el-col :span="4" style="min-height: 1px;"></el-col>
            <el-col :span="16">
                <div style="width: 98%;text-align: center;">
                    <panel-group :panel="panel" v-if="isLogin"> </panel-group>
                </div>
            </el-col>
            <el-col :span="4" style="min-height: 1px;">
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import PanelGroup from '@/components/PanelGroup/index'
    import {
        getIndex
    } from "@/api/index";
    import {
        mapGetters
    } from 'vuex'
    export default {
        name: 'Index',
        components: {
            PanelGroup
        },
        data() {
            return {
                // 服务器信息
                panel: {
                    todayPapers: 0,
                    totalAchievements: 0,
                    todayNotices: 0
                },
                appName: "小马在线考试通用信息系统",
                appVersion: "3.0.0",
            };
        },
        computed: {
            ...mapGetters([
                'name',
                'isLogin'
            ])
        },
        created() {
          this.getInfo() ;
        },
        methods: {
            getInfo() {
                getIndex().then(response => {
                    this.panel = response.data.panel;
                })
            },
        }
    }
</script>

<style scoped>
    .app-container {
        width: 98%;
        margin: auto;
    }
</style>
