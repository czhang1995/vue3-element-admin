<!-- 招标商品管理 -->
<template>
  <div class="app-container">
    <el-row>
      <!-- 招标商品列表 -->
      <el-col>
        <!-- 搜索区域 -->
        <div class="filter-section">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="auto">
            <el-form-item label="关键字" prop="keywords">
              <el-input
                v-model="queryParams.keywords"
                placeholder="请输入标题/唯一编码"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>

            <el-form-item label="状态" prop="status">
              <el-select
                v-model="queryParams.status"
                placeholder="全部"
                clearable
                style="width: 100px"
              >
                <el-option label="正常" :value="1" />
                <el-option label="禁用" :value="2" />
              </el-select>
            </el-form-item>

            <el-form-item label="类型" prop="type">
              <el-select
                v-model="queryParams.type"
                placeholder="全部"
                clearable
                style="width: 100px"
              >
                <el-option label="未开始" :value="1" />
                <el-option label="已开始" :value="2" />
                <el-option label="已结束" :value="3" />
              </el-select>
            </el-form-item>

            <el-form-item class="search-buttons">
              <el-button type="primary" icon="search" @click="handleQuery">搜索</el-button>
              <el-button icon="refresh" @click="handleResetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-card shadow="hover" class="table-section">
          <div class="table-section__toolbar">
            <div class="table-section__toolbar--actions">
              <el-button type="success" icon="plus" @click="handleCreateClick">新增</el-button>
            </div>
          </div>

          <el-table
            v-loading="loading"
            :data="userList"
            border
            stripe
            highlight-current-row
            class="table-section__content"
            row-key="id"
          >
            <el-table-column label="唯一编码" prop="sn" />
            <el-table-column label="标题" prop="title" />
            <el-table-column label="状态" align="center" prop="isUse" width="80">
              <template #default="scope">
                <el-tag
                  :type="Number(scope.row.isUse) === CommonStatus.ENABLED ? 'success' : 'info'"
                >
                  {{ Number(scope.row.isUse) === CommonStatus.ENABLED ? "正常" : "禁用" }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="类型" align="center" prop="type" width="100">
              <template #default="scope">
                <el-tag
                  :type="
                    Number(scope.row.type) === 1
                      ? 'info'
                      : Number(scope.row.type) === 2
                        ? 'success'
                        : 'danger'
                  "
                >
                  {{
                    Number(scope.row.type) === 1
                      ? "未开始"
                      : Number(scope.row.type) === 2
                        ? "已开始"
                        : "已结束"
                  }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="竞标人数" align="center" prop="num" width="100" />
            <el-table-column label="开始时间" align="center" prop="begin_time" width="180" />
            <el-table-column label="结束时间" align="center" prop="end_time" width="180" />
            <el-table-column label="创建时间" align="center" prop="create_time" width="180" />
            <el-table-column label="操作" fixed="right" width="140">
              <template #default="scope">
                <el-button
                  type="primary"
                  icon="edit"
                  link
                  size="small"
                  @click="handleEditClick(scope.row.sn, Number(scope.row.isUse))"
                >
                  {{ Number(scope.row.isUse) === CommonStatus.ENABLED ? "停用" : "启用" }}
                </el-button>
                <el-button
                  type="danger"
                  icon="delete"
                  link
                  size="small"
                  @click="handleDelete(scope.row.sn)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-if="total > 0"
            v-model:total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="fetchList"
          />
        </el-card>
      </el-col>
    </el-row>

    <!-- 表单 -->
    <el-drawer
      v-model="dialogState.visible"
      :title="dialogState.title"
      append-to-body
      :size="drawerSize"
      @close="closeDialog"
    >
      <el-form ref="userFormRef" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入招标商品标题" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="formData.description" placeholder="请输入招标商品描述" />
        </el-form-item>
        <el-form-item label="开始时间" prop="time">
          <el-date-picker
            v-model="formData.time"
            type="datetime"
            placeholder="请选择开始时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="formData.endTime"
            type="datetime"
            placeholder="请选择结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="formData.status"
            inline-prompt
            active-text="正常"
            inactive-text="禁用"
            :active-value="CommonStatus.ENABLED"
            :inactive-value="CommonStatus.DISABLED"
            :disabled="true"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" :loading="saveLoading" @click="handleSubmit">确 定</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from "element-plus";
import type { BiddingGoodsForm, BiddingGoodsQueryParams, BiddingGoodsItem } from "@/types/api";
import BiddingAPI from "@/api/system/bidding";
import { useAppStore } from "@/store";
import { DeviceEnum, DialogMode, CommonStatus } from "@/enums";

defineOptions({
  name: "Bidding",
  inheritAttrs: false,
});

const appStore = useAppStore();

// 表单引用
const queryFormRef = ref<FormInstance>();
const userFormRef = ref<FormInstance>();

// 查询参数
const queryParams = reactive<BiddingGoodsQueryParams>({
  pageNum: 1,
  pageSize: 10,
});

// 列表数据
const userList = ref<BiddingGoodsItem[]>([]);
const total = ref(0);
const loading = ref(false);
const saveLoading = ref(false);

// 弹窗状态
const dialogState = reactive({
  visible: false,
  title: "新增招标商品",
  mode: DialogMode.CREATE,
});

// 表单初始数据
const initialFormData: BiddingGoodsForm = {
  status: CommonStatus.ENABLED,
};

// 表单数据
const formData = reactive<BiddingGoodsForm>({ ...initialFormData });

// 下拉选项
// const deptOptions = ref<OptionItem[]>();
// const roleOptions = ref<OptionItem[]>();

const drawerSize = computed(() => (appStore.device === DeviceEnum.DESKTOP ? "600px" : "90%"));

const rules: FormRules = {
  title: [{ required: true, message: "请输入招标商品标题", trigger: "blur" }],
  description: [{ required: true, message: "请输入招标商品描述", trigger: "blur" }],
  time: [{ required: true, message: "请选择开始时间", trigger: "blur" }],
  endTime: [{ required: true, message: "请选择结束时间", trigger: "blur" }],
};

/**
 * 加载招标商品列表数据
 */
async function fetchList(): Promise<void> {
  loading.value = true;
  try {
    const data = await BiddingAPI.getPage(queryParams);
    userList.value = data.list;
    total.value = data.total ?? 0;
  } finally {
    loading.value = false;
  }
}

/**
 * 执行查询（重置页码）
 */
function handleQuery(): void {
  queryParams.pageNum = 1;
  fetchList();
}

/**
 * 重置查询条件
 */
function resetQuery(): void {
  queryFormRef.value?.resetFields();
}

/**
 * 重置查询条件并重新查询
 */
function handleResetQuery(): void {
  resetQuery();
  handleQuery();
}

/**
 * 删除招标商品
 * @param biddingGoodsIds 招标商品SN列表，多个SN用逗号分隔
 */
async function deleteBiddingGoods(biddingGoodsIds: string): Promise<void> {
  loading.value = true;
  await BiddingAPI.deleteByIds(biddingGoodsIds);
  ElMessage.success("删除成功");
  handleQuery();
}

/**
 * 打开表单弹窗
 */
function openDialog(): void {
  dialogState.visible = true;
}

/**
 * 关闭表单弹窗
 */
function closeDialog(): void {
  dialogState.visible = false;
  resetForm();
}

/**
 * 重置表单数据和验证状态
 */
function resetForm(): void {
  userFormRef.value?.resetFields();
  userFormRef.value?.clearValidate();
  Object.assign(formData, initialFormData);
}

/**
 * 新增按钮点击事件
 */
async function handleCreateClick(): Promise<void> {
  dialogState.title = "新增招标商品";
  dialogState.mode = DialogMode.CREATE;
  openDialog();
}

/**
 * 招标商品停用/启用按钮点击事件
 * @param id 招标商品ID
 */
async function handleEditClick(sn: string, isUse: number): Promise<void> {
  ElMessageBox.confirm(
    `确认${isUse === CommonStatus.ENABLED ? "停用" : "启用"}该招标商品吗？停用后将无法参与招标活动。且该招标活动将直接结束`,
    "警告",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  ).then(
    () => {
      loading.value = true;
      BiddingAPI.editBiddingGoods(sn).then(() => {
        ElMessage.success(`${isUse === CommonStatus.ENABLED ? "停用" : "启用"}成功`);
        handleQuery();
      });
    },
    () => {
      /* 用户取消 */
    }
  );
}

/**
 * 提交表单（防抖处理）
 */
const handleSubmit = useDebounceFn(async () => {
  const valid = await userFormRef.value?.validate().then(
    () => true,
    () => false
  );
  if (!valid) return;

  saveLoading.value = true;
  try {
    if (formData.id) {
      await BiddingAPI.updateBiddingGoods(formData.id, formData);
      ElMessage.success("修改招标商品成功");
    } else {
      await BiddingAPI.createBiddingGoods(formData);
      ElMessage.success("新增招标商品成功");
    }
    closeDialog();
    handleQuery();
  } finally {
    saveLoading.value = false;
  }
}, 300);

/**
 * 删除按钮点击事件
 * @param id 用户ID，不传则删除选中的用户
 */
function handleDelete(sn?: string): void {
  const biddingGoodsIds = sn;
  if (!biddingGoodsIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除选中的招标商品吗？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    () => deleteBiddingGoods(biddingGoodsIds),
    () => {
      /* 用户取消 */
    }
  );
}

onMounted(() => {
  handleQuery();
});
</script>

<style scoped lang="scss"></style>
