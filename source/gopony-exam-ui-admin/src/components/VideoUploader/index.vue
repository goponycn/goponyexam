<template>
  <div class="component-upload-image" >
    <div >
      <el-upload  :action="uploadVideoUrl" :on-success="handleUploadSuccess" :before-upload="handleBeforeUpload"
        :limit="limit" :on-error="handleUploadError" :on-exceed="handleExceed" name="file" :on-remove="handleRemove"
        :show-file-list="false" :headers="headers" :file-list="fileList" :on-preview="handlePictureCardPreview"
         :on-progress="handleUploadVideoProcess"

        :class="{hide: this.fileList.length >= this.limit}">
        <el-button size="mini" type="primary">选取文件...</el-button>
        {{this.msg}}
      </el-upload>
    </div>

    <!-- 上传提示 -->
    <div class="el-upload__tip" slot="tip" v-if="showTip">
      请上传
      <template v-if="fileSize"> 大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b> </template>
      <template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b> </template>
      的文件
    </div>

    <el-dialog :visible.sync="dialogVisible" title="预览" width="600" append-to-body>
      <video :src="dialogVideoUrl" width="100%" height="100%" style="display: block; max-width: 100%; margin: 0 auto"
        controls="controls">您的浏览器不支持视频播放</video>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getToken
  } from "@/utils/auth";

  export default {
    props: {
      value: [String, Object, Array],
      // 数量限制
      limit: {
        type: Number,
        default: 0,
      },
      // 大小限制(MB)
      fileSize: {
        type: Number,
        default: 1000,
      },
      // 文件类型, 例如['png', 'jpg', 'jpeg']
      fileType: {
        type: Array,
        default: () => ["mp4", "qlv", "qsv", "ogg", "flv", "avi", "wmv", "rmvb"],
      },
      // 是否显示提示
      isShowTip: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        number: 0,
        uploadList: [],
        dialogVideoUrl: "",
        msg:"",
        dialogVisible: false,
        hideUpload: false,
        videoUploadPercent:0,
        baseUrl: process.env.VUE_APP_BASE_API,
        uploadVideoUrl: process.env.VUE_APP_BASE_API + "/datum/video/upload", // 上传的图片服务器地址
        headers: {
          Authorization: "Bearer " + getToken(),
        },
        fileList: []
      };
    },
    watch: {
      value: {
        handler(val) {
          if (val) {
            // 首先将值转为数组
            const list = Array.isArray(val) ? val : this.value.split(',');
            // 然后将数组转为对象数组
            this.fileList = list.map(item => {
              if (typeof item === "string") {
                if (item.indexOf(this.baseUrl) === -1) {
                  item = {
                    name: this.baseUrl + item,
                    url: this.baseUrl + item
                  };
                } else {
                  item = {
                    name: item,
                    url: item
                  };
                }
              }
              return item;
            });
          } else {
            this.fileList = [];
            return [];
          }
        },
        deep: true,
        immediate: true
      }
    },
    computed: {
      // 是否显示提示
      showTip() {
        return this.isShowTip && (this.fileType || this.fileSize);
      },
    },
    methods: {
      // 删除图片
      handleRemove(file, fileList) {
        const findex = this.fileList.map(f => f.name).indexOf(file.name);
        if (findex > -1) {
          this.fileList.splice(findex, 1);
          this.$emit("getVideoUrl", this.listToString(this.fileList));
        }
      },
      // 上传成功回调
      handleUploadSuccess(res) {
        this.uploadList.push({
          name: res.fileName,
          url: res.url
        });
        if (this.uploadList.length === this.number) {
         // this.fileList = this.fileList.concat(this.uploadList);
          let list = this.uploadList;
          this.uploadList = [];
          this.number = 0;
          this.$emit("getVideoUrl", this.listToString(list));
        }
        this.msg = "";
        this.$modal.closeLoading();
      },
      //进度条
      handleUploadVideoProcess(event, file, fileList) {
       // this.videoFlag = true;

        this.videoUploadPercent = file.percentage.toFixed(0) * 1;
        this.msg = "上传完成"+ this.videoUploadPercent +"%"
      },
      // 上传前loading加载
      handleBeforeUpload(file) {
        let isVideo = false;
        if (this.fileType.length) {
          let fileExtension = "";
          if (file.name.lastIndexOf(".") > -1) {
            fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
          }
          isVideo = this.fileType.some(type => {
            if (file.type.indexOf(type) > -1) return true;
            if (fileExtension && fileExtension.indexOf(type) > -1) return true;
            return false;
          });
        } else {
          isVideo = file.type.indexOf("video") > -1;
        }

        if (!isVideo) {
          this.$modal.msgError(`文件格式不正确, 请上传${this.fileType.join("/")}图片格式文件!`);
          return false;
        }
        if (this.fileSize) {
          const isLt = file.size / 1024 / 1024 < this.fileSize;
          if (!isLt) {
            this.$modal.msgError(`上传头像图片大小不能超过 ${this.fileSize} MB!`);
            return false;
          }
        }
        this.$modal.loading("正在上传视频，请稍候...");
        this.number++;
      },
      // 文件个数超出
      handleExceed() {
        this.$modal.msgError(`上传文件数量不能超过 ${this.limit} 个!`);
      },
      // 上传失败
      handleUploadError() {
        this.$modal.msgError("上传图片失败，请重试");
        this.msg = "" ;
        this.$modal.closeLoading();
      },
      // 预览
      handlePictureCardPreview(file) {
        this.dialogVideoUrl = file.url;
        this.dialogVisible = true;
      },
      // 对象转成指定字符串分隔
      listToString(list, separator) {
        let strs = "";
        separator = separator || ",";
        for (let i in list) {
          strs += list[i].url.replace(this.baseUrl, "") + separator;
        }
        return strs != '' ? strs.substr(0, strs.length - 1) : '';
      }
    }
  };
</script>
<style scoped lang="scss">
  // .el-upload--picture-card 控制加号部分
  ::v-deep.hide .el-upload--picture-card {
    display: none;
  }

  // 去掉动画效果
  ::v-deep .el-list-enter-active,
  ::v-deep .el-list-leave-active {
    transition: all 0s;
  }

  ::v-deep .el-list-enter,
  .el-list-leave-active {
    opacity: 0;
    transform: translateY(0);
  }
</style>
