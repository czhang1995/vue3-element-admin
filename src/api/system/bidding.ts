import request from "@/utils/request";
import type {
  BiddingGoodsForm,
  BiddingGoodsQueryParams,
  BiddingGoodsItem,
  BiddingLogQueryParams,
  biddingLogItem,
} from "@/types/api";

const BIDDING_BASE_URL = "/api.php";

const BiddingAPI = {
  /**
   * 获取招标商品分页列表
   *
   * @param queryParams 查询参数
   */
  getPage(queryParams: BiddingGoodsQueryParams) {
    return request<any, PageResult<BiddingGoodsItem>>({
      url: `${BIDDING_BASE_URL}?getBiddingGoodsList`,
      method: "get",
      params: queryParams,
    });
  },

  /**
   * 获取招标记录分页列表
   *
   * @param queryParams 查询参数
   */
  getBiddingLogPage(queryParams: BiddingLogQueryParams) {
    return request<any, PageResult<biddingLogItem>>({
      url: `${BIDDING_BASE_URL}?getBiddingLogList`,
      method: "get",
      params: queryParams,
    });
  },

  /**
   * 添加招标商品
   *
   * @param data 招标商品表单数据
   */
  createBiddingGoods(data: BiddingGoodsForm) {
    return request({
      url: `${BIDDING_BASE_URL}?createBiddingGoods`,
      method: "post",
      data,
    });
  },

  /**
   * 修改招标商品(启用/停用)
   *
   * @param sn 招标商品sn
   */
  editBiddingGoods(sn: string) {
    return request({
      url: `${BIDDING_BASE_URL}?updateBiddingGoods`,
      method: "post",
      data: { sn },
    });
  },

  /**
   * 删除招标商品，多个以英文逗号(,)分割
   *
   * @param sn 招标商品ID字符串
   */
  deleteByIds(sn: string) {
    return request({
      url: `${BIDDING_BASE_URL}?deleteBiddingGoods`,
      method: "post",
      data: { sn },
    });
  },
};

export default BiddingAPI;
