// import db from './db.js';

// /**
//  * 数据库初始化脚本
//  * 功能：为各个表添加测试数据
//  * 注意：无权限系统，所有用户权限相同
//  */

// // 额外的测试用户数据（admin账号已存在）
// const additionalUsersData = [
//     {
//         username: 'testuser',
//         password: 'test123',
//         email: 'test@example.com',
//         created_at: new Date('2024-01-02'),
//         updated_at: new Date('2024-01-02')
//     },
//     {
//         username: 'designer',
//         password: 'design123',
//         email: 'designer@example.com',
//         created_at: new Date('2024-01-03'),
//         updated_at: new Date('2024-01-03')
//     }
// ];

// // 表单模板测试数据
// const formTemplatesData = [
//     {
//         name: '用户反馈表',
//         description: '收集用户对产品的反馈意见',
//         config: JSON.stringify({
//             fields: [
//                 { type: 'input', label: '姓名', required: true },
//                 { type: 'email', label: '邮箱', required: true },
//                 { type: 'textarea', label: '反馈内容', required: true },
//                 { type: 'select', label: '满意度', options: ['非常满意', '满意', '一般', '不满意'] }
//             ]
//         }),
//         category: 'feedback',
//         is_public: true,
//         created_at: new Date('2024-01-01'),
//         updated_at: new Date('2024-01-01')
//     },
//     {
//         name: '活动报名表',
//         description: '线上活动报名收集表单',
//         config: JSON.stringify({
//             fields: [
//                 { type: 'input', label: '真实姓名', required: true },
//                 { type: 'tel', label: '联系电话', required: true },
//                 { type: 'email', label: '邮箱地址', required: true },
//                 { type: 'radio', label: '参与方式', options: ['线上参与', '线下参与'] },
//                 { type: 'checkbox', label: '感兴趣的话题', options: ['技术分享', '产品介绍', '行业趋势', '经验交流'] }
//             ]
//         }),
//         category: 'event',
//         is_public: true,
//         created_at: new Date('2024-01-02'),
//         updated_at: new Date('2024-01-02')
//     },
//     {
//         name: '问卷调查模板',
//         description: '通用问卷调查模板',
//         config: JSON.stringify({
//             fields: [
//                 { type: 'input', label: '姓名', required: true },
//                 { type: 'number', label: '年龄', required: false },
//                 { type: 'radio', label: '性别', options: ['男', '女', '其他'] },
//                 { type: 'textarea', label: '意见建议', required: false }
//             ]
//         }),
//         category: 'survey',
//         is_public: true,
//         created_at: new Date('2024-01-03'),
//         updated_at: new Date('2024-01-03')
//     }
// ];

