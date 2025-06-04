import db from './db.js';

/**
 * 数据库初始化脚本 - 仅为admin账号添加测试数据
 * 根据完整的数据库表结构创建测试数据
 */

// 表单模板测试数据
const formTemplatesData = [
    {
        name: '用户反馈模板',
        description: '收集用户反馈的通用模板',
        category: 'feedback',
        template_config: JSON.stringify({
            fields: [
                { type: 'input', label: '姓名', required: true },
                { type: 'email', label: '邮箱', required: true },
                { type: 'textarea', label: '反馈内容', required: true },
                { type: 'select', label: '满意度', options: ['非常满意', '满意', '一般', '不满意'] }
            ]
        }),
        preview_image: null,
        is_official: false,
        usage_count: 1,
        created_by: 1, // admin用户
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01')
    }
];

// 表单测试数据（admin创建的表单）
const formsData = [
    {
        user_id: 1, // admin用户ID
        title: '产品用户体验调研',
        description: '帮助我们了解您对产品的使用体验',
        form_config: JSON.stringify({
            fields: [
                { type: 'input', label: '您的职业', required: true },
                { type: 'number', label: '使用产品多长时间（月）', required: true },
                { type: 'textarea', label: '最喜欢的功能', required: false },
                { type: 'textarea', label: '希望改进的地方', required: false },
                { type: 'select', label: '推荐指数', options: ['1分', '2分', '3分', '4分', '5分'] }
            ]
        }),
        status: 'published',
        is_public: true,
        view_count: 15,
        submission_count: 3,
        settings: JSON.stringify({
            allowAnonymous: true,
            requireLogin: false,
            submitLimit: null,
            expireAt: null
        }),
        created_at: new Date('2024-01-05'),
        updated_at: new Date('2024-01-05'),
        published_at: new Date('2024-01-05')
    }
];

// 表单提交测试数据
const formSubmissionsData = [
    {
        form_id: 1,
        user_id: null, // 匿名提交
        submission_data: JSON.stringify({
            '您的职业': '软件工程师',
            '使用产品多长时间（月）': '6',
            '最喜欢的功能': '界面简洁，操作方便',
            '希望改进的地方': '希望增加更多模板',
            '推荐指数': '4分'
        }),
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        referrer: null,
        device_info: JSON.stringify({ platform: 'Windows', browser: 'Chrome' }),
        submitted_at: new Date('2024-01-20 10:30:00')
    },
    {
        form_id: 1,
        user_id: null,
        submission_data: JSON.stringify({
            '您的职业': '产品经理',
            '使用产品多长时间（月）': '3',
            '最喜欢的功能': '数据统计功能很实用',
            '希望改进的地方': '希望支持更多字段类型',
            '推荐指数': '5分'
        }),
        ip_address: '192.168.1.101',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        referrer: null,
        device_info: JSON.stringify({ platform: 'macOS', browser: 'Safari' }),
        submitted_at: new Date() // 今天的数据
    },
    {
        form_id: 1,
        user_id: null,
        submission_data: JSON.stringify({
            '您的职业': '设计师',
            '使用产品多长时间（月）': '2',
            '最喜欢的功能': '拖拽功能很棒',
            '希望改进的地方': '希望有更多设计模板',
            '推荐指数': '4分'
        }),
        ip_address: '192.168.1.102',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        referrer: null,
        device_info: JSON.stringify({ platform: 'Windows', browser: 'Edge' }),
        submitted_at: new Date() // 今天的数据
    }
];

// 用户活动测试数据
const userActivitiesData = [
    {
        user_id: 1, // admin用户
        activity_type: 'create_template',
        target_type: 'template',
        target_id: 1,
        description: '创建了模板「用户反馈模板」',
        metadata: JSON.stringify({ template_name: '用户反馈模板' }),
        ip_address: '192.168.1.50',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        created_at: new Date('2024-01-01 09:00:00')
    },
    {
        user_id: 1,
        activity_type: 'create_form',
        target_type: 'form',
        target_id: 1,
        description: '创建了表单「产品用户体验调研」',
        metadata: JSON.stringify({ form_title: '产品用户体验调研' }),
        ip_address: '192.168.1.50',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        created_at: new Date('2024-01-05 10:00:00')
    },
    {
        user_id: 1,
        activity_type: 'publish_form',
        target_type: 'form',
        target_id: 1,
        description: '发布了表单「产品用户体验调研」',
        metadata: JSON.stringify({ form_title: '产品用户体验调研' }),
        ip_address: '192.168.1.50',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        created_at: new Date('2024-01-05 10:05:00')
    }
];

// 表单分享测试数据
const formSharesData = [
    {
        form_id: 1,
        share_token: 'abc123def456ghi789',
        share_type: 'public',
        password: null,
        expire_at: null,
        access_count: 15,
        created_at: new Date('2024-01-05 10:10:00')
    }
];

/**
 * 初始化数据库数据
 */
export const initDatabase = async () => {
    try {
        console.log('🚀 开始为admin账号初始化测试数据...');

        // 检查admin用户是否存在
        const adminUser = await db('users').where('username', 'admin').first();
        if (!adminUser) {
            console.log('❌ 未找到admin用户，请先确保admin账号存在');
            return;
        }
        console.log('✅ 找到admin用户，ID:', adminUser.id);

        // 插入表单模板数据
        console.log('📋 插入表单模板数据...');
        await db('form_templates').insert(formTemplatesData);
        console.log('✅ 表单模板数据插入完成');

        // 插入表单数据
        console.log('📝 插入表单数据...');
        await db('forms').insert(formsData);
        console.log('✅ 表单数据插入完成');

        // 插入表单提交数据
        console.log('📊 插入表单提交数据...');
        await db('form_submissions').insert(formSubmissionsData);
        console.log('✅ 表单提交数据插入完成');

        // 插入用户活动数据
        console.log('📈 插入用户活动数据...');
        await db('user_activities').insert(userActivitiesData);
        console.log('✅ 用户活动数据插入完成');

        // 插入表单分享数据
        console.log('🔗 插入表单分享数据...');
        await db('form_shares').insert(formSharesData);
        console.log('✅ 表单分享数据插入完成');

        console.log('🎉 数据库初始化完成！');
        console.log('📈 数据统计：');
        console.log('   - 表单模板: 1个');
        console.log('   - 表单数量: 1个');
        console.log('   - 提交数量: 3条（包含今日数据）');
        console.log('   - 活动记录: 3条');
        console.log('   - 分享记录: 1条');
        console.log('   - 表单访问量: 15次');

    } catch (error) {
        console.error('❌ 数据库初始化失败:', error.message);
        throw error;
    }
};
initDatabase();