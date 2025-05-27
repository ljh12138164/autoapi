// 成功响应
const success = (res, data = null, message = '操作成功', code = 200) => {
    res.status(code).json({
        code,
        message,
        data
    });
}
// 失败响应
const error = (res, message = "操作失败", code = 500, error = null) => {
    const result = { code, message };
    if (process.env.NODE_ENV !== 'production' && error) {
        result.error = error.message || error;
    }
    res.status(code).json(result);
}
// 参数验证错误
const validationError = (res, errors) => {
  error(res, '参数验证失败', 400, errors);
};

// 权限不足错误
const forbidden = (res, message = '权限不足') => {
  error(res, message, 403);
};

// 资源不存在错误
const notFound = (res, message = '资源不存在') => {
  error(res, message, 404);
};