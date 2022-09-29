<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="课程" prop="courseId">
        <el-select v-model="queryParams.courseId"  @change="getList()" placeholder="请选择课程" clearable>
          <el-option v-for="item in courseOptions" :key="item.id" :label="item.name" :value="item.id"
            :disabled="item.status == 1"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="状态" clearable>
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['basic:catalog:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-sort"
          size="mini"
          @click="toggleExpandAll"
        >展开/折叠</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>


    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="catalogList"
      row-key="id"
      :default-expand-all="isExpandAll"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" label="名称" width="260"></el-table-column>
      <el-table-column prop="weigh" label="排序" width="200"></el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['basic:catalog:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['basic:catalog:add']"
          >新增</el-button>
          <el-button
             size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['basic:catalog:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改目录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">

        <el-row>
          <el-col :span="24" >
            <el-form-item label="课程" prop="courseId">
              <el-select v-model="form.courseId"  @change="getCatalogList()"  placeholder="请选择课程" clearable style="width: 100%;">
                <el-option v-for="item in courseOptions" :key="item.id" :label="item.name" :value="item.id"
                  :disabled="item.status == 1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24" >
            <el-form-item label="上级目录" prop="pid">
              <treeselect v-model="form.pid" :options="catalogOptions" :normalizer="normalizer" placeholder="选择上级目录" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入目录名称" />
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="weigh">
              <el-input-number v-model="form.weigh" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listCatalog, getCatalog, delCatalog, addCatalog, updateCatalog, listCatalogExcludeChild } from "@/api/basic/catalog";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Catalog",
  dicts: ['sys_normal_disable'],
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      catalogList: [],
      // 目录树选项
      catalogOptions: [],
      //课程选项
      courseOptions:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        courseId: null,
        status: null
      },
      // 查询参数
      catalogParams: {
        courseId: null,
        id: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        courseId: [
          { required: true, message: "课程不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "目录名称不能为空", trigger: "blur" }
        ],
        weigh: [
          { required: true, message: "显示排序不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询目录列表 */
    getList() {
      this.loading = true;
      listCatalog(this.queryParams).then(response => {
        this.courseOptions = response.courses;
        this.catalogList = this.handleTree(response.rows, "id","pid");
        this.loading = false;

      });
    },
    /** 转换目录数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      };
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        courseId: null,
        pid: null,
        name: null,
        weigh: 0,
        status: "0"
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      if (row != undefined) {
        this.form.pid = row.id;
        this.form.courseId = this.queryParams.courseId;
      }
      this.open = true;
      this.title = "新增目录";
      this.catalogParams.courseId = this.queryParams.courseId;
      this.catalogParams.id = 0 ;
      listCatalog(this.queryParams).then(response => {
        this.catalogOptions = this.handleTree(response.rows, "id","pid");
      });
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      getCatalog(row.id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改目录";
        if ( this.form.pid == 0 ){
          this.form.pid = null;
        }
      });
      this.catalogParams.courseId = this.queryParams.courseId;
      this.catalogParams.id = row.id;

      listCatalogExcludeChild(this.catalogParams).then(response => {
        this.catalogOptions = this.handleTree(response.rows, "id","pid");
      });
    },

    /** 查询目录列表 */
    getCatalogList() {
      this.loading = true;
      this.catalogParams.courseId = this.form.courseId;

      listCatalogExcludeChild(this.catalogParams).then(response => {
        this.catalogOptions = this.handleTree(response.rows, "id","pid");
        this.loading = false;
      });
    },

    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if  ((this.form.courseId == null ) ||  (this.form.courseId == 0 )) {
                  this.$modal.msgError("课程不能为空");
                  return;
          }
          if (this.form.id != null) {
            updateCatalog(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCatalog(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal.confirm('是否确认删除名称为"' + row.name + '"的数据项？').then(function() {
        return delCatalog(row.id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    }
  }
};
</script>

<style>
  .vue-treeselect {
    height: 22px;
    width: 100% ;
    vertical-align: middle;
  }

</style>