// // 表单测试数据（假设admin用户的ID是1）
// const formsData = [
//     {
//         title: '产品用户体验调研',
//         description: '帮助我们了解您对产品的使用体验',
//         config: JSON.stringify({
//             fields: [
//                 { type: 'input', label: '您的职业', required: true },
//                 { type: 'number', label: '使用产品多长时间（月）', required: true },
//                 { type: 'textarea', label: '最喜欢的功能', required: false },
//                 { type: 'textarea', label: '希望改进的地方', required: false },
//                 { type: 'select', label: '推荐指数', options: ['1分', '2分', '3分', '4分', '5分'] }
//             ]
//         }),
//         creator_id: 1, // admin用户
//         template_id: 1,
//         status: 'published',
//         settings: JSON.stringify({
//             allowAnonymous: true,
//             requireLogin: false,
//             submitLimit: null,
//             expireAt: null
//         }),
//         created_at: new Date('2024-01-05'),
//         updated_at: new Date('2024-01-05')
//     },
//     {
//         title: '技术大会报名表',
//         description: '2024年度技术大会报名，欢迎技术爱好者参与',
//         config: JSON.stringify({
//             fields: [
//                 { type: 'input', label: '姓名', required: true },
//                 { type: 'email', label: '邮箱', required: true },
//                 { type: 'tel', label: '手机号', required: true },
//                 { type: 'input', label: '公司/组织', required: false },
//                 { type: 'select', label: '技术方向', options: ['前端开发', '后端开发', '移动开发', '数据科学', '人工智能', '其他'] },
//                 { type: 'radio', label: '参会方式', options: ['线下参会', '线上观看'] },
//                 { type: 'checkbox', label: '感兴趣的议题', options: ['Vue3新特性', 'Node.js性能优化', '微服务架构', 'AI应用实践'] }
//             ]
//         }),
//         creator_id: 2, // testuser用户
//         template_id: 2,
//         status: 'published',
//         settings: JSON.stringify({
//             allowAnonymous: false,
//             requireLogin: true,
//             submitLimit: 1,
//             expireAt: '2024-12-31'
//         }),
//         created_at: new Date('2024-01-10'),
//         updated_at: new Date('2024-01-10')
//     },
//     {
//         title: '客户满意度调查',
//         description: '我们重视每一位客户的意见和建议',
//         config: JSON.stringify({
//             fields: [
//                 { type: 'select', label: '服务类型', options: ['技术支持', '产品咨询', '售后服务', '其他'] },
//                 { type: 'radio', label: '整体满意度', options: ['非常满意', '满意', '一般', '不满意', '非常不满意'] },
//                 { type: 'number', label: '推荐指数（1-10分）', required: true },
//                 { type: 'textarea', label: '建议和意见', required: false }
//             ]
//         }),
//         creator_id: 1, // admin用户
//         template_id: 3,
//         status: 'published',
//         settings: JSON.stringify({
//             allowAnonymous: true,
//             requireLogin: false,
//             submitLimit: null,
//             expireAt: null
//         }),
//         created_at: new Date('2024-01-15'),
//         updated_at: new Date('2024-01-15')
//     },
//     {
//         title: '新产品需求收集',
//         description: '收集用户对新产品功能的需求和建议',
//         config: JSON.stringify({
//             fields: [
//                 { type: 'input', label: '联系方式', required: true },
//                 { type: 'checkbox', label: '希望的功能', options: ['数据导出', '团队协作', '模板市场', '自定义主题', '移动端支持'] },
//                 { type: 'textarea', label: '详细需求描述', required: true },
//                 { type: 'select', label: '紧急程度', options: ['非常紧急', '比较紧急', '一般', '不紧急'] }
//             ]
//         }),
//         creator_id: 3, // designer用户
//         template_id: null,
//         status: 'draft',
//         settings: JSON.stringify({
//             allowAnonymous: false,
//             requireLogin: true,
//             submitLimit: null,
//             expireAt: null
//         }),
//         created_at: new Date('2024-01-18'),
//         updated_at: new Date('2024-01-18')
//     }
// ];

// // 表单提交测试数据
// const formSubmissionsData = [
//     // 产品用户体验调研的提交
//     {
//         form_id: 1,
//         data: JSON.stringify({
//             '您的职业': '软件工程师',
//             '使用产品多长时间（月）': '6',
//             '最喜欢的功能': '界面简洁，操作方便',
//             '希望改进的地方': '希望增加更多模板',
//             '推荐指数': '4分'
//         }),
//         submitter_ip: '192.168.1.100',
//         user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
//         created_at: new Date('2024-01-20 10:30:00')
//     },
//     {
//         form_id: 1,
//         data: JSON.stringify({
//             '您的职业': '产品经理',
//             '使用产品多长时间（月）': '3',
//             '最喜欢的功能': '数据统计功能很实用',
//             '希望改进的地方': '希望支持更多字段类型',
//             '推荐指数': '5分'
//         }),
//         submitter_ip: '192.168.1.101',
//         user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
//         created_at: new Date('2024-01-21 14:15:00')
//     },
//     // 技术大会报名表的提交
//     {
//         form_id: 2,
//         data: JSON.stringify({
//             '姓名': '张三',
//             '邮箱': 'zhangsan@example.com',
//             '手机号': '13800138000',
//             '公司/组织': '某科技公司',
//             '技术方向': '前端开发',
//             '参会方式': '线下参会',
//             '感兴趣的议题': ['Vue3新特性', 'Node.js性能优化']
//         }),
//         submitter_ip: '192.168.1.102',
//         user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
//         created_at: new Date('2024-01-22 09:45:00')
//     },
//     {
//         form_id: 2,
//         data: JSON.stringify({
//             '姓名': '李四',
//             '邮箱': 'lisi@example.com',
//             '手机号': '13900139000',
//             '公司/组织': '互联网公司',
//             '技术方向': '后端开发',
//             '参会方式': '线上观看',
//             '感兴趣的议题': ['微服务架构', 'AI应用实践']
//         }),
//         submitter_ip: '192.168.1.103',
//         user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
//         created_at: new Date('2024-01-23 16:20:00')
//     },
//     // 客户满意度调查的提交
//     {
//         form_id: 3,
//         data: JSON.stringify({
//             '服务类型': '技术支持',
//             '整体满意度': '满意',
//             '推荐指数（1-10分）': '8',
//             '建议和意见': '技术支持响应及时，解决问题效率高'
//         }),
//         submitter_ip: '192.168.1.104',
//         user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
//         created_at: new Date('2024-01-24 11:30:00')
//     },
//     // 今天的提交数据（用于测试今日统计）
//     {
//         form_id: 1,
//         data: JSON.stringify({
//             '您的职业': '设计师',
//             '使用产品多长时间（月）': '2',
//             '最喜欢的功能': '拖拽功能很棒',
//             '希望改进的地方': '希望有更多设计模板',
//             '推荐指数': '4分'
//         }),
//         submitter_ip: '192.168.1.105',
//         user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
//         created_at: new Date() // 今天的数据
//     },
//     {
//         form_id: 3,
//         data: JSON.stringify({
//             '服务类型': '产品咨询',
//             '整体满意度': '非常满意',
//             '推荐指数（1-10分）': '9',
//             '建议和意见': '产品功能丰富，使用体验很好'
//         }),
//         submitter_ip: '192.168.1.106',
//         user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
//         created_at: new Date() // 今天的数据
//     }
// ];

