<!-- 招标记录管理 -->
<template>
  <div class="app-container">
    <el-row>
      <!-- 招标记录列表 -->
      <el-col>
        <!-- 搜索区域 -->
        <div class="filter-section">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="auto">
            <el-form-item label="招标项目" prop="keywords">
              <el-input
                v-model="queryParams.keywords"
                placeholder="请输入招标标题/编码"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="供应商名称" prop="name">
              <el-input
                v-model="queryParams.name"
                placeholder="请输入供应商名称"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>

            <el-form-item class="search-buttons">
              <el-button type="primary" icon="search" @click="handleQuery">搜索</el-button>
              <el-button icon="refresh" @click="handleResetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-card shadow="hover" class="table-section">
          <el-table
            v-loading="loading"
            :data="userList"
            border
            stripe
            highlight-current-row
            class="table-section__content"
            row-key="id"
          >
            <el-table-column label="招标编码" prop="tender_sn" />
            <el-table-column label="招标标题" prop="tender_title" />
            <el-table-column label="供应商名称" prop="supplier_name" />
            <el-table-column label="出价" prop="price" />
            <el-table-column label="出价时间" align="center" prop="create_time" width="180" />
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
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { type FormInstance } from "element-plus";
import type { BiddingLogQueryParams, biddingLogItem } from "@/types/api";
import BiddingAPI from "@/api/system/bidding";

defineOptions({
  name: "BiddingLog",
  inheritAttrs: false,
});

// 表单引用
const queryFormRef = ref<FormInstance>();

// 查询参数
const queryParams = reactive<BiddingLogQueryParams>({
  pageNum: 1,
  pageSize: 10,
});

// 列表数据
const userList = ref<biddingLogItem[]>([]);
const total = ref(0);
const loading = ref(false);

/**
 * 加载招标记录列表数据
 */
async function fetchList(): Promise<void> {
  loading.value = true;
  try {
    const data = await BiddingAPI.getBiddingLogPage(queryParams);
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

onMounted(() => {
  handleQuery();
});
</script>

<style scoped lang="scss"></style>
