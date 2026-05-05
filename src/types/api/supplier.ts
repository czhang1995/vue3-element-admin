/**
 * User 用户类型定义
 */

import type { BaseQueryParams } from "./common";

/** 登录用户信息 */
export interface SupplierInfo {
  /** 用户ID */
  userId?: string;
  id?: string;
  /** 用户名 */
  username?: string;
  /** 用户昵称 */
  nickname?: string;
  /** 头像URL */
  avatar?: string;
  /** 租户切换权限（true 可切换租户） */
  canSwitchTenant?: boolean;
  /** 角色集合 */
  roles: string[];
  /** 权限集合 */
  perms: string[];
}

/** 供应商分页查询参数 */
export interface SupplierQueryParams extends BaseQueryParams {
  /** 搜索关键字 */
  keywords?: string;
  /** 供应商状态 */
  status?: number;
  /** 部门ID */
  deptId?: string;
  /** 创建时间 */
  createTime?: [string, string];
}

/** 供应商分页对象 */
export interface SupplierItem {
  /** 供应商ID */
  id: string;
  /** 供应商头像地址 */
  avatar?: string;
  /** 创建时间 */
  createTime?: Date;
  /** 部门名称 */
  deptName?: string;
  /** 供应商邮箱 */
  email?: string;
  /** 性别 */
  gender?: number;
  /** 手机号 */
  mobile?: string;
  /** 供应商昵称 */
  nickname?: string;
  /** 角色名称，多个使用英文逗号(,)分割 */
  roleNames?: string;
  /** 供应商状态(1:启用;0:禁用) */
  status?: number;
  /** 用户名 */
  username?: string;
  /** 供应商名称 */
  name?: string;
}

/** 供应商表单对象 */
export interface SupplierForm {
  /** 供应商ID */
  id?: string;
  /** 供应商账号 */
  account?: string;
  /** 供应商头像 */
  avatar?: string;
  /** 部门ID */
  deptId?: string;
  /** 供应商邮箱 */
  email?: string;
  /** 性别 */
  gender?: number;
  /** 手机号 */
  mobile?: string;
  /** 供应商昵称 */
  nickname?: string;
  /** 角色ID集合 */
  roleIds?: number[];
  /** 供应商状态(1:正常;0:禁用) */
  status?: number;
  /** 供应商名 */
  username?: string;
}