// // 用户活动测试数据
// const userActivitiesData = [
//     {
//         user_id: 1,
//         activity_type: 'create_form',
//         description: '创建了表单「产品用户体验调研」',
//         related_id: 1,
//         created_at: new Date('2024-01-05 10:00:00')
//     },
//     {
//         user_id: 1,
//         activity_type: 'publish_form',
//         description: '发布了表单「产品用户体验调研」',
//         related_id: 1,
//         created_at: new Date('2024-01-05 10:05:00')
//     },
//     {
//         user_id: 2,
//         activity_type: 'create_form',
//         description: '创建了表单「技术大会报名表」',
//         related_id: 2,
//         created_at: new Date('2024-01-10 15:30:00')
//     },
//     {
//         user_id: 2,
//         activity_type: 'publish_form',
//         description: '发布了表单「技术大会报名表」',
//         related_id: 2,
//         created_at: new Date('2024-01-10 15:35:00')
//     },
//     {
//         user_id: 1,
//         activity_type: 'create_form',
//         description: '创建了表单「客户满意度调查」',
//         related_id: 3,
//         created_at: new Date('2024-01-15 11:20:00')
//     },
//     {
//         user_id: 1,
//         activity_type: 'publish_form',
//         description: '发布了表单「客户满意度调查」',
//         related_id: 3,
//         created_at: new Date('2024-01-15 11:25:00')
//     },
//     {
//         user_id: 3,
//         activity_type: 'create_form',
//         description: '创建了表单「新产品需求收集」',
//         related_id: 4,
//         created_at: new Date('2024-01-18 14:10:00')
//     }
// ];

// // 表单分享测试数据
// const formSharesData = [
//     {
//         form_id: 1,
//         share_code: 'abc123def456',
//         share_url: 'https://form.example.com/share/abc123def456',
//         password: null,
//         expire_at: null,
//         max_submissions: null,
//         is_active: true,
//         created_at: new Date('2024-01-05 10:10:00')
//     },
//     {
//         form_id: 2,
//         share_code: 'xyz789uvw012',
//         share_url: 'https://form.example.com/share/xyz789uvw012',
//         password: '123456',
//         expire_at: new Date('2024-12-31'),
//         max_submissions: 100,
//         is_active: true,
//         created_at: new Date('2024-01-10 15:40:00')
//     },
//     {
//         form_id: 3,
//         share_code: 'mno345pqr678',
//         share_url: 'https://form.example.com/share/mno345pqr678',
//         password: null,
//         expire_at: null,
//         max_submissions: null,
//         is_active: true,
//         created_at: new Date('2024-01-15 11:30:00')
//     }
// ];

