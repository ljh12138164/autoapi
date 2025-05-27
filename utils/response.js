const success = (res, data = [], message = '操作成功', code = 200) => {
    res.status(code).json({
        code,
        message,
        data
    });
}
const error = (res, message = "操作失败", code = 500, error = null) => {
    const result = { code, message };
    if (process.env.NODE_ENV !== 'production' && error) {
        result.error = error.message || error;
    }
    res.status(code).json(result);
}