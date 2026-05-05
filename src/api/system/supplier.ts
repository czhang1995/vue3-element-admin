import request from "@/utils/request";
import type { SupplierForm, SupplierQueryParams, SupplierItem } from "@/types/api";

const SUPPLIER_BASE_URL = "/api.php";

const SupplierAPI = {
  /**
   * 获取供应商分页列表
   *
   * @param queryParams 查询参数
   */
  getPage(queryParams: SupplierQueryParams) {
    return request<any, PageResult<SupplierItem>>({
      url: `${SUPPLIER_BASE_URL}?getSupplierList`,
      method: "get",
      params: queryParams,
    });
  },

  /**
   * 添加供应商
   *
   * @param data 供应商表单数据
   */
  create(data: SupplierForm) {
    return request({
      url: `${SUPPLIER_BASE_URL}?createSupplier`,
      method: "post",
      data,
    });
  },

  /**
   * 修改供应商(启用/停用)
   *
   * @param id 供应商ID
   */
  editSupplier(id: string) {
    return request({
      url: `${SUPPLIER_BASE_URL}?updateSupplier`,
      method: "post",
      data: { id: Number(id) },
    });
  },

  /**
   * 重置供应商密码
   *
   * @param id 供应商ID
   */
  resetPassword(id: string) {
    return request({
      url: `${SUPPLIER_BASE_URL}?resetSupplierPassword`,
      method: "post",
      data: { id },
    });
  },

  /**
   * 删除供应商，多个以英文逗号(,)分割
   *
   * @param ids 供应商ID字符串
   */
  deleteByIds(ids: string) {
    return request({
      url: `${SUPPLIER_BASE_URL}?deleteSupplier`,
      method: "post",
      data: { ids },
    });
  },
};

export default SupplierAPI;