// /**
//  * 初始化数据库数据
//  */
// export const initDatabase = async () => {
//     try {
//         console.log('🚀 开始初始化数据库数据...');
//         console.log('📝 注意：admin账号已存在，跳过admin用户创建');

//         // 检查admin用户是否存在
//         const adminUser = await db('users').where('username', 'admin').first();
//         if (!adminUser) {
//             console.log('⚠️  警告：未找到admin用户，请确认admin账号已正确添加到users表中');
//             return;
//         }
//         console.log('✅ 确认admin用户存在，ID:', adminUser.id);

//         // 插入额外的测试用户
//         await db('users').insert(additionalUsersData);
//         console.log('✅ 额外测试用户数据插入完成');

//         // 插入表单模板数据
//         await db('form_templates').insert(formTemplatesData);
//         console.log('✅ 表单模板数据插入完成');

//         // 更新表单数据中的creator_id，确保使用正确的用户ID
//         const testUser = await db('users').where('username', 'testuser').first();
//         const designerUser = await db('users').where('username', 'designer').first();
        
//         // 更新表单数据中的用户ID
//         formsData[0].creator_id = adminUser.id;  // admin创建的表单
//         formsData[1].creator_id = testUser ? testUser.id : adminUser.id;  // testuser创建的表单
//         formsData[2].creator_id = adminUser.id;  // admin创建的表单
//         formsData[3].creator_id = designerUser ? designerUser.id : adminUser.id;  // designer创建的表单

//         // 插入表单数据
//         await db('forms').insert(formsData);
//         console.log('✅ 表单数据插入完成');

//         // 插入表单提交数据
//         await db('form_submissions').insert(formSubmissionsData);
//         console.log('✅ 表单提交数据插入完成');

//         // 更新用户活动数据中的用户ID
//         userActivitiesData.forEach(activity => {
//             if (activity.user_id === 1) activity.user_id = adminUser.id;
//             if (activity.user_id === 2) activity.user_id = testUser ? testUser.id : adminUser.id;
//             if (activity.user_id === 3) activity.user_id = designerUser ? designerUser.id : adminUser.id;
//         });

//         // 插入用户活动数据
//         await db('user_activities').insert(userActivitiesData);
//         console.log('✅ 用户活动数据插入完成');

//         // 插入表单分享数据
//         await db('form_shares').insert(formSharesData);
//         console.log('✅ 表单分享数据插入完成');

//         console.log('🎉 数据库初始化完成！');
//         console.log('\n📊 数据统计：');
//         console.log(`- 额外用户数量: ${additionalUsersData.length}`);
//         console.log(`- 表单模板数量: ${formTemplatesData.length}`);
//         console.log(`- 表单数量: ${formsData.length}`);
//         console.log(`- 表单提交数量: ${formSubmissionsData.length}`);
//         console.log(`- 用户活动数量: ${userActivitiesData.length}`);
//         console.log(`- 表单分享数量: ${formSharesData.length}`);
        
//         console.log('\n👤 可用测试账号：');
//         console.log('- 管理员: admin / 123456 (已存在)');
//         console.log('- 测试用户: testuser / test123');
//         console.log('- 设计师: designer / design123');

//         console.log('\n📋 测试表单：');
//         console.log('- 产品用户体验调研 (已发布，有提交数据)');
//         console.log('- 技术大会报名表 (已发布，有报名数据)');
//         console.log('- 客户满意度调查 (已发布，有反馈数据)');
//         console.log('- 新产品需求收集 (草稿状态)');

//     } catch (error) {
//         console.error('❌ 数据库初始化失败:', error);
//         throw error;
//     }
// };
// initDatabase();
// /**
//  * 如果直接运行此文件，则执行初始化
//  */
// if (import.meta.url === `file://${process.argv[1]}`) {
//     initDatabase()
//         .then(() => {
//             console.log('\n✨ 初始化完成，可以开始使用了！');
//             console.log('💡 提示：使用 admin / 123456 登录测试仪表盘功能');
//             process.exit(0);
//         })
//         .catch((error) => {
//             console.error('初始化失败:', error);
//             process.exit(1);
//         });
// }

// export default { initDatabase };