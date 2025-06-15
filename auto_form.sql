-- 设置时区
SET timezone = 'UTC';

-- 创建枚举类型
CREATE TYPE form_status AS ENUM ('draft', 'published', 'archived');

-- 用户表
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE users IS '用户表';
COMMENT ON COLUMN users.id IS '用户ID';
COMMENT ON COLUMN users.username IS '用户名';
COMMENT ON COLUMN users.email IS '邮箱';
COMMENT ON COLUMN users.password IS '密码';
COMMENT ON COLUMN users.created_at IS '创建时间';
COMMENT ON COLUMN users.updated_at IS '更新时间';

-- 表单表
CREATE TABLE forms (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  form_config JSONB,
  status form_status DEFAULT 'draft',
  is_public BOOLEAN DEFAULT TRUE,
  submission_count INTEGER DEFAULT 0,
  settings JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  
  CONSTRAINT forms_ibfk_1 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_forms_user_id ON forms(user_id);

COMMENT ON TABLE forms IS '表单表';
COMMENT ON COLUMN forms.id IS '表单ID';
COMMENT ON COLUMN forms.user_id IS '创建者用户ID';
COMMENT ON COLUMN forms.title IS '表单标题';
COMMENT ON COLUMN forms.description IS '表单描述';
COMMENT ON COLUMN forms.form_config IS '表单配置（JSON格式，存储拖拽设计器的配置）';
COMMENT ON COLUMN forms.status IS '表单状态';
COMMENT ON COLUMN forms.is_public IS '是否公开';
COMMENT ON COLUMN forms.submission_count IS '提交次数（冗余字段，提高查询性能）';
COMMENT ON COLUMN forms.settings IS '表单设置（提交限制、通知设置等）';
COMMENT ON COLUMN forms.created_at IS '创建时间';
COMMENT ON COLUMN forms.updated_at IS '更新时间';
COMMENT ON COLUMN forms.published_at IS '发布时间';

-- 表单模板表
CREATE TABLE form_templates (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  template_config JSONB NOT NULL,
  preview_image VARCHAR(500),
  usage_count INTEGER DEFAULT 0,
  created_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  config JSONB,
  
  CONSTRAINT form_templates_ibfk_1 FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_form_templates_created_by ON form_templates(created_by);

COMMENT ON TABLE form_templates IS '表单模板表';
COMMENT ON COLUMN form_templates.id IS '模板ID';
COMMENT ON COLUMN form_templates.title IS '模板名称';
COMMENT ON COLUMN form_templates.description IS '模板描述';
COMMENT ON COLUMN form_templates.category IS '模板分类';
COMMENT ON COLUMN form_templates.template_config IS '模板配置';
COMMENT ON COLUMN form_templates.preview_image IS '预览图片URL';
COMMENT ON COLUMN form_templates.usage_count IS '使用次数';
COMMENT ON COLUMN form_templates.created_by IS '创建者ID（官方模板可为空）';
COMMENT ON COLUMN form_templates.created_at IS '创建时间';
COMMENT ON COLUMN form_templates.updated_at IS '更新时间';

-- 表单提交表
CREATE TABLE form_submissions (
  id SERIAL PRIMARY KEY,
  form_id INTEGER NOT NULL,
  user_id INTEGER,
  submission_data JSONB NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT form_submissions_ibfk_1 FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE,
  CONSTRAINT form_submissions_ibfk_2 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_form_submissions_form_id ON form_submissions(form_id);
CREATE INDEX idx_form_submissions_user_id ON form_submissions(user_id);

COMMENT ON TABLE form_submissions IS '表单提交表';
COMMENT ON COLUMN form_submissions.id IS '提交ID';
COMMENT ON COLUMN form_submissions.form_id IS '表单ID';
COMMENT ON COLUMN form_submissions.user_id IS '提交者用户ID（可为空，支持匿名提交）';
COMMENT ON COLUMN form_submissions.submission_data IS '提交数据（JSON格式）';
COMMENT ON COLUMN form_submissions.submitted_at IS '提交时间';

-- 插入用户数据
INSERT INTO users (id, username, email, password, created_at, updated_at) VALUES 
(1, 'admin', '1464074871@qq.com', '123456', '2025-06-04 13:48:02', '2025-06-04 13:48:02'),
(9, 'test', 'test@qq.com', '123456', '2025-06-05 16:55:18', '2025-06-05 16:55:18');

-- 设置序列值
SELECT setval('users_id_seq', 10, true);

-- 插入表单数据
INSERT INTO forms (id, user_id, title, description, form_config, status, is_public, submission_count, settings, created_at, updated_at, published_at) VALUES 
(1, 1, '产品用户体验调研', '帮助我们了解您对产品的使用体验', '[{"id": "field_1749461071460_gqyvqf5lf", "type": "input", "field": "field_1", "label": "输入框", "props": {"placeholder": "请输入内容"}, "options": [], "required": false, "labelWidth": "", "placeholder": "请输入内容", "defaultValue": ""}, {"id": "field_1749461073004_gwmyvuau0", "type": "textarea", "field": "field_2", "label": "文本域", "props": {"rows": 3, "placeholder": "请输入多行文本"}, "options": [], "required": false, "labelWidth": "", "placeholder": "请输入多行文本", "defaultValue": ""}]', 'published', true, 3, '{"expireAt": null, "submitLimit": null, "requireLogin": false, "allowAnonymous": true}', '2024-01-05 08:00:00', '2025-06-09 17:24:58', '2024-01-05 08:00:00'),
(6, 9, '调研', '帮助我们了解您对产品的使用体验', '{"fields": [{"type": "input", "label": "您的职业", "required": true}, {"type": "number", "label": "使用产品多长时间（月）", "required": true}, {"type": "textarea", "label": "最喜欢的功能", "required": false}, {"type": "textarea", "label": "希望改进的地方", "required": false}, {"type": "select", "label": "推荐指数", "options": ["1分", "2分", "3分", "4分", "5分"]}]}', 'published', true, 3, '{"expireAt": null, "submitLimit": null, "requireLogin": false, "allowAnonymous": true}', '2024-01-05 08:00:00', '2025-06-05 16:57:17', '2024-01-05 08:00:00'),
(9, 1, '会员注册', '注册成为我们的会员，享受更多优惠和服务', '[{"id": "username", "type": "input", "label": "用户名", "required": true, "placeholder": "请输入用户名"}, {"id": "realName", "type": "input", "label": "真实姓名", "required": true, "placeholder": "请输入真实姓名"}, {"id": "phone", "type": "input", "label": "手机号码", "required": true, "placeholder": "请输入手机号码"}, {"id": "email", "type": "input", "label": "邮箱地址", "required": true, "placeholder": "请输入邮箱地址"}, {"id": "birthday", "type": "date", "label": "生日", "required": false, "placeholder": "请选择生日日期"}, {"id": "membershipType", "type": "radio", "label": "会员类型", "options": [{"label": "普通会员（免费）", "value": "basic"}, {"label": "银卡会员（99元/年）", "value": "silver"}, {"label": "金卡会员（199元/年）", "value": "gold"}, {"label": "钻石会员（399元/年）", "value": "diamond"}], "required": true}, {"id": "referralCode", "type": "input", "label": "推荐码", "required": false, "placeholder": "如有推荐码请输入"}, {"id": "agreement", "type": "checkbox", "label": "同意条款", "options": [{"label": "我已阅读并同意《会员服务协议》和《隐私政策》", "value": "agree"}], "required": true}]', 'draft', true, 0, NULL, '2025-06-08 01:56:59', '2025-06-09 15:55:08', NULL);

-- 设置序列值
SELECT setval('forms_id_seq', 34, true);

-- 插入表单模板数据
INSERT INTO form_templates (id, title, description, category, template_config, preview_image, usage_count, created_by, created_at, updated_at, config) VALUES 
(3, '联系我们', '有任何问题或建议，请随时联系我们', 'feedback', '[{"id": "name", "type": "input", "field": "name", "label": "姓名", "required": true, "placeholder": "请输入您的姓名"}, {"id": "phone", "type": "input", "field": "phone", "label": "联系电话", "required": true, "placeholder": "请输入手机号码"}, {"id": "email", "type": "input", "field": "email", "label": "邮箱地址", "required": false, "placeholder": "请输入邮箱地址"}, {"id": "subject", "type": "select", "field": "subject", "label": "咨询类型", "options": [{"label": "产品咨询", "value": "product"}, {"label": "技术支持", "value": "support"}, {"label": "商务合作", "value": "business"}, {"label": "投诉建议", "value": "complaint"}, {"label": "其他", "value": "other"}], "required": true}, {"id": "message", "rows": 5, "type": "textarea", "field": "message", "label": "留言内容", "required": true, "placeholder": "请详细描述您的问题或需求"}]', 'https://img.picui.cn/free/2025/06/09/68469567a0325.png', 1, 1, '2024-01-01 08:00:00', '2025-06-09 17:37:33', NULL),
(4, '简历投递', '请填写以下信息提交您的求职申请', 'feedback', '[{"id": "fullName", "type": "input", "field": "fullName", "label": "姓名", "required": true, "placeholder": "请输入真实姓名"}, {"id": "phone", "type": "input", "field": "phone", "label": "手机号码", "required": true, "placeholder": "请输入手机号码"}, {"id": "email", "type": "input", "field": "email", "label": "邮箱地址", "required": true, "placeholder": "请输入邮箱地址"}, {"id": "position", "type": "select", "field": "position", "label": "应聘职位", "options": [{"label": "前端开发工程师", "value": "frontend"}, {"label": "后端开发工程师", "value": "backend"}, {"label": "产品经理", "value": "pm"}, {"label": "UI设计师", "value": "ui"}, {"label": "运营专员", "value": "operation"}, {"label": "其他", "value": "other"}], "required": true}, {"id": "experience", "type": "radio", "field": "experience", "label": "工作经验", "options": [{"label": "应届毕业生", "value": "fresh"}, {"label": "1-3年", "value": "1-3"}, {"label": "3-5年", "value": "3-5"}, {"label": "5年以上", "value": "5+"}], "required": true}, {"id": "expectedSalary", "type": "input", "field": "expectedSalary", "label": "期望薪资", "required": false, "placeholder": "如：8K-12K"}, {"id": "resume", "type": "upload", "field": "resume", "label": "简历附件", "accept": ".pdf,.doc,.docx", "required": true}, {"id": "selfIntroduction", "rows": 4, "type": "textarea", "field": "selfIntroduction", "label": "自我介绍", "required": false, "placeholder": "请简单介绍一下自己"}]', 'https://img.picui.cn/free/2025/06/09/68469d47f2a3f.png', 3, 1, '2024-01-01 08:00:00', '2025-06-09 17:37:40', NULL),
(5, '预约服务', '请选择合适的时间预约我们的服务', 'feedback', '[{"id": "customerName", "type": "input", "field": "customerName", "label": "客户姓名", "required": true, "placeholder": "请输入您的姓名"}, {"id": "phone", "type": "input", "field": "phone", "label": "联系电话", "required": true, "placeholder": "请输入手机号码"}, {"id": "serviceType", "type": "select", "field": "serviceType", "label": "服务类型", "options": [{"label": "咨询服务", "value": "consultation"}, {"label": "技术支持", "value": "technical"}, {"label": "上门服务", "value": "onsite"}, {"label": "培训服务", "value": "training"}, {"label": "其他服务", "value": "other"}], "required": true}, {"id": "appointmentDate", "type": "date", "field": "appointmentDate", "label": "预约日期", "required": true}, {"id": "timeSlot", "type": "radio", "field": "timeSlot", "label": "时间段", "options": [{"label": "上午 9:00-12:00", "value": "morning"}, {"label": "下午 14:00-17:00", "value": "afternoon"}, {"label": "晚上 19:00-21:00", "value": "evening"}], "required": true}, {"id": "address", "rows": 2, "type": "textarea", "field": "address", "label": "服务地址", "required": false, "placeholder": "请输入详细地址（如需上门服务）"}, {"id": "requirements", "rows": 3, "type": "textarea", "field": "requirements", "label": "具体需求", "required": false, "placeholder": "请描述您的具体需求"}]', 'https://img.picui.cn/free/2025/06/09/684695e0d68cd.png', 1, 1, '2024-01-01 08:00:00', '2025-06-09 17:37:45', NULL),
(6, '问卷调查', '您的意见对我们很重要，请花几分钟完成此调查', 'feedback', '[{"id": "age", "type": "radio", "field": "age", "label": "年龄段", "options": [{"label": "18岁以下", "value": "under18"}, {"label": "18-25岁", "value": "18-25"}, {"label": "26-35岁", "value": "26-35"}, {"label": "36-45岁", "value": "36-45"}, {"label": "46岁以上", "value": "over46"}], "required": true}, {"id": "gender", "type": "radio", "field": "gender", "label": "性别", "options": [{"label": "男", "value": "male"}, {"label": "女", "value": "female"}, {"label": "不愿透露", "value": "prefer_not_to_say"}], "required": false}, {"id": "education", "type": "select", "field": "education", "label": "学历", "options": [{"label": "高中及以下", "value": "high_school"}, {"label": "大专", "value": "college"}, {"label": "本科", "value": "bachelor"}, {"label": "硕士", "value": "master"}, {"label": "博士", "value": "phd"}], "required": false}, {"id": "interests", "type": "checkbox", "field": "interests", "label": "兴趣爱好", "options": [{"label": "运动健身", "value": "sports"}, {"label": "音乐", "value": "music"}, {"label": "阅读", "value": "reading"}, {"label": "旅游", "value": "travel"}, {"label": "美食", "value": "food"}, {"label": "科技", "value": "technology"}, {"label": "艺术", "value": "art"}]}, {"id": "satisfaction", "max": 10, "min": 1, "type": "number", "field": "satisfaction", "label": "满意度评分（1-10分）", "required": true}, {"id": "feedback", "rows": 4, "type": "textarea", "field": "feedback", "label": "其他意见", "required": false, "placeholder": "请分享您的其他意见或建议"}]', 'https://img.picui.cn/free/2025/06/09/684696236b2ca.png', 1, 1, '2024-01-01 08:00:00', '2025-06-09 17:37:49', NULL),
(7, '会员注册', '注册成为我们的会员，享受更多优惠和服务', NULL, '[{"id": "username", "type": "input", "field": "username", "label": "用户名", "required": true, "placeholder": "请输入用户名"}, {"id": "realName", "type": "input", "field": "realName", "label": "真实姓名", "required": true, "placeholder": "请输入真实姓名"}, {"id": "phone", "type": "input", "field": "phone", "label": "手机号码", "required": true, "placeholder": "请输入手机号码"}, {"id": "email", "type": "input", "field": "email", "label": "邮箱地址", "required": true, "placeholder": "请输入邮箱地址"}, {"id": "birthday", "type": "date", "field": "birthday", "label": "生日", "required": false, "placeholder": "请选择生日日期"}, {"id": "membershipType", "type": "radio", "field": "membershipType", "label": "会员类型", "options": [{"label": "普通会员（免费）", "value": "basic"}, {"label": "银卡会员（99元/年）", "value": "silver"}, {"label": "金卡会员（199元/年）", "value": "gold"}, {"label": "钻石会员（399元/年）", "value": "diamond"}], "required": true}, {"id": "referralCode", "type": "input", "field": "referralCode", "label": "推荐码", "required": false, "placeholder": "如有推荐码请输入"}, {"id": "agreement", "type": "checkbox", "field": "agreement", "label": "同意条款", "options": [{"label": "我已阅读并同意《会员服务协议》和《隐私政策》", "value": "agree"}], "required": true}]', 'https://img.picui.cn/free/2025/06/09/68469511e649a.png', 8, NULL, '2025-06-09 14:09:16', '2025-06-09 23:09:05', NULL);

-- 设置序列值
SELECT setval('form_templates_id_seq', 8, true);

-- 插入表单提交数据
INSERT INTO form_submissions (id, form_id, user_id, submission_data, submitted_at) VALUES 
(16, 1, 1, '{"您的职业": "软件工程师", "推荐指数": "4分", "最喜欢的功能": "界面简洁，操作方便", "希望改进的地方": "希望增加更多模板", "使用产品多长时间（月）": "6"}', '2024-01-20 10:30:00'),
(26, 1, 1, '{"field_1": "1", "field_2": "1"}', '2025-06-09 17:25:08');

-- 设置序列值
SELECT setval('form_submissions_id_seq', 27, true);