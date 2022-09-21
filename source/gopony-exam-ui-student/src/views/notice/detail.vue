<template>
  <div class="article-container">
    <el-dialog :visible.sync="dialogPictureVisible" fullscreen>
      <img :src="dialogImageUrl" alt="dialogImageUrl" style="margin: 0 auto;" />
    </el-dialog>
    <el-row type="flex" class="mt20" v-if="!dialogArticle.visible" :gutter="24">
      <el-col :xs="24" :sm="17" :md="17" :lg="17">
        <el-card class="box-card">
          <div class="newsview">
            <h3 class="news_title" v-if="article.title">{{article.title}}</h3>
            <div class="bloginfo">
              <ul>
                <li class="author">
                  <span class="iconfont">&#xe60f; </span>
                  <a href="javascript:void(0);">{{article.author}}</a>
                </li>
                <li class="lmname">
                  <span class="iconfont">&#xe603; </span>
                  <a href="javascript:void(0);"
                  >{{article.categoryData ? article.categoryData.name: ""}}</a>
                </li>
                <li class="lmname">
                  <template v-for="(item, index) in article.tagList">
              <span
                style="margin-left: 3px"
                v-if="item.listClass == 'default' || item.listClass == ''"
                :key="item.tagId"
                :index="index"
                :class="item.cssClass">{{ item.content }}
              </span>
                    <el-tag
                      v-else
                      style="margin-left: 3px"
                      size="mini"
                      effect="light"
                      :key="item.tagId"
                      :index="index"
                      :type="item.listClass === 'primary' ? '' : item.listClass"
                      :class="item.cssClass? item.cssClass: ''">
                      {{ item.content }}
                    </el-tag>
                  </template>
                </li>

                <li class="view">
                  <span class="iconfont">&#xe8c7; </span>
                  {{article.clickCount}}
                </li>


                <li class="createTime">
                  <span class="iconfont">&#xe606; </span>
                  {{article.createTime}}
                </li>

              </ul>
            </div>
            <div class="tip">
              <strong>版权 </strong>
              <span v-html="article.copyright">
          </span>
            </div>
            <div
              class="news_con ck-content"
              v-html="article.content"
              v-highlight
              @click="preViewArticleImage"
            ></div>
          </div>
        </el-card>
        <el-card class="box-card mt20">
          <div class="intro">
            <div class="intro-text">
              <span>文章短評</span>
            </div>
          </div>
          <Comment :targetId="articleId" :tableName="tableName" :createBy="article.createBy"></Comment>
          <div class="otherlink" v-if="sameBlogList.length > 0">
            <h2>相关文章</h2>
            <ul>
              <li v-for="item in sameBlogList" :key="item.articleId">
                <a href="javascript:void(0);"
                   @click="toArticleDetail(item)"
                   :title="item.title">{{item.title | ellipsis(18)}}</a>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col class="hidden-sm-and-down" :xs="0" :sm="7" :md="7" :lg="7">
        <side-catalog
          class="catalog"
          v-bind="catalogProps">
        </side-catalog>
      </el-col>
    </el-row>
    <!-- 文章秘钥对话框 -->
    <el-dialog
      title="文章密码"
      :visible.sync="dialogArticle.visible"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="500px">
      <el-form
        ref="passwordForm"
        :model="dialogArticle.passwordForm"
        :rules="dialogArticle.passwordFormRules"
        label-width="80px">
        <el-form-item label="密码" prop="password">
          <el-input type="password" show-password placeholder="密码" minlength="6" maxlength="12"
                    @keyup.enter.native="handleSubmitBtnClick('passwordForm')"
                    v-model="dialogArticle.passwordForm.password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button plain type="primary" @click.native.prevent="handleSubmitBtnClick('passwordForm')">提 交</el-button>
        <el-button plain type="primary" @click="handleCloseBtnClick()">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {getNotice, getNoticeList} from '@/api/system/notice';
  import SideCatalog from '@/components/VueSideCatalog';

  export default {
    name: "articleDetail",
    data() {
      return {
        descFlag: false,
        tableName: 'blog_article',
        catalogProps: {
          // 内容容器selector(必需)
          container: '.ck-content',
          watch: true,
          levelList: ["h2", "h3"],
        },
        tagOptions: [],
        articleId: '',
        sameBlogList: [],
        article: {},
        // 文章秘钥对话框数据
        dialogArticle: {
          visible: false,
          passwordForm: {
            password: ''
          },
          passwordFormRules: {
            password: [
              {
                required: true,
                message: '请输入密码',
                trigger: 'blur'
              },
              {
                min: 6,
                max: 12,
                message:
                  '密码长度必须介于 6 和 12 之间',
                trigger: 'blur'
              }
            ]
          }
        },

        dialogPictureVisible: false,
        dialogImageUrl: ''
      }
    },
    computed: {},
    components: {
      SideCatalog
    },
    watch: {
      $route(to, from) {
        location.reload()
      }
    },
    mounted() {
    },
    created() {
      this.articleId = this.$route.params && this.$route.params.articleId;
      this.initInfo();

    },
    methods: {
      initInfo() {


        getNotice(this.articleId).then(response => {
          this.article = response.data;
          const passwordFlag = this.getCookies(`article_password${this.article.articleId}`);
          this.getOtherData();
          if (passwordFlag === 'true') {
            this.dialogArticle.visible = false;
          } else if (this.article.openPassword == 1) {
            this.dialogArticle.visible = true;
          }
        });
      },
      getOtherData() {
        getSameArticleList(this.articleId).then(response => {
          this.sameBlogList = response.data;
        });
      },
      handleSubmitBtnClick(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            checkPassword({
              password: this.dialogArticle.passwordForm.password,
              articleId: this.articleId
            }).then(res => {
              if (res.code === 200) {
                this.resetForm(formName);//  清空表单
                this.dialogArticle.visible = false;
                this.setCookies(`article_password${this.articleId}`, true);
              } else {
                this.$modal.msgError(res.msg)
              }
            });
          } else {
            return false
          }
        })
      },
      handleCloseBtnClick() {
        this.dialogArticle.visible = false
        this.$router.push({path: '/article', query: {}})
      },
      preViewArticleImage(e){
        const clickType = e.target.localName;
        if (clickType  == 'img'){
          this.previewPicture(e.target.currentSrc);
          //this.dialogPictureVisible = true
          //this.dialogImageUrl = e.target.currentSrc;
        }
      }
    }
  };
