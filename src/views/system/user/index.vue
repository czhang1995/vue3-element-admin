<!-- 用户管理 -->
<template>
  <div class="app-container">
    <el-row>
      <!-- 管理员列表 -->
      <el-col>
        <!-- 搜索区域 -->
        <div class="filter-section">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="auto">
            <el-form-item label="关键字" prop="keywords">
              <el-input
                v-model="queryParams.keywords"
                placeholder="管理员名称"
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
              <el-button
                type="danger"
                icon="delete"
                :disabled="!hasSelection"
                @click="handleDelete()"
              >
                删除
              </el-button>
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
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="用户名" prop="name" />
            <el-table-column label="状态" align="center" prop="isUse" width="80">
              <template #default="scope">
                <el-tag
                  :type="Number(scope.row.isUse) === CommonStatus.ENABLED ? 'success' : 'info'"
                >
                  {{ Number(scope.row.isUse) === CommonStatus.ENABLED ? "正常" : "禁用" }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="登录IP" align="center" prop="login_ip" width="180">
              <template #default="scope">
                <span v-if="scope.row.login_ip">{{ scope.row.login_ip }}</span>
                <span v-else style="color: #999">暂无登录记录</span>
              </template>
            </el-table-column>
            <el-table-column label="登录时间" align="center" prop="login_time" width="180">
              <template #default="scope">
                <span v-if="scope.row.login_time">{{ scope.row.login_time }}</span>
                <span v-else style="color: #999">暂无登录记录</span>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="create_time" width="180" />
            <el-table-column label="操作" fixed="right" width="160">
              <template #default="scope">
                <!-- <el-button
                  type="primary"
                  icon="RefreshLeft"
                  size="small"
                  link
                  @click="handleResetPassword(scope.row)"
                >
                  重置密码
                </el-button> -->
                <el-button
                  type="primary"
                  icon="edit"
                  link
                  size="small"
                  @click="handleEditClick(scope.row.id)"
                >
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  icon="delete"
                  link
                  size="small"
                  @click="handleDelete(scope.row.id)"
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

    <!-- 用户表单 -->
    <el-drawer
      v-model="dialogState.visible"
      :title="dialogState.title"
      append-to-body
      :size="drawerSize"
      @close="closeDialog"
    >
      <el-form ref="userFormRef" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="登录名" prop="username">
          <el-input
            v-model="formData.username"
            :readonly="!!formData.id"
            placeholder="请输入管理员登录名"
          />
          <div v-if="!formData.id" style=" font-size: 12px;color: red">
            新增的管理员密码默认跟用户名一样，修改密码可以管理员登录后自己去个人详情中操作。
          </div>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="formData.status"
            inline-prompt
            active-text="正常"
            inactive-text="禁用"
            :active-value="CommonStatus.ENABLED"
            :inactive-value="CommonStatus.DISABLED"
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
import type { UserForm, UserQueryParams, UserItem } from "@/types/api";
// import { downloadFile } from "@/utils";
import UserAPI from "@/api/system/user";
// import DeptAPI from "@/api/system/dept";
// import RoleAPI from "@/api/system/role";
import { useUserStore, useAppStore } from "@/store";
import { DeviceEnum, DialogMode, CommonStatus } from "@/enums";
import { useTableSelection } from "@/composables";
// import UserDeptTree from "./components/UserDeptTree.vue";
// import UserImportDialog from "./components/UserImportDialog.vue";

defineOptions({
  name: "User",
  inheritAttrs: false,
});

const appStore = useAppStore();
const userStore = useUserStore();

// 表单引用
const queryFormRef = ref<FormInstance>();
const userFormRef = ref<FormInstance>();

// 查询参数
const queryParams = reactive<UserQueryParams>({
  pageNum: 1,
  pageSize: 10,
});

// 列表数据
const userList = ref<UserItem[]>([]);
const total = ref(0);
const loading = ref(false);
const saveLoading = ref(false);

// 弹窗状态
const dialogState = reactive({
  visible: false,
  title: "新增管理员",
  mode: DialogMode.CREATE,
});

// 表单初始数据
const initialFormData: UserForm = {
  status: CommonStatus.ENABLED,
};

// 表单数据
const formData = reactive<UserForm>({ ...initialFormData });

// 下拉选项
// const deptOptions = ref<OptionItem[]>();
// const roleOptions = ref<OptionItem[]>();

const drawerSize = computed(() => (appStore.device === DeviceEnum.DESKTOP ? "600px" : "90%"));

const rules: FormRules = {
  username: [{ required: true, message: "请输入管理员登录名", trigger: "blur" }],
  // nickname: [{ required: true, message: "请输入用户昵称", trigger: "blur" }],
  // deptId: [{ required: true, message: "请选择所属部门", trigger: "change" }],
  // roleIds: [{ required: true, message: "请选择用户角色", trigger: "change" }],
  // email: [{ type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }],
  // mobile: [{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" }],
};

/**
 * 加载用户列表数据
 */
async function fetchList(): Promise<void> {
  loading.value = true;
  try {
    const data = await UserAPI.getPage(queryParams);
    userList.value = data.list;
    total.value = data.total ?? 0;
  } finally {
    loading.value = false;
  }
}

/**
 * 加载表单下拉选项数据
 */
// async function loadFormOptions(): Promise<void> {
//   [roleOptions.value, deptOptions.value] = await Promise.all([
//     RoleAPI.getOptions(),
//     DeptAPI.getOptions(),
//   ]);
// }

const { selectedIds, hasSelection, handleSelectionChange } = useTableSelection<UserItem>();

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
 * 重置用户密码
 * @param userId 用户ID
 * @param password 新密码
 */
// async function resetPassword(userId: string, password: string): Promise<void> {
//   await UserAPI.resetPassword(userId, password);
//   ElMessage.success("密码重置成功");
// }

/**
 * 删除用户
 * @param userIds 用户ID列表，多个ID用逗号分隔
 */
async function deleteUsers(userIds: string): Promise<void> {
  await UserAPI.deleteByIds(userIds);
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
 * 重置密码按钮点击事件
 * @param row 用户数据
 */
// function handleResetPassword(row: UserItem): void {
//   ElMessageBox.prompt(`请输入用户【${row.username}】的新密码`, "重置密码", {
//     confirmButtonText: "确定",
//     cancelButtonText: "取消",
//     inputPattern: /.{6,}/,
//     inputErrorMessage: "密码至少需要6位字符",
//   }).then(
//     (result: any) => resetPassword(row.id, result.value),
//     () => {
//       /* 用户取消 */
//     }
//   );
// }

/**
 * 新增按钮点击事件
 */
async function handleCreateClick(): Promise<void> {
  dialogState.title = "新增管理员";
  dialogState.mode = DialogMode.CREATE;
  // await loadFormOptions();
  openDialog();
}

/**
 * 编辑按钮点击事件
 * @param id 用户ID
 */
async function handleEditClick(id: string): Promise<void> {
  dialogState.title = "修改管理员";
  dialogState.mode = DialogMode.EDIT;
  // await loadFormOptions();
  const data = await UserAPI.getFormData(id);
  Object.assign(formData, data);
  openDialog();
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
      await UserAPI.update(formData.id, formData);
      ElMessage.success("修改管理员成功");
    } else {
      await UserAPI.create(formData);
      ElMessage.success("新增管理员成功");
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
function handleDelete(id?: string): void {
  const userIds = id ?? selectedIds.value.join(",");
  if (!userIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  // 安全检查：防止删除当前登录用户
  const currentUserId = userStore.userInfo?.userId;
  console.log("当前登录用户ID:", currentUserId, userStore.userInfo);
  if (currentUserId) {
    const isCurrentUserInList = id
      ? id === currentUserId
      : selectedIds.value.some((selectedId) => String(selectedId) === currentUserId);
    if (isCurrentUserInList) {
      ElMessage.error("不能删除当前登录用户");
      return;
    }
  }

  ElMessageBox.confirm("确认删除选中的用户吗？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(
    () => deleteUsers(userIds),
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
