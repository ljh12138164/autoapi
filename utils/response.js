// 成功响应
/**
 * @param {Object} res 响应对象
 * @param {Object} data 响应数据
 * @param {String} message 响应信息
 * @param {Number} code 响应状态码
 */
export const success = (res, data = null, message = '操作成功', code = 200) => {
  return res.status(code).json({
    code,
    message,
    data
  });
}
// 失败响应
/**
 * @param {Object} res 响应对象
 * @param {String} message 响应信息
 * @param {Number} code 响应状态码
 * @param {Object} error 错误对象
 */
export const error = (res, message = "操作失败", code = 500, error = null) => {
  const result = { code, message };
  if (process.env.NODE_ENV !== 'production' && error) {
    result.error = error.message || error;
  }
  return res.status(code).json(result);
}
// 参数验证错误
export const validationError = (res, errors) => {
  return error(res, '参数验证失败', 400, errors);
};

// 权限不足错误
export const forbidden = (res, message = '权限不足') => {
  return error(res, message, 403);
};

// 资源不存在错误
export const notFound = (res, message = '资源不存在') => {
  return error(res, message, 404);
};