</script>

<style lang="less">

  .article-container {
    width: 1280px;
    margin: 0 auto;
  }

  .emoji-panel-wrap {
    box-sizing: border-box;
    border: 1px solid #cccccc;
    border-radius: 5px;
    background-color: #ffffff;
    width: 470px;
    height: 190px;
    position: absolute;
    z-index: 999;
    top: 10px;
  }

  .emoji-size-small {
    zoom: 0.3;
    margin: 5px;
    vertical-align: middle;
  }

  .emoji-size-large {
    zoom: 0.5;
    margin: 5px;
  }

  .iconfont {
    font-size: 14px;
    margin-right: 3px;
  }

  .message_infos {
    width: 96%;
    margin-left: 10px;
  }

  .noComment {
    width: 100%;
    text-align: center;
  }

  .catalog {
    position: fixed;
    margin-left: 20px;
    max-height: 400px;
    overflow: auto;
    /*border:1px solid #0f74ff*/
  }


  .line-style {
    display: inline-block;
    height: 20px;
    width: 3px;
    background: transparent;
  }

  .line-style--active {
    background: currentColor;
  }


  .infosbox {
    float: left;
    width: 80%;
    overflow: hidden;
    background: #FFF;
  }

  .newsview {
    padding: 0 30px;
    background-image: -webkit-gradient(linear, left top, right top, color-stop(3%, rgba(50, 0, 0, 0.05)), color-stop(3%, rgba(0, 0, 0, 0))), -webkit-gradient(linear, left bottom, left top, color-stop(3%, rgba(50, 0, 0, 0.05)), color-stop(3%, rgba(0, 0, 0, 0)));
    background-image: linear-gradient(90deg, rgba(50, 0, 0, 0.05) 3%, rgba(0, 0, 0, 0) 3%), linear-gradient(360deg, rgba(50, 0, 0, 0.05) 3%, rgba(0, 0, 0, 0) 3%);
    background-size: 20px 20px;
    background-position: center center;
  }

  .intitle {
    line-height: 40px;
    height: 40px;
    font-size: 14px;;
    border-bottom: #000 2px solid;
  }

  .intitle a {
    font-weight: normal;
  }

  .news_title {
    font-weight: normal;
    padding: 30px 0 0 0;
    color: #333;
    font-size: 1.8em;
  }

  .news_author {
    width: 100%;
    color: #999;
    line-height: 18px;
  }

  .news_author span {
    margin-right: 10px;
    padding-left: 20px
  }

  .au03 b {
    color: #333;
    padding: 0 5px
  }

  .au04 {
    font-weight: normal;
  }

  .tip {
    padding: 10px;
    margin: 20px auto 15px;
    background-color: #ecf8ff;
    border-radius: 4px;
    border-left: 5px solid #50bfff;
    color: #888;
  }

  .news_about strong {
    color: #38485A;
    font-weight: 400 !important;
    font-size: 13px;
    padding-right: 8px;
  }

  .news_content {
    line-height: 24px;
    font-size: 14px;
  }

  .news_content p {
    overflow: hidden;
    padding-bottom: 4px;
    padding-top: 6px;
    word-wrap: break-word;
  }

  .tags {
    margin: 30px 0;
  }

  .news_con {
    line-height: 1.8;
    font-size: 16px;
    text-align: justify;
  }

  .news_con p {
    margin-bottom: 25px
  }

  .news_con img {
    max-width: 750px;
    height: auto;
  }

  .share {
    padding: 20px;
  }

  .nextinfo {
    line-height: 24px;
    width: 100%;
    background: #FFF;
    border-radius: 10px;
    overflow: hidden;
    margin: 20px 0
  }

  .nextinfo p {
    padding: 4px 10px;
    border-radius: 5px;
  }

  .nextinfo a:hover {
    color: #000;
    text-decoration: underline
  }

  .iconfont {
    font-size: 15px;
    margin-right: 2px;
  }

  .bloginfo {
    overflow: hidden;
    margin-top: 30px
  }

  .bloginfo ul li {
    float: left;
    font-size: 13px;
    padding: 0 20px 0 0;
    margin: 0 15px 0 0;
    color: #748594;
    line-height: 1.5;
    display: inline-block;
  }

  .bloginfo ul li a {
    color: #748594;
  }

  .bloginfo ul li a:hover {
    color: #000
  }

  .otherlink, .xzsm, .ffsm {
    width: 100%;
    background: #FFF;
    border-radius: 10px;
    overflow: hidden;
    margin: 20px 0
  }

  .otherlink h2 {
    border-bottom: #000 2px solid;
    line-height: 40px;
    font-size: 14px;
    background: url(../../assets/img/blog/5794.png) left 10px center no-repeat;
    padding-left: 40px;
    color: #000
  }

  .otherlink ul {
    margin: 10px 0
  }

  .otherlink li {
    line-height: 24px;
    height: 24px;
    display: block;
    width: 290px;
    float: left;
    overflow: hidden;
    margin-right: 30px;
    padding-left: 10px;
  }

  .otherlink li a:hover {
    text-decoration: underline;
    color: #000
  }


  @media only screen and (max-width: 479px) {
    .article-container {
      width: 96%;
    }

    .language-xshe {
      max-width: 100%;
    }

    .newsview {
      padding: 0 1px;
    }

    .newsview {
      padding: 0 30px;
    }

    .newsview {
      background-image: linear-gradient(
        90deg, rgba(50, 0, 0, .05) 3%, transparent 0), linear-gradient(
        1turn, rgba(50, 0, 0, .05) 3%, transparent 0);
      background-size: 20px 20px;
      background-position: 50%;
    }

    .newsview {
      min-height: 400px;
    }

    div {
      display: block;
    }

    .news_con {
      line-height: 1.2;
      font-size: 14px;
      text-align: justify;
    }

    .news_con p {
      margin-bottom: 25px
    }

    .news_con img {
      vertical-align: middle;
      width: 270px;
      text-align: center;
      border: 1px solid #eee;
    }
  }
</style>
