/**
 * User 用户类型定义
 */

import type { BaseQueryParams } from "./common";

/** 招标商品分页查询参数 */
export interface BiddingGoodsQueryParams extends BaseQueryParams {
  /** 搜索关键字 */
  keywords?: string;
  /** 招标商品状态 */
  status?: number;
  /** 类型 */
  type?: number;
  /** 创建时间 */
  createTime?: [string, string];
}

/** 招标记录分页查询参数 */
export interface BiddingLogQueryParams extends BaseQueryParams {
  /** 搜索关键字 */
  keywords?: string;
  /** 供应商名称 */
  name?: string;
  /** 类型 */
  type?: number;
  /** 创建时间 */
  createTime?: [string, string];
}

/** 招标列表分页对象 */
export interface biddingLogItem {
  /** 招标商品ID */
  id: string;
  /** 招标商品头像地址 */
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

/** 招标商品分页对象 */
export interface BiddingGoodsItem {
  /** 招标商品ID */
  id: string;
  /** 招标商品头像地址 */
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

/** 招标商品表单对象 */
export interface BiddingGoodsForm {
  /** 招标商品ID */
  id?: string;
  /** 招标商品标题 */
  title?: string;
  /** 招标商品描述 */
  description?: string;
  /** 招标商品状态 */
  status?: number;
  /** 性别 */
  gender?: number;
  /** 手机号 */
  mobile?: string;
  /** 供应商昵称 */
  nickname?: string;
  time?: string;
  endTime?: string;
}
