<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <router-link :to="'/examination/exam'" class="link-type">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-host">
            <svg-icon icon-class="monitor" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              今日开考
            </div>
            <count-to :start-val="0" :end-val="panel.todayPapers" :duration="2000" class="card-panel-num" />
          </div>
        </div>
      </router-link>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <router-link :to="'/system/notice'" class="link-type">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper  icon-alarm-today">
            <svg-icon icon-class="select" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              今日公告
            </div>
            <count-to :start-val="0" :end-val="panel.todayNotices" :duration="2000" class="card-panel-num" />
          </div>
        </div>
      </router-link>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <router-link :to="'/question/single'" class="link-type">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-alarm">
            <svg-icon icon-class="list" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              习题总数
            </div>
            <count-to :start-val="0" :end-val="panel.totalQuestions" :duration="2000" class="card-panel-num" />
          </div>
        </div>
      </router-link>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <router-link :to="'/student/student/index'" class="link-type">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper icon-collect-today">
            <svg-icon icon-class="people" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              学员总数
            </div>
            <count-to :start-val="0" :end-val="panel.totalStudents" :duration="2000" class="card-panel-num" />
          </div>
        </div>
      </router-link>
    </el-col>
  </el-row>
</template>
<script>
  import CountTo from 'vue-count-to'
  export default {
    components: {
      CountTo
    },
    props: {
      panel: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        count: {
          todayNotices: 0,
          todayNotices: 0,
          totalQuestions: 0,
          totalStudents: 0
        }
      }
    },
    mounted() {

    },
    methods: {
      // 路由跳转
      jump(path, parmas) {
        this.router.push({
          path: path,
          query: parmas
        });
      },
    }

  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .panel-group {
    margin-top: 18px;

    .card-panel-col {
      margin-bottom: 32px;
    }

    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);



      .icon-host {
        color: #40c9c6;
      }

      .icon-collect-today {
        color: #36a3f7;
      }

      .icon-alarm {
        color: #ff9900;
      }

      .icon-alarm-today {
        color: #f4516c;
      }

      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .card-panel-icon {
        float: left;
        font-size: 48px;
      }

      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;

        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }

        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }

  @media (max-width:550px) {
    .card-panel-description {
      display: none;
    }

    .card-panel-icon-wrapper {
      float: none !important;
      width: 100%;
      height: 100%;
      margin: 0 !important;

      .svg-icon {
        display: block;
        margin: 14px auto !important;
        float: none !important;
      }
    }
  }
</style>
