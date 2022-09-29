<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <panel-group :panel="panel" />
      <el-row :gutter="40"  class="panel-group">
        <el-col :span="24" class="card-box">
          <el-card>
            <div slot="header">
              <span>系统信息</span>
            </div>
            <div class="el-table el-table--enable-row-hover el-table--medium">
              <table cellspacing="0" style="width: 100%;">
                <tbody>
                  <tr>
                    <td class="el-table__cell is-leaf">
                      <div class="cell">程序名称</div>
                    </td>
                    <td class="el-table__cell is-leaf">
                      <div class="cell">{{ appName }}</div>
                    </td>
                    <td class="el-table__cell is-leaf">
                      <div class="cell">程序版本</div>
                    </td>
                    <td class="el-table__cell is-leaf">
                      <div class="cell">{{ appVersion }}</div>
                    </td>
                  </tr>
                  <tr>
                    <td class="el-table__cell is-leaf">
                      <div class="cell">启动时间</div>
                    </td>
                    <td class="el-table__cell is-leaf">
                      <div class="cell" >{{ server.startTime }}</div>
                    </td>
                    <td class="el-table__cell is-leaf">
                      <div class="cell">运行时长</div>
                    </td>
                    <td class="el-table__cell is-leaf">
                      <div class="cell">{{ server.runTime }}</div>
                    </td>
                  </tr>

                  <tr>

                    <td class="el-table__cell is-leaf">
                      <div class="cell">服务器名称</div>
                    </td>
                    <td class="el-table__cell is-leaf">
                      <div class="cell" >{{ server.computerName }}</div>
                    </td>
                    <td class="el-table__cell is-leaf">
                      <div class="cell">服务器IP</div>
                    </td>
                    <td class="el-table__cell is-leaf">
                      <div class="cell" >{{ server.computerIp }}</div>
                    </td>

                  </tr>
                  <tr>
                    <td class="el-table__cell is-leaf">
                      <div class="cell">CPU核心数</div>
                    </td>
                    <td class="el-table__cell is-leaf">
                      <div class="cell" >{{ server.cpuNum }}</div>
                    </td>
                    <td class="el-table__cell is-leaf">
                      <div class="cell">CPU使用率</div>
                    </td>
                    <td class="el-table__cell is-leaf">
                      <div class="cell"  :class="{'text-danger': server.cpuRate  > 80}">
                        {{ server.cpuRate }}%
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="el-table__cell is-leaf">
                      <div class="cell">内存数</div>
                    </td>
                    <td class="el-table__cell is-leaf">
                      <div class="cell" >{{ server.memTotal }}G</div>
                    </td>
                    <td class="el-table__cell is-leaf">
                      <div class="cell">内存使用率</div>
                    </td>
                    <td class="el-table__cell is-leaf">
                      <div class="cell" :class="{'text-danger': server.memRate > 80}">
                        {{ server.memRate }}%
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>

</template>

<script>
  import {
    getDashboard
  } from "@/api/dashboard";
  import PanelGroup from './dashboard/PanelGroup'
  export default {
    name: "Dashboard",
    components: {
      PanelGroup,
    },
    data() {
      return {
        // 服务器信息
        server: {},
        panel: {
          todayPapers: 0,
          todayNotices: 0,
          totalQuestions: 0,
          totalStudents: 0 ,
        },
        appName: "小马在线考试通用信息系统",
        appVersion: "3.0.0"
      };
    },
    created() {
      this.getList();
      this.openLoading();
    },
    methods: {
      /** 查询服务器信息 */
      getList() {
        getDashboard().then(response => {
          this.panel = response.data.panel;
          this.server = response.data.sys;
          this.$modal.closeLoading();
        });
      },
      // 打开加载层
      openLoading() {
        this.$modal.loading("正在加载服务器数据，请稍候！");
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    padding: 18px 22px 22px 22px;
    background-color: rgb(240, 242, 245);

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }
</style>
