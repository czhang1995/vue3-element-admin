import Cookies from "js-cookie";
import JSEncrypt from "jsencrypt";
const TokenKey = "Admin-Token";

const encryptor = new JSEncrypt(); // 新建JSEncrypt对象
const publicKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDpaitnFf7ZkR4QRl/y1mMvM783
wQuA2kHuayTTGJVWe9gZYm4Sca/yimUozdPdHACrMtdmtbFgSKyhycE7kDATBkuh
lUp/DoLRhVMDdCr0cKe9F8O4ntt//MLZNL9hle/ntSY4hfzGQUaSExz9dpODR2Me
GV9jkKEgDf6CVACHVwIDAQAB`; // 把之前生成的贴进来，实际开发过程中，可以是后台传过来的
encryptor.setPublicKey(publicKey); // 设置公钥
export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token: any): string | false {
  const time = new Date().valueOf() + "@!" + JSON.stringify(token);
  const t = encryptor.encrypt(time);
  if (!t) {
    return false;
  }
  Cookies.set(TokenKey, t);
  return encryptor.encrypt(t);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}
